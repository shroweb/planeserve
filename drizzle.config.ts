import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Migrations need a real session, not a transaction pooler — prefer the
    // direct (non-pooled) connection when one is configured.
    url: (process.env.DIRECT_URL ?? process.env.DATABASE_URL)!,
  },
});
