import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupplierAppShell } from "@/components/app/SupplierAppShell";
import {
  ensureSupplierSession,
  getSupplierProfile,
  updateSupplierProfile,
} from "@/lib/app.functions";
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

  const COMPLIANCE_DOCS = [
    "FAA Part 145",
    "EASA Part 145",
    "ASA-100",
    "Quality Assurance Manual",
    "Export Licence",
    "Insurance Certificate",
  ];

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

          {/* Compliance documents placeholder */}
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm font-semibold mb-1">Compliance Documents</p>
            <p className="text-xs text-muted-foreground mb-4">
              Document management is handled by the PlaneServe onboarding team. Contact us to update
              your compliance documents.
            </p>
            <div className="space-y-2">
              {COMPLIANCE_DOCS.map((doc) => (
                <div
                  key={doc}
                  className="flex items-center justify-between border border-border rounded-md px-4 py-2.5"
                >
                  <span className="text-sm">{doc}</span>
                  <span className="text-xs text-muted-foreground italic">
                    Managed by PlaneServe
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SupplierAppShell>
  );
}
