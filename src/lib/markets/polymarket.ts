/**
 * Polymarket Gamma API (public, no key). Docs: https://docs.polymarket.com
 * Checked 2026-11-16: keyset pagination is current (offset /markets is being deprecated);
 * outcomes and outcomePrices are JSON-encoded strings; oneDayPriceChange is missing on
 * about a quarter of markets; the category field is empty, so we map from tags.
 */
import { categoryFromPolymarketTags } from "./categories";
import type { Market } from "./types";

export const GAMMA_BASE = "https://gamma-api.polymarket.com";
export const KEYSET_PAGE_SIZE = 100; // documented maximum for /markets/keyset

/** The fields we read from a Gamma market. Everything is optional: never trust the shape. */
export interface GammaMarket {
  id?: string;
  question?: string;
  slug?: string;
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  outcomes?: string;
  outcomePrices?: string;
  oneDayPriceChange?: number;
  volume24hr?: number;
  endDate?: string;
  tags?: { slug?: string; label?: string }[];
  events?: { id?: string; slug?: string; title?: string }[];
}

export interface GammaKeysetPage {
  markets?: GammaMarket[];
  next_cursor?: string;
}

function parseStringArray(value: unknown): string[] | null {
  if (typeof value !== "string") return null;
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : null;
  } catch {
    return null;
  }
}

/** Normalise one Gamma market. Returns null if it lacks what we need to show it. */
export function normalizePolymarketMarket(m: GammaMarket): Market | null {
  if (!m.id || !m.slug || !m.question) return null;

  const outcomes = parseStringArray(m.outcomes);
  const prices = parseStringArray(m.outcomePrices)?.map(Number);
  if (!outcomes || !prices || outcomes.length < 2 || outcomes.length !== prices.length) return null;

  // For YES/NO markets use the YES side; otherwise the first outcome (e.g. the first team).
  const yesIndex = Math.max(0, outcomes.findIndex((o) => o.toLowerCase() === "yes"));
  const yesPrice = prices[yesIndex];
  if (!Number.isFinite(yesPrice) || yesPrice < 0 || yesPrice > 1) return null;

  // oneDayPriceChange is reported for the first outcome; flip it if YES is the second.
  const rawChange = typeof m.oneDayPriceChange === "number" ? m.oneDayPriceChange : null;
  const change24h = rawChange === null ? null : yesIndex === 0 ? rawChange : -rawChange;

  const event = m.events?.[0];
  const url = event?.slug
    ? `https://polymarket.com/event/${event.slug}/${m.slug}`
    : `https://polymarket.com/market/${m.slug}`;

  return {
    id: `polymarket:${m.id}`,
    venue: "polymarket",
    question: m.question.trim(),
    slug: m.slug,
    category: categoryFromPolymarketTags((m.tags ?? []).map((t) => t.slug ?? "")),
    yesPrice,
    yesOutcome: outcomes[yesIndex],
    change24h,
    volume24h: typeof m.volume24hr === "number" && m.volume24hr > 0 ? m.volume24hr : 0,
    closeTime: m.endDate ?? null,
    url,
    eventId: `polymarket:${event?.id ?? event?.slug ?? m.id}`,
    isOpen: m.active === true && m.closed !== true && m.archived !== true,
  };
}

export function normalizePolymarketPage(page: GammaKeysetPage): Market[] {
  return (page.markets ?? []).flatMap((m) => normalizePolymarketMarket(m) ?? []);
}

type GetJson = <T>(url: string) => Promise<T | null>;

/** Open markets, highest 24h volume first. */
export async function fetchPolymarketMarkets(getJson: GetJson, max: number): Promise<Market[]> {
  const markets: Market[] = [];
  let cursor = "";
  while (markets.length < max) {
    const params = new URLSearchParams({
      closed: "false",
      order: "volume24hr",
      ascending: "false",
      limit: String(KEYSET_PAGE_SIZE),
      include_tag: "true",
    });
    if (cursor) params.set("after_cursor", cursor);
    const page = await getJson<GammaKeysetPage>(`${GAMMA_BASE}/markets/keyset?${params}`);
    if (!page) throw new Error("Polymarket /markets/keyset returned 404");
    markets.push(...normalizePolymarketPage(page).filter((m) => m.isOpen));
    cursor = page.next_cursor ?? "";
    if (!cursor || (page.markets ?? []).length === 0) break;
  }
  return markets.slice(0, max);
}

/** One market by its Polymarket slug (open or closed). Null if it doesn't exist. */
export async function fetchPolymarketMarket(getJson: GetJson, slug: string): Promise<Market | null> {
  const params = new URLSearchParams({ include_tag: "true" });
  const m = await getJson<GammaMarket>(`${GAMMA_BASE}/markets/slug/${encodeURIComponent(slug)}?${params}`);
  return m ? normalizePolymarketMarket(m) : null;
}
