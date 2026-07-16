import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";

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
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Eyebrow>Version 2.0 · Effective July 8, 2026</Eyebrow>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Terms & Conditions of Service
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              These Terms govern the subscription and parts procurement services.
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-10 text-foreground/80 leading-7 font-sans">
            {/* Boxed acceptance */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-foreground">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">
                Acceptance of Terms
              </h2>
              <p className="text-sm leading-relaxed">
                By paying your Aircraft Program subscription fee, activating your account, or using
                the Aircraft Program service in any way, you agree to be bound by these Terms and
                Conditions in full. If you do not agree, do not proceed with payment or activation.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                1. Who We Are
              </h2>
              <p className="mb-3">
                Aircraft Program is a trading name of <strong>Moon Jet Group Ltd</strong> (Company
                No. 15121199), registered address: Rmt Accountants & Business Advisors Ltd, Gosforth
                Park Avenue, Newcastle Upon Tyne, United Kingdom, NE12 8EG. When these Terms refer
                to "Aircraft Program", "we", "us", or "our", they mean Moon Jet Group Ltd trading as
                Aircraft Program.
              </p>
              <p>
                When these Terms refer to "you" or "your", they mean the individual or entity who
                has subscribed to the Aircraft Program service and enrolled an aircraft.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                2. What Aircraft Program Does
              </h2>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">2.1 The Service</h3>
              <p className="mb-4">
                Aircraft Program provides a specialist AOG (Aircraft on Ground) parts sourcing and
                procurement service for operators of independent and legacy business aircraft. When
                your aircraft goes unserviceable due to a technical defect or part failure, the
                Aircraft Program desk finds the part you need, coordinates the documentation, and
                arranges delivery — so you can focus on your passengers and your operation.
              </p>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">
                2.2 What We Are Not
              </h3>
              <div className="rounded border border-red-500/20 bg-red-500/5 p-4 mb-4 text-red-700 dark:text-red-400">
                Aircraft Program is not a parts dealer, maintenance organisation, or airworthiness
                authority. We do not hold aircraft parts inventory. We do not perform maintenance.
                We do not certify any part as airworthy. We do not release aircraft to service. Your
                approved maintenance organisation (AMO) and their licensed engineer do all of that.
              </div>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">
                2.3 We Act as Your Agent — This is Important
              </h3>
              <p className="mb-2">
                When Aircraft Program finds a part for you, we are acting as your disclosed
                procurement agent. That means:
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  The contract to buy the part is between you and the supplier — not between
                  Aircraft Program and the supplier.
                </li>
                <li>
                  Aircraft Program arranges the purchase on your behalf and charges a procurement
                  fee for doing so.
                </li>
                <li>
                  That fee is included in the all-in price we present to you. It is not shown
                  separately.
                </li>
                <li>
                  You expressly authorise Aircraft Program to negotiate, procure, and coordinate
                  logistics on your behalf when you submit an AOG case.
                </li>
              </ul>
              <p className="italic">
                This structure means Aircraft Program's liability is that of a professional agent —
                responsible for the quality of our sourcing service — not that of a parts seller.
              </p>

              <h3 className="font-semibold text-foreground mt-6 mb-2 text-base">
                2.4 What the Service Includes
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-bold text-foreground">Service</th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">24/7 AOG Desk</td>
                      <td className="px-4 py-2.5">
                        Access to the Aircraft Program desk by telephone (+44 7402 465 194), email
                        (support@aircraftprogram.com), and the platform. Operates 24/7.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Active Sourcing</td>
                      <td className="px-4 py-2.5">
                        We search our approved supplier network and the wider USM market for the
                        part you need.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Doc Review</td>
                      <td className="px-4 py-2.5">
                        We confirm the release document type (EASA Form 1, FAA 8130-3, UK CAA Form
                        1, etc.) before presenting options.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Logistics</td>
                      <td className="px-4 py-2.5">
                        We arrange freight, shipping, and customs documentation.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Parts Passport</td>
                      <td className="px-4 py-2.5">
                        Every part we source is logged to your Parts Passport — a verified
                        provenance record.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-foreground mt-6 mb-2 text-base">
                2.5 Sourcing Guarantees
              </h3>
              <p>
                We will do everything commercially reasonable to find the part you need. But we
                cannot guarantee that a part exists in the market, that it will arrive within any
                specific time, or that it will be available at all. The USM market for legacy
                aircraft can be severely constrained. We will always tell you honestly if we cannot
                find what you need.
              </p>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">
                2.6 Service Activation
              </h3>
              <p>
                Cover becomes active upon enrolment in two stages. Stage 1 activates immediately on
                receipt of your first subscription payment and gives you immediate access to the
                desk and platform. Stage 2 activates within 24 hours of enrolment, once we have
                verified your aircraft's details (engine type, AMO, contact info).
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                3. Pricing and Payment
              </h2>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">
                3.1 Your Subscription
              </h3>
              <p className="mb-3">
                The Aircraft Program subscription fee is USD $100.00 per aircraft per month or USD
                $1,000.00 per aircraft per year. Both plans provide identical service and access.
                Rates are fixed for the life of your subscription.
              </p>
              <p className="mb-3">
                <strong>Monthly:</strong> Billed on the same date each month. Cancel at any time
                with 30 days' notice. No mid-term refunds.
              </p>
              <p className="mb-4">
                <strong>Annual:</strong> Billed once per year. Cancel with 30 days' notice before
                your annual renewal date.
              </p>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">
                3.2 Parts Procurement
              </h3>
              <p className="mb-4">
                When we source a part, the price we present includes our procurement fee. You will
                see the complete total before you approve anything. No hidden charges are added
                after you approve.
              </p>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">
                3.3 You Pay Before We Order
              </h3>
              <div className="rounded border border-amber-500/20 bg-amber-500/5 p-4 mb-4 text-amber-800 dark:text-amber-300">
                <strong>Important:</strong> We will not place an order with any supplier until your
                payment has cleared. Saying "yes, go ahead" is not enough — we need cleared funds
                before we commit to a supplier.
              </div>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">
                3.4 Core Charges & Taxes
              </h3>
              <p className="mb-2">
                If a core charge applies (returning the old unit), we will notify you before you
                approve the purchase. Core credits are passed back to you in full within 14 days of
                our receipt of the core.
              </p>
              <p>
                Import duties, VAT, customs fees, and local taxes are your responsibility unless
                explicitly stated otherwise.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                4. Your Responsibilities
              </h2>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">4.1 Your AMO</h3>
              <p className="mb-3">
                You must maintain a licensed Approved Maintenance Organisation (AMO) at all times.
                Your AMO and their engineer are solely responsible for:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li>Checking the part is correct for your specific installation.</li>
                <li>Verifying and authenticating the release documentation.</li>
                <li>Installing the part in accordance with approved maintenance data.</li>
                <li>Certifying the work and releasing your aircraft to service.</li>
              </ul>
              <p className="italic">
                Aircraft Program's documentation review is a desk check, not an airworthiness
                certification.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                5. Our Liability to You
              </h2>
              <p className="mb-3">
                We are responsible for the quality of our sourcing service — the diligence of how we
                select suppliers, how we review documentation, and how we run the desk. We are not
                responsible for part quality, airworthiness, installation damage, or loss of revenue
                during AOG events.
              </p>
              <p>
                Our total liability to you for any claim arising from these Terms is capped at the
                greater of the total subscription fees paid by you in the preceding 12 months, or
                the specific case procurement fee.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                6. Parts Passport and Documentation
              </h2>
              <p className="mb-3">
                Before presenting any option, we check documentation for apparent completeness.
                Release documents depend on aircraft registration (e.g. FAA Form 8130-3 for
                N-registered).
              </p>
              <p>
                Every sourced part is logged to your <strong>Parts Passport</strong>, creating a
                verified provenance record. You can view, download, and share this passport at any
                time. It remains accessible for 12 months after your subscription ends.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                7. Confidentiality & Supplier Network
              </h2>
              <p>
                Our supplier relationships are confidential. By subscribing, you agree not to
                contact, engage, or transact directly with any supplier introduced to you by
                Aircraft Program outside of the service, nor disclose supplier identities or net
                costs to third parties. This obligation lasts for two years after your subscription
                ends.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                8. Term and Cancellation
              </h2>
              <p>
                Your subscription starts on the date your first payment clears. It renews
                automatically. Cancel by emailing support@aircraftprogram.com or via the dashboard
                platform. If you cancel, your access ceases at the end of the billing period.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                9. Governing Law
              </h2>
              <p>
                These Terms are governed by the laws of England and Wales. Any dispute that cannot
                be resolved by negotiation will be referred to mediation through CEDR before either
                party may bring legal proceedings.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                10. Definitions
              </h2>
              <ul className="space-y-3">
                <li>
                  <strong>"AMO":</strong> Your approved maintenance organisation licensed to
                  maintain and certify your aircraft.
                </li>
                <li>
                  <strong>"AOG / AOG Event":</strong> Aircraft on Ground — where your aircraft
                  cannot fly due to a technical defect or part failure.
                </li>
                <li>
                  <strong>"Case":</strong> A single AOG Event submitted to the Aircraft Program
                  desk.
                </li>
                <li>
                  <strong>"Parts Passport":</strong> The Aircraft Program-maintained provenance
                  record for every part sourced.
                </li>
              </ul>
            </div>

            {/* Plain English Summary */}
            <div className="rounded-lg border border-border bg-muted/40 p-6 mt-12">
              <h3 className="font-bold text-foreground mb-4 text-base">Plain English Summary</h3>
              <div className="space-y-4 text-sm leading-relaxed">
                <div>
                  <strong>What Aircraft Program does:</strong> We act as your procurement agent to
                  find parts when you go AOG. We search suppliers, coordinate
                  documentation/shipping, and present an all-in price to approve.
                </div>
                <div>
                  <strong>What we don't do:</strong> We don't sell parts, hold stock, do
                  maintenance, or certify airworthiness. Your AMO does the installation and sign
                  off.
                </div>
                <div>
                  <strong>When you pay for a part:</strong> Before we order it. We don't commit to a
                  supplier until your money has cleared.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
