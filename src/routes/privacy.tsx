import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Aircraft Program" },
      {
        name: "description",
        content:
          "Aircraft Program Privacy Policy. Learn how we handle your personal and aircraft data under UK GDPR.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="bg-background py-16 px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Eyebrow>Version 1.0 · Effective July 8, 2026</Eyebrow>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              This policy explains how Aircraft Program collects, uses, stores, and protects your
              personal data.
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-10 text-foreground/80 leading-7 font-sans">
            {/* Boxed introduction */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-foreground">
              <p className="text-sm leading-relaxed mb-0">
                We are committed to being transparent about how we use your data and to protecting
                your privacy rights under UK GDPR and the Data (Use and Access) Act 2025.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                1. Who We Are and How to Contact Us
              </h2>
              <p className="mb-4">
                Moon Jet Group Ltd t/a Aircraft Program ("Aircraft Program", "we", "us", "our") is
                the data controller for the personal data we process. We are registered in England
                and Wales.
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-bold text-foreground">Detail</th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">Information</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Data Controller</td>
                      <td className="px-4 py-2.5">
                        Moon Jet Group Ltd (Company No. 15121199) trading as "Aircraft Program"
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Email</td>
                      <td className="px-4 py-2.5">support@aircraftprogram.com</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Telephone</td>
                      <td className="px-4 py-2.5">+44 7402 465 194</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">
                        Registered Office
                      </td>
                      <td className="px-4 py-2.5">
                        Rmt Accountants & Business Advisors Ltd, Gosforth Park Avenue, Newcastle
                        Upon Tyne, NE12 8EG
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Data Complaints</td>
                      <td className="px-4 py-2.5">
                        support@aircraftprogram.com — we will respond within 30 days
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                2. What Personal Data We Collect
              </h2>
              <p className="mb-4">
                We collect personal data in the following categories. We only collect what we
                genuinely need to provide the service.
              </p>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">
                2.1 Data you give us directly
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-bold text-foreground">Category</th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">
                        Specific Data
                      </th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">
                        When Collected
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Identity</td>
                      <td className="px-4 py-2.5">Full name, job title, company name</td>
                      <td className="px-4 py-2.5">At enrolment or contact</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Contact details</td>
                      <td className="px-4 py-2.5">
                        Email address, telephone number, postal address
                      </td>
                      <td className="px-4 py-2.5">At enrolment or contact</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Credentials</td>
                      <td className="px-4 py-2.5">
                        Platform login email and password (stored encrypted)
                      </td>
                      <td className="px-4 py-2.5">At account creation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Aircraft data</td>
                      <td className="px-4 py-2.5">
                        Registration (tail number), type/variant, serial number, engine
                        specifications and serials, year of manufacture, home airport, airframe
                        hours, cycles, modifications or STCs
                      </td>
                      <td className="px-4 py-2.5">At enrolment and profile updates</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Maintenance</td>
                      <td className="px-4 py-2.5">
                        AMO contact details, maintenance engineer contacts, emergency phone numbers
                      </td>
                      <td className="px-4 py-2.5">At enrolment — Stage 2 verification</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Insurance</td>
                      <td className="px-4 py-2.5">
                        Hull insurance provider name and policy reference
                      </td>
                      <td className="px-4 py-2.5">At enrolment — Stage 2 verification</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">AOG case data</td>
                      <td className="px-4 py-2.5">
                        Fault description, ATA chapter, location, urgency level, part requirements,
                        supporting files
                      </td>
                      <td className="px-4 py-2.5">At case submission</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Payment data</td>
                      <td className="px-4 py-2.5">
                        Card details processed through Stripe. We do not store full card numbers
                        locally.
                      </td>
                      <td className="px-4 py-2.5">At subscription checkout</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-foreground mt-6 mb-2 text-base">
                2.2 Data we generate about you
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li>
                  <strong>Parts Passport:</strong> Sourcing history records including part numbers,
                  serials, and documentation release files.
                </li>
                <li>
                  <strong>Case records:</strong> Sourcing updates, supplier RFQs, pricing metrics,
                  and outcomes.
                </li>
                <li>
                  <strong>Platform activity:</strong> Log-in logs, download audits, and dashboard
                  interactions.
                </li>
                <li>
                  <strong>Fleet intelligence data:</strong> Anonymized and aggregated market signals
                  for aggregate planning.
                </li>
              </ul>

              <h3 className="font-semibold text-foreground mt-6 mb-2 text-base">
                2.3 Data collected automatically
              </h3>
              <p>
                When you visit our site, our infrastructure may automatically collect your IP
                address, browser type, pages visited, referring URLs, and device type. This is
                processed under the analytics exception introduced by the Data (Use and Access) Act
                2025.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                3. Why We Use Your Data and Our Legal Basis
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-bold text-foreground">Purpose</th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">Data Used</th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">
                        Lawful Basis
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">
                        AOG desk operations
                      </td>
                      <td className="px-4 py-2.5">
                        Identity, contacts, aircraft specifications, cases
                      </td>
                      <td className="px-4 py-2.5">Contract performance (Art. 6(1)(b))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">
                        Billing & payments
                      </td>
                      <td className="px-4 py-2.5">
                        Identity, contacts, billing details via Stripe
                      </td>
                      <td className="px-4 py-2.5">Contract performance (Art. 6(1)(b))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Parts Passport</td>
                      <td className="px-4 py-2.5">Aircraft details, case files, certifications</td>
                      <td className="px-4 py-2.5">Contract performance (Art. 6(1)(b))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Supplier RFQs</td>
                      <td className="px-4 py-2.5">Aircraft tail, part request specs</td>
                      <td className="px-4 py-2.5">Contract performance / Agency (Art. 6(1)(b))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">
                        Security auditing
                      </td>
                      <td className="px-4 py-2.5">IP addresses, activity logs</td>
                      <td className="px-4 py-2.5">Legitimate interests (Art. 6(1)(f))</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                4. Who We Share Your Data With
              </h2>
              <p className="mb-4">
                We share details only to the minimum extent required. We do not sell your personal
                data.
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-bold text-foreground">Recipient</th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">
                        What we share
                      </th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">Why</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Parts Suppliers</td>
                      <td className="px-4 py-2.5">
                        Aircraft registration, engine type, part details, airport location
                      </td>
                      <td className="px-4 py-2.5">To source parts as your disclosed agent</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Stripe</td>
                      <td className="px-4 py-2.5">Transaction metadata</td>
                      <td className="px-4 py-2.5">Secure payment processing</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">
                        Freight providers
                      </td>
                      <td className="px-4 py-2.5">Delivery address, part weight/dims</td>
                      <td className="px-4 py-2.5">Logistics & shipping dispatch</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-foreground mt-6 mb-2 text-base">
                4.1 International Data Transfers
              </h3>
              <p>
                When sourcing parts globally (particularly from the US), this may constitute a
                transfer of data to a third country. We manage this via the UK International Data
                Transfer Agreement (IDTA) and the UK-US data bridge arrangement.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                5. How Long We Keep Your Data
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-bold text-foreground">Data Type</th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">
                        Retention Period
                      </th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">
                        Account & Identity
                      </td>
                      <td className="px-4 py-2.5">7 years from end of subscription</td>
                      <td className="px-4 py-2.5">UK tax and statutory record-keeping</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">
                        Aircraft profiles
                      </td>
                      <td className="px-4 py-2.5">7 years from end of subscription</td>
                      <td className="px-4 py-2.5">Financial and verification audits</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">AOG Case files</td>
                      <td className="px-4 py-2.5">7 years from date of case closure</td>
                      <td className="px-4 py-2.5">Limitation period for potential claims</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Parts Passport</td>
                      <td className="px-4 py-2.5">12 months after subscription ends</td>
                      <td className="px-4 py-2.5">Airworthiness trace availability</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                6. Your Rights Under UK GDPR
              </h2>
              <p className="mb-4">
                You have the right to request access to, rectification of, or erasure of your
                personal data. You can also request data portability.
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-bold text-foreground">Your Right</th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">
                        What it means
                      </th>
                      <th className="px-4 py-2 text-left font-bold text-foreground">
                        How to exercise it
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">Right of Access</td>
                      <td className="px-4 py-2.5">
                        Receive a copy of the data we hold (Subject Access Request)
                      </td>
                      <td className="px-4 py-2.5">
                        Email support@aircraftprogram.com with "Subject Access Request"
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">
                        Right to Rectify
                      </td>
                      <td className="px-4 py-2.5">Request corrections to inaccurate records</td>
                      <td className="px-4 py-2.5">Edit inside your profile or email us</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-semibold text-foreground">
                        Right to Erasure
                      </td>
                      <td className="px-4 py-2.5">
                        Ask us to delete your data (subject to legal retentions)
                      </td>
                      <td className="px-4 py-2.5">Email support@aircraftprogram.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-foreground mt-6 mb-2 text-base">
                6.1 Data Protection Complaints
              </h3>
              <p>
                From 19 June 2026, under the Data (Use and Access) Act 2025, you may submit a formal
                complaint by emailing support@aircraftprogram.com with the subject line{" "}
                <strong>"Data Protection Complaint"</strong>. We will acknowledge within 5 working
                days and respond substantively within 30 days. You also maintain the right to
                complain to the ICO (ico.org.uk).
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                7. How We Protect Your Data
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Encryption in transit:</strong> All data is encrypted using TLS (HTTPS).
                </li>
                <li>
                  <strong>Encryption at rest:</strong> Databases are encrypted on our platform
                  infrastructure.
                </li>
                <li>
                  <strong>Access controls:</strong> Restricting access to authorized operations
                  controllers only.
                </li>
                <li>
                  <strong>Stripe processing:</strong> Payment card details are handled entirely by
                  Stripe (PCI DSS Level 1).
                </li>
              </ul>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                8. Cookies and Website Technologies
              </h2>
              <p className="mb-2">In line with ICO guidance, we operate cookies as follows:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Strictly Necessary:</strong> Session management and security. Cannot be
                  turned off.
                </li>
                <li>
                  <strong>Analytics:</strong> Aggregate, non-identifying traffic patterns under the
                  Data (Use and Access) Act 2025 exception.
                </li>
                <li>
                  <strong>Preference:</strong> Remembering your UI theme and selections.
                </li>
              </ul>
            </div>

            {/* Section 9-12 */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
                9. General Provisions
              </h2>
              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">
                9.1 Children's Data
              </h3>
              <p className="mb-4">
                We do not knowingly collect personal data from children under the age of 18.
              </p>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">
                9.2 Policy Changes
              </h3>
              <p className="mb-4">
                We will notify subscribers of any material changes to this policy by email at least
                30 days before they take effect.
              </p>

              <h3 className="font-semibold text-foreground mt-4 mb-2 text-base">
                9.3 Contact Information
              </h3>
              <p>
                For any privacy-related queries, email support@aircraftprogram.com or call +44 7402
                465 194.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
