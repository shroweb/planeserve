import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { ArrowRightIcon } from "@/components/app/PlaneServeIcons";
import { SITE_URL, faqLd, jsonLd, pageHead } from "@/lib/seo";

const FAQS = [
  {
    q: "What does AOG stand for in aviation?",
    a: "AOG stands for Aircraft On Ground. It describes an aircraft that cannot fly because a part, repair or approval is missing, and it is treated as urgent because every hour on the ground has a cost.",
  },
  {
    q: "What is an AOG request?",
    a: "An AOG request is a time-critical request to find, verify and deliver a part so a grounded aircraft can return to service. It normally includes the aircraft details, the part number or fault description, and the delivery location.",
  },
  {
    q: "What is retained AOG support?",
    a: "Retained AOG support means the aircraft is enrolled before it is grounded. Its details, contacts and approvals are already on file, so the AOG desk can start sourcing straight away instead of gathering basic information first.",
  },
  {
    q: "Does Aircraft Program act as a parts broker?",
    a: "No. We procure the part as your disclosed agent: the supplier and price are passed on to you, our fees are stated up front, and you approve the purchase.",
  },
];

const FLEET = [
  ["king-air", "King Air"],
  ["citation", "Citation"],
  ["challenger", "Challenger"],
  ["learjet", "Learjet"],
  ["falcon", "Falcon"],
  ["gulfstream", "Gulfstream"],
  ["phenom", "Phenom"],
  ["hawker", "Hawker"],
  ["helicopter", "Helicopter"],
] as const;

export const Route = createFileRoute("/aog")({
  head: () =>
    pageHead({
      title: "AOG Service: 24/7 AOG Desk for Business Aircraft",
      description:
        "AOG service for business jets, turboprops and helicopters: a 24/7 AOG desk, AOG parts procurement and supply, and retained cover set up before you are grounded.",
      path: "/aog",
    }),
  component: AogPage,
});

function AogPage() {
  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "AOG service",
            serviceType: "Aircraft on ground parts procurement and coordination",
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: "Worldwide",
            audience: {
              "@type": "Audience",
              audienceType: "Business aircraft owners, operators and flight departments",
            },
            url: `${SITE_URL}/aog`,
          },
          faqLd(FAQS),
        ])}
      />

      <section className="brand-dark bg-[#001b2e] text-white">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <Eyebrow>AOG Service · 24/7 AOG Desk</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            AOG service for aircraft that <span className="text-accent">cannot wait.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            Aircraft Program is a retained AOG service for business jets, turboprops and
            helicopters. Our 24/7 AOG desk sources, verifies and dispatches the part, working from
            an aircraft profile that is already on file.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/aog-request"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-white px-8 py-4 text-sm font-semibold text-[#001b2e] transition-colors hover:bg-white/90"
            >
              Submit an AOG request <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/enrol"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:bg-white/5"
            >
              Enrol your aircraft
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">AOG services we coordinate</h2>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-foreground/80">
              <li>
                <strong className="text-foreground">AOG parts procurement.</strong> Supplier
                outreach, quote comparison and approval before anything is ordered. See the{" "}
                <Link to="/parts-sourcing" className="font-semibold text-accent hover:underline">
                  parts sourcing desk
                </Link>
                .
              </li>
              <li>
                <strong className="text-foreground">AOG supply and logistics.</strong> Next flight
                out, onboard courier or charter dispatch, with customs planned in advance. Read{" "}
                <Link
                  to="/blog/aog-logistics"
                  className="font-semibold text-accent hover:underline"
                >
                  AOG logistics
                </Link>
                .
              </li>
              <li>
                <strong className="text-foreground">Trace verification.</strong> Release
                certificates and trace documents are checked before dispatch and filed to your{" "}
                <Link to="/parts-passport" className="font-semibold text-accent hover:underline">
                  Parts Passport
                </Link>
                .
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">A 24/7 AOG desk, not a call queue</h2>
            <p className="mt-6 text-sm leading-7 text-foreground/80">
              When an enrolled aircraft is grounded, the desk already holds the tail number, serial
              number, approved maintenance organisation and approval limits. The first conversation
              is about the fault and the part, not about who you are.
            </p>
            <p className="mt-4 text-sm leading-7 text-foreground/80">
              That is what makes the model <em>retained</em>: the preparation happens before the
              incident. Compare the approach in{" "}
              <Link
                to="/blog/retained-aog-procurement"
                className="font-semibold text-accent hover:underline"
              >
                retained AOG procurement
              </Link>{" "}
              or see{" "}
              <Link to="/pricing" className="font-semibold text-accent hover:underline">
                pricing
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight">Business jet AOG support by type</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Operators search by aircraft when they are grounded. Choose yours for the common AOG
            components and a request form.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {FLEET.map(([key, label]) => (
              <Link
                key={key}
                to="/parts/$airframe"
                params={{ airframe: key }}
                className="rounded-full border border-border bg-background px-5 py-2 text-sm font-semibold hover:border-accent/50"
              >
                {label} AOG
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight">AOG frequently asked questions</h2>
          <dl className="mt-8 space-y-8">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="text-base font-semibold text-foreground">{f.q}</dt>
                <dd className="mt-2 text-sm leading-7 text-foreground/80">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-sm text-muted-foreground">
            More in{" "}
            <Link
              to="/blog/what-does-aog-mean-in-aviation"
              className="font-semibold text-accent hover:underline"
            >
              What does AOG mean in aviation?
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
