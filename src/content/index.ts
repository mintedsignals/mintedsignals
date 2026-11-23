import "server-only";
import type { ComponentType } from "react";
import { guides as guideCards, type GuideSlug } from "@/config/site";

/**
 * Every MDX page on the site. To publish a page after review, change its status to
 * "published" and set `updated` to the review date.
 *
 * Drafts still render (so links never break) but show a draft banner, are marked noindex
 * and are left out of the sitemap. Facts that need checking are wrapped in <Check> in the
 * MDX and show highlighted on the page.
 */
export type ContentStatus = "draft" | "published";

type MdxModule = { default: ComponentType };

interface ContentEntry {
  slug: string;
  title: string;
  description: string;
  /** Last reviewed, YYYY-MM-DD. */
  updated: string;
  status: ContentStatus;
  load: () => Promise<MdxModule>;
}

export type GuideEntry = ContentEntry & (typeof guideCards)[number];

const guideFiles: Record<GuideSlug, { updated: string; status: ContentStatus; description: string; load: () => Promise<MdxModule> }> = {
  "what-is-a-prediction-market": {
    updated: "2026-11-17",
    status: "draft",
    description: "A prediction market lets people trade on the outcome of a future event. Here's how YES and NO shares work and why their prices read as probabilities.",
    load: () => import("./guides/what-is-a-prediction-market.mdx"),
  },
  "how-to-read-prediction-market-odds": {
    updated: "2026-11-17",
    status: "draft",
    description: "How to turn a prediction market price into implied chance, payout and expected value, with worked examples.",
    load: () => import("./guides/how-to-read-prediction-market-odds.mdx"),
  },
  "polymarket-vs-kalshi": {
    updated: "2026-11-17",
    status: "draft",
    description: "Polymarket and Kalshi compared: how each is regulated, how you fund an account, fees, market depth and who can use them.",
    load: () => import("./guides/polymarket-vs-kalshi.mdx"),
  },
  "how-prediction-markets-resolve": {
    updated: "2026-11-17",
    status: "draft",
    description: "How prediction markets decide the winning outcome, who checks it, and what happens when the result is disputed or unclear.",
    load: () => import("./guides/how-prediction-markets-resolve.mdx"),
  },
  "liquidity-spreads-and-slippage": {
    updated: "2026-11-17",
    status: "draft",
    description: "Why the price shown on a prediction market isn't always the price you pay: liquidity, bid-ask spreads and slippage explained.",
    load: () => import("./guides/liquidity-spreads-and-slippage.mdx"),
  },
  "are-prediction-markets-legal": {
    updated: "2026-11-17",
    status: "draft",
    description: "Whether you can legally use prediction markets depends on where you live and which platform you use. A country-by-country guide.",
    load: () => import("./guides/are-prediction-markets-legal.mdx"),
  },
};

export const guideEntries: GuideEntry[] = guideCards.map((card) => ({ ...card, ...guideFiles[card.slug] }));

export const getGuide = (slug: string) => guideEntries.find((g) => g.slug === slug) ?? null;

export interface ReviewEntry extends ContentEntry {
  venue: "polymarket" | "kalshi";
  name: string;
}

export const reviewEntries: ReviewEntry[] = [
  {
    slug: "polymarket",
    venue: "polymarket",
    name: "Polymarket",
    title: "Polymarket review",
    description: "Our Polymarket review: how the on-chain order book works, funding with USDC, fees, market depth and who can use it.",
    updated: "2026-11-17",
    status: "draft",
    load: () => import("./platforms/polymarket.mdx"),
  },
  {
    slug: "kalshi",
    venue: "kalshi",
    name: "Kalshi",
    title: "Kalshi review",
    description: "Our Kalshi review: how a CFTC-regulated exchange works, funding in USD, fees, the markets on offer and who can use it.",
    updated: "2026-11-17",
    status: "draft",
    load: () => import("./platforms/kalshi.mdx"),
  },
];

export const getReview = (slug: string) => reviewEntries.find((r) => r.slug === slug) ?? null;

export interface ArticleEntry extends ContentEntry {
  kicker: string;
  summary: string;
  author: string;
  coverClass: string;
}

/** Analysis articles. These four come from the design; each is an outline to be written. */
export const articleEntries: ArticleEntry[] = [
  {
    slug: "rate-cut-odds-after-jobs-report",
    kicker: "ECONOMY · MARKET MOVER",
    title: "Why rate-cut odds swung after the latest jobs report",
    summary: "What moved, which side the big wallets took, and what to watch before the next meeting.",
    description: "How Fed rate-cut odds on Polymarket and Kalshi moved after the latest jobs report, and what to watch before the next meeting.",
    author: "[AUTHOR]",
    updated: "2026-11-17",
    status: "draft",
    coverClass: "bg-polymarket-bg",
    load: () => import("./analysis/rate-cut-odds-after-jobs-report.mdx"),
  },
  {
    slug: "crypto-price-markets-vs-analysts",
    kicker: "CRYPTO · WEEKLY",
    title: "Crypto price markets this week: where the crowd disagrees with analysts",
    summary: "Comparing year-end price markets with options-implied ranges.",
    description: "Year-end crypto price markets compared with options-implied ranges: where prediction market traders and analysts disagree.",
    author: "[AUTHOR]",
    updated: "2026-11-17",
    status: "draft",
    coverClass: "bg-[#FCEBDD]",
    load: () => import("./analysis/crypto-price-markets-vs-analysts.mdx"),
  },
  {
    slug: "are-election-markets-more-accurate-than-polls",
    kicker: "POLITICS · EXPLAINER",
    title: "Are election markets more accurate than polls? What the record shows",
    summary: "A look at past cycles, where markets beat polling averages and where they missed.",
    description: "Election prediction markets versus polling averages across past cycles: where markets were more accurate and where they missed.",
    author: "[AUTHOR]",
    updated: "2026-11-17",
    status: "draft",
    coverClass: "bg-kalshi-bg",
    load: () => import("./analysis/are-election-markets-more-accurate-than-polls.mdx"),
  },
  {
    slug: "weekend-sports-markets-biggest-lines",
    kicker: "SPORTS · PREVIEW",
    title: "This weekend in sports markets: the five biggest lines",
    summary: "Market odds next to sportsbook lines, and where the gap is widest.",
    description: "The five biggest sports prediction markets this weekend, with market odds next to sportsbook lines and where the gap is widest.",
    author: "[AUTHOR]",
    updated: "2026-11-17",
    status: "draft",
    coverClass: "bg-chip",
    load: () => import("./analysis/weekend-sports-markets-biggest-lines.mdx"),
  },
];

export const getArticle = (slug: string) => articleEntries.find((a) => a.slug === slug) ?? null;

/** Metadata shared by every MDX page: drafts are kept out of search results. */
export const robotsFor = (status: ContentStatus) => (status === "draft" ? { index: false, follow: true } : undefined);
