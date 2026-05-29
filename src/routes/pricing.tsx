import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
});

const monthlyFeatures = [
  "24/7 AOG request intake",
  "Aircraft profile on file",
  "Global supplier sourcing",
  "Sourcing options in dashboard",
  "Direct operator updates",
  "Unlimited requests per aircraft",
];

const annualFeatures = [
  ...monthlyFeatures,
  "Two months free vs monthly",
  "Priority on long-running cases",
  "Annual aircraft profile review",
];

const faqs = [
  {
    q: "Is there a per-request or per-case fee?",
    a: "No. Your subscription covers unlimited AOG requests for each enrolled aircraft. There are no additional fees on top of the subscription.",
  },
  {
    q: "Can I enrol more than one aircraft?",
    a: "Yes — each aircraft is enrolled separately on its own plan. You can mix monthly and annual across your fleet.",
  },
  {
    q: "What happens when I cancel?",
    a: "You can cancel at the end of any billing period. Your aircraft profile and case history remain accessible until the subscription expires.",
  },
  {
    q: "When does AOG cover become active?",
    a: "Cover becomes active once PlaneServe has verified your aircraft's Tier 2 details — engine, maintenance, contacts and insurance. You can begin submitting requests immediately after enrolment while verification is completed.",
  },
  {
    q: "How is payment handled?",
    a: "Payment is processed securely through Stripe. You enter your card during enrolment, your per-aircraft subscription starts immediately, and you can manage your card or cancel any time from the Billing area.",
  },
];

function Pricing() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            Per aircraft.{" "}
            <span className="font-serif italic font-normal text-accent">No surprises.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/60">
            One subscription per aircraft covers the full AOG support lane. No per-request fees, no
            setup costs.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Monthly */}
            <div className="rounded-md border border-border bg-card p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Monthly
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight">$100</span>
                <span className="text-sm text-muted-foreground">/ aircraft / month</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Flexible month-to-month cover. Cancel at any time.
              </p>
              <Link
                to="/enrol"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-sm border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Enrol aircraft <ArrowRight className="h-4 w-4" />
              </Link>
              <ul className="mt-7 space-y-3">
                {monthlyFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      strokeWidth={1.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Annual */}
            <div className="rounded-md border-2 border-accent bg-card p-8 shadow-[0_0_50px_oklch(0.7_0.18_85_/_0.10)]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Annual
                </div>
                <div className="rounded-sm bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[oklch(0.16_0.02_250)]">
                  Best value
                </div>
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight">$1,000</span>
                <span className="text-sm text-muted-foreground">/ aircraft / year</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Two months free. Priority handling on long-running cases.
              </p>
              <Link
                to="/enrol"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-sm bg-accent py-3 text-sm font-semibold text-[oklch(0.16_0.02_250)] hover:opacity-90 transition-opacity"
              >
                Enrol aircraft <ArrowRight className="h-4 w-4" />
              </Link>
              <ul className="mt-7 space-y-3">
                {annualFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      strokeWidth={1.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Each aircraft enrolled separately. Add or cancel aircraft at any time.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-3 mb-10">
            <HelpCircle className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <h2 className="text-xl font-semibold tracking-tight">Frequently asked questions</h2>
          </div>
          <div className="space-y-0 divide-y divide-border">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden marker:hidden">
                  {f.q}
                  <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Enrol before the AOG, not during it.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/60 max-w-xl">
              It takes less than five minutes to add an aircraft and activate your support lane.
            </p>
          </div>
          <Link
            to="/enrol"
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold text-[oklch(0.16_0.02_250)] hover:opacity-90"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
