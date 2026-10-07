import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { seoPlugin } from "./plugins/seo";
import { DEFAULT_SITE_URL } from "./src/lib/site";

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3000;

const basePath = process.env.BASE_PATH || "/";

export default defineConfig(async ({ mode, command }) => {
 const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
 const siteUrl = env.SITE_URL || DEFAULT_SITE_URL;
 if (siteUrl !== DEFAULT_SITE_URL) throw new Error("SITE_URL must be the approved HTTPS www production origin.");
 const contactEndpoint = env.CONTACT_FORM_ENDPOINT || "";
 if (contactEndpoint) {
   const endpoint = new URL(contactEndpoint);
   if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password)
     throw new Error("CONTACT_FORM_ENDPOINT must be a public HTTPS endpoint without credentials.");
 }
 return {
  base: basePath,
  define: {
    __SITE_URL__: JSON.stringify(siteUrl),
    __CONTACT_FORM_ENDPOINT__: JSON.stringify(contactEndpoint),
  },
  plugins: [
    seoPlugin({ "google-site-verification": env.GOOGLE_SITE_VERIFICATION, "msvalidate.01": env.BING_SITE_VERIFICATION }),
    react(),
    tailwindcss(),
    ...(command === "serve" && mode !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
          await import("@replit/vite-plugin-runtime-error-modal").then((m) => m.default()),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    manifest: true,
    assetsInlineLimit: 0,
    outDir: path.resolve(import.meta.dirname, "..", "..", "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    target: ["chrome120", "edge120", "firefox121", "safari17"],
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/(react|react-dom|scheduler|wouter)\//.test(id)) return "framework";
          if (/\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return "motion";
        },
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
 };
});
