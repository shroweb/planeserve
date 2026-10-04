import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { StatusPill } from "@/components/app/ui";
import {
  ensureAdminSession,
  getPartsRequests,
  updatePartsRequestStatus,
} from "@/lib/app.functions";
import { toast } from "sonner";
import {
  Package,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  Building,
  Plane,
  MapPin,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/parts-requests")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminPartsRequests,
});

const STATUS_OPTIONS = ["New", "In Sourcing", "Quoted", "Completed", "Cancelled"] as const;

function AdminPartsRequests() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("All");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-parts-requests"],
    queryFn: () => getPartsRequests(),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updatePartsRequestStatus({ data: { id, status } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-parts-requests"] });
      toast.success("Request status updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    },
  });

  const totalCount = requests.length;
  const newCount = requests.filter((r) => r.status === "New").length;
  const inSourcingCount = requests.filter((r) => r.status === "In Sourcing").length;
  const quotedCount = requests.filter((r) => r.status === "Quoted").length;

  const filteredRequests =
    filter === "All" ? requests : requests.filter((r) => r.status === filter);

  return (
    <AppShell variant="admin">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Parts Sourcing Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">
              One-off sourcing enquiries submitted by operators and aircraft buyers
            </p>
          </div>
          <div className="flex items-center gap-3">
            {newCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent-foreground border border-accent/30 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                {newCount} New Request{newCount === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Requests</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{totalCount}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New (Unprocessed)</div>
            <div className="mt-1 text-2xl font-bold text-amber-500">{newCount}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">In Sourcing</div>
            <div className="mt-1 text-2xl font-bold text-sky-500">{inSourcingCount}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quoted</div>
            <div className="mt-1 text-2xl font-bold text-emerald-500">{quotedCount}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-border pb-2 mb-6 overflow-x-auto">
          {["All", "New", "In Sourcing", "Quoted", "Completed", "Cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === s
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading requests…</div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-base font-medium text-foreground">No parts requests found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filter === "All"
                ? "No one-off parts requests have been submitted yet."
                : `No requests with status "${filter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => {
              const isAog = req.urgency.toLowerCase().includes("aog");
              const createdDate = new Date(req.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <div
                  key={req.id}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-accent/40"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Part & Aircraft Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm font-bold text-foreground bg-muted px-2.5 py-1 rounded-md">
                          {req.partNumber}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {req.reference}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isAog
                              ? "bg-red-500/10 text-red-600 border border-red-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {req.urgency}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                          {req.condition}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {createdDate}
                        </span>
                      </div>

                      {req.partDescription && (
                        <p className="text-sm text-foreground/80 font-medium">
                          {req.partDescription}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Plane className="h-3.5 w-3.5 text-muted-foreground/70" />
                          <span>
                            {req.aircraftType} {req.aircraftReg ? `(${req.aircraftReg})` : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                          <span>Delivering to: <strong className="text-foreground">{req.deliveryLocation}</strong></span>
                        </div>
                        {req.company && (
                          <div className="flex items-center gap-1.5">
                            <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                            <span>{req.company}</span>
                          </div>
                        )}
                      </div>

                      {req.additionalNotes && (
                        <div className="mt-2 rounded bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/50">
                          <strong className="text-foreground">Notes:</strong> {req.additionalNotes}
                        </div>
                      )}
                    </div>

                    {/* Requester Contact & Actions */}
                    <div className="lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-5 space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-foreground">{req.name}</div>
                        <div className="mt-1 space-y-1 text-xs">
                          <a
                            href={`mailto:${req.email}?subject=Re:%20Aircraft%20Program%20Parts%20Request%20${req.reference}%20—%20${req.partNumber}`}
                            className="flex items-center gap-1.5 text-accent hover:underline"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate">{req.email}</span>
                          </a>
                          {req.phone && (
                            <a
                              href={`tel:${req.phone}`}
                              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                            >
                              <Phone className="h-3.5 w-3.5" />
                              <span>{req.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="pt-2 border-t border-border/60">
                        <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                          Status:
                        </label>
                        <select
                          value={req.status}
                          onChange={(e) =>
                            mutation.mutate({ id: req.id, status: e.target.value })
                          }
                          disabled={mutation.isPending}
                          className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
