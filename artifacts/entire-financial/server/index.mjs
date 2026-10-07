import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { brotliCompressSync, gzipSync, constants } from "node:zlib";
import { createHash } from "node:crypto";
import path from "node:path";
import { DEFAULT_SITE_URL } from "../src/lib/site.ts";
import { applyHeaders } from "./headers.mjs";
import { containedFile, previewHtml, routeDecision } from "./routing.mjs";

const root = path.resolve(import.meta.dirname, "../../../dist/public");
const siteUrl = process.env.SITE_URL || DEFAULT_SITE_URL;
if (siteUrl !== DEFAULT_SITE_URL) throw new Error("Invalid production site origin configuration.");
const routes = JSON.parse(await readFile(path.join(root, "routes.json"), "utf8"));
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2",
  ".ico": "image/x-icon", ".webmanifest": "application/manifest+json", ".pdf": "application/pdf",
};
const compressed = new Map();
function send(response, request, status, body, type, cache = "no-cache") {
  const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
  response.statusCode = status;
  response.setHeader("Content-Type", type);
  response.setHeader("Cache-Control", cache);
  response.setHeader("Vary", "Accept-Encoding, Host");
  let payload = buffer;
  const encoding = request.headers["accept-encoding"] || "";
  if (buffer.length > 1024 && /^(text\/|application\/(?:json|xml|manifest))/.test(type)) {
    const kind = /\bbr\b/.test(encoding) ? "br" : /\bgzip\b/.test(encoding) ? "gzip" : "";
    if (kind) {
      const key = `${kind}:${createHash("sha256").update(buffer).digest("hex")}`;
      payload = compressed.get(key);
      if (!payload) {
        payload = kind === "br" ? brotliCompressSync(buffer, { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } }) : gzipSync(buffer);
        if (compressed.size > 64) compressed.clear();
        compressed.set(key, payload);
      }
      response.setHeader("Content-Encoding", kind);
    }
  }
  response.setHeader("Content-Length", payload.length);
  response.end(request.method === "HEAD" ? undefined : payload);
}

const server = createServer(async (request, response) => {
  try {
    // Replit terminates TLS; use its forwarded host/protocol, not the internal socket's scheme.
    const host = String(request.headers["x-forwarded-host"] || request.headers.host || "").split(",")[0].trim().toLowerCase();
    const protocol = String(request.headers["x-forwarded-proto"] || "http").split(",")[0].trim();
    const decision = routeDecision(request.url || "/", host, protocol, siteUrl, routes);
    const indexable = decision.canonical === true && process.env.SITE_INDEXABLE !== "false";
    applyHeaders(response, { indexable, https: protocol === "https" });
    if (!["GET", "HEAD"].includes(request.method)) {
      response.setHeader("Allow", "GET, HEAD");
      return send(response, request, 405, "Method not allowed", types[".txt"], "no-store");
    }
    if (decision.location) {
      response.setHeader("Location", decision.location);
      return send(response, request, 308, "", types[".txt"], "no-store");
    }
    if (decision.status === 400) return send(response, request, 400, "Invalid request", types[".txt"], "no-store");
    if (decision.pathname === "/robots.txt")
      return send(response, request, 200, indexable ? await readFile(path.join(root, "robots.txt")) :
        "User-agent: *\nDisallow: /\n", types[".txt"]);
    if (decision.pathname === "/sitemap.xml" && !indexable)
      return send(response, request, 404, "Not found", types[".txt"]);
    let filename = decision.status === 200 ?
      path.join(root, decision.route === "/" ? "index.html" : `${decision.route.slice(1)}/index.html`) :
      decision.pathname ? containedFile(root, decision.pathname) : null;
    let status = decision.status || 200;
    if (filename) {
      try { if (!(await stat(filename)).isFile()) filename = null; }
      catch { filename = null; }
    }
    // Do not serve HTML by filename or directory aliases; public routes are the only 200 HTML pages.
    if (decision.status !== 200 && filename && (path.extname(filename) === ".html" || decision.pathname === "/routes.json")) filename = null;
    if (!filename) { filename = path.join(root, "404.html"); status = 404; }
    const type = types[path.extname(filename)] || "application/octet-stream";
    let body = await readFile(filename);
    if (type.startsWith("text/html") && (!indexable || status === 404)) body = Buffer.from(previewHtml(body.toString()));
    if (status === 404) response.setHeader("X-Robots-Tag", "noindex, nofollow");
    const cache = status === 200 && filename.includes(`${path.sep}assets${path.sep}`) ?
      "public, max-age=31536000, immutable" : "no-cache";
    send(response, request, status, body, type, cache);
  } catch {
    // Do not log request URLs, headers, bodies or visitor details.
    process.stderr.write(JSON.stringify({ level: "error", event: "request_failed" }) + "\n");
    if (!response.headersSent) send(response, request, 500, "This page could not be loaded. Please try again.", types[".txt"], "no-store");
    else response.end();
  }
});
server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.listen(Number(process.env.PORT || 3000), "0.0.0.0", () =>
  process.stdout.write(JSON.stringify({ level: "info", event: "website_ready" }) + "\n"));