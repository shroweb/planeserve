import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import twinTurboprop from "@/assets/twin-turboprop-tarmac.jpeg";
import aboutHero from "@/assets/WhatsApp Image 2026-06-03 at 17.32.28 (1).jpeg";
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
      <section className="brand-dark relative min-h-[55vh] overflow-hidden bg-[#001b2e] text-white flex items-end">
        <img
          src={aboutHero}
          alt="Legacy aircraft on the ramp, ready for AOG support"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001b2e] via-[#001b2e]/80 to-[#001b2e]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001b2e] via-transparent to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-20">
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
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
            <div className="flex flex-col justify-center border-y border-border py-10 lg:py-14">
              <Eyebrow>Where It Started</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                The same request kept returning:{" "}
                <span className="text-accent">can you help us find this part?</span>
              </h2>
              <div className="mt-7 space-y-5 text-base leading-8 text-muted-foreground">
                <p>
                  PlaneServe came from years of aircraft trading, owner relationships, and the
                  practical work of keeping older aircraft flying. When the obvious channels went
                  quiet, operators came to James because he knew where else to look.
                </p>
                <p>
                  Those calls were rarely theoretical. A component had slipped out of primary
                  distribution. An aircraft was AOG. Someone needed a credible route to a part,
                  paperwork, supplier confirmation, and movement.
                </p>
                <p>
                  PlaneServe turns that informal support into a formal programme: aircraft details
                  on file before the problem, and a sourcing desk ready when the request lands.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:mt-9">
                {[
                  ["Before AOG", "Aircraft details captured"],
                  ["During AOG", "Desk starts with context"],
                  ["After supply", "Case history retained"],
                ].map(([label, value]) => (
                  <div key={label} className="border-l border-accent/50 pl-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-snug text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="brand-dark relative min-h-[360px] overflow-hidden bg-[#001b2e] shadow-sm sm:min-h-[430px] lg:min-h-[560px]">
              <img
                src={twinTurboprop}
                alt="Twin turboprop aircraft on the tarmac"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001b2e]/90 via-[#001b2e]/10 to-transparent" />
              <div className="brand-dark absolute left-6 top-6 border border-white/25 bg-[#001b2e]/70 px-4 py-3 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                  Legacy aircraft support
                </p>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Older aircraft. Thinner catalogues.
                </p>
                <h3 className="mt-3 max-w-xl text-2xl font-semibold leading-tight text-white md:text-3xl">
                  A programme built for the parts search that cannot start from zero.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder message ───────────────────────────────────────────────── */}
      <section className="brand-dark bg-[#001b2e] text-white border-b border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent/70 mb-10">
            From the Founder
          </p>
          <blockquote>
            <p className="text-3xl font-semibold leading-[1.45] tracking-tight text-white md:text-4xl md:leading-[1.4]">
              "The same conversation kept finding me. An owner would call and the need was always the same:
              I can't find this part, and I don't know where else to look. I kept helping because I could.
              Eventually it became obvious that this wasn't a favour."
            </p>
            <footer className="mt-10 flex items-center justify-center gap-4">
              <div className="h-px w-8 bg-accent/40" />
              <span className="text-sm font-semibold text-white">James Moon</span>
              <span className="text-white/40 text-sm">·</span>
              <span className="text-sm text-white/50">Founder, PlaneServe</span>
            </footer>
          </blockquote>
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
      <section className="brand-dark bg-[#001b2e] text-white border-b border-border">
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
                  "AMO and freight coordination included — everything through the same desk",
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
                { stat: "Clear", label: "Option pricing" },
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
                  ["Option pricing", "Unclear", "Varies", "Clear"],
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
            Takes five minutes. No contract. Your account is live immediately, with formal AOG cover
            confirmed once the aircraft details are verified.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/enrol"
              className="inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-4 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
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
