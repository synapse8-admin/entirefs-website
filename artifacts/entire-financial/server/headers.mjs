/** Report-only script policy until the live vendor's changing origin set is approved. */
export const REPORT_ONLY_CSP = [
  "default-src 'self'",
  "script-src 'self' https://widgets.sociablekit.com https://embeds.sociablekit.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://widgets.sociablekit.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  "connect-src 'self' https://*.sociablekit.com https://data.accentapi.com",
  "frame-src https://www.google.com https://maps.google.com",
  "object-src 'none'", "base-uri 'self'",
].join("; ");

export function applyHeaders(response, { indexable, https }) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.setHeader("Content-Security-Policy-Report-Only", REPORT_ONLY_CSP);
  // Enforce only directives that cannot block the required widget/map/scripts.
  response.setHeader("Content-Security-Policy",
    `object-src 'none'; base-uri 'self'${indexable ? "; frame-ancestors 'self'" : ""}`);
  if (indexable && https) response.setHeader("Strict-Transport-Security", "max-age=31536000");
  if (!indexable) response.setHeader("X-Robots-Tag", "noindex, nofollow");
}