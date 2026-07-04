import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/brand-guidelines")({
  head: () => ({
    meta: [
      { title: "Aircraft Program Brand Guidelines" },
      {
        name: "description",
        content:
          "A visual brand system for Aircraft Program, covering colour, typography, UI components, tone and aviation operations design principles.",
      },
    ],
  }),
  component: BrandGuidelines,
});

function BrandGuidelines() {
  return (
    <iframe
      title="Aircraft Program Brand Guidelines"
      src="/ps-brand/index.html"
      className="block h-screen w-full border-0 bg-[#F4F0E8]"
    />
  );
}
