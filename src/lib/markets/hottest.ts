import type { Category } from "@/config/site";
import type { Market, Venue } from "./types";

export interface HottestOptions {
  venue?: Venue;
  category?: Category;
  limit?: number;
  /** Keep only the highest-volume market from each event. */
  onePerEvent?: boolean;
  /** Market ids shown first, in this order, when they are open and match the filters. */
  pinned?: string[];
}

/** Open markets sorted by 24h volume, pins first. */
export function selectHottest(markets: Market[], options: HottestOptions = {}): Market[] {
  const { venue, category, limit = 8, onePerEvent = true, pinned = [] } = options;

  const candidates = markets.filter(
    (m) => m.isOpen && (!venue || m.venue === venue) && (!category || m.category === category),
  );

  const byId = new Map(candidates.map((m) => [m.id, m]));
  const pins = pinned.flatMap((id) => byId.get(id) ?? []);
  const pinIds = new Set(pins.map((m) => m.id));
  const rest = candidates.filter((m) => !pinIds.has(m.id)).sort((a, b) => b.volume24h - a.volume24h);

  const selected: Market[] = [];
  const seenEvents = new Set<string>();
  for (const m of [...pins, ...rest]) {
    if (selected.length >= limit) break;
    // Pins always show; they still claim their event so it isn't repeated below them.
    if (onePerEvent && seenEvents.has(m.eventId) && !pinIds.has(m.id)) continue;
    seenEvents.add(m.eventId);
    selected.push(m);
  }
  return selected;
}
