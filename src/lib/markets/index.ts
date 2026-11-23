import "server-only";
import { readFile } from "node:fs/promises";
import type { Category } from "@/config/site";
import { HOTTEST, KALSHI_SERIES, POLYMARKET_MAX_MARKETS } from "@/config/markets";
import { selectHottest, type HottestOptions } from "./hottest";
import { getJson } from "./http";
import { fetchKalshiMarkets } from "./kalshi";
import { fetchPolymarketMarkets } from "./polymarket";
import { buildSnapshot } from "./snapshot";
import { SNAPSHOT_FILE } from "./snapshot-file";
import { toSummary, venues, type Market, type MarketSummary, type MarketsSnapshot, type Venue } from "./types";

export type { Market, MarketSummary, MarketsSnapshot, Venue } from "./types";
export { venueNames, venues } from "./types";

/**
 * Market data for the whole site. The site is a static export (see next.config.ts), so this
 * runs only during `next build`: the venue APIs are fetched once per build and every page is
 * rendered from that one snapshot. A scheduled rebuild refreshes the odds (docs/DEPLOY.md).
 *
 * If a venue fails, or more than a quarter of the Kalshi series do, this throws and the build
 * fails, so the live site keeps its previous build rather than shipping missing odds.
 */

let snapshotPromise: Promise<MarketsSnapshot> | null = null;

async function fetchSnapshot(): Promise<MarketsSnapshot> {
  const { snapshot, freshVenues } = await buildSnapshot(
    {
      polymarket: () => fetchPolymarketMarkets(getJson, POLYMARKET_MAX_MARKETS),
      kalshi: () => fetchKalshiMarkets(getJson, KALSHI_SERIES),
    },
    {}, // no earlier copy at build time
  );
  const missing = venues.filter((v) => snapshot.venues[v].status !== "ok");
  if (missing.length > 0) {
    throw new Error(`Market data unavailable (${freshVenues} fresh): ${JSON.stringify(snapshot.venues)}`);
  }
  return snapshot;
}

/**
 * Every tracked open market from both venues. During `pnpm build` this reads the snapshot that
 * scripts/fetch-markets.ts saved just before, so the whole build uses one fetch. Without that
 * file (e.g. `next dev`), it fetches live once per process.
 */
export function getMarketsSnapshot(): Promise<MarketsSnapshot> {
  snapshotPromise ??= readSavedSnapshot()
    .then((saved) => saved ?? fetchSnapshot())
    .catch((error) => {
      snapshotPromise = null; // let a later page retry rather than reuse the failure
      console.error("[markets] snapshot failed", error);
      throw error;
    });
  return snapshotPromise;
}

async function readSavedSnapshot(): Promise<MarketsSnapshot | null> {
  try {
    return JSON.parse(await readFile(SNAPSHOT_FILE, "utf8")) as MarketsSnapshot;
  } catch {
    return null;
  }
}

/** The "Hottest markets" list: by 24h volume, one per event, pins from config/markets.ts first. */
export async function getHottestMarkets(options: Omit<HottestOptions, "pinned" | "onePerEvent"> = {}): Promise<Market[]> {
  const { markets } = await getMarketsSnapshot();
  return selectHottest(markets, { ...options, onePerEvent: HOTTEST.onePerEvent, pinned: HOTTEST.pinned });
}

/** One market for /markets/[venue]/[slug]. Only markets in the snapshot have pages. */
export async function getMarket(venue: Venue, slug: string): Promise<Market | null> {
  const { markets } = await getMarketsSnapshot();
  return markets.find((m) => m.venue === venue && m.slug === slug) ?? null;
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

/** Every market page to build: one per market in the snapshot. */
export async function getAllMarketParams(): Promise<{ venue: Venue; slug: string }[]> {
  const { markets } = await getMarketsSnapshot();
  return markets.map((m) => ({ venue: m.venue, slug: m.slug }));
}
