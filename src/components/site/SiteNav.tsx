import { Link } from "@tanstack/react-router";
import { Menu, Plane } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { signOutAndRedirect } from "@/lib/sign-out";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
];

export function SiteNav() {
  const session = authClient.useSession();
  const signedIn = !!session.data?.user;
  async function signOut() {
    await signOutAndRedirect("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <Plane className="h-4 w-4 text-accent" strokeWidth={1.5} />
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">PlaneServe</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {publicLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {signedIn ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-sm bg-accent px-4 py-2.5 text-[13px] font-semibold text-[oklch(0.16_0.02_250)]"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                to="/enrol"
                className="rounded-sm bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground"
              >
                Enrol Aircraft
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <details className="relative lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-sm border border-border text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
            <Menu className="h-4 w-4" />
          </summary>
          <div className="absolute right-0 top-12 z-50 w-64 rounded-md border border-border bg-card p-2 shadow-xl">
            {publicLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block rounded-sm px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "text-foreground bg-muted" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              {signedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block rounded-sm px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={signOut}
                    className="block w-full rounded-sm px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block rounded-sm px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/enrol"
                    className="block rounded-sm px-3 py-2.5 text-sm font-medium text-accent hover:bg-muted"
                  >
                    Enrol Aircraft
                  </Link>
                </>
              )}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
