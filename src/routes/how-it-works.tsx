import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import {
  ArrowRight,
  PlaneTakeoff,
  FileText,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorks,
});

const steps = [
  {
    n: "01",
    icon: PlaneTakeoff,
    t: "Enrol your aircraft",
    d: "Submit registration, type, category, base airport and engine details. Your aircraft profile is created and held on file — ready before any AOG event starts.",
    detail: [
      "Registration and serial number",
      "Engine type and series",
      "Base airport (ICAO)",
      "Owner and operator contact details",
    ],
  },
  {
    n: "02",
    icon: FileText,
    t: "Complete your aircraft profile",
    d: "Add engine specs, maintenance contacts, insurer details and AMO information. The more PlaneServe knows upfront, the faster sourcing can begin when time is against you.",
    detail: [
      "Engine serial numbers",
      "Maintenance programme",
      "AMO contact and emergency line",
      "Insurance policy reference",
    ],
  },
  {
    n: "03",
    icon: Clock,
    t: "Submit the AOG request",
    d: "When an aircraft goes down, open a request. Describe the issue, affected system and part number. Attach tech log extracts or photos. PlaneServe receives it immediately.",
    detail: [
      "Free-text issue description",
      "Part number and ATA chapter",
      "Current location",
      "Urgency level",
    ],
  },
  {
    n: "04",
    icon: Search,
    t: "PlaneServe sources options",
    d: "The PlaneServe desk works the supplier network on your behalf. Quotes are gathered with condition, price, lead time, paperwork and freight route attached.",
    detail: [
      "Serviceable and exchange options",
      "Freight route and lead time",
      "Paperwork and certifications",
      "Multiple supplier quotes",
    ],
  },
  {
    n: "05",
    icon: CheckCircle2,
    t: "You approve, we order",
    d: "Sourcing options land in your dashboard. Review supplier, price, lead time and condition — then approve the option that works. PlaneServe places the order and tracks delivery.",
    detail: [
      "Side-by-side option comparison",
      "One-click approval",
      "Order placed same day",
      "Delivery tracking updates",
    ],
  },
  {
    n: "06",
    icon: MessageSquare,
    t: "Direct status updates",
    d: "From order placed to part arrived, status updates flow directly back to your team. No chasing, no uncertainty — just clear progress on the case.",
    detail: [
      "In-transit and arrival notifications",
      "Exception alerts (customs, MEL, etc.)",
      "Resolved case record",
      "Full case history retained",
    ],
  },
];

function HowItWorks() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Eyebrow>How It Works</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            A direct route to AOG support,{" "}
            <span className="font-serif italic font-normal text-accent">before you need it.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/60">
            PlaneServe is not a marketplace you log into during a crisis. It's a retained support
            lane — aircraft profile, urgency context and contacts already in place before the first
            call comes in.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-0">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const even = i % 2 === 0;
              return (
                <div
                  key={s.n}
                  className={`grid gap-12 border-b border-border py-16 lg:grid-cols-2 lg:items-center ${
                    even ? "" : "lg:[&>*:first-child]:order-2"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-accent font-mono text-sm font-bold text-accent">
                        {s.n}
                      </div>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">
                      {s.t}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{s.d}</p>
                    <ul className="mt-6 space-y-2">
                      {s.detail.map((d) => (
                        <li
                          key={d}
                          className="flex items-center gap-2.5 text-sm text-foreground/80"
                        >
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 text-accent"
                            strokeWidth={1.5}
                          />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex h-48 w-48 items-center justify-center rounded-full border border-accent/20 bg-accent/5">
                      <Icon className="h-20 w-20 text-accent/30" strokeWidth={1} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                i: ShieldCheck,
                t: "Retained, not reactive",
                d: "Your profile is in place before an AOG happens — not assembled during one.",
              },
              {
                i: Clock,
                t: "Time-critical by design",
                d: "Every case is handled with grounded-aircraft urgency, not standard procurement pace.",
              },
              {
                i: Search,
                t: "Specialist parts focus",
                d: "Built for older, out-of-production and hard-to-find parts that aren't on the first shelf.",
              },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="flex gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-accent/20 bg-accent/5">
                  <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-semibold tracking-tight">{t}</div>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Ready to enrol your aircraft?
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/60 max-w-xl">
              It takes less than five minutes to add an aircraft and activate your support lane.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row shrink-0">
            <Link
              to="/enrol"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold text-[oklch(0.16_0.02_250)] hover:opacity-90"
            >
              Enrol Aircraft <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/5"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
