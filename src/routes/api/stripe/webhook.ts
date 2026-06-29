import { createFileRoute } from "@tanstack/react-router";
import {
  handleStripeInvoicePaid,
  handleStripeInvoicePaymentFailed,
  mapStripeStatus,
  syncStripeSubscription,
} from "@/lib/app.functions";

// Stripe webhook endpoint. Register this URL in the Stripe dashboard and set
// STRIPE_WEBHOOK_SECRET. Keeps our subscription/cover status in sync with
// Stripe-side events (renewals, cancellations, failed payments).
export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        const signature = request.headers.get("stripe-signature");

        if (!secret || !signature) {
          return new Response("Webhook not configured", { status: 400 });
        }

        // Raw body is required for signature verification.
        const body = await request.text();

        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        let event: import("stripe").Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(body, signature, secret);
        } catch {
          return new Response("Invalid signature", { status: 400 });
        }

        try {
          switch (event.type) {
            case "customer.subscription.created":
            case "customer.subscription.updated": {
              const sub = event.data.object as { id: string; status: string };
              await syncStripeSubscription(sub.id, mapStripeStatus(sub.status));
              break;
            }
            case "customer.subscription.deleted": {
              const sub = event.data.object as { id: string };
              await syncStripeSubscription(sub.id, "Cancelled");
              break;
            }
            case "invoice.payment_failed": {
              const inv = event.data.object as { subscription?: string | null };
              if (inv.subscription) await syncStripeSubscription(inv.subscription, "Pending");
              await handleStripeInvoicePaymentFailed(event.data.object as any);
              break;
            }
            case "invoice.paid": {
              const inv = event.data.object as { subscription?: string | null };
              if (inv.subscription) await syncStripeSubscription(inv.subscription, "Active");
              await handleStripeInvoicePaid(event.data.object as any);
              break;
            }
            default:
              break; // ignore unhandled event types
          }
        } catch (err) {
          console.error("[stripe webhook] handler error:", err);
          // 500 so Stripe retries.
          return new Response("Handler error", { status: 500 });
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
