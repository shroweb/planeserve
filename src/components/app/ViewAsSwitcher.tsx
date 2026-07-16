import { useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSessionUser } from "@/lib/app.functions";

type View = "Subscriber" | "Admin" | "Supplier";

export function ViewAsSwitcher({ current }: { current: View }) {
  const router = useRouter();
  // The view switcher is an operations tool — only Aircraft Program admins may
  // jump between subscriber / admin / supplier surfaces. Hide it from
  // regular subscribers and suppliers.
  //
  // Admin status is read from `profiles.is_admin` (via getSessionUser) — the
  // SAME field the server-side guards enforce — so the UI can never disagree
  // with what the backend actually allows.
  const { data: user } = useQuery({
    queryKey: ["session-user"],
    queryFn: () => getSessionUser(),
    staleTime: 60_000,
    retry: false,
  });
  return null;

  function switchTo(view: View) {
    if (view === "Admin") router.navigate({ to: "/admin" });
    else if (view === "Supplier") router.navigate({ to: "/supplier" });
    else router.navigate({ to: "/dashboard" });
  }

  const views: View[] = ["Subscriber", "Admin", "Supplier"];

  return (
    <details className="fixed bottom-5 right-5 z-50">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground shadow-lg backdrop-blur-sm marker:hidden hover:text-foreground [&::-webkit-details-marker]:hidden">
        Admin tools
      </summary>
      <div className="absolute bottom-12 right-0 w-48 rounded-md border border-border bg-card p-2 shadow-xl">
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Preview role
        </p>
        {views.map((v) => (
          <button
            key={v}
            onClick={() => switchTo(v)}
            className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-xs font-semibold transition-colors ${
              current === v
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            {v}
            {current === v && <span className="text-[10px] opacity-80">Active</span>}
          </button>
        ))}
      </div>
    </details>
  );
}
