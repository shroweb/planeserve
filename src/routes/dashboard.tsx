import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { StatCard, StatusPill, RoleChip, BarMeter } from "@/components/app/ui";
import { ensureSession, getDashboardData, type AogRecord } from "@/lib/app.functions";
import { AlertTriangle, ArrowRight, Plane } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: Dashboard,
});

const ACTIVE = (s: string) => !["Resolved", "Cancelled"].includes(s);

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardData(),
  });

  if (!data) return <AppShell>Loading…</AppShell>;

  const { user, aircraft, requests, eventsByRequest, medianFirstResponseMins } = data;
  const activeCases = requests.filter((r) => ACTIVE(r.status));
  const verified = aircraft.filter((a) => a.verificationStatus === "Verified");
  const pending = aircraft.filter((a) => a.verificationStatus === "Pending");
  const grounded = activeCases.filter((r) => r.urgency === "Aircraft grounded");

  // Pick the case to feature: a grounded one first, else highest priority active.
  const featured =
    grounded[0] ?? [...activeCases].sort((a, b) => b.priorityScore - a.priorityScore)[0] ?? null;

  const coverLabel =
    aircraft.length === 0
      ? "None"
      : verified.length > 0 && pending.length === 0
        ? "Active"
        : verified.length > 0
          ? "Partial"
          : "Pending";

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  const dateLine = now
    .toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
    })
    .toUpperCase();
  const timeLine = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <AppShell>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <span>
              {dateLine} · {timeLine}
            </span>
            <RoleChip>Operator</RoleChip>
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">
            {greeting}, {user?.name?.split(" ")[0] ?? "there"}.
          </h1>
        </div>
        <Link
          to={aircraft.length > 0 ? "/submit-aog" : "/enrol"}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-[oklch(0.16_0.02_250)] hover:bg-accent/90"
        >
          {aircraft.length > 0 ? "Submit AOG" : "Enrol aircraft"}
        </Link>
      </div>

      {/* Grounded / action alert */}
      {grounded[0] && (
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-md border border-destructive/25 bg-destructive/5 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-destructive text-white">
            <AlertTriangle className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-destructive">
              {grounded[0].registration} is grounded at {grounded[0].location || "—"} —{" "}
              {grounded[0].affectedSystem}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Case {grounded[0].id.slice(-8).toUpperCase()} · priority {grounded[0].priorityScore} ·
              the desk is handling sourcing.
            </div>
          </div>
          <Link
            to="/aog/$id"
            params={{ id: grounded[0].id }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90"
          >
            Open case <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active cases" value={String(activeCases.length)} />
        <StatCard label="Aircraft enrolled" value={String(aircraft.length)} />
        <StatCard
          label="Median first response"
          value={medianFirstResponseMins != null ? `${medianFirstResponseMins} min` : "—"}
          tone="blue"
        />
        <StatCard
          label="Cover"
          value={coverLabel}
          tone={coverLabel === "Active" ? "green" : coverLabel === "Pending" ? "gold" : "default"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Active AOG live timeline */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Active AOG · Live
            </span>
            {featured && <StatusPill tone="gold">Updating</StatusPill>}
          </div>
          <div className="p-5">
            {featured ? (
              <CaseTimeline
                request={featured}
                events={eventsByRequest[featured.id] ?? []}
              />
            ) : (
              <div className="rounded-md border border-dashed border-border bg-muted/20 p-8 text-center">
                <Plane className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                <div className="mt-3 text-sm font-semibold">No active AOG cases</div>
                <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                  When an aircraft is grounded or dispatch is affected, submit a request and the desk
                  starts sourcing immediately.
                </p>
                {aircraft.length > 0 && (
                  <Link
                    to="/submit-aog"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground underline"
                  >
                    Submit AOG request <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fleet status */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Fleet status
            </span>
            <Link to="/aircraft" className="text-xs text-muted-foreground hover:text-foreground">
              {aircraft.length} enrolled →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {aircraft.map((a) => {
              const ac = activeCases.find((r) => r.aircraftId === a.id);
              const op = ac
                ? ac.urgency === "Aircraft grounded"
                  ? { tone: "red" as const, label: "Grounded" }
                  : { tone: "blue" as const, label: "Sourcing" }
                : { tone: "green" as const, label: "Operational" };
              return (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[oklch(0.14_0.02_250)] text-accent">
                    <Plane className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{a.registration}</span>
                      <StatusPill tone={a.verificationStatus === "Verified" ? "green" : "gold"}>
                        {a.verificationStatus === "Verified" ? "Verified" : "Pending"}
                      </StatusPill>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {a.makeModel} · {a.baseAirport || "—"}
                    </div>
                  </div>
                  <StatusPill tone={op.tone}>
                    {op.label}
                  </StatusPill>
                </div>
              );
            })}
            {aircraft.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No aircraft enrolled.{" "}
                <Link to="/enrol" className="text-foreground underline">
                  Enrol one
                </Link>
                .
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function CaseTimeline({
  request,
  events,
}: {
  request: AogRecord;
  events: { status: string; note: string; at: string }[];
}) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  // Build the timeline: submission + recorded status events.
  const rows = [
    { status: "Submitted", note: "AOG request received", at: request.createdAt },
    ...events.filter((e) => e.status !== "Submitted"),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-semibold">
            {request.id.slice(-8).toUpperCase()}
          </span>
          <StatusPill tone={request.urgency === "Aircraft grounded" ? "red" : "gold"}>
            {request.status}
          </StatusPill>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          Priority
          <span className="font-semibold text-foreground">{request.priorityScore}</span>
        </div>
      </div>
      <div className="mt-1 text-sm">
        {request.affectedSystem} · {request.registration}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">
        {request.location || "—"} · {request.aircraftType || ""}
      </div>
      <BarMeter
        value={request.priorityScore}
        tone={request.priorityScore >= 80 ? "red" : "gold"}
        className="mt-3"
      />

      <ol className="mt-5 space-y-4 border-l border-border pl-5">
        {rows.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent" />
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {fmt(e.at)}
            </div>
            <div className="text-sm font-medium">{e.status}</div>
            {e.note && <div className="text-xs text-muted-foreground">{e.note}</div>}
          </li>
        ))}
        {request.status !== "Resolved" && (
          <li className="relative">
            <span className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-muted-foreground/40" />
            <div className="text-sm font-medium text-muted-foreground">Next: dispatch & AWB</div>
            <div className="text-xs text-muted-foreground/80">Pending case progress</div>
          </li>
        )}
      </ol>

      <Link
        to="/aog/$id"
        params={{ id: request.id }}
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground underline"
      >
        Open full case <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
