import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { StatusPill } from "@/components/app/ui";
import {
  ensureAdminSession,
  getPartsRequests,
  updatePartsRequestStatus,
  sendPartsRequestQuote,
} from "@/lib/app.functions";
import type { PartsRequest } from "@/lib/db/schema";
import { toast } from "sonner";
import {
  Package,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  Building,
  Plane,
  MapPin,
  AlertCircle,
  ExternalLink,
  Send,
  FileText,
  DollarSign,
  X,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/parts-requests")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminPartsRequests,
});

const STATUS_OPTIONS = ["New", "In Sourcing", "Quoted", "Completed", "Cancelled"] as const;

const CONDITION_PRESETS = [
  "New Surplus (NS)",
  "Overhauled (OH)",
  "Serviceable (SV)",
  "Exchange / Rotable",
  "Factory New OEM",
  "As Removed (AR)",
];

const LEAD_TIME_PRESETS = [
  "Immediate / Same-Day Dispatch (AOG Express)",
  "24–48 Business Hours",
  "3–5 Business Days",
  "7–10 Business Days",
  "Subject to Core Return",
];

const TRACE_PRESETS = [
  "FAA 8130-3 & EASA Form 1 Dual Release",
  "FAA 8130-3 Single Release",
  "EASA Form 1 Single Release",
  "OEM Certificate of Conformity (C of C)",
  "Full Trace to Birth / 121 Operator",
];

function AdminPartsRequests() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("All");
  const [quoteTarget, setQuoteTarget] = useState<PartsRequest | null>(null);

  // Quote modal form state
  const [quotedPrice, setQuotedPrice] = useState("");
  const [quotedCondition, setQuotedCondition] = useState(CONDITION_PRESETS[0]);
  const [quotedLeadTime, setQuotedLeadTime] = useState(LEAD_TIME_PRESETS[0]);
  const [quotedTraceDocs, setQuotedTraceDocs] = useState(TRACE_PRESETS[0]);
  const [quotedHandlingFee, setQuotedHandlingFee] = useState("$250 (Non-member standard)");
  const [quotedNotes, setQuotedNotes] = useState("");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-parts-requests"],
    queryFn: () => getPartsRequests(),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updatePartsRequestStatus({ data: { id, status } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-parts-requests"] });
      toast.success("Request status updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    },
  });

  const sendQuoteMutation = useMutation({
    mutationFn: (payload: {
      id: string;
      quotedPrice: string;
      quotedCondition: string;
      quotedLeadTime: string;
      quotedTraceDocs: string;
      quotedHandlingFee?: string;
      quotedNotes?: string;
    }) => sendPartsRequestQuote({ data: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-parts-requests"] });
      toast.success(`Official quote dispatched to ${quoteTarget?.email}!`);
      setQuoteTarget(null);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to send quote");
    },
  });

  function openQuoteModal(req: PartsRequest) {
    setQuoteTarget(req);
    setQuotedPrice(req.quotedPrice || "");
    setQuotedCondition(req.quotedCondition || req.condition || CONDITION_PRESETS[0]);
    setQuotedLeadTime(req.quotedLeadTime || LEAD_TIME_PRESETS[0]);
    setQuotedTraceDocs(req.quotedTraceDocs || TRACE_PRESETS[0]);
    setQuotedHandlingFee(req.quotedHandlingFee || "$250 (Non-member standard)");
    setQuotedNotes(req.quotedNotes || "");
  }

  function handleSendQuoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quoteTarget) return;
    if (!quotedPrice.trim()) {
      toast.error("Please enter a quoted price");
      return;
    }

    sendQuoteMutation.mutate({
      id: quoteTarget.id,
      quotedPrice: quotedPrice.trim(),
      quotedCondition,
      quotedLeadTime,
      quotedTraceDocs,
      quotedHandlingFee: quotedHandlingFee.trim() || undefined,
      quotedNotes: quotedNotes.trim() || undefined,
    });
  }

  const totalCount = requests.length;
  const newCount = requests.filter((r) => r.status === "New").length;
  const inSourcingCount = requests.filter((r) => r.status === "In Sourcing").length;
  const quotedCount = requests.filter((r) => r.status === "Quoted").length;

  const filteredRequests =
    filter === "All" ? requests : requests.filter((r) => r.status === filter);

  return (
    <AppShell variant="admin">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Parts Sourcing Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">
              One-off sourcing enquiries submitted by operators and aircraft buyers
            </p>
          </div>
          <div className="flex items-center gap-3">
            {newCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent-foreground border border-accent/30 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                {newCount} New Request{newCount === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Requests</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{totalCount}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New (Unprocessed)</div>
            <div className="mt-1 text-2xl font-bold text-amber-500">{newCount}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">In Sourcing</div>
            <div className="mt-1 text-2xl font-bold text-sky-500">{inSourcingCount}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quoted</div>
            <div className="mt-1 text-2xl font-bold text-emerald-500">{quotedCount}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-border pb-2 mb-6 overflow-x-auto">
          {["All", "New", "In Sourcing", "Quoted", "Completed", "Cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === s
                  ? "bg-[#001b2e] text-white font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading requests…</div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-base font-medium text-foreground">No parts requests found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filter === "All"
                ? "No one-off parts requests have been submitted yet."
                : `No requests with status "${filter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => {
              const isAog = req.urgency.toLowerCase().includes("aog");
              const createdDate = new Date(req.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              });
              const quotedDate = req.quotedAt
                ? new Date(req.quotedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : null;

              return (
                <div
                  key={req.id}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-accent/40"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Part & Aircraft Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm font-bold text-foreground bg-muted px-2.5 py-1 rounded-md">
                          {req.partNumber}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {req.reference}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isAog
                              ? "bg-red-500/10 text-red-600 border border-red-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {req.urgency}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                          {req.condition}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {createdDate}
                        </span>
                      </div>

                      {req.partDescription && (
                        <p className="text-sm text-foreground/80 font-medium">
                          {req.partDescription}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Plane className="h-3.5 w-3.5 text-muted-foreground/70" />
                          <span>
                            {req.aircraftType} {req.aircraftReg ? `(${req.aircraftReg})` : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                          <span>Delivering to: <strong className="text-foreground">{req.deliveryLocation}</strong></span>
                        </div>
                        {req.company && (
                          <div className="flex items-center gap-1.5">
                            <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                            <span>{req.company}</span>
                          </div>
                        )}
                      </div>

                      {req.additionalNotes && (
                        <div className="mt-2 rounded bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/50">
                          <strong className="text-foreground">Notes:</strong> {req.additionalNotes}
                        </div>
                      )}

                      {/* Display Existing Quote Card if already Quoted */}
                      {req.quotedPrice && (
                        <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-xs">
                          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                            <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Quote Dispatched: <strong className="text-foreground text-sm font-bold">{req.quotedPrice}</strong></span>
                            </div>
                            {quotedDate && (
                              <span className="text-[11px] text-muted-foreground">
                                Quoted on {quotedDate}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-muted-foreground pt-1 border-t border-emerald-500/15">
                            <div><strong>Condition:</strong> {req.quotedCondition || "Certified"}</div>
                            <div><strong>Lead Time:</strong> {req.quotedLeadTime || "Available"}</div>
                            <div><strong>Docs:</strong> {req.quotedTraceDocs || "FAA 8130-3"}</div>
                          </div>
                          {req.quotedNotes && (
                            <div className="mt-1.5 text-muted-foreground">
                              <strong>Logistics Note:</strong> {req.quotedNotes}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Requester Contact & Actions */}
                    <div className="lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-5 space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-foreground">{req.name}</div>
                        <div className="mt-1 space-y-1 text-xs">
                          <a
                            href={`mailto:${req.email}?subject=Re:%20Aircraft%20Program%20Parts%20Request%20${req.reference}%20—%20${req.partNumber}`}
                            className="flex items-center gap-1.5 text-accent hover:underline"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate">{req.email}</span>
                          </a>
                          {req.phone && (
                            <a
                              href={`tel:${req.phone}`}
                              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              <span>{req.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Primary Action: Reply with Quote */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => openQuoteModal(req)}
                          className="w-full flex items-center justify-center gap-2 rounded-md bg-[#001b2e] hover:bg-[#002845] text-white px-3 py-2 text-xs font-semibold shadow-xs transition-colors"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>{req.quotedPrice ? "Update / Resend Quote" : "Reply with Quote"}</span>
                        </button>
                      </div>

                      {/* Status Selector */}
                      <div className="pt-2 border-t border-border/60">
                        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                          Pipeline Status:
                        </label>
                        <select
                          value={req.status}
                          onChange={(e) =>
                            mutation.mutate({ id: req.id, status: e.target.value })
                          }
                          disabled={mutation.isPending}
                          className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Reply with Quote Modal ────────────────────────────────────────── */}
        {quoteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-2xl my-8">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted text-[11px] font-mono text-muted-foreground mb-1">
                    {quoteTarget.reference}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Send Official Parts Quotation
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quoting <strong>{quoteTarget.partNumber}</strong> to <strong>{quoteTarget.name}</strong> ({quoteTarget.email})
                  </p>
                </div>
                <button
                  onClick={() => setQuoteTarget(null)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSendQuoteSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Quoted Price */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Quoted Price (US$) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={quotedPrice}
                        onChange={(e) => setQuotedPrice(e.target.value)}
                        placeholder="e.g. $4,250"
                        className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Part Condition *
                    </label>
                    <select
                      value={quotedCondition}
                      onChange={(e) => setQuotedCondition(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {CONDITION_PRESETS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Lead Time / Dispatch */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Availability / Lead Time *
                    </label>
                    <select
                      value={quotedLeadTime}
                      onChange={(e) => setQuotedLeadTime(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {LEAD_TIME_PRESETS.map((lt) => (
                        <option key={lt} value={lt}>{lt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Trace Documents */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Airworthiness Trace Docs *
                    </label>
                    <select
                      value={quotedTraceDocs}
                      onChange={(e) => setQuotedTraceDocs(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {TRACE_PRESETS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Handling Fee */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Sourcing / Handling Fee (Optional)
                  </label>
                  <input
                    type="text"
                    value={quotedHandlingFee}
                    onChange={(e) => setQuotedHandlingFee(e.target.value)}
                    placeholder="e.g. $250 (Waived for enrolled aircraft)"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Standard non-enrolled fee is US$150–$250. Can be marked as "Included in Price" or itemized.
                  </p>
                </div>

                {/* Dispatch & Logistics Notes */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Logistics / Hangar Notes for Client (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={quotedNotes}
                    onChange={(e) => setQuotedNotes(e.target.value)}
                    placeholder="e.g. Sourced from FAA/EASA distributor in Luton. Ready for courier pickup to Luton FBO."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                </div>

                {/* Info Notice */}
                <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>
                    Sending this quote will automatically email the client with an official quotation from <strong>ops@aircraftprogram.com</strong> and set the status to <strong>Quoted</strong>. A copy will also be sent to <strong>jmoon@moonjetgroup.com</strong>.
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setQuoteTarget(null)}
                    className="rounded-md border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendQuoteMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-md bg-[#001b2e] hover:bg-[#002845] text-white px-5 py-2 text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
                  >
                    {sendQuoteMutation.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Sending Quote…</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Send Official Quote to Client</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
