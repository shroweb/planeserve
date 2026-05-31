import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Section, Eyebrow, H2 } from "@/components/site/Section";
import { Role } from "@/lib/db/schema";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { upsertProfile } from "@/lib/app.functions";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

const roles: Role[] = ["Owner", "Operator", "Management Company"];

function Signup() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    role: "Operator" as Role,
    password: "",
  });
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
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

    toast.success("Account created.");
    nav({ to: "/enrol" });
  }

  return (
    <PublicLayout>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Eyebrow>Customer Account</Eyebrow>
            <H2>Create your PlaneServe account.</H2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Create a free owner/operator account first. Payment is only taken when you enrol an
              aircraft and choose its monthly or annual support plan.
            </p>
            <div className="mt-8 space-y-3 rounded-md border border-border bg-card p-5 text-sm">
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
            className="grid gap-4 rounded-md border border-border bg-card p-8 shadow-[0_18px_50px_oklch(0.2_0.02_250_/_0.06)] md:grid-cols-2"
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
                  className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
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
              <button className="rounded-sm bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
                Create free account
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
      className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
    />
  );
}
