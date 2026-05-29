import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { ensureSession, getSessionUser, updateProfile, changePassword } from "@/lib/app.functions";
import { useState } from "react";
import { toast } from "sonner";
import { User, Lock, Save } from "lucide-react";

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 placeholder:text-muted-foreground/60";

export const Route = createFileRoute("/account")({
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: Account,
});

function Account() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ["session-user"],
    queryFn: () => getSessionUser(),
  });

  const [profileForm, setProfileForm] = useState<{
    name: string;
    company: string;
    phone: string;
  } | null>(null);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  // Initialise form once user loads
  if (user && profileForm === null) {
    setProfileForm({ name: user.name ?? "", company: user.company ?? "", phone: user.phone ?? "" });
  }

  const profileMutation = useMutation({
    mutationFn: () =>
      updateProfile({
        data: { name: profileForm!.name, company: profileForm!.company, phone: profileForm!.phone },
      }),
    onSuccess: () => {
      toast.success("Profile updated.");
      queryClient.invalidateQueries({ queryKey: ["session-user"] });
    },
    onError: () => toast.error("Failed to update profile."),
  });

  const pwMutation = useMutation({
    mutationFn: () =>
      changePassword({ data: { currentPassword: pwForm.current, newPassword: pwForm.next } }),
    onSuccess: () => {
      toast.success("Password changed.");
      setPwForm({ current: "", next: "", confirm: "" });
      setPwError("");
    },
    onError: () => {
      setPwError("Current password incorrect or an error occurred.");
    },
  });

  const handlePwSubmit = () => {
    setPwError("");
    if (pwForm.next.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError("Passwords do not match.");
      return;
    }
    pwMutation.mutate();
  };

  if (!user || !profileForm) return null;

  return (
    <AppShell>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Account</h1>

        {/* Profile section */}
        <div className="rounded-xl border border-border bg-card mb-6">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Profile details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full name">
                <input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((f) => ({ ...f!, name: e.target.value }))}
                  className={inputCls}
                  placeholder="Your name"
                />
              </Field>
              <Field label="Company / operator">
                <input
                  value={profileForm.company}
                  onChange={(e) => setProfileForm((f) => ({ ...f!, company: e.target.value }))}
                  className={inputCls}
                  placeholder="Company name"
                />
              </Field>
            </div>
            <Field label="Phone number">
              <input
                value={profileForm.phone}
                onChange={(e) => setProfileForm((f) => ({ ...f!, phone: e.target.value }))}
                className={inputCls}
                placeholder="+1 555 000 0000"
              />
            </Field>
            <div className="pt-1 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Email: <span className="font-medium text-foreground">{user.email}</span>
                <span className="ml-2 text-muted-foreground/60">(contact support to change)</span>
              </div>
              <button
                onClick={() => profileMutation.mutate()}
                disabled={profileMutation.isPending}
                className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                {profileMutation.isPending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Password section */}
        <div className="rounded-xl border border-border bg-card mb-6">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Change password</h2>
          </div>
          <div className="p-6 space-y-4">
            <Field label="Current password">
              <input
                type="password"
                value={pwForm.current}
                onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                className={inputCls}
                autoComplete="current-password"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="New password">
                <input
                  type="password"
                  value={pwForm.next}
                  onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                  className={inputCls}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                />
              </Field>
              <Field label="Confirm new password">
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                  className={inputCls}
                  autoComplete="new-password"
                />
              </Field>
            </div>
            {pwError && <p className="text-sm text-destructive">{pwError}</p>}
            <div className="pt-1 flex justify-end">
              <button
                onClick={handlePwSubmit}
                disabled={
                  pwMutation.isPending || !pwForm.current || !pwForm.next || !pwForm.confirm
                }
                className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {pwMutation.isPending ? "Updating…" : "Update password"}
              </button>
            </div>
          </div>
        </div>

        {/* Read-only info */}
        <div className="rounded-xl border border-border bg-card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-muted-foreground">Account info</h2>
          </div>
          <div className="divide-y divide-border">
            <Row k="Role" v={user.role} />
            <Row
              k="Member since"
              v={new Date(user.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between px-6 py-3 text-sm">
      <div className="text-muted-foreground">{k}</div>
      <div className="font-medium">{v}</div>
    </div>
  );
}
