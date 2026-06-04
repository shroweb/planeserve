import { createFileRoute, Link } from "@tanstack/react-router";
import challengerHangar from "@/assets/challenger-mro-hangar.jpeg";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import {
  ArrowRightIcon,
  DocumentIcon,
  SearchIcon,
  MessageIcon,
  ClearedIcon,
  SlaIcon,
  AogIcon,
  CoverIcon,
} from "@/components/app/PlaneServeIcons";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it Works — The PlaneServe AOG support journey" },
      {
        name: "description",
        content: "Learn how PlaneServe moves your aircraft from 'grounded' to 'serviceable' using a retained support desk and pre-captured context.",
      },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#041c2c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Eyebrow>The Process</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            A direct route to AOG support,{" "}
            <span className="text-accent">active before the call.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            PlaneServe is not a marketplace you log into during a crisis. It's a retained AOG desk
            where your aircraft record, AMO contacts, and trace requirements are already on file
            long before the first call comes in.
          </p>
        </div>
      </section>

      {/* ── Phase 1: Enrolment ────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 border border-accent/20 mb-6">
                <CoverIcon className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl leading-tight">
                The work that makes the difference{" "}
                <span className="text-accent ">before downtime starts.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                The biggest cause of AOG delay isn't just finding the part — it's the administrative "cold start." 
                By enrolling your aircraft today, we eliminate the 2am scramble for registration numbers, 
                engine series, and maintenance contacts.
              </p>
              
              <ul className="mt-10 space-y-4">
                {[
                  { t: "Aircraft Enrolment", d: "Tail, serial, and type details held on file." },
                  { t: "Aircraft Record", d: "Engine serials, base ICAO, and part number history on file." },
                  { t: "Contact Registry", d: "Direct lines to your AMO, operator, and insurer verified." },
                ].map((item) => (
                  <li key={item.t} className="flex gap-4">
                    <ClearedIcon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">{item.t}</div>
                      <p className="text-xs text-muted-foreground mt-1">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-card border border-border p-8 rounded-sm shadow-sm">
              <div className="text-xs font-bold text-accent uppercase tracking-widest mb-6">On-file Readiness</div>
              <div className="space-y-4">
                {[
                  "Registration: N123PS",
                  "Serial: 500-1234",
                  "Engine: TFE731-5BR",
                  "Base: KTEB (Teterboro)",
                  "Maintenance: Approved AMO",
                  "Insurer: Global Aviation",
                ].map((text) => (
                  <div key={text} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <span className="text-xs font-medium text-muted-foreground uppercase">{text.split(': ')[0]}</span>
                    <span className="text-sm font-semibold">{text.split(': ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Phase 2: Activation ───────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 border border-accent/20 mb-6 mx-auto">
              <AogIcon className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              When the call comes in,{" "}
              <span className="text-accent ">we're already moving.</span>
            </h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground">
              When an enrolled aircraft goes technical, your desk is activated. Because we already know the aircraft, 
              we bypass the discovery phase and move directly into the global supplier network.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                t: "1. Rapid Intake",
                Icon: DocumentIcon,
                d: "Submit the issue and part number. Our desk instantly cross-references it against your aircraft's known configuration.",
              },
              {
                t: "2. Supplier Outreach",
                Icon: SearchIcon,
                d: "We engage a vetted network of global suppliers matched to your aircraft type and current location.",
              },
              {
                t: "3. Trace Verification",
                Icon: CoverIcon,
                d: "Every option is checked for 8130-3 / EASA Form 1 and full traceability before it's even presented to you.",
              },
            ].map((step) => {
              const Icon = step.Icon;
              return (
                <div key={step.t} className="p-8 border border-border bg-background rounded-sm">
                  <Icon className="h-8 w-8 text-accent mb-6" strokeWidth={1.5} />
                  <h3 className="font-semibold text-lg mb-3 tracking-tight">{step.t}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Phase 3: Resolution ───────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-square rounded-sm overflow-hidden">
                <img
                  src={challengerHangar}
                  alt="Challenger aircraft in MRO hangar"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-accent p-6 rounded-sm shadow-xl hidden md:block">
                <SlaIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-accent/10 border border-accent/20 mb-6">
                <MessageIcon className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl leading-tight">
                Options, approval, and{" "}
                <span className="text-accent ">coordinated dispatch.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                Options land in your dashboard with side-by-side transparency. Once you approve, 
                we handle the order placement and coordinate with your maintenance team for arrival.
              </p>
              
              <div className="mt-10 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-sm border border-border">
                    <ClearedIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm uppercase tracking-wider text-accent mb-1">Approval</div>
                    <p className="text-sm text-muted-foreground">Approve the preferred option from the dashboard or directly with the desk.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-sm border border-border">
                    <SlaIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm uppercase tracking-wider text-accent mb-1">Tracking</div>
                    <p className="text-sm text-muted-foreground">AWB tracked — freight route, carrier, and estimated arrival updated as it moves.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why it Works ─────────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow>The Difference</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Why the retained model wins.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: "No Cold Starts", d: "We don't ask for your engine serials at 2am. We already have them." },
              { t: "Vetted Lanes", d: "Our supplier outreach isn't random; it's matched to your aircraft type." },
              { t: "Zero Markup", d: "You pay what we pay. Our value is in the support, not the parts margin." },
              { t: "Permanent Record", d: "Every case, quote, and trace document is stored against the aircraft." },
            ].map((item) => (
              <div key={item.t} className="p-6 border border-border bg-background rounded-sm">
                <div className="font-bold text-sm mb-2 tracking-tight">{item.t}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#041c2c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Enrol your aircraft.
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-base text-white/60">
            It takes less than five minutes to add an aircraft and activate your retained support desk.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/enrol"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-8 py-4 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Enrol Aircraft <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:bg-white/5"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
