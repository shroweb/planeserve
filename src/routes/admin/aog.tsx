import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureAdminSession,
  getAdminAogWithQuotes,
  updateAogStatus,
  toggleExceptionState,
  addSupplierQuote,
  removeSupplierQuote,
  updateFreightTracking,
  getAogStatusEventsAdmin,
  createAdminNote,
  getAdminNotes,
  assignCaseHandler,
  updateAwbNumber,
  updateHandoverNotes,
  apiSchemas,
  AogCaseDetail,
  SupplierQuoteRecord,
} from "@/lib/app.functions";
import { AogStatus, SupplierCondition } from "@/lib/db/schema";
import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/aog")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminAog,
});

const statuses = apiSchemas.status.options;
const exceptionStates = [
  "Part unavailable",
  "Export restriction",
  "MEL review required",
  "Awaiting customs clearance",
  "Core charge outstanding",
];
const conditions: SupplierCondition[] = [
  "Serviceable",
  "Exchange",
  "Overhauled",
  "New",
  "As Removed",
];
const filters = ["All", ...statuses] as const;

function AdminAog() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-aog-with-quotes"],
    queryFn: () => getAdminAogWithQuotes(),
    // Poll so new cases appear and the 10-minute SLA escalation banner goes
    // live without the handler needing to manually refresh.
    refetchInterval: 30_000,
  });
  const requests = data?.requests ?? [];
  const adminUsers = data?.adminUsers ?? [];
  const visibleRequests = filter === "All" ? requests : requests.filter((r) => r.status === filter);
  const sortedRequests = [...visibleRequests].sort(
    (a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0),
  );

  const selectedCase = requests.find((r) => r.id === selectedId) ?? null;

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: AogStatus }) => updateAogStatus({ data: input }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-aog-with-quotes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-status-events", vars.id] });
      if (vars.status === "Resolved") {
        const c = requests.find((r) => r.id === vars.id);
        if (c?.partNumber) {
          toast.success(`Part ${c.partNumber} logged to Parts Passport for ${c.registration}.`);
        } else {
          toast.success("Case resolved.");
        }
      }
    },
  });

  const exceptionMutation = useMutation({
    mutationFn: (input: { id: string; state: string }) => toggleExceptionState({ data: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-aog-with-quotes"] }),
  });

  return (
    <AppShell variant="admin">
      <div className="flex h-full flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">AOG Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Triage, update and resolve operational AOG cases.
          </p>
        </div>
        {/* 10-minute escalation banner */}
        {(() => {
          const tenMinAgo = Date.now() - 10 * 60 * 1000;
          const unacknowledged = requests.filter(
            (r) => r.status === "Submitted" && new Date(r.createdAt).getTime() < tenMinAgo,
          );
          if (unacknowledged.length === 0) return null;
          return (
            <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="animate-pulse inline-block h-2.5 w-2.5 rounded-full bg-destructive" />
                <span className="font-semibold text-destructive text-sm">
                  ESCALATION — {unacknowledged.length} case{unacknowledged.length > 1 ? "s" : ""}{" "}
                  unacknowledged for 10+ minutes. Any available handler please action immediately.
                </span>
              </div>
              <ul className="ml-5 space-y-1">
                {unacknowledged.map((r) => {
                  const elapsedMin = Math.floor(
                    (Date.now() - new Date(r.createdAt).getTime()) / 60000,
                  );
                  return (
                    <li key={r.id}>
                      <button
                        onClick={() => setSelectedId(r.id)}
                        className="text-xs text-destructive underline hover:no-underline"
                      >
                        {r.registration} — {r.affectedSystem} ({elapsedMin} mins)
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })()}
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-sm border px-3 py-2 text-xs font-medium ${
                filter === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-1 gap-4 min-h-0">
          {/* Case queue */}
          <div
            className={`overflow-x-auto rounded-md border border-border bg-card transition-all ${
              selectedCase ? "w-[520px] shrink-0" : "flex-1"
            }`}
          >
            <table className="w-full min-w-[480px] text-sm">
              <thead className="bg-muted/60 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <Th>Priority</Th>
                  <Th>Aircraft / Issue</Th>
                  <Th>Urgency</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {sortedRequests.map((r) => {
                  const tenMinAgo = Date.now() - 10 * 60 * 1000;
                  const isUnacknowledged =
                    r.status === "Submitted" && new Date(r.createdAt).getTime() < tenMinAgo;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedId(r.id === selectedId ? null : r.id)}
                      className={`cursor-pointer border-t border-border align-top transition-colors hover:bg-muted/30 ${
                        r.id === selectedId ? "bg-muted/50" : ""
                      }`}
                    >
                      <Td>
                        <div className="flex items-center gap-2">
                          {isUnacknowledged && (
                            <span className="animate-pulse inline-block h-2 w-2 shrink-0 rounded-full bg-destructive" />
                          )}
                          <PriorityBadge score={r.priorityScore ?? 0} />
                        </div>
                      </Td>
                      <Td>
                        <div className="font-mono font-semibold tracking-wide">
                          {r.registration}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{r.affectedSystem}</div>
                        {r.partNumber && (
                          <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                            PN {r.partNumber}
                          </div>
                        )}
                      </Td>
                      <Td>
                        <UrgencyBadge urgency={r.urgency} />
                        <div className="mt-1 text-[10px] text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </Td>
                      <Td>
                        <StatusBadge status={r.status} />
                        {(r.exceptionStates?.length ?? 0) > 0 && (
                          <div className="mt-1 text-[10px] font-semibold text-destructive">
                            {r.exceptionStates!.length} exception
                            {r.exceptionStates!.length > 1 ? "s" : ""}
                          </div>
                        )}
                      </Td>
                      <Td>
                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            r.id === selectedId ? "rotate-90" : ""
                          }`}
                        />
                      </Td>
                    </tr>
                  );
                })}
                {!sortedRequests.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-muted-foreground"
                    >
                      No AOG requests match this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selectedCase && (
            <div className="flex-1 overflow-y-auto rounded-md border border-border bg-card">
              <CaseDetailPanel
                case_={selectedCase}
                onClose={() => setSelectedId(null)}
                statusMutation={statusMutation}
                exceptionMutation={exceptionMutation}
                adminUsers={adminUsers}
              />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function CaseDetailPanel({
  case_,
  onClose,
  statusMutation,
  exceptionMutation,
  adminUsers,
}: {
  case_: AogCaseDetail;
  onClose: () => void;
  statusMutation: ReturnType<
    typeof useMutation<unknown, unknown, { id: string; status: AogStatus }>
  >;
  exceptionMutation: ReturnType<
    typeof useMutation<unknown, unknown, { id: string; state: string }>
  >;
  adminUsers: { userId: string; name: string }[];
}) {
  const queryClient = useQueryClient();

  const addQuoteMutation = useMutation({
    mutationFn: (data: Parameters<typeof addSupplierQuote>[0]["data"]) =>
      addSupplierQuote({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-aog-with-quotes"] }),
  });

  const removeQuoteMutation = useMutation({
    mutationFn: (quoteId: string) => removeSupplierQuote({ data: { id: quoteId } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-aog-with-quotes"] }),
  });

  const { data: statusEvents } = useQuery({
    queryKey: ["admin-status-events", case_.id],
    queryFn: () => getAogStatusEventsAdmin({ data: { requestId: case_.id } }),
  });

  const { data: adminNotes, refetch: refetchNotes } = useQuery({
    queryKey: ["admin-notes", case_.id],
    queryFn: () => getAdminNotes({ data: { subjectType: "aog_request", subjectId: case_.id } }),
  });

  const notesMutation = useMutation({
    mutationFn: (note: string) =>
      createAdminNote({ data: { subjectType: "aog_request", subjectId: case_.id, note } }),
    onSuccess: () => refetchNotes(),
  });

  const [noteText, setNoteText] = useState("");

  const handlerMutation = useMutation({
    mutationFn: (handlerId: string) =>
      assignCaseHandler({ data: { requestId: case_.id, handlerId } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-aog-with-quotes"] }),
  });

  const awbMutation = useMutation({
    mutationFn: (awbNumber: string) =>
      updateAwbNumber({ data: { requestId: case_.id, awbNumber } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-aog-with-quotes"] }),
  });
  const [awbInput, setAwbInput] = useState(case_.awbNumber ?? "");

  const handoverMutation = useMutation({
    mutationFn: (notes: string) => updateHandoverNotes({ data: { requestId: case_.id, notes } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-aog-with-quotes"] }),
  });
  const [handoverInput, setHandoverInput] = useState(case_.handoverNotes ?? "");

  const freightMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateFreightTracking>[0]["data"]) =>
      updateFreightTracking({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-aog-with-quotes"] }),
  });

  const [freightForm, setFreightForm] = useState({
    freightCourier: case_.freightCourier ?? "",
    freightTrackingRef: case_.freightTrackingRef ?? "",
    freightExpectedArrival: case_.freightExpectedArrival
      ? new Date(case_.freightExpectedArrival).toISOString().slice(0, 10)
      : "",
    freightNotes: case_.freightNotes ?? "",
  });

  function updateFreight<K extends keyof typeof freightForm>(k: K, v: (typeof freightForm)[K]) {
    setFreightForm((f) => ({ ...f, [k]: v }));
  }

  const [quoteForm, setQuoteForm] = useState({
    supplierName: "",
    condition: "Serviceable" as SupplierCondition,
    netPrice: "",
    currency: "USD",
    marginPct: 8,
    leadTime: "",
    paperwork: "",
    freightRoute: "",
    notes: "",
  });

  function updateQuote<K extends keyof typeof quoteForm>(k: K, v: (typeof quoteForm)[K]) {
    setQuoteForm((f) => ({ ...f, [k]: v }));
  }

  const netPriceNum = parseFloat(quoteForm.netPrice) || 0;
  const subscriberPrice = netPriceNum > 0 ? netPriceNum * (1 + quoteForm.marginPct / 100) : 0;

  async function submitQuote(e: React.FormEvent) {
    e.preventDefault();
    if (!quoteForm.supplierName || !quoteForm.netPrice) return;
    await addQuoteMutation.mutateAsync({
      requestId: case_.id,
      supplierName: quoteForm.supplierName,
      condition: quoteForm.condition,
      priceCents: Math.round(subscriberPrice * 100),
      netPriceCents: Math.round(netPriceNum * 100),
      currency: quoteForm.currency.toLowerCase(),
      leadTime: quoteForm.leadTime,
      paperwork: quoteForm.paperwork,
      freightRoute: quoteForm.freightRoute,
      notes: quoteForm.notes,
    });
    setQuoteForm({
      supplierName: "",
      condition: "Serviceable",
      netPrice: "",
      currency: "USD",
      marginPct: 8,
      leadTime: "",
      paperwork: "",
      freightRoute: "",
      notes: "",
    });
  }

  const r = case_;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[11px] text-muted-foreground">{r.id}</div>
          <div className="mt-1 text-xl font-semibold tracking-tight">
            {r.registration}{" "}
            <span className="font-normal text-muted-foreground">— {r.affectedSystem}</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{r.aircraftType}</div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Priority + status row */}
      <div className="grid grid-cols-3 gap-3">
        <KV label="Priority score">
          <PriorityBadge score={r.priorityScore ?? 0} />
        </KV>
        <KV label="Urgency">
          <UrgencyBadge urgency={r.urgency} />
        </KV>
        <KV label="Submitted">
          {new Date(r.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </KV>
      </div>

      {/* Status control */}
      <Section title="Status">
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={r.status}
            onChange={(e) =>
              statusMutation.mutate({ id: r.id, status: e.target.value as AogStatus })
            }
            className="rounded-sm border border-input bg-background px-3 py-2 text-sm"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => statusMutation.mutate({ id: r.id, status: "Resolved" })}
            className="rounded-sm border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
          >
            Mark Resolved
          </button>
          {!r.partNumber && (
            <p className="w-full text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2.5 py-1.5">
              Add a part number before resolving to ensure it's logged to the Parts Passport.
            </p>
          )}
          {r.quotes.length > 0 && r.status === "Sourcing" && (
            <button
              onClick={() => statusMutation.mutate({ id: r.id, status: "Options ready" })}
              className="rounded-sm bg-accent px-3 py-2 text-xs font-medium text-[oklch(0.16_0.02_250)]"
            >
              Mark Options Ready
            </button>
          )}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <QField label="Handler">
            <select
              value={r.handlerId ?? ""}
              onChange={(e) => handlerMutation.mutate(e.target.value)}
              className="rounded-sm border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Unassigned</option>
              {adminUsers.map((u: any) => (
                <option key={u.userId} value={u.userId}>
                  {u.name}
                </option>
              ))}
            </select>
          </QField>
        </div>
        {(r.status === "In transit" || r.status === "Order placed") && (
          <div className="mt-3 flex items-end gap-2">
            <QField label="AWB / tracking number">
              <input
                value={awbInput}
                onChange={(e) => setAwbInput(e.target.value)}
                placeholder="e.g. 125-12345678"
                className="w-56 rounded-sm border border-input bg-background px-3 py-1.5 text-sm"
              />
            </QField>
            <button
              onClick={() => awbMutation.mutate(awbInput)}
              disabled={awbMutation.isPending}
              className="rounded-sm bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50 mb-0.5"
            >
              Save AWB
            </button>
          </div>
        )}
        {r.caseRating && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Case rating:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`text-sm ${s <= r.caseRating! ? "text-amber-400" : "text-muted-foreground/30"}`}
              >
                ★
              </span>
            ))}
            {r.caseRatingComment && (
              <span className="text-xs text-muted-foreground italic">"{r.caseRatingComment}"</span>
            )}
          </div>
        )}
      </Section>

      {/* Issue detail */}
      <Section title="Issue description">
        <p className="text-sm leading-6 text-foreground">{r.issueDescription}</p>
        {r.ataChapter && (
          <div className="mt-3 text-xs">
            <span className="font-semibold uppercase tracking-widest text-muted-foreground">
              ATA Chapter:{" "}
            </span>
            {r.ataChapter}
          </div>
        )}
        {r.partNumber && (
          <div className="mt-1 font-mono text-xs text-muted-foreground">PN {r.partNumber}</div>
        )}
        {r.location && (
          <div className="mt-1 text-xs text-muted-foreground">Location: {r.location}</div>
        )}
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <KV label="Name">{r.contactName || "—"}</KV>
          <KV label="Phone">{r.contactPhone || "—"}</KV>
          <KV label="Email">{r.contactEmail || "—"}</KV>
        </div>
      </Section>

      {/* Documents */}
      <Section title="Document vault">
        <div className="grid grid-cols-3 gap-3">
          {(r.requiredDocuments ?? []).map((doc) => (
            <div key={doc.name} className="rounded-sm border border-border p-3">
              <div className="text-xs font-medium">{doc.name}</div>
              <div
                className={`mt-1 text-[11px] ${
                  doc.status === "Verified"
                    ? "text-[oklch(0.38_0.11_150)]"
                    : doc.status === "Uploaded"
                      ? "text-accent"
                      : "text-destructive"
                }`}
              >
                {doc.status}
              </div>
            </div>
          ))}
        </div>
        {(r.attachments?.length ?? 0) > 0 && (
          <div className="mt-3 text-xs text-muted-foreground">
            {r.attachments!.length} attachment{r.attachments!.length > 1 ? "s" : ""} submitted
          </div>
        )}
      </Section>

      {/* Exception flags */}
      <Section title="Exception flags">
        <div className="flex flex-col gap-2">
          {exceptionStates.map((state) => (
            <label key={state} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={r.exceptionStates?.includes(state)}
                onChange={() => exceptionMutation.mutate({ id: r.id, state })}
                className="h-3.5 w-3.5 rounded border-gray-300"
              />
              <span
                className={
                  r.exceptionStates?.includes(state)
                    ? "text-destructive font-semibold"
                    : "text-muted-foreground"
                }
              >
                {state}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Status event log */}
      <Section title="Status event log">
        {(statusEvents?.length ?? 0) === 0 ? (
          <p className="text-xs text-muted-foreground">No events recorded yet.</p>
        ) : (
          <ol className="relative space-y-0 border-l border-border pl-4">
            {(statusEvents ?? []).map((e, i, arr) => {
              const isLast = i === arr.length - 1;
              const ts = new Date(e.createdAt);
              return (
                <li key={e.id} className="pb-4 last:pb-0">
                  <span
                    className={`absolute -left-[4px] mt-0.5 h-2 w-2 rounded-full border ${
                      isLast ? "border-accent bg-accent" : "border-border bg-background"
                    }`}
                  />
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-xs font-semibold ${isLast ? "text-accent" : "text-foreground"}`}
                    >
                      {e.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {ts.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}{" "}
                      {ts.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {e.note && <p className="mt-0.5 text-[11px] text-muted-foreground">{e.note}</p>}
                </li>
              );
            })}
          </ol>
        )}
      </Section>

      {/* Admin notes */}
      <Section title="Admin notes">
        {(adminNotes?.length ?? 0) > 0 && (
          <ol className="mb-4 space-y-2">
            {(adminNotes ?? []).map((n) => (
              <li key={n.id} className="rounded-sm border border-border bg-background p-3">
                <p className="text-xs leading-5 text-foreground">{n.note}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {new Date(n.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  {new Date(n.createdAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ol>
        )}
        <div className="flex gap-2">
          <input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note…"
            className="flex-1 rounded-sm border border-input bg-background px-3 py-1.5 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && noteText.trim()) {
                notesMutation.mutate(noteText.trim());
                setNoteText("");
              }
            }}
          />
          <button
            disabled={!noteText.trim() || notesMutation.isPending}
            onClick={() => {
              if (noteText.trim()) {
                notesMutation.mutate(noteText.trim());
                setNoteText("");
              }
            }}
            className="rounded-sm bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </Section>

      {/* Freight tracking */}
      <Section title="Freight tracking">
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <QField label="Courier">
              <input
                value={freightForm.freightCourier}
                onChange={(e) => updateFreight("freightCourier", e.target.value)}
                placeholder="e.g. DHL, FedEx"
                className="w-full rounded-sm border border-input bg-background px-3 py-1.5 text-sm"
              />
            </QField>
            <QField label="Tracking reference">
              <input
                value={freightForm.freightTrackingRef}
                onChange={(e) => updateFreight("freightTrackingRef", e.target.value)}
                placeholder="Tracking number"
                className="w-full rounded-sm border border-input bg-background px-3 py-1.5 text-sm"
              />
            </QField>
          </div>
          <QField label="Expected arrival">
            <input
              type="date"
              value={freightForm.freightExpectedArrival}
              onChange={(e) => updateFreight("freightExpectedArrival", e.target.value)}
              className="w-full rounded-sm border border-input bg-background px-3 py-1.5 text-sm"
            />
          </QField>
          <QField label="Freight notes">
            <input
              value={freightForm.freightNotes}
              onChange={(e) => updateFreight("freightNotes", e.target.value)}
              placeholder="Customs, routing, exceptions…"
              className="w-full rounded-sm border border-input bg-background px-3 py-1.5 text-sm"
            />
          </QField>
          <button
            onClick={() => freightMutation.mutate({ id: r.id, ...freightForm })}
            disabled={freightMutation.isPending}
            className="self-start rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-60"
          >
            {freightMutation.isPending ? "Saving…" : "Save freight details"}
          </button>
        </div>
      </Section>

      {/* Sourcing options */}
      <Section title="Sourcing options">
        {r.quotes.length > 0 && (
          <div className="mb-4 space-y-3">
            {r.quotes.map((q) => (
              <QuoteCard key={q.id} quote={q} onRemove={() => removeQuoteMutation.mutate(q.id)} />
            ))}
          </div>
        )}

        <div className="rounded-sm border border-border bg-background p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Add supplier quote
          </div>
          <form onSubmit={submitQuote} className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <QField label="Supplier name *">
                <input
                  required
                  value={quoteForm.supplierName}
                  onChange={(e) => updateQuote("supplierName", e.target.value)}
                  placeholder="e.g. Aviall, API Technologies"
                  className="w-full rounded-sm border border-input bg-card px-3 py-2 text-sm"
                />
              </QField>
              <QField label="Condition">
                <select
                  value={quoteForm.condition}
                  onChange={(e) => updateQuote("condition", e.target.value as SupplierCondition)}
                  className="w-full rounded-sm border border-input bg-card px-3 py-2 text-sm"
                >
                  {conditions.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </QField>
              <QField label="Net price (supplier) *">
                <div className="flex gap-2">
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={quoteForm.netPrice}
                    onChange={(e) => updateQuote("netPrice", e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-sm border border-input bg-card px-3 py-2 text-sm"
                  />
                  <select
                    value={quoteForm.currency}
                    onChange={(e) => updateQuote("currency", e.target.value)}
                    className="rounded-sm border border-input bg-card px-3 py-2 text-sm"
                  >
                    <option>USD</option>
                    <option>GBP</option>
                    <option>EUR</option>
                    <option>AUD</option>
                  </select>
                </div>
              </QField>
              <QField label="Margin %">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={quoteForm.marginPct}
                    onChange={(e) => updateQuote("marginPct", Number(e.target.value))}
                    className="w-20 rounded-sm border border-input bg-card px-3 py-2 text-sm"
                  />
                  {subscriberPrice > 0 && (
                    <span className="text-xs text-muted-foreground">
                      → Subscriber price:{" "}
                      <span className="font-semibold text-foreground">
                        {subscriberPrice.toLocaleString("en-US", {
                          style: "currency",
                          currency: quoteForm.currency,
                        })}
                      </span>
                      <span className="ml-1 text-[10px] text-muted-foreground/60">
                        (never shown to supplier)
                      </span>
                    </span>
                  )}
                </div>
              </QField>
              <QField label="Lead time">
                <input
                  value={quoteForm.leadTime}
                  onChange={(e) => updateQuote("leadTime", e.target.value)}
                  placeholder="e.g. 48h, 3–5 days"
                  className="w-full rounded-sm border border-input bg-card px-3 py-2 text-sm"
                />
              </QField>
              <QField label="Paperwork / certs">
                <input
                  value={quoteForm.paperwork}
                  onChange={(e) => updateQuote("paperwork", e.target.value)}
                  placeholder="e.g. 8130-3, EASA Form 1"
                  className="w-full rounded-sm border border-input bg-card px-3 py-2 text-sm"
                />
              </QField>
              <QField label="Freight route">
                <input
                  value={quoteForm.freightRoute}
                  onChange={(e) => updateQuote("freightRoute", e.target.value)}
                  placeholder="e.g. DHL Express LAX→LHR"
                  className="w-full rounded-sm border border-input bg-card px-3 py-2 text-sm"
                />
              </QField>
            </div>
            <QField label="Notes">
              <textarea
                rows={2}
                value={quoteForm.notes}
                onChange={(e) => updateQuote("notes", e.target.value)}
                placeholder="Any additional context for the subscriber"
                className="w-full rounded-sm border border-input bg-card px-3 py-2 text-sm"
              />
            </QField>
            <button
              type="submit"
              disabled={addQuoteMutation.isPending}
              className="self-start rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {addQuoteMutation.isPending ? "Adding…" : "Add quote"}
            </button>
          </form>
        </div>
      </Section>

      {/* Handover notes */}
      <Section title="Handover notes">
        <textarea
          rows={3}
          className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm resize-none"
          value={handoverInput}
          onChange={(e) => setHandoverInput(e.target.value)}
          placeholder="Notes for the next handler shift, escalations, agreed actions…"
        />
        <button
          onClick={() => handoverMutation.mutate(handoverInput)}
          disabled={handoverMutation.isPending}
          className="mt-2 rounded-sm bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
        >
          {handoverMutation.isPending ? "Saving…" : "Save notes"}
        </button>
      </Section>

      {/* Priority reasons */}
      {(r.priorityReasons?.length ?? 0) > 0 && (
        <Section title="Priority signals">
          <ul className="space-y-1">
            {r.priorityReasons!.map((reason) => (
              <li key={reason} className="text-xs text-muted-foreground">
                · {reason}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function QuoteCard({ quote, onRemove }: { quote: SupplierQuoteRecord; onRemove: () => void }) {
  const price = (quote.priceCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: quote.currency.toUpperCase(),
  });
  const netPrice =
    quote.netPriceCents > 0
      ? (quote.netPriceCents / 100).toLocaleString("en-US", {
          style: "currency",
          currency: quote.currency.toUpperCase(),
        })
      : null;
  return (
    <div className="rounded-sm border border-border bg-background p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-sm">{quote.supplierName}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {quote.condition} · Subscriber: {price}
            {netPrice && <span className="ml-2 text-muted-foreground">Net: {netPrice}</span>}
            {quote.leadTime ? ` · ${quote.leadTime}` : ""}
          </div>
          {quote.awbNumber && (
            <div className="mt-0.5 text-xs font-mono text-muted-foreground">
              AWB: {quote.awbNumber}
            </div>
          )}
        </div>
        {quote.approvedAt ? (
          <span className="rounded-sm border border-[oklch(0.38_0.11_150)]/30 bg-[oklch(0.96_0.06_150)] px-2 py-1 text-[11px] font-semibold text-[oklch(0.38_0.11_150)]">
            Approved
          </span>
        ) : (
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {(quote.paperwork || quote.freightRoute) && (
        <div className="mt-2 text-xs text-muted-foreground">
          {[quote.paperwork, quote.freightRoute].filter(Boolean).join(" · ")}
        </div>
      )}
      {quote.notes && (
        <div className="mt-2 text-xs text-muted-foreground italic">{quote.notes}</div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
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
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

function QField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-foreground/70">{label}</div>
      {children}
    </label>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-4 py-3 text-left font-semibold">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}

function PriorityBadge({ score }: { score: number }) {
  const tone =
    score >= 80
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : score >= 55
        ? "border-[oklch(0.8_0.12_80)] bg-[oklch(0.96_0.06_85)] text-[oklch(0.38_0.09_70)]"
        : "border-border bg-muted text-muted-foreground";
  return (
    <div className={`inline-flex rounded-sm border px-2 py-1 text-xs font-semibold ${tone}`}>
      {score}/100
    </div>
  );
}

function UrgencyBadge({ urgency }: { urgency: string }) {
  const isGrounded = urgency === "Aircraft grounded";
  const isDispatch = urgency === "Dispatch affected";
  return (
    <span
      className={`text-xs font-medium ${
        isGrounded
          ? "text-destructive"
          : isDispatch
            ? "text-[oklch(0.55_0.12_70)]"
            : "text-muted-foreground"
      }`}
    >
      {urgency}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-sm border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {status}
    </span>
  );
}
