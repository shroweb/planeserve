import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { ensureAdminSession, getAdminCustomers, verifyAircraft } from "@/lib/app.functions";
import { CheckCircle2, ChevronDown, ChevronUp, Phone, X, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
  "Maintenance program confirmed",
  "PIC direct mobile (24/7) confirmed",
  "AMO out-of-hours number confirmed",
  "Insurer details confirmed",
  "Base ICAO confirmed",
  "Parts Intelligence briefing delivered",
  "AOG hotline saved in subscriber's phone",
];

const PLAN_MRR: Record<string, number> = { single: 180, fleet: 540, enterprise: 0 };

function avatarColor(str: string) {
  const colors = [
    "bg-[oklch(0.42_0.13_160)]",
    "bg-[oklch(0.38_0.12_250)]",
    "bg-[oklch(0.45_0.10_30)]",
    "bg-[oklch(0.35_0.10_300)]",
    "bg-[oklch(0.40_0.09_75)]",
    "bg-[oklch(0.38_0.11_220)]",
  ];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffff;
  return colors[h % colors.length];
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

function customerStatus(ua: any[]) {
  if (ua.some((a) => a.subscriptionStatus === "past_due" || a.subscriptionStatus === "unpaid"))
    return "past_due";
  if (ua.some((a) => a.verificationStatus === "Verified" && a.subscriptionStatus === "active"))
    return "active";
  return "pending";
}

function planLabel(ua: any[]) {
  const p = ua[0]?.plan;
  if (!p) return "—";
  return p.charAt(0).toUpperCase() + p.slice(1);
}

function mrrLabel(ua: any[]) {
  const active = ua.filter((a) => a.subscriptionStatus === "active");
  if (!active.length) return "—";
  const plan = active[0]?.plan ?? "single";
  const total = PLAN_MRR[plan] ?? 180;
  return `£${total}`;
}

function healthScore(ua: any[]) {
  if (ua.every((a) => a.verificationStatus === "Pending")) return null;
  const isPastDue = ua.some((a) => a.subscriptionStatus === "past_due");
  const allVerified = ua.every((a) => a.verificationStatus === "Verified");
  let score = isPastDue ? 25 : 62;
  if (allVerified) score += 22;
  if (ua.length > 1) score += 8;
  if (ua.some((a) => a.amoPhone)) score += 8;
  return Math.min(100, score);
}

function HealthBar({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-muted-foreground">—</span>;
  const color = score >= 75 ? "bg-success" : score >= 50 ? "bg-accent" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold tabular-nums">{score}</span>
    </div>
  );
}

function lastAog(regs: string[], requests: any[]) {
  const relevant = requests.filter((r) => regs.includes(r.registration));
  if (!relevant.length) return "—";
  const latest = relevant[0];
  const days = Math.floor((Date.now() - new Date(latest.createdAt).getTime()) / 86_400_000);
  const hrs = Math.floor((Date.now() - new Date(latest.createdAt).getTime()) / 3_600_000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

function AdminCustomers() {
  const { data } = useQuery({ queryKey: ["admin-customers"], queryFn: () => getAdminCustomers() });
  const users = data?.users ?? [];
  const aircraft = data?.aircraft ?? [];
  const requests = data?.requests ?? [];

  const pendingAircraft = aircraft.filter((a) => a.verificationStatus === "Pending");
  const [tab, setTab] = useState<"pending" | "all">(pendingAircraft.length > 0 ? "pending" : "all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const nonAdminUsers = users.filter((u: any) => !u.isAdmin);
  const activeCount = nonAdminUsers.filter(
    (u: any) => customerStatus(aircraft.filter((a: any) => a.userId === u.id)) === "active",
  ).length;
  const pendingCount = nonAdminUsers.filter(
    (u: any) => customerStatus(aircraft.filter((a: any) => a.userId === u.id)) === "pending",
  ).length;
  const pastDueCount = nonAdminUsers.filter(
    (u: any) => customerStatus(aircraft.filter((a: any) => a.userId === u.id)) === "past_due",
  ).length;

  const selectedUser = selectedId ? nonAdminUsers.find((u: any) => u.id === selectedId) : null;

  return (
    <AppShell variant="admin">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            {activeCount} active
          </span>
          <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
            {pendingCount} pending
          </span>
          {pastDueCount > 0 && (
            <span className="flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
              {pastDueCount} past due
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        {[
          { id: "pending" as const, label: `Needs verification (${pendingAircraft.length})` },
          { id: "all" as const, label: `All customers (${nonAdminUsers.length})` },
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

      {/* Pending tab */}
      {tab === "pending" && (
        <div className="space-y-4 max-w-4xl">
          {pendingAircraft.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border rounded-xl text-sm text-muted-foreground">
              No aircraft pending verification.
            </div>
          ) : (
            pendingAircraft.map((a: any) => {
              const owner = users.find((u: any) => u.id === a.userId);
              return <VerificationCard key={a.id} aircraft={a} owner={owner} />;
            })
          )}
        </div>
      )}

      {/* All customers tab */}
      {tab === "all" && (
        <div className="flex gap-6">
          {/* Table */}
          <div
            className={`min-w-0 flex-1 rounded-lg border border-border bg-card overflow-hidden transition-all ${selectedUser ? "lg:max-w-[calc(100%-420px)]" : ""}`}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/30">
                  <th className="px-5 py-3 text-left font-semibold">Customer</th>
                  <th className="px-3 py-3 text-left font-semibold">Tails</th>
                  <th className="px-3 py-3 text-left font-semibold">Plan</th>
                  <th className="px-3 py-3 text-left font-semibold">Status</th>
                  <th className="px-3 py-3 text-left font-semibold">MRR</th>
                  <th className="px-3 py-3 text-left font-semibold">Last AOG</th>
                  <th className="px-3 py-3 text-left font-semibold">Health</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {nonAdminUsers.map((u: any) => {
                  const ua = aircraft.filter((a: any) => a.userId === u.id);
                  const status = customerStatus(ua);
                  const score = healthScore(ua);
                  const regs = ua.map((a: any) => a.registration);
                  const isSelected = selectedId === u.id;

                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedId(isSelected ? null : u.id)}
                      className={`border-b border-border last:border-0 cursor-pointer transition-colors ${
                        isSelected ? "bg-accent/8" : "hover:bg-muted/30"
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white ${avatarColor(u.company || u.name)}`}
                          >
                            {initials(u.company || u.name)}
                          </span>
                          <div>
                            <div className="font-medium text-sm">{u.company || u.name}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm font-medium">{ua.length || "—"}</td>
                      <td className="px-3 py-3">
                        <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {planLabel(ua)}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {status === "active" && (
                          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success uppercase">
                            Active
                          </span>
                        )}
                        {status === "pending" && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                            Pending
                          </span>
                        )}
                        {status === "past_due" && (
                          <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive uppercase w-fit">
                            <span className="h-1 w-1 rounded-full bg-destructive" />
                            Past due
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-sm font-medium">{mrrLabel(ua)}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground tabular-nums">
                        {lastAog(regs, requests)}
                      </td>
                      <td className="px-3 py-3">
                        <HealthBar score={score} />
                      </td>
                      <td className="px-3 py-3 text-muted-foreground/40">›</td>
                    </tr>
                  );
                })}
                {nonAdminUsers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                      No customers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Detail drawer */}
          {selectedUser && (
            <CustomerDrawer
              user={selectedUser}
              aircraft={aircraft.filter((a: any) => a.userId === selectedUser.id)}
              requests={requests.filter((r: any) =>
                aircraft
                  .filter((a: any) => a.userId === selectedUser.id)
                  .map((a: any) => a.registration)
                  .includes(r.registration),
              )}
              onClose={() => setSelectedId(null)}
            />
          )}
        </div>
      )}
    </AppShell>
  );
}

function CustomerDrawer({
  user,
  aircraft,
  requests,
  onClose,
}: {
  user: any;
  aircraft: any[];
  requests: any[];
  onClose: () => void;
}) {
  const status = customerStatus(aircraft);
  const plan = planLabel(aircraft);
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
  const openAog = requests.filter((r) => !["Resolved", "Cancelled"].includes(r.status)).length;
  const lifetimeCases = requests.length;

  return (
    <div className="w-[400px] shrink-0 rounded-lg border border-border bg-card overflow-y-auto max-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${avatarColor(user.company || user.name)}`}
          >
            {initials(user.company || user.name)}
          </span>
          <div>
            <div className="font-semibold text-base">{user.company || user.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              {status === "active" && (
                <span className="rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success uppercase">
                  Active
                </span>
              )}
              {status === "pending" && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                  Pending
                </span>
              )}
              {status === "past_due" && (
                <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive uppercase">
                  Past due
                </span>
              )}
              <span className="text-[10px] font-mono text-muted-foreground">
                CUST-{user.id.slice(-4).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground mt-0.5">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {[
          { label: "Plan", value: `${plan} · ${mrrLabel(aircraft)}/mo` },
          { label: "Tails enrolled", value: aircraft.length },
          { label: "Member since", value: memberSince },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {label}
            </div>
            <div className="mt-1 text-sm font-semibold">{value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
        {[
          { label: "Open AOG", value: openAog || "0" },
          { label: "Lifetime cases", value: lifetimeCases || "0" },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {label}
            </div>
            <div className="mt-1 text-lg font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {/* Aircraft */}
      <div className="px-5 py-4 border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Aircraft · {aircraft.length}
        </div>
        <div className="space-y-2">
          {aircraft.map((a: any) => {
            const isGrounded = requests.some(
              (r) =>
                r.registration === a.registration && !["Resolved", "Cancelled"].includes(r.status),
            );
            return (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[oklch(0.13_0.025_250)] text-accent">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3.75 9l8.25-6.75L20.25 9l-8.25 6.75L3.75 9z"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="text-xs font-mono font-semibold">{a.registration}</div>
                    <div className="text-[10px] text-muted-foreground">{a.makeModel}</div>
                  </div>
                </div>
                {isGrounded ? (
                  <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive uppercase">
                    <span className="h-1 w-1 rounded-full bg-destructive" /> Grounded
                  </span>
                ) : (
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success uppercase">
                    Operational
                  </span>
                )}
              </div>
            );
          })}
          {aircraft.length === 0 && (
            <p className="text-xs text-muted-foreground">No aircraft enrolled.</p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="px-5 py-4 border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Contact
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="text-muted-foreground">{user.email}</div>
          {user.phone && <div className="font-mono text-xs">{user.phone}</div>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 py-4">
        <a
          href={`mailto:${user.email}?subject=Aircraft%20Program%20Support`}
          className="flex-1 flex items-center justify-center gap-2 rounded-md border border-border py-2 text-sm font-medium hover:bg-muted/60 text-foreground no-underline text-center"
        >
          Message
        </a>
        {user.stripeCustomerId ? (
          <a
            href={`https://dashboard.stripe.com/customers/${user.stripeCustomerId}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-[oklch(0.13_0.025_250)] py-2 text-sm font-semibold text-white hover:opacity-90 no-underline text-center"
          >
            Open account <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <button
            onClick={() => toast.info("No billing account active (no aircraft enrolled yet).")}
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-muted py-2 text-sm font-semibold text-muted-foreground cursor-not-allowed text-center"
          >
            Open account <ExternalLink className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
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
          Checklist{" "}
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-amber-200 px-5 py-4 space-y-4 bg-white/60">
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
                      className={`h-5 w-5 rounded flex items-center justify-center shrink-0 transition-colors ${done ? "bg-emerald-500 text-white" : "border-2 border-border group-hover:border-primary"}`}
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
