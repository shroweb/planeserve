import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Eyebrow } from "@/components/site/Section";
import { ArrowRightIcon, AircraftIcon, SlaIcon } from "@/components/app/PlaneServeIcons";
import { Mail } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — PlaneServe" },
      {
        name: "description",
        content:
          "Talk to the PlaneServe operations desk. For new enrolments, active AOG support, supplier enquiries, or general questions.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", aircraftType: "", subject: "enrolment", message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this would POST to a server function
    setSent(true);
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[oklch(0.13_0.025_250)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Eyebrow>Get in touch</Eyebrow>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            Talk to the desk.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/60">
            The operations team responds directly — no sales funnel, no ticketing queue.
            If your aircraft is currently grounded,{" "}
            <Link to="/submit-aog" className="text-accent underline underline-offset-2 hover:opacity-80">
              submit an AOG request
            </Link>{" "}
            instead.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr] lg:items-start">

            {/* Left: contact details */}
            <div className="space-y-10">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Operations desk
                </div>
                <div className="space-y-4">
                  <a
                    href="mailto:desk@planeserve.aero"
                    className="flex items-center gap-3 group"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border bg-card group-hover:border-accent/40 transition-colors">
                      <Mail className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">desk@planeserve.aero</div>
                      <div className="text-xs text-muted-foreground">For all operational enquiries</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border bg-card">
                      <SlaIcon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">24 / 7 · 365</div>
                      <div className="text-xs text-muted-foreground">No out-of-hours voicemail</div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-sm border border-accent/30 bg-accent/8 px-4 py-3">
                    <div className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">AOG Hotline</div>
                    <a href="mailto:aog@planeserve.aero" className="text-sm font-semibold hover:underline">
                      aog@planeserve.aero
                    </a>
                    <div className="text-xs text-muted-foreground mt-0.5">Active AOG only · answered within minutes</div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  What to use this form for
                </div>
                <ul className="space-y-3">
                  {[
                    { label: "New enrolment", desc: "Discuss adding your aircraft or fleet." },
                    { label: "Supplier network", desc: "Apply to join as a vetted parts supplier." },
                    { label: "AMO partnerships", desc: "Referral arrangements and preferred network." },
                    { label: "Media & press", desc: "Industry commentary and case studies." },
                  ].map(({ label, desc }) => (
                    <li key={label} className="flex gap-3 text-sm">
                      <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <div>
                        <span className="font-medium">{label}</span>
                        <span className="text-muted-foreground"> — {desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-border" />

              <div className="rounded-sm border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AircraftIcon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                  <span className="text-sm font-semibold">Active AOG?</span>
                </div>
                <p className="text-xs leading-6 text-muted-foreground">
                  Don't use this form if your aircraft is grounded right now. Submit a live AOG
                  request instead — the desk activates immediately.
                </p>
                <Link
                  to="/submit-aog"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                >
                  Submit AOG request <ArrowRightIcon className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Right: form */}
            <div className="rounded-sm border border-border bg-card p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 mb-4">
                    <svg className="h-6 w-6 text-success" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Message sent</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                    The desk will respond directly to your email, usually within a few hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Name
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Company / operator
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Optional"
                        className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@operator.com"
                      className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Aircraft type
                    </label>
                    <input
                      type="text"
                      value={form.aircraftType}
                      onChange={(e) => setForm({ ...form, aircraftType: e.target.value })}
                      placeholder="e.g. Falcon 900EX, Challenger 604"
                      className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="enrolment">New enrolment enquiry</option>
                      <option value="supplier">Supplier network application</option>
                      <option value="amo">AMO partnership</option>
                      <option value="media">Media & press</option>
                      <option value="other">General question</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your aircraft, fleet, or question..."
                      className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    Send message <ArrowRightIcon className="h-4 w-4" />
                  </button>

                  <p className="text-center text-xs text-muted-foreground">
                    The desk responds directly — no automated replies.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
