import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { ArrowRightIcon } from "@/components/app/PlaneServeIcons";
import { ClipboardList, Plane } from "lucide-react";

export const Route = createFileRoute("/blog/aog-response-checklist")({
  head: () => ({
    meta: [
      { title: "Aircraft AOG Response Checklist — What to Do When Grounded Off-Base" },
      {
        name: "description",
        content:
          "A step-by-step AOG response checklist for flight crews: cockpit fault logging, MEL deferral, AMO triage, parts sourcing, expedited logistics, and customs clearance.",
      },
      {
        property: "og:title",
        content: "Aircraft AOG Response Checklist — What to Do When Grounded Off-Base",
      },
      {
        property: "og:description",
        content:
          "A step-by-step AOG response checklist for flight crews: cockpit fault logging, MEL deferral, AMO triage, parts sourcing, expedited logistics, and customs clearance.",
      },
      {
        property: "og:url",
        content: "https://www.aircraftprogram.com/blog/aog-response-checklist",
      },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: "2026-10-19" },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "Aircraft AOG Response Checklist — What to Do When Grounded Off-Base",
      },
      {
        name: "twitter:description",
        content:
          "A step-by-step AOG response checklist for flight crews: cockpit fault logging, MEL deferral, AMO triage, parts sourcing, expedited logistics, and customs clearance.",
      },
    ],
  }),
  component: AogResponseChecklist,
});

const PDF_HREF = "/aog-cockpit-checklist.pdf";

function AogResponseChecklist() {
  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "The Aircraft AOG Response Checklist: What to Do When Grounded Away from Home Base",
            description:
              "A structured, step-by-step workflow for navigating an off-base AOG event — from initial cockpit fault logging to final airworthiness dispatch.",
            datePublished: "2026-10-19",
            author: { "@type": "Organization", name: "Aircraft Program" },
            publisher: {
              "@type": "Organization",
              name: "Aircraft Program",
              url: "https://www.aircraftprogram.com",
            },
            mainEntityOfPage: "https://www.aircraftprogram.com/blog/aog-response-checklist",
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="brand-dark bg-[#041c2c] text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
          <Eyebrow>Flight Operations · Emergency Response Protocol</Eyebrow>
          <h1 className="mt-6 text-3xl font-semibold leading-[1.12] tracking-tight md:text-5xl">
            The Aircraft AOG Response Checklist:
            <span className="text-accent"> What to Do When Grounded Away from Home Base</span>
          </h1>
          <p className="mt-8 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
            When an <strong className="font-semibold text-white">AOG (Aircraft On Ground)</strong>{" "}
            incident occurs away from your home airport, every minute counts. Whether you are a
            chief pilot, flight operations manager, owner-pilot, or contract crew member, having an
            actionable emergency response protocol prevents minor mechanical anomalies from
            spiraling into multi-day, multi-thousand-dollar logistics disasters.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
            This operational action checklist provides a structured, step-by-step workflow for
            navigating an off-base AOG event — from initial cockpit fault logging to final
            airworthiness dispatch.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/45">
            <span>Published 19 October 2026</span>
            <span>·</span>
            <span>12 min read</span>
            <span>·</span>
            <span>Chief pilots & flight operations</span>
          </div>
        </div>
      </section>

      {/* ── Article body ──────────────────────────────────────────────────── */}
      <article className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          {/* 1 */}
          <Section title="1. Immediate Cockpit Actions: Fault Logging & MEL Deferral">
            <p>Before making phone calls, capture clear operational facts from the flight deck:</p>
            <Bullet
              title="Record Precise System Fault Codes:"
              body='Document exact avionics fault codes, engine indications, amber/red CAS messages, or physical symptoms. Avoid vague descriptions like "radar not working."'
            />
            <Bullet
              title="Consult the Minimum Equipment List (MEL) & CDL:"
              body="Determine if the system can be legally deferred under Master Minimum Equipment List (MMEL) or Configuration Deviation List (CDL) guidelines."
            />
            <Bullet
              title="Log the Formal Squawk:"
              body="Enter the entry into the technical logbook or electronic flight bag (EFB) system with precise conditions (altitude, phase of flight, ambient temperature) when the anomaly occurred."
            />
          </Section>

          {/* 2 */}
          <Section title="2. Triage Line Maintenance: Home AMO vs. Local FBO">
            <p>
              Never assume a local FBO maintenance facility is qualified or certified to turn a
              wrench on your specific serial number:
            </p>
            <Bullet
              title="Evaluate Local FBO Capabilities:"
              body="Verify whether the local facility holds Part 145 (or local civil aviation authority) rating for your specific aircraft make and model."
            />
            <Bullet
              title="Coordinate with Home AMO / CAMO:"
              body="Contact your primary Approved Maintenance Organisation (AMO) or Continuing Airworthiness Management Organisation (CAMO). They retain final responsibility for authorizing maintenance tasks or approving remote sign-offs."
            />
            <Bullet
              title="Mobile Repair Parties (MRP):"
              body="If local engineering is unavailable or unqualified, request a dispatch team from your home base or maintenance provider."
            />
          </Section>

          {/* 3 */}
          <Section title="3. Sourcing Critical Parts: IPC Cross-Referencing & Supersessions">
            <p>
              Procuring components under pressure requires extreme attention to detail to avoid
              shipping non-interchangeable parts:
            </p>
            <Bullet
              title="Cross-Reference the Illustrated Parts Catalog (IPC):"
              body="Sourcing by part number (P/N) alone is insufficient. Verify effectivity codes, modification status, and serial number cut-offs in the IPC."
            />
            <Bullet
              title="Check for Part Number Supersessions:"
              body="Critical components often have superseded part numbers or alternate vendor parts authorized by the OEM."
            />
            <Bullet
              title="Verify Form, Fit, and Function:"
              body="Ensure that modified or superseded components are compatible with existing avionics, wiring harnesses, or hydraulic systems."
            />
          </Section>

          {/* 4 */}
          <Section title="4. Emergency Quoting: Protecting Capital Off-Hours">
            <p>After-hours sourcing often incurs heavy markups and emergency fees:</p>
            <Bullet
              title="Understand AOG Call-Out Premiums:"
              body="Expect fixed AOG processing fees ($500 – $2,000+) from distributors for pulling parts outside standard business hours."
            />
            <Bullet
              title="Request Clear All-Inclusive Quotes:"
              body="Ensure quotes explicitly outline core charges, exchange terms, freight costs, and certification fees (e.g., FAA Form 8130-3 or EASA Form 1) up front."
            />
            <Bullet
              title="Beware of Price Gouging:"
              body="Compare quotes against standardized program rates or secondary reputable vendors whenever feasible."
            />
          </Section>

          {/* 5 */}
          <Section title="5. Logistics Triage: Courier vs. Next Flight Out vs. Air Charter">
            <p>
              Choose the fastest freight solution based on distance, time-of-day, and part
              dimensions:
            </p>

            {/* Decision diagram */}
            <div className="my-8 rounded-sm border border-border bg-card p-6">
              <div className="text-center">
                <span className="inline-block rounded-sm border border-accent/25 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent">
                  Select Expedited Delivery
                </span>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="h-6 w-px bg-border" />
              </div>
              <div className="h-px bg-border" />
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    t: "Next Flight Out (NFO)",
                    d: "Commercial cargo hold. Best for mid-size parts.",
                  },
                  {
                    t: "On-Board Courier (OBC)",
                    d: "Hand-carried small parts. Fastest custom clearance.",
                  },
                  {
                    t: "Dedicated Air Charter",
                    d: "Oversized engines/structures. Maximum speed & direct routing.",
                  },
                ].map((c) => (
                  <div key={c.t} className="flex flex-col items-center">
                    <div className="h-6 w-px bg-border" />
                    <div className="w-full rounded-sm border border-border bg-background p-4 text-center">
                      <div className="text-xs font-bold tracking-tight text-foreground">{c.t}</div>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Bullet
              title="Next Flight Out (NFO):"
              body="Cost-effective for standard-sized parts moving via commercial airline cargo networks."
            />
            <Bullet
              title="On-Board Courier (OBC / Hand-Carry):"
              body="A dedicated courier carries small, high-value components (e.g., avionics boxes, actuators) on passenger flights directly to your location."
            />
            <Bullet
              title="Dedicated Air Charter:"
              body="Necessary for engines, flight control surfaces, or oversized assemblies requiring direct flight routing to remote airfields."
            />
          </Section>

          {/* 6 */}
          <Section title="6. Navigating International Customs Clearance Hurdles">
            <p>
              Crossing international borders during an AOG requires proactive documentation:
            </p>
            <Bullet
              title="Pre-Clear Customs Documentation:"
              body='Ensure commercial invoices explicitly state "CRITICAL AOG AIRCRAFT PARTS - IMMEDIATE DISPATCH."'
            />
            <Bullet
              title="Provide Full Airworthiness Traceability:"
              body="Customs officials and aviation authorities require full back-to-birth history and dual-release certificates (FAA 8130-3 / EASA Form 1) attached to the outer shipment casing."
            />
            <Bullet
              title="Use Specialized AOG Customs Brokers:"
              body="Ensure your logistics provider offers 24/7 customs clearance capabilities at the destination airport."
            />
          </Section>

          {/* 7 */}
          <Section title="7. The Pre-Enrollment Advantage: Saving 4+ Hours in Triage">
            <p>
              In a live emergency, administrative delays (credit checks, account creation,
              insurance verification) add hours of unnecessary downtime:
            </p>
            <Bullet
              title="Active Aircraft Program Files:"
              body="Aircraft enrolled in dedicated maintenance programs or 24/7 AOG desks (e.g., AJW Group, Castle Air) benefit from pre-approved credit lines and instant dispatch protocols."
            />
            <Bullet
              title="Instant Support Access:"
              body="Pre-enrolled operations bypass administrative hurdles, cutting initial response times from 4+ hours down to minutes."
            />
          </Section>

          {/* ── Printable checklist card ─────────────────────────────────── */}
          <div className="mt-14 rounded-sm border border-accent/25 bg-primary/5 p-8">
            <Eyebrow>Quick Reference</Eyebrow>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              <span className="inline-flex items-center gap-3">
                <ClipboardList className="h-6 w-6 text-accent" strokeWidth={1.5} />
                Emergency Away-From-Base AOG Action Card
              </span>
            </h2>
            <ol className="mt-6 space-y-3">
              {[
                "LOG & SQUAWK: Document precise fault codes, CAS messages, and flight conditions.",
                "MEL / CDL CHECK: Confirm if defect can be legally deferred for ferry flight or departure.",
                "NOTIFY CAMO / AMO: Alert primary maintenance management before authorizing local repairs.",
                "VERIFY LOCAL FBO: Confirm local facility ratings & certified technician availability.",
                "IPC VERIFICATION: Cross-reference exact Part Numbers, serial cut-offs, & supersessions.",
                "SOURCE & TRACE: Secure part with verified FAA 8130-3 / EASA Form 1 certificates.",
                "EXPEDITE LOGISTICS: Select NFO, OBC, or Charter based on distance and dimensions.",
                "CUSTOMS CLEARANCE: Ensure paperwork carries priority AOG status tags.",
              ].map((item, i) => {
                const [head, ...rest] = item.split(":");
                return (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-foreground/80">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-sm border border-accent/40 bg-background text-[11px] font-bold text-accent">
                      {i + 1}
                    </span>
                    <p>
                      <strong className="font-semibold text-foreground">{head}:</strong>{" "}
                      {rest.join(":")}
                    </p>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 border-t border-border pt-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Plane className="h-4 w-4 text-accent" strokeWidth={1.5} />
                Need Immediate 24/7 AOG Assistance?
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/submit-aog"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#001b2e] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#002845]"
                >
                  Activate 24/7 AOG Support Desk <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <a
                  href={PDF_HREF}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Download Laminated Cockpit Card PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="brand-dark bg-[#041c2c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            The checklist works. Preparation works better.
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-base text-white/60">
            Enrol your aircraft so the aircraft record, contacts, and trace requirements are already
            on file before the call comes in.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/enrol"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-white hover:bg-white/90 text-[#001b2e] px-8 py-4 text-sm font-semibold transition-colors shadow-sm"
            >
              Enrol Aircraft <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/submit-aog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:bg-white/5"
            >
              Submit an AOG request
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border pb-3 md:text-2xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4 leading-7 text-foreground/80">{children}</div>
    </section>
  );
}

function Bullet({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
      <p>
        <strong className="font-semibold text-foreground">{title}</strong> {body}
      </p>
    </div>
  );
}
