import "dotenv/config";
import { eq } from "drizzle-orm";

import { auth } from "../src/lib/auth";
import { db, pool, schema } from "../src/lib/db/index.server";

async function ensureAuthUser(email: string, password: string, name: string) {
  const existing = await pool.query<{ id: string }>('select id from "user" where email = $1', [
    email,
  ]);
  if (existing.rows[0]) {
    const userId = existing.rows[0].id;
    if (email === "admin@planeserve.aero") {
      await pool.query('delete from "session" where "userId" = $1', [userId]);
      await pool.query('delete from "account" where "userId" = $1', [userId]);
      await pool.query('delete from "user" where "id" = $1', [userId]);
    } else {
      return userId;
    }
  }

  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  });

  return result.user.id;
}

async function main() {
  const demoUserId = await ensureAuthUser(
    "demo@planeserve.aero",
    "planeserve-demo",
    "James Hartley",
  );
  const adminUserId = await ensureAuthUser("admin@planeserve.aero", "planeserve-admin", "Admin");

  await db
    .insert(schema.profiles)
    .values({
      userId: demoUserId,
      name: "James Hartley",
      company: "Hartley Aviation Ltd",
      email: "demo@planeserve.aero",
      phone: "+44 20 7946 0123",
      role: "Operator",
      isAdmin: false,
    })
    .onConflictDoUpdate({
      target: schema.profiles.userId,
      set: {
        name: "James Hartley",
        company: "Hartley Aviation Ltd",
        phone: "+44 20 7946 0123",
        role: "Operator",
      },
    });

  await db
    .insert(schema.profiles)
    .values({
      userId: adminUserId,
      name: "Admin",
      company: "PlaneServe",
      email: "admin@planeserve.aero",
      role: "Other",
      isAdmin: true,
    })
    .onConflictDoUpdate({
      target: schema.profiles.userId,
      set: {
        name: "Admin",
        company: "PlaneServe",
        role: "Other",
        isAdmin: true,
      },
    });

  // Reseeds recreate the auth user with a fresh id, orphaning old profile rows.
  // Drop any stale admin profiles and keep the better-auth flag in sync so the
  // admin account works immediately with no manual SQL.
  await pool.query('delete from profiles where lower(email) = $1 and user_id <> $2', [
    "admin@planeserve.aero",
    adminUserId,
  ]);
  await pool.query('update "user" set "isAdmin" = true where id = $1', [adminUserId]);

  const aircraftId = "a_demo";
  const subscriptionId = "sub_demo";
  await db
    .insert(schema.aircraft)
    .values({
      id: aircraftId,
      userId: demoUserId,
      registration: "G-HRTB",
      category: "Business Jet",
      makeModel: "Learjet 35A",
      serialNumber: "35A-401",
      yearOfManufacture: "1980",
      typeOfOperations: "Charter",
      ownerOperatorName: "Hartley Aviation Ltd",
      baseAirport: "EGKB Biggin Hill",
      verificationStatus: "Verified",
      engineManufacturer: "Garrett",
      engineType: "Garrett TFE731-2",
      plan: "monthly",
      subscriptionStatus: "Active",
    })
    .onConflictDoUpdate({
      target: schema.aircraft.id,
      set: {
        userId: demoUserId,
        registration: "G-HRTB",
        category: "Business Jet",
        makeModel: "Learjet 35A",
        serialNumber: "35A-401",
        yearOfManufacture: "1980",
        typeOfOperations: "Charter",
        ownerOperatorName: "Hartley Aviation Ltd",
        baseAirport: "EGKB Biggin Hill",
        verificationStatus: "Verified",
        engineManufacturer: "Garrett",
        engineType: "Garrett TFE731-2",
        plan: "monthly",
        subscriptionStatus: "Active",
      },
    });

  await db
    .insert(schema.subscriptions)
    .values({
      id: subscriptionId,
      userId: demoUserId,
      aircraftId,
      plan: "monthly",
      status: "Active",
      mockProviderRef: "mock_sub_demo",
    })
    .onConflictDoNothing();

  await db
    .insert(schema.invoices)
    .values({
      id: "inv_demo",
      userId: demoUserId,
      subscriptionId,
      amountCents: 10000,
      status: "Paid",
    })
    .onConflictDoNothing();

  const requestId = "AOG-DEMO01";
  await db
    .insert(schema.aogRequests)
    .values({
      id: requestId,
      userId: demoUserId,
      aircraftId,
      registration: "G-HRTB",
      location: "EGKB Biggin Hill",
      aircraftType: "Learjet 35A",
      ataChapter: "Hydraulic Power",
      affectedSystem: "Hydraulic pump assembly",
      partNumber: "2536832-2",
      issueDescription: "Main hydraulic pump leak, aircraft grounded for departure tomorrow.",
      urgency: "Aircraft grounded",
      contactName: "James Hartley",
      contactPhone: "+44 20 7946 0123",
      contactEmail: "demo@planeserve.aero",
      status: "Sourcing",
      exceptionStates: [],
    })
    .onConflictDoUpdate({
      target: schema.aogRequests.id,
      set: { status: "Sourcing" },
    });

  await db
    .insert(schema.aogRequestAttachments)
    .values({
      id: "att_demo",
      requestId,
      fileName: "hydraulic-pump-leak-photo.jpg",
    })
    .onConflictDoNothing();

  await db
    .insert(schema.aogStatusEvents)
    .values({
      id: "evt_demo",
      requestId,
      status: "Sourcing",
      note: "Demo request seeded",
      createdByUserId: adminUserId,
    })
    .onConflictDoNothing();

  const [count] = await db
    .select({ id: schema.profiles.userId })
    .from(schema.profiles)
    .where(eq(schema.profiles.userId, demoUserId));

  console.log(`Seeded PlaneServe demo data for ${count.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
