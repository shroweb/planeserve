import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArticleBullet as Bullet,
  ArticleLayout,
  ArticleSection as Section,
} from "@/components/site/ArticleLayout";
import { getPost } from "@/lib/blog-posts";
import { pageHead } from "@/lib/seo";

const post = getPost("aog-logistics")!;

export const Route = createFileRoute("/blog/aog-logistics")({
  head: () =>
    pageHead({
      title: "AOG Logistics: Onboard Courier, NFO & Charter Dispatch",
      description: post.description,
      path: `/blog/${post.slug}`,
      type: "article",
      published: post.published,
    }),
  component: AogLogistics,
});

function AogLogistics() {
  return (
    <ArticleLayout
      slug={post.slug}
      eyebrow="Logistics · AOG Playbook"
      title="AOG Logistics:"
      accent="Onboard Courier, Next Flight Out and Charter Dispatch"
      intro={
        <>
          Finding the part is half the job.{" "}
          <strong className="font-semibold text-white">AOG logistics</strong> is getting it, with
          the right paperwork, to the aircraft before the cost of waiting outweighs the cost of
          moving it faster.
        </>
      }
      readTime="6 min read"
      audience="Maintenance controllers & logistics coordinators"
    >
      <Section title="The three main ways an AOG part moves">
        <Bullet
          title="Next flight out (NFO)."
          body="The part travels as priority cargo on the next suitable scheduled flight. It is usually the least expensive expedited option, but it depends on airline schedules, cut-off times and routing."
        />
        <Bullet
          title="Onboard courier (OBC)."
          body="A person hand-carries the part on a scheduled flight and stays with it through transfers and customs. It costs more than NFO and reduces the risk of a part sitting unattended in a cargo shed."
        />
        <Bullet
          title="Dedicated charter."
          body="An aircraft is chartered solely to carry the part. It is the fastest and most expensive choice, and can be sensible when the cost of each day on the ground is higher."
        />
      </Section>

      <Section title="How to choose">
        <p>Four questions usually settle it:</p>
        <Bullet body="How long until the next suitable scheduled flight, including cut-off times for the cargo build?" />
        <Bullet body="How valuable and fragile is the component, and is a person needed to protect it?" />
        <Bullet body="What is the cost per day of the aircraft staying grounded, using the model in our cost of AOG guide?" />
        <Bullet body="Are there customs, export licence or dangerous goods steps that a dedicated flight might shorten?" />
      </Section>

      <Section title="Customs, dangerous goods and ramp access">
        <p>
          Cross-border moves add paperwork that has to be ready before the part lands. Temporary
          import arrangements, commercial invoices and correct commodity descriptions help avoid
          holds at the border. Rules vary by country, so involve a forwarder who handles aviation
          shipments.
        </p>
        <p>
          Batteries, fluids and other regulated items fall under dangerous goods rules, which can
          limit which carriers and routes are available. Plan for them early. Finally, arrange
          airside access with the handler so the part reaches the engineers directly, not the
          terminal.
        </p>
      </Section>

      <Section title="Documents travel with the part">
        <p>
          Whichever route is used, release certificates and trace documents should travel with the
          part and be checked by the receiving engineer. See{" "}
          <Link
            to="/blog/easa-form-1-vs-faa-8130-3"
            className="font-semibold text-accent hover:underline"
          >
            EASA Form 1 vs FAA 8130-3
          </Link>{" "}
          for what to check.
        </p>
        <p>
          Our AOG desk coordinates sourcing, documentation and dispatch together. Learn more about
          the{" "}
          <Link to="/aog" className="font-semibold text-accent hover:underline">
            AOG service
          </Link>
          .
        </p>
      </Section>
    </ArticleLayout>
  );
}
