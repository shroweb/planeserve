require('dotenv').config({ path: '.env.production.local' });
const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not defined in .env.production.local');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function run() {
  console.log('Fetching recent Stripe events...');
  const events = await stripe.events.list({ limit: 5 });
  
  for (const e of events.data) {
    console.log('--------------------------------------------------');
    console.log(`Event ID: ${e.id}`);
    console.log(`Event Type: ${e.type}`);
    console.log(`Created: ${new Date(e.created * 1000).toLocaleString()}`);
    
    // Check webhook delivery status of this event
    try {
      const endpoints = await stripe.webhookEndpoints.list();
      console.log('Registered webhook endpoints:', endpoints.data.map(ep => ep.url));
    } catch (err) {
      console.log('Error listing endpoints:', err.message);
    }
  }
}

run().catch(console.error);
