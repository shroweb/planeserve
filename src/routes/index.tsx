import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import heroImage from "@/assets/planeserve-hangar-hero.jpg";
import citationDusk from "@/assets/citation-dusk-ramp.jpeg";
import founderAircraft from "@/assets/WhatsApp Image 2026-06-03 at 17.32.26.jpeg";
import {
  ArrowRightIcon,
  BroadcastIcon,
  ClearedIcon,
  SearchIcon,
  SlaIcon,
  GlobeIcon,
  BillingIcon,
  ChevronDownIcon,
  MessageIcon,
} from "@/components/app/PlaneServeIcons";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlaneServe — AOG parts support for aircraft that cannot wait" },
      {
        name: "description",
        content:
          "PlaneServe is a retained AOG parts support service for private and business aircraft. We keep your aircraft details ready before downtime starts, then help source hard-to-find parts.",
      },
    ],
  }),
  component: Home,
});

const FAQ_ITEMS = [
  {
    q: "What counts as an AOG request?",
    a: "Any part need that is keeping — or about to keep — your aircraft on the ground. You submit the tail, the system or ATA chapter, the base and the urgency; the desk triages it immediately.",
  },
  {
    q: "How fast does the desk respond?",
    a: "Enrolled operators typically receive a first acknowledgement within minutes. RFQs go out immediately — we don't queue requests or wait for business hours.",
  },
  {
    q: "Do you guarantee a part will be available?",
    a: "No. We guarantee the search, not the stock. For older platforms, availability depends on the supplier market — that's outside our control. What we control is the speed and breadth of the outreach, and the quality of what we present back to you.",
  },
  {
    q: "What paperwork do you handle?",
    a: "We verify 8130-3 and EASA Form 1 on every option before it reaches your dashboard. We also flag trace gaps, confirm shelf life where relevant, and coordinate with your AMO on documentation requirements.",
  },
  {
    q: "Can I enrol a managed fleet?",
    a: "Yes. We support multiple aircraft under one account. Each tail has its own profile, and your AOG cases are tracked separately. Contact the desk for fleet pricing.",
  },
];

function Home() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] overflow-hidden bg-[#041c2c] text-white">
        <img
          src={heroImage}
          alt="Private jet in a premium hangar prepared for maintenance support"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,oklch(0.10_0.025_250)_0%,oklch(0.11_0.025_250_/_0.95)_35%,oklch(0.11_0.025_250_/_0.5)_65%,oklch(0.11_0.025_250_/_0.15)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#041c2c] to-transparent" />

        <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-6 py-12 md:py-20">
          <div className="w-fit inline-flex items-center gap-2 border border-white/15 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur">
            <BroadcastIcon className="h-3.5 w-3.5 text-accent" />
            Keeping you flying, anywhere, anytime
          </div>
          <h1 className="mt-7 text-[clamp(2.5rem,3.5vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em] [text-wrap:balance]">
            AOG parts support for aircraft that <span className="text-accent">cannot wait.</span>
          </h1>
          <div className="max-w-3xl">
            <p className="mt-7 max-w-xl text-base leading-8 text-white/75 md:text-lg">
              PlaneServe is an enrolment programme for aircraft owners and operators. Enrol your aircraft,
              put your details on file, and the desk is ready to source parts the moment you go AOG.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/enrol"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Enrol Aircraft <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/35">
              Takes 5 minutes to enrol · No contract · Cancel any time
            </p>
          </div>
        </div>
      </section>

      {/* ── Benefits strip ────────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
            {[
              {
                Icon: GlobeIcon,
                title: "Global AOG support",
                desc: "Supplier network spanning the US, Europe, and beyond — matched to your aircraft type and location.",
              },
              {
                Icon: BillingIcon,
                title: "Predictable costs",
                desc: "Flat monthly fee per aircraft. Zero markup on parts or freight. No per-case billing surprises.",
              },
              {
                Icon: SlaIcon,
                title: "24/7 availability",
                desc: "The desk runs year-round with no out-of-hours cut-off. Submit an AOG request any time.",
              },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 px-6 py-8 first:pl-0 last:pr-0 sm:first:pl-6 sm:last:pr-6"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
                <div>
                  <div className="font-semibold text-sm">{title}</div>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plain English Explanation ─────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <Eyebrow>What is PlaneServe?</Eyebrow>
          <p className="mt-8 text-2xl font-bold leading-relaxed md:text-3xl lg:text-4xl lg:leading-tight">
            PlaneServe is a <span className="text-accent">retained AOG parts support service</span>{" "}
            for private and business aircraft.
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            When an enrolled aircraft goes technical, your aircraft details, support contacts and
            key part context are already on file. Our desk can move straight into sourcing, supplier
            outreach and option verification instead of rebuilding the aircraft profile from scratch.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            The service grew from years of owners and operators asking James Moon for help finding
            parts that had slipped out of obvious distribution. PlaneServe turns those calls into
            a formal aircraft enrolment programme with a retained AOG desk behind it.
          </p>
        </div>
      </section>

      {/* ── The Problem vs Solution ───────────────────────────────────────── */}
      <section className="bg-[#041c2c] border-b border-white/10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl text-white">
                When an aircraft goes technical, most operators{" "}
                <span className="text-accent">start from zero.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-white/60">
                They need to confirm aircraft details, locate the right part, find suppliers, check
                documentation, compare options and coordinate the next step — all while the aircraft
                is grounded and the pressure is mounting.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-sm bg-destructive/25">
                    <SearchIcon className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Fragmented knowledge</div>
                    <p className="mt-1 text-sm text-white/55">
                      Searching endless inventories and calling unknown suppliers at 2am.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-sm bg-destructive/25">
                    <SlaIcon className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Cold-start delays</div>
                    <p className="mt-1 text-sm text-white/55">
                      Hours lost just explaining the aircraft configuration and part urgency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-lg border border-border bg-background p-8 shadow-sm lg:p-12">
              <div className="absolute -top-4 left-8 rounded-sm bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                The PlaneServe Way
              </div>
              <h3 className="text-2xl font-semibold">The desk already knows the aircraft.</h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Registration, engine serials, base ICAO, AMO contacts — all held on file before
                anything goes wrong. We don't waste the first hour rebuilding the aircraft profile.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Aircraft configuration on file before the AOG",
                  "Vetted suppliers matched to this aircraft type",
                  "Trace and paperwork requirements pre-noted",
                  "Direct line to the sourcing desk",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <ClearedIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/enrol"
                className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Get your aircraft on file <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dispatch Log / Scenario ───────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <Eyebrow>What Actually Happens</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl leading-tight">
                From grounded to moving,{" "}
                <span className="text-accent">without the cold-start delay.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                Because your aircraft details are already on file, the desk skips the discovery
                phase entirely. No intake forms at 2am. No back-and-forth on serial numbers.
                Immediate supplier outreach using the aircraft record captured at enrolment.
              </p>

              <div className="mt-10 space-y-5 border-l-2 border-accent/30 pl-6">
                {[
                  {
                    label: "Enrolment",
                    desc: "Aircraft profile captured in advance. Under five minutes.",
                  },
                  {
                    label: "AOG call",
                    desc: "No intake form. RFQs out to vetted suppliers within minutes.",
                  },
                  {
                    label: "Options",
                    desc: "8130-3 / EASA Form 1 verified before anything reaches you.",
                  },
                  {
                    label: "Dispatch",
                    desc: "One approval. We coordinate freight and AMO notification.",
                  },
                ].map((step) => (
                  <div key={step.label}>
                    <div className="text-xs font-semibold text-accent tracking-wide">
                      {step.label}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Case record */}
            <div className="border border-border bg-card rounded-sm overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-muted/40">
                <span className="font-mono text-[11px] text-muted-foreground tracking-wide">
                  PSV-0147
                </span>
                <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider">
                  Resolved
                </span>
              </div>

              <div className="px-5 py-4 border-b border-border space-y-2.5">
                {[
                  ["Aircraft", "G-FALC · Falcon 900EX"],
                  ["Engine", "TFE731-5AR"],
                  ["Location", "LFMN — Nice Côte d'Azur"],
                  ["Fault", "Right MLG indicator fault"],
                  ["On file", "Yes — enrolled 3 months prior"],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[6rem_1fr] gap-2 text-sm">
                    <span className="text-muted-foreground text-xs pt-px">{label}</span>
                    <span className="font-mono text-xs font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="px-5 py-4 border-b border-border">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Timeline
                </div>
                <div className="space-y-2">
                  {[
                    ["23:47", "AOG reported"],
                    ["23:51", "Desk activated — no intake required"],
                    ["00:04", "RFQs out to 7 suppliers (EU + US)"],
                    ["02:31", "3 options returned, EASA Form 1 confirmed"],
                    ["02:33", "Option A approved"],
                    ["08:15", "Part at LFMN — aircraft released"],
                  ].map(([time, event]) => (
                    <div key={time} className="grid grid-cols-[3.5rem_1fr] gap-2 text-xs">
                      <span className="font-mono text-muted-foreground tabular-nums">{time}</span>
                      <span className="text-foreground/80">{event}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3 bg-muted/30">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    ["2h 44m", "to first options"],
                    ["0%", "part markup"],
                    ["3", "verified quotes"],
                  ].map(([val, label]) => (
                    <div key={label}>
                      <div className="text-sm font-semibold tabular-nums">{val}</div>
                      <div className="text-[10px] text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder Section ───────────────────────────────────────────────*/}
      <section className="overflow-hidden bg-[#041c2c] text-white">
        <div className="grid lg:grid-cols-[5fr_7fr]">
          {/* Aircraft image */}
          <div className="relative min-h-[380px] lg:min-h-[560px]">
            <img
              src={founderAircraft}
              alt="Business aircraft in a maintenance hangar"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041c2c] via-[#041c2c]/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#041c2c]" />
          </div>

          {/* Quote */}
          <div className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent/70">
              From the founder
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
              Founded by an aviation entrepreneur. Built from necessity.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">
              PlaneServe came from the repeated reality of legacy aircraft ownership: an operator
              needs a difficult part, the obvious channels have gone quiet, and someone with the
              right network has to know where to look.
            </p>
            <blockquote className="mt-8">
              <p className="font-serif text-2xl italic leading-[1.5] tracking-normal text-white/90 md:text-3xl md:leading-[1.45]">
                "I kept helping because I could. Eventually it became obvious that this wasn't a
                favour. It was a service the market genuinely needed."
              </p>
              <footer className="mt-8 flex items-center gap-4">
                <div className="h-px w-8 bg-accent/40" />
                <div>
                  <div className="text-sm font-semibold text-white">James Moon</div>
                  <div className="text-xs text-white/40">Founder, PlaneServe</div>
                </div>
              </footer>
            </blockquote>
            <Link
              to="/about"
              className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline self-start"
            >
              Read the founder story <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 lg:items-center">
            <div>
              <Eyebrow>Pricing</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Simple retained support per aircraft.
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                One flat fee keeps your aircraft profile on file and the desk active. No per-case
                charges, no markups on parts or freight.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "24/7 AOG request access",
                  "Aircraft details permanently on file",
                  "Global vetted supplier network",
                  "8130-3 / EASA Form 1 verification",
                  "Freight & AMO coordination",
                  "No markup on parts or freight",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <ClearedIcon className="h-4 w-4 text-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/pricing"
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              >
                Full pricing details <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-sm border-2 border-accent bg-background p-8 shadow-xl relative">
              <div className="absolute -top-4 left-8 bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Retained Enrolment
              </div>
              <div className="flex items-end gap-2">
                <div className="text-6xl font-bold tracking-tight">$100</div>
                <div className="mb-2 text-sm text-muted-foreground leading-tight">
                  per aircraft
                  <br />/ month
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                or $1,000 billed annually — save two months.
              </p>
              <Link
                to="/enrol"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-sm bg-accent py-4 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Enrol your aircraft now <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                No contract · Cancel at end of billing period
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ────────────────────────────────────────────────── */}
      <FaqSection />

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Left: image */}
          <div className="relative min-h-[320px] lg:min-h-[500px]">
            <img
              src={citationDusk}
              alt="Business jet on the ramp at dusk"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#041c2c]/20 via-transparent to-[#041c2c]" />
          </div>

          {/* Right: dark content panel */}
          <div className="bg-[#041c2c] text-white px-10 py-20 flex flex-col justify-center lg:px-16">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              Aircraft enrolment programme
            </div>
            <h2 className="mt-5 text-4xl font-bold tracking-tight leading-[1.1] md:text-5xl lg:text-[1.65rem] xl:text-[2rem] lg:whitespace-nowrap">
              Enrol before the AOG, <span className="text-accent">not during it.</span>
            </h2>
            <p className="mt-6 text-base leading-7 text-white/60">
              Put your aircraft profile and trace paperwork on file today. The next time a part
              grounds you, the desk is already moving.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/enrol"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-8 py-4 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Enrol your aircraft <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Talk to the desk
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/30">
              Takes 5 minutes · No contract · Cancel any time
            </p>
          </div>
        </div>
      </section>
      {/* Spacer so sticky bar doesn't obscure footer content on mobile */}
      <div className="h-16 md:hidden" />

      {/* Sticky mobile enrol CTA — appears after scrolling past hero */}
      <div
        className={`fixed bottom-0 inset-x-0 z-50 flex md:hidden border-t border-white/10 bg-[#041c2c]/95 backdrop-blur-md px-4 py-3 transition-transform duration-300 ${scrolledPastHero ? "translate-y-0" : "translate-y-full"}`}
      >
        <Link
          to="/enrol"
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-accent py-3.5 text-sm font-semibold text-white"
        >
          Enrol Aircraft <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </PublicLayout>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-start">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl leading-tight">
              Straight answers from the desk.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Can't see what you need? The operations team answers directly — no sales call.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted/60"
            >
              <MessageIcon className="h-4 w-4 text-muted-foreground" />
              Ask the desk
            </Link>
          </div>
          <div className="divide-y divide-border rounded-lg border border-border bg-card overflow-hidden">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold hover:bg-muted/30 transition-colors"
                >
                  {item.q}
                  <ChevronDownIcon
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                {open === i && (
                  <div className="px-5 pb-5 text-sm leading-7 text-muted-foreground border-t border-border pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
