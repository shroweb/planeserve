import { Link, useLocation } from "@tanstack/react-router";
import { ViewAsSwitcher } from "./ViewAsSwitcher";
import { Menu, Package, History, UserCircle, LogOut, Settings } from "lucide-react";
import { signOutAndRedirect } from "@/lib/sign-out";
import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSupplierRfqs } from "@/lib/app.functions";
import { PlaneServeMark } from "@/components/site/PlaneServeLogo";

type NavItem = { to: string; label: string; icon: LucideIcon };

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Sourcing",
    items: [
      { to: "/supplier", label: "RFQ Inbox", icon: Package },
      { to: "/supplier/quote-history", label: "Quote History", icon: History },
    ],
  },
  {
    title: "Account",
    items: [{ to: "/supplier/profile", label: "Company profile", icon: UserCircle }],
  },
];

const NAV: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);

export function SupplierAppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const { data } = useQuery({
    queryKey: ["supplier-rfqs-shell"],
    queryFn: () => getSupplierRfqs(),
    staleTime: 30_000,
  });
  const pendingRfqs = data?.rfqs.filter((r) => r.status === "sent").length ?? 0;
  const companyMeta = data?.company as { id?: string; status?: string; name?: string } | undefined;
  const approved = companyMeta?.status === "approved" || companyMeta?.id === "admin-preview";
  const companyName = companyMeta?.name || "Supplier";
  const initials =
    companyName
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SP";

  async function signOut() {
    await signOutAndRedirect("/supplier/login");
  }

  function badgeFor(to: string) {
    return to === "/supplier" ? pendingRfqs : 0;
  }

  return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.005_240)] text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col bg-[oklch(0.14_0.02_250)] text-white md:flex">
        <div className="px-6 py-5 border-b border-white/10">
          <img src="/logo-white.png" className="h-8 w-auto mb-1" alt="Aircraft Program Logo" />
          <div className="text-[9px] uppercase tracking-widest text-white/40 font-semibold pl-0.5">
            Supplier Portal
          </div>
        </div>
        <div className="border-b border-white/10 px-4 py-4">
          <div className="rounded-md bg-white/5 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-white/45">
              Supplier status
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${approved ? "bg-success" : "bg-accent"}`} />
              <span className="text-xs font-semibold text-white/80">
                {approved ? "Approved" : "Pending review"}
              </span>
            </div>
            <div className="mt-2 text-xs text-white/55">
              {pendingRfqs} RFQ{pendingRfqs === 1 ? "" : "s"} awaiting response
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-4 last:mb-0">
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                {section.title}
              </div>
              {section.items.map((l) => {
                const active = loc.pathname === l.to;
                const Icon = l.icon;
                const badge = badgeFor(l.to);
                return (
                  <Link
                    key={l.label}
                    to={l.to}
                    className={`flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-white/10 text-accent"
                        : "text-white/65 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.5} />
                    <span className="flex-1">{l.label}</span>
                    {badge > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-background">
                        {badge}
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
              <div className="truncate text-xs font-medium text-white/85">{companyName}</div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${approved ? "bg-success" : "bg-accent"}`}
                />
                <span className="text-[11px] font-medium text-white/55">
                  {approved ? "Verified supplier" : "Pending review"}
                </span>
              </div>
            </div>
            <Link
              to="/supplier/profile"
              title="Company profile"
              className="shrink-0 text-white/40 hover:text-white/75"
            >
              <Settings className="h-4 w-4" strokeWidth={1.8} />
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
                {NAV.find((l) => l.to === loc.pathname)?.label ?? loc.pathname.split("/").pop()}
              </span>
            </div>

            <div className="flex min-w-0 flex-wrap items-center justify-end gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Supplier
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
                  {NAV.map((l) => {
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
      <ViewAsSwitcher current="Supplier" />
    </div>
  );
}
