import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureAdminSession,
  getAdminAircraft,
  verifyAircraft,
  type AircraftRecord,
  type UserRecord,
} from "@/lib/app.functions";
import { X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/aircraft")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminAircraft,
});

function AdminAircraft() {
  const queryClient = useQueryClient();
  const [selectedAircraftId, setSelectedAircraftId] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["admin-aircraft"],
    queryFn: () => getAdminAircraft(),
  });
  const users = data?.users ?? [];
  const aircraft = data?.aircraft ?? [];
  const selectedAircraft = aircraft.find((item) => item.id === selectedAircraftId) ?? null;
  const selectedOwner = selectedAircraft
    ? users.find((item) => item.id === selectedAircraft.userId)
    : undefined;

  const verifyMutation = useMutation({
    mutationFn: (id: string) => verifyAircraft({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-aircraft"] });
      queryClient.invalidateQueries({ queryKey: ["admin-enrolments"] });
    },
  });

  return (
    <AppShell variant="admin">
      <h1 className="text-2xl font-semibold tracking-tight">Aircraft records</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Verify aircraft details and manage global support profiles.
      </p>
      <div className="mt-8 overflow-hidden rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <Th>Registration</Th>
              <Th>Type</Th>
              <Th>Owner / company</Th>
              <Th>Base airport</Th>
              <Th>Verification</Th>
              <Th>Subscription</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {aircraft.map((a) => {
              const u = users.find((x) => x.id === a.userId);
              return (
                <tr key={a.id} className="border-t border-border">
                  <Td className="font-mono font-semibold">{a.registration}</Td>
                  <Td>{a.makeModel}</Td>
                  <Td>
                    <div className="font-medium">{u?.company || u?.name}</div>
                    <div className="text-[11px] text-muted-foreground">{u?.email}</div>
                  </Td>
                  <Td>{a.baseAirport || "—"}</Td>
                  <Td>
                    <span
                      className={`rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
                        a.verificationStatus === "Verified"
                          ? "bg-[oklch(0.94_0.06_150)] text-[oklch(0.3_0.1_150)]"
                          : "bg-[oklch(0.94_0.06_80)] text-[oklch(0.3_0.1_60)]"
                      }`}
                    >
                      {a.verificationStatus}
                    </span>
                  </Td>
                  <Td>
                    <div className="text-xs">{a.subscriptionStatus}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">
                      {a.plan === "monthly" ? "Monthly" : "Annual"}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      {a.verificationStatus === "Pending" && (
                        <button
                          onClick={() => verifyMutation.mutate(a.id)}
                          className="rounded-sm bg-accent px-2 py-1 text-xs font-semibold text-[oklch(0.16_0.02_250)]"
                        >
                          Verify Cover
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedAircraftId(a.id)}
                        className="rounded-sm border border-border px-2 py-1 text-xs hover:bg-muted"
                      >
                        View
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedAircraft && (
        <AircraftDetailPanel
          aircraft={selectedAircraft}
          owner={selectedOwner}
          verifying={verifyMutation.isPending}
          onClose={() => setSelectedAircraftId(null)}
          onVerify={() => verifyMutation.mutate(selectedAircraft.id)}
        />
      )}
    </AppShell>
  );
}

function AircraftDetailPanel({
  aircraft,
  owner,
  verifying,
  onClose,
  onVerify,
}: {
  aircraft: AircraftRecord;
  owner?: UserRecord;
  verifying: boolean;
  onClose: () => void;
  onVerify: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="ml-auto flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-md border border-border bg-card shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border p-5">
          <div>
            <div className="font-mono text-lg font-semibold tracking-wide">
              {aircraft.registration}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{aircraft.makeModel}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close aircraft details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatusTile label="Verification" value={aircraft.verificationStatus} />
            <StatusTile label="Subscription" value={aircraft.subscriptionStatus} />
            <StatusTile label="Plan" value={aircraft.plan === "monthly" ? "Monthly" : "Annual"} />
          </div>

          {owner && (
            <Section title="Owner / Operator">
              <Detail label="Name" value={owner.name} />
              <Detail label="Company" value={owner.company} />
              <Detail label="Email" value={owner.email} />
              <Detail label="Phone" value={owner.phone} />
            </Section>
          )}

          <Section title="Aircraft Details">
            <Detail label="Category" value={aircraft.category} />
            <Detail label="Serial number" value={aircraft.serialNumber} />
            <Detail label="Year" value={aircraft.yearOfManufacture} />
            <Detail label="Operations" value={aircraft.typeOfOperations} />
            <Detail label="Base airport" value={aircraft.baseAirport} />
            <Detail label="Owner/operator" value={aircraft.ownerOperatorName} />
          </Section>

          <Section title="Cover Readiness">
            <Detail
              label="Engine"
              value={`${aircraft.engineManufacturer} ${aircraft.engineType}`.trim()}
            />
            <Detail label="Engine series" value={aircraft.engineSeries} />
            <Detail label="Engine count" value={String(aircraft.numberOfEngines)} />
            <Detail label="Engine serials" value={aircraft.engineSerialNumbers} />
            <Detail label="Maintenance programme" value={aircraft.maintenanceProgramme} />
            <Detail label="Registry standard" value={aircraft.registryStandard} />
            <Detail label="Nationality" value={aircraft.nationality} />
            <Detail label="Total airframe hours" value={aircraft.totalAirframeHours} />
          </Section>

          <Section title="Contacts & Insurance">
            <Detail label="AMO" value={aircraft.amoName} />
            <Detail label="AMO phone" value={aircraft.amoPhone} />
            <Detail label="AMO emergency" value={aircraft.amoEmergencyPhone} />
            <Detail label="PIC mobile" value={aircraft.picPhone} />
            <Detail label="Maintenance POC" value={aircraft.maintenancePoc} />
            <Detail label="Insurer" value={aircraft.insurerName} />
            <Detail label="Policy reference" value={aircraft.insurerPolicyRef} />
          </Section>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border p-5">
          <button onClick={onClose} className="rounded-sm border border-border px-4 py-2 text-sm">
            Close
          </button>
          {aircraft.verificationStatus === "Pending" && (
            <button
              onClick={onVerify}
              disabled={verifying}
              className="rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-[oklch(0.16_0.02_250)] disabled:opacity-60"
            >
              {verifying ? "Verifying..." : "Verify Cover"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-border bg-background p-3">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value || "—"}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-sm border border-border bg-background p-3">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 break-words text-sm">{value || "—"}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-left font-semibold">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3 ${className}`}>{children}</td>;
}
