import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Section, Eyebrow, H2 } from "@/components/site/Section";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";

export const Route = createFileRoute("/set-password")({
  validateSearch: z.object({ token: z.string().optional() }),
  component: SetPassword,
});

function SetPassword() {
  const { token } = useSearch({ from: "/set-password" });
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Missing reset token. Please request a new reset link.");
      return;
    }

    setLoading(true);
    const result = await authClient.resetPassword({ newPassword: password, token });
    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "Failed to set password. The link may have expired.");
      return;
    }

    toast.success("Password set — please sign in.");
    nav({ to: "/login" });
  }

  if (!token) {
    return (
      <PublicLayout>
        <Section>
          <Eyebrow>Set Password</Eyebrow>
          <H2>Invalid reset link</H2>
          <div className="mt-10 max-w-md rounded-md border border-border bg-card p-8">
            <p className="text-sm text-muted-foreground mb-4">
              This reset link is missing a token. Please request a new password reset.
            </p>
            <Link to="/forgot-password" className="text-sm text-primary underline">
              Request a new reset link
            </Link>
          </div>
        </Section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Section>
        <Eyebrow>Set Password</Eyebrow>
        <H2>Choose a new password.</H2>
        <form
          onSubmit={submit}
          className="mt-10 max-w-md rounded-md border border-border bg-card p-8"
        >
          <label className="block">
            <div className="mb-1.5 text-xs font-medium">New password</div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="At least 8 characters"
            />
          </label>
          <label className="mt-4 block">
            <div className="mb-1.5 text-xs font-medium">Confirm new password</div>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="Repeat password"
            />
          </label>
          {error && (
            <p className="mt-3 text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-sm px-4 py-2.5">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-sm bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Setting password…" : "Set password"}
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            <Link to="/login" className="text-foreground underline">
              Back to login
            </Link>
          </p>
        </form>
      </Section>
    </PublicLayout>
  );
}
