import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureSession,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/app.functions";
import { AlertTriangle, BarChart2, CreditCard, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/notifications")({
  beforeLoad: async () => {
    const user = await ensureSession().catch(() => {
      throw redirect({ to: "/login" });
    });
    if (user?.isSupplier) {
      throw redirect({ to: "/supplier" });
    }
  },
  component: NotificationsPage,
});

type Category = "All" | "AOG" | "Intelligence" | "Billing";

function notifDestination(n: { category: string; requestId?: string | null }): string {
  if (n.requestId) return "/aog-cases";
  if (n.category === "Intelligence") return "/parts-intelligence";
  if (n.category === "Billing") return "/billing";
  return "/aog-cases";
}

function NotificationsPage() {
  const [category, setCategory] = useState<Category>("All");
  const queryClient = useQueryClient();
  const nav = useNavigate();

  const { data: notifs = [] } = useQuery({
    queryKey: ["notifications", category],
    queryFn: () =>
      getNotifications({ data: { category: category === "All" ? undefined : category } }),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-counts"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-counts"] });
    },
  });

  const unread = notifs.filter((n) => !n.isRead).length;
  const tabs: Category[] = ["All", "AOG", "Intelligence", "Billing"];

  return (
    <AppShell>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
            {unread > 0 && <p className="mt-1 text-sm text-muted-foreground">{unread} unread</p>}
          </div>
          {unread > 0 && (
            <button
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setCategory(t)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                category === t
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {notifs.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-2">
            {notifs.map((n) => {
              const Icon =
                n.category === "AOG"
                  ? AlertTriangle
                  : n.category === "Intelligence"
                    ? BarChart2
                    : CreditCard;
              const dest = notifDestination(n);
              return (
                <div
                  key={n.id}
                  onClick={() => {
                    if (!n.isRead) markReadMutation.mutate(n.id);
                    nav({ to: dest });
                  }}
                  className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors group ${
                    n.isRead
                      ? "border-border bg-card hover:bg-muted/30"
                      : "border-primary/20 bg-primary/3 hover:bg-primary/5"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      n.isRead ? "bg-muted" : "bg-primary/10"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${n.isRead ? "text-muted-foreground" : "text-primary"}`}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{n.title}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(n.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                    {n.body && (
                      <p className="mt-1 text-xs text-muted-foreground leading-5">{n.body}</p>
                    )}
                    <p className="mt-1.5 text-[11px] text-accent group-hover:underline">
                      {n.category === "Intelligence"
                        ? "View Parts Intelligence"
                        : n.category === "Billing"
                          ? "View Billing"
                          : "View AOG cases"}{" "}
                      →
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-1 group-hover:text-muted-foreground transition-colors" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
