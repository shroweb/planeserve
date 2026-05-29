import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { createSupplierApplication } from "@/lib/app.functions";
import { useState } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft, Building2 } from "lucide-react";

export const Route = createFileRoute("/suppliers/apply")({
  component: SupplierApplyPage,
});

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 placeholder:text-muted-foreground/60";

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="block text-xs font-medium text-foreground/70 mb-1">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </div>
      {children}
    </label>
  );
}

type FormData = {
  // step 1
  name: string;
  tradingName: string;
  country: string;
  address: string;
  website: string;
  vatRef: string;
  // step 2
  aircraftTypes: string;
  ataSystems: string;
  inventoryPlatform: string;
  stockType: string;
  typicalResponseTime: string;
  geographicCoverage: string;
  // step 3 compliance (just filenames)
  docs: Record<string, { file: string; expiry: string }>;
  // step 4
  primaryAogContact: string;
  primaryAogMobile: string;
  secondaryAogContact: string;
  accountsContact: string;
  paymentMethod: string;
  paymentCurrency: string;
  paymentTerms: string;
  // step 5
  firstName: string;
  lastName: string;
  email: string;
  agreed: boolean;
};

const defaultForm: FormData = {
  name: "",
  tradingName: "",
  country: "",
  address: "",
  website: "",
  vatRef: "",
  aircraftTypes: "",
  ataSystems: "",
  inventoryPlatform: "None",
  stockType: "Own warehouse",
  typicalResponseTime: "<1hr",
  geographicCoverage: "",
  docs: {},
  primaryAogContact: "",
  primaryAogMobile: "",
  secondaryAogContact: "",
  accountsContact: "",
  paymentMethod: "Bank Transfer",
  paymentCurrency: "USD",
  paymentTerms: "Net 30",
  firstName: "",
  lastName: "",
  email: "",
  agreed: false,
};

const COMPLIANCE_DOCS = [
  "FAA Part 145",
  "EASA Part 145",
  "ASA-100",
  "Quality Assurance Manual",
  "Export Licence",
  "Insurance Certificate",
];

function SupplierApplyPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: () =>
      createSupplierApplication({
        data: {
          name: form.name,
          tradingName: form.tradingName,
          country: form.country,
          address: form.address,
          website: form.website,
          vatRef: form.vatRef,
          aircraftTypes: form.aircraftTypes,
          ataSystems: form.ataSystems,
          inventoryPlatform: form.inventoryPlatform,
          stockType: form.stockType,
          typicalResponseTime: form.typicalResponseTime,
          geographicCoverage: form.geographicCoverage,
          primaryAogContact: form.primaryAogContact,
          primaryAogMobile: form.primaryAogMobile,
          secondaryAogContact: form.secondaryAogContact,
          accountsContact: form.accountsContact,
          paymentMethod: form.paymentMethod,
          paymentCurrency: form.paymentCurrency,
          paymentTerms: form.paymentTerms,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
        },
      }),
    onSuccess: () => setDone(true),
  });

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-2">Application submitted!</h1>
            <p className="text-muted-foreground text-sm">
              Thank you for applying to the PlaneServe supplier network. Our desk reviews all
              applications within 24 hours. You'll receive an email once a decision has been made.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 text-left space-y-3 text-sm">
            <p className="font-medium">What happens next</p>
            <div className="space-y-2">
              {[
                {
                  n: 1,
                  text: "Our team reviews your company details, aircraft speciality, and compliance documents.",
                },
                {
                  n: 2,
                  text: "If approved, you'll receive an automated email with a link to set your password and access the platform immediately.",
                },
                {
                  n: 3,
                  text: "If we need anything, we'll contact you directly to request missing items.",
                },
              ].map(({ n, text }) => (
                <div key={n} className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {n}
                  </div>
                  <p className="text-muted-foreground text-xs leading-5">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps = ["Company", "Speciality", "Compliance", "Contacts", "Account"];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-6 py-4 flex items-center gap-3">
        <Building2 className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold">PlaneServe Supplier Application</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-10">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-1 flex-1">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  i + 1 < step
                    ? "bg-emerald-500 text-white"
                    : i + 1 === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1 < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block ${i + 1 === step ? "font-medium text-foreground" : "text-muted-foreground"}`}
              >
                {label}
              </span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          {step === 1 && <Step1 form={form} set={set} />}
          {step === 2 && <Step2 form={form} set={set} />}
          {step === 3 && <Step3 form={form} set={set} />}
          {step === 4 && <Step4 form={form} set={set} />}
          {step === 5 && (
            <Step5
              form={form}
              set={set}
              loading={mutation.isPending}
              error={mutation.error?.message}
              onSubmit={() => mutation.mutate()}
            />
          )}
        </div>

        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 5 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !form.name}
              className="flex items-center gap-1 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step1({
  form,
  set,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Company information</h2>
      <p className="text-sm text-muted-foreground mb-6">Tell us about your company.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Company name" required>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Aviall Services Inc."
          />
        </Field>
        <Field label="Trading name (if different)">
          <input
            className={inputCls}
            value={form.tradingName}
            onChange={(e) => set("tradingName", e.target.value)}
            placeholder="Aviall"
          />
        </Field>
        <Field label="Country" required>
          <input
            className={inputCls}
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            placeholder="United States"
          />
        </Field>
        <Field label="VAT / Tax reference">
          <input
            className={inputCls}
            value={form.vatRef}
            onChange={(e) => set("vatRef", e.target.value)}
            placeholder="GB123456789"
          />
        </Field>
        <div className="col-span-2">
          <Field label="Address">
            <input
              className={inputCls}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="123 Aviation Way, Dallas, TX 75201"
            />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Website">
            <input
              className={inputCls}
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://www.aviall.com"
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Step2({
  form,
  set,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Speciality & inventory</h2>
      <p className="text-sm text-muted-foreground mb-6">Help us match you to the right RFQs.</p>
      <div className="space-y-4">
        <Field label="Aircraft types covered">
          <textarea
            rows={3}
            className={inputCls}
            value={form.aircraftTypes}
            onChange={(e) => set("aircraftTypes", e.target.value)}
            placeholder="Cessna Citation, Bombardier Challenger, Embraer Phenom…"
          />
        </Field>
        <Field label="ATA systems">
          <textarea
            rows={3}
            className={inputCls}
            value={form.ataSystems}
            onChange={(e) => set("ataSystems", e.target.value)}
            placeholder="ATA 32 Landing Gear, ATA 34 Navigation, ATA 79 Oil…"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Inventory platform">
            <select
              className={inputCls}
              value={form.inventoryPlatform}
              onChange={(e) => set("inventoryPlatform", e.target.value)}
            >
              {["ILS", "PartsBase", "ePlane", "Own system", "None"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Typical response time">
            <select
              className={inputCls}
              value={form.typicalResponseTime}
              onChange={(e) => set("typicalResponseTime", e.target.value)}
            >
              {["<1hr", "1-4hr", "4-8hr", "8-24hr"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
        </div>
        <div>
          <p className="text-xs font-medium text-foreground/70 mb-2">Stock type</p>
          <div className="flex gap-4">
            {["Own warehouse", "Broker", "Both"].map((v) => (
              <label key={v} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="stockType"
                  value={v}
                  checked={form.stockType === v}
                  onChange={() => set("stockType", v)}
                  className="h-4 w-4"
                />
                {v}
              </label>
            ))}
          </div>
        </div>
        <Field label="Geographic coverage">
          <textarea
            rows={2}
            className={inputCls}
            value={form.geographicCoverage}
            onChange={(e) => set("geographicCoverage", e.target.value)}
            placeholder="North America, Europe, Middle East…"
          />
        </Field>
      </div>
    </div>
  );
}

function Step3({
  form,
  set,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Compliance documents</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Upload relevant certifications. Documents are reviewed as part of onboarding.
      </p>
      <div className="space-y-3">
        {COMPLIANCE_DOCS.map((doc) => {
          const entry = form.docs[doc] ?? { file: "", expiry: "" };
          return (
            <div
              key={doc}
              className="border border-border rounded-lg p-4 grid grid-cols-2 gap-3 items-end"
            >
              <div className="col-span-2">
                <p className="text-sm font-medium mb-1">{doc}</p>
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 border border-dashed border-border rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted/30">
                    {entry.file ? (
                      <span className="text-foreground font-medium truncate">{entry.file}</span>
                    ) : (
                      "Choose file…"
                    )}
                  </div>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0]?.name ?? "";
                      set("docs", { ...form.docs, [doc]: { ...entry, file } });
                    }}
                  />
                </label>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Expiry date</label>
                <input
                  type="date"
                  className={inputCls}
                  value={entry.expiry}
                  onChange={(e) =>
                    set("docs", { ...form.docs, [doc]: { ...entry, expiry: e.target.value } })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step4({
  form,
  set,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Contacts & payment</h2>
      <p className="text-sm text-muted-foreground mb-6">Who should we call in an AOG situation?</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary AOG contact name" required>
          <input
            className={inputCls}
            value={form.primaryAogContact}
            onChange={(e) => set("primaryAogContact", e.target.value)}
            placeholder="John Smith"
          />
        </Field>
        <Field label="Direct mobile (24/7)" required>
          <input
            className={inputCls}
            value={form.primaryAogMobile}
            onChange={(e) => set("primaryAogMobile", e.target.value)}
            placeholder="+1 800 000 0000"
          />
        </Field>
        <Field label="Secondary AOG contact name + mobile">
          <input
            className={inputCls}
            value={form.secondaryAogContact}
            onChange={(e) => set("secondaryAogContact", e.target.value)}
            placeholder="Jane Doe +1 800 000 0001"
          />
        </Field>
        <Field label="Accounts contact name + email">
          <input
            className={inputCls}
            value={form.accountsContact}
            onChange={(e) => set("accountsContact", e.target.value)}
            placeholder="Accounts accounts@company.com"
          />
        </Field>
        <Field label="Payment method">
          <select
            className={inputCls}
            value={form.paymentMethod}
            onChange={(e) => set("paymentMethod", e.target.value)}
          >
            {["Bank Transfer", "SWIFT", "Credit Card"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Currency">
          <select
            className={inputCls}
            value={form.paymentCurrency}
            onChange={(e) => set("paymentCurrency", e.target.value)}
          >
            {["USD", "EUR", "GBP"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Payment terms">
          <select
            className={inputCls}
            value={form.paymentTerms}
            onChange={(e) => set("paymentTerms", e.target.value)}
          >
            {["Net 7", "Net 14", "Net 30"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}

function Step5({
  form,
  set,
  loading,
  error,
  onSubmit,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  loading: boolean;
  error?: string;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Create your account</h2>
        <p className="text-sm text-muted-foreground">
          This will be your login to the PlaneServe supplier portal.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" required>
          <input
            className={inputCls}
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="John"
          />
        </Field>
        <Field label="Last name" required>
          <input
            className={inputCls}
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Smith"
          />
        </Field>
        <div className="col-span-2">
          <Field label="Email address" required>
            <input
              type="email"
              className={inputCls}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="john@company.com"
            />
          </Field>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={form.agreed}
          onChange={(e) => set("agreed", e.target.checked)}
        />
        <span className="text-sm text-muted-foreground">
          I accept the PlaneServe{" "}
          <a href="#" className="text-primary underline">
            supplier terms & conditions
          </a>
          .
        </span>
      </label>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">{error}</p>
      )}

      <button
        onClick={onSubmit}
        disabled={!form.agreed || !form.firstName || !form.email || loading}
        className="w-full rounded-md bg-primary text-primary-foreground text-sm font-semibold py-3 disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit application"}
      </button>
    </div>
  );
}
