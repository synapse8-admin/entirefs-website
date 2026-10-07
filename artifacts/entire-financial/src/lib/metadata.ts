import privacy from "../data/privacy-policy.json";
import { cleanRoute, SITE_URL } from "./site";
import { getBusinessStructuredData, getPageStructuredData, serializeStructuredData } from "./structured-data";

export const PAGE_METADATA: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Purpose-driven financial advice | Entire Financial Services",
    description: "Explore purpose-driven retirement advice from Entire Financial Services, covering superannuation, investments, retirement income, Centrelink and aged care.",
  },
  "/about": {
    title: "About us | Entire Financial Services",
    description: "Meet Bevan Heneric and learn about Entire Financial Services, our approach to financial advice and the experience behind our personalised retirement planning.",
  },
  "/contact": {
    title: "Contact us | Entire Financial Services",
    description: "Contact Entire Financial Services by phone or email, find our Clayton office, or enquire about a consultation to discuss your financial goals and options.",
  },
  "/services/superannuation": {
    title: "Superannuation advice | Entire Financial Services",
    description: "Understand your superannuation options with Entire Financial Services, including contributions, fund consolidation and planning for your retirement goals.",
  },
  "/transition-to-retirement": {
    title: "Transition to retirement | Entire Financial Services",
    description: "Explore transition-to-retirement strategies with Entire Financial Services, including income streams, superannuation contributions and cash flow as work changes.",
  },
  "/retirement-planning": {
    title: "Retirement planning | Entire Financial Services",
    description: "Plan for retirement with Entire Financial Services. Understand retirement income, superannuation, investments and Centrelink in the context of your goals.",
  },
  "/aged-care": {
    title: "Aged care advice | Entire Financial Services",
    description: "Understand aged care costs and funding options with Entire Financial Services, including accommodation, cash flow and the financial implications for your family.",
  },
  "/privacy-policy": { title: privacy.metaTitle, description: privacy.metaDescription },
  "/financial-services-guide": {
    title: "Financial Services Guide | Entire Financial Services",
    description: "Read the Entire Financial Services Financial Services Guide, including advice services, fees, remuneration, privacy and the complaints resolution process.",
  },
  "/complaints": {
    title: "Complaints resolution | Entire Financial Services",
    description: "Learn how to raise a complaint with Entire Financial Services and find information about our resolution process and the Australian Financial Complaints Authority.",
  },
};

export const SOCIAL_IMAGE_ALT = "Entire Financial Services logo on the approved teal and sage brand colours";

export function getMetadata(path: string) {
  return PAGE_METADATA[cleanRoute(path)] ?? {
    title: "Page not found | Entire Financial Services",
    description: "This page could not be found. Return to Entire Financial Services or contact us for assistance.",
  };
}

function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Also consumed by client navigation, so all crawlers and visitors see the same metadata. */
export function metadataFields(path: string, indexable: boolean) {
  const route = cleanRoute(path);
  const { title, description } = getMetadata(route);
  const known = Object.hasOwn(PAGE_METADATA, route);
  const shareImage = `${SITE_URL}/opengraph.jpg`;
  return {
    name: {
      description,
      robots: indexable && known ? "index, follow" : "noindex, nofollow",
      "twitter:card": "summary_large_image", "twitter:title": title,
      "twitter:description": description, "twitter:image": shareImage,
      "twitter:image:alt": SOCIAL_IMAGE_ALT,
    },
    property: {
      "og:title": title, "og:description": description, "og:type": "website",
      "og:site_name": "Entire Financial Services", "og:locale": "en_AU",
      "og:image": shareImage, "og:image:width": "1200", "og:image:height": "630",
      "og:image:alt": SOCIAL_IMAGE_ALT,
      ...(indexable && known ? { "og:url": `${SITE_URL}${route}` } : {}),
    },
  };
}

export function renderHead(path: string, indexable: boolean, verification: Record<string, string | undefined> = {}) {
  const route = cleanRoute(path);
  const known = Object.hasOwn(PAGE_METADATA, route);
  const fields = metadataFields(route, indexable);
  const tags = [`<title>${escapeAttribute(getMetadata(route).title)}</title>`];
  for (const [attribute, entries] of Object.entries(fields)) {
    for (const [key, value] of Object.entries(entries))
      tags.push(`<meta ${attribute}="${key}" content="${escapeAttribute(value)}">`);
  }
  if (indexable && known) {
    tags.push(`<link rel="canonical" href="${SITE_URL}${route}">`);
    tags.push(`<script id="business-structured-data" type="application/ld+json">${serializeStructuredData(getBusinessStructuredData())}</script>`);
    tags.push(`<script id="page-structured-data" type="application/ld+json">${serializeStructuredData(getPageStructuredData(route))}</script>`);
    for (const [key, value] of Object.entries(verification))
      if (value?.trim()) tags.push(`<meta name="${key}" content="${escapeAttribute(value.trim())}">`);
  }
  return tags.join("\n");
}