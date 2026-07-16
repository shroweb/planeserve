import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ensureAdminSession, getAmoNetwork } from "@/lib/app.functions";
import { Wrench, Phone } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/admin/amo")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminAmoPage,
});

function AdminAmoPage() {
  const { data: amoList = [] } = useQuery({
    queryKey: ["amo-network"],
    queryFn: () => getAmoNetwork(),
  });

  return (
    <AppShell variant="admin">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">AMO Network</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Maintenance organisations linked to enrolled aircraft
          </p>
        </div>

        {(amoList as any[]).length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-lg text-sm text-muted-foreground">
            No AMO data available. Aircraft owners can add maintenance organisation details in their
            aircraft profile.
          </div>
        ) : (
          <div className="space-y-3">
            {(amoList as any[]).map((a) => (
              <div key={a.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Wrench className="h-4 w-4 text-primary shrink-0" />
                      <p className="text-sm font-semibold">{a.amoName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {a.registration} · {a.makeModel}
                    </p>
                    {a.maintenancePoc && (
                      <p className="text-xs">
                        POC: <span className="text-foreground">{a.maintenancePoc}</span>
                      </p>
                    )}
                    {a.amoEmail && (
                      <p className="text-xs mt-1 text-muted-foreground">
                        Email: <span className="text-foreground font-mono">{a.amoEmail}</span>
                      </p>
                    )}
                    {a.amoLocation && (
                      <p className="text-xs mt-1 text-muted-foreground">
                        Location: <span className="text-foreground">{a.amoLocation}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs space-y-1 shrink-0">
                    {a.amoPhone && (
                      <div className="flex items-center gap-1 justify-end text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{a.amoPhone}</span>
                      </div>
                    )}
                    {a.amoEmergencyPhone && (
                      <div className="flex items-center gap-1 justify-end text-destructive">
                        <Phone className="h-3 w-3" />
                        <span>{a.amoEmergencyPhone} (emerg.)</span>
                      </div>
                    )}
                    {a.baseAirport && (
                      <p className="text-muted-foreground">Base: {a.baseAirport}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
