import { describe, expect, it } from "vitest";
import fixture from "./__fixtures__/polymarket-markets.json";
import {
  fetchPolymarketMarkets,
  normalizePolymarketMarket,
  normalizePolymarketPage,
  type GammaKeysetPage,
  type GammaMarket,
} from "./polymarket";

const page = fixture as GammaKeysetPage;
const raw = page.markets!;
const markets = normalizePolymarketPage(page);
const byQuestion = (start: string) => markets.find((m) => m.question.startsWith(start))!;

describe("normalizePolymarketMarket (real API sample)", () => {
  it("normalises every market in the sample", () => {
    expect(markets).toHaveLength(raw.length);
  });

  it("maps a YES/NO market", () => {
    const m = byQuestion("Will there be no new be CEO of NVIDIA");
    const source = raw.find((r) => r.question === m.question)!;
    expect(m.id).toBe(`polymarket:${source.id}`);
    expect(m.venue).toBe("polymarket");
    expect(m.slug).toBe(source.slug);
    expect(m.yesOutcome).toBe("Yes");
    expect(m.yesPrice).toBe(JSON.parse(source.outcomePrices!).map(Number)[0]);
    expect(m.change24h).toBe(-0.0685);
    expect(m.volume24h).toBe(source.volume24hr);
    expect(m.closeTime).toBe(source.endDate);
    expect(m.url).toBe(`https://polymarket.com/event/${source.events![0].slug}/${source.slug}`);
    expect(m.isOpen).toBe(true);
  });

  it("keeps change24h null when Polymarket omits it", () => {
    expect(byQuestion("Will Kristi Noem").change24h).toBeNull();
  });

  it("uses the first outcome's name for markets that aren't YES/NO", () => {
    expect(byQuestion("Dota 2:").yesOutcome).toBe("PARIVISION");
    expect(byQuestion("Germany vs. Netherlands").yesOutcome).toBe("Over");
  });

  it("gives markets from the same event the same eventId", () => {
    expect(byQuestion("Will Kristi Noem").eventId).toBe(byQuestion("Will Mike Johnson").eventId);
    expect(byQuestion("Will Kristi Noem").eventId).not.toBe(byQuestion("Dota 2:").eventId);
  });

  it("maps tags onto our categories", () => {
    expect(byQuestion("Will Kristi Noem").category).toBe("Politics");
    expect(byQuestion("Dota 2:").category).toBe("Sports");
    expect(byQuestion("Will Bitcoin dip").category).toBe("Crypto");
    expect(byQuestion("Will there be no change in Fed").category).toBe("Economy");
    expect(byQuestion("Robert Pattinson").category).toBe("Culture");
  });

  it("flips change24h when YES is the second outcome", () => {
    const m = normalizePolymarketMarket({
      id: "1",
      slug: "s",
      question: "Q?",
      active: true,
      outcomes: '["No", "Yes"]',
      outcomePrices: '["0.3", "0.7"]',
      oneDayPriceChange: 0.05,
    });
    expect(m?.yesPrice).toBe(0.7);
    expect(m?.change24h).toBe(-0.05);
  });

  it.each<[string, GammaMarket]>([
    ["no id", { slug: "s", question: "Q", outcomes: '["Yes","No"]', outcomePrices: '["0.5","0.5"]' }],
    ["broken outcomePrices", { id: "1", slug: "s", question: "Q", outcomes: '["Yes","No"]', outcomePrices: "not json" }],
    ["price above 1", { id: "1", slug: "s", question: "Q", outcomes: '["Yes","No"]', outcomePrices: '["1.5","0"]' }],
    ["mismatched lengths", { id: "1", slug: "s", question: "Q", outcomes: '["Yes","No"]', outcomePrices: '["0.5"]' }],
  ])("rejects a market with %s", (_, input) => {
    expect(normalizePolymarketMarket(input)).toBeNull();
  });

  it("marks closed or archived markets as not open", () => {
    const base = { id: "1", slug: "s", question: "Q", outcomes: '["Yes","No"]', outcomePrices: '["0.5","0.5"]' };
    expect(normalizePolymarketMarket({ ...base, active: true, closed: true })?.isOpen).toBe(false);
    expect(normalizePolymarketMarket({ ...base, active: true, archived: true })?.isOpen).toBe(false);
  });
});

describe("fetchPolymarketMarkets", () => {
  it("follows next_cursor and stops at the maximum", async () => {
    const urls: string[] = [];
    const pages: GammaKeysetPage[] = [
      { markets: raw.slice(0, 4), next_cursor: "abc" },
      { markets: raw.slice(4), next_cursor: "def" },
    ];
    const getJson = async <T,>(url: string) => {
      urls.push(url);
      return pages[urls.length - 1] as T;
    };
    const result = await fetchPolymarketMarkets(getJson, 6);
    expect(result).toHaveLength(6);
    expect(urls).toHaveLength(2);
    expect(urls[0]).toContain("/markets/keyset?");
    expect(urls[0]).toContain("order=volume24hr");
    expect(urls[0]).toContain("ascending=false");
    expect(urls[1]).toContain("after_cursor=abc");
  });

  it("throws when the endpoint is missing, so the caller falls back", async () => {
    const getJson = async <T,>() => null as T | null;
    await expect(fetchPolymarketMarkets(getJson, 10)).rejects.toThrow(/404/);
  });
});
