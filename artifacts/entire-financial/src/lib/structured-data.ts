import { PUBLIC_ROUTES, SITE_URL } from "./site.ts";
export const SCHEMA_BASE_URL = SITE_URL;
export const PAGE_SCHEMA_ID = "page-structured-data";

const services: Record<string, { name: string; serviceType: string; description: string }> = {
  "/retirement-planning": {
    name: "Retirement Planning",
    serviceType: "Retirement planning financial advice",
    description: "Financial advice to help plan retirement income, superannuation and investments around your circumstances and retirement goals.",
  },
  "/aged-care": {
    name: "Aged Care Financial Advice",
    serviceType: "Aged care financial advice",
    description: "Financial advice to help understand aged care costs, funding options and the financial implications for you and your family.",
  },
  "/transition-to-retirement": {
    name: "Transition to Retirement",
    serviceType: "Transition to retirement financial advice",
    description: "Financial advice on transition-to-retirement income streams, superannuation contributions and cash flow as you approach retirement.",
  },
  "/services/superannuation": {
    name: "Superannuation Advice",
    serviceType: "Superannuation financial advice",
    description: "Financial advice on superannuation funds, contributions and consolidation to support your retirement goals.",
  },
};

export const STRUCTURED_DATA_ROUTES = PUBLIC_ROUTES.filter((route) => route !== "/");

export function getBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "FinancialService"],
        "@id": `${SITE_URL}/#organization`, name: "Entire Financial Services",
        url: `${SITE_URL}/`, logo: `${SITE_URL}/logo-brand.svg`,
        description: "Purpose-driven retirement planning, superannuation, and aged care financial advice.",
        telephone: "+61421833372", email: "bevan@entirefs.com.au",
        address: {
          "@type": "PostalAddress", streetAddress: "Suite 42, Building 4, 195 Wellington Road",
          addressLocality: "Clayton", addressRegion: "VIC", postalCode: "3168", addressCountry: "AU",
        },
        areaServed: "Melbourne, VIC, Australia",
      },
      {
        "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`,
        name: "Entire Financial Services", publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-AU",
      },
    ],
  };
}

/** Shared by build-time HTML generation and client navigation; no browser dependencies. */
export function getPageStructuredData(pathname: string) {
  const route = pathname.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const url = `${SCHEMA_BASE_URL}${route}`;
  const organization = { "@id": `${SCHEMA_BASE_URL}/#organization` };
  const service = Object.hasOwn(services, route) ? services[route] : undefined;

  if (service) {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          url,
          name: service.name,
          isPartOf: { "@id": `${SCHEMA_BASE_URL}/#website` },
          mainEntity: { "@id": `${url}#service` },
        },
        {
          "@type": "Service",
          "@id": `${url}#service`,
          url,
          ...service,
          provider: organization,
          areaServed: "Melbourne, VIC, Australia",
          mainEntityOfPage: { "@id": `${url}#webpage` },
        },
      ],
    };
  }

  if (route === "/about") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "AboutPage",
          "@id": `${url}#webpage`,
          url,
          name: "About Entire Financial Services",
          isPartOf: { "@id": `${SCHEMA_BASE_URL}/#website` },
          about: [organization, { "@id": `${url}#bevan-heneric` }],
        },
        {
          "@type": "Person",
          "@id": `${url}#bevan-heneric`,
          name: "Bevan Heneric",
          url,
          jobTitle: "Principal Financial Adviser",
          worksFor: organization,
          description: "Bevan Heneric is the Principal Financial Adviser at Entire Financial Services, with more than 20 years of experience across the financial services industry.",
          knowsAbout: ["Superannuation", "Retirement income", "Investments", "Centrelink", "Aged care"],
          mainEntityOfPage: { "@id": `${url}#webpage` },
        },
      ],
    };
  }

  if (!PUBLIC_ROUTES.some((path) => path === route)) return null;
  return {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "WebPage", "@id": `${url}#webpage`, url,
      name: route === "/" ? "Entire Financial Services" : route.slice(1).replace(/-/g, " "),
      isPartOf: { "@id": `${SCHEMA_BASE_URL}/#website` }, about: organization,
    }],
  };
}

export function serializeStructuredData(data: unknown): string {
  // Avoid allowing embedded text to close an HTML script tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}