import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_SITE_URL, PUBLIC_ROUTES } from "../src/lib/site.ts";

if (!process.env.REPLIT_DEV_DOMAIN) throw new Error("Run in the workspace preview environment.");
const preview = `https://${process.env.REPLIT_DEV_DOMAIN}`;
const root = path.resolve(import.meta.dirname, "../../../dist/public");
const qa = path.resolve(import.meta.dirname, "../../../qa");
const pages = new Map();
for (const route of PUBLIC_ROUTES) {
  pages.set(route, await readFile(path.join(root, route === "/" ? "index.html" : `${route.slice(1)}/index.html`), "utf8"));
}
const routeResults = [];
for (const route of [...PUBLIC_ROUTES, "/missing-audit-route", "/robots.txt", "/sitemap.xml", "/.env"]) {
  const response = await fetch(`${preview}${route}`, { signal: AbortSignal.timeout(15000) });
  routeResults.push({
    route, status: response.status,
    robots: response.headers.get("x-robots-tag"),
    cache: response.headers.get("cache-control"),
    nosniff: response.headers.get("x-content-type-options"),
    referrer: response.headers.get("referrer-policy"),
    permissions: response.headers.get("permissions-policy"),
    csp: response.headers.get("content-security-policy"),
    reportOnlyCsp: !!response.headers.get("content-security-policy-report-only"),
  });
}
const links = [...new Set([...pages.entries()].flatMap(([route, html]) =>
  [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match =>
    new URL(match[1].replace(/&amp;/g, "&"), `${DEFAULT_SITE_URL}${route}`).href)))];
const internal = [], external = [], communications = [];
for (const href of links) {
  if (/^(mailto:|tel:)/.test(href)) { communications.push(href); continue; }
  const url = new URL(href, DEFAULT_SITE_URL);
  if (url.origin === DEFAULT_SITE_URL) {
    const body = pages.get(url.pathname);
    const anchor = url.hash ? decodeURIComponent(url.hash.slice(1)) : undefined;
    internal.push({ href, valid: !!body && (!anchor || body.includes(`id="${anchor}"`)) });
  } else {
    try {
      const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(10000) });
      external.push({ href, status: response.status, resolved: response.url,
        result: response.ok ? "reachable" : "manual confirmation required (HEAD may be blocked)" });
    } catch {
      external.push({ href, status: null, result: "manual confirmation required (TLS/network/timeout)" });
    }
  }
}
await mkdir(qa, { recursive: true });
await writeFile(path.join(qa, "links-and-headers.json"), JSON.stringify({ routeResults, internal, external, communications }, null, 2));
process.stdout.write(JSON.stringify({
  routes: routeResults.map(({ route, status }) => ({ route, status })),
  internalLinks: internal.length, invalidInternal: internal.filter(link => !link.valid),
  external, communicationTargets: communications.length,
}, null, 2) + "\n");