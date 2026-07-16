import pg from "pg";

const url = "postgresql://neondb_owner:npg_PMJ2IXy5ouhE@ep-rapid-field-abi306o6-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require";
const client = new pg.Client({
  connectionString: url,
});

try {
  await client.connect();
  console.log("Connected successfully!");
  
  console.log("Adding pic_name column...");
  await client.query("ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS pic_name text NOT NULL DEFAULT '';");
  
  console.log("Adding pic_email column...");
  await client.query("ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS pic_email text NOT NULL DEFAULT '';");
  
  console.log("Adding apu_make_model column...");
  await client.query("ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS apu_make_model text NOT NULL DEFAULT '';");
  
  console.log("Columns added successfully!");
  
  // Verify columns exist now
  const info = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'aircraft' AND column_name IN ('pic_name', 'pic_email', 'apu_make_model');
  `);
  console.log("Verification of columns:", info.rows);
  
  await client.end();
} catch (err) {
  console.error("SQL operation failed:", err);
}
