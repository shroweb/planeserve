import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureSession,
  getBillingData,
  cancelSubscription,
  getStripeBillingData,
} from "@/lib/app.functions";
import { toast } from "sonner";
import { ExternalLink, Download, CreditCard } from "lucide-react";

export const Route = createFileRoute("/billing")({
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: Billing,
});

function Billing() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["billing"],
    queryFn: () => getBillingData(),
  });

  const { data: stripe } = useQuery({
    queryKey: ["stripe-billing"],
    queryFn: () => getStripeBillingData(),
  });

  const aircraft = data?.aircraft ?? [];
  const subscriptions = data?.subscriptions ?? [];
  const monthly = aircraft.filter((a) => a.plan === "monthly").length;
  const annual = aircraft.filter((a) => a.plan === "annual").length;
  const total = monthly * 100 + (annual * 1000) / 12;

  const cancelMutation = useMutation({
    mutationFn: (subscriptionId: string) => cancelSubscription({ data: { subscriptionId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      toast.success("Subscription cancelled.");
    },
    onError: () => toast.error("Failed to cancel subscription."),
  });

  function handleCancel(subscriptionId: string, registration: string) {
    if (
      window.confirm(
        `Cancel the Aircraft Program subscription for ${registration}? This will stop AOG cover at the end of the current billing period.`,
      )
    ) {
      cancelMutation.mutate(subscriptionId);
    }
  }

  // Use Stripe invoices if available, fall back to DB invoices
  const stripeInvoices = stripe?.invoices ?? [];
  const dbInvoices = data?.invoices ?? [];
  const platformInvoices = dbInvoices.filter((invoice) => invoice.quoteId || invoice.requestId);
  const useStripeInvoices = stripe?.hasStripe && stripeInvoices.length > 0;

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Billing is per aircraft. Your account is free; each enrolled aircraft has its own plan,
        subscription and invoices.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card label="Monthly aircraft" value={String(monthly)} />
        <Card label="Annual aircraft" value={String(annual)} />
        <Card label="Estimated monthly" value={`$${total.toFixed(2)}`} accent />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Subscriptions */}
        <div className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Active subscriptions
          </div>
          <div className="divide-y divide-border">
            {subscriptions.map((sub) => {
              const ac = aircraft.find((item) => item.id === sub.aircraftId);
              const isCancelled = sub.status === "Cancelled";
              return (
                <div key={sub.id} className="flex items-center justify-between px-5 py-4 text-sm">
                  <div>
                    <div className="font-medium">{ac?.registration ?? "Aircraft"}</div>
                    <div className="text-xs text-muted-foreground">
                      {sub.plan === "monthly" ? "$100 / month" : "$1,000 / year"}
                    </div>
                    {!isCancelled && (
                      <button
                        onClick={() => handleCancel(sub.id, ac?.registration ?? "aircraft")}
                        disabled={cancelMutation.isPending}
                        className="mt-1 text-[10px] text-muted-foreground/60 hover:text-destructive underline disabled:opacity-50 transition-colors"
                      >
                        Cancel subscription
                      </button>
                    )}
                  </div>
                  <span className="rounded-sm bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {sub.status}
                  </span>
                </div>
              );
            })}
            {!subscriptions.length && (
              <div className="px-5 py-8 text-sm text-muted-foreground">
                No aircraft subscriptions yet.
              </div>
            )}
          </div>
        </div>

        {/* Invoices */}
        <div className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Recent invoices
            </span>
            {useStripeInvoices && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live from Stripe
              </span>
            )}
          </div>
          <div className="divide-y divide-border">
            {useStripeInvoices &&
              stripeInvoices.map((inv) => (
                  <div
                    key={inv.stripeId}
                    className="flex items-center justify-between px-5 py-4 text-sm"
                  >
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {inv.number ?? inv.stripeId.slice(-8)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {new Date(inv.created * 1000).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">
                          {((inv.amountPaid || inv.amountDue) / 100).toLocaleString("en-US", {
                            style: "currency",
                            currency: (inv.currency ?? "usd").toUpperCase(),
                          })}
                        </div>
                        <div
                          className={`text-xs font-medium ${inv.status === "paid" ? "text-emerald-600" : inv.status === "open" ? "text-amber-600" : "text-muted-foreground"}`}
                        >
                          {inv.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {inv.pdfUrl && (
                          <a
                            href={inv.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                          >
                            <Download className="h-3 w-3" /> PDF
                          </a>
                        )}
                        {inv.hostedUrl && (
                          <a
                            href={inv.hostedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            {(!useStripeInvoices ? dbInvoices : platformInvoices).slice(0, 5).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between px-5 py-4 text-sm"
                  >
                    <div>
                      <div className="font-mono text-xs">{invoice.id.slice(-8)}</div>
                      {invoice.description && (
                        <div className="mt-0.5 max-w-[15rem] truncate text-xs font-medium">
                          {invoice.description}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">
                          {(invoice.amountCents / 100).toLocaleString("en-US", {
                            style: "currency",
                            currency: (invoice.currency ?? "usd").toUpperCase(),
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">{invoice.status}</div>
                      </div>
                      {stripe?.portalUrl ? (
                        <a
                          href={stripe.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" /> View
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground/50 italic">PDF pending</span>
                      )}
                    </div>
                  </div>
                ))}
            {!useStripeInvoices && !dbInvoices.length && (
              <div className="px-5 py-8 text-sm text-muted-foreground">No invoices yet.</div>
            )}
            {useStripeInvoices && !platformInvoices.length && !stripeInvoices.length && (
              <div className="px-5 py-8 text-sm text-muted-foreground">No invoices yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div className="mt-8 rounded-md border border-border bg-card p-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Payment method
        </div>
        {stripe?.portalUrl ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Manage your card, download invoices, and update billing details via the Stripe
                portal.
              </span>
            </div>
            <a
              href={stripe.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 ml-4 flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Manage billing <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              No card is linked to this subscription yet. Add a payment method when you enrol an
              aircraft, or contact your Aircraft Program desk to link billing.
            </span>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Card({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${accent ? "text-accent" : ""}`}>
        {value}
      </div>
    </div>
  );
}
