import "dotenv/config";
import { pool } from "../src/lib/db/index.server";

// Promote (or demote) a PlaneServe account to admin.
//
//   npm run db:admin -- user@example.com          → grant admin
//   npm run db:admin -- user@example.com --revoke → remove admin
//
// `profiles.is_admin` is the single source of truth the server guards enforce;
// we also keep the better-auth `user.isAdmin` column in sync so the two never
// drift. Works against whatever DATABASE_URL is set (local or Supabase/prod).

async function main() {
  const args = process.argv.slice(2);
  const email = args.find((a) => !a.startsWith("--"))?.toLowerCase();
  const grant = !args.includes("--revoke");

  if (!email) {
    console.error("Usage: npm run db:admin -- <email> [--revoke]");
    process.exit(1);
  }

  const userRes = await pool.query<{ id: string; name: string; email: string }>(
    'select id, name, email from "user" where lower(email) = $1',
    [email],
  );
  const user = userRes.rows[0];
  if (!user) {
    console.error(
      `No account found for ${email}. The user must sign up / log in once before being promoted.`,
    );
    process.exit(1);
  }

  // Ensure a single profile row exists for this user, then set the flag.
  await pool.query(
    `insert into profiles (user_id, name, email, company, phone, role, is_admin)
     values ($1, $2, $3, '', '', 'Operator', $4)
     on conflict (user_id) do update set is_admin = $4`,
    [user.id, user.name, user.email, grant],
  );

  // Clean up any orphaned duplicate profile rows for this email (stale user ids
  // left behind by earlier reseeds) so lookups stay unambiguous.
  await pool.query('delete from profiles where lower(email) = $1 and user_id <> $2', [
    email,
    user.id,
  ]);

  // Keep the better-auth field in sync (belt-and-braces; not the source of truth).
  await pool.query('update "user" set "isAdmin" = $2 where id = $1', [user.id, grant]);

  console.log(`${grant ? "Granted" : "Revoked"} admin for ${user.email} (${user.id}).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
