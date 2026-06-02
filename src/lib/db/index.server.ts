import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// In serverless (Vercel/Lambda) each instance gets its own pool, so keep the
// per-instance connection count low and rely on a server-side pooler
// (e.g. Neon/Supabase PgBouncer) via DATABASE_URL. Override with DB_POOL_MAX.
const max = Number(process.env.DB_POOL_MAX ?? (process.env.VERCEL ? 1 : 10));

function missingDatabaseProxy<T extends object>() {
  return new Proxy({} as T, {
    get() {
      throw new Error("Database not configured");
    },
  });
}

function createDatabase() {
  const actualPool = new Pool({ connectionString: connectionString!, max });
  return {
    pool: actualPool,
    db: drizzle(actualPool, { schema }),
  };
}

const database = connectionString
  ? createDatabase()
  : {
      pool: missingDatabaseProxy<Pool>(),
      db: missingDatabaseProxy<ReturnType<typeof createDatabase>["db"]>(),
    };

export const { pool, db } = database;
export { schema };
