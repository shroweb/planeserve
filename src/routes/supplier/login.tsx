import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Section, Eyebrow, H2 } from "@/components/site/Section";
import { useState } from "react";
import { Package } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/supplier/login")({
  component: SupplierLoginPage,
});

function SupplierLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: signInError } = await authClient.signIn.email({ email, password });
      if (signInError) {
        setError(signInError.message ?? "Sign in failed");
        return;
      }
      router.navigate({ to: "/supplier" });
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Eyebrow>Supplier Portal</Eyebrow>
            <H2>Sign in to your RFQ inbox.</H2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              The supplier portal is for approved Aircraft Program partners to receive RFQs, submit quotes
              and manage their company profile.
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              Not a supplier yet?{" "}
              <Link to="/suppliers/apply" className="text-foreground underline">
                Apply to become one
              </Link>
              .
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-md border border-border bg-card p-8 shadow-[0_18px_50px_oklch(0.2_0.02_250_/_0.06)]"
          >
            <div className="flex items-center gap-3 border-b border-border pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-accent-on-dark">
                <Package className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight">Supplier Portal</div>
                <div className="text-xs text-muted-foreground">Approved partners only</div>
              </div>
            </div>

            <label className="mt-6 block">
              <div className="mb-1.5 text-xs font-medium">Email</div>
              <input
                type="email"
                required
                autoComplete="email"
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/55 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </label>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-sm bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              <Link to="/forgot-password" className="text-foreground underline">
                Forgot password?
              </Link>
            </p>
          </form>
        </div>
      </Section>
    </PublicLayout>
  );
}
