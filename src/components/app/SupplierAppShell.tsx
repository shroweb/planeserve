import { Link, useLocation } from "@tanstack/react-router";
import { ViewAsSwitcher } from "./ViewAsSwitcher";
import { Menu, Plane, Package, History, UserCircle, LogOut } from "lucide-react";
import { signOutAndRedirect } from "@/lib/sign-out";
import type { LucideIcon } from "lucide-react";

const NAV: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/supplier", label: "RFQ Inbox", icon: Package },
  { to: "/supplier/quote-history", label: "Quote History", icon: History },
  { to: "/supplier/profile", label: "Profile", icon: UserCircle },
];

export function SupplierAppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();

  async function signOut() {
    await signOutAndRedirect("/supplier/login");
  }

  return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.005_240)] text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col bg-[oklch(0.14_0.02_250)] text-white md:flex">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <Plane className="h-5 w-5 text-accent" strokeWidth={1.5} />
          <div>
            <div className="text-sm font-semibold tracking-tight">PlaneServe</div>
            <div className="text-[10px] uppercase tracking-widest text-white/50">
              Supplier Portal
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV.map((l) => {
            const active = loc.pathname === l.to;
            const Icon = l.icon;
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
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="text-[11px] text-white/40">Supplier · Portal</div>
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
