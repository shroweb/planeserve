import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { ensureSession, getAircraftList, getUsmSignalsPublic } from "@/lib/app.functions";
import { AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/aog-risk-index")({
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AogRiskIndexPage,
});

function riskBand(score: number) {
  if (score >= 70)
    return {
      label: "High",
      colour: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20",
    };
  if (score >= 40)
    return {
      label: "Medium",
      colour: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    };
  return {
    label: "Low",
    colour: "text-emerald-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  };
}

function AogRiskIndexPage() {
  const { data: aircraft = [] } = useQuery({
    queryKey: ["aircraft-list"],
    queryFn: () => getAircraftList(),
  });

  const { data: signals = [] } = useQuery({
    queryKey: ["usm-signals-public"],
    queryFn: () => getUsmSignalsPublic(),
  });

  // Per-aircraft risk: average risk score of matching signals
  const aircraftRisk = aircraft.map((a) => {
    const matching = (signals as any[]).filter(
      (s) =>
        s.aircraftType &&
        a.makeModel.toLowerCase().includes(s.aircraftType.toLowerCase().split(" ")[0]),
    );
    const avg =
      matching.length > 0
        ? Math.round(
            matching.reduce((acc: number, s: any) => acc + s.riskScore, 0) / matching.length,
          )
        : 0;
    const highRisk = matching.filter((s: any) => s.riskScore >= 70);
    return {
      aircraft: a,
      avgRisk: avg,
      highRiskCount: highRisk.length,
      signalCount: matching.length,
    };
  });

  const overallRisk =
    aircraftRisk.length > 0
      ? Math.round(aircraftRisk.reduce((acc, a) => acc + a.avgRisk, 0) / aircraftRisk.length)
      : 0;

  const band = riskBand(overallRisk);

  return (
    <AppShell>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">AOG Risk Index</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fleet-level AOG risk based on USM market availability and historical failure patterns
          </p>
        </div>

        {/* Overall risk score */}
        <div
          className={`rounded-md border ${band.border} ${band.bg} p-6 mb-6 flex items-center justify-between`}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Overall fleet risk
            </p>
            <p className={`text-5xl font-bold tracking-tight ${band.colour}`}>
              {overallRisk > 0 ? overallRisk : "—"}
            </p>
            <p className={`text-sm font-semibold mt-1 ${band.colour}`}>
              {overallRisk > 0 ? `${band.label} risk` : "No data yet"}
            </p>
          </div>
          <div className={`h-16 w-16 rounded-full ${band.bg} flex items-center justify-center`}>
            {overallRisk >= 70 ? (
              <AlertTriangle className={`h-8 w-8 ${band.colour}`} />
            ) : overallRisk >= 40 ? (
              <TrendingUp className={`h-8 w-8 ${band.colour}`} />
            ) : (
              <ShieldCheck className={`h-8 w-8 ${band.colour}`} />
            )}
          </div>
        </div>

        {/* Per-aircraft */}
        {aircraft.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border rounded-md text-sm text-muted-foreground">
            No aircraft enrolled. Enrol aircraft to see risk scores.
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium">Risk by aircraft</p>
            {aircraftRisk.map(({ aircraft: a, avgRisk, highRiskCount, signalCount }) => {
              const b = riskBand(avgRisk);
              return (
                <div
                  key={a.id}
                  className={`flex items-center gap-4 bg-card border ${avgRisk > 0 ? b.border : "border-border"} rounded-md px-5 py-4`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{a.registration}</p>
                      <p className="text-xs text-muted-foreground">{a.makeModel}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {signalCount > 0
                        ? `${signalCount} parts monitored · ${highRiskCount} high risk`
                        : "No market signal data for this type"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {avgRisk > 0 ? (
                      <>
                        <p className={`text-2xl font-bold ${b.colour}`}>{avgRisk}</p>
                        <p className={`text-xs font-semibold ${b.colour}`}>{b.label}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* How it works */}
        <div className="bg-card border border-border rounded-md p-6">
          <p className="text-sm font-semibold mb-3">How the index is calculated</p>
          <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              • <span className="text-foreground font-medium">USM availability</span> — real-time
              supplier count and stock depth for parts matching your aircraft type
            </p>
            <p>
              • <span className="text-foreground font-medium">Price trend</span> — rising prices
              signal scarcity and longer lead times
            </p>
            <p>
              • <span className="text-foreground font-medium">Historical failure rate</span> —
              failure logs from resolved cases across the Aircraft Program network
            </p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground mt-3 pt-3 border-t border-border">
            Scores above 70 indicate parts that are historically hard to source quickly. Aircraft Program
            proactively monitors and alerts you to changes.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
