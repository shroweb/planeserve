import { Link, useLocation } from "@tanstack/react-router";
import { ViewAsSwitcher } from "./ViewAsSwitcher";
import {
  Menu,
  Plane,
  LayoutDashboard,
  PlaneTakeoff,
  AlertTriangle,
  Users,
  ClipboardList,
  Gauge,
  Wrench,
  CreditCard,
  UserCircle,
  Bell,
  MessageSquare,
  Briefcase,
  BarChart2,
  Network,
  TrendingUp,
  MessageCircle,
  Building2,
  Database,
  DollarSign,
  Settings2,
  UsersRound,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUnreadCounts, getDashboardData } from "@/lib/app.functions";
import { signOutAndRedirect } from "@/lib/sign-out";
import type { LucideIcon } from "lucide-react";

interface Props {
  children: React.ReactNode;
  variant?: "member" | "admin";
}

type UnreadCounts = {
  notifications?: number;
  messages?: number;
};

const memberLinks: { to: string; label: string; icon: LucideIcon; badge?: string }[] = [
  { to: "/submit-aog", label: "Submit AOG", icon: AlertTriangle },
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/aog-cases", label: "AOG Cases", icon: Briefcase },
  { to: "/aircraft", label: "My Aircraft", icon: PlaneTakeoff },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/parts-intelligence", label: "Parts Intelligence", icon: BarChart2 },
  { to: "/fleet-network", label: "Fleet Network", icon: Network },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/aog-risk-index", label: "AOG Risk Index", icon: TrendingUp },
  { to: "/value-summary", label: "Value Summary", icon: DollarSign },
  { to: "/team", label: "Team", icon: UsersRound },
  { to: "/account", label: "Account", icon: UserCircle },
];

const adminLinks: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/enrolments", label: "Enrolments", icon: ClipboardList },
  { to: "/admin/aircraft", label: "Aircraft", icon: Wrench },
  { to: "/admin/aog", label: "AOG Requests", icon: AlertTriangle },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/comms", label: "Comms", icon: MessageCircle },
  { to: "/admin/suppliers", label: "Suppliers", icon: Building2 },
  { to: "/admin/data", label: "Data", icon: Database },
  { to: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { to: "/admin/amo", label: "AMO Network", icon: Settings2 },
];

export function AppShell({ children, variant = "member" }: Props) {
  const session = authClient.useSession();
  const user = session.data?.user;
  const loc = useLocation();
  const queryClient = useQueryClient();
  const links = variant === "admin" ? adminLinks : memberLinks;

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

  function getBadge(to: string): number {
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
        <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <Plane className="h-5 w-5 text-accent" strokeWidth={1.5} />
          <div>
            <div className="text-sm font-semibold tracking-tight">PlaneServe</div>
            <div className="text-[10px] uppercase tracking-widest text-white/50">
              {variant === "admin" ? "Operations" : "Member Area"}
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {links.map((l) => {
            const active = loc.pathname === l.to;
            const isAog = l.label === "Submit AOG";
            const Icon = l.icon;
            return (
              <Link
                key={l.label}
                to={l.to}
                className={`flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors ${
                  isAog && active
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
                  <span className="h-4 min-w-4 rounded-full bg-accent text-background text-[10px] font-bold flex items-center justify-center px-1">
                    {getBadge(l.to)}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="text-xs font-medium text-white/80">{user?.name ?? "PlaneServe user"}</div>
          {coverActive ? (
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="text-[11px] font-medium text-success">AOG cover active</span>
            </div>
          ) : (
            <div className="text-[11px] text-white/40 mt-0.5">
              AOG Cover · {variant === "member" ? "member" : "admin"}
            </div>
          )}
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
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
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
        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
      <ViewAsSwitcher current={variant === "admin" ? "Admin" : "Subscriber"} />
    </div>
  );
}
