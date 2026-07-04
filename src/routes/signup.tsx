import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Section, Eyebrow, H2 } from "@/components/site/Section";
import { Role } from "@/lib/db/schema";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { sendAccountWelcomeEmail, upsertProfile } from "@/lib/app.functions";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/signup")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: Signup,
});

const roles: Role[] = ["Owner", "Operator", "Management Company"];
const controlClass =
  "h-12 w-full rounded-sm border border-input bg-background px-3.5 text-sm placeholder:text-muted-foreground/55 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";
const primaryButtonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60";

function Signup() {
  const { redirect } = Route.useSearch();
  const redirectTo =
    redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : "/dashboard";
  const isEnrolRedirect = redirectTo === "/enrol";
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    role: "Operator" as Role,
    password: "",
  });
  const [completeEmail, setCompleteEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    const result = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (result.error) {
      toast.error(result.error.message || "Unable to create account.");
      return;
    }

    await upsertProfile({
      data: {
        name: form.name,
        company: form.company,
        phone: form.phone,
        role: form.role,
      },
    });

    const welcomeRedirectPath = isEnrolRedirect ? "/login?redirect=/enrol" : "/login";
    const welcome = await sendAccountWelcomeEmail({
      data: { email: form.email, name: form.name, redirectPath: welcomeRedirectPath },
    }).catch((error) => ({
      ok: false,
      reason: error instanceof Error ? error.message : "Welcome email failed.",
    }));
    if (!welcome.ok) {
      setEmailStatus(
        welcome.reason ??
          "Account created, but the welcome email did not send. Check the Resend configuration.",
      );
      toast.warning("Account created, but the welcome email did not send.");
    } else {
      setEmailStatus("Welcome email sent.");
    }
    setCompleteEmail(form.email);
    toast.success("Account created.");
  }

  if (completeEmail) {
    return (
      <PublicLayout>
        <Section>
          <div className="mx-auto max-w-lg rounded-sm border border-border bg-card p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <div className="mt-6">
              <Eyebrow>All Done</Eyebrow>
            </div>
            <H2>Your account is ready.</H2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              We created your Aircraft Program account for{" "}
              <span className="font-mono font-medium text-foreground">{completeEmail}</span>. You
              can now sign in{isEnrolRedirect ? " and continue enrolling your aircraft" : ""}.
            </p>
            {emailStatus && (
              <p
                className={`mt-4 rounded-sm border px-4 py-3 text-xs ${
                  emailStatus === "Welcome email sent."
                    ? "border-success/25 bg-success/10 text-success"
                    : "border-amber-300 bg-amber-50 text-amber-800"
                }`}
              >
                {emailStatus}
              </p>
            )}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link to="/login" search={{ redirect: redirectTo }} className={primaryButtonClass}>
                Click here to login
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={isEnrolRedirect ? "/enrol" : "/"}
                className="inline-flex h-12 items-center justify-center rounded-sm border border-input bg-background px-5 text-sm font-semibold text-foreground hover:border-accent/40 hover:bg-accent/5"
              >
                {isEnrolRedirect ? "Back to enrolment" : "Back to website"}
              </Link>
            </div>
          </div>
        </Section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Eyebrow>Customer Account</Eyebrow>
            <H2>Create your Aircraft Program account.</H2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Create a free owner/operator account first. Payment is only taken when you enrol an
              aircraft and choose its monthly or annual support plan.
            </p>
            <div className="mt-8 space-y-3 rounded-sm border border-border bg-card p-5 text-sm shadow-sm">
              {[
                "1. Create a free account and company profile",
                "2. Enrol an aircraft and choose its support plan",
                "3. Pay per aircraft, then complete cover activation",
              ].map((step) => (
                <div key={step} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  {step}
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={submit}
            className="grid gap-4 rounded-sm border border-border bg-card p-8 shadow-[0_18px_50px_oklch(0.2_0.02_250_/_0.06)] md:grid-cols-2"
          >
            <Field label="Full name">
              <Input value={form.name} onChange={(name) => setForm((f) => ({ ...f, name }))} />
            </Field>
            <Field label="Company">
              <Input
                value={form.company}
                onChange={(company) => setForm((f) => ({ ...f, company }))}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(email) => setForm((f) => ({ ...f, email }))}
              />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(phone) => setForm((f) => ({ ...f, phone }))} />
            </Field>
            <div>
              <Field label="Account type">
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                  className={controlClass}
                >
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </Field>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Suppliers and maintenance providers should{" "}
                <Link to="/suppliers/apply" className="text-foreground underline">
                  apply to join the network
                </Link>
                .
              </p>
            </div>
            <Field label="Password">
              <Input
                type="password"
                value={form.password}
                onChange={(password) => setForm((f) => ({ ...f, password }))}
              />
            </Field>
            <div className="md:col-span-2">
              <button className={primaryButtonClass}>
                Create free account
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-4 text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-foreground underline">
                  Sign in
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      </Section>
    </PublicLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium">{label}</div>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={controlClass}
    />
  );
}
