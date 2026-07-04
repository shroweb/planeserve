import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/site/AuthLayout";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: Login,
});

function Login() {
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const redirectTo =
    redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : "/dashboard";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (result.error) {
      toast.error(result.error.message || "Incorrect email or password.");
      return;
    }
    nav({ to: redirectTo as never });
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
            className="w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/55 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
            className="w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/55 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>

        <Link
          to="/admin/login"
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-input bg-background px-5 py-3 text-sm font-medium text-foreground hover:border-accent/40 hover:bg-accent/5"
        >
          <ShieldCheck className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
          Enter as Ops Desk (admin)
        </Link>
      </form>

      <p className="mt-6 text-xs text-muted-foreground">
        New customer?{" "}
        <Link to="/signup" search={{ redirect: "/enrol" }} className="text-foreground underline">
          Create an account
        </Link>{" "}
        first, then{" "}
        <Link to="/enrol" className="text-foreground underline">
          Enrol an aircraft
        </Link>{" "}
        .
      </p>
    </AuthLayout>
  );
}
