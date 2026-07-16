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
          "Aircraft Program Privacy Policy. Learn how we handle your personal and aircraft data.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="bg-background py-16 px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <Eyebrow>Data Protection</Eyebrow>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: July 16, 2026</p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-foreground/80 leading-7 font-sans">
            <p>
              At Aircraft Program, operated by Moon Jet Group Ltd, we take the security and privacy
              of your data seriously. This Privacy Policy describes how we collect, use, and protect
              personal and aircraft-related information when you use our platform and AOG sourcing
              services.
            </p>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
              <p className="mb-2">
                We collect information to provide and improve our services, including:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Account details:</strong> Name, email address, mobile number, company, and
                  physical address.
                </li>
                <li>
                  <strong>Aircraft information:</strong> Registration (tail number), make, model,
                  category, serial number, year of manufacture, base airport, and airframe hours.
                </li>
                <li>
                  <strong>Technical details:</strong> Engine and propeller manufacturer, serial
                  numbers, APU specifications, and maintenance organization details.
                </li>
                <li>
                  <strong>AOG Cases:</strong> Part numbers requested, descriptions of defects, and
                  location of the aircraft.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                2. How We Use Your Information
              </h2>
              <p className="mb-2">We use the collected data for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  To perform our sourcing service and coordinate part logistics with third-party
                  suppliers.
                </li>
                <li>To maintain your aircraft's Parts Passport provenance records.</li>
                <li>To send transactional updates, critical alerts, and team invitations.</li>
                <li>To process payments securely through our billing provider, Stripe.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                3. Data Sharing and Transfer
              </h2>
              <p>
                We only share necessary aircraft specification data (such as part numbers, engine
                types, and delivery locations) with our approved parts supplier network to obtain
                quotes. We do not sell your personal or corporate data to third parties.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Security</h2>
              <p>
                We employ industry-standard administrative, physical, and technical measures to
                safeguard your information from unauthorized access, loss, or alteration. All
                database transfers use SSL/TLS encryption.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Your Rights</h2>
              <p>
                You have the right to access, correct, or request the deletion of your personal
                data. You can perform most updates directly within your dashboard or by contacting
                us at support@aircraftprogram.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
