import { createFileRoute, Link, useParams } from "@tanstack/react-router";
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
  Building2,
  CheckCircle2,
  Loader2,
  Wrench,
  Cpu,
  Layers,
  ChevronRight,
} from "lucide-react";

interface AirframeData {
  title: string;
  name: string;
  category: string;
  description: string;
  popularModels: string[];
  ataBreakdown: { chapter: string; title: string; commonParts: string[] }[];
  supplierHighlights: string;
}

const AIRFRAME_DATABASE: Record<string, AirframeData> = {
  bombardier: {
    title: "Bombardier Challenger & Global Aircraft Parts Sourcing",
    name: "Bombardier",
    category: "Super-Midsize & Ultra Long-Range Jets",
    description:
      "Rapid rotable procurement and AOG dispatch for Bombardier Challenger 300, 350, 604, 605, 650, and Global Express / 5000 / 6000 / 7500. Full FAA 8130-3 and EASA Form 1 trace.",
    popularModels: [
      "Challenger 300 / 350 / 3500",
      "Challenger 604 / 605 / 650",
      "Global Express / XRS",
      "Global 5000 / 6000 / 7500",
      "Learjet 45 / 60 / 75",
    ],
    ataBreakdown: [
      {
        chapter: "ATA 29",
        title: "Hydraulic Power",
        commonParts: ["Engine-driven hydraulic pumps", "Electric motor pumps (ACMP)", "Hydraulic accumulators", "PTU valves"],
      },
      {
        chapter: "ATA 32",
        title: "Landing Gear & Brakes",
        commonParts: ["Carbon brake heat packs", "Main & nose gear actuators", "Anti-skid control valves", "Wheel assemblies"],
      },
      {
        chapter: "ATA 24",
        title: "Electrical Power",
        commonParts: ["Integrated Drive Generators (IDG)", "Generator Control Units (GCU)", "Transformer Rectifier Units (TRU)"],
      },
      {
        chapter: "ATA 27",
        title: "Flight Controls",
        commonParts: ["Power Flight Control Units (PFCU)", "Flap actuator gearboxes", "Elevator feel computers", "Horizontal stab actuators"],
      },
    ],
    supplierHighlights: "Direct lines into Bombardier Authorized Service Facilities and surplus teardown inventory in Europe, North America, and UAE.",
  },
  citation: {
    title: "Cessna Citation Aircraft Parts Sourcing & Rotable Desk",
    name: "Cessna Citation",
    category: "Light, Midsize & Super-Midsize Jets",
    description:
      "Specialized parts sourcing and AOG response across the entire Cessna Citation family: Mustang, CJ1/2/3/4, Citation XLS/XLS+, Sovereign, Latitude, and Longitude.",
    popularModels: [
      "Citation Mustang (510)",
      "Citation CJ1+ / CJ2+ / CJ3+ / CJ4",
      "Citation Excel / XLS / XLS+ (560XL)",
      "Citation Sovereign / Sovereign+ (680)",
      "Citation Latitude (680A) & Longitude (700)",
    ],
    ataBreakdown: [
      {
        chapter: "ATA 24",
        title: "Electrical Power",
        commonParts: ["Starter-generators (Safran / APC)", "Emergency power supplies", "GCUs and main battery contactors"],
      },
      {
        chapter: "ATA 32",
        title: "Landing Gear & Brakes",
        commonParts: ["Brake assemblies & wear pins", "Gear selector valves", "Nosewheel steering actuators"],
      },
      {
        chapter: "ATA 34",
        title: "Navigation & Avionics",
        commonParts: ["Garmin G1000/G3000 LRUs", "Collins Pro Line 21 displays", "AHRS units & ADC sensors"],
      },
      {
        chapter: "ATA 21",
        title: "Air Conditioning & Pressurization",
        commonParts: ["Air cycle machines (ACM)", "Outflow valves", "Bleed air temperature control valves"],
      },
    ],
    supplierHighlights: "Deep rotable stock agreements with Textron Aviation distributors, MRO parts pools, and certified 145 overhaul stations.",
  },
  gulfstream: {
    title: "Gulfstream Aircraft Parts Sourcing & AOG Desk",
    name: "Gulfstream",
    category: "Large-Cabin & Ultra Long-Range Business Jets",
    description:
      "Global procurement network for Gulfstream G200, G280, GIV/G450, GV/G550, and G650/G650ER. Certified avionics, rotable exchange, and line replaceable units.",
    popularModels: [
      "Gulfstream G200 / G280",
      "Gulfstream GIV / GIV-SP / G450",
      "Gulfstream GV / G550",
      "Gulfstream G650 / G650ER",
      "Gulfstream G500 / G600",
    ],
    ataBreakdown: [
      {
        chapter: "ATA 49",
        title: "Airborne Auxiliary Power (APU)",
        commonParts: ["Honeywell 36-150 / RE220 line components", "APU fuel control units", "Starter motors and igniter plugs"],
      },
      {
        chapter: "ATA 27",
        title: "Flight Controls",
        commonParts: ["Elevator & aileron hydraulic boosters", "Flap drive motors", "Rudder trim actuators"],
      },
      {
        chapter: "ATA 29",
        title: "Hydraulics",
        commonParts: ["Engine driven pumps (Abex/Eaton)", "Auxiliary DC hydraulic pump", "PTU and accumulator bottles"],
      },
      {
        chapter: "ATA 34",
        title: "Avionics & Cockpit",
        commonParts: ["PlaneView / Honeywell Primus Epic LRUs", "Display units (DU-885/DU-1310)", "EGPWS computers"],
      },
    ],
    supplierHighlights: "Access to private flight department consignments, Part 145 rotable loan programs, and teardown packages globally.",
  },
  embraer: {
    title: "Embraer Phenom, Legacy & Praetor Parts Sourcing",
    name: "Embraer Executive",
    category: "Entry-Level, Midsize & Super-Midsize Jets",
    description:
      "Parts logistics and urgent AOG components for Embraer Phenom 100/300, Legacy 450/500/600/650, and Praetor 500/600. Dual-release documentation guaranteed.",
    popularModels: [
      "Phenom 100 / 100EV",
      "Phenom 300 / 300E",
      "Legacy 450 / 500",
      "Legacy 600 / 650",
      "Praetor 500 / 600",
    ],
    ataBreakdown: [
      {
        chapter: "ATA 32",
        title: "Brakes & Steering",
        commonParts: ["Brake-by-wire control units (BCU)", "Carbon brake assemblies", "Landing gear proximity sensors"],
      },
      {
        chapter: "ATA 24",
        title: "Electrical & Generation",
        commonParts: ["Brushless starter-generators", "Secondary power distribution boxes (SPDB)", "Inverters"],
      },
      {
        chapter: "ATA 73",
        title: "Engine Fuel & Control",
        commonParts: ["Pratt & Whitney PW535 / PW617 accessories", "Honeywell HTF7500E FADEC computers", "Fuel metering valves"],
      },
    ],
    supplierHighlights: "Pre-vetted European and US distributor pipelines with rapid dispatch into major business aviation hubs.",
  },
  hawker: {
    title: "Hawker & Beechcraft King Air Parts Sourcing",
    name: "Hawker & Beechcraft",
    category: "Midsize Jets & Twin Turboprops",
    description:
      "Hard-to-source rotable components, structural assemblies, and engine accessories for Hawker 750/800XP/850XP/900XP and King Air 200/250/300/350.",
    popularModels: [
      "Hawker 800XP / 850XP / 900XP",
      "Hawker 750 / 1000",
      "King Air B200 / 250 / 260",
      "King Air 350 / 350i / 360",
      "Premier I / IA",
    ],
    ataBreakdown: [
      {
        chapter: "ATA 71-80",
        title: "Powerplant & Accessories",
        commonParts: ["TFE731 rotable accessories", "PT6A fuel nozzles and FCUs", "Starter-generators & bleed valves"],
      },
      {
        chapter: "ATA 27",
        title: "Flight Controls",
        commonParts: ["Flap drive flex shafts and gearboxes", "Aileron trim actuators", "Rudder bias struts"],
      },
      {
        chapter: "ATA 30",
        title: "Ice & Rain Protection",
        commonParts: ["TKS fluid metering pumps", "Windshield heat controllers", "Pneumatic de-ice boots"],
      },
    ],
    supplierHighlights: "Extensive rotable core exchange network and FAA/EASA certified teardown stock for legacy and in-production airframes.",
  },
};

export const Route = createFileRoute("/parts/$airframe")({
  head: ({ params }) => {
    const data = AIRFRAME_DATABASE[params.airframe.toLowerCase()] || {
      title: "Business Jet Parts Sourcing Desk | Aircraft Program",
      description: "Certified business jet parts sourcing direct to base or MRO. Trace-verified rotables and airframe components.",
    };
    return {
      meta: [
        { title: `${data.title} | Aircraft Program` },
        { name: "description", content: data.description },
        { property: "og:title", content: `${data.title} | Aircraft Program` },
        { property: "og:description", content: data.description },
        { property: "og:url", content: `https://www.aircraftprogram.com/parts/${params.airframe}` },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: AirframePartsPage,
});

function AirframePartsPage() {
  const { airframe } = useParams({ from: "/parts/$airframe" });
  const airframeKey = airframe.toLowerCase();
  const info = AIRFRAME_DATABASE[airframeKey] || AIRFRAME_DATABASE.bombardier;

  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    aircraftType: info.popularModels[0] || `${info.name} Jet`,
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
        setErrorMessage("Unable to submit parts request. Please check fields or email ops@aircraftprogram.com.");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Submission error. Please email ops@aircraftprogram.com directly.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicLayout>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="brand-dark relative overflow-hidden bg-[#001b2e] text-white py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#2a6db5_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
            <Link to="/parts-sourcing" className="hover:underline">
              Parts Sourcing Desk
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" />
            <span className="text-white/80">{info.name}</span>
          </div>

          <div className="mt-6 max-w-3xl">
            <div className="inline-block rounded-md bg-accent/20 px-3 py-1 text-xs font-semibold text-accent uppercase tracking-wider mb-4">
              {info.category}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              {info.name} Parts Sourcing & AOG Desk
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/75 md:text-lg">
              {info.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-xs font-medium text-white/70">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" /> Dual Release 8130-3 / EASA Form 1
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" /> 4-Hour Quote SLA
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-accent" /> Direct to Base or Hangar
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fleet Coverage & ATA Breakdown ──────────────────────────────── */}
      <section className="py-16 bg-slate-50 border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Supported {info.name} Models</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We maintain active parts lists, rotable exchange pools, and vendor relationships across these airframes.
              </p>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {info.popularModels.map((model) => (
                  <div
                    key={model}
                    className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-3.5 text-sm font-medium text-foreground shadow-sm"
                  >
                    <Plane className="h-4 w-4 text-accent shrink-0" />
                    <span>{model}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-accent/20 bg-accent/5 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent">Supplier Network Advantage</h4>
                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                  {info.supplierHighlights}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground">Common ATA Chapter Rotables</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Typical high-demand components routinely vetted and supplied through our desk.
              </p>
              <div className="mt-6 space-y-4">
                {info.ataBreakdown.map((ata) => (
                  <div key={ata.chapter} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-accent">{ata.chapter}</span>
                      <span className="text-sm font-semibold text-foreground">{ata.title}</span>
                    </div>
                    <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2 text-xs text-muted-foreground">
                      {ata.commonParts.map((part) => (
                        <li key={part} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-accent shrink-0" />
                          <span>{part}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Request Form ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center max-w-xl mx-auto">
            <Eyebrow>{info.name} Sourcing Desk</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Request a {info.name} Component
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Submit your required part number below. We cross-reference supplier inventory and provide pricing within 4 hours.
            </p>
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card p-8 md:p-10 shadow-sm">
            {submittedRef ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-foreground">Request Submitted</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reference: <strong className="text-foreground font-mono bg-muted px-2 py-0.5 rounded">{submittedRef}</strong>
                </p>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Our operations team has received your {info.name} sourcing request and is checking rotable availability now.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmittedRef(null)}
                    className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    Submit Another Component
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      {info.name} Model *
                    </label>
                    <select
                      value={formData.aircraftType}
                      onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      {info.popularModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                      <option value={`Other ${info.name}`}>Other {info.name} Model</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Tail / Registration Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. N123XX or G-XXXX"
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
                      placeholder="e.g. 50-0123-45"
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
                      placeholder="e.g. Starter Generator, Hydraulic Valve"
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
                      <option value="Any Certified (Fastest)">Any Certified (Fastest)</option>
                      <option value="Factory New / New Surplus (FN/NS)">Factory New / New Surplus</option>
                      <option value="Overhauled (OH)">Overhauled (OH)</option>
                      <option value="Serviceable (SV)">Serviceable (SV)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Urgency *
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="AOG Grounded">🚨 Aircraft Grounded (AOG)</option>
                      <option value="Dispatch Critical (Next 24-48h)">⚠️ Dispatch Critical (24–48h)</option>
                      <option value="Planned Maintenance / Stock">📦 Planned Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Delivery Destination / Airport ICAO / MRO *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EGGW (Luton), KTEB (Teterboro), or Hangar Name"
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="pt-4 border-t border-border grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@flightdept.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground">
                    Handling fee of US$150–250 applies upon quote acceptance.
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Request {info.name} Part <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Cross-Links to Other Airframes ──────────────────────────────── */}
      <section className="py-16 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Explore Other Fleet Sourcing Desks
          </h3>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {Object.entries(AIRFRAME_DATABASE).map(([key, data]) => (
              <Link
                key={key}
                to="/parts/$airframe"
                params={{ airframe: key }}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  key === airframeKey
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-card text-foreground hover:border-accent/40"
                }`}
              >
                {data.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
