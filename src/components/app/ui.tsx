import type { LucideIcon } from "lucide-react";

// Shared dashboard UI primitives matching the operations-console design.
// (No custom fonts — uses the app's existing type scale + semantic tokens.)

type Tone = "gold" | "green" | "red" | "blue" | "neutral" | "navy";

// Flat, squared status tags — deliberately not the rounded-pastel-pill look.
// Tint is kept low; the leading marker is a small square, not a dot.
const TONES: Record<Tone, string> = {
  gold: "bg-accent/12 text-[oklch(0.4_0.09_72)]",
  green: "bg-success/10 text-[oklch(0.42_0.13_160)]",
  red: "bg-destructive/10 text-destructive",
  blue: "bg-blue-500/10 text-blue-700",
  neutral: "bg-foreground/[0.06] text-muted-foreground",
  navy: "bg-primary/10 text-primary",
};

export function StatusPill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-[3px] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

// Single source of truth: maps any domain status/risk/urgency word to a tone,
// so the same label is the same colour on every screen.
export function statusTone(value: string): Tone {
  const v = value.toLowerCase();
  if (/(breach|cancel|high|unavailable|failed|past due|declined|grounded|overdue)/.test(v))
    return "red";
  if (/(verified|resolved|arrived|approved|operational|low risk|\blow\b|paid|won)/.test(v))
    return "green";
  if (/(sourcing|options|confirmed|transit|order placed|placed|quoted|responded)/.test(v))
    return "blue";
  if (/(pending|acknowledged|submitted|medium|awaiting|review|dispatch|sent|new)/.test(v))
    return "gold";
  return "neutral";
}

// Horizontal progress/score bar with optional value label.
export function BarMeter({
  value,
  max = 100,
  tone = "gold",
  className = "",
}: {
  value: number;
  max?: number;
  tone?: Tone;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill =
    tone === "green"
      ? "bg-success"
      : tone === "red"
        ? "bg-destructive"
        : tone === "blue"
          ? "bg-blue-500"
          : "bg-accent";
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-muted ${className}`}>
      <div className={`h-full rounded-full ${fill}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// Metric card: uppercase label + optional icon, large value, optional accent.
export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  tone?: "default" | "gold" | "green" | "red" | "blue";
  hint?: string;
}) {
  const valueColor =
    tone === "gold"
      ? "text-accent"
      : tone === "green"
        ? "text-success"
        : tone === "red"
          ? "text-destructive"
          : tone === "blue"
            ? "text-blue-700"
            : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/70" strokeWidth={1.8} />}
      </div>
      <div className={`mt-2 text-3xl font-semibold tracking-tight ${valueColor}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

// Small uppercase chip shown beside a page title (e.g. ADMIN / OPERATOR).
export function RoleChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </span>
  );
}
