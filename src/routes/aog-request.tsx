import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { PartRequestForm } from "@/components/site/PartRequestForm";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/aog-request")({
  head: () =>
    pageHead({
      title: "AOG Request: Submit to the 24/7 AOG Desk",
      description:
        "Submit an AOG request for a grounded business aircraft. Send the part number, aircraft and delivery location to the Aircraft Program 24/7 AOG desk.",
      path: "/aog-request",
    }),
  component: AogRequestPage,
});

function AogRequestPage() {
  return (
    <PublicLayout>
      <section className="brand-dark bg-[#001b2e] text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
          <Eyebrow>AOG Request</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            Submit an AOG request
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70">
            Tell the 24/7 AOG desk what the aircraft needs and where it is. We cross-reference
            supplier inventory and come back with options for your approval. Enrolled aircraft can
            raise requests from the{" "}
            <Link to="/login" className="font-semibold text-white underline">
              dashboard
            </Link>
            .
          </p>
        </div>
      </section>
      <PartRequestForm
        label="AOG"
        eyebrow="24/7 AOG Desk"
        heading="Tell us what the aircraft needs"
        intro="Include the part number if you have it. If not, describe the fault in the notes and our desk will help identify the component."
        submitLabel="Submit AOG request"
      />
      <section className="bg-muted/20">
        <div className="mx-auto max-w-4xl px-6 py-12 text-center text-sm text-muted-foreground">
          Want this ready before you are grounded?{" "}
          <Link to="/enrol" className="font-semibold text-accent hover:underline">
            Enrol your aircraft
          </Link>{" "}
          or read how the{" "}
          <Link to="/aog" className="font-semibold text-accent hover:underline">
            AOG service
          </Link>{" "}
          works.
        </div>
      </section>
    </PublicLayout>
  );
}
