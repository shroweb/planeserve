import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { StatusPill, statusTone } from "@/components/app/ui";
import { ensureSession, getUsmSignalsPublic, getAircraftList } from "@/lib/app.functions";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/parts-intelligence")({
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: PartsIntelligencePage,
});

function riskColour(score: number) {
  if (score >= 70) return "text-destructive";
  if (score >= 40) return "text-amber-500";
  return "text-emerald-600";
}

function riskLabel(score: number) {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "rising") return <TrendingUp className="h-3.5 w-3.5 text-destructive" />;
  if (trend === "falling") return <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

function PartsIntelligencePage() {
  const [aircraftFilter, setAircraftFilter] = useState<string>("all");

  const { data: aircraft = [] } = useQuery({
    queryKey: ["aircraft-list"],
    queryFn: () => getAircraftList(),
  });

  const { data: signals = [] } = useQuery({
    queryKey: ["usm-signals-public"],
    queryFn: () => getUsmSignalsPublic(),
  });

  const filtered =
    aircraftFilter === "all" ? signals : signals.filter((s) => s.aircraftType === aircraftFilter);

  const highRisk = filtered.filter((s) => s.riskScore >= 70).length;
  const medRisk = filtered.filter((s) => s.riskScore >= 40 && s.riskScore < 70).length;

  return (
    <AppShell>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Parts Intelligence</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live USM market signals and availability risk for your fleet
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Parts monitored
            </p>
            <p className="text-2xl font-semibold">{filtered.length}</p>
          </div>
          <div className="bg-card border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="h-3 w-3 text-destructive" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">High risk</p>
            </div>
            <p className="text-2xl font-semibold text-destructive">{highRisk}</p>
          </div>
          <div className="bg-card border border-emerald-500/20 rounded-lg p-4">
            <div className="flex items-center gap-1 mb-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Low risk</p>
            </div>
            <p className="text-2xl font-semibold text-emerald-600">
              {filtered.length - highRisk - medRisk}
            </p>
          </div>
        </div>

        {/* Aircraft filter */}
        {aircraft.length > 0 && (
          <div className="flex gap-2 mb-5 flex-wrap">
            <button
              onClick={() => setAircraftFilter("all")}
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors border ${
                aircraftFilter === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All types
            </button>
            {[...new Set(aircraft.map((a) => a.makeModel))].map((model) => (
              <button
                key={model}
                onClick={() => setAircraftFilter(model)}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors border ${
                  aircraftFilter === model
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        )}

        {/* Signals table */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
            No parts intelligence data available yet.
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Part / Description
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Availability
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Trend
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Suppliers
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Est. price
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{s.partNumber}</p>
                      {s.description && (
                        <p className="text-xs text-muted-foreground">{s.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${s.availabilityPct >= 60 ? "bg-emerald-500" : s.availabilityPct >= 30 ? "bg-amber-500" : "bg-destructive"}`}
                            style={{ width: `${s.availabilityPct}%` }}
                          />
                        </div>
                        <span className="text-xs">{s.availabilityPct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <TrendIcon trend={s.trend} />
                        <span className="text-xs capitalize">{s.trend}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{s.supplierCount}</td>
                    <td className="px-4 py-3 text-xs">
                      {s.priceCents > 0
                        ? (s.priceCents / 100).toLocaleString("en-US", {
                            style: "currency",
                            currency: s.currency.toUpperCase(),
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill tone={statusTone(riskLabel(s.riskScore))}>
                        {riskLabel(s.riskScore)}
                      </StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Data updated by PlaneServe analysts. Availability and pricing are indicative. Contact
            your desk for pre-positioning advice.
          </p>
        )}
      </div>
    </AppShell>
  );
}
