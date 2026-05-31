import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { StatCard, StatusPill, RoleChip, BarMeter } from "@/components/app/ui";
import { ensureAdminSession, getAdminOverview, getStripeAdminData } from "@/lib/app.functions";
import {
  AlertTriangle,
  Activity,
  Clock,
  CheckCircle2,
  DollarSign,
  Network,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminOverview,
});

const STATUS_TONE: Record<string, "red" | "gold" | "blue" | "green" | "neutral"> = {
  Submitted: "gold",
  Acknowledged: "gold",
  Sourcing: "blue",
  "Options ready": "blue",
  "Awaiting approval": "blue",
  Confirmed: "blue",
  "Order placed": "blue",
  "In transit": "blue",
  Arrived: "green",
  Resolved: "green",
  Cancelled: "neutral",
};

function AdminOverview() {
  const { data } = useQuery({ queryKey: ["admin-overview"], queryFn: () => getAdminOverview() });
  const { data: stripe } = useQuery({
    queryKey: ["stripe-admin"],
    queryFn: () => getStripeAdminData(),
    staleTime: 60_000,
  });

  const users = data?.users ?? [];
  const aircraft = data?.aircraft ?? [];
  const requests = data?.requests ?? [];
  const metrics = data?.metrics;
  const pendingEnrolments = data?.pendingEnrolments ?? [];

  const openRequests = requests.filter((r) => r.status !== "Resolved" && r.status !== "Cancelled");
  const now = Date.now();
  // SLA breach: open AOG older than 24h.
  const slaBreached = openRequests.filter((r) => now - new Date(r.createdAt).getTime() > 86400000);
  const topBreached = slaBreached[0];

  const queue = [...openRequests].sort((a, b) => b.priorityScore - a.priorityScore);

  const nowDate = new Date();
  const tz = (zone: string) =>
    nowDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: zone });
  const lonHour = Number(nowDate.toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Europe/London" }).slice(0, 2));
  const shift = lonHour >= 6 && lonHour < 18 ? "Day" : "Night";

  function generateReport() {
    if (!data) return toast.error("Admin data is still loading.");
    const at = new Date();
    const resolved = requests.filter((r) => r.status === "Resolved");
    const rate = requests.length ? Math.round((resolved.length / requests.length) * 100) : 0;
    const report = [
      `PlaneServe Monthly Operations Report`,
      `Generated: ${at.toLocaleString("en-GB")}`,
      ``,
      `- Subscribers: ${users.length}`,
      `- Enrolled aircraft: ${aircraft.length}`,
      `- Open AOG: ${openRequests.length}`,
      `- Resolved: ${resolved.length} (${rate}%)`,
      `- SLA breaches: ${slaBreached.length}`,
      `- MRR (est): $${metrics?.mrrUsd?.toLocaleString() ?? "0"}`,
      `- Suppliers live: ${metrics?.suppliersLive ?? 0}`,
      ``,
      `Open cases:`,
      ...(openRequests.length
        ? openRequests.map(
            (r) =>
              `- ${r.id.slice(-8).toUpperCase()} | ${r.registration} | ${r.status} | ${r.affectedSystem}`,
          )
        : [`- None`]),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/markdown;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `planeserve-ops-report-${at.toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Operations report downloaded.");
  }

  return (
    <AppShell variant="admin">
      {/* Desk status line */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-tight">Operations overview</h1>
          <RoleChip>Admin</RoleChip>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            Desk active · {openRequests.length} open
          </span>
          <span className="hidden tracking-wide sm:inline">
            LON {tz("Europe/London")} · GVA {tz("Europe/Zurich")} · DXB {tz("Asia/Dubai")}
          </span>
          <span className="text-accent">SHIFT · {shift.toUpperCase()}</span>
        </div>
      </div>

      {/* SLA breach banner */}
      {topBreached && (
        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-md border border-destructive/25 bg-destructive/5 px-5 py-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" strokeWidth={1.8} />
          <div className="min-w-0 flex-1">
            <span className="text-sm font-semibold text-destructive">
              SLA breach — action required.
            </span>{" "}
            <span className="text-sm text-muted-foreground">
              {topBreached.id.slice(-8).toUpperCase()} first-response window exceeded ·{" "}
              {topBreached.registration} grounded at {topBreached.location || "—"}.
              {slaBreached.length > 1 ? ` +${slaBreached.length - 1} more.` : ""}
            </span>
          </div>
          <Link
            to="/admin/aog"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90"
          >
            Assign controller
          </Link>
        </div>
      )}

      {/* Past-due payments */}
      {(stripe?.pastDueCount ?? 0) > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-md border border-accent/30 bg-accent/8 px-5 py-3">
          <CreditCard className="h-4 w-4 shrink-0 text-[oklch(0.42_0.09_75)]" />
          <div className="min-w-0 flex-1 text-sm">
            <span className="font-semibold text-[oklch(0.4_0.09_70)]">
              {stripe!.pastDueCount} subscription{stripe!.pastDueCount !== 1 ? "s" : ""} past due
            </span>{" "}
            <span className="text-muted-foreground">— cover at risk.</span>
          </div>
          <Link
            to="/admin/revenue"
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted/60"
          >
            View <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Stat row */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-6">
        <StatCard label="Open AOG" value={String(openRequests.length)} icon={Activity} tone="gold" />
        <StatCard
          label="Avg first response"
          value={metrics?.avgFirstResponseMins != null ? `${metrics.avgFirstResponseMins}m` : "—"}
          icon={Clock}
          tone="blue"
        />
        <StatCard
          label="Cleared today"
          value={String(metrics?.clearedToday ?? 0)}
          icon={CheckCircle2}
          tone="green"
        />
        <StatCard
          label="SLA breaches"
          value={String(slaBreached.length)}
          icon={AlertTriangle}
          tone={slaBreached.length > 0 ? "red" : "default"}
        />
        <StatCard
          label="MRR"
          value={`$${(metrics?.mrrUsd ?? 0).toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          label="Suppliers live"
          value={String(metrics?.suppliersLive ?? 0)}
          icon={Network}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Open AOG queue */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Open AOG queue · sorted by priority
            </span>
            <Link to="/admin/aog" className="text-xs text-muted-foreground hover:text-foreground">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-5 py-2 text-left font-semibold">Case</th>
                  <th className="px-2 py-2 text-left font-semibold">Tail</th>
                  <th className="px-2 py-2 text-left font-semibold">System</th>
                  <th className="px-2 py-2 text-left font-semibold">Base</th>
                  <th className="px-2 py-2 text-left font-semibold">Priority</th>
                  <th className="px-2 py-2 text-left font-semibold">Status</th>
                  <th className="px-5 py-2 text-left font-semibold">Controller</th>
                </tr>
              </thead>
              <tbody>
                {queue.slice(0, 8).map((r) => {
                  const breached = now - new Date(r.createdAt).getTime() > 86400000;
                  return (
                    <tr
                      key={r.id}
                      className={`border-b border-border last:border-0 ${breached ? "bg-destructive/5" : ""}`}
                    >
                      <td className="px-5 py-3 font-mono text-xs">{r.id.slice(-8).toUpperCase()}</td>
                      <td className="px-2 py-3 font-mono text-xs">{r.registration}</td>
                      <td className="px-2 py-3">{r.affectedSystem}</td>
                      <td className="px-2 py-3 font-mono text-xs">{r.location || "—"}</td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <BarMeter
                            value={r.priorityScore}
                            tone={r.priorityScore >= 80 ? "red" : "gold"}
                            className="w-16"
                          />
                          <span className="font-semibold">{r.priorityScore}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <StatusPill tone={breached ? "red" : (STATUS_TONE[r.status] ?? "neutral")} dot>
                          {breached ? "Breach" : r.status}
                        </StatusPill>
                      </td>
                      <td className="px-5 py-3 text-xs">
                        {r.handlerId ? (
                          r.handlerId
                        ) : (
                          <span className="text-destructive">Unassigned</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {queue.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      No open AOG cases — desk is clear.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Enrolments · pending review
              </span>
              <Link
                to="/admin/enrolments"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Open
              </Link>
            </div>
            <div className="divide-y divide-border">
              {pendingEnrolments.slice(0, 4).map((e) => (
                <div key={e.userId} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{e.company}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.tails} tail{e.tails === 1 ? "" : "s"} pending verification
                    </div>
                  </div>
                  <Link
                    to="/admin/enrolments"
                    className="shrink-0 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-[oklch(0.16_0.02_250)] hover:bg-accent/90"
                  >
                    Review
                  </Link>
                </div>
              ))}
              {pendingEnrolments.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No enrolments awaiting review.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Desk
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-md bg-muted/40 p-3">
                <div className="text-lg font-semibold">{users.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Subscribers
                </div>
              </div>
              <div className="rounded-md bg-muted/40 p-3">
                <div className="text-lg font-semibold">{aircraft.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Aircraft
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={generateReport}
              className="mt-4 w-full rounded-md border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/60"
            >
              Generate operations report
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
