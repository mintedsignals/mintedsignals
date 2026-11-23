import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { HOTTEST, KALSHI_SERIES, MARKETS_REVALIDATE_SECONDS, POLYMARKET_MAX_MARKETS } from "@/config/markets";
import { selectHottest, type HottestOptions } from "./hottest";
import { getJson } from "./http";
import { fetchKalshiMarket, fetchKalshiMarkets } from "./kalshi";
import { fetchPolymarketMarket, fetchPolymarketMarkets } from "./polymarket";
import { tickerFromKalshiSlug } from "./slug";
import { buildSnapshot, snapshotFromLastGood, type LastGood } from "./snapshot";
import type { Market, MarketsSnapshot, Venue } from "./types";

export type { Market, MarketsSnapshot, Venue } from "./types";
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

  // Nothing fresh and nothing saved: throw rather than cache an empty snapshot.
  if (freshVenues === 0 && snapshot.markets.length === 0) {
    throw new Error(`Market data unavailable: ${JSON.stringify(snapshot.venues)}`);
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
