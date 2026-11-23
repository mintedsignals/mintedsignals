import type { Market, MarketsSnapshot, Venue, VenueStatus } from "./types";
import { venues } from "./types";

export type VenueFetcher = () => Promise<Market[]>;

/** The last successful result per venue, kept so a failed refresh never empties the site. */
export type LastGood = Partial<Record<Venue, { markets: Market[]; fetchedAt: string }>>;

/**
 * Fetch every venue independently. A venue that fails (or suddenly returns nothing, which
 * usually means the API changed) falls back to its last good data, marked "stale".
 * Updates `lastGood` in place on success.
 */
export async function buildSnapshot(
  fetchers: Record<Venue, VenueFetcher>,
  lastGood: LastGood,
  now: () => Date = () => new Date(),
): Promise<{ snapshot: MarketsSnapshot; freshVenues: number }> {
  const results = await Promise.allSettled(venues.map((v) => fetchers[v]()));

  const markets: Market[] = [];
  const statuses = {} as Record<Venue, VenueStatus>;
  let freshVenues = 0;

  venues.forEach((venue, i) => {
    const result = results[i];
    const fresh = result.status === "fulfilled" && result.value.length > 0 ? result.value : null;

    if (fresh) {
      const fetchedAt = now().toISOString();
      lastGood[venue] = { markets: fresh, fetchedAt };
      markets.push(...fresh);
      statuses[venue] = { status: "ok", fetchedAt };
      freshVenues++;
      return;
    }

    const error =
      result.status === "rejected"
        ? result.reason instanceof Error
          ? result.reason.message
          : String(result.reason)
        : "returned no markets";
    const previous = lastGood[venue];
    if (previous) {
      markets.push(...previous.markets);
      statuses[venue] = { status: "stale", fetchedAt: previous.fetchedAt, error };
    } else {
      statuses[venue] = { status: "unavailable", fetchedAt: null, error };
    }
  });

  return { snapshot: { markets, venues: statuses }, freshVenues };
}

/** Snapshot made only from last good data, for when even the cached loader fails. */
export function snapshotFromLastGood(lastGood: LastGood, error: string): MarketsSnapshot {
  const statuses = {} as Record<Venue, VenueStatus>;
  const markets: Market[] = [];
  for (const venue of venues) {
    const previous = lastGood[venue];
    if (previous) markets.push(...previous.markets);
    statuses[venue] = previous
      ? { status: "stale", fetchedAt: previous.fetchedAt, error }
      : { status: "unavailable", fetchedAt: null, error };
  }
  return { markets, venues: statuses };
}
