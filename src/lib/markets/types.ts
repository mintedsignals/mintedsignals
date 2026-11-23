import type { Category } from "@/config/site";

export type Venue = "polymarket" | "kalshi";

export const venues: Venue[] = ["polymarket", "kalshi"];

export const venueNames: Record<Venue, string> = {
  polymarket: "Polymarket",
  kalshi: "Kalshi",
};

/** One market from either venue, normalised. All prices are 0 to 1. */
export interface Market {
  /** Globally unique: "polymarket:<market id>" or "kalshi:<market ticker>". Used for pins and /go links. */
  id: string;
  venue: Venue;
  question: string;
  /** Our URL slug, unique within the venue: /markets/[venue]/[slug]. */
  slug: string;
  category: Category;
  /** Price of the outcome named in `yesOutcome`, 0 to 1. Reads as implied chance. */
  yesPrice: number;
  /** The outcome `yesPrice` refers to: "Yes" for YES/NO markets, otherwise e.g. a team name or "Over". */
  yesOutcome: string;
  /** Change in `yesPrice` over 24 hours, in price units (0.042 = +4.2 points). Null when the venue doesn't say. */
  change24h: number | null;
  /**
   * 24h volume in US dollars. Kalshi reports contracts, which we count as $1 each:
   * approximate, and somewhat overstates Kalshi relative to Polymarket.
   */
  volume24h: number;
  /** ISO timestamp when trading closes, if known. */
  closeTime: string | null;
  /** The market's page on the venue (not affiliate-wrapped; /go handles tracking). */
  url: string;
  /** Groups markets from the same event, e.g. every candidate in one election. */
  eventId: string;
  isOpen: boolean;
  /** How the market resolves, in the venue's own words. Null if the venue doesn't say. */
  rules: string | null;
}

/** A market without the long rules text, for lists sent to the browser. */
export type MarketSummary = Omit<Market, "rules">;

export const toSummary = ({ rules: _rules, ...summary }: Market): MarketSummary => summary;

export type VenueStatus = {
  /** ok: fetched this cycle. stale: fetch failed, serving last good data. unavailable: no data at all. */
  status: "ok" | "stale" | "unavailable";
  /** When the data being served was fetched. */
  fetchedAt: string | null;
  error?: string;
};

export interface MarketsSnapshot {
  markets: Market[];
  venues: Record<Venue, VenueStatus>;
}
