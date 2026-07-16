import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/subscriber-agreement")({
  head: () => ({
    meta: [
      { title: "Subscriber Agreement — Aircraft Program" },
      {
        name: "description",
        content:
          "The terms and conditions for Aircraft Program subscription and 24/7 AOG parts desk support.",
      },
    ],
  }),
  component: SubscriberAgreementPage,
});

function SubscriberAgreementPage() {
  return (
    <PublicLayout>
      <section className="bg-background py-16 px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <Eyebrow>Aircraft Enrolment Program</Eyebrow>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Subscriber Agreement
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: July 10, 2026</p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-foreground/80 leading-7">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Scope of Support</h2>
              <p>
                The Aircraft Program subscription provides 24/7 AOG parts sourcing intake and
                logistics coordination support for the enrolled aircraft. Sourcing services are
                activated upon verification of the aircraft profile details.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                2. Enrolment & Cover Verification
              </h2>
              <p>
                Upon payment, the subscription is active. Sourcing operations and full cover will be
                enabled immediately once the operator completes and confirms all required profile
                details online in the "Verification" panel.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Sourcing & Procurements</h2>
              <p>
                All parts sourced are subject to operator approval. Sourcing options, estimated lead
                times, and the fixed sourcing fees will be presented for approval prior to any
                purchase or dispatch.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Fees & Cancellations</h2>
              <p>
                Subscription fees are billed recurringly on a monthly or annual basis depending on
                the chosen plan. Operators may cancel the subscription at any time via the
                dashboard. Refunds for partial periods are not provided unless the aircraft is
                declined during verification.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Data Accuracy</h2>
              <p>
                The operator agrees to keep the aircraft engine details, maintenance organisation
                contact information, and Pilot in Command details accurate and up to date to ensure
                fast response times during AOG events.
              </p>
            </div>

            <div className="rounded-sm border border-border bg-card p-6 mt-12 flex items-start gap-4">
              <Lock className="h-6 w-6 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground text-sm">Secured Agreement</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-5">
                  Acceptance of this agreement is required during checkout. The agreement creates a
                  binding support relationship between the subscriber and the Aircraft Program team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
