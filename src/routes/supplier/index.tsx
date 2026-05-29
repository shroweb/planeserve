import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupplierAppShell } from "@/components/app/SupplierAppShell";
import {
  ensureSupplierSession,
  getSupplierRfqs,
  submitSupplierQuote,
  reviseSupplierQuote,
} from "@/lib/app.functions";
import { useState } from "react";
import { Package, CheckCircle2, RefreshCw } from "lucide-react";

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

  const rfqs: RfqRow[] = data?.rfqs ?? [];
  const pending = rfqs.filter((r) => r.status === "sent");
  const responded = rfqs.filter((r) => r.status !== "sent");

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
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">RFQ Inbox</h1>
          {data?.company && (
            <p className="text-sm text-muted-foreground mt-0.5">{data.company.name}</p>
          )}
        </div>

        {pending.length === 0 && responded.length === 0 && (
          <div className="py-16 text-center border border-dashed border-border rounded-lg text-sm text-muted-foreground">
            No RFQs yet. You'll be notified when PlaneServe sends a new request.
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
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          Awaiting quote
                        </span>
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
