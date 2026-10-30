import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { PublicLayout } from "@/components/site/PublicLayout";
import { ArticleSchema, RelatedReading } from "@/components/site/ArticleLayout";
import { Eyebrow } from "@/components/site/Section";
import { ArrowRightIcon } from "@/components/app/PlaneServeIcons";

const TITLE = "AOG Request: Why Retained Procurement Beats 2:00 AM Scrambling";
const DESCRIPTION =
  "See how pre-enrolled aircraft information, pre-authorization, and a 24/7 AOG desk can help operators manage urgent aircraft parts procurement.";

export const Route = createFileRoute("/blog/retained-aog-procurement")({
  head: () =>
    pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/blog/retained-aog-procurement",
      type: "article",
      published: "2026-10-27",
      modified: "2026-10-30",
    }),
  component: RetainedAogProcurement,
});

function RetainedAogProcurement() {
  return (
    <PublicLayout>
      <ArticleSchema slug="retained-aog-procurement" />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="brand-dark bg-[#041c2c] text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
          <Eyebrow>Procurement · Retained AOG Support</Eyebrow>
          <h1 className="mt-6 text-3xl font-semibold leading-[1.12] tracking-tight md:text-5xl">
            Why Retained AOG Procurement
            <span className="text-accent"> Beats Open-Market Scrambling at 2:00 AM</span>
          </h1>
          <p className="mt-8 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
            At <strong className="font-semibold text-white">2:00 AM in Nice</strong>, a business
            aircraft is grounded with a VIP flight scheduled for 7:00. Maintenance has identified a
            likely <strong className="font-semibold text-white">engine starter-generator</strong>{" "}
            issue. The flight director needs a sourcing plan, the operator needs to approve the
            expense, and the maintenance team needs confidence that any replacement part is
            suitable.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/45">
            <span>Published 27 October 2026</span>
            <span>·</span>
            <span>5 min read</span>
            <span>·</span>
            <span>Flight directors & operators</span>
          </div>
        </div>
      </section>

      {/* ── Article body ──────────────────────────────────────────────────── */}
      <article className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <Section title="Why an AOG request is more than a parts search">
            <p>
              An <strong className="font-semibold text-foreground">AOG request</strong> is a
              time-sensitive coordination challenge involving aircraft details, supplier
              availability, approvals, documentation, and delivery.
            </p>
            <p>
              With open-market scrambling, the operator may have to build that process in the middle
              of the crisis. With retained AOG procurement, key information and authorizations can
              be prepared in advance — so the team has a clearer place to start.
            </p>
          </Section>

          <Section title="What can slow down an urgent AOG request?">
            <p>Searching for a part during an AOG event may involve several parallel tasks:</p>
            <Bullet body="Calling suppliers and waiting for an after-hours response" />
            <Bullet body="Finding and vetting potential sources" />
            <Bullet body="Confirming the part number, applicability, condition, and documentation" />
            <Bullet body="Coordinating payment and internal approval" />
            <Bullet body="Arranging shipping and keeping maintenance and operations updated" />
            <p>
              At 2:00 AM, unanswered vendor phones or unclear approval procedures can quickly
              consume time. A potential source may have a listing, but the operator still needs to
              confirm availability and verify that the part meets the aircraft's requirements.
            </p>
            <p>
              Payment can create another bottleneck. Corporate card limits, unfamiliar terms, or a
              new commercial credit check may delay a request even after a possible part has been
              located.
            </p>
          </Section>

          <Section title="How pre-enrollment changes the starting point">
            <p>
              Aircraft Program's retained model allows operators to provide important information
              before an emergency occurs, including the aircraft's{" "}
              <strong className="font-semibold text-foreground">
                tail number, serial number, AMO, and operating specifications
              </strong>
              .
            </p>
            <p>
              When an AOG event happens, having those details on file can reduce repeated
              information gathering and help the team understand the request sooner. Instead of
              starting with basic aircraft identification, the conversation can focus on the issue,
              the required component, and the next steps.
            </p>
            <p>
              A pre-enrolled process may be especially useful for independent business aircraft
              operators, corporate flight departments, and charter operators that need a defined way
              to request AOG support services.
            </p>
          </Section>

          <Section title="Pre-authorization can help keep procurement moving">
            <p>
              Urgent sourcing is only useful if the team can act on an appropriate option.
              Pre-authorization helps establish who can approve a purchase and what arrangements
              apply before the aircraft is grounded.
            </p>
            <p>
              Under the agreed process, pre-authorization is designed to help bypass commercial
              credit checks during off-peak hours. That can reduce a common source of delay — but it
              does not remove the need for operator approval or agreed spending terms.
            </p>
            <p>Before an AOG event, clarify:</p>
            <Bullet body="Who is authorized to approve an emergency purchase" />
            <Bullet body="What spending limits or conditions apply" />
            <Bullet body="How quotes and costs will be shared" />
            <Bullet body="What payment arrangements are available after hours" />
            <p>
              A clear approval path helps the operator make informed decisions without having to
              create the process during a crisis.
            </p>
          </Section>

          <Section title="A disclosed agency model means pricing transparency">
            <p>
              Aircraft Program uses a{" "}
              <strong className="font-semibold text-foreground">disclosed agency model</strong> for
              procurement. Part pricing is presented transparently, with{" "}
              <strong className="font-semibold text-foreground">
                no hidden distributor markups
              </strong>
              , so operators can review the quoted costs and understand what they are being asked to
              approve.
            </p>
            <p>
              As with any urgent procurement, confirm the details of the quote, including the part,
              condition, documentation, logistics, and any applicable service charges. Transparent
              pricing supports faster, better-informed decisions when time is limited.
            </p>
          </Section>

          <Section title="A starter-generator scenario: prepared sourcing versus starting from scratch">
            <p>
              Imagine the aircraft is grounded in Nice before an early departure, and maintenance
              requests an engine starter-generator. In an open-market scramble, the team may need to
              locate suppliers, reach someone after hours, verify availability and documentation,
              resolve payment requirements, and arrange transport — all while coordinating updates.
            </p>
            <p>
              With aircraft information and authorization already on file, a retained AOG parts desk
              can begin from a more prepared position. In a scenario where a suitable part is
              available and approvals and logistics align, sourcing might take{" "}
              <strong className="font-semibold text-foreground">
                90 minutes rather than 18 hours
              </strong>{" "}
              of open-market searching.
            </p>
            <p>
              That comparison illustrates the potential value of preparation; it is{" "}
              <strong className="font-semibold text-foreground">
                not a guaranteed sourcing time
              </strong>
              . Actual timing depends on part availability, supplier response, verification,
              approvals, location, and delivery options. The goal is to reduce avoidable delays and
              give the operator a more organized route to a decision.
            </p>
          </Section>

          <Section title="Why use a 24/7 AOG desk?">
            <p>
              AOG events don't always happen during business hours. A 24/7 AOG desk gives operators
              a defined contact point for urgent requests and coordination outside the standard
              workday.
            </p>
            <p>
              For flight directors and operations teams, a clear point of contact can make it easier
              to share the situation, confirm what information is needed, and keep relevant
              stakeholders informed. It can also help prevent the confusion that arises when several
              people contact different vendors without a coordinated plan.
            </p>
          </Section>

          <Section title="Prepare before the next aircraft-on-ground event">
            <p>
              No procurement process can guarantee that a specific part will be available or that an
              aircraft will return to service by a particular time. But operators can make the
              response more manageable by preparing essential information and approvals in advance.
            </p>
            <p>
              Retained AOG procurement helps create that starting point: aircraft details on file,
              an agreed authorization process, transparent pricing, and a dedicated desk to
              coordinate the request.
            </p>
          </Section>

          <div className="mt-14 rounded-sm border border-accent/25 bg-primary/5 p-8">
            <p className="text-sm font-semibold text-foreground">
              Submit an AOG request or pre-enroll your aircraft in five minutes.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/aog-request"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#001b2e] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#002845]"
              >
                Submit an AOG request <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                to="/enrol"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Pre-enrol your aircraft
              </Link>
            </div>
          </div>
        </div>
      </article>
      <RelatedReading current="retained-aog-procurement" />
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

function Bullet({ body }: { body: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
      <p>{body}</p>
    </div>
  );
}
