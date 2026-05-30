import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupplierAppShell } from "@/components/app/SupplierAppShell";
import {
  ensureSupplierSession,
  getSupplierProfile,
  updateSupplierProfile,
  getMyComplianceDocs,
  saveMyComplianceDoc,
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
