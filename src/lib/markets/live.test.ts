/**
 * Calls the real Polymarket and Kalshi APIs. Skipped unless LIVE=1 (pnpm test:live),
 * so the normal test run never depends on the network.
 */
import { describe, expect, it } from "vitest";
import { KALSHI_SERIES } from "@/config/markets";
import { getJson } from "./http";
import { fetchKalshiMarket, fetchKalshiMarkets } from "./kalshi";
import { fetchPolymarketMarket, fetchPolymarketMarkets } from "./polymarket";
import { selectHottest } from "./hottest";
import { tickerFromKalshiSlug } from "./slug";

describe.skipIf(!process.env.LIVE)("live APIs", () => {
  it("Polymarket returns open markets sorted by 24h volume, and single lookups work", async () => {
    const markets = await fetchPolymarketMarkets(getJson, 200);
    expect(markets.length).toBeGreaterThan(100);
    expect(markets.every((m) => m.yesPrice >= 0 && m.yesPrice <= 1 && m.isOpen)).toBe(true);
    const volumes = markets.map((m) => m.volume24h);
    expect([...volumes].sort((a, b) => b - a)).toEqual(volumes);
    const one = await fetchPolymarketMarket(getJson, markets[0].slug);
    expect(one?.id).toBe(markets[0].id);
    expect(await fetchPolymarketMarket(getJson, "no-such-market-slug-xyz")).toBeNull();
  }, 60_000);

  it("Kalshi returns markets for the configured series, and single lookups work", async () => {
    const markets = await fetchKalshiMarkets(getJson, KALSHI_SERIES);
    const seriesWithMarkets = new Set(markets.map((m) => m.id.split(":")[1].split("-")[0]));
    console.log(`Kalshi: ${markets.length} markets from ${seriesWithMarkets.size}/${KALSHI_SERIES.length} series`);
    console.log("No open markets:", KALSHI_SERIES.filter((s) => !seriesWithMarkets.has(s.ticker)).map((s) => s.ticker).join(", ") || "none");
    expect(markets.length).toBeGreaterThan(50);
    const top = selectHottest(markets, { limit: 1 })[0];
    const one = await fetchKalshiMarket(getJson, tickerFromKalshiSlug(top.slug)!);
    expect(one?.id).toBe(top.id);
    expect(one?.question).toBe(top.question);
  }, 120_000);
});
