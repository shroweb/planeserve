import heroImage from "@/assets/WhatsApp Image 2026-06-28 at 10.29.12.jpeg";
import { PlaneServeLogo } from "@/components/site/PlaneServeLogo";

// Split-screen auth shell: brand panel (image + line) on the left, form on the
// right. Used by the sign-in / set-password screens.
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="brand-dark relative hidden w-1/2 flex-col justify-end overflow-hidden bg-[oklch(0.13_0.025_250)] lg:flex">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.02_250)] via-[oklch(0.12_0.02_250)]/30 to-transparent" />
        <div className="relative z-10 p-12">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            PlaneServe · AOG Desk
          </div>
          <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
            Enrol before the AOG,{" "}
            <span className="font-serif font-normal italic text-accent">not during it.</span>
          </h2>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-background px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <PlaneServeLogo
            className="mb-8"
            wordClassName="text-lg font-semibold tracking-tight text-foreground"
          />
          {children}
        </div>
      </div>
    </div>
  );
}
