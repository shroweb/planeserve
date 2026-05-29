import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupplierAppShell } from "@/components/app/SupplierAppShell";
import {
  ensureSupplierSession,
  getSupplierQuoteHistory,
  submitSupplierAwb,
} from "@/lib/app.functions";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/supplier/quote-history")({
  beforeLoad: async () => {
    try {
      await ensureSupplierSession();
    } catch {
      throw redirect({ to: "/supplier/login" });
    }
  },
  component: SupplierQuoteHistoryPage,
});

function SupplierQuoteHistoryPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["supplier-quote-history"],
    queryFn: () => getSupplierQuoteHistory(),
  });

  const awbMutation = useMutation({
    mutationFn: ({ quoteId, awbNumber }: { quoteId: string; awbNumber: string }) =>
      submitSupplierAwb({ data: { quoteId, awbNumber } }),
    onSuccess: () => {
      toast.success("AWB number saved.");
      queryClient.invalidateQueries({ queryKey: ["supplier-quote-history"] });
    },
    onError: () => toast.error("Failed to save AWB."),
  });

  if (!data)
    return (
      <SupplierAppShell>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </SupplierAppShell>
    );

  const { quotes, won, total, winRate, avgResponseHrs } = data;

  return (
    <SupplierAppShell>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Quote History</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Performance analytics for {data.company.name}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Quotes submitted
            </p>
            <p className="text-2xl font-semibold">{total}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Win rate</p>
            <p className="text-2xl font-semibold">{winRate}%</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Avg response
            </p>
            <p className="text-2xl font-semibold">{avgResponseHrs}h</p>
          </div>
        </div>

        {/* Quote list */}
        {quotes.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-lg text-sm text-muted-foreground">
            No quotes submitted yet.
          </div>
        ) : (
          <div className="space-y-3">
            {quotes.map((q) => {
              const price = (q.priceCents / 100).toLocaleString("en-US", {
                style: "currency",
                currency: (q.currency ?? "usd").toUpperCase(),
              });
              const isWon = !!q.approvedAt;
              return (
                <WonQuoteRow
                  key={q.id}
                  quote={q}
                  price={price}
                  isWon={isWon}
                  onSaveAwb={(awb) => awbMutation.mutate({ quoteId: q.id, awbNumber: awb })}
                  saving={awbMutation.isPending}
                />
              );
            })}
          </div>
        )}
      </div>
    </SupplierAppShell>
  );
}

type QuoteRow = {
  id: string;
  requestId: string;
  condition: string;
  priceCents: number;
  currency: string | null;
  leadTime: string;
  approvedAt: string | Date | null;
  awbNumber?: string;
  priceRank?: number;
  totalBids?: number;
};

function RankBadge({ rank, total }: { rank: number; total: number }) {
  const isLowest = rank === 1;
  const isTop = rank <= Math.ceil(total / 2);
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
        isLowest
          ? "bg-emerald-100 text-emerald-700"
          : isTop
            ? "bg-blue-50 text-blue-700"
            : "bg-muted text-muted-foreground"
      }`}
    >
      <TrendingUp className="h-2.5 w-2.5" />
      {isLowest ? "Lowest price" : `Ranked ${rank} of ${total}`}
    </span>
  );
}

function WonQuoteRow({
  quote,
  price,
  isWon,
  onSaveAwb,
  saving,
}: {
  quote: QuoteRow;
  price: string;
  isWon: boolean;
  onSaveAwb: (awb: string) => void;
  saving: boolean;
}) {
  const [awb, setAwb] = useState((quote as any).awbNumber ?? "");

  return (
    <div
      className={`border rounded-lg p-4 ${isWon ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-card"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {isWon ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <Clock className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-xs font-mono text-muted-foreground">
              {quote.requestId.slice(-8)}
            </span>
          </div>
          <div className="mt-1 text-sm">
            <span className="font-medium">{price}</span>
            <span className="text-muted-foreground ml-2">· {quote.condition}</span>
            {quote.leadTime && (
              <span className="text-muted-foreground ml-2">· {quote.leadTime}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs font-medium ${isWon ? "text-emerald-700" : "text-muted-foreground"}`}
          >
            {isWon ? "Won" : "Not selected"}
          </span>
          {quote.totalBids !== undefined && quote.totalBids > 1 && (
            <RankBadge rank={quote.priceRank!} total={quote.totalBids} />
          )}
        </div>
      </div>

      {isWon && (
        <div className="mt-3 flex items-end gap-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground block mb-1">
              AWB / tracking number
            </label>
            <input
              className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="e.g. 125-12345678"
            />
          </div>
          <button
            onClick={() => onSaveAwb(awb)}
            disabled={saving}
            className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 mb-0.5"
          >
            Save AWB
          </button>
        </div>
      )}
    </div>
  );
}
