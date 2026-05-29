import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ensureAdminSession,
  getSupplierCompanies,
  createSupplierCompany,
  getSupplierApplications,
  approveSupplierApplication,
  declineSupplierApplication,
} from "@/lib/app.functions";
import { AppShell } from "@/components/app/AppShell";
import { Plus, Building2, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/suppliers")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminSuppliersPage,
});

type Company = {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  loaSigned: boolean;
  specialisms: string;
  createdAt: string | Date;
};

type Application = Company & {
  tradingName: string;
  country: string;
  address: string;
  website: string;
  vatRef: string;
  aircraftTypes: string;
  ataSystems: string;
  inventoryPlatform: string;
  stockType: string;
  typicalResponseTime: string;
  geographicCoverage: string;
  primaryAogContact: string;
  primaryAogMobile: string;
  secondaryAogContact: string;
  accountsContact: string;
  paymentMethod: string;
  paymentCurrency: string;
  paymentTerms: string;
  status: string;
};

type Tab = "approved" | "pending";

function AdminSuppliersPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("pending");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    loaSigned: false,
    specialisms: "",
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["supplier-companies"],
    queryFn: () => getSupplierCompanies(),
  });

  const { data: applications = [] } = useQuery({
    queryKey: ["supplier-applications"],
    queryFn: () => getSupplierApplications(),
  });

  const createMutation = useMutation({
    mutationFn: () => createSupplierCompany({ data: form }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-companies"] });
      setShowForm(false);
      setForm({
        name: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        loaSigned: false,
        specialisms: "",
      });
    },
  });

  return (
    <AppShell variant="admin">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Suppliers</h1>
          {tab === "approved" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add supplier
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {[
            {
              id: "pending" as Tab,
              label: `Pending Applications ${applications.length > 0 ? `(${applications.length})` : ""}`,
            },
            { id: "approved" as Tab, label: "Approved Suppliers" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "pending" && (
          <PendingTab
            applications={applications as Application[]}
            onAction={() => {
              queryClient.invalidateQueries({ queryKey: ["supplier-applications"] });
              queryClient.invalidateQueries({ queryKey: ["supplier-companies"] });
            }}
          />
        )}

        {tab === "approved" && (
          <div>
            {/* Add form */}
            {showForm && (
              <div className="bg-card border border-border rounded-lg p-5 mb-6">
                <p className="text-sm font-semibold mb-4">New supplier company</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "name", label: "Company name", placeholder: "Aviall Services" },
                    { key: "contactName", label: "Contact name", placeholder: "John Smith" },
                    { key: "contactEmail", label: "Email", placeholder: "john@aviall.com" },
                    { key: "contactPhone", label: "Phone", placeholder: "+1 800 000 0000" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground">{label}</label>
                      <input
                        type="text"
                        value={(form as any)[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground">
                      Specialisms (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.specialisms}
                      onChange={(e) => setForm((f) => ({ ...f, specialisms: e.target.value }))}
                      placeholder="e.g. Pratt & Whitney, Honeywell avionics"
                      className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="loa"
                      checked={form.loaSigned}
                      onChange={(e) => setForm((f) => ({ ...f, loaSigned: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    <label htmlFor="loa" className="text-sm">
                      LOA signed
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => createMutation.mutate()}
                    disabled={!form.name || createMutation.isPending}
                    className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Saving…" : "Add supplier"}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded border border-border text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {(companies as Company[]).length === 0 ? (
              <div className="py-16 text-center border border-dashed border-border rounded-lg text-sm text-muted-foreground">
                No suppliers yet. Add your first supplier company.
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Company
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Contact
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Specialisms
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        LOA
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(companies as Company[]).map((c) => (
                      <tr key={c.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="font-medium">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p>{c.contactName || "—"}</p>
                          {c.contactEmail && (
                            <p className="text-xs text-muted-foreground">{c.contactEmail}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {c.specialisms || "—"}
                        </td>
                        <td className="px-4 py-3">
                          {c.loaSigned ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function PendingTab({
  applications,
  onAction,
}: {
  applications: Application[];
  onAction: () => void;
}) {
  if (applications.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-border rounded-lg text-sm text-muted-foreground">
        No pending applications.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <ApplicationCard key={app.id} app={app} onAction={onAction} />
      ))}
    </div>
  );
}

function ApplicationCard({ app, onAction }: { app: Application; onAction: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [showDecline, setShowDecline] = useState(false);
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: () => approveSupplierApplication({ data: { id: app.id } }),
    onSuccess: () => {
      onAction();
      queryClient.invalidateQueries({ queryKey: ["supplier-applications"] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: () => declineSupplierApplication({ data: { id: app.id, reason: declineReason } }),
    onSuccess: () => {
      onAction();
      queryClient.invalidateQueries({ queryKey: ["supplier-applications"] });
    },
  });

  const submitted = new Date(app.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function KV({ k, v }: { k: string; v: string }) {
    return (
      <div className="flex justify-between gap-4 text-sm py-1.5 border-b border-border last:border-0">
        <span className="text-muted-foreground">{k}</span>
        <span className="font-medium text-right max-w-[55%]">{v || "—"}</span>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{app.name}</span>
              {app.tradingName && (
                <span className="text-xs text-muted-foreground">({app.tradingName})</span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {app.country && <span>{app.country}</span>}
              {app.contactEmail && <span>{app.contactEmail}</span>}
              <span>Submitted {submitted}</span>
            </div>
            {app.aircraftTypes && (
              <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
                {app.aircraftTypes}
              </p>
            )}
          </div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 text-xs text-primary font-medium shrink-0"
          >
            Review
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-5 py-4 bg-muted/20 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Company
              </p>
              <KV k="Address" v={app.address} />
              <KV k="Website" v={app.website} />
              <KV k="VAT ref" v={app.vatRef} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Speciality
              </p>
              <KV k="Aircraft types" v={app.aircraftTypes} />
              <KV k="ATA systems" v={app.ataSystems} />
              <KV k="Platform" v={app.inventoryPlatform} />
              <KV k="Stock type" v={app.stockType} />
              <KV k="Response time" v={app.typicalResponseTime} />
              <KV k="Coverage" v={app.geographicCoverage} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                AOG Contacts
              </p>
              <KV k="Primary" v={`${app.primaryAogContact} ${app.primaryAogMobile}`.trim()} />
              <KV k="Secondary" v={app.secondaryAogContact} />
              <KV k="Accounts" v={app.accountsContact} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Payment
              </p>
              <KV k="Method" v={app.paymentMethod} />
              <KV k="Currency" v={app.paymentCurrency} />
              <KV k="Terms" v={app.paymentTerms} />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {approveMutation.isPending ? "Approving…" : "Approve"}
            </button>
            <button
              onClick={() => setShowDecline((d) => !d)}
              className="px-4 py-2 rounded-md border border-destructive text-destructive text-sm font-medium hover:bg-destructive/5"
            >
              Decline
            </button>
          </div>

          {showDecline && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Reason for declining (optional)
              </label>
              <textarea
                rows={2}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Insufficient certifications…"
              />
              <button
                onClick={() => declineMutation.mutate()}
                disabled={declineMutation.isPending}
                className="px-4 py-2 rounded-md bg-destructive text-white text-sm font-medium disabled:opacity-50"
              >
                {declineMutation.isPending ? "Declining…" : "Confirm decline"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
