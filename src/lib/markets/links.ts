import type { MarketSummary } from "./types";

/** Our page for a market (built in phase 4). */
export const marketPath = (m: Pick<MarketSummary, "venue" | "slug">) => `/markets/${m.venue}/${m.slug}`;
