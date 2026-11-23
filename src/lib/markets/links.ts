import type { Market } from "./types";

/** Our page for a market (built in phase 4). */
export const marketPath = (m: Pick<Market, "venue" | "slug">) => `/markets/${m.venue}/${m.slug}`;
