import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupplierAppShell } from "@/components/app/SupplierAppShell";
import {
  ensureSupplierSession,
  getSupplierProfile,
  updateSupplierProfile,
  getMyComplianceDocs,
  saveMyComplianceDoc,
  getSupplierTeamMembers,
  addSupplierTeamMember,
  removeSupplierTeamMember,
} from "@/lib/app.functions";
import { uploadBrowserFile } from "@/lib/file-upload";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/supplier/profile")({
  beforeLoad: async () => {
    try {
      await ensureSupplierSession();
    } catch {
      throw redirect({ to: "/supplier/login" });
    }
  },
  component: SupplierProfilePage,
});

const inputCls =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40";

const COMPLIANCE_DOCS = [
  "FAA Part 145",
  "EASA Part 145",
  "ASA-100",
  "Quality Assurance Manual",
  "Export Licence",
  "Insurance Certificate",
];

const RELEASE_CAPABILITIES = [
  "EASA Form 1",
  "FAA Form 8130-3",
  "TCCA Form 1",
  "CAA Form 1 (UK)",
  "Dual release",
];

function SupplierProfilePage() {
  const queryClient = useQueryClient();
  const { data: company, isLoading } = useQuery({
    queryKey: ["supplier-profile"],
    queryFn: () => getSupplierProfile(),
  });

  const [form, setForm] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    primaryAogContact: "",
    primaryAogMobile: "",
    secondaryAogContact: "",
    accountsContact: "",
    website: "",
    releaseCapabilities: [] as string[],
  });

  useEffect(() => {
    if (company) {
      setForm({
        contactName: (company as any).contactName ?? "",
        contactEmail: (company as any).contactEmail ?? "",
        contactPhone: (company as any).contactPhone ?? "",
        primaryAogContact: (company as any).primaryAogContact ?? "",
        primaryAogMobile: (company as any).primaryAogMobile ?? "",
        secondaryAogContact: (company as any).secondaryAogContact ?? "",
        accountsContact: (company as any).accountsContact ?? "",
        website: (company as any).website ?? "",
        releaseCapabilities: (company as any).releaseCapabilities ?? [],
      });
    }
  }, [company]);

  const mutation = useMutation({
    mutationFn: () => updateSupplierProfile({ data: form }),
    onSuccess: () => {
      toast.success("Profile updated.");
      queryClient.invalidateQueries({ queryKey: ["supplier-profile"] });
    },
    onError: () => toast.error("Failed to save."),
  });

  if (isLoading)
    return (
      <SupplierAppShell>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </SupplierAppShell>
    );

  return (
    <SupplierAppShell>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Company Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{(company as any)?.name}</p>
        </div>

        <div className="space-y-8">
          {/* Contact details */}
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm font-semibold mb-4">Contact Details</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "contactName", label: "Primary contact name" },
                { key: "contactEmail", label: "Contact email" },
                { key: "contactPhone", label: "Contact phone" },
                { key: "website", label: "Website" },
                { key: "primaryAogContact", label: "Primary AOG contact" },
                { key: "primaryAogMobile", label: "AOG mobile (24/7)" },
                { key: "secondaryAogContact", label: "Secondary AOG contact + mobile" },
                { key: "accountsContact", label: "Accounts contact + email" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground block mb-1">{label}</label>
                  <input
                    className={inputCls}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="mt-5 px-5 py-2.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {mutation.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>

          {/* Release capabilities */}
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm font-semibold mb-1">Release Document Capabilities</p>
            <p className="text-xs text-muted-foreground mb-4">
              Tick the paperwork your team can usually provide with sourced parts.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {RELEASE_CAPABILITIES.map((capability) => {
                const checked = form.releaseCapabilities.includes(capability);
                return (
                  <label
                    key={capability}
                    className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          releaseCapabilities: event.target.checked
                            ? [...current.releaseCapabilities, capability]
                            : current.releaseCapabilities.filter((item) => item !== capability),
                        }))
                      }
                    />
                    {capability}
                  </label>
                );
              })}
            </div>
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="mt-5 px-5 py-2.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {mutation.isPending ? "Saving…" : "Save capabilities"}
            </button>
          </div>

          <SupplierTeam />

          {/* Compliance documents */}
          <ComplianceDocs />
        </div>
      </div>
    </SupplierAppShell>
  );
}

function docExpiryStatus(expiry: string): { label: string; cls: string } {
  if (!expiry) return { label: "No expiry set", cls: "text-muted-foreground" };
  const d = new Date(expiry);
  if (isNaN(d.getTime())) return { label: expiry, cls: "text-muted-foreground" };
  const days = Math.floor((d.getTime() - Date.now()) / 86_400_000);
  if (days < 0) return { label: `Expired ${expiry}`, cls: "text-destructive font-medium" };
  if (days <= 30) return { label: `Expires ${expiry} (${days}d)`, cls: "text-accent font-medium" };
  return { label: `Valid · ${expiry}`, cls: "text-success" };
}

function SupplierTeam() {
  const qc = useQueryClient();
  const { data: members = [] } = useQuery({
    queryKey: ["supplier-team-members"],
    queryFn: () => getSupplierTeamMembers(),
  });
  const [form, setForm] = useState({ name: "", email: "", role: "AOG contact", phone: "" });
  const add = useMutation({
    mutationFn: () => addSupplierTeamMember({ data: form }),
    onSuccess: () => {
      setForm({ name: "", email: "", role: "AOG contact", phone: "" });
      qc.invalidateQueries({ queryKey: ["supplier-team-members"] });
      toast.success("Team member added.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not add team member."),
  });
  const remove = useMutation({
    mutationFn: (id: string) => removeSupplierTeamMember({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["supplier-team-members"] });
      toast.success("Team member removed.");
    },
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <p className="text-sm font-semibold mb-1">Team Members</p>
      <p className="text-xs text-muted-foreground mb-4">
        Add people who can respond to RFQs, shipping queries, or account questions.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className={inputCls}
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Name"
        />
        <input
          className={inputCls}
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="Email"
        />
        <input
          className={inputCls}
          value={form.role}
          onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
          placeholder="Role"
        />
        <input
          className={inputCls}
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
          placeholder="Phone"
        />
      </div>
      <button
        onClick={() => add.mutate()}
        disabled={add.isPending || !form.name || !form.email}
        className="mt-4 rounded bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {add.isPending ? "Adding..." : "Add team member"}
      </button>
      <div className="mt-5 divide-y divide-border rounded-md border border-border">
        {members.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No team members added yet.</div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center justify-between gap-3 p-4 text-sm">
              <div className="min-w-0">
                <div className="font-medium">{member.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {member.role} · {member.email}
                  {member.phone ? ` · ${member.phone}` : ""}
                </div>
              </div>
              <button
                onClick={() => remove.mutate(member.id)}
                className="rounded border border-border px-3 py-1.5 text-xs hover:bg-muted"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ComplianceDocs() {
  const qc = useQueryClient();
  const { data: docs = [] } = useQuery({
    queryKey: ["my-compliance-docs"],
    queryFn: () => getMyComplianceDocs(),
  });
  const [busy, setBusy] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: (v: { docType: string; fileName: string; storageKey: string; expiry: string }) =>
      saveMyComplianceDoc({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-compliance-docs"] });
      toast.success("Compliance document updated.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed."),
  });

  async function onFile(docType: string, file: File | undefined, expiry: string) {
    if (!file) return;
    setBusy(docType);
    try {
      const { storageKey, fileName } = await uploadBrowserFile(file);
      await save.mutateAsync({ docType, fileName, storageKey, expiry });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <p className="text-sm font-semibold mb-1">Compliance Documents</p>
      <p className="text-xs text-muted-foreground mb-4">
        Upload and keep your certifications current — replace each one before it expires.
      </p>
      <div className="space-y-2">
        {COMPLIANCE_DOCS.map((doc) => {
          const current = docs.find((d) => d.docType === doc);
          const status = current ? docExpiryStatus(current.expiryDate) : null;
          return (
            <div key={doc} className="border border-border rounded-md px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{doc}</div>
                  {current ? (
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                      {current.storageKey ? (
                        <a
                          href={`/api/files/${current.storageKey}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-primary hover:underline truncate"
                        >
                          {current.fileName || "View file"}
                        </a>
                      ) : (
                        <span className="font-mono text-muted-foreground truncate">
                          {current.fileName}
                        </span>
                      )}
                      <span className={status!.cls}>· {status!.label}</span>
                    </div>
                  ) : (
                    <div className="mt-0.5 text-xs text-muted-foreground">Not uploaded</div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="date"
                    defaultValue={current?.expiryDate || ""}
                    onBlur={(e) => {
                      if (current && e.target.value !== current.expiryDate) {
                        save.mutate({
                          docType: doc,
                          fileName: current.fileName,
                          storageKey: current.storageKey,
                          expiry: e.target.value,
                        });
                      }
                    }}
                    id={`exp-${doc}`}
                    className="rounded border border-border bg-background px-2 py-1.5 text-xs"
                  />
                  <label
                    className={`cursor-pointer rounded-md border border-border bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80 ${
                      busy === doc ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    {busy === doc ? "Uploading…" : current ? "Replace" : "Upload"}
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        const expiry =
                          (document.getElementById(`exp-${doc}`) as HTMLInputElement | null)
                            ?.value ??
                          current?.expiryDate ??
                          "";
                        onFile(doc, e.target.files?.[0], expiry);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
