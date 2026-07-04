import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureSession,
  getAircraftList,
  getAogRequests,
  type AogRecord,
} from "@/lib/app.functions";
import { Plane, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/fleet-network")({
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: FleetNetworkPage,
});

function FleetNetworkPage() {
  const { data: aircraft = [] } = useQuery({
    queryKey: ["aircraft-list"],
    queryFn: () => getAircraftList(),
  });

  const { data: cases = [] } = useQuery<AogRecord[]>({
    queryKey: ["aog-requests"],
    queryFn: () => getAogRequests(),
  });

  const activeCases = cases.filter((c: AogRecord) => !["Resolved", "Cancelled"].includes(c.status));
  const groundedCount = activeCases.filter(
    (c: AogRecord) => c.urgency === "Aircraft grounded",
  ).length;

  // Type breakdown
  const byType = aircraft.reduce<Record<string, number>>((acc: Record<string, number>, a) => {
    acc[a.makeModel] = (acc[a.makeModel] ?? 0) + 1;
    return acc;
  }, {});

  // Per-aircraft health
  const aircraftHealth = aircraft.map((a) => {
    const ac = activeCases.filter((c: AogRecord) => c.aircraftId === a.id);
    const grounded = ac.some((c: AogRecord) => c.urgency === "Aircraft grounded");
    const affected = ac.some((c: AogRecord) => c.urgency === "Dispatch affected");
    return { aircraft: a, activeCases: ac, grounded, affected };
  });

  return (
    <AppShell>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Fleet Network</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time health and activity across your enrolled fleet
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Aircraft enrolled
            </p>
            <p className="text-2xl font-semibold">{aircraft.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Active cases
            </p>
            <p className="text-2xl font-semibold">{activeCases.length}</p>
          </div>
          <div
            className={`bg-card border rounded-lg p-4 ${groundedCount > 0 ? "border-destructive/30" : "border-border"}`}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Aircraft grounded
            </p>
            <p className={`text-2xl font-semibold ${groundedCount > 0 ? "text-destructive" : ""}`}>
              {groundedCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">All-clear</p>
            <p className="text-2xl font-semibold text-emerald-600">
              {aircraft.length - aircraftHealth.filter((a) => a.grounded || a.affected).length}
            </p>
          </div>
        </div>

        {/* Fleet type breakdown */}
        {Object.keys(byType).length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold mb-3">Fleet composition</h2>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(byType).map(([type, count]) => (
                <div
                  key={type}
                  className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3"
                >
                  <Plane className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{type}</p>
                    <p className="text-xs text-muted-foreground">{count} aircraft</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Per-aircraft status */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Aircraft status</h2>
          {aircraft.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
              No aircraft enrolled yet.
            </div>
          ) : (
            <div className="space-y-2">
              {aircraftHealth.map(({ aircraft: a, activeCases: ac, grounded, affected }) => (
                <div
                  key={a.id}
                  className={`flex items-center gap-4 bg-card border rounded-lg px-4 py-3 ${
                    grounded
                      ? "border-destructive/30"
                      : affected
                        ? "border-amber-500/20"
                        : "border-border"
                  }`}
                >
                  <div className="shrink-0">
                    {grounded ? (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    ) : affected ? (
                      <Clock className="h-5 w-5 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{a.registration}</p>
                      <p className="text-xs text-muted-foreground">{a.makeModel}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {a.baseAirport || "Base unknown"}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {grounded ? (
                      <span className="text-xs font-medium text-destructive">Grounded</span>
                    ) : affected ? (
                      <span className="text-xs font-medium text-amber-500">Dispatch affected</span>
                    ) : (
                      <span className="text-xs font-medium text-emerald-600">Operational</span>
                    )}
                    {ac.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {ac.length} active case{ac.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Network intelligence note */}
        <div className="mt-8 bg-primary/5 border border-primary/10 rounded-lg p-4">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
            Network intelligence
          </p>
          <p className="text-sm text-muted-foreground">
            Aircraft Program monitors USM availability and freight routes across our global supplier
            network 24/7. Your desk will proactively alert you to parts shortages affecting your
            fleet type.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
