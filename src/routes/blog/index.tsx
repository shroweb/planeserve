import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { ArrowRightIcon } from "@/components/app/PlaneServeIcons";
import { ClipboardList, Clock, Wrench } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "AOG Insights — Aircraft Program Blog" },
      {
        name: "description",
        content:
          "Practical AOG guidance for aircraft owners and operators: definitions, downtime cost breakdowns, response checklists, and parts sourcing insight from the Aircraft Program desk.",
      },
      {
        property: "og:title",
        content: "AOG Insights — Aircraft Program Blog",
      },
      {
        property: "og:description",
        content:
          "Practical AOG guidance for aircraft owners and operators: definitions, downtime cost breakdowns, response checklists, and parts sourcing insight from the Aircraft Program desk.",
      },
      { property: "og:url", content: "https://www.aircraftprogram.com/blog" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BlogIndexPage,
});

const posts = [
  {
    to: "/blog/what-does-aog-mean-in-aviation",
    Icon: Wrench,
    title: "What Does AOG Mean in Aviation? Definition & True Downtime Costs",
    description:
      "Learn what AOG (Aircraft On Ground) means in aviation. Explore immediate operational costs, common causes, emergency MRO logistics, and compliance risks.",
    date: "19 October 2026",
  },
  {
    to: "/blog/aog-response-checklist",
    Icon: ClipboardList,
    title: "Aircraft AOG Response Checklist — What to Do When Grounded Off-Base",
    description:
      "A step-by-step AOG response checklist for flight crews: cockpit fault logging, MEL deferral, AMO triage, parts sourcing, expedited logistics, and customs clearance.",
    date: "19 October 2026",
  },
  {
    to: "/blog/retained-aog-procurement",
    Icon: Clock,
    title: "AOG Request: Why Retained Procurement Beats 2:00 AM Scrambling",
    description:
      "See how pre-enrolled aircraft information, pre-authorization, and a 24/7 AOG desk can help operators manage urgent aircraft parts procurement.",
    date: "27 October 2026",
  },
];

function BlogIndexPage() {
  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="brand-dark bg-[#001b2e] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Eyebrow>AOG Insights</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            Guidance from the <span className="text-accent">AOG desk.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
            Practical, operational writing for owners and operators — what AOG really costs, how
            to respond when an aircraft is grounded off-base, and how to keep parts and paperwork
            moving.
          </p>
        </div>
      </section>

      {/* ── Article list ──────────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => {
              const Icon = post.Icon;
              return (
                <Link
                  key={post.to}
                  to={post.to}
                  className="group flex flex-col p-8 border border-border bg-background rounded-sm hover:border-accent/40 hover:shadow-sm transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 border border-accent/20 mb-6">
                    <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {post.date}
                  </div>
                  <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground flex-1">
                    {post.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Read article
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="brand-dark bg-[#041c2c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Reading about AOG is better than living it.
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-base text-white/60">
            Enrol your aircraft and put a 24/7 parts desk, verified traceability, and a complete
            aircraft record in place before the request arrives.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/enrol"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-white hover:bg-white/90 text-[#001b2e] px-8 py-4 text-sm font-semibold transition-colors shadow-sm"
            >
              Enrol Aircraft <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:bg-white/5"
            >
              Contact the desk
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
