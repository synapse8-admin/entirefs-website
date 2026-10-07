export const DEFAULT_SITE_URL = "https://www.entirefs.com.au";
export const SITE_URL = typeof __SITE_URL__ === "string" ? __SITE_URL__ : DEFAULT_SITE_URL;
export const PUBLIC_ROUTES = [
  "/", "/about", "/contact", "/services/superannuation", "/transition-to-retirement",
  "/retirement-planning", "/aged-care", "/privacy-policy",
  "/financial-services-guide", "/complaints",
] as const;

export function cleanRoute(path: string) {
  return path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
}

export function isProductionOrigin(origin: string) {
  return origin === SITE_URL;
}