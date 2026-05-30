import { createFileRoute, Link } from "@tanstack/react-router";
import { createSubscriberEnrolment, createStripeSubscription } from "@/lib/app.functions";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { CheckCircle2, ChevronRight, ChevronLeft, Plane, Lock } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const Route = createFileRoute("/enrol")({
  component: EnrolPage,
});

const USAGE_TYPES = [
  {
    key: "Private Owner",
    title: "Private Owner",
    desc: "Individual aircraft owner operating privately",
  },
  {
    key: "Managed",
    title: "Managed",
    desc: "Aircraft managed by a management company",
  },
  {
    key: "Commercial",
    title: "Commercial",
    desc: "Commercial operations or charter",
  },
];

const CATEGORIES = [
  "Business Jet",
  "Turboprop",
  "Single Engine",
  "Multi Engine",
  "Helicopter",
] as const;

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
  usageType: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  whatsapp: string;
  companyName: string;
  managementCompany: string;
  makeModel: string;
  category: (typeof CATEGORIES)[number];
  registration: string;
  serialNumber: string;
  year: string;
  baseAirport: string;
  ownerOperatorName: string;
  engineManufacturer: string;
  engineType: string;
  engineCount: number;
  engineSerialNumbers: string;
  maintenanceProgramme: string;
  aircraftNationality: string;
  insurer: string;
  policyReference: string;
  totalAirframeHours: string;
  primaryContactName: string;
  picDirectMobile: string;
  opsContactName: string;
  opsContactEmail: string;
  managerName: string;
  managerEmail: string;
  plan: "monthly" | "annual";
  agreed: boolean;
};

const defaultForm: FormData = {
  usageType: "",
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  whatsapp: "",
  companyName: "",
  managementCompany: "",
  makeModel: "",
  category: "Business Jet",
  registration: "",
  serialNumber: "",
  year: "",
  baseAirport: "",
  ownerOperatorName: "",
  engineManufacturer: "",
  engineType: "",
  engineCount: 1,
  engineSerialNumbers: "",
  maintenanceProgramme: "",
  aircraftNationality: "",
  insurer: "",
  policyReference: "",
  totalAirframeHours: "",
  primaryContactName: "",
  picDirectMobile: "",
  opsContactName: "",
  opsContactEmail: "",
  managerName: "",
  managerEmail: "",
  plan: "monthly",
  agreed: false,
};

function validateStep(step: number, form: FormData): string | null {
  if (step === 1) {
    if (!form.usageType) return "Please select a usage type.";
  }
  if (step === 2) {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "A valid email address is required.";
    if (!form.mobile.trim()) return "Mobile number is required.";
  }
  if (step === 3) {
    if (!form.makeModel.trim()) return "Aircraft make & model is required.";
    if (!form.registration.trim()) return "Registration is required.";
    if (!form.category) return "Aircraft category is required.";
    if (!form.year.trim()) return "Year of manufacture is required.";
    if (!form.serialNumber.trim()) return "Aircraft serial number is required.";
    if (!form.baseAirport.trim()) return "Base airport ICAO is required.";
    if (!form.ownerOperatorName.trim()) return "Owner / operator name is required.";
  }
  return null;
}

function EnrolPage() {
  const session = authClient.useSession();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [stepError, setStepError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ ref: string; email: string } | null>(null);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => {
    setStepError(null);
    setForm((f) => ({ ...f, [k]: v }));
  };

  if (confirmation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-2">You're enrolled!</h1>
            <p className="text-muted-foreground text-sm">
              Welcome to PlaneServe AOG Support. Your reference is{" "}
              <span className="font-mono font-semibold text-foreground">{confirmation.ref}</span>.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 text-left space-y-3 text-sm">
            <p className="font-medium">What happens next</p>
            <div className="space-y-2">
              {[
                {
                  n: 1,
                  text: "A PlaneServe handler will call you within 2 hours to run through your aircraft profile.",
                },
                {
                  n: 2,
                  text: "Your handler confirms engine details, AMO contacts, PIC mobile, and delivers your Parts Intelligence briefing.",
                },
                {
                  n: 3,
                  text: "Handler marks your aircraft as verified — your dashboard updates to AOG Cover active immediately.",
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
          <div className="bg-card border border-border rounded-xl p-5 text-left space-y-2 text-sm">
            <p className="font-medium text-foreground">Set your password to sign in</p>
            <p className="text-muted-foreground text-xs leading-5">
              A password-set link has been sent to{" "}
              <span className="font-mono font-medium text-foreground">{confirmation.email}</span>.
              Click the link in your email to choose a password, then sign in to access your
              dashboard.
            </p>
          </div>
          <Link
            to="/login"
            className="block w-full rounded-md bg-primary text-primary-foreground text-sm font-medium py-2.5 text-center"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const steps = ["Usage type", "Your details", "Aircraft", "Contacts", "Review & pay"];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Plane className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">PlaneServe Subscriber Enrolment</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Already have an account?</span>
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Signed-in banner */}
        {session.data?.user && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-5 py-3">
            <p className="text-sm">
              Signed in as <span className="font-medium">{session.data.user.email}</span>. Enrolling
              a new aircraft to your existing account.
            </p>
            <Link
              to="/dashboard"
              className="text-xs text-primary font-medium hover:underline shrink-0 ml-4"
            >
              Back to dashboard
            </Link>
          </div>
        )}

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-10">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-1 flex-1">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  i + 1 < step
                    ? "bg-success text-success-foreground"
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
          {step === 1 && <Step1 value={form.usageType} onChange={(v) => set("usageType", v)} />}
          {step === 2 && (
            <Step2 form={form} set={set} showCompany={form.usageType !== "Private Owner"} />
          )}
          {step === 3 && <Step3 form={form} set={set} />}
          {step === 4 && <Step4 form={form} set={set} />}
          {step === 5 && (
            <Elements stripe={stripePromise}>
              <Step5
                form={form}
                set={set}
                onComplete={(ref, email) => setConfirmation({ ref, email })}
              />
            </Elements>
          )}
        </div>

        {stepError && (
          <p className="mt-3 text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-4 py-2.5">
            {stepError}
          </p>
        )}

        <div className="flex justify-between mt-4">
          {step > 1 ? (
            <button
              onClick={() => {
                setStepError(null);
                setStep((s) => s - 1);
              }}
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
              onClick={() => {
                const err = validateStep(step, form);
                if (err) {
                  setStepError(err);
                  return;
                }
                setStepError(null);
                setStep((s) => s + 1);
              }}
              className="flex items-center gap-1 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium"
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

function Step1({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">How will you use PlaneServe?</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Select the option that best describes your aircraft operation.
      </p>
      <div className="space-y-3">
        {USAGE_TYPES.map((u) => (
          <button
            key={u.key}
            onClick={() => onChange(u.key)}
            className={`w-full text-left rounded-xl border-2 p-5 transition-all ${
              value === u.key
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <p className="font-semibold text-sm">{u.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{u.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2({
  form,
  set,
  showCompany,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  showCompany: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Your details</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Tell us about yourself. We'll use this to create your account.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" required>
          <input
            className={inputCls}
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="James"
          />
        </Field>
        <Field label="Last name" required>
          <input
            className={inputCls}
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Davidson"
          />
        </Field>
        <Field label="Email address" required>
          <input
            type="email"
            className={inputCls}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="james@example.com"
          />
        </Field>
        <Field label="Mobile number" required>
          <input
            className={inputCls}
            value={form.mobile}
            onChange={(e) => set("mobile", e.target.value)}
            placeholder="+44 7700 900000"
          />
        </Field>
        <Field label="WhatsApp number">
          <input
            className={inputCls}
            value={form.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="Same as mobile or different"
          />
        </Field>
        {showCompany && (
          <>
            <Field label="Company name">
              <input
                className={inputCls}
                value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)}
                placeholder="Davidson Aviation Ltd"
              />
            </Field>
            <Field label="Management company name">
              <input
                className={inputCls}
                value={form.managementCompany}
                onChange={(e) => set("managementCompany", e.target.value)}
                placeholder="Jet Management Group"
              />
            </Field>
          </>
        )}
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
      <h2 className="text-lg font-semibold mb-1">Aircraft details</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Your aircraft profile helps us respond faster when you have an AOG.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Make & model" required>
          <input
            className={inputCls}
            value={form.makeModel}
            onChange={(e) => set("makeModel", e.target.value)}
            placeholder="Cessna Citation XLS+"
          />
        </Field>
        <Field label="Category" required>
          <select
            className={inputCls}
            value={form.category}
            onChange={(e) => set("category", e.target.value as FormData["category"])}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Registration" required>
          <input
            className={inputCls}
            value={form.registration}
            onChange={(e) => set("registration", e.target.value.toUpperCase())}
            placeholder="G-ABCD"
          />
        </Field>
        <Field label="Year of manufacture" required>
          <input
            type="number"
            className={inputCls}
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            placeholder="2018"
          />
        </Field>
        <Field label="Aircraft serial number" required>
          <input
            className={inputCls}
            value={form.serialNumber}
            onChange={(e) => set("serialNumber", e.target.value)}
            placeholder="560-5800"
          />
        </Field>
        <Field label="Base airport ICAO" required>
          <input
            className={inputCls}
            value={form.baseAirport}
            onChange={(e) => set("baseAirport", e.target.value.toUpperCase())}
            placeholder="EGLL"
          />
        </Field>
        <Field label="Owner / operator name" required>
          <input
            className={inputCls}
            value={form.ownerOperatorName}
            onChange={(e) => set("ownerOperatorName", e.target.value)}
            placeholder="Acme Aviation Ltd"
          />
        </Field>
        <Field label="Engine manufacturer">
          <input
            className={inputCls}
            value={form.engineManufacturer}
            onChange={(e) => set("engineManufacturer", e.target.value)}
            placeholder="Pratt & Whitney"
          />
        </Field>
        <Field label="Engine type & series">
          <input
            className={inputCls}
            value={form.engineType}
            onChange={(e) => set("engineType", e.target.value)}
            placeholder="PW545C"
          />
        </Field>
        <Field label="Engine count">
          <select
            className={inputCls}
            value={form.engineCount}
            onChange={(e) => set("engineCount", Number(e.target.value))}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
        <div className="col-span-2">
          <Field label="Engine serial numbers">
            <textarea
              rows={2}
              className={inputCls}
              value={form.engineSerialNumbers}
              onChange={(e) => set("engineSerialNumbers", e.target.value)}
              placeholder="PCE-EA0001, PCE-EA0002"
            />
          </Field>
        </div>
        <Field label="Maintenance programme">
          <input
            className={inputCls}
            value={form.maintenanceProgramme}
            onChange={(e) => set("maintenanceProgramme", e.target.value)}
            placeholder="CAMP, Cescom, etc."
          />
        </Field>
        <Field label="Aircraft nationality">
          <input
            className={inputCls}
            value={form.aircraftNationality}
            onChange={(e) => set("aircraftNationality", e.target.value)}
            placeholder="British"
          />
        </Field>
        <Field label="Insurer name">
          <input
            className={inputCls}
            value={form.insurer}
            onChange={(e) => set("insurer", e.target.value)}
            placeholder="Global Aviation Underwriters"
          />
        </Field>
        <Field label="Policy reference">
          <input
            className={inputCls}
            value={form.policyReference}
            onChange={(e) => set("policyReference", e.target.value)}
            placeholder="POL-2024-00001"
          />
        </Field>
        <Field label="Total airframe hours">
          <input
            className={inputCls}
            value={form.totalAirframeHours}
            onChange={(e) => set("totalAirframeHours", e.target.value)}
            placeholder="4820"
          />
        </Field>
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
      <h2 className="text-lg font-semibold mb-1">Contacts</h2>
      <p className="text-sm text-muted-foreground mb-6">
        These contacts may be called directly in an AOG situation.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary contact name" required>
          <input
            className={inputCls}
            value={form.primaryContactName || `${form.firstName} ${form.lastName}`.trim()}
            onChange={(e) => set("primaryContactName", e.target.value)}
          />
        </Field>
        <Field label="PIC direct mobile (24/7)" required>
          <input
            className={inputCls}
            value={form.picDirectMobile}
            onChange={(e) => set("picDirectMobile", e.target.value)}
            placeholder="+44 7700 900001"
          />
        </Field>
        <Field label="Ops contact name">
          <input
            className={inputCls}
            value={form.opsContactName}
            onChange={(e) => set("opsContactName", e.target.value)}
            placeholder="Sarah Smith"
          />
        </Field>
        <Field label="Ops contact email">
          <input
            type="email"
            className={inputCls}
            value={form.opsContactEmail}
            onChange={(e) => set("opsContactEmail", e.target.value)}
            placeholder="ops@company.com"
          />
        </Field>
        <Field label="Manager name (optional)">
          <input
            className={inputCls}
            value={form.managerName}
            onChange={(e) => set("managerName", e.target.value)}
            placeholder="Tom Richards"
          />
        </Field>
        <Field label="Manager email (optional)">
          <input
            type="email"
            className={inputCls}
            value={form.managerEmail}
            onChange={(e) => set("managerEmail", e.target.value)}
            placeholder="tom@company.com"
          />
        </Field>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        {title}
      </p>
      <div className="bg-muted/30 rounded-lg divide-y divide-border">
        {items.map(({ label, value }) => (
          <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right max-w-[55%]">{value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step5({
  form,
  set,
  onComplete,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  onComplete: (ref: string, email: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plan = form.plan;

  async function handleSubmit() {
    if (!stripe || !elements) return;
    if (!form.agreed) {
      setCardError("Please accept the subscriber agreement.");
      return;
    }

    setLoading(true);
    setCardError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      return;
    }

    // 1. Create payment method
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { name: `${form.firstName} ${form.lastName}`, email: form.email },
    });

    if (pmError || !paymentMethod) {
      setCardError(pmError?.message ?? "Card error. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Create subscription on server
    let subscriptionResult: any;
    try {
      subscriptionResult = await createStripeSubscription({
        data: {
          paymentMethodId: paymentMethod.id,
          email: form.email,
          name: `${form.firstName} ${form.lastName}`,
          plan,
        },
      });
    } catch (e: any) {
      setCardError(e?.message ?? "Failed to create subscription. Please try again.");
      setLoading(false);
      return;
    }

    // 3. Confirm payment intent if required
    if (subscriptionResult.clientSecret) {
      const { error: confirmError } = await stripe.confirmCardPayment(
        subscriptionResult.clientSecret,
      );
      if (confirmError) {
        setCardError(confirmError.message ?? "Payment failed. Please try again.");
        setLoading(false);
        return;
      }
    }

    // 4. Create account + aircraft record
    try {
      const result = await createSubscriberEnrolment({
        data: {
          ...form,
          stripeSubscriptionId: subscriptionResult.subscriptionId,
          stripeCustomerId: subscriptionResult.customerId,
        } as any,
      });
      // Send password set email so the new user can log in
      authClient
        .requestPasswordReset({ email: form.email, redirectTo: "/set-password" })
        .catch(() => {});
      onComplete(result.ref, form.email);
    } catch (e: any) {
      setCardError(e?.message ?? "Account creation failed. Contact support.");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Review & Subscribe</h2>
        <p className="text-sm text-muted-foreground">
          Check your details then enter your card to subscribe.
        </p>
      </div>

      <ReviewSection
        title="Your details"
        items={[
          { label: "Name", value: `${form.firstName} ${form.lastName}` },
          { label: "Email", value: form.email },
          { label: "Mobile", value: form.mobile },
          { label: "Usage type", value: form.usageType },
        ]}
      />

      <ReviewSection
        title="Aircraft"
        items={[
          { label: "Registration", value: form.registration },
          { label: "Make & model", value: form.makeModel },
          { label: "Category", value: form.category },
          { label: "Year", value: form.year },
          { label: "Base airport", value: form.baseAirport },
          { label: "Engine", value: `${form.engineManufacturer} ${form.engineType}`.trim() },
          { label: "Total airframe hours", value: form.totalAirframeHours },
        ]}
      />

      <ReviewSection
        title="Contacts"
        items={[
          { label: "Primary contact", value: form.primaryContactName },
          { label: "PIC mobile (24/7)", value: form.picDirectMobile },
          { label: "Ops contact", value: form.opsContactName },
        ]}
      />

      {/* Plan selector */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Select a plan for {form.registration || "this aircraft"}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => set("plan", "monthly")}
            className={`rounded-xl border-2 p-4 text-left transition-all ${plan !== "annual" ? "border-primary bg-primary/5" : "border-border"}`}
          >
            <p className="font-semibold">Monthly</p>
            <p className="text-2xl font-bold mt-1">$100</p>
            <p className="text-xs text-muted-foreground mt-0.5">per month · cancel anytime</p>
          </button>
          <button
            type="button"
            onClick={() => set("plan", "annual")}
            className={`rounded-xl border-2 p-4 text-left transition-all relative ${plan === "annual" ? "border-primary bg-primary/5" : "border-border"}`}
          >
            <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-accent text-[oklch(0.16_0.02_250)] px-2 py-0.5 rounded">
              Best value
            </span>
            <p className="font-semibold">Annual</p>
            <p className="text-2xl font-bold mt-1">$1,000</p>
            <p className="text-xs text-muted-foreground mt-0.5">per year · two months free</p>
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Each aircraft is billed separately. Add more aircraft any time from your dashboard.
        </p>
      </div>

      {/* Card input */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Payment
        </p>
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "oklch(0.2 0.02 250)",
                  "::placeholder": { color: "oklch(0.6 0 0)" },
                },
                invalid: { color: "oklch(0.55 0.22 25)" },
              },
            }}
          />
        </div>
        <p className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3" />
          Secured by Stripe. PlaneServe never stores your card details.
        </p>
      </div>

      {/* Agreement */}
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
            subscriber agreement
          </a>{" "}
          and confirm all details are accurate.
        </span>
      </label>

      {cardError && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5">
          {cardError}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!stripe || !form.agreed || loading}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold py-3 disabled:opacity-50 transition-opacity"
      >
        <Lock className="h-4 w-4" />
        {loading
          ? "Processing…"
          : `Subscribe — ${plan === "annual" ? "$1,000/year" : "$100/month"}`}
      </button>
    </div>
  );
}
