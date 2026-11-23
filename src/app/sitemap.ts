import type { MetadataRoute } from "next";
import { articleEntries, guideEntries, reviewEntries } from "@/content";
import { categories, site } from "@/config/site";
import { getMarketsSnapshot, venues } from "@/lib/markets";
import { filtersHref } from "@/lib/markets/filters";
import { marketPath } from "@/lib/markets/links";

const staticPaths = [
  "/",
  "/markets",
  "/guides",
  "/platforms",
  "/analysis",
  "/tools/odds-calculator",
  "/advertise",
  "/disclosure",
  // Add "/about", "/contact", "/privacy" and "/glossary" once those pages are written
  // (they're placeholders marked noindex until then).
];

const published = (e: { status: string }) => e.status === "published";

/** Every page we want indexed, including one entry per tracked market (~1,800). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { markets, venues: status } = await getMarketsSnapshot();
  const url = (path: string) => `${site.url}${path}`;

  const filterPaths = [
    ...categories.map((category) => filtersHref({ category })),
    ...venues.map((venue) => filtersHref({ venue })),
  ];

  return [
    ...staticPaths.map((p) => ({ url: url(p) })),
    // Drafts are noindex, so they stay out until published (see src/content/index.ts).
    ...guideEntries.filter(published).map((g) => ({ url: url(`/guides/${g.slug}`), lastModified: g.updated })),
    ...reviewEntries.filter(published).map((r) => ({ url: url(`/platforms/${r.slug}`), lastModified: r.updated })),
    ...articleEntries.filter(published).map((a) => ({ url: url(`/analysis/${a.slug}`), lastModified: a.updated })),
    ...filterPaths.map((p) => ({ url: url(p), changeFrequency: "hourly" as const })),
    ...markets.map((m) => ({
      url: url(marketPath(m)),
      lastModified: status[m.venue].fetchedAt ?? undefined,
      changeFrequency: "hourly" as const,
    })),
  ];
}
