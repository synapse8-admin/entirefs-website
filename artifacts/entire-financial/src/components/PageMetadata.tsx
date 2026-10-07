import { useEffect } from "react";
import { useLocation } from "wouter";
import { getMetadata, metadataFields, PAGE_METADATA } from "@/lib/metadata";
import { cleanRoute, isProductionOrigin, SITE_URL } from "@/lib/site";
import { getBusinessStructuredData, getPageStructuredData, serializeStructuredData } from "@/lib/structured-data";

export function PageMetadata() {
  const [location] = useLocation();
  useEffect(() => {
    const route = cleanRoute(location);
    const known = Object.hasOwn(PAGE_METADATA, route);
    const indexable = isProductionOrigin(window.location.origin) &&
      !document.documentElement.hasAttribute("data-noindex");
    document.title = getMetadata(route).title;
    for (const [attribute, fields] of Object.entries(metadataFields(route, indexable))) {
      for (const [key, value] of Object.entries(fields)) {
        let meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute(attribute, key);
          document.head.appendChild(meta);
        }
        meta.content = value;
      }
    }
    if (!indexable || !known) document.querySelector('meta[property="og:url"]')?.remove();
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (indexable && known) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `${SITE_URL}${route}`;
    } else canonical?.remove();
    for (const [id, data] of [
      ["business-structured-data", getBusinessStructuredData()],
      ["page-structured-data", getPageStructuredData(route)],
    ] as const) {
      let script = document.getElementById(id);
      if (!indexable || !known || !data) { script?.remove(); continue; }
      if (!script) {
        script = document.createElement("script");
        script.id = id;
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = serializeStructuredData(data);
    }
  }, [location]);
  return null;
}