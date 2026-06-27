import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { createAogRequest, ensureSession, getAogFormData } from "@/lib/app.functions";
import { componentsFor } from "@/lib/aircraft-components";
import { Urgency } from "@/lib/db/schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Clock3, MessageCircle, Phone, Zap } from "lucide-react";

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
  "Passengers waiting to depart",
  "Passengers stranded — accommodation needed",
  "Crew only",
];

const FLYING_OPTIONS = [
  "As soon as possible — no fixed deadline",
  "Within 24 hours",
  "Within 48 hours",
  "Within the week",
  "Flexible",
];

const formControlCls =
  "mt-1.5 h-11 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary";
const textareaCls =
  "mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none";

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
  const [selectedComponent, setSelectedComponent] = useState("");
  const [componentOther, setComponentOther] = useState("");
  const OTHER_COMPONENT = "Other / not listed";
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
      // Prefer the specific component when chosen; combine with the ATA system
      // so the desk sees both (e.g. "Hydraulic pump · Hydraulic Power (ATA 29)").
      const component =
        selectedComponent === OTHER_COMPONENT ? componentOther.trim() : selectedComponent;
      const affectedSystem =
        (component && selectedSystem
          ? `${component} · ${selectedSystem}`
          : component || selectedSystem || form.affectedSystem) || "Not specified";

      const result = await createAogRequest({
        data: {
          ...form,
          affectedSystem,
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
        <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-11 w-11 text-success" strokeWidth={1.5} />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">AOG case opened</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              The PlaneServe desk has been alerted. Your handler will acknowledge the case and begin
              sourcing against the aircraft profile on file.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/20 p-4 text-center">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Case reference
              </p>
              <p className="font-mono text-lg font-bold text-foreground">
                {submitted.caseReference}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4 text-center">
              <Clock3 className="mx-auto mb-2 h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Acknowledgement</p>
              <p className="mt-1 text-xs text-muted-foreground">Within 10 minutes</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4 text-center">
              <Phone className="mx-auto mb-2 h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">AOG hotline</p>
              <p className="mt-1 text-xs text-muted-foreground">+44 7700 900000</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              What happens next
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Submitted", "Acknowledged", "Sourcing"].map((label, index) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => nav({ to: "/aog-cases" })}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            View case status
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl">
        {/* Emergency header */}
        <div className="mb-6 rounded-xl bg-[#1a0a0a] p-5 text-white sm:flex sm:items-start sm:justify-between sm:gap-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400 mb-0.5">
                Emergency
              </p>
              <h1 className="text-2xl font-bold leading-tight sm:text-xl">Submit AOG</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 sm:mt-1">
                Call the hotline first. We pick up 24/7. If you cannot call, complete the form and
                we will call you within 5 minutes.
              </p>
            </div>
          </div>
          <div className="mt-4 shrink-0 text-left sm:mt-0 sm:text-right">
            <div className="flex items-center gap-1.5 sm:justify-end">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/70 font-medium">
                Desk active · 24/7 AOG support
              </span>
            </div>
            <p className="text-xs text-white/40 mt-0.5">Last case opened 2 hours ago</p>
          </div>
        </div>

        {/* Hotline cards */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
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
          <div className="grid gap-4 sm:grid-cols-3">
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
            <label className="text-sm font-medium">Which aircraft?</label>
            {aircraft.length === 0 ? (
              <div className="mt-1.5 p-4 text-sm text-muted-foreground border border-dashed border-border rounded-lg text-center">
                No aircraft enrolled.{" "}
                <a href="/enrol" className="underline">
                  Enrol an aircraft
                </a>{" "}
                to submit an AOG request.
              </div>
            ) : (
              <select
                value={form.aircraftId}
                onChange={(e) => {
                  const a = aircraft.find((x) => x.id === e.target.value);
                  setForm((f) => ({
                    ...f,
                    aircraftId: e.target.value,
                    location: a?.baseAirport || f.location,
                  }));
                }}
                className={formControlCls}
              >
                {aircraft.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.registration} — {a.makeModel}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium">Current location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. LFPB Paris Le Bourget, or city name"
              className={formControlCls}
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
              className={textareaCls}
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
              onChange={(e) => {
                setSelectedSystem(e.target.value);
                setSelectedComponent("");
                setComponentOther("");
              }}
              className={formControlCls}
            >
              <option value="">Select the system that has failed…</option>
              {ATA_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            {/* Curated component picker — shown when we have a list for this
                aircraft + system. Falls back to free text via "Other". */}
            {(() => {
              const curated = componentsFor(selectedAircraft?.makeModel, selectedSystem);
              if (curated.length === 0) return null;
              return (
                <div className="mt-3">
                  <label className="text-sm font-medium">
                    Component{" "}
                    <span className="text-muted-foreground font-normal">
                      (common items for {selectedAircraft?.makeModel})
                    </span>
                  </label>
                  <select
                    value={selectedComponent}
                    onChange={(e) => setSelectedComponent(e.target.value)}
                    className={formControlCls}
                  >
                    <option value="">Select a component…</option>
                    {curated.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value={OTHER_COMPONENT}>{OTHER_COMPONENT}</option>
                  </select>
                  {selectedComponent === OTHER_COMPONENT && (
                    <input
                      type="text"
                      value={componentOther}
                      onChange={(e) => setComponentOther(e.target.value)}
                      placeholder="Describe the component or part"
                      className={formControlCls}
                    />
                  )}
                </div>
              );
            })()}
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
              className={formControlCls}
            />
          </div>

          {/* Two-col dropdowns */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">People on board or affected?</label>
              <select
                value={pob}
                onChange={(e) => setPob(e.target.value)}
                className={formControlCls}
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
                className={formControlCls}
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
                className={formControlCls}
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
                className={formControlCls}
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
