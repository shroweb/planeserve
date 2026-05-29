import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureSession,
  getDashboardData,
  getUsmSignalsPublic,
  getUnreadCounts,
} from "@/lib/app.functions";
import { AlertTriangle, MessageSquare, Bell, BarChart2, Network, TrendingUp } from "lucide-react";

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

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardData(),
  });

  const { data: signals = [] } = useQuery({
    queryKey: ["usm-signals-public"],
    queryFn: () => getUsmSignalsPublic(),
  });

  const { data: unreadCounts } = useQuery({
    queryKey: ["unread-counts"],
    queryFn: () => getUnreadCounts(),
    refetchInterval: 30_000,
  });

  if (!data) return <AppShell>Loading...</AppShell>;

  const { user, aircraft, requests } = data;
  const pendingAircraft = aircraft.filter((a) => a.verificationStatus === "Pending");
  const verifiedAircraft = aircraft.filter((a) => a.verificationStatus === "Verified");
  const activeAog = requests.filter((r) => !["Resolved", "Cancelled"].includes(r.status));
  const groundedCases = activeAog.filter((r) => r.urgency === "Aircraft grounded");
  const highRiskParts = (signals as any[]).filter((s) => s.riskScore >= 70);
  const unreadNotifs = (unreadCounts as any)?.notifications ?? 0;

  return (
    <AppShell>
      {pendingAircraft.length > 0 && (
        <div className="mb-8 rounded-md border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[oklch(0.16_0.02_250)]">
              !
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">
                AOG cover activation pending
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                A PlaneServe handler will call you within 2 hours to complete verification for{" "}
                {pendingAircraft.map((a) => a.registration).join(", ")}. Cover activates once
                verified.
              </p>
            </div>
            <Link
              to="/aircraft"
              className="ml-auto rounded-sm border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium"
            >
              Update details
            </Link>
          </div>
        </div>
      )}

      {verifiedAircraft.length > 0 && pendingAircraft.length === 0 && (
        <div className="mb-8 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
              ✓
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">AOG cover active</div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Cover is active for{" "}
                {verifiedAircraft.map((a) => a.registration).join(", ")}. You can submit AOG
                requests 24/7.
              </p>
            </div>
            <Link
              to="/submit-aog"
              className="ml-auto rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium"
            >
              Submit AOG
            </Link>
          </div>
        </div>
      )}

      {/* Active grounded alert */}
      {groundedCases.length > 0 && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <div className="text-sm font-semibold text-destructive">
                {groundedCases.length} aircraft grounded
              </div>
              <p className="text-xs text-muted-foreground">
                {groundedCases.map((c) => c.registration).join(", ")} · Active AOG case
                {groundedCases.length > 1 ? "s" : ""}
              </p>
            </div>
            <Link
              to="/aog-cases"
              className="ml-auto rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive"
            >
              View cases
            </Link>
          </div>
        </div>
      )}

      {/* Quick access chips */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { to: "/aog-cases", label: "AOG Cases", icon: AlertTriangle, badge: activeAog.length },
          { to: "/messages", label: "Messages", icon: MessageSquare, badge: 0 },
          { to: "/notifications", label: "Notifications", icon: Bell, badge: unreadNotifs },
          {
            to: "/parts-intelligence",
            label: "Parts Intel",
            icon: BarChart2,
            badge: highRiskParts.length,
          },
          { to: "/fleet-network", label: "Fleet", icon: Network, badge: 0 },
          { to: "/value-summary", label: "Value", icon: TrendingUp, badge: 0 },
        ].map(({ to, label, icon: Icon, badge }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {badge > 0 && (
              <span className="ml-0.5 h-4 min-w-4 rounded-full bg-accent text-background text-[10px] font-bold flex items-center justify-center px-1">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Welcome
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{user?.name}</h1>
          <p className="text-sm text-muted-foreground">{user?.company}</p>
        </div>
        <Link
          to="/submit-aog"
          className="rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-[oklch(0.16_0.02_250)]"
        >
          Submit AOG Request
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Enrolled aircraft" value={String(aircraft.length)} />
        <Stat label="Subscription" value={aircraft[0]?.subscriptionStatus ?? "—"} accent />
        <Stat
          label="Open AOG requests"
          value={String(requests.filter((r) => r.status !== "Resolved").length)}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Enrolled aircraft"
          action={
            <Link to="/aircraft" className="text-xs text-muted-foreground hover:text-foreground">
              View all
            </Link>
          }
        >
          <div className="space-y-3">
            {aircraft.map((a) => (
              <div key={a.id} className="rounded-sm border border-border p-5">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-base font-semibold tracking-wide">
                    {a.registration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{a.verificationStatus}</Badge>
                    <Badge>{a.subscriptionStatus}</Badge>
                  </div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{a.makeModel}</div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                  <KV k="Plan" v={a.plan === "monthly" ? "Monthly" : "Annual"} />
                  <KV k="Base" v={a.baseAirport || "—"} />
                  <KV k="Category" v={a.category || "—"} />
                </div>
                <div className="mt-4 flex gap-2 text-xs">
                  <Link
                    to="/aircraft"
                    search={{ id: a.id }}
                    className="rounded-sm border border-border px-3 py-1.5 hover:bg-muted/50"
                  >
                    View / edit profile
                  </Link>
                  <Link
                    to="/submit-aog"
                    className="rounded-sm border border-border px-3 py-1.5 hover:bg-muted/50"
                  >
                    Submit AOG request
                  </Link>
                </div>
              </div>
            ))}
            {!aircraft.length && (
              <div className="rounded-sm border border-dashed border-border p-8 text-center">
                <div className="text-sm font-medium text-foreground">No aircraft enrolled yet</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enrol an aircraft to activate AOG cover and access the sourcing network.
                </p>
                <Link
                  to="/enrol"
                  className="mt-4 inline-block rounded-sm bg-accent px-4 py-2 text-xs font-medium text-[oklch(0.16_0.02_250)]"
                >
                  Enrol an aircraft
                </Link>
              </div>
            )}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Recent requests">
            <div className="space-y-3">
              {requests.slice(0, 4).map((r) => (
                <Link
                  key={r.id}
                  to="/aog/$id"
                  params={{ id: r.id }}
                  className="flex items-center justify-between rounded-sm border border-border p-3 transition-colors hover:bg-muted/30"
                >
                  <div>
                    <div className="text-sm font-medium">{r.affectedSystem}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.registration} · {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{r.status}</Badge>
                    {(r.status === "Options ready" || r.status === "Awaiting approval") && (
                      <span className="rounded-sm bg-accent px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.16_0.02_250)]">
                        Action needed
                      </span>
                    )}
                  </div>
                </Link>
              ))}
              {!requests.length && (
                <div className="text-sm text-muted-foreground">No requests yet.</div>
              )}
            </div>
          </Panel>
          <Panel title="Support">
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground">PlaneServe AOG Desk</div>
              <div>aog@planeserve.aero</div>
              <div>+44 20 7946 0000</div>
              <Link to="/billing" className="mt-3 inline-block text-xs text-foreground underline">
                Billing & invoices
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${accent ? "text-accent" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="mt-0.5">{v}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  const s = String(children);
  const color =
    s === "Active" || s === "Resolved" || s === "Verified"
      ? "bg-[oklch(0.94_0.06_150)] text-[oklch(0.3_0.1_150)]"
      : s === "Submitted" || s === "Acknowledged" || s === "Pending"
        ? "bg-[oklch(0.94_0.06_80)] text-[oklch(0.3_0.1_60)]"
        : s === "Sourcing" || s === "Options ready" || s === "Awaiting approval"
          ? "bg-[oklch(0.93_0.05_250)] text-[oklch(0.3_0.1_250)]"
          : s === "Confirmed" || s === "Order placed" || s === "In transit" || s === "Arrived"
            ? "bg-[oklch(0.9_0.1_180)] text-[oklch(0.3_0.1_180)]"
            : "bg-muted text-muted-foreground";
  return (
    <span
      className={`rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${color}`}
    >
      {children}
    </span>
  );
}
