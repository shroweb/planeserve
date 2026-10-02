import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { submitOneOffPartRequest } from "@/lib/app.functions";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  FileCheck2,
  Plane,
  AlertTriangle,
  Search,
  Sparkles,
  HelpCircle,
  Building2,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/parts-sourcing")({
  head: () => ({
    meta: [
      { title: "Aircraft Parts Sourcing & AOG Desk | Aircraft Program" },
      {
        name: "description",
        content:
          "Certified business jet parts sourcing direct to your base or MRO. Trace-verified rotables and consumables (FAA 8130-3 / EASA Form 1) with 4-hour quote turnaround. Enrolled priority or one-off sourcing.",
      },
      {
        name: "keywords",
        content:
          "aircraft parts sourcing, business jet parts, AOG parts supplier, aviation parts procurement, FAA 8130-3, EASA Form 1, Challenger parts, Citation parts, Gulfstream parts, aircraft rotable components",
      },
      {
        property: "og:title",
        content: "Aircraft Parts Sourcing & AOG Procurement Desk — Aircraft Program",
      },
      {
        property: "og:description",
        content:
          "We locate, vet, and procure certified business jet components with full airworthiness documentation direct to your base or MRO. Enrol for $100/mo or submit a one-off request.",
      },
      { property: "og:url", content: "https://www.aircraftprogram.com/parts-sourcing" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PartsSourcingPage,
});

const AIRFRAMES = [
  {
    make: "Bombardier",
    models: "Challenger 300 / 350 / 604 / 605 · Global Express / 5000 / 6000 / 7500 · Learjet 45 / 75",
    rotables: "Hydraulic pumps, starters, bleed valves, PFCUs, avionics LRUs, windshields",
    slug: "/parts/bombardier",
  },
  {
    make: "Cessna Citation",
    models: "Citation Mustang · CJ1/2/3/4 · XLS / XLS+ · Sovereign · Latitude · Longitude",
    rotables: "Brake packs, starter-generators, fuel control units, flap actuators, EFIS displays",
    slug: "/parts/citation",
  },
  {
    make: "Gulfstream",
    models: "G200 · G280 · GIV / G450 · GV / G550 · G650 / G650ER",
    rotables: "APU line components, environmental packs, elevator servo tabs, DC power contactors",
    slug: "/parts/gulfstream",
  },
  {
    make: "Embraer Executive",
    models: "Phenom 100 / 300 / 300E · Legacy 450 / 500 / 600 / 650 · Praetor 500 / 600",
    rotables: "Brake control valves, nose steering actuators, bleed air regulators, FADEC units",
    slug: "/parts/embraer",
  },
  {
    make: "Hawker & Beechcraft",
    models: "Hawker 750 / 800XP / 850XP / 900XP · King Air 200 / 250 / 350 / 350i",
    rotables: "PT6/TFE731 accessories, autoflight servos, cabin pressure valves, DC generators",
    slug: "/parts/hawker",
  },
  {
    make: "Dassault Falcon",
    models: "Falcon 2000 / 2000EX / 2000LXS · Falcon 900 / 900EX · Falcon 7X / 8X",
    rotables: "Hydraulic power packs, slat actuators, air cycle machines, dual FMS displays",
    slug: "/parts-sourcing#request-form",
  },
];

const FAQS = [
  {
    q: "What documentation accompanies each sourced component?",
    a: "Every single component sourced through Aircraft Program is accompanied by full regulatory airworthiness documentation: FAA Form 8130-3, EASA Form 1, or dual-release certification from accredited 145 repair stations. Back-to-birth trace, non-incident statements (NIS), and tear-down reports are pre-verified prior to dispatch.",
  },
  {
    q: "What is the difference between Enrolled and One-Off sourcing?",
    a: "Enrolled aircraft pay US$100/month: they receive 24/7 dedicated desk dispatch, priority over supplier queues, zero handling fees, and an active Parts Passport pre-loaded with configuration data. One-off requests are available to anyone without commitment, subject to a US$150–250 handling fee per request in addition to part cost and sourcing commission.",
  },
  {
    q: "How fast is the quote turnaround for a one-off request?",
    a: "Our desk searches vetted distributor inventory, overhaul shops, and MRO surplus globally. We provide formal pricing, trace status, and freight timeline options within 4 business hours (or immediately if classified as AOG Grounded).",
  },
  {
    q: "Can you ship directly to my MRO or FBO facility?",
    a: "Yes. Once an option is approved, Aircraft Program coordinates directly with your DOM or MRO receiving department. We manage air waybills, customs clearance, and courier dispatch straight to the aircraft's hangar bay or line station.",
  },
];

function PartsSourcingPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    aircraftType: "",
    aircraftReg: "",
    partNumber: "",
    partDescription: "",
    condition: "Any Certified (Fastest)",
    urgency: "AOG Grounded",
    deliveryLocation: "",
    additionalNotes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const res = await submitOneOffPartRequest({ data: formData });
      if (res.ok) {
        setSubmittedRef(res.reference);
      } else {
        setErrorMessage("Unable to submit parts request. Please check fields or contact ops@aircraftprogram.com.");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Submission error. Please email ops@aircraftprogram.com directly.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Schema.org structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Business Jet Aircraft Parts Sourcing Desk",
    serviceType: "Aviation Parts Procurement and AOG Logistics",
    provider: {
      "@type": "Organization",
      name: "Aircraft Program",
      url: "https://www.aircraftprogram.com",
      logo: "https://www.aircraftprogram.com/logo.png",
      email: "ops@aircraftprogram.com",
    },
    areaServed: "Global",
    description:
      "Vetted, certified business jet parts sourcing direct to base or MRO. Trace-verified rotables and airframe components with FAA 8130-3 and EASA Form 1 documentation.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Parts Sourcing Plans",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Enrolled Priority Sourcing",
          price: "100.00",
          priceCurrency: "USD",
          description: "24/7 priority sourcing desk, zero handling fees, pre-captured aircraft configuration.",
        },
        {
          "@type": "Offer",
          name: "One-Off Parts Sourcing",
          price: "150.00",
          priceCurrency: "USD",
          description: "Case-by-case sourcing desk review with 4-hour turnaround for non-enrolled aircraft.",
        },
      ],
    },
  };

  return (
    <PublicLayout>
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="brand-dark relative overflow-hidden bg-[#001b2e] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#1e88e5_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              PARTS SOURCING DESK
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Need a part sourced for your aircraft?
            </h1>

            <p className="mt-6 text-base leading-relaxed text-white/75 md:text-lg">
              We locate, vet, and procure certified business jet components — with full airworthiness
              documentation — direct to your base or MRO.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/60">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" /> FAA 8130-3 & EASA Form 1
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" /> 4-Hour Quote Turnaround
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4 text-accent" /> Full Back-to-Birth Trace
              </span>
            </div>
          </div>

          {/* ── Funnel Fork: Enrolled vs One-Off ─────────────────────────── */}
          <div className="mt-16 text-center">
            <h2 className="text-xl font-semibold text-white">How would you like to proceed?</h2>
            <p className="mt-1 text-sm text-white/60">Choose the option that best fits your situation.</p>

            <div className="mt-8 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto text-left">
              {/* Option 1: Enrolled Priority (Upsell) */}
              <div className="relative flex flex-col justify-between rounded-xl border-2 border-accent bg-[#07243a] p-8 shadow-xl">
                <div className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow">
                  RECOMMENDED
                </div>

                <div>
                  <div className="inline-block rounded-md bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent uppercase tracking-wider">
                    FASTEST PATH
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-white">
                    Enrol your aircraft — get priority access
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Enrolled aircraft are our first priority. Your desk is active 24/7, we already know
                    your aircraft, and parts move faster.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-white/90">
                    <li className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span><strong>Immediate response</strong> — no intake delay</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span>Priority queue ahead of one-off requests</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span>Parts Passport built for your aircraft</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span><strong>All-in pricing</strong>, no surprise handling fees</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span><strong>US$100 / month</strong> — cancel any time</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <Link
                    to="/enrol"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 shadow-lg"
                  >
                    Start Enrolment <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Option 2: One-off Request (High-contrast clean card, NO washed-out light blue) */}
              <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-8 text-slate-900 shadow-xl">
                <div>
                  <div className="inline-block rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                    ONE-OFF REQUEST
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-slate-900">
                    Not ready to enrol — submit a one-off request
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    We source parts for non-enrolled aircraft on a case-by-case basis. A standard handling fee
                    applies in addition to the part cost and sourcing commission.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-900">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span>Submit your request directly below</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-900">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span>Response within 4 business hours</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-900">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span>Handling fee: <strong>US$150–250 per request</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-900">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span>Full airworthiness documentation (8130-3 / Form 1)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-900">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                      <span>No ongoing commitment required</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <a
                    href="#request-form"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-slate-900 bg-transparent px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                  >
                    Submit a Request ↓
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-Step Process: How One-Off Sourcing Works ───────────────────── */}
      <section className="bg-slate-50 border-b border-border py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground">How one-off sourcing works</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For non-enrolled aircraft. Enrolled subscribers skip steps 1–2 with pre-configured fleet profiles.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-accent">STEP 01</div>
              <h3 className="mt-3 text-lg font-semibold text-foreground">Submit your request</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Tell us the aircraft type, part number, current location, and urgency. We acknowledge
                receipt immediately and log your intake file.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-accent">STEP 02</div>
              <h3 className="mt-3 text-lg font-semibold text-foreground">Desk review & quote</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                We search our global vetted supplier network for availability and clean documentation. You receive
                pricing, trace status, and handling fees within 4 hours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-accent">STEP 03</div>
              <h3 className="mt-3 text-lg font-semibold text-foreground">Approval & procurement</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Once approved, we procure the part as your disclosed agent, verify documentation on dispatch,
                and coordinate direct freight to your base or MRO.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Intake Form Section ──────────────────────────────── */}
      <section id="request-form" className="py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center max-w-xl mx-auto">
            <Eyebrow>Direct Intake</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Submit a Parts Sourcing Request
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Fill out the details below. Our operations desk will review parts inventory across our distributor
              network and quote within 4 business hours.
            </p>
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card p-8 md:p-10 shadow-sm">
            {submittedRef ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-foreground">Request Received</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Your parts sourcing reference is{" "}
                  <strong className="text-foreground font-mono bg-muted px-2 py-0.5 rounded">{submittedRef}</strong>.
                  Our operations desk is checking supplier availability and will quote within 4 business hours.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        company: "",
                        aircraftType: "",
                        aircraftReg: "",
                        partNumber: "",
                        partDescription: "",
                        condition: "Any Certified (Fastest)",
                        urgency: "AOG Grounded",
                        deliveryLocation: "",
                        additionalNotes: "",
                      });
                    }}
                    className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    Submit Another Part
                  </button>
                  <Link
                    to="/enrol"
                    className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                  >
                    Enrol for 24/7 Cover ($100/mo)
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
                    <div>{errorMessage}</div>
                  </div>
                )}

                {/* Section 1: Aircraft & Part Specs */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
                    1. Aircraft & Component Details
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Aircraft Type / Model *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Challenger 350, Citation XLS, G550"
                        value={formData.aircraftType}
                        onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Aircraft Registration (Tail Number)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. N12345, G-ABCD, 9H-XXX"
                        value={formData.aircraftReg}
                        onChange={(e) => setFormData({ ...formData, aircraftReg: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Part Number (P/N) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 50-0123-45 or 300-482-001"
                        value={formData.partNumber}
                        onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Part Description / ATA System
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Main Hydraulic Pump, Brake Assembly"
                        value={formData.partDescription}
                        onChange={(e) => setFormData({ ...formData, partDescription: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Condition Required *
                      </label>
                      <select
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <option value="Any Certified (Fastest)">Any Certified (Fastest Availability)</option>
                        <option value="Factory New / New Surplus (FN/NS)">Factory New / New Surplus (FN / NS)</option>
                        <option value="Overhauled (OH)">Overhauled (OH)</option>
                        <option value="Serviceable / Repaired (SV/RP)">Serviceable / Repaired (SV / RP)</option>
                        <option value="Exchange Core Return Available">Exchange (Core Return Ready)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Urgency Level *
                      </label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent font-medium"
                      >
                        <option value="AOG Grounded">🚨 Aircraft Grounded (AOG)</option>
                        <option value="Dispatch Critical (Next 24-48h)">⚠️ Dispatch Critical (Next 24–48h)</option>
                        <option value="Planned Maintenance / Stock">📦 Planned Maintenance / Routine Sourcing</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Delivery & Destination */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
                    2. Destination & Delivery Location
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Delivery Airport ICAO or MRO Facility *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EGGW (London Luton), KTEB (Teterboro), or Maintenance Hangar Name"
                      value={formData.deliveryLocation}
                      onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                {/* Section 3: Contact Details */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
                    3. Contact Details
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Captain John Smith / Jane Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@flightdept.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Phone / Mobile
                      </label>
                      <input
                        type="tel"
                        placeholder="+44 7... or +1 ..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Company / Operator Name
                      </label>
                      <input
                        type="text"
                        placeholder="Flight Department / Charter Co"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Additional Serial / Modification / Target Pricing Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify serial restrictions, modification status, alternate part numbers, or target lead-time requirements..."
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground">
                    Handling fee of US$150–250 applies only upon quote approval. No upfront fee to submit.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...
                      </>
                    ) : (
                      <>
                        Submit Sourcing Request <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Supported Airframes SEO Matrix (Commented out for now) ─────────
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Eyebrow>Fleet Capabilities</Eyebrow>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                Supported Business Jet Airframes
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                We maintain active supplier pipelines, rotable listings, and teardown inventories for all
                major midsize, super-midsize, and large-cabin executive aircraft.
              </p>
            </div>
            <Link
              to="/fleet-network"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline uppercase tracking-wider"
            >
              View Full Fleet Network <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AIRFRAMES.map((item) => (
              <div
                key={item.make}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition hover:border-accent/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">{item.make}</h3>
                    <Plane className="h-4 w-4 text-accent" />
                  </div>
                  <div className="mt-2 text-xs font-medium text-accent">{item.models}</div>
                  <div className="mt-4 text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Sourced components:</strong> {item.rotables}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-medium">
                  <a href={item.slug} className="text-accent hover:underline inline-flex items-center gap-1">
                    {item.make} Parts Sourcing <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      ──────────────────────────────────────────────────────────────────────── */}

      {/* ── FAQ Section ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <Eyebrow>Questions & Compliance</Eyebrow>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-12 divide-y divide-border rounded-xl border border-border bg-card">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-6">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-accent shrink-0" />
                  {faq.q}
                </h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
