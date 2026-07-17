require('dotenv').config({ path: '.env.production.local' });
const { Client } = require('pg');

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  console.log('Connected to Neon PostgreSQL database.');

  const subId = 'sub_1Tu84ODlo7kseofIhJA0odWz';
  console.log(`Searching for subscription: ${subId}...`);
  
  const res = await client.query(
    'SELECT * FROM subscriptions WHERE stripe_subscription_id = \$1',
    [subId]
  );
  
  if (res.rows.length > 0) {
    console.log('=== DATABASE RECORD FOUND ===');
    console.log(res.rows[0]);
    
    // Fetch aircraft
    const acRes = await client.query(
      'SELECT * FROM aircraft WHERE id = \$1',
      [res.rows[0].aircraft_id]
    );
    console.log('=== AIRCRAFT RECORD ===');
    console.log(acRes.rows[0]);
  } else {
    console.log('No database record found for this subscription ID.');
  }

  await client.end();
}

run().catch(async (e) => {
  console.error(e);
  await client.end();
});
