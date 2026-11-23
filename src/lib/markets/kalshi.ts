/**
 * Kalshi Trade API v2, public market data (no auth). Docs: https://docs.kalshi.com
 * Checked 2026-11-16: prices are dollar strings (*_dollars, e.g. "0.5600") and counts are
 * fixed-point strings (*_fp); the old integer-cent fields and `liquidity` are removed;
 * market `title`/`subtitle` are deprecated, so questions come from the event title plus
 * the market's yes_sub_title; event `category` is deprecated (we keep our own per series).
 * 24h volume is in contracts; we count each as $1.
 */
import type { Category } from "@/config/site";
import { categoryFromKalshi } from "./categories";
import { kalshiSlug } from "./slug";
import type { Market } from "./types";

export const KALSHI_BASE = "https://external-api.kalshi.com/trade-api/v2";

export interface KalshiMarket {
  ticker?: string;
  event_ticker?: string;
  market_type?: string;
  status?: string;
  yes_sub_title?: string;
  yes_bid_dollars?: string;
  yes_ask_dollars?: string;
  last_price_dollars?: string;
  previous_price_dollars?: string;
  volume_24h_fp?: string;
  close_time?: string;
}

export interface KalshiEvent {
  event_ticker?: string;
  series_ticker?: string;
  title?: string;
  sub_title?: string;
  category?: string;
  markets?: KalshiMarket[];
}

const num = (value: string | undefined): number | null => {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

/** Last trade price; if nothing has traded, the bid/ask midpoint when both sides exist. */
export function kalshiYesPrice(m: KalshiMarket): number | null {
  const last = num(m.last_price_dollars);
  if (last !== null && last > 0) return last;
  const bid = num(m.yes_bid_dollars);
  const ask = num(m.yes_ask_dollars);
  if (bid !== null && ask !== null && bid > 0 && ask > 0 && ask < 1) return (bid + ask) / 2;
  return null;
}

/** "Who will be the next CEO of NVIDIA?" + "Jensen Huang" -> "Who will be the next CEO of NVIDIA: Jensen Huang" */
export function kalshiQuestion(eventTitle: string, yesSubTitle: string | undefined, marketsInEvent: number): string {
  const title = eventTitle.trim();
  const sub = yesSubTitle?.trim();
  if (marketsInEvent <= 1 || !sub) return title;
  return `${title.replace(/[?:]\s*$/, "")}: ${sub}`;
}

export function normalizeKalshiMarket(
  m: KalshiMarket,
  event: KalshiEvent,
  options: { category?: Category; marketsInEvent: number },
): Market | null {
  if (!m.ticker || !event.title) return null;
  if (m.market_type && m.market_type !== "binary") return null; // scalar markets have no YES price

  const yesPrice = kalshiYesPrice(m);
  if (yesPrice === null || yesPrice > 1) return null;

  const last = num(m.last_price_dollars);
  const previous = num(m.previous_price_dollars);
  const change24h = last !== null && previous !== null && last > 0 && previous > 0 ? round4(last - previous) : null;

  const question = kalshiQuestion(event.title, m.yes_sub_title, options.marketsInEvent);
  const series = event.series_ticker ?? m.event_ticker?.split("-")[0] ?? "";

  return {
    id: `kalshi:${m.ticker}`,
    venue: "kalshi",
    question,
    slug: kalshiSlug(question, m.ticker),
    category: options.category ?? categoryFromKalshi(event.category),
    yesPrice,
    yesOutcome: "Yes",
    change24h,
    volume24h: Math.max(0, num(m.volume_24h_fp) ?? 0),
    closeTime: m.close_time ?? null,
    // Kalshi doesn't document market URLs; the series page format comes from its docs' examples.
    url: series ? `https://kalshi.com/markets/${series.toLowerCase()}` : "https://kalshi.com/",
    eventId: `kalshi:${m.event_ticker ?? event.event_ticker ?? m.ticker}`,
    isOpen: m.status === "active",
  };
}

const round4 = (n: number) => Math.round(n * 10_000) / 10_000;

export function normalizeKalshiEvent(event: KalshiEvent, category?: Category): Market[] {
  const markets = event.markets ?? [];
  return markets.flatMap((m) => normalizeKalshiMarket(m, event, { category, marketsInEvent: markets.length }) ?? []);
}

type GetJson = <T>(url: string) => Promise<T | null>;

/** Open markets for one series (all its open events). */
export async function fetchKalshiSeries(getJson: GetJson, seriesTicker: string, category?: Category): Promise<Market[]> {
  const markets: Market[] = [];
  let cursor = "";
  for (let page = 0; page < 10; page++) {
    const params = new URLSearchParams({
      series_ticker: seriesTicker,
      status: "open",
      with_nested_markets: "true",
      limit: "200",
    });
    if (cursor) params.set("cursor", cursor);
    const data = await getJson<{ events?: KalshiEvent[]; cursor?: string }>(`${KALSHI_BASE}/events?${params}`);
    if (!data) break;
    for (const event of data.events ?? []) markets.push(...normalizeKalshiEvent(event, category));
    cursor = data.cursor ?? "";
    if (!cursor) break;
  }
  return markets.filter((m) => m.isOpen);
}

/** Fetch several series a few at a time. Fails only if every series fails. */
export async function fetchKalshiMarkets(
  getJson: GetJson,
  series: { ticker: string; category: Category }[],
  concurrency = 3, // Kalshi rate-limits public requests per IP (429s at 6 in parallel)
): Promise<Market[]> {
  const results: PromiseSettledResult<Market[]>[] = [];
  for (let i = 0; i < series.length; i += concurrency) {
    const batch = series.slice(i, i + concurrency);
    results.push(...(await Promise.allSettled(batch.map((s) => fetchKalshiSeries(getJson, s.ticker, s.category)))));
  }
  const failed = results.flatMap((r, i) =>
    r.status === "rejected" ? `${series[i].ticker} (${r.reason instanceof Error ? r.reason.message : r.reason})` : [],
  );
  if (failed.length > 0) console.warn(`[markets] Kalshi series failed: ${failed.join(", ")}`);

  const ok = results.filter((r): r is PromiseFulfilledResult<Market[]> => r.status === "fulfilled");
  if (series.length > 0 && ok.length === 0) {
    const first = results.find((r): r is PromiseRejectedResult => r.status === "rejected");
    throw first?.reason instanceof Error ? first.reason : new Error("All Kalshi series requests failed");
  }
  return ok.flatMap((r) => r.value);
}

/** One market by ticker (open or closed), with its event for the question and category. */
export async function fetchKalshiMarket(getJson: GetJson, ticker: string, category?: Category): Promise<Market | null> {
  const data = await getJson<{ market?: KalshiMarket }>(`${KALSHI_BASE}/markets/${encodeURIComponent(ticker)}`);
  const market = data?.market;
  if (!market?.event_ticker) return null;
  const eventData = await getJson<{ event?: KalshiEvent; markets?: KalshiMarket[] }>(
    `${KALSHI_BASE}/events/${encodeURIComponent(market.event_ticker)}`,
  );
  if (!eventData?.event) return null;
  return normalizeKalshiMarket(market, eventData.event, {
    category,
    marketsInEvent: eventData.markets?.length ?? 1,
  });
}
