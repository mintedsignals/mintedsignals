import type { Category } from "@/config/site";

/**
 * Polymarket has no category field in practice (it is always empty), so we map from tag slugs.
 * Checked in this order; the first category with a matching tag wins.
 * e.g. a market tagged both "crypto" and "politics" is Crypto.
 */
const polymarketTagMap: [Category, string[]][] = [
  ["Sports", ["sports", "esports", "soccer", "nba", "nfl", "nhl", "mlb", "basketball", "tennis", "ufc", "f1", "golf", "cricket"]],
  ["Crypto", ["crypto", "crypto-prices", "bitcoin", "ethereum", "solana", "xrp"]],
  ["Economy", ["economy", "fed", "fed-rates", "fomc", "economic-policy", "macro-indicators", "inflation", "finance", "stocks", "business", "big-tech", "ipos", "commodities"]],
  ["Politics", ["politics", "elections", "geopolitics", "world-elections", "global-elections", "us-presidential-election", "trump", "world", "congress"]],
  ["Culture", ["pop-culture", "culture", "entertainment", "movies", "music", "awards", "celebrities", "tv", "gaming"]],
];

export function categoryFromPolymarketTags(tagSlugs: string[]): Category {
  const tags = new Set(tagSlugs.map((t) => t.toLowerCase()));
  for (const [category, slugs] of polymarketTagMap) {
    if (slugs.some((s) => tags.has(s))) return category;
  }
  return "Other";
}

/** Kalshi's own series/event categories (as of Nov 2026) mapped onto ours. */
const kalshiCategoryMap: Record<string, Category> = {
  Elections: "Politics",
  Politics: "Politics",
  World: "Politics",
  Economics: "Economy",
  Financials: "Economy",
  Companies: "Economy",
  Commodities: "Economy",
  Business: "Economy",
  Crypto: "Crypto",
  Sports: "Sports",
  Entertainment: "Culture",
  Culture: "Culture",
  Social: "Culture",
};

export function categoryFromKalshi(kalshiCategory: string | null | undefined): Category {
  return (kalshiCategory && kalshiCategoryMap[kalshiCategory]) || "Other";
}
