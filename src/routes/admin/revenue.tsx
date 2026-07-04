import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ensureAdminSession, getStripeAdminData } from "@/lib/app.functions";
import {
  CreditCard,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Calendar,
  ExternalLink,
  Download,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/admin/revenue")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminRevenuePage,
});

const STATUS_COLOURS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  past_due: "bg-red-100 text-red-700",
  unpaid: "bg-red-100 text-red-700",
  canceled: "bg-muted text-muted-foreground",
  trialing: "bg-blue-100 text-blue-700",
  paused: "bg-amber-100 text-amber-700",
  incomplete: "bg-amber-100 text-amber-700",
  incomplete_expired: "bg-muted text-muted-foreground",
};

function fmt(cents: number, currency = "usd") {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  });
}

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: unknown[][]) {
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminRevenuePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stripe-admin"],
    queryFn: () => getStripeAdminData(),
    staleTime: 60_000, // re-fetch after 1 min
  });

  const noStripeData = !data?.totalStripeLinked;
  const billableInvoices = (data?.invoices ?? []).filter((inv) => inv.status !== "void");
  const hiddenVoidInvoices = (data?.invoices ?? []).length - billableInvoices.length;

  function exportRevenue() {
    if (!data) return;
    const rows: unknown[][] = [
      ["Aircraft Program revenue export", new Date().toISOString()],
      [],
      ["Subscriptions"],
      ["Customer", "Email", "Plan", "Interval", "Amount", "Currency", "Status", "Period ends"],
      ...data.subscriptions.map((s) => [
        s.customerName || "",
        s.customerEmail || "",
        s.plan || "",
        s.interval || "",
        (s.amountCents / 100).toFixed(2),
        "USD",
        s.status,
        new Date(s.currentPeriodEnd * 1000).toISOString().slice(0, 10),
      ]),
      [],
      ["Upcoming renewals"],
      ["Customer email", "Interval", "Amount", "Currency", "Renews"],
      ...data.upcomingRenewals.map((r) => [
        r.customerEmail || "",
        r.interval || "",
        (r.amountCents / 100).toFixed(2),
        "USD",
        new Date(r.currentPeriodEnd * 1000).toISOString().slice(0, 10),
      ]),
      [],
      ["Invoices"],
      ["Invoice", "Customer", "Amount", "Currency", "Status", "Date", "PDF"],
      ...billableInvoices.map((inv) => [
        inv.number ?? inv.stripeId,
        inv.customerName || inv.customerEmail || "",
        ((inv.amountPaid || inv.amountDue) / 100).toFixed(2),
        inv.currency?.toUpperCase(),
        inv.status,
        new Date(inv.created * 1000).toISOString().slice(0, 10),
        inv.pdfUrl || "",
      ]),
    ];
    downloadCsv(`planeserve-revenue-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  }

  return (
    <AppShell variant="admin">
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Revenue</h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active subscription revenue from Stripe
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportRevenue}
              disabled={!data || isLoading}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/60 disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
            {isLoading && <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />}
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Failed to load Stripe data</p>
              <p className="text-red-600 text-xs mt-0.5">{(error as Error).message}</p>
            </div>
          </div>
        )}

        {noStripeData && !isLoading && !error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No active Stripe subscription revenue yet. Successful subscriber payments will appear
            here automatically; voided or incomplete test invoices are excluded from revenue.
          </div>
        )}

        {/* Past-due alert */}
        {(data?.pastDueCount ?? 0) > 0 && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-700">
                  {data!.pastDueCount} subscription{data!.pastDueCount !== 1 ? "s" : ""} past due —
                  payment failed
                </p>
                <p className="text-sm text-red-600 mt-0.5 mb-3">
                  These aircraft may lose AOG cover. Contact subscribers to update payment method.
                </p>
                <div className="space-y-2">
                  {data!.pastDueSubs.map((s) => (
                    <div
                      key={s.dbSubId}
                      className="flex items-center gap-3 text-sm bg-white/70 rounded-lg px-3 py-2 border border-red-100"
                    >
                      <span className="font-medium">{s.name || "Unknown"}</span>
                      <span className="text-muted-foreground">{s.email}</span>
                      {s.company && <span className="text-muted-foreground">· {s.company}</span>}
                      {s.phone && (
                        <a
                          href={`tel:${s.phone}`}
                          className="text-primary hover:underline ml-auto text-xs"
                        >
                          {s.phone}
                        </a>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOURS[s.stripStatus ?? ""] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {s.stripStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
            label="MRR"
            value={data ? fmt(data.mrrCents) : "—"}
            sub="normalised monthly"
          />
          <StatCard
            icon={<CreditCard className="h-4 w-4 text-blue-500" />}
            label="Active subscriptions"
            value={
              data ? String(data.subscriptions.filter((s) => s.status === "active").length) : "—"
            }
          />
          <StatCard
            icon={<AlertCircle className="h-4 w-4 text-red-500" />}
            label="Past due"
            value={data ? String(data.pastDueCount) : "—"}
            danger={(data?.pastDueCount ?? 0) > 0}
          />
          <StatCard
            icon={<Calendar className="h-4 w-4 text-amber-500" />}
            label="Renewing (30 days)"
            value={data ? String(data.upcomingRenewals.length) : "—"}
          />
        </div>

        {/* Upcoming renewals */}
        {(data?.upcomingRenewals?.length ?? 0) > 0 && (
          <div className="mb-8">
            <p className="text-sm font-semibold mb-3">Upcoming renewals</p>
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Customer", "Plan", "Amount", "Renews"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data!.upcomingRenewals.map((r) => (
                    <tr key={r.stripeId} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 text-xs">{r.customerEmail ?? r.stripeId}</td>
                      <td className="px-4 py-2 capitalize text-xs">{r.interval}</td>
                      <td className="px-4 py-2 text-xs font-medium">{fmt(r.amountCents)}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">
                        {new Date(r.currentPeriodEnd * 1000).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subscriptions */}
        <div className="mb-8">
          <p className="text-sm font-semibold mb-3">Subscriptions</p>
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Customer", "Plan", "Amount", "Status", "Period ends", "Invoice"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.subscriptions ?? []).map((s) => (
                  <tr key={s.stripeId} className="border-b border-border last:border-0">
                    <td className="px-4 py-2">
                      <div className="text-sm font-medium">{s.customerName || "—"}</div>
                      <div className="text-xs text-muted-foreground">{s.customerEmail}</div>
                    </td>
                    <td className="px-4 py-2 text-xs capitalize">{s.interval ?? s.plan}</td>
                    <td className="px-4 py-2 text-xs font-medium">{fmt(s.amountCents)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOURS[s.status] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {s.status.replace(/_/g, " ")}
                      </span>
                      {s.cancelAtPeriodEnd && (
                        <span className="ml-1 text-[10px] text-amber-600 font-medium">cancels</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {new Date(s.currentPeriodEnd * 1000).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-[10px] font-medium ${s.latestInvoiceStatus === "paid" ? "text-emerald-600" : s.latestInvoiceStatus === "open" ? "text-amber-600" : "text-muted-foreground"}`}
                      >
                        {s.latestInvoiceStatus ?? "—"}
                      </span>
                    </td>
                  </tr>
                ))}
                {(data?.subscriptions?.length ?? 0) === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-sm text-muted-foreground"
                    >
                      No Stripe-linked subscriptions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoices */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Recent billable invoices</p>
            {hiddenVoidInvoices > 0 && (
              <p className="text-xs text-muted-foreground">
                {hiddenVoidInvoices} void/test invoice{hiddenVoidInvoices === 1 ? "" : "s"} hidden
              </p>
            )}
          </div>
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Invoice #", "Customer", "Amount", "Status", "Date", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {billableInvoices.map((inv) => (
                  <tr key={inv.stripeId} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                      {inv.number ?? inv.stripeId.slice(-8)}
                    </td>
                    <td className="px-4 py-2 text-xs">
                      {inv.customerName || inv.customerEmail || "—"}
                    </td>
                    <td className="px-4 py-2 text-xs font-medium">
                      {fmt(inv.amountPaid || inv.amountDue, inv.currency)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          inv.status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : inv.status === "open"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {new Date(inv.created * 1000).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      {inv.pdfUrl && (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          PDF <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
                {billableInvoices.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-sm text-muted-foreground"
                    >
                      No billable Stripe invoices yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  danger?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      </div>
      <p className={`text-2xl font-semibold ${danger ? "text-destructive" : ""}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}
