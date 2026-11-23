import "server-only";
import type { Category } from "@/config/site";
import { cacheLife, cacheTag } from "next/cache";
import { HOTTEST, KALSHI_SERIES, MARKETS_REVALIDATE_SECONDS, POLYMARKET_MAX_MARKETS } from "@/config/markets";
import { selectHottest, type HottestOptions } from "./hottest";
import { getJson } from "./http";
import { fetchKalshiMarket, fetchKalshiMarkets } from "./kalshi";
import { fetchPolymarketMarket, fetchPolymarketMarkets } from "./polymarket";
import { tickerFromKalshiSlug } from "./slug";
import { buildSnapshot, snapshotFromLastGood, type LastGood } from "./snapshot";
import { toSummary, venues, type Market, type MarketSummary, type MarketsSnapshot, type Venue } from "./types";

export type { Market, MarketSummary, MarketsSnapshot, Venue } from "./types";
export { venueNames, venues } from "./types";

/**
 * Market data for the whole site. Server only: the venue APIs are never called from the browser.
 *
 * Caching: the normalised snapshot is cached for MARKETS_REVALIDATE_SECONDS and refreshed in
 * the background. If a venue fails, its last good data is served (status "stale"). That copy
 * lives in this server process's memory, so a brand-new server instance has none until its
 * first successful fetch.
 */

const lastGood: LastGood = {};

const cacheProfile = {
  stale: MARKETS_REVALIDATE_SECONDS,
  revalidate: MARKETS_REVALIDATE_SECONDS,
  expire: 60 * 60 * 24,
};

async function loadSnapshot(): Promise<MarketsSnapshot> {
  "use cache";
  cacheLife(cacheProfile);
  cacheTag("markets");

  const { snapshot, freshVenues } = await buildSnapshot(
    {
      polymarket: () => fetchPolymarketMarkets(getJson, POLYMARKET_MAX_MARKETS),
      kalshi: () => fetchKalshiMarkets(getJson, KALSHI_SERIES),
    },
    lastGood,
  );

  // A venue with no data at all (failed, and nothing saved in this process): throw rather
  // than cache a snapshot missing that venue. Next.js then keeps serving the previous
  // page, which still has it (checked on a production build with the APIs returning 503).
  const missing = venues.filter((v) => snapshot.venues[v].status === "unavailable");
  if (missing.length > 0) {
    throw new Error(`Market data unavailable (${freshVenues} fresh): ${JSON.stringify(snapshot.venues)}`);
  }
  return snapshot;
}

/** Every tracked open market from both venues. Never throws. */
export async function getMarketsSnapshot(): Promise<MarketsSnapshot> {
  try {
    return await loadSnapshot();
  } catch (error) {
    console.error("[markets] snapshot failed", error);
    return snapshotFromLastGood(lastGood, error instanceof Error ? error.message : String(error));
  }
}

/** The "Hottest markets" list: by 24h volume, one per event, pins from config/markets.ts first. */
export async function getHottestMarkets(options: Omit<HottestOptions, "pinned" | "onePerEvent"> = {}): Promise<Market[]> {
  const { markets } = await getMarketsSnapshot();
  return selectHottest(markets, { ...options, onePerEvent: HOTTEST.onePerEvent, pinned: HOTTEST.pinned });
}

async function loadMarket(venue: Venue, slug: string): Promise<Market | null> {
  "use cache";
  cacheLife(cacheProfile);
  cacheTag("markets", `market:${venue}:${slug}`);

  if (venue === "polymarket") return fetchPolymarketMarket(getJson, slug);

  const ticker = tickerFromKalshiSlug(slug);
  if (!ticker) return null;
  const series = KALSHI_SERIES.find((s) => ticker.startsWith(`${s.ticker}-`));
  return fetchKalshiMarket(getJson, ticker, series?.category);
}

/**
 * One market for /markets/[venue]/[slug], open or closed. Uses the snapshot when the market
 * is in it, otherwise asks the venue. Returns null if the market doesn't exist.
 * Throws if the venue is down and we have no copy (the page decides what to show).
 */
export async function getMarket(venue: Venue, slug: string): Promise<Market | null> {
  const { markets } = await getMarketsSnapshot();
  const known = markets.find((m) => m.venue === venue && m.slug === slug);
  if (known) return known;
  return loadMarket(venue, slug);
}

export const isVenue = (value: string): value is Venue => (venues as string[]).includes(value);

const byVolume = (a: MarketSummary, b: MarketSummary) => b.volume24h - a.volume24h;

/** Open markets, highest 24h volume first, optionally filtered. Every market, not one per event. */
export async function listMarkets(filter: { category?: Category; venue?: Venue } = {}): Promise<MarketSummary[]> {
  const { markets } = await getMarketsSnapshot();
  return markets
    .filter((m) => m.isOpen && (!filter.venue || m.venue === filter.venue) && (!filter.category || m.category === filter.category))
    .map(toSummary)
    .sort(byVolume);
}

/** Other outcomes of the same event, then the hottest markets in the same category. */
export async function getRelatedMarkets(
  market: Market,
  limit = 6,
): Promise<{ sameEvent: MarketSummary[]; sameCategory: MarketSummary[] }> {
  const { markets } = await getMarketsSnapshot();
  const sameEvent = markets
    .filter((m) => m.eventId === market.eventId && m.id !== market.id && m.isOpen)
    .map(toSummary)
    .sort(byVolume)
    .slice(0, limit);
  const sameCategory = selectHottest(
    markets.filter((m) => m.eventId !== market.eventId),
    { category: market.category, limit, onePerEvent: true },
  ).map(toSummary);
  return { sameEvent, sameCategory };
}

/** The highest-volume market pages, to prerender at build time. Others render on first visit. */
export async function getTopMarketParams(limit: number): Promise<{ venue: Venue; slug: string }[]> {
  const { markets } = await getMarketsSnapshot();
  return selectHottest(markets, { limit, onePerEvent: false }).map((m) => ({ venue: m.venue, slug: m.slug }));
}
