import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/site/AuthLayout";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, ShieldCheck } from "lucide-react";
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
    <AuthLayout>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Member sign in
      </div>
      <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">Sign in to PlaneServe</h1>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <div className="mb-1.5 text-sm font-medium">Email</div>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </label>
        <label className="block">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Password</span>
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>

        <Link
          to="/admin/login"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/60"
        >
          <ShieldCheck className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
          Enter as Ops Desk (admin)
        </Link>
      </form>

      <p className="mt-6 text-xs text-muted-foreground">
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
    </AuthLayout>
  );
}
