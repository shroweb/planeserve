import { createFileRoute } from "@tanstack/react-router";
import { getAccessibleFileBlob } from "@/lib/app.functions";

// Authenticated file download. Streams a stored blob if the signed-in user owns
// it (or is an admin). Files are scoped to their owner — a subscriber can only
// download their own aircraft's documents, never another subscriber's.
export const Route = createFileRoute("/api/files/$id")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const id = decodeURIComponent(new URL(request.url).pathname.split("/").pop() ?? "");
        if (!id) return new Response("Not found", { status: 404 });

        const res = await getAccessibleFileBlob(request.headers, id);
        if (res.status !== 200) {
          const msg =
            res.status === 401
              ? "Sign in required"
              : res.status === 403
                ? "Forbidden"
                : "Not found";
          return new Response(msg, { status: res.status });
        }

        const bytes = Buffer.from(res.blob.data, "base64");
        return new Response(bytes, {
          status: 200,
          headers: {
            "content-type": res.blob.contentType,
            "content-disposition": `inline; filename="${res.blob.fileName.replace(/"/g, "")}"`,
            "content-length": String(bytes.length),
            "cache-control": "private, no-store",
          },
        });
      },
    },
  },
});
