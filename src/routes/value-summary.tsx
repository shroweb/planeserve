import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { ensureSession, getValueSummary } from "@/lib/app.functions";
import { TrendingDown, Clock, Package, CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/value-summary")({
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: ValueSummaryPage,
});

function ValueSummaryPage() {
  const { data: summary } = useQuery({
    queryKey: ["value-summary"],
    queryFn: () => getValueSummary(),
  });

  const stats = summary ?? {
    totalCases: 0,
    resolvedCases: 0,
    activeCases: 0,
    costAvoidanceCents: 0,
    subscriptionPaidCents: 0,
    roi: null as number | null,
    enrolledAircraft: 0,
    resolvedCaseDetails: [] as {
      id: string;
      registration: string;
      affectedSystem: string;
      partNumber: string;
      resolvedAt: string;
      estimatedSaveCents: number;
    }[],
    subscriptionSinceDate: null as string | null,
  };

  const totalCases = stats.resolvedCases + stats.activeCases;
  const hasActivity = totalCases > 0;

  const fmtUsd = (cents: number) =>
    (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const costAvoided = fmtUsd(stats.costAvoidanceCents);

  return (
    <AppShell>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Value Summary</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Estimated cost avoidance and operational impact of your PlaneServe membership
          </p>
        </div>

        {!hasActivity ? (
          /* Empty state — no cases yet */
          <div className="bg-card border border-border rounded-xl p-10 text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <TrendingDown className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-base font-semibold">No value to report yet</p>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
              As PlaneServe resolves AOG cases for your fleet, the estimated cost avoided and your
              subscription ROI will appear here — with a per-case breakdown.
            </p>
            <Link
              to="/submit-aog"
              className="mt-5 inline-flex items-center gap-1.5 rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-[oklch(0.16_0.02_250)] hover:opacity-90"
            >
              Submit an AOG request <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Hero cost avoided */}
            <div className="bg-card border border-primary/20 rounded-xl p-6 mb-6 text-center">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                Estimated AOG cost avoided
              </p>
              <p className="text-5xl font-bold tracking-tight">{costAvoided}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Based on industry average of $10,000/hr grounding cost and your average resolution
                time
              </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Package, label: "Total cases", value: String(totalCases) },
                { icon: CheckCircle2, label: "Resolved", value: String(stats.resolvedCases) },
                {
                  icon: TrendingDown,
                  label: "Subscription ROI",
                  value: stats.roi ? `${stats.roi}×` : "—",
                },
                {
                  icon: Clock,
                  label: "Resolution rate",
                  value: `${Math.round((stats.resolvedCases / totalCases) * 100)}%`,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                  </div>
                  <p className="text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>

            {/* Resolved case breakdown */}
            {stats.resolvedCaseDetails.length > 0 && (
              <div className="bg-card border border-border rounded-lg mb-8 overflow-hidden">
                <div className="border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Resolved cases
                </div>
                <div className="divide-y divide-border">
                  {stats.resolvedCaseDetails.map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium">
                          {c.registration} · {c.affectedSystem}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {c.partNumber ? `${c.partNumber} · ` : ""}
                          Resolved{" "}
                          {new Date(c.resolvedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-sm font-semibold text-success">
                          {fmtUsd(c.estimatedSaveCents)}
                        </div>
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          est. avoided
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Methodology */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-3">
          <p className="text-sm font-semibold">How we calculate this</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex gap-3">
              <span className="shrink-0 font-medium text-foreground">AOG cost rate</span>
              <span>
                Industry standard $10,000/hr for grounded business jet operations (crew costs,
                charter alternatives, schedule disruption)
              </span>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 font-medium text-foreground">Resolution time</span>
              <span>
                Time from case submission to Resolved status. Only Aircraft grounded cases are
                included in the cost calculation.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 font-medium text-foreground">Benchmark</span>
              <span>
                Compared against industry average of 48–72 hours without dedicated AOG support. We
                calculate savings vs. that baseline.
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-1 border-t border-border">
            Figures are indicative estimates only and not a guarantee of savings. Actual costs vary
            by aircraft type, operator model, and market conditions.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
