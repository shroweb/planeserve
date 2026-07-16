import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureSession,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
} from "@/lib/app.functions";
import { useState } from "react";
import { Users, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/team")({
  beforeLoad: async () => {
    const user = await ensureSession().catch(() => {
      throw redirect({ to: "/login" });
    });
    if (user?.isSupplier) {
      throw redirect({ to: "/supplier" });
    }
  },
  component: TeamPage,
});

const ROLES = [
  { value: "pic", label: "Pilot in Command" },
  { value: "ops", label: "Operations" },
  { value: "maintenance", label: "Maintenance" },
  { value: "management", label: "Management" },
  { value: "other", label: "Other" },
];

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40";

function TeamPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ memberName: "", memberEmail: "", role: "pic" });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getTeamMembers(),
  });

  const addMutation = useMutation({
    mutationFn: () => addTeamMember({ data: form }),
    onSuccess: () => {
      toast.success("Team member added.");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      setShowForm(false);
      setForm({ memberName: "", memberEmail: "", role: "pic" });
    },
    onError: () => toast.error("Failed to add member."),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeTeamMember({ data: { id } }),
    onSuccess: () => {
      toast.success("Team member removed.");
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: () => toast.error("Failed to remove member."),
  });

  const roleLabel = (role: string) => ROLES.find((r) => r.value === role)?.label ?? role;

  return (
    <AppShell>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add team members who can be contacted during an AOG situation.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" />
            Add member
          </button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <p className="text-sm font-semibold mb-4">Add team member</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Full name</label>
                <input
                  className={inputCls}
                  value={form.memberName}
                  onChange={(e) => setForm((f) => ({ ...f, memberName: e.target.value }))}
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Email address</label>
                <input
                  type="email"
                  className={inputCls}
                  value={form.memberEmail}
                  onChange={(e) => setForm((f) => ({ ...f, memberEmail: e.target.value }))}
                  placeholder="jane@company.com"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground block mb-1">Role</label>
                <select
                  className={inputCls}
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => addMutation.mutate()}
                disabled={!form.memberName || !form.memberEmail || addMutation.isPending}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
              >
                {addMutation.isPending ? "Adding…" : "Add member"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-md border border-border text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : (members as any[]).length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-xl text-sm text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-3 opacity-40" />
            No team members yet. Add people who should be contactable during an AOG.
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {(members as any[]).map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium">{m.memberName}</td>
                    <td className="px-5 py-3 text-muted-foreground">{m.memberEmail}</td>
                    <td className="px-5 py-3 text-muted-foreground">{roleLabel(m.role)}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => removeMutation.mutate(m.id)}
                        disabled={removeMutation.isPending}
                        className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
