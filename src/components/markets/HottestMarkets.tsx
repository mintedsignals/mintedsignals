import { HOTTEST } from "@/config/markets";
import { getMarketsSnapshot } from "@/lib/markets";
import { selectHottest } from "@/lib/markets/hottest";
import { toSummary, venues, type MarketSummary } from "@/lib/markets/types";
import { HottestMarketsWidget } from "./HottestMarketsWidget";
import { WIDGET_CATEGORIES, WIDGET_LIMIT } from "./widgetConfig";

/**
 * Server part of the widget. Pre-selects every market any filter combination can show,
 * so the full list is in the HTML and the client only filters.
 */
export async function HottestMarkets() {
  const snapshot = await getMarketsSnapshot();
  const options = { limit: WIDGET_LIMIT, onePerEvent: HOTTEST.onePerEvent, pinned: HOTTEST.pinned };

  const pool = new Map<string, MarketSummary>();
  for (const venue of [undefined, ...venues]) {
    for (const category of [undefined, ...WIDGET_CATEGORIES]) {
      for (const m of selectHottest(snapshot.markets, { ...options, venue, category })) pool.set(m.id, toSummary(m));
    }
  }

  return <HottestMarketsWidget pool={[...pool.values()]} options={options} venueStatus={snapshot.venues} />;
}
