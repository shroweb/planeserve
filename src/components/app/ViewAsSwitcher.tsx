import { useRouter } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

type View = "Subscriber" | "Admin" | "Supplier";

export function ViewAsSwitcher({ current }: { current: View }) {
  const router = useRouter();
  const session = authClient.useSession();
  // The view switcher is an operations tool — only PlaneServe admins may
  // jump between subscriber / admin / supplier surfaces. Hide it from
  // regular subscribers and suppliers.
  const isAdmin = Boolean((session.data?.user as { isAdmin?: boolean } | undefined)?.isAdmin);
  if (!isAdmin) return null;

  function switchTo(view: View) {
    if (view === "Admin") router.navigate({ to: "/admin" });
    else if (view === "Supplier") router.navigate({ to: "/supplier" });
    else router.navigate({ to: "/dashboard" });
  }

  const views: View[] = ["Subscriber", "Admin", "Supplier"];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-1 rounded-full border border-border bg-card/90 backdrop-blur-sm shadow-lg px-1.5 py-1.5">
      <span className="text-[10px] text-muted-foreground font-medium px-2 uppercase tracking-wide">
        View as
      </span>
      {views.map((v) => (
        <button
          key={v}
          onClick={() => switchTo(v)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            current === v
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
