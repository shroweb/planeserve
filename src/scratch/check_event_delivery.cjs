require('dotenv').config({ path: '.env.production.local' });
const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not defined in .env.production.local');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function run() {
  const eventId = 'evt_1Tu8xd8MubGBCKHSXg1eBPKu';
  console.log(`Retrieving event ${eventId}...`);
  const event = await stripe.events.retrieve(eventId);
  
  console.log('=== EVENT DETAILS ===');
  console.log('ID:', event.id);
  console.log('Type:', event.type);
  console.log('Request ID:', event.request?.id);
  console.log('Idempotency Key:', event.request?.idempotency_key);
  
  // Look at deliveries via Stripe's events system if possible
  console.log('Raw Event JSON:');
  console.log(JSON.stringify(event, null, 2));
}

run().catch(console.error);
