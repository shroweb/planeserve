import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import {
  ArrowRightIcon,
  SlaIcon,
  SearchIcon,
  CoverIcon,
  ClearedIcon,
  InventoryIcon,
  DispatchIcon,
  DocumentIcon,
} from "@/components/app/PlaneServeIcons";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Full-spectrum AOG support for business aircraft" },
      {
        name: "description",
        content: "PlaneServe AOG parts support — aircraft enrolment, supplier sourcing, trace verification, and dispatch coordination for enrolled business aircraft.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#041c2c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Eyebrow>What's Included</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            Everything included in your{" "}
            <span className="text-accent">
              PlaneServe subscription.
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            One per-aircraft subscription covers the full AOG parts desk. We source parts, verify paperwork, and coordinate freight — all for enrolled aircraft, with no per-case fees.
          </p>
        </div>
      </section>

      {/* ── Service Pillar: Readiness ─────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Eyebrow>Pillar 01</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl leading-tight">
                Pre-AOG Readiness & <br />
                <span className="text-accent ">Aircraft Records.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                Before your aircraft goes technical, PlaneServe captures the aircraft record — registration, engine serials, base ICAO, AMO contacts, and insurer details — so the desk can move immediately when the call comes in.
              </p>
              
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <InventoryIcon className="h-5 w-5 text-accent" />
                    <div className="font-semibold text-sm uppercase tracking-wider">Profile Storage</div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Engine serials, part number history, and maintenance contacts held on file permanently.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <CoverIcon className="h-5 w-5 text-accent" />
                    <div className="font-semibold text-sm uppercase tracking-wider">Tier 2 Verification</div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We verify your support contacts and AMO lines in advance, ensuring a clear path for authorization.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border p-1 rounded-sm shadow-sm overflow-hidden">
              <div className="bg-[#041c2c] p-8 text-white">
                <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-4">Readiness Audit</div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-accent" />
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Aircraft Record Complete</span>
                    <span className="text-accent font-bold">85% Complete</span>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  {["Engines Verified", "Base ICAO Recorded", "AMO Linked", "Insurance Verified"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-xs text-white/80">
                      <ClearedIcon className="h-3.5 w-3.5 text-accent" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Pillar: The Desk ──────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Eyebrow>Pillar 02</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl leading-tight">
              The AOG Support Desk & <br />
              <span className="text-accent ">Global Supplier Network.</span>
            </h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground">
              When an aircraft goes AOG, the desk activates. We move straight into sourcing across 
              a global, vetted network of suppliers, specialized in older business platforms.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border overflow-hidden rounded-sm">
            {[
              {
                t: "24/7 Intake",
                Icon: SlaIcon,
                d: "Submit requests any time. Our desk acknowledges and starts sourcing immediately.",
              },
              {
                t: "Global Sourcing",
                Icon: SearchIcon,
                d: "RFQs go out to vetted suppliers matched to your aircraft and location.",
              },
              {
                t: "Trace Verification",
                Icon: DocumentIcon,
                d: "Paperwork, 8130-3, and trace history verified before options land in your dashboard.",
              },
              {
                t: "Dispatch Logistics",
                Icon: DispatchIcon,
                d: "We coordinate with freight carriers to ensure the part moves on the fastest route.",
              },
            ].map((s) => {
              const ServiceIcon = s.Icon;
              return (
                <div key={s.t} className="bg-background p-8 group hover:bg-muted/30 transition-colors">
                  <ServiceIcon className="h-7 w-7 text-accent mb-6" strokeWidth={1.5} />
                  <h3 className="font-semibold text-base mb-3 tracking-tight">{s.t}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Cover Model: Membership ───────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Parts sourcing", "Unlimited"],
                  ["Request intake", "24/7"],
                  ["Supplier quotes", "Verified"],
                  ["Freight tracking", "Included"],
                  ["Operator updates", "Live"],
                  ["Profile storage", "Permanent"],
                  ["Sourcing fees", "$0"],
                  ["Margin on parts", "$0"],
                ].map(([label, value]) => (
                  <div key={label} className="p-4 border border-border bg-card rounded-sm">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{label}</div>
                    <div className="text-sm font-semibold text-accent">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <Eyebrow>The Subscription Model</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl leading-tight">
                Retained support, not <br />
                <span className="text-accent ">transactional billing.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                PlaneServe is a programme for aircraft owners and operators. You enrol your aircraft once, and the desk is yours. 
                No per-case fees, no surprise markups on parts, and no additional costs for 24/7 support.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Unlimited AOG requests per aircraft",
                  "Aircraft profile retained for the life of the plan",
                  "Cancel at the end of any billing period",
                  "Add or remove aircraft as your fleet changes",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm">
                    <ClearedIcon className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── AOG Process Workflow ─────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              From grounded to moving — how it works.
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-border lg:block" />
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  phase: "Enrolment",
                  title: "Aircraft profile captured — before anything goes wrong.",
                  desc: "You complete a five-minute enrolment. Engine serials, part number history, AMO contacts, insurance, and base context are all stored on file. This is the preparation work that makes everything else faster.",
                  side: "left",
                },
                {
                  step: "02",
                  phase: "AOG Event",
                  title: "No intake form. No starting from scratch.",
                  desc: "When your aircraft goes technical, you contact the desk. Because your profile is already on file, we skip the discovery phase entirely. No questions about serial numbers. No back-and-forth on configuration.",
                  side: "right",
                },
                {
                  step: "03",
                  phase: "Parts Sourcing & Procurement",
                  title: "RFQs out to vetted suppliers within minutes.",
                  desc: "We issue requests for quotation across our global supplier network — matched to your aircraft type, part requirement, and location. Suppliers are pre-vetted for capability and documentation standards.",
                  side: "left",
                },
                {
                  step: "04",
                  phase: "Verification",
                  title: "Every option verified before it reaches you.",
                  desc: "We check 8130-3 and EASA Form 1 on every part option. Trace history gaps, shelf-life issues, and documentation anomalies are flagged before the option is presented for approval.",
                  side: "right",
                },
                {
                  step: "05",
                  phase: "Dispatch Coordination",
                  title: "One approval. We handle the rest.",
                  desc: "You select an option. We coordinate with the freight carrier to move the part on the fastest available route to your base and notify your AMO. The desk stays active until the aircraft is released.",
                  side: "left",
                },
              ].map(({ step, phase, title, desc, side }) => (
                <div key={step} className={`relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${side === "right" ? "lg:direction-rtl" : ""}`}>
                  <div className={`${side === "right" ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent text-white text-xs font-bold">
                        {step}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-accent">{phase}</span>
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{desc}</p>
                  </div>
                  <div className={`hidden lg:block ${side === "right" ? "lg:order-1" : ""}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Coverage Details ──────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow>Coverage Details</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              What's included — and what isn't.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              We believe in full transparency. No hidden exclusions, no surprises at the worst moment.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-sm border border-border bg-background p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-xs font-semibold uppercase tracking-widest text-accent">Included</span>
              </div>
              <ul className="space-y-4">
                {[
                  "Unlimited AOG support requests per enrolled aircraft",
                  "Global parts sourcing across vetted supplier network",
                  "8130-3 and EASA Form 1 verification on all options",
                  "24/7 desk availability — no out-of-hours cut-off",
                  "Aircraft profile and context stored permanently",
                  "AMO and freight coordination",
                  "Operator updates throughout each case",
                  "Zero markup on sourced parts or freight",
                  "Trace documentation review and gap flagging",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <ClearedIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-sm border border-border bg-background p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Not covered</span>
              </div>
              <ul className="space-y-4">
                {[
                  "Guarantee of part availability — we guarantee the search, not the stock",
                  "Parts cost itself — you pay the supplier directly at cost",
                  "Freight cost — passed through at carrier rate, no markup",
                  "Aircraft maintenance labour or AMO fees",
                  "OEM-only warranty repairs (handled by OEM network)",
                  "Non-airworthy parts or unapproved configurations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-border" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-sm border border-border bg-muted/30 p-4 text-xs leading-6 text-muted-foreground">
                <strong className="text-foreground">On availability:</strong> For older platforms, parts
                availability depends on the supplier market — that's outside our control. What we control is the
                speed and breadth of the outreach, and the quality of what we present back to you.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#041c2c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Enrol your aircraft.
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-base text-white/60">
            Enrol your aircraft and complete the profile — PlaneServe is then ready before you need it.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/enrol"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-8 py-4 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Enrol Aircraft <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:bg-white/5"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
