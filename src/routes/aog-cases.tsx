import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureSession,
  getAogRequests,
  getSupplierQuotes,
  approveSupplierQuote,
  getAogStatusEvents,
  rateCaseDeskPerformance,
  type AogRecord,
  type SupplierQuoteRecord,
} from "@/lib/app.functions";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  ChevronRight,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/aog-cases")({
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AogCasesPage,
});

const STATUS_COLOURS: Record<string, string> = {
  Submitted: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Acknowledged: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Sourcing: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "Options ready": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Awaiting approval": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Confirmed: "bg-green-500/10 text-green-600 border-green-500/20",
  "Order placed": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  "In transit": "bg-sky-500/10 text-sky-600 border-sky-500/20",
  Arrived: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  Resolved: "bg-muted text-muted-foreground border-border",
  Cancelled: "bg-muted text-muted-foreground border-border",
};

const URGENCY_ICON: Record<string, React.ReactNode> = {
  "Aircraft grounded": <AlertTriangle className="h-3.5 w-3.5 text-destructive" strokeWidth={2} />,
  "Dispatch affected": <Clock className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} />,
  "Planned sourcing": <Package className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />,
};

type Filter = "Active" | "Resolved" | "All";

function AogCasesPage() {
  const [filter, setFilter] = useState<Filter>("Active");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: cases = [] } = useQuery<AogRecord[]>({
    queryKey: ["aog-requests"],
    queryFn: () => getAogRequests(),
  });

  const filtered = cases.filter((c: AogRecord) => {
    if (filter === "Active") return !["Resolved", "Cancelled"].includes(c.status);
    if (filter === "Resolved") return ["Resolved", "Cancelled"].includes(c.status);
    return true;
  });

  const selected = cases.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden">
        {/* Left pane — case list */}
        <div className="w-80 shrink-0 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h1 className="text-base font-semibold mb-3">AOG Cases</h1>
            <div className="flex gap-1">
              {(["Active", "Resolved", "All"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground text-center">No cases found.</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${
                    selected?.id === c.id ? "bg-accent/50" : "hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-medium">{c.registration}</span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_COLOURS[c.status] ?? ""}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {URGENCY_ICON[c.urgency]}
                    <span className="truncate">{c.affectedSystem}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{c.location || "—"}</span>
                    <span className="ml-auto shrink-0">
                      {new Date(c.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right pane — case detail */}
        <div className="flex-1 overflow-y-auto p-6">
          {selected ? (
            <CaseDetail key={selected.id} aog={selected} />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              Select a case to view details
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function StarRating({ aog }: { aog: AogRecord }) {
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState<number>(0);
  const [selected, setSelected] = useState<number>(aog.caseRating ?? 0);
  const [comment, setComment] = useState(aog.caseRatingComment ?? "");
  const [submitted, setSubmitted] = useState(!!aog.caseRating);

  const mutation = useMutation({
    mutationFn: (rating: number) =>
      rateCaseDeskPerformance({ data: { requestId: aog.id, rating, comment } }),
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["aog-requests"] });
    },
  });

  if (submitted || aog.caseRating) {
    const rating = aog.caseRating ?? selected;
    return (
      <div className="bg-card border border-border rounded-md p-4">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-2">
          Your rating
        </p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={`text-lg ${s <= rating ? "text-amber-400" : "text-muted-foreground/30"}`}
            >
              ★
            </span>
          ))}
          {(aog.caseRatingComment || comment) && (
            <span className="text-xs text-muted-foreground ml-2 italic">
              "{aog.caseRatingComment || comment}"
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-md p-4 space-y-3">
      <p className="text-sm font-medium">How did we do?</p>
      <p className="text-xs text-muted-foreground">
        Rate your PlaneServe desk experience for this case.
      </p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(s)}
            className={`text-2xl transition-colors ${s <= (hovered || selected) ? "text-amber-400" : "text-muted-foreground/30 hover:text-amber-200"}`}
          >
            ★
          </button>
        ))}
      </div>
      {selected > 0 && (
        <>
          <textarea
            rows={2}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
            placeholder="Optional comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={() => mutation.mutate(selected)}
            disabled={mutation.isPending}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50"
          >
            {mutation.isPending ? "Submitting…" : "Submit rating"}
          </button>
        </>
      )}
    </div>
  );
}

function CaseDetail({ aog }: { aog: AogRecord }) {
  const queryClient = useQueryClient();

  const { data: quotes = [] } = useQuery<SupplierQuoteRecord[]>({
    queryKey: ["supplier-quotes", aog.id],
    queryFn: () => getSupplierQuotes({ data: { requestId: aog.id } }),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["aog-status-events", aog.id],
    queryFn: () => getAogStatusEvents({ data: { requestId: aog.id } }),
  });

  const approveMutation = useMutation({
    mutationFn: (quoteId: string) => approveSupplierQuote({ data: { quoteId, requestId: aog.id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aog-requests"] });
      queryClient.invalidateQueries({ queryKey: ["supplier-quotes", aog.id] });
      queryClient.invalidateQueries({ queryKey: ["aog-status-events", aog.id] });
    },
  });

  const approvedQuote = quotes.find((q) => q.approvedAt);
  const pendingQuotes = quotes.filter((q) => !q.approvedAt);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-xl font-semibold">{aog.registration}</h2>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_COLOURS[aog.status] ?? ""}`}
          >
            {aog.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {aog.aircraftType} · Case {aog.id}
        </p>
      </div>

      {/* Key details */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Urgency", value: aog.urgency },
          { label: "Location", value: aog.location || "—" },
          { label: "Affected system", value: aog.affectedSystem },
          { label: "Part number", value: aog.partNumber || "—" },
          { label: "ATA chapter", value: aog.ataChapter || "—" },
          {
            label: "Submitted",
            value: new Date(aog.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-md p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">
              {label}
            </p>
            <p className="text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* Issue description */}
      <div className="bg-card border border-border rounded-md p-4">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">
          Issue description
        </p>
        <p className="text-sm leading-relaxed">{aog.issueDescription}</p>
      </div>

      {/* Freight tracking */}
      {aog.freightCourier && (
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Freight tracking</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">
                Courier
              </p>
              <p className="font-medium">{aog.freightCourier}</p>
            </div>
            {aog.freightTrackingRef && (
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">
                  Tracking ref
                </p>
                <p className="font-medium">{aog.freightTrackingRef}</p>
              </div>
            )}
            {aog.freightExpectedArrival && (
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">
                  Expected arrival
                </p>
                <p className="font-medium">
                  {new Date(aog.freightExpectedArrival).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
            {aog.freightNotes && (
              <div className="col-span-2">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">
                  Notes
                </p>
                <p>{aog.freightNotes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sourcing options */}
      {quotes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">Sourcing options</p>
          <div className="space-y-3">
            {approvedQuote && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                    Confirmed source
                  </span>
                </div>
                <QuoteCard quote={approvedQuote} index={0} approved />
              </div>
            )}
            {pendingQuotes.map((q, i) => (
              <div key={q.id} className="bg-card border border-border rounded-md p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <QuoteCard quote={q} index={i} approved={false} />
                  </div>
                  {aog.status === "Options ready" && (
                    <button
                      onClick={() => approveMutation.mutate(q.id)}
                      disabled={approveMutation.isPending}
                      className="shrink-0 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status timeline */}
      {events.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">Status timeline</p>
          <div className="relative pl-4 border-l border-border space-y-4">
            {events.map((ev, i) => (
              <div key={ev.id} className="relative">
                <span className="absolute -left-[1.3rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{ev.status}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(ev.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {ev.note && <p className="text-xs text-muted-foreground mt-0.5">{ev.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Case rating — show for Resolved cases */}
      {aog.status === "Resolved" && <StarRating aog={aog} />}
    </div>
  );
}

function QuoteCard({
  quote,
  index,
  approved,
}: {
  quote: SupplierQuoteRecord;
  index: number;
  approved: boolean;
}) {
  const ref = `Source Ref ${String(index + 1).padStart(3, "0")}`;
  const price = (quote.priceCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: quote.currency.toUpperCase(),
  });

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium">{ref}</span>
        <span className="text-xs text-muted-foreground border border-border px-1.5 py-0.5 rounded">
          {quote.condition}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">Price</p>
          <p className="font-medium">{price}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Lead time</p>
          <p className="font-medium">{quote.leadTime || "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Route</p>
          <p className="font-medium">{quote.freightRoute || "—"}</p>
        </div>
      </div>
      {quote.paperwork && <p className="text-xs text-muted-foreground">Docs: {quote.paperwork}</p>}
      {quote.notes && <p className="text-xs text-muted-foreground">{quote.notes}</p>}
    </div>
  );
}
