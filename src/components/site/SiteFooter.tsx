import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[oklch(0.16_0.02_250)] text-[oklch(0.85_0.005_90)]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="text-sm font-semibold tracking-tight text-white">PlaneServe</div>
          <p className="mt-3 text-xs leading-relaxed text-white/60">
            AOG parts support for private and business aircraft.
          </p>
        </div>
        <FooterCol
          title="Platform"
          items={[
            { to: "/services", label: "Services" },
            { to: "/pricing", label: "Pricing" },
            { to: "/how-it-works", label: "How It Works" },
          ]}
        />
        <FooterCol
          title="Get Support"
          items={[
            { to: "/enrol", label: "Enrol Aircraft" },
            { to: "/submit-aog", label: "AOG Support" },
            { to: "/login", label: "Member Login" },
          ]}
        />
        <FooterCol
          title="Suppliers & Access"
          items={[
            { to: "/suppliers/apply", label: "Become a Supplier" },
            { to: "/supplier/login", label: "Supplier Portal" },
            { to: "/admin/login", label: "Admin Login" },
          ]}
        />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-white/40">
          © {new Date().getFullYear()} PlaneServe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-white/70">{title}</div>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-white/60 hover:text-white">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
