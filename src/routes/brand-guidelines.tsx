import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/brand-guidelines")({
  head: () => ({
    meta: [
      { title: "PlaneServe Brand Guidelines" },
      {
        name: "description",
        content:
          "A visual brand system for PlaneServe, covering colour, typography, UI components, tone and aviation operations design principles.",
      },
    ],
  }),
  component: BrandGuidelines,
});

function BrandGuidelines() {
  return (
    <iframe
      title="PlaneServe Brand Guidelines"
      src="/ps-brand/index.html"
      className="block h-screen w-full border-0 bg-[#F4F0E8]"
    />
  );
}
