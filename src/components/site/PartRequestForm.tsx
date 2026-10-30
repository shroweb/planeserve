import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eyebrow } from "@/components/site/Section";
import { submitOneOffPartRequest } from "@/lib/app.functions";
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

interface PartRequestFormProps {
  /** Short label, e.g. "Citation" or "AOG". Used in headings and button text. */
  label: string;
  eyebrow: string;
  heading: string;
  intro: string;
  /** When given, aircraft model is a select; otherwise free text. */
  models?: string[];
  defaultUrgency?: string;
  submitLabel: string;
}

export function PartRequestForm({
  label,
  eyebrow,
  heading,
  intro,
  models,
  defaultUrgency = "AOG Grounded",
  submitLabel,
}: PartRequestFormProps) {
  const info = { name: label, popularModels: models ?? [] };
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    aircraftType: models?.[0] ?? "",
    aircraftReg: "",
    partNumber: "",
    partDescription: "",
    condition: "Any Certified (Fastest)",
    urgency: defaultUrgency,
    deliveryLocation: "",
    additionalNotes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const res = await submitOneOffPartRequest({ data: formData });
      if (res.ok) {
        setSubmittedRef(res.reference);
      } else {
        setErrorMessage(
          "Unable to submit parts request. Please check fields or email ops@aircraftprogram.com.",
        );
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Submission error. Please email ops@aircraftprogram.com directly.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* ── Request Form ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center max-w-xl mx-auto">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">{heading}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{intro}</p>
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card p-8 md:p-10 shadow-sm">
            {submittedRef ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-foreground">Request Submitted</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reference:{" "}
                  <strong className="text-foreground font-mono bg-muted px-2 py-0.5 rounded">
                    {submittedRef}
                  </strong>
                </p>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Our operations team has received your request and is checking availability now.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmittedRef(null)}
                    className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    Submit Another Component
                  </button>
                  <Link
                    to="/enrol"
                    className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                  >
                    Enrol for 24/7 Cover ($100/mo)
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
                    <div>{errorMessage}</div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      {models ? `${info.name} Model *` : "Aircraft Type / Model *"}
                    </label>
                    {models ? (
                      <select
                        value={formData.aircraftType}
                        onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        {models.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                        <option value={`Other ${info.name}`}>Other {info.name} Model</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        required
                        placeholder="e.g. Citation XLS, King Air 350, Challenger 350"
                        value={formData.aircraftType}
                        onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Tail / Registration Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. N123XX or G-XXXX"
                      value={formData.aircraftReg}
                      onChange={(e) => setFormData({ ...formData, aircraftReg: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Part Number (P/N) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 50-0123-45"
                      value={formData.partNumber}
                      onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Part Description / ATA System
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Starter Generator, Hydraulic Valve"
                      value={formData.partDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, partDescription: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Condition Required *
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="Any Certified (Fastest)">Any Certified (Fastest)</option>
                      <option value="Factory New / New Surplus (FN/NS)">
                        Factory New / New Surplus
                      </option>
                      <option value="Overhauled (OH)">Overhauled (OH)</option>
                      <option value="Serviceable (SV)">Serviceable (SV)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Urgency *
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="AOG Grounded">🚨 Aircraft Grounded (AOG)</option>
                      <option value="Dispatch Critical (Next 24-48h)">
                        ⚠️ Dispatch Critical (24–48h)
                      </option>
                      <option value="Planned Maintenance / Stock">📦 Planned Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Delivery Destination / Airport ICAO / MRO *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EGGW (Luton), KTEB (Teterboro), or Hangar Name"
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="pt-4 border-t border-border grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@flightdept.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground">
                    Handling fee of US$150–250 applies upon quote acceptance.
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        {submitLabel} <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
