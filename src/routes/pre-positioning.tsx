import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { ensureSession } from "@/lib/app.functions";
import { MapPin, Package, Clock } from "lucide-react";

export const Route = createFileRoute("/pre-positioning")({
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: PrePositioningPage,
});

function PrePositioningPage() {
  return (
    <AppShell>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Pre-Positioning</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Strategic parts placement to minimise AOG downtime before it happens
          </p>
        </div>

        {/* Coming soon */}
        <div className="bg-card border border-border rounded-xl p-8 text-center mb-6">
          <div className="flex justify-center gap-3 mb-4">
            <MapPin className="h-8 w-8 text-primary/40" />
            <Package className="h-8 w-8 text-primary/60" />
            <Clock className="h-8 w-8 text-primary/40" />
          </div>
          <p className="text-lg font-semibold mb-2">Coming soon</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Aircraft Program will analyse your routes, historical AOG patterns, and USM availability to
            recommend strategic pre-positioned spares at key airports in your network.
          </p>
        </div>

        {/* What it will include */}
        <div className="space-y-3">
          {[
            {
              icon: MapPin,
              title: "Route-based analysis",
              desc: "Identifies the airports your fleet uses most frequently and where AOG risk is highest based on historical data.",
            },
            {
              icon: Package,
              title: "Recommended spares",
              desc: "High-failure, low-availability parts for your specific aircraft types, ranked by risk score and sourcing lead time.",
            },
            {
              icon: Clock,
              title: "Time-to-AOG modelling",
              desc: "Projected downtime reduction based on pre-positioned inventory vs. live-sourcing from the USM market.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 bg-card border border-border rounded-lg p-4">
              <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground text-center">
          Interested in early access? Message your Aircraft Program desk.
        </p>
      </div>
    </AppShell>
  );
}
