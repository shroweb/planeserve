import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { ArrowRightIcon, ClearedIcon, CoverIcon, AogIcon } from "@/components/app/PlaneServeIcons";
import { HelpCircle, Info } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Simple retained support per aircraft" },
      {
        name: "description",
        content: "No per-case fees. No markups. Just simple, transparent retained AOG support for your business aircraft fleet.",
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <Eyebrow>Simple Membership</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            Retained support.{" "}
            <span className="text-accent">No surprises.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-white/70 md:text-lg">
            One subscription per aircraft covers the full AOG support lane. 
            We don't charge per request, and we never mark up parts.
          </p>
        </div>
      </section>

      {/* ── The Model Explanation ────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                t: "Per-Aircraft Membership",
                d: "We believe support should be ready before you need it. A simple monthly or annual fee keeps your aircraft details on file and your desk activated.",
                Icon: CoverIcon,
              },
              {
                t: "Zero Part Markups",
                d: "Our value is in the sourcing and verification, not in the parts margin. You pay exactly what the supplier charges. No hidden percentages.",
                Icon: AogIcon,
              },
              {
                t: "Unlimited AOG Requests",
                d: "Whether you go technical once a year or once a month, your support cost remains fixed. We treat every case with the same AOG urgency.",
                Icon: Info,
              },
            ].map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.t} className="flex flex-col">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 border border-accent/20 mb-6">
                    <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight mb-4">{item.t}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing Options ──────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* Monthly */}
              <div className="p-10 border border-border bg-background rounded-sm flex flex-col">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Monthly Cover</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-semibold tracking-tight">$100</span>
                  <span className="text-sm text-muted-foreground">/ aircraft / month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-10 flex-1">
                  Flexible month-to-month cover for aircraft with fluctuating missions or short-term management contracts.
                </p>
                <ul className="space-y-4 mb-10">
                  {["24/7 AOG Intake", "Aircraft Profile Stored", "Global Sourcing Desk", "Operator Updates"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <ClearedIcon className="h-4 w-4 text-accent shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/enrol"
                  className="flex w-full items-center justify-center gap-2 rounded-sm border border-border py-4 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Enrol aircraft <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>

              {/* Annual */}
              <div className="p-10 border-2 border-accent bg-background rounded-sm shadow-xl flex flex-col relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[oklch(0.16_0.02_250)]">
                  Best Value
                </div>
                <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Annual Membership</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-semibold tracking-tight">$1,000</span>
                  <span className="text-sm text-muted-foreground">/ aircraft / year</span>
                </div>
                <p className="text-sm text-muted-foreground mb-10 flex-1">
                  The standard for long-term owners. Two months free compared to monthly billing and priority handling.
                </p>
                <ul className="space-y-4 mb-10">
                  {["Everything in Monthly", "Two Months Free", "Priority Sourcing", "Annual Profile Review"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <ClearedIcon className="h-4 w-4 text-accent shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/enrol"
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-accent py-4 text-sm font-semibold text-[oklch(0.16_0.02_250)] hover:opacity-90 transition-opacity"
                >
                  Enrol aircraft <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <p className="mt-8 text-center text-xs text-muted-foreground">
              Each aircraft enrolled separately. Management fleets with 5+ aircraft please contact us for volume enrolment.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-3 mb-12">
            <HelpCircle className="h-6 w-6 text-accent" strokeWidth={1.5} />
            <h2 className="text-2xl font-semibold tracking-tight">Support Membership FAQ</h2>
          </div>
          
          <div className="space-y-8">
            {[
              {
                q: "Is there a per-request or per-case fee?",
                a: "No. Your subscription covers unlimited AOG requests for each enrolled aircraft. We don't believe in charging you more when you need support the most.",
              },
              {
                q: "Do you mark up the cost of the parts?",
                a: "No. We present you with the direct supplier quotes. You pay exactly what the supplier charges. Our service is paid for by your membership fee, not by parts margins.",
              },
              {
                q: "When does AOG cover become active?",
                a: "Cover becomes active once we have verified your aircraft's Tier 2 details — engine, maintenance, and insurance contacts. This typically happens within 24 hours of enrolment.",
              },
              {
                q: "Can I manage multiple aircraft?",
                a: "Yes. Each aircraft is added to your dashboard separately. You can choose different billing cycles (monthly or annual) for each tail in your fleet.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-base mb-3 tracking-tight">{faq.q}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Enrol before the AOG, not during it.
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-base text-white/60">
            It takes less than five minutes to activate your support lane and secure your aircraft's technical readiness.
          </p>
          <div className="mt-10">
            <Link
              to="/enrol"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-8 py-4 text-sm font-semibold text-[oklch(0.16_0.02_250)] hover:opacity-90 transition-opacity"
            >
              Get started now <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
