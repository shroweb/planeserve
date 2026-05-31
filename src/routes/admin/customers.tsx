import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { StatusPill } from "@/components/app/ui";
import { ensureAdminSession, getAdminCustomers, verifyAircraft } from "@/lib/app.functions";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/customers")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminCustomers,
});

const CHECKLIST = [
  "Introductory call completed",
  "Engine details confirmed",
  "Maintenance programme confirmed",
  "PIC direct mobile (24/7) confirmed",
  "AMO out-of-hours number confirmed",
  "Insurer details confirmed",
  "Base ICAO confirmed",
  "Parts Intelligence briefing delivered",
  "AOG hotline saved in subscriber's phone",
];

function AdminCustomers() {
  const { data } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => getAdminCustomers(),
  });
  const users = data?.users ?? [];
  const aircraft = data?.aircraft ?? [];

  const pendingAircraft = aircraft.filter((a) => a.verificationStatus === "Pending");
  const verifiedAircraft = aircraft.filter((a) => a.verificationStatus === "Verified");

  const [tab, setTab] = useState<"pending" | "all">(pendingAircraft.length > 0 ? "pending" : "all");

  return (
    <AppShell variant="admin">
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Subscribers</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {users.length} subscriber{users.length !== 1 ? "s" : ""} · {verifiedAircraft.length}{" "}
              aircraft verified
            </p>
          </div>
          {pendingAircraft.length > 0 && (
            <StatusPill tone="gold">{pendingAircraft.length} pending verification</StatusPill>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {[
            { id: "pending" as const, label: `Needs verification (${pendingAircraft.length})` },
            { id: "all" as const, label: `All subscribers (${users.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "pending" && (
          <div className="space-y-4">
            {pendingAircraft.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-border rounded-xl text-sm text-muted-foreground">
                No aircraft pending verification.
              </div>
            ) : (
              pendingAircraft.map((a) => {
                const owner = users.find((u) => u.id === a.userId);
                return <VerificationCard key={a.id} aircraft={a} owner={owner} />;
              })
            )}
          </div>
        )}

        {tab === "all" && (
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <Th>Subscriber</Th>
                  <Th>Contact</Th>
                  <Th>Aircraft</Th>
                  <Th>Status</Th>
                  <Th>Joined</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const userAircraft = aircraft.filter((a) => a.userId === u.id);
                  const hasPending = userAircraft.some((a) => a.verificationStatus === "Pending");
                  return (
                    <tr
                      key={u.id}
                      className={`border-t border-border ${hasPending ? "bg-amber-50/40" : ""}`}
                    >
                      <Td>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.company}</div>
                      </Td>
                      <Td>
                        <div>{u.email}</div>
                        <div className="text-xs text-muted-foreground">{u.phone || "—"}</div>
                      </Td>
                      <Td>
                        {userAircraft.map((a) => (
                          <div key={a.id} className="text-xs">
                            <span className="font-mono font-semibold">{a.registration}</span>
                            <span className="text-muted-foreground ml-1">{a.makeModel}</span>
                          </div>
                        ))}
                        {userAircraft.length === 0 && (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </Td>
                      <Td>
                        {userAircraft.map((a) => (
                          <span
                            key={a.id}
                            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              a.verificationStatus === "Verified"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {a.verificationStatus}
                          </span>
                        ))}
                      </Td>
                      <Td>
                        <span className="text-xs text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </Td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                      No subscribers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function VerificationCard({ aircraft: a, owner }: { aircraft: any; owner: any }) {
  const [expanded, setExpanded] = useState(true);
  const [checked, setChecked] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const verifyMutation = useMutation({
    mutationFn: () => verifyAircraft({ data: { id: a.id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-customers"] }),
  });

  const toggle = (item: string) =>
    setChecked((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item]));

  const allChecked = CHECKLIST.every((i) => checked.includes(i));

  return (
    <div className="border border-amber-200 bg-amber-50/30 rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-base">{a.registration}</span>
            <span className="text-sm text-muted-foreground">{a.makeModel}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Pending verification
            </span>
          </div>
          {owner && (
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{owner.name}</span>
              {owner.email && <span>{owner.email}</span>}
              {owner.phone && (
                <a
                  href={`tel:${owner.phone}`}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Phone className="h-3 w-3" /> {owner.phone}
                </a>
              )}
            </div>
          )}
          <p className="mt-1 text-xs text-amber-700 font-medium">
            Handler should call within 2 hours of enrolment
          </p>
        </div>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 text-xs text-primary font-medium shrink-0 mt-1"
        >
          Checklist
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-amber-200 px-5 py-4 space-y-4 bg-white/60">
          {/* Aircraft details */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              ["Base airport", a.baseAirport],
              ["Engine", `${a.engineManufacturer} ${a.engineType}`.trim()],
              ["Engine count", a.numberOfEngines],
              ["Engine serials", a.engineSerialNumbers],
              ["Maintenance", a.maintenanceProgramme],
              ["Insurer", `${a.insurerName} ${a.insurerPolicyRef}`.trim()],
              ["PIC phone", a.picPhone],
              ["AMO", a.amoName],
              ["AMO emergency", a.amoEmergencyPhone],
            ].map(([k, v]) => (
              <div key={k as string}>
                <p className="text-muted-foreground">{k}</p>
                <p className="font-medium">{v || "—"}</p>
              </div>
            ))}
          </div>

          {/* Checklist */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Handler onboarding checklist
            </p>
            <div className="space-y-2">
              {CHECKLIST.map((item) => {
                const done = checked.includes(item);
                return (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => toggle(item)}
                      className={`h-5 w-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                        done
                          ? "bg-emerald-500 text-white"
                          : "border-2 border-border group-hover:border-primary"
                      }`}
                    >
                      {done && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <span className={`text-sm ${done ? "line-through text-muted-foreground" : ""}`}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => verifyMutation.mutate()}
            disabled={!allChecked || verifyMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            {verifyMutation.isPending
              ? "Verifying…"
              : "Mark aircraft verified — activate AOG cover"}
          </button>
          {!allChecked && (
            <p className="text-xs text-muted-foreground">
              Complete all checklist items to enable verification.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-left font-semibold">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-3">{children}</td>;
}
