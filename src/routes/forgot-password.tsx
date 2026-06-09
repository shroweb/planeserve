import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Section, Eyebrow, H2 } from "@/components/site/Section";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Always call, regardless of whether account exists (better-auth handles silently)
    await authClient.requestPasswordReset({ email, redirectTo: "/set-password" }).catch(() => {});
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <PublicLayout>
      <Section>
        <Eyebrow>Password Reset</Eyebrow>
        <H2>Forgot your password?</H2>
        {submitted ? (
          <div className="mt-10 max-w-md rounded-md border border-border bg-card p-8">
            <p className="text-sm text-foreground font-medium mb-2">Reset link sent</p>
            <p className="text-sm text-muted-foreground">
              If an account exists for{" "}
              <span className="font-mono font-medium text-foreground">{email}</span>, a password
              reset link has been sent. Check your inbox (and spam folder).
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              <Link to="/login" className="text-foreground underline">
                Back to login
              </Link>
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-10 max-w-md rounded-md border border-border bg-card p-8"
          >
            <p className="text-sm text-muted-foreground mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <label className="block">
              <div className="mb-1.5 text-xs font-medium">Email</div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/55 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-sm bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <p className="mt-4 text-xs text-muted-foreground">
              <Link to="/login" className="text-foreground underline">
                Back to login
              </Link>
            </p>
          </form>
        )}
      </Section>
    </PublicLayout>
  );
}
