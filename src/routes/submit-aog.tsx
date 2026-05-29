import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { createAogRequest, ensureSession, getAogFormData } from "@/lib/app.functions";
import { Urgency } from "@/lib/db/schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Zap, Phone, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/submit-aog")({
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: SubmitAog,
});

const ATA_OPTIONS = [
  "Engine / APU / Fuel Control (ATA 71-80)",
  "Landing Gear / Brakes / Tyres (ATA 32)",
  "Flight Controls — rudder, elevator, flaps (ATA 27)",
  "Navigation — GPS, TCAS, transponder (ATA 34)",
  "Electrical Power — generator, battery (ATA 24)",
  "Hydraulic Power (ATA 29)",
  "Fuel System — pump, valve (ATA 28)",
  "Air Conditioning / Pressurisation (ATA 21)",
  "Autopilot / Auto Flight (ATA 22)",
  "Communications — radio, SATCOM (ATA 23)",
  "Instruments / Avionics displays (ATA 31)",
  "Ice and Rain Protection (ATA 30)",
  "Fire Protection (ATA 26)",
  "Lighting (ATA 33)",
  "Pneumatic / Bleed Air (ATA 36)",
  "Cabin / Equipment / Furnishings (ATA 25)",
  "Airframe Structure / Windshield (ATA 52-57)",
  "Other / Not listed",
];

const AMO_OPTIONS = [
  "Not yet — desk to contact them",
  "Yes — on site",
  "Yes — aware but not on site",
  "No local AMO available",
];

const POB_OPTIONS = [
  "No passengers — ferry or positioning",
  "Passengers on board",
  "Charter passengers stranded",
  "Medical / urgent mission",
];

const FLYING_OPTIONS = [
  "As soon as possible — no fixed deadline",
  "Within 24 hours",
  "Within 48 hours",
  "Within the week",
  "Flexible",
];

type AogForm = {
  aircraftId: string;
  location: string;
  affectedSystem: string;
  issueDescription: string;
  urgency: Urgency;
  partNumber: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  attachments: string[];
};

function SubmitAog() {
  const { data } = useQuery({
    queryKey: ["aog-form"],
    queryFn: () => getAogFormData(),
  });
  const user = data?.user;
  const aircraft = data?.aircraft ?? [];
  const nav = useNavigate();
  const [submitted, setSubmitted] = useState<{ caseReference: string } | null>(null);

  const [form, setForm] = useState<AogForm>({
    aircraftId: "",
    location: "",
    affectedSystem: "",
    issueDescription: "",
    urgency: "Aircraft grounded",
    partNumber: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    attachments: [],
  });

  const [selectedSystem, setSelectedSystem] = useState("");
  const [pob, setPob] = useState(POB_OPTIONS[0]);
  const [flying, setFlying] = useState(FLYING_OPTIONS[0]);
  const [amoStatus, setAmoStatus] = useState(AMO_OPTIONS[0]);

  useEffect(() => {
    if (!aircraft.length || form.aircraftId) return;
    setForm((f) => ({
      ...f,
      aircraftId: aircraft[0].id,
      location: aircraft[0].baseAirport ?? "",
      contactName: user?.name ?? "",
      contactPhone: user?.phone ?? "",
      contactEmail: user?.email ?? "",
    }));
  }, [aircraft, form.aircraftId, user]);

  const selectedAircraft = aircraft.find((x) => x.id === form.aircraftId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.aircraftId) {
      toast.error("Select an aircraft.");
      return;
    }
    if (!form.issueDescription) {
      toast.error("Please describe the issue.");
      return;
    }
    try {
      const result = await createAogRequest({
        data: {
          ...form,
          affectedSystem: selectedSystem || form.affectedSystem || "Not specified",
          peopleOnBoard: pob,
          flyingDeadline: flying,
          amoAware: amoStatus,
        },
      });
      setSubmitted({ caseReference: result.caseReference });
    } catch {
      toast.error("Unable to submit AOG request.");
    }
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-10 text-center mt-12">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" strokeWidth={1.5} />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">AOG case opened</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your desk handler will call you within 5 minutes. Parts sourcing has begun.
          </p>
          <div className="mt-5 inline-block rounded-lg bg-muted px-5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Case reference</p>
            <p className="font-mono text-xl font-bold text-foreground">{submitted.caseReference}</p>
          </div>
          <button
            onClick={() => nav({ to: "/aog-cases" })}
            className="mt-8 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            View case status
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl">
        {/* Emergency header */}
        <div className="rounded-xl bg-[#1a0a0a] text-white p-5 mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400 mb-0.5">
                Emergency
              </p>
              <h1 className="text-xl font-bold">Submit AOG</h1>
              <p className="text-sm text-white/60 mt-1">
                Call the hotline first. We pick up 24/7. If you cannot call, complete the form and
                we will call you within 5 minutes.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/70 font-medium">
                Desk active · 24/7 AOG support
              </span>
            </div>
            <p className="text-xs text-white/40 mt-0.5">Last case opened 2 hours ago</p>
          </div>
        </div>

        {/* Hotline cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#111] rounded-xl p-5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-2">
              AOG Hotline — 24/7
            </p>
            <p className="text-2xl font-bold tracking-tight mb-4">+44 7700 900000</p>
            <a
              href="tel:+447700900000"
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-red-600 hover:bg-red-700 text-white py-2.5 text-sm font-semibold transition-colors"
            >
              <Phone className="h-4 w-4" />
              Call now
            </a>
          </div>
          <div className="bg-[#111] rounded-xl p-5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-2">
              WhatsApp
            </p>
            <p className="text-2xl font-bold tracking-tight mb-4">+44 7700 900000</p>
            <a
              href="https://wa.me/447700900000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white py-2.5 text-sm font-semibold transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Message on WhatsApp
            </a>
          </div>
        </div>

        {/* What happens */}
        <div className="rounded-xl border border-border bg-blue-500/5 p-5 mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-4">
            What happens after you submit
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                n: 1,
                title: "Handler calls you",
                desc: "Within 5 minutes. Have aircraft documents ready.",
              },
              {
                n: 2,
                title: "Parts sourcing begins",
                desc: "We search 300+ suppliers live while on the phone.",
              },
              {
                n: 3,
                title: "Options presented",
                desc: "Sourcing options with prices within 2 hours of case open.",
              },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {n}
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 border-t border-border" />
          <p className="text-xs text-muted-foreground">Submit details to open case</p>
          <div className="flex-1 border-t border-border" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Aircraft selector */}
          <div>
            <p className="text-sm font-medium mb-2">Which aircraft?</p>
            <div className="grid grid-cols-2 gap-2">
              {aircraft.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, aircraftId: a.id, location: a.baseAirport ?? "" }))
                  }
                  className={`text-left rounded-xl px-4 py-3 border-2 transition-colors ${
                    form.aircraftId === a.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card border-border hover:border-muted-foreground"
                  }`}
                >
                  <p className="text-base font-bold">{a.registration}</p>
                  <p
                    className={`text-xs mt-0.5 ${form.aircraftId === a.id ? "text-background/60" : "text-muted-foreground"}`}
                  >
                    {a.makeModel} ·{" "}
                    {a.totalAirframeHours
                      ? `${Number(a.totalAirframeHours).toLocaleString()} hrs`
                      : "hrs not recorded"}
                  </p>
                </button>
              ))}
              {aircraft.length === 0 && (
                <div className="col-span-2 p-4 text-sm text-muted-foreground border border-dashed border-border rounded-xl text-center">
                  No aircraft enrolled.{" "}
                  <a href="/enrol" className="underline">
                    Enrol an aircraft
                  </a>{" "}
                  to submit an AOG request.
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium">Current location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. LFPB Paris Le Bourget, or city name"
              className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Issue description */}
          <div>
            <label className="text-sm font-medium">What has failed or is unserviceable?</label>
            <textarea
              rows={3}
              required
              value={form.issueDescription}
              onChange={(e) => setForm((f) => ({ ...f, issueDescription: e.target.value }))}
              placeholder="Describe clearly — e.g. TFE731-2-2B fuel control unit failed on shutdown. MEL item. Aircraft unairworthy. LFPB."
              className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* ATA / system */}
          <div>
            <label className="text-sm font-medium">
              Part or system that has failed{" "}
              <span className="text-muted-foreground font-normal">
                (helps desk triage immediately)
              </span>
            </label>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select the system that has failed…</option>
              {ATA_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Part number */}
          <div>
            <label className="text-sm font-medium">
              Part number <span className="text-muted-foreground font-normal">(if known)</span>
            </label>
            <input
              type="text"
              value={form.partNumber}
              onChange={(e) => setForm((f) => ({ ...f, partNumber: e.target.value }))}
              placeholder="e.g. 3-1454-0002"
              className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Two-col dropdowns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">People on board or affected?</label>
              <select
                value={pob}
                onChange={(e) => setPob(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {POB_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">When do you need the aircraft flying?</label>
              <select
                value={flying}
                onChange={(e) => setFlying(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {FLYING_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Is your AMO aware?</label>
              <select
                value={amoStatus}
                onChange={(e) => setAmoStatus(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {AMO_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Best number to reach you now</label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                placeholder="+44 7700 900000"
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!form.aircraftId || !form.issueDescription}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white py-4 text-sm font-bold transition-colors"
            >
              <Zap className="h-4 w-4" strokeWidth={2.5} />
              Open AOG case — desk alerted immediately
            </button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              All sourcing charges confirmed by the desk before any commitment. Subscription covers
              case management.
            </p>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
