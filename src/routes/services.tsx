import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import {
  ArrowRight,
  Wrench,
  Clock,
  PlaneTakeoff,
  Globe2,
  Search,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  component: Services,
});

const services = [
  {
    icon: Wrench,
    t: "AOG parts sourcing",
    d: "When an aircraft goes down, PlaneServe works the sourcing route on your behalf — reaching out to our vetted supplier network to locate the part, fast. Serviceable, exchange, overhauled and new conditions sourced.",
    points: [
      "Global supplier network",
      "Serviceable and exchange options",
      "Condition and paperwork verified",
    ],
  },
  {
    icon: Clock,
    t: "24 / 7 request intake",
    d: "AOG events don't follow office hours. Submit a request any time — day, night, weekend or holiday. PlaneServe receives it immediately and the sourcing process begins without delay.",
    points: ["Round-the-clock intake", "Immediate acknowledgement", "Urgency-aware handling"],
  },
  {
    icon: PlaneTakeoff,
    t: "Aircraft enrolment and profile",
    d: "Enrol each aircraft with registration, type, engine details, base airport and contacts. Your profile is held on file so PlaneServe can act without starting from scratch when downtime hits.",
    points: [
      "Engine and serial details",
      "AMO and insurance contacts",
      "Tier 2 verification for full cover",
    ],
  },
  {
    icon: Globe2,
    t: "Global supplier network",
    d: "PlaneServe sources across a global network of approved suppliers. Quotes include supplier name, condition, price, lead time, freight route and paperwork — presented for your approval.",
    points: [
      "Multiple quotes per case",
      "Lead time and freight included",
      "Certifications verified",
    ],
  },
  {
    icon: Search,
    t: "Older and specialist aircraft",
    d: "Many PlaneServe operators fly older or out-of-production types where OEM availability is limited. PlaneServe is built for these cases — alternate part numbers, legacy suppliers and specialist sourcing routes.",
    points: ["Out-of-production focus", "Alternate PN lookup", "Legacy supplier contacts"],
  },
  {
    icon: MessageSquare,
    t: "Direct operator updates",
    d: "From sourcing started to part arrived, status updates flow directly to the owner, operator or maintenance lead. No chasing, no uncertainty — you see every step of the case in your dashboard.",
    points: [
      "In-dashboard case tracking",
      "In-transit and arrival alerts",
      "Exception notices (customs, MEL, export)",
    ],
  },
];

function Services() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            Everything included in your{" "}
            <span className="font-serif italic font-normal text-accent">
              PlaneServe subscription.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/60">
            One per-aircraft subscription covers the full AOG support lane — from profile enrolment
            to part delivered. No add-ons, no per-request fees.
          </p>
        </div>
      </section>

      {/* Service list */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-px bg-border border border-border overflow-hidden rounded-md md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.t} className="bg-card p-8 flex flex-col">
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-accent/20 bg-accent/5">
                    <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="mt-5 text-base font-semibold tracking-tight">{s.t}</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground flex-1">{s.d}</p>
                  <ul className="mt-5 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-xs text-foreground/70">
                        <CheckCircle2
                          className="h-3.5 w-3.5 shrink-0 text-accent"
                          strokeWidth={1.5}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cover model */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>Cover Model</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Retained cover, not per-event billing.
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                PlaneServe works on a per-aircraft subscription. Enrol each aircraft once —
                PlaneServe holds your profile, stands ready for requests, and sources parts whenever
                you need it. No per-case fees on top of your subscription.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Unlimited AOG requests per enrolled aircraft",
                  "Aircraft profile retained for the subscription lifetime",
                  "Cancel at the end of any billing period",
                  "Add or remove aircraft at any time",
                ].map((p) => (
                  <div key={p} className="flex items-center gap-3 text-sm">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-border bg-background p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                What's covered
              </div>
              <div className="mt-6 space-y-4">
                {[
                  ["Parts sourcing", "Included"],
                  ["24/7 request intake", "Included"],
                  ["Supplier quotes", "Included"],
                  ["Freight and delivery tracking", "Included"],
                  ["Direct operator updates", "Included"],
                  ["Aircraft profile storage", "Included"],
                  ["Per-case sourcing fee", "None"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0 text-sm"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-accent">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Activate your AOG support lane.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/60 max-w-xl">
              Enrol your aircraft and complete the profile — PlaneServe is then ready before you
              need it.
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
