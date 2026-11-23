import { categories, type Category } from "@/config/site";
import { venueNames, venues, type Venue } from "./types";

/** Filters for /markets, read from and written to the URL so every view is crawlable. */
export interface MarketFilters {
  category?: Category;
  venue?: Venue;
  page: number;
}

export const MARKETS_PAGE_SIZE = 50;

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim().toLowerCase();

/** Unknown values are ignored rather than erroring, e.g. ?category=foo shows all categories. */
export function parseFilters(searchParams: SearchParams): MarketFilters {
  const category = categories.find((c) => c.toLowerCase() === first(searchParams.category));
  const venue = venues.find((v) => v === first(searchParams.venue));
  const page = Number(first(searchParams.page));
  return { category, venue, page: Number.isInteger(page) && page > 1 ? page : 1 };
}

/** Canonical URL for a set of filters: fixed parameter order, page 1 omitted. */
export function filtersHref(filters: Partial<MarketFilters>): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category.toLowerCase());
  if (filters.venue) params.set("venue", filters.venue);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `/markets?${query}` : "/markets";
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
  const description = `Live odds for ${total.toLocaleString("en-US")} open ${what} on ${where}, sorted by 24-hour volume and updated every minute.`;
  const title = page > 1 ? `${heading} (page ${page})` : heading;
  return { heading, title, description };
}
