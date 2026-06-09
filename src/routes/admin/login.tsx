import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Section, Eyebrow, H2 } from "@/components/site/Section";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (result.error) {
      toast.error(result.error.message || "Incorrect email or password.");
      return;
    }

    nav({ to: "/admin" });
  }

  return (
    <PublicLayout>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Eyebrow>Backend Admin</Eyebrow>
            <H2>Sign in to PlaneServe operations.</H2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              Admin access is reserved for the PlaneServe operations team to manage enrolments,
              aircraft records, customers and AOG requests.
            </p>
          </div>

          <form
            onSubmit={submit}
            className="rounded-md border border-border bg-card p-8 shadow-[0_18px_50px_oklch(0.2_0.02_250_/_0.06)]"
          >
            <div className="flex items-center gap-3 border-b border-border pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-accent-on-dark">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight">Operations Console</div>
                <div className="text-xs text-muted-foreground">Admin-only backend access</div>
              </div>
            </div>

            <label className="mt-6 block">
              <div className="mb-1.5 text-xs font-medium">Admin email</div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/55 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </label>
            <label className="mt-4 block">
              <div className="mb-1.5 text-xs font-medium">Password</div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/55 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-sm bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in to Admin"}
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Looking for the customer area?{" "}
              <Link to="/login" className="text-foreground underline">
                Member login
              </Link>
              .
            </p>
          </form>
        </div>
      </Section>
    </PublicLayout>
  );
}
