import "dotenv/config";

import { pool } from "../src/lib/db/index.server";

function ago(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function plusMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

const cases = [
  { id: "AOG-DEMO01", hoursAgo: 8, status: "Sourcing", ackMinutes: 9 },
  { id: "AOG-SEED01", hoursAgo: 3, status: "Acknowledged", ackMinutes: 7 },
  { id: "AOG-SEED02", hoursAgo: 12, status: "Options ready", ackMinutes: 8 },
  { id: "AOG-SEED04", hoursAgo: 26, status: "Sourcing", ackMinutes: 11 },
  { id: "AOG-SEED06", hoursAgo: 18, status: "Order placed", ackMinutes: 6 },
] as const;

async function main() {
  const admin = await pool.query<{ user_id: string }>(
    "select user_id from profiles where is_admin = true order by created_at asc limit 1",
  );
  const adminUserId = admin.rows[0]?.user_id ?? "system";

  await pool.query(
    `
      delete from aog_status_events
      where status = 'Acknowledged'
        and request_id = any($1)
        and id not like '%_ack_demo'
    `,
    [cases.map((item) => item.id)],
  );

  for (const item of cases) {
    const createdAt = ago(item.hoursAgo);
    await pool.query(
      `
        update aog_requests
        set created_at = $1,
            updated_at = $2,
            status = $3,
            handler_id = $4
        where id = $5
      `,
      [createdAt, new Date(), item.status, adminUserId, item.id],
    );

    await pool.query(
      `
        insert into aog_status_events (id, request_id, status, note, created_by_user_id, created_at)
        values ($1, $2, 'Acknowledged', 'Desk acknowledged case for demo timing.', $3, $4)
        on conflict (id) do update
        set created_at = excluded.created_at,
            created_by_user_id = excluded.created_by_user_id
      `,
      [`evt_${item.id}_ack_demo`, item.id, adminUserId, plusMinutes(createdAt, item.ackMinutes)],
    );
  }

  await pool.query(
    `
      update aog_requests
      set handler_id = ''
      where id = 'AOG-DEMO01'
    `,
  );

  console.log("Polished admin demo data: one SLA watch item, realistic first-response timings.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
