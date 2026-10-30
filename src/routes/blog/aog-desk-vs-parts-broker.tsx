import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArticleBullet as Bullet,
  ArticleLayout,
  ArticleSection as Section,
} from "@/components/site/ArticleLayout";
import { getPost } from "@/lib/blog-posts";
import { pageHead } from "@/lib/seo";

const post = getPost("aog-desk-vs-parts-broker")!;

export const Route = createFileRoute("/blog/aog-desk-vs-parts-broker")({
  head: () =>
    pageHead({
      title: "AOG Desk vs Parts Broker: The Disclosed Agency Model",
      description: post.description,
      path: `/blog/${post.slug}`,
      type: "article",
      published: post.published,
    }),
  component: DeskVsBroker,
});

function DeskVsBroker() {
  return (
    <ArticleLayout
      slug={post.slug}
      eyebrow="Procurement Models · Industry Explainer"
      title="AOG Desk vs Parts Broker:"
      accent="The Disclosed Agency Model Explained"
      intro={
        <>
          When an aircraft is grounded, an{" "}
          <strong className="font-semibold text-white">AOG broker</strong> and an AOG desk can look
          identical from the outside. They are paid differently, and that changes what you can see
          and what they are motivated to do.
        </>
      }
      readTime="5 min read"
      audience="Owners, CFOs & directors of maintenance"
    >
      <Section title="How a traditional parts broker works">
        <p>
          A broker typically buys a part and sells it on, earning the difference. The supplier is
          often not named, and the price reflects the broker's margin, which you cannot see. This
          model can be fast and effective, and many operators use it successfully.
        </p>
        <p>
          The trade-off is visibility. You may not know who holds the part, what it cost the broker,
          or whether a better option was passed over.
        </p>
      </Section>

      <Section title="How a disclosed agent works">
        <p>
          A disclosed agent acts on your behalf. It identifies the supplier, passes on the
          supplier's price and charges a fee that is stated up front. You approve the purchase with
          the facts in front of you.
        </p>
        <p>
          At Aircraft Program, enrolled aircraft pay a monthly or annual retainer with no handling
          fees, and one-off requests carry a handling fee in addition to part cost and sourcing
          commission. Fees are shown on the{" "}
          <Link to="/pricing" className="font-semibold text-accent hover:underline">
            pricing page
          </Link>{" "}
          and in the{" "}
          <Link to="/parts-sourcing" className="font-semibold text-accent hover:underline">
            parts sourcing FAQ
          </Link>
          .
        </p>
      </Section>

      <Section title="Questions to ask any AOG provider">
        <Bullet body="Will you name the supplier before I approve the purchase?" />
        <Bullet body="How are you paid: margin on the part, a fee, or both?" />
        <Bullet body="What release certificates and trace documents will I receive, and when?" />
        <Bullet body="Who is accountable if the part arrives with incorrect paperwork?" />
        <Bullet body="What do you need from me before an incident so you can act quickly?" />
      </Section>

      <Section title="Which is right for you?">
        <p>
          For a one-off, low-value need, an open-market broker can be entirely sensible. For an
          aircraft where downtime is costly and documentation matters, an agent with your aircraft
          profile already on file removes unknowns. Our guide to{" "}
          <Link
            to="/blog/retained-aog-procurement"
            className="font-semibold text-accent hover:underline"
          >
            retained AOG procurement
          </Link>{" "}
          explains how that preparation works in practice.
        </p>
      </Section>
    </ArticleLayout>
  );
}
