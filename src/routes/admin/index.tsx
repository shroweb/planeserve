import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard, StatusPill, RoleChip, BarMeter, statusTone } from "@/components/app/ui";
import { ensureAdminSession, getAdminOverview, getStripeAdminData, updateAogStatus } from "@/lib/app.functions";
import { AlertTriangle, ChevronRight, CreditCard } from "lucide-react";
import { AogIcon, ClearedIcon, NetworkIcon } from "@/components/app/PlaneServeIcons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const AOG_STATUSES = ["Submitted","Acknowledged","Sourcing","Options ready","Awaiting approval","Confirmed","Order placed","In transit","Arrived","Resolved","Cancelled"] as const;

function elapsed(createdAt: string) {
  const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function pendingAge(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1d";
  return `${days}d`;
}

function AdminOverview() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-overview"], queryFn: () => getAdminOverview() });
  const { data: stripe } = useQuery({
    queryKey: ["stripe-admin"],
    queryFn: () => getStripeAdminData(),
    staleTime: 60_000,
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      queryClient.invalidateQueries({ queryKey: ["stripe-admin"] });
      setLastRefreshed(Date.now());
    }, 60_000);
    return () => clearInterval(id);
  }, [autoRefresh, queryClient]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  function refreshedLabel() {
    const mins = Math.floor((Date.now() - lastRefreshed) / 60_000);
    if (mins === 0) return "just now";
    if (mins === 1) return "1m ago";
    return `${mins}m ago`;
  }

  if (isLoading) {
    return (
      <AppShell variant="admin">
        <div className="h-8 w-52 rounded-md bg-muted animate-pulse" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-lg border border-border bg-muted animate-pulse" />
          ))}
        </div>
        <div className="mt-6 h-72 rounded-lg border border-border bg-muted animate-pulse" />
      </AppShell>
    );
  }

  const users = data?.users ?? [];
  const aircraft = data?.aircraft ?? [];
  const requests = data?.requests ?? [];
  const metrics = data?.metrics;
  const pendingEnrolments = data?.pendingEnrolments ?? [];

  const openRequests = requests.filter((r) => r.status !== "Resolved" && r.status !== "Cancelled");
  const now = Date.now();
  const slaBreached = openRequests.filter((r) => isSlaBreached(r, now));
  const topBreached = slaBreached[0];

  const queue = [...openRequests].sort((a, b) => {
    const aBreached = isSlaBreached(a, now) ? 1 : 0;
    const bBreached = isSlaBreached(b, now) ? 1 : 0;
    if (bBreached !== aBreached) return bBreached - aBreached;
    return b.priorityScore - a.priorityScore;
  });


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
      {/* Page header */}
      <div className="flex flex-wrap items-center gap-2.5">
        <h1 className="text-2xl font-semibold tracking-tight">Operations overview</h1>
        <RoleChip>Admin</RoleChip>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Refreshed {refreshedLabel()}</span>
          <button
            type="button"
            onClick={() => setAutoRefresh((r) => !r)}
            className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${autoRefresh ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}
          >
            Auto {autoRefresh ? "on" : "off"}
          </button>
        </div>
      </div>

      {/* SLA breach banner */}
      {topBreached && (
        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-md border border-destructive/25 bg-destructive/5 px-5 py-4">
          <AogIcon className="h-5 w-5 shrink-0 text-destructive" strokeWidth={1.8} />
          <div className="min-w-0 flex-1">
            <span className="text-sm font-semibold text-destructive">
              SLA watch — action required.
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
            Assign handler
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

      {/* Primary ops metrics — operationally critical, given visual priority */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-[oklch(0.13_0.025_250)] px-6 py-5 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">Open AOG</div>
          <div className="mt-3 text-5xl font-semibold tracking-tight text-accent">{openRequests.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-[oklch(0.13_0.025_250)] px-6 py-5 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">Avg first response</div>
          <div className="mt-3 text-5xl font-semibold tracking-tight text-blue-400">
            {metrics?.avgFirstResponseMins != null ? `${metrics.avgFirstResponseMins}m` : "—"}
          </div>
          <div className="mt-2 text-xs text-white/40">across open cases this period</div>
        </div>
      </div>

      {/* Secondary metrics */}
      {(() => {
        const casesThisWeek = requests.filter(
          (r) => Date.now() - new Date(r.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000,
        ).length;
        return (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <StatCard label="Cases this week" value={String(casesThisWeek)} icon={ClearedIcon} />
            <StatCard label="Suppliers live" value={String(metrics?.suppliersLive ?? 0)} icon={NetworkIcon} />
          </div>
        );
      })()}

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
                  <th className="px-5 py-2 text-left font-semibold">Age</th>
                </tr>
              </thead>
              <tbody>
                {queue.slice(0, 8).map((r) => {
                  const breached = isSlaBreached(r, now);
                  return (
                    <tr
                      key={r.id}
                      className={`border-b border-border last:border-0 ${breached ? "bg-destructive/5" : ""}`}
                    >
                      <td className="px-5 py-2.5 font-mono text-xs">
                        {r.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-2 py-2.5 font-mono text-xs">{r.registration}</td>
                      <td className="px-2 py-2.5" title={r.affectedSystem}>
                        <span className="line-clamp-1 max-w-[160px] block">{r.affectedSystem}</span>
                      </td>
                      <td className="px-2 py-2.5 font-mono text-xs">
                        <span className="line-clamp-1 max-w-[130px] block">{r.location || "—"}</span>
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2">
                          <BarMeter
                            value={r.priorityScore}
                            tone={r.priorityScore >= 80 ? "red" : "gold"}
                            className="w-16"
                          />
                          <span className="font-semibold">{r.priorityScore}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5">
                        <Select
                          value={r.status}
                          onValueChange={async (value) => {
                            await updateAogStatus({ data: { id: r.id, status: value as typeof AOG_STATUSES[number] } });
                            queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
                          }}
                        >
                          <SelectTrigger className="h-auto min-w-[130px] rounded border border-border bg-card px-1.5 py-0.5 text-xs font-medium focus:ring-1 focus:ring-accent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {AOG_STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-5 py-2.5 font-mono text-xs text-muted-foreground">
                        {elapsed(r.createdAt)}
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
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{e.company}</span>
                      <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {pendingAge(e.oldestPendingAt)}
                      </span>
                    </div>
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
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Fleet & desk
            </div>
            <div className="space-y-3">
              {(() => {
                const resolved = requests.filter((r) => r.status === "Resolved").length;
                const rate = requests.length ? Math.round((resolved / requests.length) * 100) : 0;
                const rateTone = rate >= 70 ? "text-success" : rate >= 40 ? "text-accent" : "text-destructive";
                return (
                  <>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div>
                        <div className="text-xs font-medium">Enrolled aircraft</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">across {users.length} operator{users.length !== 1 ? "s" : ""}</div>
                      </div>
                      <div className="text-base font-semibold tabular-nums">{aircraft.length}</div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div>
                        <div className="text-xs font-medium">Resolution rate</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{resolved} of {requests.length} cases · target 70%</div>
                      </div>
                      <div className={`text-base font-semibold tabular-nums ${rateTone}`}>{requests.length ? `${rate}%` : "—"}</div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <div className="text-xs font-medium">Active suppliers</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">in vetted network</div>
                      </div>
                      <div className="text-base font-semibold tabular-nums">{metrics?.suppliersLive ?? 0}</div>
                    </div>
                  </>
                );
              })()}
            </div>
            <button
              type="button"
              onClick={generateReport}
              className="mt-5 w-full rounded-md border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/60"
            >
              Export case summary
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function isSlaBreached(request: { status: string; createdAt: string }, now: number) {
  return (
    ["Submitted", "Acknowledged", "Sourcing"].includes(request.status) &&
    now - new Date(request.createdAt).getTime() > 86_400_000
  );
}
