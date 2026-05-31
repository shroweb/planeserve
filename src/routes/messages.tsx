import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureSession,
  getMessages,
  sendMessage,
  markMessagesRead,
  getDashboardData,
} from "@/lib/app.functions";
import { ArrowRight, Plane, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/messages")({
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: MessagesPage,
});

function MessagesPage() {
  const [body, setBody] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const result = await getMessages({ data: {} });
      // Mark admin messages as read whenever we fetch
      markMessagesRead().then(() => {
        queryClient.invalidateQueries({ queryKey: ["unread-counts"] });
      });
      return result;
    },
    refetchInterval: 15_000,
  });
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardData(),
  });
  const hasAircraft = (dashboard?.aircraft.length ?? 0) > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMutation = useMutation({
    mutationFn: (text: string) => sendMessage({ data: { body: text } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setBody("");
    },
  });

  function handleSend() {
    const trimmed = body.trim();
    if (!trimmed) return;
    sendMutation.mutate(trimmed);
  }

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-4rem)] -m-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <h1 className="text-base font-semibold">PlaneServe Desk</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your dedicated AOG support team — typically replies within 30 minutes
          </p>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="py-16 text-center text-sm text-muted-foreground">
              {hasAircraft ? (
                "No messages yet. Send us a message and we'll respond shortly."
              ) : (
                <div className="mx-auto max-w-sm">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Plane className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="font-medium text-foreground">Enrol an aircraft first</div>
                  <p className="mt-1 text-xs">
                    Desk messaging becomes available once an aircraft is enrolled on your account.
                  </p>
                  <Link
                    to="/enrol"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-foreground underline"
                  >
                    Enrol aircraft
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
          {messages.map((m) => {
            const isAdmin = m.senderType === "admin" || m.senderType === "system";
            return (
              <div key={m.id} className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${
                    isAdmin
                      ? "bg-card border border-border rounded-tl-sm"
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  }`}
                >
                  {isAdmin && (
                    <p className="text-[10px] font-semibold text-primary mb-1 uppercase tracking-wide">
                      PlaneServe
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{m.body}</p>
                  <p
                    className={`text-[10px] mt-1 ${isAdmin ? "text-muted-foreground" : "text-primary-foreground/60"}`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    ·{" "}
                    {new Date(m.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-border shrink-0">
          <div className="flex gap-3 items-end">
            <textarea
              rows={2}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={!hasAircraft}
              placeholder={
                hasAircraft ? "Type a message…" : "Enrol an aircraft to message the desk"
              }
              className="flex-1 resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              disabled={!hasAircraft || !body.trim() || sendMutation.isPending}
              className="shrink-0 h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
