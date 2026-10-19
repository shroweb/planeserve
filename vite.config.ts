// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Explicitly enable the Nitro deploy plugin with the Vercel preset.
// Without an explicit `nitro` option the plugin only runs inside a Lovable
// sandbox, so production builds (e.g. on Vercel) would emit a static client
// with no server — every route 404s. Preset can be overridden via NITRO_PRESET.
// Hoisted to a const: the wrapper's Nitro type omits `routeRules`, but it
// spreads these options into Nitro verbatim at runtime (see its dist:1
// `const nitroOpts = { ...userNitroOpts, preset, output }`).
const nitroOptions = {
  preset: process.env.NITRO_PRESET ?? "vercel",
  // Articles moved under /blog — permanently redirect the old flat URL
  // (already live and indexed) so link equity carries over.
  routeRules: {
    "/what-does-aog-mean-in-aviation": {
      redirect: { to: "/blog/what-does-aog-mean-in-aviation", status: 301 },
    },
    "/aog-response-checklist": {
      redirect: { to: "/blog/aog-response-checklist", status: 301 },
    },
  },
  // The wrapper hardcodes output to dist/{client,server}; remap to the Vercel
  // Build Output API layout (.vercel/output/{static,functions/__server.func})
  // so Vercel serves the SSR function instead of 404-ing every route.
  output: {
    dir: ".vercel/output",
    publicDir: ".vercel/output/static",
    serverDir: ".vercel/output/functions/__server.func",
  },
};

export default defineConfig({
  nitro: nitroOptions,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    optimizeDeps: {
      exclude: [
        "@tanstack/start-server-core",
        "@tanstack/react-start-server",
        "@tanstack/react-start/server",
      ],
    },
  },
});
