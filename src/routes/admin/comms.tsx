import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureAdminSession,
  getAdminConversations,
  getAdminThreadMessages,
  sendAdminMessage,
} from "@/lib/app.functions";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/admin/comms")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminCommsPage,
});

const TEMPLATES = [
  "Your case has been acknowledged and we are actively sourcing the part.",
  "We have identified sourcing options and will share details shortly.",
  "Your part has been confirmed and an order has been placed.",
  "Your shipment is in transit. We'll share tracking details shortly.",
  "Your part has arrived. Please confirm receipt with your maintenance team.",
];

type ConvUser = {
  userId: string;
  name: string;
  company: string;
  lastMessage: string;
  lastAt: Date | string;
  requestId: string;
};

function AdminCommsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: conversations = [] } = useQuery({
    queryKey: ["admin-conversations"],
    queryFn: () => getAdminConversations(),
    refetchInterval: 15_000,
  });

  const { data: threadMessages = [] } = useQuery({
    queryKey: ["admin-thread", selectedUserId],
    queryFn: () => getAdminThreadMessages({ data: { userId: selectedUserId! } }),
    enabled: !!selectedUserId,
    refetchInterval: 15_000,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages.length]);

  const sendMutation = useMutation({
    mutationFn: (text: string) =>
      sendAdminMessage({ data: { userId: selectedUserId!, body: text } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-thread", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["admin-conversations"] });
      setBody("");
    },
  });

  function handleSend() {
    const trimmed = body.trim();
    if (!trimmed || !selectedUserId) return;
    sendMutation.mutate(trimmed);
  }

  const conversations_typed = conversations as ConvUser[];
  const selectedConv = conversations_typed.find((c) => c.userId === selectedUserId);

  return (
    <AppShell variant="admin">
      <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden">
        {/* Thread list */}
        <div className="w-72 shrink-0 border-r border-border flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations_typed.length === 0 && (
              <p className="p-4 text-xs text-muted-foreground">No conversations yet.</p>
            )}
            {conversations_typed.map((c) => (
              <button
                key={c.userId}
                onClick={() => setSelectedUserId(c.userId)}
                className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${
                  selectedUserId === c.userId ? "bg-accent/50" : "hover:bg-muted/40"
                }`}
              >
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {new Date(c.lastAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat pane */}
        <div className="flex-1 flex flex-col">
          {!selectedUserId ? (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="px-5 py-3 border-b border-border shrink-0">
                <p className="text-sm font-semibold">{selectedConv?.name}</p>
                <p className="text-xs text-muted-foreground">{selectedConv?.company}</p>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {threadMessages.map((m: any) => {
                  const isAdmin = m.senderType === "admin" || m.senderType === "system";
                  return (
                    <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 ${
                          isAdmin
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-card border border-border rounded-tl-sm"
                        }`}
                      >
                        {!isAdmin && (
                          <p className="text-[10px] font-semibold text-primary mb-1 uppercase tracking-wide">
                            {selectedConv?.name ?? "Subscriber"}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed">{m.body}</p>
                        <p
                          className={`text-[10px] mt-1 ${isAdmin ? "text-primary-foreground/60" : "text-muted-foreground"}`}
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

              {/* Templates */}
              <div className="px-5 py-2 border-t border-border bg-muted/10">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                  Quick templates
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setBody(t)}
                      className="text-[10px] px-2 py-0.5 border border-border rounded bg-card hover:bg-muted/50 text-muted-foreground truncate max-w-[200px]"
                    >
                      {t.substring(0, 40)}…
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-border shrink-0 flex gap-3 items-end">
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
                  placeholder="Type a reply…"
                  className="flex-1 resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleSend}
                  disabled={!body.trim() || sendMutation.isPending}
                  className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
