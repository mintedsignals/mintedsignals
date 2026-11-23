import type { Category } from "@/config/site";

/**
 * Market data settings. Edit this file to change what the site tracks and shows.
 */

/**
 * How often the scheduled rebuild refreshes the odds, in minutes. The site is static: odds
 * are fetched when it's built. Keep this in step with the schedule in
 * .github/workflows/deploy.yml (it's shown on the site as "odds refresh").
 */
export const MARKETS_REFRESH_MINUTES = 30;

/** Polymarket: how many open markets to load, highest 24h volume first (pages of 100). */
export const POLYMARKET_MAX_MARKETS = 300;

/**
 * Kalshi series to track. Kalshi has no "sort by volume" option and over 12,000 open events,
 * so we fetch only these series. Seeded on 2026-11-16 from the series with the most 24h
 * volume in each category. Left out: 15-minute markets, daily price ladders with hundreds
 * of strikes, and daily weather. Add or remove tickers freely.
 * `category` is ours, so this keeps working if Kalshi changes its own categories.
 */
export const KALSHI_SERIES: { ticker: string; category: Category; note: string }[] = [
  // Politics
  { ticker: "KXPRESPERSON", category: "Politics", note: "2028 presidential election winner" },
  { ticker: "KXPRESNOMD", category: "Politics", note: "Democratic presidential nominee" },
  { ticker: "KXPRESNOMR", category: "Politics", note: "Republican presidential nominee" },
  { ticker: "SENATEAK", category: "Politics", note: "Alaska Senate race" },
  { ticker: "KXSENMAJ", category: "Politics", note: "Senate majority leader" },
  { ticker: "KXSENATEDEMLEAD", category: "Politics", note: "Senate Democratic leader" },
  { ticker: "KXNEXTPRESSECPERM", category: "Politics", note: "Next White House press secretary" },
  { ticker: "KXHEGSETHOUT", category: "Politics", note: "Hegseth out by date" },
  { ticker: "KXTRUMPADMINLEAVE", category: "Politics", note: "Who leaves the Trump administration" },
  { ticker: "KXISRAELPM", category: "Politics", note: "Next Israeli prime minister" },
  // Economy
  { ticker: "KXFEDDECISION", category: "Economy", note: "Fed rate decisions" },
  { ticker: "KXCPIYOY", category: "Economy", note: "Inflation (CPI year on year)" },
  { ticker: "KXAAAGASM", category: "Economy", note: "US gas price, monthly" },
  { ticker: "KXNVDACEO", category: "Economy", note: "Next NVIDIA CEO" },
  { ticker: "KXNVDACEODATE", category: "Economy", note: "NVIDIA CEO announcement date" },
  { ticker: "KXJOINJENSENHUANG", category: "Economy", note: "Where Jensen Huang works next" },
  { ticker: "KXIPOANTHROPIC", category: "Economy", note: "Anthropic IPO" },
  // Crypto
  { ticker: "KXBTCY", category: "Crypto", note: "Bitcoin year-end price range" },
  { ticker: "KXBTC50VS100", category: "Crypto", note: "BTC below $50k before $100k" },
  { ticker: "KXBTCMAXMON", category: "Crypto", note: "Bitcoin monthly high" },
  { ticker: "KXBTCMAX100", category: "Crypto", note: "When Bitcoin hits $100k" },
  { ticker: "KXBTC2026200", category: "Crypto", note: "Bitcoin $200k in 2026" },
  { ticker: "KXBTCMINY", category: "Crypto", note: "Bitcoin yearly low" },
  { ticker: "KXETHMAXY", category: "Crypto", note: "Ethereum yearly high" },
  // Sports
  { ticker: "KXNFLGAME", category: "Sports", note: "NFL games" },
  { ticker: "KXSB", category: "Sports", note: "Super Bowl winner" },
  { ticker: "KXNFLMVP", category: "Sports", note: "NFL MVP" },
  { ticker: "KXNBAGAME", category: "Sports", note: "NBA games" },
  { ticker: "KXNBA", category: "Sports", note: "NBA champion" },
  { ticker: "KXNHLGAME", category: "Sports", note: "NHL games" },
  { ticker: "KXUEFANLGAME", category: "Sports", note: "UEFA Nations League games" },
  { ticker: "KXNCAAF", category: "Sports", note: "College football champion" },
  { ticker: "KXHEISMAN", category: "Sports", note: "Heisman Trophy" },
  { ticker: "KXMARMAD", category: "Sports", note: "Men's college basketball champion" },
  // Culture
  { ticker: "KXTIME", category: "Culture", note: "TIME Person of the Year" },
  { ticker: "KXGTA6", category: "Culture", note: "GTA 6 release date" },
  { ticker: "KXOSCARPIC", category: "Culture", note: "Oscar for Best Picture" },
  { ticker: "KXGRAMAOTY", category: "Culture", note: "Grammy Album of the Year" },
  { ticker: "KXGAMEAWARDS", category: "Culture", note: "The Game Awards" },
  { ticker: "KXRT", category: "Culture", note: "Rotten Tomatoes scores" },
  // Other
  { ticker: "KXLLM1", category: "Other", note: "Top AI model at year end" },
  { ticker: "KXGTEMP", category: "Other", note: "Hottest year on record" },
];

/** "Hottest" list settings. */
export const HOTTEST = {
  /** Show only the highest-volume market from each event (e.g. one candidate per election). */
  onePerEvent: true,
  /**
   * Market ids to always show first, in this order, if they are open and match the filters.
   * Format: "polymarket:<id>" or "kalshi:<TICKER>", as in Market.id.
   */
  pinned: [] as string[],
};
