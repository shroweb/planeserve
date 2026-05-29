import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Section, Eyebrow, H2 } from "@/components/site/Section";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
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

    nav({ to: "/dashboard" });
  }

  return (
    <PublicLayout>
      <Section>
        <Eyebrow>Member Login</Eyebrow>
        <H2>Sign in to PlaneServe.</H2>
        <form
          onSubmit={submit}
          className="mt-10 max-w-md rounded-md border border-border bg-card p-8"
        >
          <label className="block">
            <div className="mb-1.5 text-xs font-medium">Email</div>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
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
              className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </label>
          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-sm bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            New customer?{" "}
            <Link to="/enrol" className="text-foreground underline">
              Enrol an aircraft
            </Link>{" "}
            or{" "}
            <Link to="/signup" className="text-foreground underline">
              create a free account
            </Link>
            .
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            PlaneServe operations?{" "}
            <Link to="/admin/login" className="text-foreground underline">
              Admin login
            </Link>
            .
          </p>
        </form>
      </Section>
    </PublicLayout>
  );
}
