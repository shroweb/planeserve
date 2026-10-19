import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { ArrowRightIcon } from "@/components/app/PlaneServeIcons";

export const Route = createFileRoute("/what-does-aog-mean-in-aviation")({
  head: () => ({
    meta: [
      { title: "What Does AOG Mean in Aviation? Definition & True Downtime Costs" },
      {
        name: "description",
        content:
          "Learn what AOG (Aircraft On Ground) means in aviation. Explore immediate operational costs, common causes, emergency MRO logistics, and compliance risks.",
      },
      {
        property: "og:title",
        content: "What Does AOG Mean in Aviation? Definition & True Downtime Costs",
      },
      {
        property: "og:description",
        content:
          "Learn what AOG (Aircraft On Ground) means in aviation. Explore immediate operational costs, common causes, emergency MRO logistics, and compliance risks.",
      },
      {
        property: "og:url",
        content: "https://www.aircraftprogram.com/what-does-aog-mean-in-aviation",
      },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: "2026-10-19" },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "What Does AOG Mean in Aviation? Definition & True Downtime Costs",
      },
      {
        name: "twitter:description",
        content:
          "Learn what AOG (Aircraft On Ground) means in aviation. Explore immediate operational costs, common causes, emergency MRO logistics, and compliance risks.",
      },
    ],
  }),
  component: AogMeaningArticle,
});

function AogMeaningArticle() {
  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "What Does AOG Mean in Aviation? The Anatomy and True Cost of an Aircraft On Ground Incident",
            description:
              "Learn what AOG (Aircraft On Ground) means in aviation. Explore immediate operational costs, common causes, emergency MRO logistics, and compliance risks.",
            datePublished: "2026-10-19",
            author: { "@type": "Organization", name: "Aircraft Program" },
            publisher: {
              "@type": "Organization",
              name: "Aircraft Program",
              url: "https://www.aircraftprogram.com",
            },
            mainEntityOfPage:
              "https://www.aircraftprogram.com/what-does-aog-mean-in-aviation",
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="brand-dark bg-[#041c2c] text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
          <Eyebrow>AOG Intelligence · Operations Guide</Eyebrow>
          <h1 className="mt-6 text-3xl font-semibold leading-[1.12] tracking-tight md:text-5xl">
            What Does AOG Mean in Aviation?
            <span className="text-accent">
              {" "}
              The Anatomy and True Cost of an Aircraft On Ground Incident
            </span>
          </h1>
          <p className="mt-8 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
            For new aircraft owners, charter brokers, flight operations trainees, and maintenance
            planners, few acronyms carry as much immediate weight and urgency as{" "}
            <strong className="font-semibold text-white">AOG</strong>. Standing for{" "}
            <strong className="font-semibold text-white">Aircraft On Ground</strong>, it is the
            ultimate red flag in aviation operations.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/45">
            <span>Published 19 October 2026</span>
            <span>·</span>
            <span>10 min read</span>
            <span>·</span>
            <span>Flight operations & maintenance planning</span>
          </div>
        </div>
      </section>

      {/* ── Article body ──────────────────────────────────────────────────── */}
      <article className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          {/* 1 */}
          <Section title="1. The Strict Regulatory and Operational Definition">
            <p>
              In aviation, an <strong>AOG</strong> designation means an aircraft is temporarily or
              indefinitely grounded due to an unscheduled technical malfunction, structural damage,
              or mechanical failure that renders it legally and physically unairworthy.
            </p>
            <Bullet
              title="Regulatory Standpoint:"
              body="Under aviation authorities like the FAA and EASA, an aircraft with an unaddressed critical defect cannot legally dispatch under its Minimum Equipment List (MEL) or Configuration Deviation List (CDL)."
            />
            <Bullet
              title="Operational Standpoint:"
              body="It shifts flight operations from active revenue generation or scheduled transit into emergency triage mode, requiring immediate intervention by maintenance, repair, and overhaul (MRO) specialists."
            />
          </Section>

          {/* 2 */}
          <Section title="2. The Immediate Operational Domino Effect">
            <p>
              An AOG incident rarely affects just a single flight; it triggers a cascading series
              of operational bottlenecks:
            </p>
            <Bullet
              title="Passenger Stranding & VIP Disruption:"
              body="High-net-worth individuals, commercial passengers, or medical transport clients are left stranded, requiring immediate alternative arrangements or backup aircraft chartering."
            />
            <Bullet
              title="Missed Charter Slots & Revenue Loss:"
              body="For charter operators, every missed flight slot means forfeited revenue, damaged client relationships, and potential penalty fees."
            />
            <Bullet
              title="Crew Duty Time Expiration:"
              body="Even if a replacement part arrives quickly, flight and cabin crews may hit legal maximum duty time limitations while waiting, forcing a crew swap or extended rest periods that further delay departure."
            />
          </Section>

          {/* 3 */}
          <Section title="3. The Financial Reality: The Cost of Downtime">
            <p>
              Every hour an aircraft sits grounded drains capital rapidly. While costs vary by
              aircraft category, the financial reality for midsize and super-midsize business jets
              is staggering:
            </p>

            <div className="my-8 overflow-x-auto rounded-sm border border-border">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left font-bold text-foreground">
                      Aircraft Category
                    </th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">
                      Estimated Cost Per Hour of AOG Downtime
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      Light Jets / Turboprops
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">$500 – $2,000 / hour</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      Midsize / Super-Midsize Jets
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">$2,000 – $7,000 / hour</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      Heavy / Long-Range Jets
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">$7,000 – $15,000+ / hour</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm italic text-muted-foreground">
              Note: These figures encompass direct maintenance labor, emergency shipping fees,
              temporary passenger accommodations, and lost charter revenue.
            </p>
          </Section>

          {/* 4 */}
          <Section title="4. Common Causes of AOG">
            <p>
              While maintenance planners deploy rigorous predictive maintenance, unexpected failures
              still happen. The most frequent triggers include:
            </p>
            <Bullet
              title="Avionics & Flight Deck Failures:"
              body="Navigation, radar, or flight management computer anomalies that breach dispatch reliability."
            />
            <Bullet
              title="Hydraulic Leaks:"
              body="Seal failures or line ruptures in high-pressure systems."
            />
            <Bullet
              title="Bird Strikes:"
              body="Structural impacts requiring mandatory inspections of engine cowlings, radomes, and leading edges."
            />
            <Bullet
              title="Tire and Brake Wear:"
              body="Out-of-limit wear discovered during routine walk-arounds or heavy braking events."
            />
            <Bullet
              title="Starter-Generator Faults:"
              body="Electrical generation components failing during engine start cycles."
            />
          </Section>

          {/* 5 */}
          <Section title="5. The Emergency Supply Chain vs. Scheduled MRO">
            <p>
              Standard scheduled maintenance relies on predictable logistics and ground transport.
              An <strong>AOG emergency supply chain</strong> operates entirely differently:
            </p>
            <Bullet
              title="Dedicated AOG Desks:"
              body="Parts manufacturers and distributors maintain 24/7 dedicated AOG teams to source critical components instantly."
            />
            <Bullet
              title="Hand-Carried / On-Board Couriers (OBC):"
              body="Securing the fastest possible transport, often physically flying a technician or courier with the part to the stranded aircraft."
            />
            <Bullet
              title="Customs Expediting:"
              body="Pre-cleared international parts routing to bypass bureaucratic delays at borders."
            />
          </Section>

          {/* 6 */}
          <Section title="6. Regulatory Risk: Speed vs. Airworthiness Traceability">
            <p>
              The ultimate trap during an AOG crisis is sacrificing compliance for speed. Sourcing a
              part quickly without a verified <strong>8130-3 airworthiness approval tag</strong> or
              complete back-to-birth traceability creates catastrophic regulatory and safety risks.
              Installing unverified components can result in severe FAA/EASA enforcement actions,
              grounded fleets, and—above all—compromised flight safety.
            </p>
          </Section>

          {/* Next steps */}
          <div className="mt-14 border-t border-border pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Next Steps & Resources
            </h2>
            <p className="mt-4 leading-7 text-foreground/80">
              To safeguard your fleet against unexpected downtime, consider enrolling your aircraft
              in an hourly maintenance program (such as JSSI or manufacturer-backed programs) and
              establish a rigorous response framework.
            </p>
            <p className="mt-4 italic leading-7 text-muted-foreground">
              Would you like help outlining a customized AOG Initial Response Protocol checklist
              for your flight operations team?
            </p>
          </div>

          {/* ── CTA card ─────────────────────────────────────────────────── */}
          <div className="mt-10 rounded-sm border border-accent/25 bg-primary/5 p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-accent/20 bg-accent/10">
              <ArrowRightIcon className="h-5 w-5 text-accent" />
            </div>
            <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">
              🛠️ Protect Your Fleet Against AOG Downtime
            </h3>
            <p className="mt-3 leading-7 text-foreground/80">
              <strong>Enrol your aircraft in the Aircraft Program</strong> and standardise your
              flight department's emergency workflows with a retained AOG desk, verified trace
              standards, and an aircraft record that is already on file when the call comes in.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/enrol"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#001b2e] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#002845]"
              >
                Enrol Aircraft <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Request the AOG Response Protocol
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="brand-dark bg-[#041c2c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            AOG support starts before the AOG happens.
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-base text-white/60">
            Enrolment takes less than five minutes, and the desk already has your aircraft record,
            contacts, and documentation requirements on file.
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
