import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArticleBullet as Bullet,
  ArticleLayout,
  ArticleSection as Section,
} from "@/components/site/ArticleLayout";
import { getPost } from "@/lib/blog-posts";
import { pageHead } from "@/lib/seo";

const post = getPost("easa-form-1-vs-faa-8130-3")!;

export const Route = createFileRoute("/blog/easa-form-1-vs-faa-8130-3")({
  head: () =>
    pageHead({
      title: "EASA Form 1 vs FAA 8130-3 vs UK CAA Form 1 Explained",
      description: post.description,
      path: `/blog/${post.slug}`,
      type: "article",
      published: post.published,
    }),
  component: ReleaseCertificates,
});

function ReleaseCertificates() {
  return (
    <ArticleLayout
      slug={post.slug}
      eyebrow="Airworthiness · Traceability Guide"
      title="EASA Form 1 vs FAA 8130-3 vs UK CAA Form 1:"
      accent="Release Certificates Explained"
      intro={
        <>
          A part that is physically right can still be unusable if its paperwork is wrong. This
          guide explains what <strong className="font-semibold text-white">EASA Form 1</strong>,{" "}
          <strong className="font-semibold text-white">FAA 8130-3</strong> and{" "}
          <strong className="font-semibold text-white">UK CAA Form 1</strong> each certify, and how
          dual release fits in.
        </>
      }
      readTime="7 min read"
      audience="Directors of maintenance, CAMOs & buyers"
    >
      <Section title="What a release certificate actually says">
        <p>
          An authorised release certificate is the document that tells a maintenance organisation
          what has been done to a part, who did it and under which approval. It is the link between
          a component and the airworthiness system that allows it to be fitted.
        </p>
        <p>
          The three forms below do the same job under different authorities. Which one your
          aircraft's regulator accepts depends on its register and your maintenance organisation's
          approvals. Always confirm with your CAMO or quality manager before purchase.
        </p>
      </Section>

      <Section title="The three forms">
        <Bullet
          title="FAA Form 8130-3."
          body="The FAA's Authorized Release Certificate (Airworthiness Approval Tag). It is issued by the FAA or by an authorised organisation, for example a production approval holder or a certificated repair station, for new, overhauled or repaired parts."
        />
        <Bullet
          title="EASA Form 1."
          body="The EASA Authorised Release Certificate. Part 21 production organisations use it for new parts, and Part-145 maintenance organisations use it to certify maintenance, repair or overhaul."
        />
        <Bullet
          title="UK CAA Form 1."
          body="The UK's equivalent, introduced after the UK left the EASA system. Whether a part released on a different authority's form is accepted on a UK-registered aircraft depends on current UK rules, so verify before you buy."
        />
      </Section>

      <Section title="Dual release">
        <p>
          Some organisations hold approvals under both the FAA and EASA systems and can issue a
          single certificate that carries both releases. For an operator running aircraft on
          different registers, or a part that may move between them, dual release removes a second
          round of paperwork.
        </p>
        <p>
          Do not assume a dual release exists. Ask for it at the quote stage, and confirm that the
          release statement matches the work performed.
        </p>
      </Section>

      <Section title="Trace documents that travel with the form">
        <Bullet
          title="Non-incident statement."
          body="A declaration that a used part has not been involved in an accident or serious incident, fire or similar exposure. Many operators require it for pre-owned components."
        />
        <Bullet
          title="Back-to-birth trace."
          body="A documented history from manufacture. It is expected for life-limited parts, where cycles and hours must be provable."
        />
        <Bullet
          title="Certificate of conformity"
          body="for new parts and materials, where the supplier confirms the product meets its specification."
        />
      </Section>

      <Section title="Red flags that cause a part to be rejected">
        <Bullet body="Part number, serial number or description on the form does not match the part." />
        <Bullet body="Block 12 or remarks do not describe the work or state a return-to-service basis." />
        <Bullet body="No signature, stamp, approval number or date, or the approval does not cover the part." />
        <Bullet body="Used part without a non-incident statement or with gaps in its history." />
        <Bullet body="A photocopy where the operator's procedures require an original or verified copy." />
        <p>
          Each of these can turn a located part into a second AOG delay at the ramp. Checking them
          before dispatch is cheaper than checking them on arrival.
        </p>
      </Section>

      <Section title="How Aircraft Program handles it">
        <p>
          Documentation is verified before a part is dispatched, and the release and trace records
          are filed to your aircraft's Parts Passport so they are available for audits and future
          sales. See the{" "}
          <Link to="/parts-passport" className="font-semibold text-accent hover:underline">
            Parts Passport
          </Link>{" "}
          or the{" "}
          <Link to="/parts-sourcing" className="font-semibold text-accent hover:underline">
            parts sourcing desk
          </Link>
          .
        </p>
      </Section>
    </ArticleLayout>
  );
}
