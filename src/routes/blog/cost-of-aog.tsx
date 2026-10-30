import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArticleBullet as Bullet,
  ArticleLayout,
  ArticleSection as Section,
} from "@/components/site/ArticleLayout";
import { getPost } from "@/lib/blog-posts";
import { pageHead } from "@/lib/seo";

const post = getPost("cost-of-aog")!;

export const Route = createFileRoute("/blog/cost-of-aog")({
  head: () =>
    pageHead({
      title: "Cost of AOG: What an Hour on the Ground Costs a Business Jet",
      description: post.description,
      path: `/blog/${post.slug}`,
      type: "article",
      published: post.published,
    }),
  component: CostOfAog,
});

function CostOfAog() {
  return (
    <ArticleLayout
      slug={post.slug}
      eyebrow="AOG Economics · Owner & CFO Guide"
      title="The Cost of AOG:"
      accent="What an Hour on the Ground Really Costs"
      intro={
        <>
          The <strong className="font-semibold text-white">cost of AOG</strong> is rarely the part
          invoice. For a business jet, the bigger numbers sit around the part: replacement flights,
          crew expenses, rush freight and the commitments that quietly slip while an aircraft waits
          on the ramp.
        </>
      }
      readTime="6 min read"
      audience="Owners, CFOs & flight department managers"
    >
      <Section title="Why AOG cost is hard to see in advance">
        <p>
          Aircraft downtime cost is not a single line item. Some of it arrives as invoices, some as
          cancelled trips, and some as goodwill that never shows up in the accounts. Because it is
          spread across several budgets, operators often underestimate it until an aircraft is
          actually grounded.
        </p>
        <p>
          Figures vary widely by aircraft type, location and how a trip is chartered or managed.
          This article gives a way to structure the costs so you can put your own numbers to them,
          rather than a one-size benchmark.
        </p>
      </Section>

      <Section title="Direct costs: what arrives as an invoice">
        <Bullet
          title="The part itself."
          body="Urgent availability often means a different price from a scheduled purchase, particularly for rotables sold on an exchange or loan basis."
        />
        <Bullet
          title="Expedited freight."
          body="Next flight out, an onboard courier or a dedicated charter all cost more than standard freight. Our guide to AOG logistics compares the options."
        />
        <Bullet
          title="Labour and call-outs."
          body="Mobile repair team attendance, out-of-hours rates and line maintenance at an unfamiliar station."
        />
        <Bullet
          title="Handling, parking and hangarage"
          body="at the airport where the aircraft is stuck."
        />
      </Section>

      <Section title="Indirect costs: where the real money goes">
        <Bullet
          title="Replacement lift."
          body="If a trip must still happen, a sub-charter or airline tickets for passengers often exceed every direct cost above."
        />
        <Bullet
          title="Crew costs."
          body="Hotels, per diems, repositioning and, in some operations, crew duty limits that force a rest period before the aircraft can leave."
        />
        <Bullet
          title="Missed commitments."
          body="Charter operators may owe penalties or lose the booking. Private owners lose the meeting, the event or the holiday day."
        />
        <Bullet
          title="Secondary delays."
          body="A part that arrives with the wrong or incomplete release paperwork can mean a second wait, as covered in our release certificates explainer."
        />
      </Section>

      <Section title="A simple way to model one incident">
        <p>
          Start with the number of days the aircraft is unavailable, then add each category. The
          example below uses round, illustrative numbers only. Replace them with your own.
        </p>
        <div className="overflow-x-auto rounded-sm border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Cost category</th>
                <th className="px-4 py-3">How to estimate it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Part and exchange fees", "Quoted price plus any core or loan terms"],
                ["Freight", "NFO, courier or charter quote to the aircraft's location"],
                [
                  "Replacement flights",
                  "Sectors flown by another aircraft or airline x cost per sector",
                ],
                ["Crew", "Nights x (hotel + per diem) x crew size"],
                ["Commitments", "Penalties, refunds and rebooking fees"],
              ].map(([a, b]) => (
                <tr key={a}>
                  <td className="px-4 py-3 font-medium text-foreground">{a}</td>
                  <td className="px-4 py-3">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Dividing the total by hours of lost availability gives your own cost of an AOG hour. Run
          the model for your typical trip profile, not an average month.
        </p>
      </Section>

      <Section title="Where retained AOG support changes the maths">
        <p>
          Retained support does not remove the cost of a failed component. It targets the time
          between grounding and a verified part being on its way, because every hour removed from
          that window is an hour of the indirect costs avoided.
        </p>
        <p>
          With aircraft details, contacts and approval limits already on file, the first call starts
          at the problem rather than the paperwork. Read how that works in{" "}
          <Link
            to="/blog/retained-aog-procurement"
            className="font-semibold text-accent hover:underline"
          >
            retained AOG procurement
          </Link>{" "}
          and compare plans on the{" "}
          <Link to="/pricing" className="font-semibold text-accent hover:underline">
            pricing page
          </Link>
          .
        </p>
      </Section>
    </ArticleLayout>
  );
}
