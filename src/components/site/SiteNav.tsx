import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { PlaneServeLogo } from "@/components/site/PlaneServeLogo";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/services", label: "Services" },
  { to: "/parts-sourcing", label: "Parts Desk" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function close() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl relative border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <PlaneServeLogo
          to="/"
          onClick={close}
          wordClassName="text-base font-semibold tracking-tight text-foreground"
        />

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
          <Link
            to="/login"
            className="text-[13px] font-medium text-muted-foreground hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/parts-sourcing"
            className="rounded-sm border border-border bg-background hover:bg-muted px-3.5 py-2 text-[13px] font-medium text-foreground transition-colors"
          >
            Request a Part
          </Link>
          <Link
            to="/enrol"
            className="rounded-sm bg-[#001b2e] hover:bg-[#002845] px-4 py-2 text-[13px] font-semibold text-white transition-colors shadow-xs"
          >
            Enrol Aircraft
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-border text-foreground lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="absolute inset-x-0 top-full z-50 border-t border-border bg-card shadow-xl lg:hidden">
          <div className="p-3">
            {publicLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={close}
                className="block rounded-sm px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "text-foreground bg-muted" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2 space-y-1">
              <Link
                to="/parts-sourcing"
                onClick={close}
                className="block rounded-sm px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                Request a Part
              </Link>
              <Link
                to="/enrol"
                onClick={close}
                className="block rounded-sm px-3 py-2.5 text-sm font-semibold text-white bg-[#001b2e] hover:bg-[#002845]"
              >
                Enrol Aircraft
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
