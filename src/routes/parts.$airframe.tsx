import { createFileRoute, Link, notFound, redirect, useParams } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { PartRequestForm } from "@/components/site/PartRequestForm";
import { PublicLayout } from "@/components/site/PublicLayout";
import {
  Check,
  ShieldCheck,
  Clock,
  FileCheck2,
  Plane,
  Building2,
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
  challenger: {
    title: "Bombardier Challenger & Global Aircraft Parts Sourcing",
    name: "Challenger",
    category: "Super-Midsize & Ultra Long-Range Jets",
    description:
      "Rapid rotable procurement and AOG dispatch for Bombardier Challenger 300, 350, 604, 605, 650, and Global Express / 5000 / 6000 / 7500. Full FAA 8130-3 and EASA Form 1 trace.",
    popularModels: [
      "Challenger 300 / 350 / 3500",
      "Challenger 604 / 605 / 650",
      "Global Express / XRS",
      "Global 5000 / 6000 / 7500",
    ],
    ataBreakdown: [
      {
        chapter: "ATA 29",
        title: "Hydraulic Power",
        commonParts: [
          "Engine-driven hydraulic pumps",
          "Electric motor pumps (ACMP)",
          "Hydraulic accumulators",
          "PTU valves",
        ],
      },
      {
        chapter: "ATA 32",
        title: "Landing Gear & Brakes",
        commonParts: [
          "Carbon brake heat packs",
          "Main & nose gear actuators",
          "Anti-skid control valves",
          "Wheel assemblies",
        ],
      },
      {
        chapter: "ATA 24",
        title: "Electrical Power",
        commonParts: [
          "Integrated Drive Generators (IDG)",
          "Generator Control Units (GCU)",
          "Transformer Rectifier Units (TRU)",
        ],
      },
      {
        chapter: "ATA 27",
        title: "Flight Controls",
        commonParts: [
          "Power Flight Control Units (PFCU)",
          "Flap actuator gearboxes",
          "Elevator feel computers",
          "Horizontal stab actuators",
        ],
      },
    ],
    supplierHighlights:
      "Direct lines into Bombardier Authorized Service Facilities and surplus teardown inventory in Europe, North America, and UAE.",
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
        commonParts: [
          "Starter-generators (Safran / APC)",
          "Emergency power supplies",
          "GCUs and main battery contactors",
        ],
      },
      {
        chapter: "ATA 32",
        title: "Landing Gear & Brakes",
        commonParts: [
          "Brake assemblies & wear pins",
          "Gear selector valves",
          "Nosewheel steering actuators",
        ],
      },
      {
        chapter: "ATA 34",
        title: "Navigation & Avionics",
        commonParts: [
          "Garmin G1000/G3000 LRUs",
          "Collins Pro Line 21 displays",
          "AHRS units & ADC sensors",
        ],
      },
      {
        chapter: "ATA 21",
        title: "Air Conditioning & Pressurization",
        commonParts: [
          "Air cycle machines (ACM)",
          "Outflow valves",
          "Bleed air temperature control valves",
        ],
      },
    ],
    supplierHighlights:
      "Deep rotable stock agreements with Textron Aviation distributors, MRO parts pools, and certified 145 overhaul stations.",
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
        commonParts: [
          "Honeywell 36-150 / RE220 line components",
          "APU fuel control units",
          "Starter motors and igniter plugs",
        ],
      },
      {
        chapter: "ATA 27",
        title: "Flight Controls",
        commonParts: [
          "Elevator & aileron hydraulic boosters",
          "Flap drive motors",
          "Rudder trim actuators",
        ],
      },
      {
        chapter: "ATA 29",
        title: "Hydraulics",
        commonParts: [
          "Engine driven pumps (Abex/Eaton)",
          "Auxiliary DC hydraulic pump",
          "PTU and accumulator bottles",
        ],
      },
      {
        chapter: "ATA 34",
        title: "Avionics & Cockpit",
        commonParts: [
          "PlaneView / Honeywell Primus Epic LRUs",
          "Display units (DU-885/DU-1310)",
          "EGPWS computers",
        ],
      },
    ],
    supplierHighlights:
      "Access to private flight department consignments, Part 145 rotable loan programs, and teardown packages globally.",
  },
  phenom: {
    title: "Embraer Phenom, Legacy & Praetor Parts Sourcing",
    name: "Phenom",
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
        commonParts: [
          "Brake-by-wire control units (BCU)",
          "Carbon brake assemblies",
          "Landing gear proximity sensors",
        ],
      },
      {
        chapter: "ATA 24",
        title: "Electrical & Generation",
        commonParts: [
          "Brushless starter-generators",
          "Secondary power distribution boxes (SPDB)",
          "Inverters",
        ],
      },
      {
        chapter: "ATA 73",
        title: "Engine Fuel & Control",
        commonParts: [
          "Pratt & Whitney PW535 / PW617 accessories",
          "Honeywell HTF7500E FADEC computers",
          "Fuel metering valves",
        ],
      },
    ],
    supplierHighlights:
      "Pre-vetted European and US distributor pipelines with rapid dispatch into major business aviation hubs.",
  },
  hawker: {
    title: "Hawker & Beechcraft Jet Parts Sourcing",
    name: "Hawker",
    category: "Midsize Business Jets",
    description:
      "Hard-to-source rotable components, structural assemblies, and engine accessories for Hawker 750, 800XP, 850XP and 900XP, plus Premier I/IA.",
    popularModels: [
      "Hawker 800XP / 850XP / 900XP",
      "Hawker 750 / 1000",
      "Beechjet 400A / Hawker 400XP",
      "Premier I / IA",
    ],
    ataBreakdown: [
      {
        chapter: "ATA 71-80",
        title: "Powerplant & Accessories",
        commonParts: [
          "TFE731 rotable accessories",
          "Fuel control units",
          "Starter-generators & bleed valves",
        ],
      },
      {
        chapter: "ATA 27",
        title: "Flight Controls",
        commonParts: [
          "Flap drive flex shafts and gearboxes",
          "Aileron trim actuators",
          "Rudder bias struts",
        ],
      },
      {
        chapter: "ATA 30",
        title: "Ice & Rain Protection",
        commonParts: [
          "TKS fluid metering pumps",
          "Windshield heat controllers",
          "Wing and tail anti-ice components",
        ],
      },
    ],
    supplierHighlights:
      "Extensive rotable core exchange network and FAA/EASA certified teardown stock for legacy and in-production airframes.",
  },
  "king-air": {
    title: "Beechcraft King Air Parts Sourcing & AOG Support",
    name: "King Air",
    category: "Twin Turboprops",
    description:
      "AOG parts support for Beechcraft King Air 200, 250, 260, 300, 350 and 360 operators, including PT6A accessories, landing gear and de-ice components with full release documentation.",
    popularModels: [
      "King Air C90 / E90",
      "King Air B200 / 250 / 260",
      "King Air 300 / 350 / 350i",
      "King Air 360",
    ],
    ataBreakdown: [
      {
        chapter: "ATA 71-80",
        title: "PT6A Powerplant Accessories",
        commonParts: ["Starter-generators", "Fuel control units (FCUs)", "Bleed air valves"],
      },
      {
        chapter: "ATA 32",
        title: "Landing Gear",
        commonParts: ["Gear actuators", "Brake assemblies", "Gear position switches"],
      },
      {
        chapter: "ATA 30",
        title: "Ice & Rain Protection",
        commonParts: [
          "Pneumatic de-ice boots",
          "De-ice controllers",
          "Propeller de-ice components",
        ],
      },
    ],
    supplierHighlights:
      "Sourcing across Textron distributors, independent rotable pools and certified overhaul stations, with core exchange logistics managed for you.",
  },
  falcon: {
    title: "Dassault Falcon Parts Sourcing & AOG Support",
    name: "Falcon",
    category: "Large-Cabin Tri-Jets & Twin Jets",
    description:
      "AOG parts support for Dassault Falcon 900, 2000 and 7X/8X operators: avionics LRUs, hydraulics and thrust reverser components with FAA 8130-3 and EASA Form 1 documentation.",
    popularModels: [
      "Falcon 900B / 900EX / 900LX",
      "Falcon 2000 / 2000EX / 2000LX",
      "Falcon 7X / 8X",
      "Falcon 50 / 50EX",
    ],
    ataBreakdown: [
      {
        chapter: "ATA 34",
        title: "Avionics (EASy Cockpit)",
        commonParts: ["Display units", "Flight management components", "Radio and navigation LRUs"],
      },
      {
        chapter: "ATA 29",
        title: "Hydraulics",
        commonParts: ["Engine-driven pumps", "Accumulators", "Selector valves"],
      },
      {
        chapter: "ATA 78",
        title: "Thrust Reversers",
        commonParts: ["Reverser actuators", "Position sensors", "Control valves"],
      },
    ],
    supplierHighlights:
      "European and North American supplier network, with customs documentation handled for cross-border dispatch of French-manufactured parts.",
  },
  learjet: {
    title: "Learjet Parts Sourcing & AOG Support",
    name: "Learjet",
    category: "Light & Midsize Business Jets",
    description:
      "AOG parts support for Learjet 35, 45, 60 and 75 operators, including legacy components affected by obsolescence, with traceable documentation.",
    popularModels: [
      "Learjet 31A / 35A / 36A",
      "Learjet 40 / 45 / 45XR",
      "Learjet 55 / 60 / 60XR",
      "Learjet 70 / 75",
    ],
    ataBreakdown: [
      {
        chapter: "ATA 32",
        title: "Landing Gear & Brakes",
        commonParts: ["Brake assemblies", "Anti-skid components", "Gear actuators"],
      },
      {
        chapter: "ATA 24",
        title: "Electrical Power",
        commonParts: ["Starter-generators", "Generator control units", "Batteries"],
      },
      {
        chapter: "ATA 21",
        title: "Environmental Systems",
        commonParts: ["Air cycle machines", "Bleed air valves", "Pressurization controllers"],
      },
    ],
    supplierHighlights:
      "Access to certified teardown stock and overhaul stations for out-of-production Learjet components, with trace documents verified before dispatch.",
  },
  helicopter: {
    title: "Helicopter AOG Support & Parts Sourcing",
    name: "Helicopter",
    category: "Corporate, VIP & Utility Rotorcraft",
    description:
      "AOG parts procurement for corporate and VIP helicopters, including Leonardo AW109 and AW139, Airbus H125 and H145 and Bell 429: gearbox, rotor and turboshaft accessories.",
    popularModels: [
      "Leonardo AW109 / AW139",
      "Airbus H125 / H130 / H145",
      "Bell 407 / 429",
      "Sikorsky S-76",
    ],
    ataBreakdown: [
      {
        chapter: "ATA 62-65",
        title: "Rotors & Drive Systems",
        commonParts: [
          "Main and tail rotor pitch links",
          "Tail rotor gearbox components",
          "Drive shaft couplings",
        ],
      },
      {
        chapter: "ATA 24",
        title: "Electrical Power",
        commonParts: ["Starter-generators", "Inverters", "Batteries"],
      },
      {
        chapter: "ATA 73",
        title: "Engine Fuel & Control",
        commonParts: ["Fuel control units", "FADEC components", "Fuel pumps"],
      },
    ],
    supplierHighlights:
      "A procurement partner for operators and MROs: we source, verify and deliver the part while your approved maintenance organisation fits it.",
  },
};

const SEO: Record<string, { title: string; h1: string }> = {
  challenger: {
    title: "Challenger 350 & 604 AOG Parts Support",
    h1: "Challenger AOG Support & Parts Sourcing",
  },
  citation: {
    title: "Citation AOG Support & Parts Sourcing",
    h1: "Citation AOG Support & Parts Sourcing",
  },
  gulfstream: {
    title: "Gulfstream AOG Support & Parts Sourcing",
    h1: "Gulfstream AOG Support & Parts Sourcing",
  },
  phenom: { title: "Phenom 300 AOG Parts & Support", h1: "Phenom AOG Support & Parts Sourcing" },
  hawker: {
    title: "Hawker AOG Parts Sourcing & Support",
    h1: "Hawker AOG Support & Parts Sourcing",
  },
  "king-air": {
    title: "King Air AOG Parts & Support",
    h1: "King Air AOG Support & Parts Sourcing",
  },
  falcon: {
    title: "Falcon 2000 & 7X AOG Parts Support",
    h1: "Falcon AOG Support & Parts Sourcing",
  },
  learjet: {
    title: "Learjet AOG Parts Sourcing & Support",
    h1: "Learjet AOG Support & Parts Sourcing",
  },
  helicopter: {
    title: "Helicopter AOG Support & Parts",
    h1: "Helicopter AOG Support & Parts Sourcing",
  },
};

const REDIRECTS: Record<string, string> = { bombardier: "challenger", embraer: "phenom" };

export const Route = createFileRoute("/parts/$airframe")({
  beforeLoad: ({ params }) => {
    const target = REDIRECTS[params.airframe.toLowerCase()];
    if (target) {
      throw redirect({ to: "/parts/$airframe", params: { airframe: target }, statusCode: 301 });
    }
  },
  loader: ({ params }) => {
    if (!AIRFRAME_DATABASE[params.airframe.toLowerCase()]) throw notFound();
  },
  head: ({ params }) => {
    const key = params.airframe.toLowerCase();
    const seo = SEO[key];
    return pageHead({
      title: `${seo?.title ?? "Business Jet Parts Sourcing"} | Aircraft Program`,
      description: AIRFRAME_DATABASE[key]?.description ?? "Business jet parts sourcing desk.",
      path: `/parts/${key}`,
    });
  },
  component: AirframePartsPage,
});

function AirframePartsPage() {
  const { airframe } = useParams({ from: "/parts/$airframe" });
  const airframeKey = airframe.toLowerCase();
  const info = AIRFRAME_DATABASE[airframeKey] ?? AIRFRAME_DATABASE.challenger;

  return (
    <PublicLayout>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="brand-dark relative overflow-hidden bg-[#001b2e] text-white py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
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
              {SEO[airframeKey]?.h1 ?? `${info.name} Parts Sourcing & AOG Desk`}
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
                We maintain active parts lists, rotable exchange pools, and vendor relationships
                across these airframes.
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                  Supplier Network Advantage
                </h4>
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
                  <div
                    key={ata.chapter}
                    className="rounded-xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-accent">
                        {ata.chapter}
                      </span>
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

      <PartRequestForm
        label={info.name}
        eyebrow={`${info.name} Sourcing Desk`}
        heading={`Request a ${info.name} Component`}
        intro="Submit your required part number below. We cross-reference supplier inventory and provide pricing within 4 hours."
        models={info.popularModels}
        submitLabel={`Request ${info.name} Part`}
      />

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
