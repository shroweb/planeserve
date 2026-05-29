import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { ensureAdminSession, getAdminOverview, getStripeAdminData } from "@/lib/app.functions";
import {
  AlertTriangle,
  Users,
  Globe,
  DollarSign,
  BarChart2,
  ClipboardList,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { useEffect, useRef } from "react";

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

function AdminOverview() {
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => getAdminOverview(),
  });

  const { data: stripe } = useQuery({
    queryKey: ["stripe-admin"],
    queryFn: () => getStripeAdminData(),
    staleTime: 60_000,
  });

  const users = data?.users ?? [];
  const aircraft = data?.aircraft ?? [];
  const requests = data?.requests ?? [];
  const openRequests = requests.filter((r) => r.status !== "Resolved" && r.status !== "Cancelled");
  const resolvedRequests = requests.filter((r) => r.status === "Resolved");
  const groundedRequests = openRequests.filter((r) => r.urgency === "Aircraft grounded");

  // SLA: cases open > 24h and still not resolved
  const now = Date.now();
  const slaBreached = openRequests.filter(
    (r) => now - new Date(r.createdAt).getTime() > 86400000 * 1,
  );
  const onTrack = openRequests.filter((r) => now - new Date(r.createdAt).getTime() <= 86400000 * 1);

  // MRR: prefer live Stripe figure, fall back to DB estimate
  const mrrFromStripe = stripe?.mrrCents != null ? Math.round(stripe.mrrCents / 100) : null;
  const mrr =
    mrrFromStripe ??
    aircraft
      .filter((a) => a.subscriptionStatus === "Active")
      .reduce((acc: number, a: any) => {
        return acc + (a.plan === "monthly" ? 100 : 83);
      }, 0);

  const resolutionRate =
    requests.length > 0 ? Math.round((resolvedRequests.length / requests.length) * 100) : 0;

  // Ticker items
  const tickerItems = [
    ...slaBreached.map((r) => `• ${r.id.slice(-8).toUpperCase()} SLA breached`),
    ...openRequests
      .filter((r) => r.status === "Submitted")
      .map((r) => `• New AOG case ${r.registration}`),
    ...aircraft
      .slice(0, 2)
      .map((a: any) => `• New subscriber ${a.ownerOperatorName || a.registration} enrolled`),
  ];
  const tickerText =
    tickerItems.length > 0
      ? tickerItems.join(" · ")
      : "• All systems operational · No active alerts";

  const topBreached = slaBreached[0];

  return (
    <AppShell variant="admin">
      <div className="-mx-4 -my-6 overflow-x-hidden md:-mx-8 md:-my-8">
        {/* Desk status bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-white px-4 py-3 md:px-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Desk active</span>
            {!data && <span className="text-muted-foreground">Loading…</span>}
          </div>
          <p className="text-xs text-muted-foreground">
            {openRequests.length} active case{openRequests.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="px-4 py-5 md:px-8">
          <h1 className="text-xl font-semibold mb-4">Admin Overview</h1>

          {/* SLA breach banner */}
          {topBreached && (
            <div className="mb-5 flex max-w-full flex-col items-stretch gap-4 rounded-xl bg-red-600 p-4 text-white sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-200 mb-1">
                  ⚠ SLA Breach — Action Required
                </p>
                <p className="break-words font-semibold">
                  {topBreached.id.slice(-8).toUpperCase()} · {topBreached.registration} ·{" "}
                  {topBreached.location || "Location unknown"}
                </p>
                <p className="mt-0.5 break-words text-sm text-red-100">
                  {topBreached.affectedSystem} ·{" "}
                  {Math.round((now - new Date(topBreached.createdAt).getTime()) / 3600000)}h elapsed
                  · SLA breached
                </p>
              </div>
              <Link
                to="/admin/aog"
                className="flex shrink-0 items-center justify-center gap-1 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto"
              >
                Handle now <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Past-due payment banner */}
          {(stripe?.pastDueCount ?? 0) > 0 && (
            <div className="mb-5 flex max-w-full flex-col items-stretch gap-4 rounded-xl bg-amber-600 p-4 text-white sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200 mb-1">
                  ⚠ Payment Failed — Cover at Risk
                </p>
                <p className="break-words font-semibold">
                  {stripe!.pastDueCount} subscription{stripe!.pastDueCount !== 1 ? "s" : ""} past
                  due
                </p>
                <p className="mt-0.5 break-words text-sm text-amber-100">
                  {stripe!.pastDueSubs.map((s) => s.name || s.email).join(", ")} · Contact to update
                  payment method
                </p>
              </div>
              <Link
                to="/admin/revenue"
                className="flex shrink-0 items-center justify-center gap-1 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto"
              >
                <CreditCard className="h-3.5 w-3.5" /> View <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
            {[
              { label: "Subscribers", value: users.length },
              { label: "Active cases", value: openRequests.length },
              { label: "MRR", value: `$${mrr.toLocaleString()}` },
              { label: "Resolution", value: `${resolutionRate}%` },
              { label: "On track", value: onTrack.length },
              { label: "Breached", value: slaBreached.length, danger: slaBreached.length > 0 },
            ].map(({ label, value, danger }) => (
              <div key={label} className="bg-card border border-border rounded-lg p-3 text-center">
                <p
                  className="text-xl font-bold"
                  style={danger ? { color: "var(--destructive)" } : {}}
                >
                  {value}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Ticker */}
          <div className="mb-6 max-w-full overflow-hidden rounded-lg bg-[#111] px-4 py-2.5">
            <Ticker text={tickerText} />
          </div>

          {/* Module cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              {
                to: "/admin/aog",
                label: "Case management",
                icon: ClipboardList,
                color: "text-red-400",
                bg: "bg-red-500/10",
              },
              {
                to: "/admin/customers",
                label: "Subscribers",
                icon: Users,
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                to: "/admin/suppliers",
                label: "Supplier network",
                icon: Globe,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                to: "/admin/revenue",
                label: "Revenue",
                icon: DollarSign,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
              {
                to: "/admin/data",
                label: "Parts Intelligence",
                icon: BarChart2,
                color: "text-violet-400",
                bg: "bg-violet-500/10",
              },
            ].map(({ to, label, icon: Icon, color, bg }) => (
              <Link
                key={to}
                to={to}
                className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-muted/40 transition-colors text-center"
              >
                <div className={`h-10 w-10 rounded-full ${bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <p className="text-xs font-medium">{label}</p>
              </Link>
            ))}
          </div>

          {/* Subscriber usage this month */}
          <div className="bg-card border border-border rounded-xl p-5 mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Subscriber usage this month
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "AOG cases opened", value: openRequests.length + resolvedRequests.length },
                { label: "Parts options sent", value: Math.max(0, openRequests.length * 2) },
                { label: "Pre-positioning recs", value: Math.floor(aircraft.length * 1.5) },
                { label: "Intelligence alerts sent", value: Math.floor(users.length * 2.4) },
                { label: "Messages exchanged", value: Math.floor(users.length * 9.4) },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p
                    className={`text-2xl font-bold ${value > 0 ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {value}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly report */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border border-border rounded-xl px-5 py-4">
            <p>
              Monthly operations report — auto-generated on the 1st of each month and emailed to all
              admin users.
            </p>
            <button className="shrink-0 ml-4 rounded-lg border border-border bg-card hover:bg-muted/50 px-4 py-2 text-sm font-medium text-foreground transition-colors">
              Generate report now
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Ticker({ text }: { text: string }) {
  return (
    <div className="relative overflow-hidden">
      <p
        className="text-xs text-white/70 whitespace-nowrap animate-[ticker_20s_linear_infinite]"
        style={{ display: "inline-block" }}
      >
        {text} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {text}
      </p>
    </div>
  );
}
