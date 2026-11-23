import { describe, expect, it } from "vitest";
import fixture from "./__fixtures__/kalshi-events.json";
import {
  fetchKalshiMarkets,
  kalshiQuestion,
  kalshiYesPrice,
  normalizeKalshiEvent,
  normalizeKalshiMarket,
  type KalshiEvent,
} from "./kalshi";
import { tickerFromKalshiSlug } from "./slug";

const events = fixture.events as KalshiEvent[];
const december = events[0];

describe("normalizeKalshiEvent (real API sample)", () => {
  const markets = normalizeKalshiEvent(december, "Economy");

  it("normalises each market in the event", () => {
    expect(markets.length).toBe(december.markets!.length);
  });

  it("maps fields from the dollar-string API", () => {
    const source = december.markets!.find((m) => m.ticker === "KXFEDDECISION-26DEC-H0")!;
    const m = markets.find((x) => x.id === "kalshi:KXFEDDECISION-26DEC-H0")!;
    expect(m.venue).toBe("kalshi");
    expect(m.question).toBe("Fed decision in Dec 2026: Fed maintains rate");
    expect(m.yesOutcome).toBe("Yes");
    expect(m.yesPrice).toBe(Number(source.last_price_dollars));
    expect(m.volume24h).toBe(Number(source.volume_24h_fp));
    expect(m.closeTime).toBe(source.close_time);
    expect(m.category).toBe("Economy");
    expect(m.url).toBe("https://kalshi.com/markets/kxfeddecision");
    expect(m.eventId).toBe("kalshi:KXFEDDECISION-26DEC");
    expect(m.isOpen).toBe(true);
  });

  it("builds a readable slug that leads back to the ticker", () => {
    const m = markets.find((x) => x.id === "kalshi:KXFEDDECISION-26DEC-H0")!;
    expect(m.slug).toBe("fed-decision-in-dec-2026-fed-maintains-rate--kxfeddecision-26dec-h0");
    expect(tickerFromKalshiSlug(m.slug)).toBe("KXFEDDECISION-26DEC-H0");
  });

  it("falls back to Kalshi's own category when we don't set one", () => {
    expect(normalizeKalshiEvent(december)[0].category).toBe("Economy"); // event.category "Economics"
  });
});

describe("Kalshi helpers", () => {
  it("uses the last price, else the bid/ask midpoint, else nothing", () => {
    expect(kalshiYesPrice({ last_price_dollars: "0.4200" })).toBe(0.42);
    expect(kalshiYesPrice({ last_price_dollars: "0.0000", yes_bid_dollars: "0.3000", yes_ask_dollars: "0.4000" })).toBeCloseTo(0.35);
    expect(kalshiYesPrice({ last_price_dollars: "0.0000", yes_bid_dollars: "0.0000", yes_ask_dollars: "0.2600" })).toBeNull();
  });

  it("uses the event title alone for single-market events", () => {
    expect(kalshiQuestion("Will BTC fall below 50k before hitting 100k?", "Yes", 1)).toBe(
      "Will BTC fall below 50k before hitting 100k?",
    );
    expect(kalshiQuestion("Who will be the next CEO of NVIDIA?", "Jensen Huang", 36)).toBe(
      "Who will be the next CEO of NVIDIA: Jensen Huang",
    );
  });

  it("computes the 24h change, or null when there is no earlier price", () => {
    const event = { title: "E", series_ticker: "KXE", event_ticker: "KXE-1" };
    const one = { marketsInEvent: 1 };
    const withChange = normalizeKalshiMarket(
      { ticker: "KXE-1-A", status: "active", last_price_dollars: "0.6400", previous_price_dollars: "0.6000" },
      event,
      one,
    );
    expect(withChange?.change24h).toBe(0.04);
    const noPrevious = normalizeKalshiMarket(
      { ticker: "KXE-1-A", status: "active", last_price_dollars: "0.6400", previous_price_dollars: "0.0000" },
      event,
      one,
    );
    expect(noPrevious?.change24h).toBeNull();
  });

  it("uses rules_primary as resolution rules", () => {
    const event = { title: "E", series_ticker: "KXE" };
    const m = normalizeKalshiMarket(
      { ticker: "KXE-1", last_price_dollars: "0.5", rules_primary: "If the Fed holds rates, resolves Yes." },
      event,
      { marketsInEvent: 1 },
    );
    expect(m?.rules).toBe("If the Fed holds rates, resolves Yes.");
  });

  it("skips scalar markets and markets with no price", () => {
    const event = { title: "E", series_ticker: "KXE" };
    expect(normalizeKalshiMarket({ ticker: "A", market_type: "scalar", last_price_dollars: "0.5" }, event, { marketsInEvent: 1 })).toBeNull();
    expect(normalizeKalshiMarket({ ticker: "A", last_price_dollars: "0" }, event, { marketsInEvent: 1 })).toBeNull();
  });
});

describe("fetchKalshiMarkets", () => {
  const series = [
    { ticker: "KXFEDDECISION", category: "Economy" as const },
    { ticker: "KXBROKEN", category: "Other" as const },
  ];

  const many = [
    ...series,
    ...["KXA", "KXB", "KXC"].map((ticker) => ({ ticker, category: "Other" as const })),
  ];

  it("keeps the series that worked when a few fail (1 of 5)", async () => {
    const getJson = async <T,>(url: string) => {
      if (url.includes("KXBROKEN")) throw new Error("500 from api");
      return (url.includes("KXFEDDECISION") ? { events, cursor: "" } : { events: [], cursor: "" }) as T;
    };
    const result = await fetchKalshiMarkets(getJson, many);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.id.startsWith("kalshi:KXFEDDECISION"))).toBe(true);
  });

  it("throws when more than a quarter of series fail, so the last good data is used", async () => {
    const getJson = async <T,>(url: string) => {
      if (url.includes("KXBROKEN") || url.includes("KXA")) throw new Error("503 from api");
      return { events, cursor: "" } as T;
    };
    await expect(fetchKalshiMarkets(getJson, many)).rejects.toThrow("2/5 Kalshi series failed");
  });

  it("throws when every series fails, so the caller falls back", async () => {
    const getJson = async <T,>(): Promise<T | null> => {
      throw new Error("network down");
    };
    await expect(fetchKalshiMarkets(getJson, series)).rejects.toThrow("network down");
  });
});
