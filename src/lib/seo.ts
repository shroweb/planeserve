export const SITE_URL = "https://www.aircraftprogram.com";
export const SITE_NAME = "Aircraft Program";
export const OG_IMAGE = `${SITE_URL}/og-default.jpg`;
export const OG_IMAGE_ALT =
  "Business aircraft in a maintenance hangar, supported by Aircraft Program";

interface PageHeadOptions {
  title: string;
  description: string;
  /** Path beginning with "/" (or "" for the home page). Used for canonical and og:url. */
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
  /** ISO date, article pages only. */
  published?: string;
  modified?: string;
  image?: string;
}

/** Keep meta descriptions within the ~160 character snippet limit. */
function fitDescription(text: string, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`;
}

export function pageHead({
  title,
  description,
  path,
  type = "website",
  noindex = false,
  published,
  modified,
  image = OG_IMAGE,
}: PageHeadOptions) {
  const url = `${SITE_URL}${path}`;
  description = fitDescription(description);
  const meta: Record<string, string>[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: OG_IMAGE_ALT },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
  if (noindex) meta.push({ name: "robots", content: "noindex,follow" });
  if (published) meta.push({ property: "article:published_time", content: published });
  if (modified) meta.push({ property: "article:modified_time", content: modified });
  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

export function jsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Retained AOG support for business jets and turboprops: a 24/7 AOG desk, AOG parts procurement and a digital Parts Passport.",
  email: "ops@aircraftprogram.com",
  founder: { "@type": "Person", name: "James Moon" },
  sameAs: ["https://linkedin.com/company/aircraft-program"],
};

export const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}

export function articleLd(opts: {
  title: string;
  description: string;
  path: string;
  published: string;
  modified?: string;
}) {
  const url = `${SITE_URL}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: OG_IMAGE,
    datePublished: opts.published,
    dateModified: opts.modified ?? opts.published,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
