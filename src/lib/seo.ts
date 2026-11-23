import { site } from "@/config/site";

/** Structured data (schema.org JSON-LD) builders. Rendered with <JsonLd />. */

/**
 * The site's default share image (app/opengraph-image.tsx). Pages that set their own
 * `openGraph` replace the inherited one entirely, so they must list it again.
 */
export const defaultOgImages = [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: prediction market odds, guides and analysis` }];

export const absoluteUrl = (path: string) => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

const organization = { "@type": "Organization", name: site.name, url: site.url } as const;

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: organization,
  };
}

/** Breadcrumb trail. Home comes first; the last item is the current page and has no URL. */
export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href && i < trail.length - 1 ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function articleJsonLd(article: {
  path: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  updated: string;
  /** Article author's name; leave out to credit the site. Bracketed placeholders are ignored. */
  author?: string;
}) {
  const author =
    article.author && !article.author.startsWith("[") ? { "@type": "Person", name: article.author } : organization;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: absoluteUrl(article.path),
    mainEntityOfPage: absoluteUrl(article.path),
    datePublished: article.updated,
    dateModified: article.updated,
    author,
    publisher: organization,
  };
}

export function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so it can't close the tag. */
export const serializeJsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
