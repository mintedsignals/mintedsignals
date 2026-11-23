import { categories, type Category } from "@/config/site";
import { venueNames, venues, type Venue } from "./types";

/**
 * Filters for /markets. Every combination is its own static page with a path URL, so each
 * view is crawlable and needs no server:
 *
 *   /markets                                   all markets, page 1
 *   /markets/page/2                            all markets, page 2
 *   /markets/category/crypto                   one category
 *   /markets/venue/kalshi                      one venue
 *   /markets/category/crypto/venue/kalshi      both
 *   …/page/N                                   later pages of any of the above
 */
export interface MarketFilters {
  category?: Category;
  venue?: Venue;
  page: number;
}

export const MARKETS_PAGE_SIZE = 50;

const categorySlug = (c: Category) => c.toLowerCase();
const categoryFromSlug = (s: string) => categories.find((c) => categorySlug(c) === s);

/** Path segments after /markets for a set of filters (page 1 omitted). */
export function filterSegments(filters: Partial<MarketFilters>): string[] {
  const segments: string[] = [];
  if (filters.category) segments.push("category", categorySlug(filters.category));
  if (filters.venue) segments.push("venue", filters.venue);
  if (filters.page && filters.page > 1) segments.push("page", String(filters.page));
  return segments;
}

/** Canonical URL for a set of filters. */
export function filtersHref(filters: Partial<MarketFilters>): string {
  const segments = filterSegments(filters);
  return segments.length ? `/markets/${segments.join("/")}` : "/markets";
}

/** Read filters back from the path segments after /markets. Null if they aren't a valid view. */
export function parseFilterSegments(segments: string[]): MarketFilters | null {
  const filters: MarketFilters = { page: 1 };
  let i = 0;
  if (segments[i] === "category") {
    const category = categoryFromSlug(segments[i + 1] ?? "");
    if (!category) return null;
    filters.category = category;
    i += 2;
  }
  if (segments[i] === "venue") {
    const venue = venues.find((v) => v === segments[i + 1]);
    if (!venue) return null;
    filters.venue = venue;
    i += 2;
  }
  if (segments[i] === "page") {
    const page = Number(segments[i + 1]);
    if (!Number.isInteger(page) || page < 2 || String(page) !== segments[i + 1]) return null;
    filters.page = page;
    i += 2;
  }
  return i === segments.length ? filters : null;
}

/**
 * Every filtered view to build, with its page count. `countFor` returns how many open markets
 * match; views with no markets get a single page that says so.
 */
export function allFilterViews(countFor: (f: { category?: Category; venue?: Venue }) => number): MarketFilters[] {
  const views: MarketFilters[] = [];
  for (const category of [undefined, ...categories]) {
    for (const venue of [undefined, ...venues]) {
      const pages = Math.max(1, Math.ceil(countFor({ category, venue }) / MARKETS_PAGE_SIZE));
      for (let page = 1; page <= pages; page++) views.push({ category, venue, page });
    }
  }
  return views;
}

/** Heading, title and description for a filtered view, so each one is unique. */
export function filtersCopy(filters: MarketFilters, total: number) {
  const { category, venue, page } = filters;
  const venueName = venue ? venueNames[venue] : null;
  const subject = category === "Other" ? "Other" : category;

  const heading = subject
    ? `${subject} prediction markets${venueName ? ` on ${venueName}` : ""}`
    : venueName
      ? `${venueName} prediction markets`
      : "All prediction markets";

  const where = venueName ?? "Polymarket and Kalshi";
  const what = subject ? `${subject.toLowerCase()} prediction markets` : "prediction markets";
  const description = `Odds for ${total.toLocaleString("en-US")} open ${what} on ${where}, sorted by 24-hour volume.`;
  const title = page > 1 ? `${heading} (page ${page})` : heading;
  return { heading, title, description };
}
