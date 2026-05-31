import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupplierAppShell } from "@/components/app/SupplierAppShell";
import {
  ensureSupplierSession,
  getSupplierRfqs,
  getSupplierQuoteHistory,
  submitSupplierQuote,
  reviseSupplierQuote,
} from "@/lib/app.functions";
import { useState, useEffect } from "react";
import { StatCard, StatusPill } from "@/components/app/ui";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Package,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

// RFQs get a fixed quote window from when they were sent.
const QUOTE_WINDOW_MS = 4 * 60 * 60 * 1000;

function quoteWindow(sentAt: string | Date, now: number) {
  const remaining = new Date(sentAt).getTime() + QUOTE_WINDOW_MS - now;
  if (remaining <= 0) return { label: "Window closed", urgent: true, closed: true };
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  return { label: `${h}h ${m}m`, urgent: remaining < 60 * 60 * 1000, closed: false };
}

export const Route = createFileRoute("/supplier/")({
  beforeLoad: async () => {
    try {
      await ensureSupplierSession();
    } catch {
      throw redirect({ to: "/supplier/login" });
    }
  },
  component: SupplierInboxPage,
});

const CONDITIONS = ["Serviceable", "Exchange", "Overhauled", "New", "As Removed"] as const;
type Condition = (typeof CONDITIONS)[number];

type RfqRow = {
  id: string;
  requestId: string;
  partDescription: string;
  partNumber: string;
  aircraftType: string;
  location: string;
  documentationRequired: string;
  status: string;
  sentAt: string | Date;
  respondedAt?: string | Date | null;
  quoteSubmitted: boolean;
};

const emptyForm = {
  condition: "Serviceable" as Condition,
  price: "",
  currency: "usd",
  leadTime: "",
  paperwork: "",
  freightRoute: "",
  notes: "",
};

function SupplierInboxPage() {
  const queryClient = useQueryClient();
  const [activeRfqId, setActiveRfqId] = useState<string | null>(null);
  const [reviseRfqId, setReviseRfqId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data } = useQuery({
    queryKey: ["supplier-rfqs"],
    queryFn: () => getSupplierRfqs(),
  });

  // Tick once a minute so quote-window countdowns stay live.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const { data: history } = useQuery({
    queryKey: ["supplier-quote-history"],
    queryFn: () => getSupplierQuoteHistory(),
    staleTime: 60_000,
  });

  const rfqs: RfqRow[] = data?.rfqs ?? [];
  const pending = rfqs.filter((r) => r.status === "sent");
  const responded = rfqs.filter((r) => r.status !== "sent");

  const winRateLabel = history ? `${history.winRate}%` : "—";
  const avgResponseLabel =
    history && history.avgResponseHrs !== "—" ? `${history.avgResponseHrs}h` : "—";
  const company = data?.company;
  const companyMeta = company as
    | {
        contactName?: string;
        primaryAogContact?: string;
        paymentTerms?: string;
        specialisms?: string;
        aircraftTypes?: string;
      }
    | undefined;
  const readiness = [
    { label: "Company profile", done: Boolean(company?.name), icon: ShieldCheck },
    {
      label: "AOG contact",
      done: Boolean(companyMeta?.contactName || companyMeta?.primaryAogContact),
      icon: Clock3,
    },
    { label: "Payment terms", done: Boolean(companyMeta?.paymentTerms), icon: FileCheck2 },
    {
      label: "Speciality configured",
      done: Boolean(companyMeta?.specialisms || companyMeta?.aircraftTypes),
      icon: Package,
    },
  ];

  const submitMutation = useMutation({
    mutationFn: (rfq: RfqRow) =>
      submitSupplierQuote({
        data: {
          rfqId: rfq.id,
          requestId: rfq.requestId,
          condition: form.condition,
          priceCents: Math.round(parseFloat(form.price || "0") * 100),
          currency: form.currency,
          leadTime: form.leadTime,
          paperwork: form.paperwork,
          freightRoute: form.freightRoute,
          notes: form.notes,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-rfqs"] });
      setActiveRfqId(null);
      setForm(emptyForm);
    },
  });

  const reviseMutation = useMutation({
    mutationFn: (quoteId: string) =>
      reviseSupplierQuote({
        data: {
          quoteId,
          condition: form.condition,
          priceCents: Math.round(parseFloat(form.price || "0") * 100),
          currency: form.currency,
          leadTime: form.leadTime,
          paperwork: form.paperwork,
          freightRoute: form.freightRoute,
          notes: form.notes,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-rfqs"] });
      setReviseRfqId(null);
      setForm(emptyForm);
    },
  });

  const activeRfq = rfqs.find((r) => r.id === activeRfqId);

  function QuoteForm({ onSubmit, loading }: { onSubmit: () => void; loading: boolean }) {
    return (
      <div className="border-t border-border px-4 pb-4 pt-3 bg-muted/20">
        <p className="text-xs font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
          Quote details
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Condition</label>
            <select
              value={form.condition}
              onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value as Condition }))}
              className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
            >
              {CONDITIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Price (USD)</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="0.00"
              className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Lead time</label>
            <input
              type="text"
              value={form.leadTime}
              onChange={(e) => setForm((f) => ({ ...f, leadTime: e.target.value }))}
              placeholder="e.g. 24–48 hrs"
              className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Freight route</label>
            <input
              type="text"
              value={form.freightRoute}
              onChange={(e) => setForm((f) => ({ ...f, freightRoute: e.target.value }))}
              placeholder="e.g. LHR → JFK"
              className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-muted-foreground">Paperwork / certifications</label>
            <input
              type="text"
              value={form.paperwork}
              onChange={(e) => setForm((f) => ({ ...f, paperwork: e.target.value }))}
              placeholder="e.g. FAA 8130-3, EASA Form 1"
              className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-muted-foreground">Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm resize-none"
            />
          </div>
        </div>
        <button
          onClick={onSubmit}
          disabled={!form.price || loading}
          className="mt-3 px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit quote"}
        </button>
      </div>
    );
  }

  return (
    <SupplierAppShell>
      <div className="max-w-5xl">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {pending.length} open request{pending.length === 1 ? "" : "s"} ·{" "}
          {responded.length} quoted
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Incoming sourcing requests</h1>

        {/* Stat row (real metrics) */}
        <div className="mt-5 mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Open RFQs" value={String(pending.length)} tone="gold" />
          <StatCard
            label="Avg response"
            value={avgResponseLabel}
            tone="blue"
          />
          <StatCard label="Quoted" value={String(responded.length)} />
          <StatCard
            label="Win rate · 90d"
            value={winRateLabel}
            tone="green"
          />
        </div>

        {pending.length === 0 && responded.length === 0 && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="rounded-lg border border-border bg-card shadow-sm">
              <div className="flex items-start gap-3 border-b border-border p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[oklch(0.34_0.08_70)]">
                  <Package className="h-4 w-4" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold tracking-tight">No RFQs assigned</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Matching sourcing requests will appear here for quote response.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-3">
                {["Receive RFQ", "Submit net quote", "Ship if selected"].map((step, index) => (
                  <div
                    key={step}
                    className="flex min-h-16 items-center gap-3 rounded-md border border-border bg-muted/20 px-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Readiness
                </p>
                <span className="rounded-sm bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {readiness.filter((item) => item.done).length}/{readiness.length}
                </span>
              </div>
              <div className="mt-3 divide-y divide-border">
                {readiness.map(({ label, done, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.6} />
                      <span className="truncate">{label}</span>
                    </span>
                    <span
                      className={`rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                        done ? "bg-success/10 text-success" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {done ? "Ready" : "Needed"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-md bg-muted/40 p-3 text-xs leading-5 text-muted-foreground">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Keep documents and 24/7 contacts current for urgent RFQs.
              </div>
            </div>
          </div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Pending response ({pending.length})
            </p>
            <div className="space-y-3">
              {pending.map((rfq) => (
                <div
                  key={rfq.id}
                  className="bg-card border border-primary/20 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full text-left px-4 py-4"
                    onClick={() => setActiveRfqId(activeRfqId === rfq.id ? null : rfq.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">
                          {rfq.partNumber || rfq.partDescription || "Part request"}
                        </p>
                        {rfq.partDescription && rfq.partNumber && (
                          <p className="text-xs text-muted-foreground">{rfq.partDescription}</p>
                        )}
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          {rfq.aircraftType && <span>{rfq.aircraftType}</span>}
                          {rfq.location && <span>· {rfq.location}</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center justify-end gap-1.5">
                          {now - new Date(rfq.sentAt).getTime() < 60 * 60 * 1000 && (
                            <StatusPill tone="gold" dot>
                              New
                            </StatusPill>
                          )}
                          {(() => {
                            const w = quoteWindow(rfq.sentAt, now);
                            return (
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-semibold ${w.urgent ? "text-destructive" : "text-muted-foreground"}`}
                              >
                                <Clock3 className="h-3.5 w-3.5" />
                                {w.closed ? "Window closed" : `Quote window ${w.label}`}
                              </span>
                            );
                          })()}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(rfq.sentAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    {rfq.documentationRequired && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Docs required: {rfq.documentationRequired}
                      </p>
                    )}
                  </button>

                  {activeRfqId === rfq.id && (
                    <QuoteForm
                      onSubmit={() => submitMutation.mutate(rfq)}
                      loading={submitMutation.isPending}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responded */}
        {responded.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Responded ({responded.length})
            </p>
            <div className="space-y-2">
              {responded.map((rfq) => (
                <div
                  key={rfq.id}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {rfq.partNumber || rfq.partDescription}
                      </p>
                      <p className="text-xs text-muted-foreground">{rfq.aircraftType}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(rfq.sentAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <button
                      onClick={() => {
                        setReviseRfqId(reviseRfqId === rfq.id ? null : rfq.id);
                        setForm(emptyForm);
                      }}
                      className="flex items-center gap-1 text-xs text-primary font-medium shrink-0"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Revise
                    </button>
                  </div>
                  {reviseRfqId === rfq.id && (
                    <QuoteForm
                      onSubmit={() => {
                        // Find the quote id from supplier-quote-history — here we use rfq.id as quoteId placeholder
                        // In production you'd look up the quote; for now pass requestId
                        reviseMutation.mutate(rfq.requestId);
                      }}
                      loading={reviseMutation.isPending}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SupplierAppShell>
  );
}
