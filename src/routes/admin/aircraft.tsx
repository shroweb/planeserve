import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { StatusPill, statusTone } from "@/components/app/ui";
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
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-aircraft"],
    queryFn: () => getAdminAircraft(),
  });
  const users = data?.users ?? [];
  const aircraft = data?.aircraft ?? [];
  const activeAircraft = aircraft.filter((item) => !item.archivedAt);
  const categories = Array.from(new Set(activeAircraft.map((item) => item.category))).sort();
  const filteredAircraft = activeAircraft.filter((item) => {
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const term = locationFilter.trim().toLowerCase();
    const matchesLocation =
      !term ||
      item.baseAirport.toLowerCase().includes(term) ||
      item.ownerOperatorName.toLowerCase().includes(term) ||
      item.makeModel.toLowerCase().includes(term);
    return matchesCategory && matchesLocation;
  });
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
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Active aircraft" value={String(activeAircraft.length)} />
        <StatCard
          label="Pending verification"
          value={String(activeAircraft.filter((item) => item.verificationStatus === "Pending").length)}
        />
        <StatCard
          label="Categories"
          value={String(categories.length)}
          detail={categories.join(" / ") || "No aircraft"}
        />
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-md border border-border bg-card p-4 sm:flex-row">
        <label className="grid gap-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Category
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="min-h-10 rounded-sm border border-input bg-background px-3 text-sm font-normal normal-case tracking-normal text-foreground"
          >
            <option>All</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="grid flex-1 gap-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Location / type / owner
          <input
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            className="min-h-10 rounded-sm border border-input bg-background px-3 text-sm font-normal normal-case tracking-normal text-foreground"
            placeholder="Filter by EGKB, turboprop, operator..."
          />
        </label>
      </div>
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
            {filteredAircraft.map((a) => {
              const u = users.find((x) => x.id === a.userId);
              return (
                <tr key={a.id} className="border-t border-border">
                  <Td className="font-mono font-semibold">{a.registration}</Td>
                  <Td>
                    <div>{a.makeModel}</div>
                    <div className="text-[11px] text-muted-foreground">{a.category}</div>
                  </Td>
                  <Td>
                    <div className="font-medium">{u?.company || u?.name}</div>
                    <div className="text-[11px] text-muted-foreground">{u?.email}</div>
                  </Td>
                  <Td>{a.baseAirport || "—"}</Td>
                  <Td>
                    <StatusPill tone={statusTone(a.verificationStatus)}>
                      {a.verificationStatus}
                    </StatusPill>
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
                          className="rounded-sm bg-accent px-2 py-1 text-xs font-semibold text-white"
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
            {filteredAircraft.length === 0 && (
              <tr>
                <Td className="text-muted-foreground" colSpan={7}>
                  No aircraft match this filter.
                </Td>
              </tr>
            )}
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
            {aircraft.category === "Turboprop" && (
              <Detail
                label="Propeller"
                value={`${aircraft.propellerManufacturer} ${aircraft.propellerType}`.trim()}
              />
            )}
            <Detail label="Maintenance programme" value={aircraft.maintenanceProgramme} />
            <Detail label="Registry standard" value={aircraft.registryStandard} />
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
              className="rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
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

function StatCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {detail && <div className="mt-1 truncate text-xs text-muted-foreground">{detail}</div>}
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
function Td({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={`px-5 py-3 ${className}`}>
      {children}
    </td>
  );
}
