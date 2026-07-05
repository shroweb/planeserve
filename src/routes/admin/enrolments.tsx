import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { StatusPill } from "@/components/app/ui";
import {
  ensureAdminSession,
  getAdminAircraft,
  verifyAircraft,
  declineAircraft,
} from "@/lib/app.functions";
import { toast } from "sonner";
import { CheckCircle2, ChevronDown, ChevronUp, Phone, Calendar, Plane } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/enrolments")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminEnrolments,
});

const CHECKLIST = [
  "Introductory call completed",
  "Engine details confirmed",
  "Maintenance program confirmed",
  "PIC direct mobile (24/7) confirmed",
  "AMO out-of-hours number confirmed",
  "Insurer details confirmed",
  "Base ICAO confirmed",
  "Parts Intelligence briefing delivered",
  "AOG hotline saved in subscriber's phone",
];

function AdminEnrolments() {
  const { data } = useQuery({
    queryKey: ["admin-enrolments"],
    queryFn: () => getAdminAircraft(),
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
            <h1 className="text-xl font-semibold">Enrolments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {aircraft.length} aircraft enrolled · {verifiedAircraft.length} verified ·{" "}
              {pendingAircraft.length} pending
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
            { id: "all" as const, label: `All enrolments (${aircraft.length})` },
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
                const owner = users.find((u: any) => u.id === a.userId);
                return <VerificationCard key={a.id} aircraft={a} owner={owner} />;
              })
            )}
          </div>
        )}

        {tab === "all" && (
          <div className="space-y-3">
            {aircraft.map((a) => {
              const owner = users.find((u: any) => u.id === a.userId);
              return <AircraftRow key={a.id} aircraft={a} owner={owner} />;
            })}
            {aircraft.length === 0 && (
              <div className="py-16 text-center border border-dashed border-border rounded-xl text-sm text-muted-foreground">
                No aircraft enrolled yet.
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function AircraftRow({ aircraft: a, owner }: { aircraft: any; owner: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`border rounded-xl overflow-hidden bg-card ${a.verificationStatus === "Pending" ? "border-amber-200" : "border-border"}`}
    >
      <div
        className="px-5 py-4 flex items-center gap-4 cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold">{a.registration}</span>
            <span className="text-sm text-muted-foreground">{a.makeModel}</span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                a.verificationStatus === "Verified"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {a.verificationStatus}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground`}
            >
              {a.plan === "monthly" ? "Monthly $100" : "Annual $1,000"}
            </span>
          </div>
          {owner && (
            <div className="mt-0.5 text-xs text-muted-foreground">
              {owner.name} · {owner.company} · {owner.email}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(a.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-5 py-4 bg-muted/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {[
              ["Base airport", a.baseAirport],
              ["Engine", `${a.engineManufacturer || ""} ${a.engineType || ""}`.trim() || "—"],
              ["Engine count", a.numberOfEngines],
              ["Engine serials", a.engineSerialNumbers],
              ["Maintenance", a.maintenanceProgramme],
              ["Insurer", `${a.insurerName || ""} ${a.insurerPolicyRef || ""}`.trim() || "—"],
              ["PIC phone", a.picPhone],
              ["AMO", a.amoName],
              ["AMO emergency", a.amoEmergencyPhone],
              ["Subscription", a.subscriptionStatus],
            ].map(([k, v]) => (
              <div key={k as string}>
                <p className="text-muted-foreground">{k}</p>
                <p className="font-medium">{v || "—"}</p>
              </div>
            ))}
          </div>
          {owner && (
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">Owner contact:</span>
              <span className="font-medium">{owner.name}</span>
              <span>{owner.email}</span>
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
        </div>
      )}
    </div>
  );
}

function VerificationCard({ aircraft: a, owner }: { aircraft: any; owner: any }) {
  const [expanded, setExpanded] = useState(true);
  const [checked, setChecked] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const verifyMutation = useMutation({
    mutationFn: () => verifyAircraft({ data: { id: a.id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enrolments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: (reason: string) => declineAircraft({ data: { id: a.id, reason } }),
    onSuccess: () => {
      toast.success(`${a.registration} declined — subscription cancelled and payment refunded.`);
      queryClient.invalidateQueries({ queryKey: ["admin-enrolments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
    },
    onError: () => toast.error("Could not decline this aircraft."),
  });

  function handleDecline() {
    const reason = window.prompt(
      `Decline cover for ${a.registration}?\n\nThis cancels the subscription and refunds the enrolment payment. Enter a reason for the customer (optional):`,
    );
    if (reason === null) return; // cancelled
    declineMutation.mutate(reason.trim());
  }

  const toggle = (item: string) =>
    setChecked((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item]));

  const allChecked = CHECKLIST.every((i) => checked.includes(i));

  return (
    <div className="border border-amber-200 bg-amber-50/30 rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Plane className="h-4 w-4 text-amber-600" />
            <span className="font-mono font-bold text-base">{a.registration}</span>
            <span className="text-sm text-muted-foreground">{a.makeModel}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Pending verification
            </span>
          </div>
          {owner && (
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="font-medium text-foreground">{owner.name}</span>
              {owner.company && <span>{owner.company}</span>}
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
        <div className="border-t border-amber-200 px-5 py-4 space-y-5 bg-white/60">
          {/* Aircraft details grid */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Aircraft profile
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                ["Base airport", a.baseAirport],
                ["Engine", `${a.engineManufacturer || ""} ${a.engineType || ""}`.trim()],
                ["Engine count", a.numberOfEngines],
                ["Engine serials", a.engineSerialNumbers],
                ["Maintenance", a.maintenanceProgramme],
                ["Insurer", `${a.insurerName || ""} ${a.insurerPolicyRef || ""}`.trim()],
                ["PIC phone", a.picPhone],
                ["AMO", a.amoName],
                ["AMO emergency", a.amoEmergencyPhone],
              ].map(([k, v]) => (
                <div
                  key={k as string}
                  className="bg-white/70 rounded-lg p-2.5 border border-amber-100"
                >
                  <p className="text-muted-foreground mb-0.5">{k}</p>
                  <p className="font-semibold">{v || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
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

          <div className="flex items-center gap-4">
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
            <button
              onClick={handleDecline}
              disabled={declineMutation.isPending}
              className="flex items-center gap-2 rounded-lg border border-destructive px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/5 disabled:opacity-40"
            >
              {declineMutation.isPending ? "Declining…" : "Decline & refund"}
            </button>
            {!allChecked && (
              <p className="text-xs text-muted-foreground">
                Complete all checklist items to enable verification.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
