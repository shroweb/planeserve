import { Link, useLocation } from "@tanstack/react-router";
import { ViewAsSwitcher } from "./ViewAsSwitcher";
import { Menu } from "lucide-react";
import {
  AogIcon,
  DashboardIcon,
  TakeoffIcon,
  AircraftIcon,
  BellIcon,
  MessageIcon,
  PartIcon,
  NetworkIcon,
  RevenueIcon,
  BillingIcon,
  TeamIcon,
  MemberIcon,
  SupplierIcon,
  InventoryIcon,
  SettingsIcon,
  TechLogIcon,
  GaugeIcon,
  LogoutIcon,
  RouteIcon,
  TraceIcon,
} from "@/components/app/PlaneServeIcons";
import { PlaneServeMark } from "@/components/site/PlaneServeLogo";
import { authClient } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminOverview, getUnreadCounts, getDashboardData } from "@/lib/app.functions";
import { signOutAndRedirect } from "@/lib/sign-out";

interface Props {
  children: React.ReactNode;
  variant?: "member" | "admin";
}

type UnreadCounts = {
  notifications?: number;
  messages?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NavItem = { to: string; label: string; icon: React.ComponentType<any> };

const memberSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Operations",
    items: [
      { to: "/submit-aog", label: "Submit AOG", icon: AogIcon },
      { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
      { to: "/aog-cases", label: "AOG Cases", icon: TraceIcon },
      { to: "/aircraft", label: "My Aircraft", icon: TakeoffIcon },
      { to: "/enrol", label: "Enrol Aircraft", icon: AircraftIcon },
      { to: "/notifications", label: "Notifications", icon: BellIcon },
      { to: "/messages", label: "Messages", icon: MessageIcon },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { to: "/parts-intelligence", label: "Parts Intelligence", icon: PartIcon },
      { to: "/fleet-network", label: "Fleet Network", icon: NetworkIcon },
      { to: "/aog-risk-index", label: "AOG Risk Index", icon: GaugeIcon },
      { to: "/value-summary", label: "Value Summary", icon: RevenueIcon },
    ],
  },
  {
    title: "Account",
    items: [
      { to: "/billing", label: "Billing", icon: BillingIcon },
      { to: "/team", label: "Team", icon: TeamIcon },
      { to: "/account", label: "Account", icon: MemberIcon },
    ],
  },
];

const memberLinks = memberSections.flatMap((s) => s.items);

const adminSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Operations",
    items: [
      { to: "/admin", label: "Overview", icon: DashboardIcon },
      { to: "/admin/aog", label: "AOG queue", icon: AogIcon },
      { to: "/admin/comms", label: "Messages", icon: MessageIcon },
      { to: "/admin/enrolments", label: "Enrolments", icon: TechLogIcon },
      { to: "/admin/aircraft", label: "Aircraft", icon: AircraftIcon },
    ],
  },
  {
    title: "Accounts",
    items: [
      { to: "/admin/customers", label: "Customers", icon: TeamIcon },
      { to: "/admin/suppliers", label: "Suppliers", icon: SupplierIcon },
      { to: "/admin/revenue", label: "Revenue", icon: RevenueIcon },
    ],
  },
  {
    title: "Tools",
    items: [
      { to: "/admin/data", label: "Data", icon: InventoryIcon },
      { to: "/admin/amo", label: "AMO Network", icon: NetworkIcon },
    ],
  },
];

const adminLinks: NavItem[] = adminSections.flatMap((s) => s.items);

function NavLinkRow({ item, active, badge }: { item: NavItem; active: boolean; badge: number }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors ${
        active ? "bg-white/10 text-accent" : "text-white/65 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.5} />
      <span className="flex-1">{item.label}</span>
      {badge > 0 && (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-background">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function AppShell({ children, variant = "member" }: Props) {
  const session = authClient.useSession();
  const user = session.data?.user;
  const loc = useLocation();
  const queryClient = useQueryClient();
  const links = variant === "admin" ? adminLinks : memberLinks;

  const initials =
    (user?.name ?? "PS")
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "PS";
  const shortRole = variant === "admin" ? "admin" : "member";

  const { data: unreadCounts } = useQuery<UnreadCounts>({
    queryKey: ["unread-counts"],
    queryFn: () => getUnreadCounts(),
    enabled: variant === "member" && !!session.data,
    refetchInterval: 30_000,
  });

  // Cover is active once at least one aircraft is verified and none are still
  // pending verification (shares the dashboard query cache — no extra fetch).
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardData(),
    enabled: variant === "member" && !!session.data,
  });
  const coverActive =
    variant === "member" &&
    !!dashboard &&
    dashboard.aircraft.some((a) => a.verificationStatus === "Verified") &&
    !dashboard.aircraft.some((a) => a.verificationStatus === "Pending");
  const coverPending =
    variant === "member" &&
    !!dashboard &&
    dashboard.aircraft.some((a) => a.verificationStatus === "Pending");
  const hasAircraft = variant === "member" && !!dashboard && dashboard.aircraft.length > 0;

  const { data: adminOverview } = useQuery({
    queryKey: ["admin-overview-shell"],
    queryFn: () => getAdminOverview(),
    enabled: variant === "admin" && !!session.data,
    staleTime: 30_000,
  });
  const adminOpenCases =
    adminOverview?.requests.filter((r) => r.status !== "Resolved" && r.status !== "Cancelled") ??
    [];
  const adminBreaches = adminOpenCases.filter(
    (r) => Date.now() - new Date(r.createdAt).getTime() > 86_400_000,
  ).length;

  function getBadge(to: string): number {
    if (variant === "admin") {
      if (to === "/admin/aog") return adminOpenCases.length;
      if (to === "/admin/enrolments") return adminOverview?.pendingEnrolments?.length ?? 0;
      return 0;
    }
    if (!unreadCounts) return 0;
    if (to === "/notifications") return unreadCounts.notifications ?? 0;
    if (to === "/messages") return unreadCounts.messages ?? 0;
    return 0;
  }

  async function signOut() {
    queryClient.clear();
    await signOutAndRedirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.005_240)] text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col bg-[oklch(0.14_0.02_250)] text-white md:flex">
        <div className="px-6 py-5 border-b border-white/10">
          <img src="/logo-white.png" className="h-8 w-auto mb-1" alt="Aircraft Program Logo" />
          <div className="text-[9px] uppercase tracking-widest text-white/40 font-semibold pl-0.5">
            {variant === "admin" ? "Operations" : "Member Area"}
          </div>
        </div>
        <div className="border-b border-white/10 px-4 py-4">
          {variant === "admin" ? (
            <div className="rounded-md bg-white/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/45">
                  Desk status
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Active
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-white/65">
                <span>
                  {adminOpenCases.length} open case{adminOpenCases.length === 1 ? "" : "s"}
                </span>
                {adminBreaches > 0 ? (
                  <span className="flex items-center gap-1 font-bold text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    {adminBreaches} breach{adminBreaches === 1 ? "" : "es"}
                  </span>
                ) : (
                  <span className="text-white/35">no breaches</span>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-white/5 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/45">
                Cover status
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    coverActive ? "bg-success" : coverPending ? "bg-accent" : "bg-white/25"
                  }`}
                />
                <span className="text-xs font-semibold text-white/80">
                  {coverActive
                    ? "Cover active"
                    : coverPending
                      ? "Cover pending"
                      : hasAircraft
                        ? "Profile needed"
                        : "No aircraft"}
                </span>
              </div>
            </div>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {variant === "admin"
            ? adminSections.map((section) => (
                <div key={section.title} className="mb-4 last:mb-0">
                  <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                    {section.title}
                  </div>
                  {section.items.map((l) => (
                    <NavLinkRow
                      key={l.label}
                      item={l}
                      active={loc.pathname === l.to}
                      badge={getBadge(l.to)}
                    />
                  ))}
                </div>
              ))
            : memberSections.map((section) => (
                <div key={section.title} className="mb-4 last:mb-0">
                  <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                    {section.title}
                  </div>
                  {section.items.map((l) => {
                    const active = loc.pathname === l.to;
                    const isAog = l.label === "Submit AOG";
                    const Icon = l.icon;
                    return (
                      <Link
                        key={l.label}
                        to={isAog && !hasAircraft ? "/enrol" : l.to}
                        className={`flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors ${
                          isAog && !hasAircraft
                            ? "bg-white/5 text-white/45 hover:bg-white/10 hover:text-white/65"
                            : isAog && active
                              ? "bg-red-600 text-white"
                              : isAog
                                ? "bg-red-600/90 text-white hover:bg-red-600"
                                : active
                                  ? "bg-white/10 text-accent"
                                  : "text-white/65 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.5} />
                        <span className="flex-1">{l.label}</span>
                        {getBadge(l.to) > 0 && (
                          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-background">
                            {getBadge(l.to)}
                          </span>
                        )}
                        {isAog && !hasAircraft && (
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                            Enrol first
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-white/85">
                {user?.name ?? "Aircraft Program user"}
              </div>
              {coverActive ? (
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  <span className="text-[11px] font-medium text-success">Cover active</span>
                </div>
              ) : (
                <div className="text-[11px] text-white/40">
                  {variant === "member" ? "Member" : "Operations"}
                </div>
              )}
            </div>
            <Link
              to="/account"
              title="Account settings"
              className="shrink-0 text-white/40 hover:text-white/75"
            >
              <SettingsIcon className="h-4 w-4" />
            </Link>
          </div>
          <button onClick={signOut} className="mt-3 text-xs text-white/40 hover:text-white/70">
            Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1 overflow-x-hidden">
        <div className="border-b border-border bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
            <div className="min-w-0 text-sm text-muted-foreground">
              <span className="text-foreground font-medium">
                {links.find((l) => l.to === loc.pathname)?.label ?? loc.pathname.split("/").pop()}
              </span>
            </div>

            <div className="flex min-w-0 flex-wrap items-center justify-end gap-3">
              {/* Unread messages pill */}
              {getBadge("/messages") > 0 && (
                <Link
                  to="/messages"
                  className="flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[11px] font-semibold px-2.5 py-1"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {getBadge("/messages") === 1
                    ? "New message"
                    : `${getBadge("/messages")} new messages`}
                </Link>
              )}
              {/* Unread notification pill */}
              {getBadge("/notifications") > 0 && (
                <Link
                  to="/notifications"
                  className="flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-semibold px-2.5 py-1"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {getBadge("/notifications") === 1
                    ? "New notification"
                    : `${getBadge("/notifications")} notifications`}
                </Link>
              )}
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {variant === "admin" ? "Admin" : "Subscriber"}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              >
                <LogoutIcon className="h-3.5 w-3.5" />
                Sign out
              </button>
              <details className="relative md:hidden">
                <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-sm border border-border text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                  <Menu className="h-4 w-4" />
                </summary>
                <div className="absolute right-0 top-11 z-50 w-56 rounded-md border border-border bg-card p-2 shadow-lg">
                  {links.map((l) => {
                    const active = loc.pathname === l.to;
                    const Icon = l.icon;
                    return (
                      <Link
                        key={l.to}
                        to={l.to}
                        className={`flex items-center gap-3 rounded-sm px-3 py-2 text-sm ${
                          active
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                        {l.label}
                      </Link>
                    );
                  })}
                  <div className="my-2 border-t border-border" />
                  <Link
                    to={variant === "admin" ? "/dashboard" : "/admin"}
                    className="block rounded-sm px-3 py-2 text-sm text-accent hover:bg-muted/70"
                  >
                    Switch to {variant === "admin" ? "Member" : "Admin"} View
                  </Link>
                  <button
                    onClick={signOut}
                    className="mt-1 block w-full rounded-sm px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  >
                    Sign out
                  </button>
                </div>
              </details>
            </div>
          </div>
        </div>
        <main className="w-full max-w-full overflow-x-hidden px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
      <ViewAsSwitcher current={variant === "admin" ? "Admin" : "Subscriber"} />
    </div>
  );
}
