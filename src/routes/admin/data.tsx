import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ensureAdminSession,
  getUsmSignals,
  upsertUsmSignal,
  deleteUsmSignal,
  getCaseFailureLogs,
  createCaseFailureLog,
} from "@/lib/app.functions";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/admin/data")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminDataPage,
});

type Tab = "usm" | "failures";

function AdminDataPage() {
  const [tab, setTab] = useState<Tab>("usm");

  return (
    <AppShell variant="admin">
      <div className="max-w-5xl">
        <h1 className="text-xl font-semibold mb-5">Data Management</h1>
        <div className="flex gap-1 border-b border-border mb-6">
          {(
            [
              ["usm", "USM Market Signals"],
              ["failures", "Case Failure Log"],
            ] as [Tab, string][]
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "usm" ? <UsmTab /> : <FailureLogTab />}
      </div>
    </AppShell>
  );
}

function UsmTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [csvInput, setCsvInput] = useState("");
  const [form, setForm] = useState({
    partNumber: "",
    aircraftType: "",
    description: "",
    availabilityPct: "50",
    trend: "stable",
    supplierCount: "0",
    priceCents: "0",
    currency: "usd",
    riskScore: "30",
    notes: "",
  });

  const { data: signals = [] } = useQuery({
    queryKey: ["usm-signals"],
    queryFn: () => getUsmSignals(),
  });

  const upsertMutation = useMutation({
    mutationFn: () =>
      upsertUsmSignal({
        data: {
          ...form,
          availabilityPct: parseInt(form.availabilityPct),
          supplierCount: parseInt(form.supplierCount),
          priceCents: parseInt(form.priceCents),
          riskScore: parseInt(form.riskScore),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usm-signals"] });
      queryClient.invalidateQueries({ queryKey: ["usm-signals-public"] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUsmSignal({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usm-signals"] });
      queryClient.invalidateQueries({ queryKey: ["usm-signals-public"] });
    },
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      const rows = csvInput
        .split(/\r?\n/)
        .map((row) => row.trim())
        .filter(Boolean);
      const [, ...dataRows] =
        rows[0]?.toLowerCase().includes("part") ? rows : ["partNumber,aircraftType,description,availabilityPct,trend,supplierCount,priceCents,currency,riskScore,notes", ...rows];

      await Promise.all(
        dataRows.map((row) => {
          const [
            partNumber,
            aircraftType = "",
            description = "",
            availabilityPct = "50",
            trend = "stable",
            supplierCount = "0",
            priceCents = "0",
            currency = "usd",
            riskScore = "30",
            notes = "",
          ] = row.split(",").map((v) => v.trim());
          return upsertUsmSignal({
            data: {
              partNumber,
              aircraftType,
              description,
              availabilityPct: Number(availabilityPct) || 0,
              trend,
              supplierCount: Number(supplierCount) || 0,
              priceCents: Number(priceCents) || 0,
              currency,
              riskScore: Number(riskScore) || 0,
              notes,
            },
          });
        }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usm-signals"] });
      queryClient.invalidateQueries({ queryKey: ["usm-signals-public"] });
      setShowImport(false);
      setCsvInput("");
    },
  });

  return (
    <div>
      <div className="mb-4 rounded-lg border border-border bg-muted/20 p-4">
        <p className="text-sm font-semibold">Market signal workflow</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Add signals manually for now or paste CSV rows from supplier/market checks. These records
          immediately feed the subscriber Parts Intelligence page. Future supplier/API feeds can
          write into the same signal table.
        </p>
      </div>

      <div className="flex flex-wrap justify-end gap-2 mb-4">
        <button
          onClick={() => setShowImport(!showImport)}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-card text-sm font-medium hover:bg-muted/60"
        >
          Bulk import CSV
        </button>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add signal
        </button>
      </div>

      {showImport && (
        <div className="bg-card border border-border rounded-lg p-5 mb-6">
          <label className="text-xs font-medium text-muted-foreground">
            CSV rows: partNumber, aircraftType, description, availabilityPct, trend, supplierCount,
            priceCents, currency, riskScore, notes
          </label>
          <textarea
            rows={5}
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            placeholder="PN-123,Citation CJ4,Hydraulic pump,35,rising,2,1250000,usd,78,Supplier stock thinning"
            className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => importMutation.mutate()}
              disabled={!csvInput.trim() || importMutation.isPending}
              className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {importMutation.isPending ? "Importing…" : "Import signals"}
            </button>
            <button
              onClick={() => setShowImport(false)}
              className="px-4 py-2 rounded border border-border text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-5 mb-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "partNumber", label: "Part number", placeholder: "3-1454-0002" },
              { key: "aircraftType", label: "Aircraft type", placeholder: "Citation CJ4" },
              { key: "description", label: "Description", placeholder: "Hydraulic pump" },
              {
                key: "availabilityPct",
                label: "Availability %",
                placeholder: "50",
                type: "number",
              },
              {
                key: "trend",
                label: "Trend",
                placeholder: "",
                type: "select",
                options: ["stable", "rising", "falling"],
              },
              { key: "supplierCount", label: "Supplier count", placeholder: "5", type: "number" },
              { key: "priceCents", label: "Price (cents)", placeholder: "500000", type: "number" },
              { key: "currency", label: "Currency", placeholder: "usd" },
              { key: "riskScore", label: "Risk score (0–100)", placeholder: "30", type: "number" },
            ].map(({ key, label, placeholder, type, options }) => (
              <div key={key}>
                <label className="text-xs text-muted-foreground">{label}</label>
                {type === "select" ? (
                  <select
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
                  >
                    {options!.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type ?? "text"}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
                  />
                )}
              </div>
            ))}
            <div className="col-span-3">
              <label className="text-xs text-muted-foreground">Notes</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => upsertMutation.mutate()}
              disabled={!form.partNumber || upsertMutation.isPending}
              className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {upsertMutation.isPending ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded border border-border text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Part number", "Aircraft type", "Avail %", "Trend", "Suppliers", "Risk", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {(signals as any[]).map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium">{s.partNumber}</td>
                <td className="px-3 py-2 text-muted-foreground">{s.aircraftType || "—"}</td>
                <td className="px-3 py-2">{s.availabilityPct}%</td>
                <td className="px-3 py-2 capitalize">{s.trend}</td>
                <td className="px-3 py-2">{s.supplierCount}</td>
                <td className="px-3 py-2">
                  <span
                    className={`font-semibold ${s.riskScore >= 70 ? "text-destructive" : s.riskScore >= 40 ? "text-amber-500" : "text-emerald-600"}`}
                  >
                    {s.riskScore}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => deleteMutation.mutate(s.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {signals.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No signals yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FailureLogTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [failureCause, setFailureCause] = useState("");
  const [hoursAtFailure, setHoursAtFailure] = useState("");
  const [coFailureNotes, setCoFailureNotes] = useState("");

  const { data: logs = [] } = useQuery({
    queryKey: ["case-failure-logs"],
    queryFn: () => getCaseFailureLogs(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createCaseFailureLog({ data: { requestId, failureCause, hoursAtFailure, coFailureNotes } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-failure-logs"] });
      setShowForm(false);
      setRequestId("");
      setFailureCause("");
      setHoursAtFailure("");
      setCoFailureNotes("");
    },
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Log failure
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-5 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Case ID</label>
              <input
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Hours at failure</label>
              <input
                value={hoursAtFailure}
                onChange={(e) => setHoursAtFailure(e.target.value)}
                className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground">Failure cause</label>
              <input
                value={failureCause}
                onChange={(e) => setFailureCause(e.target.value)}
                className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground">Co-failure notes</label>
              <textarea
                rows={2}
                value={coFailureNotes}
                onChange={(e) => setCoFailureNotes(e.target.value)}
                className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm resize-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => createMutation.mutate()}
              disabled={!requestId || !failureCause || createMutation.isPending}
              className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {createMutation.isPending ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded border border-border text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Case", "Failure cause", "Hours", "Notes", "Logged"].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(logs as any[]).map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-mono text-xs">{l.requestId.slice(-8)}</td>
                <td className="px-3 py-2">{l.failureCause}</td>
                <td className="px-3 py-2 text-muted-foreground">{l.hoursAtFailure || "—"}</td>
                <td className="px-3 py-2 text-muted-foreground text-xs">
                  {l.coFailureNotes || "—"}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {new Date(l.loggedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No failure logs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
