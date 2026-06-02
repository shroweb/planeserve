import { Link } from "@tanstack/react-router";
import { TakeoffIcon } from "@/components/app/PlaneServeIcons";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[oklch(0.16_0.02_250)] text-[oklch(0.85_0.005_90)]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <TakeoffIcon className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold tracking-tight text-white">PlaneServe</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/50">
              A retained AOG parts support route for private and business aircraft operators.
            </p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/70">
              Keeping you flying, anywhere, anytime.
            </p>
            <div className="mt-4 text-xs font-medium text-success">
              Desk active · 24/7 controller cover
            </div>
          </div>

          <FooterCol
            title="Product"
            items={[
              { to: "/how-it-works", label: "How it works" },
              { to: "/services", label: "Services" },
              { to: "/pricing", label: "Pricing" },
              { to: "/enrol", label: "Enrol aircraft" },
            ]}
          />
          <FooterCol
            title="Operators"
            items={[
              { to: "/login", label: "Member sign in" },
              { to: "/submit-aog", label: "Submit AOG" },
              { to: "/aircraft", label: "Aircraft profiles" },
              { to: "/dashboard", label: "Documents" },
            ]}
          />
          <FooterCol
            title="Network"
            items={[
              { to: "/supplier/login", label: "Supplier portal" },
              { to: "/suppliers/apply", label: "Become a supplier" },
              { to: "/services", label: "Coverage" },
              { to: "/how-it-works", label: "Trace standards" },
            ]}
          />
          <FooterCol
            title="Company"
            items={[
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ]}
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 px-6 py-5">
          <div className="text-xs text-white/35">
            © {new Date().getFullYear()} PlaneServe Ltd. All rights reserved.
          </div>
          <div className="text-xs text-white/25 tracking-wide">
            Operations · London · Geneva · Dubai
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-3">{title}</div>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-white/55 hover:text-white transition-colors">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
