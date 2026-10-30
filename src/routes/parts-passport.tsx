import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { ArrowRightIcon } from "@/components/app/PlaneServeIcons";
import { breadcrumbLd, jsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/parts-passport")({
  head: () =>
    pageHead({
      title: "Parts Passport: Digital Aircraft Parts Trace Records",
      description:
        "The Aircraft Program Parts Passport keeps part numbers, serials, release certificates and fitment records for every part sourced for your aircraft, on file for audits and sale.",
      path: "/parts-passport",
    }),
  component: PartsPassportPage,
});

const ITEMS = [
  ["Part and serial numbers", "What was fitted, and which unit it was."],
  ["Release certificates", "FAA 8130-3, EASA Form 1 or UK CAA Form 1 as supplied."],
  ["Trace documents", "Non-incident statements and history, where applicable."],
  ["Case reference and dates", "The request, approval and dispatch record."],
];

function PartsPassportPage() {
  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Parts Passport", path: "/parts-passport" },
          ]),
        )}
      />
      <section className="brand-dark bg-[#001b2e] text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
          <Eyebrow>Parts Passport</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            Every part, <span className="text-accent">on file for the life of the aircraft.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            The Parts Passport is your aircraft's digital record of the parts sourced through
            Aircraft Program. When a part is dispatched, its documents are added to your aircraft
            file, ready for audits, pre-purchase inspections and sale.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight">What the Parts Passport holds</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {ITEMS.map(([t, d]) => (
              <div key={t} className="rounded-sm border border-border bg-card p-5">
                <div className="font-semibold text-foreground">{t}</div>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-14 text-2xl font-bold tracking-tight">Why it matters</h2>
          <p className="mt-4 text-sm leading-7 text-foreground/80">
            Missing release paperwork is a common cause of delay at a pre-purchase inspection and a
            common reason a part is rejected at the ramp. Keeping the records together removes that
            risk. Read more in{" "}
            <Link
              to="/blog/easa-form-1-vs-faa-8130-3"
              className="font-semibold text-accent hover:underline"
            >
              EASA Form 1 vs FAA 8130-3
            </Link>
            .
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/enrol"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#001b2e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#002845]"
            >
              Enrol and activate your Parts Passport <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center rounded-sm border border-border px-6 py-3 text-sm font-semibold hover:bg-muted"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
