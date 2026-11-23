import type { MetadataRoute } from "next";
import { categories, guides, platforms, site } from "@/config/site";
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
  "/glossary",
  "/advertise",
  "/about",
  "/disclosure",
  "/contact",
  "/privacy",
];

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
    ...guides.map((g) => ({ url: url(`/guides/${g.slug}`) })),
    ...platforms.map((p) => ({ url: url(`/platforms/${p.slug}`) })),
    ...filterPaths.map((p) => ({ url: url(p), changeFrequency: "hourly" as const })),
    ...markets.map((m) => ({
      url: url(marketPath(m)),
      lastModified: status[m.venue].fetchedAt ?? undefined,
      changeFrequency: "hourly" as const,
    })),
  ];
}
