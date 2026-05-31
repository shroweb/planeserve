import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Section, Eyebrow, H2 } from "@/components/site/Section";
import heroImage from "@/assets/planeserve-hangar-hero.jpg";
import {
  ArrowRight,
  Building2,
  Clock,
  Globe2,
  Plane,
  RadioTower,
  Search,
  ShieldCheck,
  Wrench,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlaneServe — Retained AOG support for older private & business aircraft" },
      {
        name: "description",
        content:
          "PlaneServe is a retained AOG sourcing desk for older private and business aircraft — your aircraft profile and part context on file before downtime, with verified supplier outreach when you go AOG.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-[oklch(0.13_0.025_250)] text-white">
        <img
          src={heroImage}
          alt="Private jet in a premium hangar prepared for maintenance support"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,oklch(0.10_0.025_250)_0%,oklch(0.11_0.025_250_/_0.95)_35%,oklch(0.11_0.025_250_/_0.5)_65%,oklch(0.11_0.025_250_/_0.15)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[oklch(0.13_0.025_250)] to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col justify-between px-6 py-12 md:py-20">
          <div className="max-w-3xl pt-8 md:pt-20">
            <div className="inline-flex items-center gap-2 border border-white/15 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur">
              <RadioTower className="h-3.5 w-3.5 text-accent" />
              Retained AOG desk · private &amp; business aviation
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
              AOG support for{" "}
              <span className="font-serif italic font-normal text-accent">older</span> private &amp;
              business aircraft.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/65 md:text-lg">
              Hard-to-source parts handled before downtime becomes chaos. Your aircraft profile,
              urgency context and contacts are on file in advance — so when you go AOG, the desk
              already knows the aircraft.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/enrol"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold text-[oklch(0.16_0.02_250)] transition-opacity hover:opacity-90"
              >
                Enrol Aircraft <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/submit-aog"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
              >
                Request AOG Support
              </Link>
            </div>
          </div>

          {/* Stat bar */}
          <div className="mt-16 grid gap-px overflow-hidden border border-white/10 bg-white/8 backdrop-blur md:grid-cols-4">
            {[
              ["24 / 7", "AOG request intake"],
              ["Vetted", "Supplier outreach"],
              ["Per aircraft", "Retained subscription"],
              ["On file", "Aircraft context in advance"],
            ].map(([k, v]) => (
              <div key={k} className="bg-[oklch(0.11_0.025_250_/_0.7)] px-6 py-5">
                <div className="text-base font-semibold tracking-tight text-accent">{k}</div>
                <div className="mt-1 text-xs text-white/55">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Not a marketplace ─────────────────────────────────────────────── */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <Eyebrow>Positioning</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Not another parts marketplace.{" "}
            <span className="font-serif italic font-normal text-accent">
              A retained AOG sourcing desk.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            We don't expect a lean private operator to search endless inventories at 2am. PlaneServe
            enrols your aircraft in advance, holds the details that matter, and runs verified
            supplier outreach when you're grounded. The big platforms help you buy parts —
            PlaneServe helps you handle the AOG.
          </p>
        </div>
      </section>

      {/* ── Why Operators Trust It ────────────────────────────────────────── */}
      <section className="border-b border-border bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 lg:min-h-[540px]">
            <div className="flex flex-col justify-center px-6 py-16 lg:px-12">
              <Eyebrow>Why Operators Trust It</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                A retained parts lane for aircraft that cannot wait.
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground max-w-md">
                Most operators start from zero when an AOG happens. PlaneServe changes that — your
                aircraft data, support contacts and part context are ready before the call comes in.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  [
                    "AOG-first intake",
                    "Capture aircraft, location, urgency, part numbers and files in one request.",
                  ],
                  [
                    "Aircraft context",
                    "Engine, serial, base and known issues stay attached to every case.",
                  ],
                  [
                    "Admin triage",
                    "Submitted, sourcing, approval and resolved queues keep ops focused.",
                  ],
                  [
                    "Per-aircraft pricing",
                    "Create an account free, then pay only per enrolled aircraft.",
                  ],
                ].map(([title, body]) => (
                  <div
                    key={title}
                    className="group rounded-sm border border-border bg-card px-5 py-4 hover:border-accent/40 transition-colors"
                  >
                    <div className="h-0.5 w-6 bg-accent mb-3" />
                    <div className="text-sm font-semibold tracking-tight">{title}</div>
                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&auto=format&fit=crop&q=80"
                alt="Private jet on the apron at sunset"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <Section id="how">
        <div className="max-w-2xl">
          <Eyebrow>The AOG lane</Eyebrow>
          <H2>What the desk does the moment you go AOG.</H2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Your aircraft is already enrolled, so there's no cold start. Submit the request and the
            sourcing desk runs the lane:
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              n: "01",
              t: "Confirm the situation",
              d: "Aircraft, location, urgency and people-on-board confirmed against the profile on file.",
            },
            {
              n: "02",
              t: "Validate the part",
              d: "Part number checked, alternates and superseded references identified for older types.",
            },
            {
              n: "03",
              t: "Contact verified suppliers",
              d: "RFQs go out to vetted suppliers matched to the aircraft type and system.",
            },
            {
              n: "04",
              t: "Check trace paperwork",
              d: "8130-3 / EASA Form 1 and traceability confirmed before anything is presented.",
            },
            {
              n: "05",
              t: "Present serviceable options",
              d: "Condition, lead time, route and price laid out for your decision — no margin shown.",
            },
            {
              n: "06",
              t: "Coordinate dispatch",
              d: "Quote, AWB, freight tracking and status updates flow back to your team.",
            },
          ].map((s) => (
            <div key={s.n} className="bg-card px-6 py-7">
              <div className="font-mono text-xs font-bold text-accent">{s.n}</div>
              <div className="mt-3 text-base font-semibold tracking-tight">{s.t}</div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            Learn more about the process <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* ── Three pillars ─────────────────────────────────────────────────── */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-px md:grid-cols-3 bg-white/8 border border-white/8 overflow-hidden rounded-md">
            {[
              {
                i: ShieldCheck,
                t: "Retained readiness",
                d: "Your aircraft profile is in place before an AOG event starts — not assembled during one.",
              },
              {
                i: Search,
                t: "Hard-to-find focus",
                d: "Built for older, specialist and time-sensitive parts that aren't on the first shelf.",
              },
              {
                i: Clock,
                t: "Time-aware handling",
                d: "Every case is treated with grounded-aircraft urgency, not ordinary procurement pace.",
              },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="bg-[oklch(0.15_0.025_250)] px-8 py-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 border border-accent/20">
                  <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </div>
                <div className="mt-5 text-base font-semibold tracking-tight">{t}</div>
                <p className="mt-2 text-sm leading-7 text-white/55">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who It Serves ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white">
        <img
          src="https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=1600&auto=format&fit=crop&q=80"
          alt="Business jet on night apron"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[oklch(0.10_0.025_250_/_0.90)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-xl">
            <Eyebrow>Who It Serves</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Built for aircraft that don't have easy support.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/60">
              PlaneServe is for older private and business aircraft — where OEM support has thinned,
              supplier knowledge is fragmented, and the operator may not have a dedicated parts team.
              It gives a lean team a credible, retained sourcing desk without building one.
            </p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Private aircraft owners",
              "Business aircraft operators",
              "Small charter operators",
              "Aircraft management firms",
              "FBO support teams",
              "Maintenance providers",
            ].map((c) => (
              <div
                key={c}
                className="flex items-center gap-3 border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
                <div className="text-sm font-medium text-white/86">{c}</div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              to="/enrol"
              className="inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-3 text-sm font-semibold text-[oklch(0.16_0.02_250)] hover:opacity-90"
            >
              Enrol your aircraft <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── What's Included ───────────────────────────────────────────────── */}
      <Section>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <Eyebrow>What's Included</Eyebrow>
            <H2>Everything your team needs when an aircraft goes down.</H2>
          </div>
          <Link
            to="/services"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              i: Wrench,
              t: "AOG parts sourcing",
              d: "Active sourcing across a global supplier network for time-critical parts.",
            },
            {
              i: Clock,
              t: "24/7 request intake",
              d: "Submit an AOG request any time — day, night, weekend or holiday.",
            },
            {
              i: Plane,
              t: "Aircraft enrolment",
              d: "Engine, serial, base and contact details held on file and ready to act.",
            },
            {
              i: Globe2,
              t: "Global supplier access",
              d: "Reach a vetted network of global suppliers for both common and hard-to-find parts.",
            },
            {
              i: Search,
              t: "Older aircraft support",
              d: "Specialist focus on out-of-production types, alternates and legacy part numbers.",
            },
            {
              i: Building2,
              t: "Operator communications",
              d: "Sourcing options, status updates and approvals flow directly to your team.",
            },
          ].map(({ i: Icon, t, d }) => (
            <div
              key={t}
              className="group relative rounded-md border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-accent/20 bg-accent/5">
                <Icon className="h-4.5 w-4.5 text-accent" strokeWidth={1.5} />
              </div>
              <div className="mt-5 text-base font-semibold tracking-tight">{t}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-xl mx-auto">
            <Eyebrow>Pricing</Eyebrow>
            <H2>Simple retained support per aircraft.</H2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Keep PlaneServe available as a support route before the aircraft is grounded. No setup
              fees. Pay per enrolled aircraft.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <PricingCard
              name="Monthly"
              price="$100"
              cadence="per aircraft / month"
              features={[
                "24/7 AOG request access",
                "Aircraft details on file",
                "Supplier network sourcing",
                "Operator updates",
              ]}
            />
            <PricingCard
              name="Annual"
              price="$1,000"
              cadence="per aircraft / year"
              featured
              features={[
                "Everything in Monthly",
                "Two months free",
                "Priority on long-running cases",
                "Annual aircraft review",
              ]}
            />
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Each aircraft is enrolled separately. Cancel at any time.
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[oklch(0.13_0.025_250)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.25_0.06_250_/_0.3),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <Eyebrow>Get Started</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight leading-[1.1] md:text-5xl">
              Enrol before the AOG,{" "}
              <span className="font-serif italic font-normal text-accent">not during it.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/60">
              Your aircraft profile, contact details and support route are already in place when
              downtime starts — so your team isn't making cold calls at 2am.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold text-[oklch(0.16_0.02_250)] hover:opacity-90"
              >
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/5"
              >
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function PricingCard({
  name,
  price,
  cadence,
  features,
  featured,
}: {
  name: string;
  price: string;
  cadence: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-md p-8 ${
        featured
          ? "border-2 border-accent bg-background shadow-[0_0_40px_oklch(0.7_0.18_85_/_0.12)]"
          : "border border-border bg-background"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {name}
        </div>
        {featured && (
          <div className="rounded-sm bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[oklch(0.16_0.02_250)]">
            Best value
          </div>
        )}
      </div>
      <div className="mt-6 flex items-baseline gap-2">
        <div className="text-4xl font-semibold tracking-tight">{price}</div>
        <div className="text-sm text-muted-foreground">{cadence}</div>
      </div>
      <ul className="mt-7 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
            <span className="text-foreground/80">{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/enrol"
        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-sm py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
          featured
            ? "bg-accent text-[oklch(0.16_0.02_250)]"
            : "border border-border text-foreground hover:bg-muted"
        }`}
      >
        Enrol aircraft <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
