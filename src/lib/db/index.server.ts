import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

// In serverless (Vercel/Lambda) each instance gets its own pool, so keep the
// per-instance connection count low and rely on a server-side pooler
// (e.g. Neon/Supabase PgBouncer) via DATABASE_URL. Override with DB_POOL_MAX.
const max = Number(process.env.DB_POOL_MAX ?? (process.env.VERCEL ? 1 : 10));

export const pool = new Pool({ connectionString, max });
export const db = drizzle(pool, { schema });
export { schema };
