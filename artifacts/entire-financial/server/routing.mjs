import path from "node:path";

/** Keep case, trailing-slash and host/protocol redirects in one hop, preserving queries. */
export function routeDecision(requestUrl, host, protocol, siteUrl, routes) {
  const parsed = new URL(requestUrl, siteUrl);
  const canonicalHost = new URL(siteUrl).host;
  const businessHost = host === canonicalHost || host === canonicalHost.replace(/^www\./, "");
  const rawPath = parsed.pathname;
  let route;
  try { route = decodeURIComponent(rawPath); } catch { return { status: 400 }; }
  if (route.includes("\0") || route.includes("\\") || route.split("/").includes("..") ||
      route.split("/").some(part => part.startsWith("."))) return { status: 404 };
  const normal = route.replace(/\/{2,}/g, "/").replace(/\/+$/, "").toLowerCase() || "/";
  const known = routes.includes(normal);
  // Do not change asset filename case. Never accept a user-controlled redirect origin.
  const destinationPath = known ? normal : rawPath;
  if ((businessHost && (host !== canonicalHost || protocol !== "https")) ||
      (known && rawPath !== normal)) {
    return { status: 308, location: `${businessHost ? siteUrl : ""}${destinationPath}${parsed.search}` };
  }
  return { status: known ? 200 : undefined, pathname: route, route: normal, canonical: host === canonicalHost && protocol === "https" };
}

export function containedFile(root, pathname) {
  const filename = path.resolve(root, `.${pathname}`);
  return filename.startsWith(`${path.resolve(root)}${path.sep}`) ? filename : null;
}

export function previewHtml(html) {
  return html
    .replace('<html lang="en-AU">', '<html lang="en-AU" data-noindex>')
    .replace(/<link rel="canonical"[^>]*>/g, "")
    .replace(/<meta property="og:url"[^>]*>/g, "")
    .replace(/<script id="(?:business|page)-structured-data"[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<meta name="robots"[^>]*>/g, '<meta name="robots" content="noindex, nofollow">')
    .replace(/<meta name="(?:google-site-verification|msvalidate\.01)"[^>]*>/g, "");
}