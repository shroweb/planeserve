import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import {
  ArrowRightIcon,
  ClearedIcon,
  GlobeIcon,
  NetworkIcon,
  SlaIcon,
} from "@/components/app/PlaneServeIcons";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PlaneServe — Founded by James Moon" },
      {
        name: "description",
        content:
          "The story behind PlaneServe, founded by aviation entrepreneur James Moon as a structured answer to hard-to-source aircraft parts and AOG support.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Eyebrow>About PlaneServe</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            Founded by an aviation entrepreneur.{" "}
            <span className="text-accent">Built from necessity.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 md:text-lg">
            PlaneServe was not designed on a whiteboard. It grew from a problem that kept presenting
            itself across years of trading aircraft and working alongside owners and operators in
            the legacy market.
          </p>
        </div>
      </section>

      {/* ── Origin story ──────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>Where It Started</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl leading-tight">
                Owners kept asking the same question:{" "}
                <span className="text-accent">can you help us find this part?</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                James Moon has built his career across multiple aviation businesses, each focused on
                solving genuine challenges for people who own and operate aircraft for a living.
                Through that work, the transactions, the relationships, and the day-to-day reality
                of keeping older aircraft flying, a pattern emerged.
              </p>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                Owners and operators of legacy types were facing parts that had drifted out of
                primary distribution, components with no clear source, and AOG situations with no
                obvious path to resolution. They kept coming to James because he had the network and
                the knowledge to help.
              </p>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                In time, it became clear that what he was doing informally was a service the market
                needed. PlaneServe is the structured answer to that demand: specialist parts
                sourcing and AOG support for every enrolled owner.
              </p>
            </div>

            <div className="rounded-sm border border-border bg-card p-8 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent mb-6">
                The problem we solve
              </div>
              <div className="space-y-5">
                {[
                  {
                    label: "The legacy problem",
                    items: [
                      "Parts fall out of primary distribution",
                      "Supplier knowledge sits in private networks",
                      "Owners lose time working out who to call",
                      "AOG cases start with uncertainty",
                    ],
                    tone: "text-destructive",
                    bg: "bg-destructive/5 border-destructive/20",
                  },
                  {
                    label: "The PlaneServe answer",
                    items: [
                      "Aircraft context held before downtime starts",
                      "Specialist sourcing route already in place",
                      "AOG desk ready to move when the request lands",
                      "Owners backed by aviation relationships, not guesswork",
                    ],
                    tone: "text-accent",
                    bg: "bg-accent/5 border-accent/20",
                  },
                ].map((col) => (
                  <div key={col.label} className={`rounded-sm border p-5 ${col.bg}`}>
                    <div
                      className={`text-xs font-semibold uppercase tracking-wider mb-3 ${col.tone}`}
                    >
                      {col.label}
                    </div>
                    <ul className="space-y-2">
                      {col.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <span className={`mt-0.5 text-sm leading-none ${col.tone}`}>·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder message ───────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-16 lg:grid-cols-[1fr_2fr] lg:items-start">
            <div>
              <Eyebrow>From the Founder</Eyebrow>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src="https://aviationweek.com/sites/default/files/2023-01/moon_jet_group_james_moon_source_moon_jet_group.jpeg"
                  alt="James Moon"
                  className="h-28 w-28 rounded-sm object-cover object-top"
                />
                <div>
                  <div className="font-semibold">James Moon</div>
                  <div className="text-sm text-muted-foreground">Founder, PlaneServe</div>
                </div>
              </div>
            </div>

            <blockquote className="relative">
              <div className="absolute -top-4 -left-2 text-6xl text-accent/20 font-serif leading-none select-none">
                "
              </div>
              <p className="relative text-xl leading-9 font-medium text-foreground/90 md:text-2xl md:leading-10">
                The same conversation kept finding me. An owner would call, sometimes a
                long-standing contact, sometimes a referral, and the need was always the same: I
                can't find this part, and I don't know where else to look. I kept helping because I
                could. Eventually it became obvious that this wasn't a favour. It was a service the
                market genuinely needed, and nobody was providing it properly. PlaneServe is the
                answer to every one of those calls.
              </p>
              <footer className="mt-8 text-sm text-muted-foreground">
                — James Moon · Founder, PlaneServe
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Mission & values ──────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow>Mission & Values</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              What we stand for.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                Icon: SlaIcon,
                title: "Speed is non-negotiable",
                desc: "Every hour an aircraft is grounded has a cost. PlaneServe exists so the search can begin with context already in hand.",
              },
              {
                Icon: ClearedIcon,
                title: "Built from experience",
                desc: "The service comes from years of seeing the same owner problem repeat across legacy aircraft and hard-to-source components.",
              },
              {
                Icon: GlobeIcon,
                title: "Relationships matter",
                desc: "Rare parts are often found through supplier knowledge, market memory, and trusted aviation relationships, not generic search.",
              },
              {
                Icon: NetworkIcon,
                title: "Specialists in older platforms",
                desc: "We focus where OEM support has thinned: older aircraft where knowledge, persistence, and supplier access matter most.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-sm border border-border bg-card p-6">
                <Icon className="h-6 w-6 text-accent mb-4" strokeWidth={1.5} />
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team expertise & global reach ─────────────────────────────────── */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>Expertise & Reach</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Deep knowledge, global supplier access.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/60">
                PlaneServe's desk combines aviation supply chain experience with a vetted global
                network of parts suppliers. We specialise in older business platforms — the aircraft
                where the OEM catalogue runs thin and the right part requires knowing who to call,
                not just where to look.
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  "Sourcing experience across turboprops, light jets, mid-size, and large-cabin platforms",
                  "Vetted supplier network: Part 145 MROs, specialist distributors, and OEM-adjacent stockists",
                  "8130-3 and EASA Form 1 verification on every option",
                  "AMO and freight coordination included — one desk, full lane",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                    <ClearedIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "24/7", label: "Desk coverage" },
                { stat: "< 4 hrs", label: "To verified options" },
                { stat: "0%", label: "Parts markup" },
                { stat: "Global", label: "Supplier network" },
              ].map(({ stat, label }) => (
                <div key={label} className="rounded-sm border border-white/10 bg-white/5 p-6">
                  <div className="text-3xl font-semibold text-accent">{stat}</div>
                  <div className="mt-1 text-xs text-white/45 uppercase tracking-widest">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Competitor comparison ─────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow>Why PlaneServe</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              How we compare.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Most operators manage AOG reactively. PlaneServe is built for the operators who want
              to be ready before the call comes in.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-sm overflow-hidden">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground w-[220px]">
                    Capability
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    No retained support
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Ad-hoc broker
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest text-accent bg-accent/5">
                    PlaneServe
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Aircraft context on file", false, false, true],
                  ["24/7 desk availability", false, "Sometimes", true],
                  ["First response time", "Hours", "30–60 min", "Minutes"],
                  ["Transparent pricing", true, false, true],
                  ["Parts markup", "Varies", "Yes", "Never"],
                  ["Paperwork verification", "Self-managed", "Ad hoc", true],
                  ["Freight coordination", "Self-managed", "Sometimes", true],
                  ["Supplier network quality", "Unknown", "Varies", "Vetted"],
                ].map(([cap, noSupport, broker, ps]) => (
                  <tr
                    key={String(cap)}
                    className="bg-background hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-xs">{cap}</td>
                    <td className="px-6 py-4 text-center">{renderCell(noSupport)}</td>
                    <td className="px-6 py-4 text-center">{renderCell(broker)}</td>
                    <td className="px-6 py-4 text-center bg-accent/5">{renderCell(ps, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Ready to enrol your aircraft?
          </h2>
          <p className="mt-4 mx-auto max-w-lg text-sm leading-7 text-muted-foreground">
            Takes five minutes. No contract. The desk is active the moment enrolment is confirmed.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/enrol"
              className="inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-4 text-sm font-semibold text-[oklch(0.16_0.02_250)] hover:opacity-90 transition-opacity"
            >
              Enrol Aircraft <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-sm border border-border px-8 py-4 text-sm font-semibold hover:bg-muted/60 transition-colors"
            >
              Talk to the desk
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function renderCell(value: boolean | string, isPs = false) {
  if (value === true) {
    return (
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full mx-auto ${isPs ? "bg-accent/20 text-accent" : "bg-success/10 text-success"}`}
      >
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 text-destructive mx-auto">
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    );
  }
  return (
    <span className={`text-xs font-medium ${isPs ? "text-accent" : "text-muted-foreground"}`}>
      {value}
    </span>
  );
}
