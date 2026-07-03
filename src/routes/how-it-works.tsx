import { createFileRoute, Link } from "@tanstack/react-router";
import challengerHangar from "@/assets/challenger-mro-hangar.jpeg";
import sourcingRamp from "@/assets/WhatsApp Image 2026-06-03 at 17.11.43.jpeg";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import {
  ArrowRightIcon,
  DocumentIcon,
  SearchIcon,
  MessageIcon,
  ClearedIcon,
  SlaIcon,
  AogIcon,
  CoverIcon,
} from "@/components/app/PlaneServeIcons";
import { BookOpen, Shield, TrendingUp, Eye, Scale } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it Works — The PlaneServe AOG support journey" },
      {
        name: "description",
        content: "Learn how PlaneServe moves your aircraft from 'grounded' to 'serviceable' using a retained support desk and pre-captured context.",
      },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="brand-dark bg-[#041c2c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Eyebrow>The Process. The Preparation. The Difference it Makes.</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            Most AOG support starts when you call.{" "}
            <span className="text-accent">The PSP starts long before that.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
            The critical difference between a one-day AOG and a one-week AOG is rarely the parts
            themselves — it is the preparation that either exists or doesn't when the call comes in.
            By the time you need us, we already know your aircraft, your maintenance contacts, your
            base of operation, and your documentation requirements. The desk is not opening a blank
            file at 2am. It is already moving.
          </p>
        </div>
      </section>

      {/* ── Before the AOG ────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
            <div className="lg:sticky lg:top-24">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 border border-accent/20 mb-6">
                <CoverIcon className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl leading-tight">
                Before the AOG.{" "}
                <span className="text-accent">The work that happens before anything goes wrong.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                PlaneServe is not a marketplace you log into during a crisis. It is a retained AOG
                desk where your aircraft record, AMO contacts, and trace requirements are already on
                file long before the first call comes in.
              </p>
            </div>

            <div className="space-y-0 divide-y divide-border border border-border rounded-sm">
              {[
                {
                  t: "Aircraft Enrolment",
                  Icon: DocumentIcon,
                  d: "Enrolment takes less than five minutes. You provide your aircraft's registration, serial number, type, engine fit, and base of operations. That information is held on file and forms the foundation of your PSP support record — available to the desk immediately, at any hour. The biggest cause of AOG delay isn't just finding the part — it's the administrative cold start. Enrolment eliminates it entirely.",
                },
                {
                  t: "Aircraft Record",
                  Icon: BookOpen,
                  d: "Beyond the basics, PlaneServe builds a working record of your aircraft's configuration — engine serials, base ICAO, known part number history, and maintenance status. Over time, this record becomes one of your most valuable operational assets. Every part sourced, every AOG resolved, every supplier engaged is logged against the aircraft.",
                },
                {
                  t: "Contact Registry",
                  Icon: MessageIcon,
                  d: "Your AMO, operator contacts, and insurer details are verified and held on file. When an AOG occurs, we are not asking you to find numbers under pressure. We are already calling them.",
                },
                {
                  t: "Parts Passport",
                  Icon: Shield,
                  d: "Every part sourced through PlaneServe is recorded against your aircraft — part number, trace documentation, case reference, and date of fitment. This living record travels with the aircraft, supports pre-purchase inspections, and provides the clean documentation history that protects both airworthiness and residual value.",
                },
                {
                  t: "Intelligence Layer",
                  Icon: TrendingUp,
                  d: "As PlaneServe builds its enrolled fleet, the platform develops a growing picture of parts availability, supplier response times, and pricing patterns by aircraft type. Enrolled aircraft benefit from that intelligence — not just when they are AOG, but when planning scheduled maintenance, budgeting for upcoming requirements, or assessing the likely cost of a known defect before it becomes a ground stop.",
                },
              ].map((item) => {
                const Icon = item.Icon;
                return (
                  <div key={item.t} className="p-8 flex gap-6">
                    <div className="flex-none flex h-9 w-9 items-center justify-center rounded-sm bg-accent/10 border border-accent/20">
                      <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm tracking-tight mb-2">{item.t}</h3>
                      <p className="text-sm leading-7 text-muted-foreground">{item.d}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Operational image bridge ─────────────────────────────────────── */}
      <section className="brand-dark bg-[#041c2c] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>Operational Readiness</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              The aircraft is known before the request starts.
            </h2>
            <p className="mt-6 text-sm leading-7 text-white/60">
              Enrolment means the desk is not opening a blank file during an AOG. The aircraft,
              contacts, documentation expectations, and support route are already in place.
            </p>
          </div>
          <div className="relative min-h-[320px] overflow-hidden rounded-sm border border-white/10">
            <img
              src={sourcingRamp}
              alt="Twin-engine aircraft on the ramp before operational support"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041c2c]/45 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── When the Call Comes In ────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 border border-accent/20 mb-6 mx-auto">
              <AogIcon className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              When the call comes in,{" "}
              <span className="text-accent">we're already moving.</span>
            </h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground">
              Because your aircraft record is already on file, the desk bypasses the discovery phase
              entirely. There are no registration numbers to find, no engine series to confirm, no
              cold start. The focus from the first moment is resolution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-border border border-border rounded-sm overflow-hidden">
            {[
              {
                n: "01",
                t: "Rapid Intake",
                Icon: DocumentIcon,
                d: "You submit the defect and part requirement — by phone, message, or through the platform. The desk immediately cross-references the requirement against your aircraft's known configuration, confirming part numbers, applicable alternatives, and any relevant trace requirements for your maintenance organisation.",
              },
              {
                n: "02",
                t: "Supplier Outreach",
                Icon: SearchIcon,
                d: "We engage our global supplier network simultaneously — not sequentially. Requests go out to vetted distributors, overhaul facilities, and specialist dealers matched to your aircraft type and current location. Suppliers who work with PlaneServe know our standards. Responses come back faster as a result.",
              },
              {
                n: "03",
                t: "Trace & Compliance Verification",
                Icon: Shield,
                d: "Every supplier response is screened before it reaches you. We verify 8130-3 or EASA Form 1 documentation, confirm full traceability, and assess airworthiness eligibility. Options that do not meet the standard are not presented. Your maintenance team receives only those options that are ready to approve.",
              },
              {
                n: "04",
                t: "Options Presented",
                Icon: Eye,
                d: "Qualified options are presented clearly — PlaneServe source reference, price, lead time, shipping origin, and documentation status. No ambiguity. No hidden layers. You or your team makes an informed decision with everything they need in front of them.",
              },
              {
                n: "05",
                t: "Approval and Dispatch",
                Icon: ClearedIcon,
                d: "Once approved and ordered, PlaneServe coordinates directly with your maintenance team on delivery logistics. Approve the preferred option from the dashboard or directly with the desk. AWB tracked — freight route, carrier, and estimated arrival updated as the shipment moves.",
              },
              {
                n: "06",
                t: "Record Updated",
                Icon: BookOpen,
                d: "Once the part is dispatched, the transaction is closed against your aircraft record. The part number, trace documentation, and case reference are added to your Parts Passport — permanently on file, available for any future inspection, audit, or pre-purchase review.",
              },
            ].map((step) => {
              const Icon = step.Icon;
              return (
                <div key={step.t} className="p-8 bg-background flex gap-6">
                  <div className="flex-none">
                    <div className="text-xs font-bold text-accent/60 tracking-widest mb-3">{step.n}</div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-accent/10 border border-accent/20">
                      <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-3 tracking-tight">{step.t}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{step.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Phase 3 image ────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-sm overflow-hidden">
                <img
                  src={challengerHangar}
                  alt="Challenger aircraft in MRO hangar"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-accent p-6 rounded-sm shadow-xl hidden md:block">
                <SlaIcon className="h-8 w-8 text-white" />
              </div>
            </div>

            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 border border-accent/20 mb-6">
                <MessageIcon className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl leading-tight">
                Options, approval, and{" "}
                <span className="text-accent">coordinated dispatch.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                Options land with side-by-side transparency. Once you approve, we handle the order
                placement and coordinate with your maintenance team for arrival. Every step is
                logged against the aircraft record as it happens.
              </p>
              <div className="mt-10 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-sm border border-border">
                    <ClearedIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm uppercase tracking-wider text-accent mb-1">Approval</div>
                    <p className="text-sm text-muted-foreground">Approve the preferred option from the dashboard or directly with the desk.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-sm border border-border">
                    <SlaIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm uppercase tracking-wider text-accent mb-1">Tracking</div>
                    <p className="text-sm text-muted-foreground">AWB tracked — freight route, carrier, and estimated arrival updated as it moves.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-sm border border-border">
                    <BookOpen className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm uppercase tracking-wider text-accent mb-1">Record</div>
                    <p className="text-sm text-muted-foreground">Part number, trace documentation, and case reference added permanently to the aircraft record.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why PSP Makes the Difference ─────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow>Why Enrol on the PSP</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Why the retained model wins.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                t: "No Cold Starts",
                Icon: AogIcon,
                d: "We do not ask for engine serials at 2am. They are already on file. The desk is active from the moment you make contact.",
              },
              {
                t: "Simultaneous Supplier Outreach",
                Icon: SearchIcon,
                d: "Our network is engaged in parallel, not one at a time. Multiple options come back faster. You spend less time waiting and more time making decisions.",
              },
              {
                t: "Compliance Built In",
                Icon: Shield,
                d: "Trace verification and documentation checks happen before options reach your team — not after. Your maintenance organisation receives only parts that meet the standard.",
              },
              {
                t: "A Record That Grows",
                Icon: TrendingUp,
                d: "Every case, every part, every supplier interaction is logged. The longer your aircraft is enrolled, the more valuable that record becomes — to you, to your maintenance team, and to any future buyer.",
              },
              {
                t: "Transparent Throughout",
                Icon: Eye,
                d: "Lead times, pricing, documentation status, and shipping are visible at every stage. There are no surprises at approval and no chasing for updates once the order is placed.",
              },
              {
                t: "Independent",
                Icon: Scale,
                d: "PlaneServe has no commercial relationship with any single supplier that influences what we present. Our only interest is the fastest, most compliant resolution for your aircraft.",
              },
            ].map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.t} className="p-6 border border-border bg-background rounded-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-accent/10 border border-accent/20 mb-4">
                    <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="font-bold text-sm mb-2 tracking-tight">{item.t}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="brand-dark bg-[#041c2c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Enrol your aircraft.
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-base text-white/60">
            It takes less than five minutes to add your aircraft and activate your PSP support desk.
            The sooner your record is on file, the sooner the desk is ready to move.
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
