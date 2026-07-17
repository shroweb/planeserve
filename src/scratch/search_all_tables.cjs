require('dotenv').config({ path: '.env.production.local' });
const { Client } = require('pg');

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  console.log('Connected to Neon PostgreSQL database.');

  const searchStr = 'sub_1Tu84ODlo7kseofIhJA0odWz';
  console.log(`Searching for string "${searchStr}" across all tables...`);

  // Get all tables and columns in public schema
  const tablesRes = await client.query(`
    SELECT table_name, column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND data_type IN ('character', 'character varying', 'text')
  `);

  for (const row of tablesRes.rows) {
    const { table_name, column_name } = row;
    try {
      const searchRes = await client.query(
        `SELECT COUNT(*) FROM "\${table_name}" WHERE "\${column_name}" = \$1`,
        [searchStr]
      );
      const count = parseInt(searchRes.rows[0].count, 10);
      if (count > 0) {
        console.log(`FOUND MATCH in table "${table_name}", column "${column_name}"! Count: \${count}`);
        const rowsRes = await client.query(
          `SELECT * FROM "\${table_name}" WHERE "\${column_name}" = \$1`,
          [searchStr]
        );
        console.log(rowsRes.rows);
      }
    } catch (e) {
      // Skip errors for unsupported system tables or query issues
    }
  }

  console.log('Search finished.');
  await client.end();
}

run().catch(async (e) => {
  console.error(e);
  await client.end();
});
