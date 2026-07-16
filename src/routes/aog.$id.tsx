import { createFileRoute, redirect, useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureSession,
  getAogCaseDetail,
  approveSupplierQuote,
  getAogStatusEvents,
  SupplierQuoteRecord,
} from "@/lib/app.functions";
import { CheckCircle2, Clock, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/aog/$id")({
  beforeLoad: async () => {
    const user = await ensureSession().catch(() => {
      throw redirect({ to: "/login" });
    });
    if (user?.isSupplier) {
      throw redirect({ to: "/supplier" });
    }
  },
  component: AogCasePage,
});

function AogCasePage() {
  const { id } = useParams({ from: "/aog/$id" });
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: case_,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["aog-case", id],
    queryFn: () => getAogCaseDetail({ data: { id } }),
  });

  const { data: statusEvents } = useQuery({
    queryKey: ["aog-status-events", id],
    queryFn: () => getAogStatusEvents({ data: { requestId: id } }),
    enabled: !!case_,
  });

  const [confirmed, setConfirmed] = useState(false);

  const approveMutation = useMutation({
    mutationFn: (quoteId: string) => approveSupplierQuote({ data: { quoteId, requestId: id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aog-case", id] });
      queryClient.invalidateQueries({ queryKey: ["aog-status-events", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setConfirmed(true);
    },
    onError: () => toast.error("Could not approve option. Please try again."),
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="mt-20 text-center text-sm text-muted-foreground">Loading case…</div>
      </AppShell>
    );
  }

  if (error || !case_) {
    return (
      <AppShell>
        <div className="mt-20 text-center text-sm text-destructive">
          Case not found or access denied.
        </div>
      </AppShell>
    );
  }

  const r = case_;
  const canApprove = r.status === "Options ready" || r.status === "Awaiting approval";
  const approvedQuote = r.quotes.find((q) => q.approvedAt);

  if (confirmed || approvedQuote) {
    const q = approvedQuote ?? r.quotes[0];
    return (
      <AppShell>
        <div className="mx-auto max-w-xl rounded-md border border-border bg-card p-10 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-accent" strokeWidth={1.5} />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Option approved</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Aircraft Program is placing the order through the approved source. You will receive
            updates as the part progresses to your location.
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Payment and order instructions are handled by Aircraft Program. Supplier bank details
            are not sent directly to the subscriber.
          </p>
          {q && (
            <div className="mt-6 rounded-sm border border-border bg-background p-4 text-left text-sm">
              <div className="grid grid-cols-2 gap-3">
                <KV label="Source">Aircraft Program approved source</KV>
                <KV label="Condition">{q.condition}</KV>
                <KV label="Price">
                  {(q.priceCents / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: q.currency.toUpperCase(),
                  })}
                </KV>
                <KV label="Lead time">{q.leadTime || "—"}</KV>
              </div>
            </div>
          )}
          <button
            onClick={() => nav({ to: "/dashboard" })}
            className="mt-8 rounded-sm bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Back to Dashboard
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-2">
          <button
            onClick={() => nav({ to: "/dashboard" })}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Dashboard
          </button>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">AOG Case — {r.registration}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{r.affectedSystem}</p>
          </div>
          <StatusPill status={r.status} />
        </div>

        <div className="mt-8 space-y-6">
          {/* Case summary */}
          <Card>
            <SectionTitle>Case summary</SectionTitle>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
              <KV label="Aircraft">{r.registration}</KV>
              <KV label="Urgency">
                <UrgencyText urgency={r.urgency} />
              </KV>
              <KV label="Submitted">
                {new Date(r.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </KV>
              {r.location && <KV label="Location">{r.location}</KV>}
              {r.partNumber && (
                <KV label="Part number">
                  <span className="font-mono">{r.partNumber}</span>
                </KV>
              )}
              {r.ataChapter && <KV label="ATA chapter">{r.ataChapter}</KV>}
            </div>
            <div className="mt-4">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Description
              </div>
              <p className="text-sm leading-6 text-foreground">{r.issueDescription}</p>
            </div>
          </Card>

          {/* Freight tracking */}
          {(r.freightCourier || r.freightTrackingRef) && (
            <Card>
              <SectionTitle>Freight tracking</SectionTitle>
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                {r.freightCourier && <KV label="Courier">{r.freightCourier}</KV>}
                {r.freightTrackingRef && (
                  <KV label="Tracking ref">
                    <span className="font-mono">{r.freightTrackingRef}</span>
                  </KV>
                )}
                {r.freightExpectedArrival && (
                  <KV label="Expected arrival">
                    {new Date(r.freightExpectedArrival).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </KV>
                )}
              </div>
              {r.freightNotes && (
                <p className="mt-3 rounded-sm bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  {r.freightNotes}
                </p>
              )}
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <SectionTitle>Status timeline</SectionTitle>
            <StatusTimeline events={statusEvents ?? []} current={r.status} />
          </Card>

          {/* Exception notices */}
          {(r.exceptionStates?.length ?? 0) > 0 && (
            <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-destructive">
                Active exceptions
              </div>
              <ul className="space-y-1">
                {r.exceptionStates!.map((s) => (
                  <li key={s} className="text-sm text-destructive">
                    · {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sourcing options */}
          {r.quotes.length > 0 && (
            <Card>
              <SectionTitle>
                {canApprove ? "Approve a sourcing option" : "Sourcing options"}
              </SectionTitle>
              {canApprove && (
                <p className="mb-4 text-sm text-muted-foreground">
                  Aircraft Program has sourced the following options. Please review and approve one
                  to proceed. Aircraft Program will then confirm order/payment instructions and
                  coordinate the supplier.
                </p>
              )}
              <div className="space-y-4">
                {r.quotes.map((q) => (
                  <OptionCard
                    key={q.id}
                    quote={q}
                    canApprove={canApprove}
                    onApprove={() => approveMutation.mutate(q.id)}
                    pending={approveMutation.isPending}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Awaiting sourcing */}
          {r.quotes.length === 0 && (
            <Card>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Clock className="h-8 w-8 shrink-0 opacity-40" />
                <div>
                  <div className="font-medium text-foreground">Sourcing in progress</div>
                  <div className="mt-1">
                    Aircraft Program is actively sourcing options for this AOG. You will receive an
                    update when options are ready for your approval.
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function OptionCard({
  quote,
  canApprove,
  onApprove,
  pending,
}: {
  quote: SupplierQuoteRecord;
  canApprove: boolean;
  onApprove: () => void;
  pending: boolean;
}) {
  const price = (quote.priceCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: quote.currency.toUpperCase(),
  });

  return (
    <div
      className={`rounded-sm border p-5 ${
        quote.approvedAt
          ? "border-[oklch(0.43_0.11_150)]/40 bg-[oklch(0.97_0.04_150)]"
          : "border-border bg-background"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-sm">Aircraft Program approved source</span>
            <span className="rounded-sm bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent">
              Released by Aircraft Program
            </span>
            <span className="rounded-sm border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              {quote.condition}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <KV label="Price">{price}</KV>
            <KV label="Lead time">{quote.leadTime || "TBC"}</KV>
            <KV label="Paperwork">{quote.paperwork || "—"}</KV>
            <KV label="Freight">{quote.freightRoute || "—"}</KV>
          </div>
          {quote.notes && (
            <div className="mt-3 rounded-sm bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              {quote.notes}
            </div>
          )}
          {canApprove && !quote.approvedAt && (
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
              Approval authorises Aircraft Program to proceed with this option. Aircraft Program
              controls payment/order instructions and supplier dispatch coordination.
            </p>
          )}
        </div>
        {canApprove && !quote.approvedAt && (
          <button
            onClick={onApprove}
            disabled={pending}
            className="shrink-0 rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
          >
            {pending ? "Approving…" : "Approve"}
          </button>
        )}
        {quote.approvedAt && (
          <div className="flex items-center gap-1.5 text-[oklch(0.38_0.11_150)]">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-semibold">Approved</span>
          </div>
        )}
      </div>
    </div>
  );
}

type StatusEvent = { id: string; status: string; note: string; createdAt: string | Date };

function StatusTimeline({ events, current }: { events: StatusEvent[]; current: string }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Status history will appear here as this case progresses.
      </p>
    );
  }
  return (
    <ol className="relative space-y-0 border-l border-border pl-5">
      {events.map((e, i) => {
        const isLast = i === events.length - 1;
        const ts = new Date(e.createdAt);
        return (
          <li key={e.id} className="pb-6 last:pb-0">
            <span
              className={`absolute -left-[5px] mt-0.5 flex h-2.5 w-2.5 rounded-full border ${
                isLast ? "border-accent bg-accent" : "border-border bg-background"
              }`}
            />
            <div className="flex items-baseline gap-3">
              <span
                className={`text-sm font-semibold ${isLast ? "text-accent" : "text-foreground"}`}
              >
                {e.status}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {ts.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                {ts.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            {e.note && <p className="mt-1 text-xs text-muted-foreground">{e.note}</p>}
          </li>
        );
      })}
    </ol>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className="rounded-sm border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
      {status}
    </span>
  );
}

function UrgencyText({ urgency }: { urgency: string }) {
  return (
    <span
      className={
        urgency === "Aircraft grounded"
          ? "text-destructive font-semibold"
          : urgency === "Dispatch affected"
            ? "text-[oklch(0.55_0.12_70)] font-medium"
            : ""
      }
    >
      {urgency}
    </span>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border border-border bg-card p-5">{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </div>
  );
}

function KV({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
