import { describe, expect, it } from "vitest";
import { categoryFromKalshi, categoryFromPolymarketTags } from "./categories";
import { idFromPolymarketSlug, marketSlug, slugify, tickerFromKalshiSlug } from "./slug";

describe("slugify", () => {
  it("makes readable URL slugs", () => {
    expect(slugify("Will Bitcoin hit $100k in 2026?")).toBe("will-bitcoin-hit-100k-in-2026");
    expect(slugify("Rock & Roll Hall of Fame: Beyoncé")).toBe("rock-and-roll-hall-of-fame-beyonce");
  });

  it("cuts long slugs at a word boundary", () => {
    const slug = slugify("word ".repeat(40), 30);
    expect(slug.length).toBeLessThanOrEqual(30);
    expect(slug.endsWith("-")).toBe(false);
    expect(slug).toMatch(/^(word-)*word$/);
  });
});

describe("market slugs", () => {
  it("round-trips Polymarket ids and rejects non-numeric ones", () => {
    expect(marketSlug("Will Bitcoin hit $100k?", "561994")).toBe("will-bitcoin-hit-100k--561994");
    expect(idFromPolymarketSlug("will-bitcoin-hit-100k--561994")).toBe("561994");
    expect(idFromPolymarketSlug("will-candidate-a-be-the-next-ceo")).toBeNull();
    expect(idFromPolymarketSlug("question--abc")).toBeNull();
  });

  it("round-trips the ticker, including tickers with dots", () => {
    for (const ticker of ["KXFEDDECISION-26DEC-H0", "KXBTCD-26NOV1617-T95999.99"]) {
      expect(tickerFromKalshiSlug(marketSlug("Some question?", ticker))).toBe(ticker);
    }
  });

  it("rejects slugs without a ticker", () => {
    expect(tickerFromKalshiSlug("just-words")).toBeNull();
    expect(tickerFromKalshiSlug("words--")).toBeNull();
    expect(tickerFromKalshiSlug("words--bad/ticker")).toBeNull();
  });
});

describe("category mapping", () => {
  it("maps Polymarket tags in priority order", () => {
    expect(categoryFromPolymarketTags(["politics", "crypto"])).toBe("Crypto");
    expect(categoryFromPolymarketTags(["fed", "politics"])).toBe("Economy");
    expect(categoryFromPolymarketTags(["nba", "pop-culture"])).toBe("Sports");
    expect(categoryFromPolymarketTags(["Politics"])).toBe("Politics");
    expect(categoryFromPolymarketTags(["weather"])).toBe("Other");
    expect(categoryFromPolymarketTags([])).toBe("Other");
  });

  it("maps Kalshi categories", () => {
    expect(categoryFromKalshi("Elections")).toBe("Politics");
    expect(categoryFromKalshi("Financials")).toBe("Economy");
    expect(categoryFromKalshi("Entertainment")).toBe("Culture");
    expect(categoryFromKalshi("Climate and Weather")).toBe("Other");
    expect(categoryFromKalshi(undefined)).toBe("Other");
  });
});
