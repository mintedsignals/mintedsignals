/**
 * Homepage copy from the approved design. Bracketed values are placeholders the brief
 * says to keep until real figures exist. Don't fill them with guesses.
 */

export type PlatformCard = {
  name: string;
  badge: string;
  badgeClass: string;
  facts: { label: string; value: string }[];
  /** Affiliate CTA. Direct venue URLs until phase 6 routes them through /go/[partner]. */
  cta: { label: string; href: string | null; primary?: boolean };
  reviewHref: string | null;
  placeholder?: boolean;
};

export const platformCards: PlatformCard[] = [
  {
    name: "Polymarket",
    badge: "Largest volume",
    badgeClass: "bg-polymarket-bg text-polymarket-fg",
    facts: [
      { label: "Model", value: "On-chain order book" },
      { label: "Settles in", value: "USDC" },
      { label: "Fees", value: "[FEE]" },
      { label: "Availability", value: "[CHECK REGIONS]" },
    ],
    cta: { label: "Visit Polymarket", href: "https://polymarket.com/" },
    reviewHref: "/platforms/polymarket",
  },
  {
    name: "Kalshi",
    badge: "US regulated",
    badgeClass: "bg-kalshi-bg text-kalshi-fg",
    facts: [
      { label: "Model", value: "CFTC-regulated exchange" },
      { label: "Settles in", value: "USD" },
      { label: "Fees", value: "[FEE]" },
      { label: "Availability", value: "[CHECK REGIONS]" },
    ],
    cta: { label: "Visit Kalshi", href: "https://kalshi.com/" },
    reviewHref: "/platforms/kalshi",
  },
  {
    name: "[Platform 3]",
    badge: "Featured partner",
    badgeClass: "bg-chip text-body",
    facts: [
      { label: "Model", value: "[MODEL]" },
      { label: "Settles in", value: "[CURRENCY]" },
      { label: "Fees", value: "[FEE]" },
      { label: "Bonus", value: "[OFFER]" },
    ],
    // No partner yet, so the buttons render but don't link anywhere.
    cta: { label: "Claim offer", href: null, primary: true },
    reviewHref: null,
    placeholder: true,
  },
];

/** Placeholder articles from the design. Phase 5 replaces these with MDX articles. */
export const analysisPlaceholders = [
  {
    kicker: "ECONOMY · MARKET MOVER",
    title: "Why rate-cut odds swung after the latest jobs report",
    summary: "What moved, which side the big wallets took, and what to watch before the next meeting.",
    coverClass: "bg-polymarket-bg",
  },
  {
    kicker: "CRYPTO · WEEKLY",
    title: "Crypto price markets this week: where the crowd disagrees with analysts",
    summary: "Comparing year-end price markets with options-implied ranges.",
    coverClass: "bg-[#FCEBDD]",
  },
  {
    kicker: "POLITICS · EXPLAINER",
    title: "Are election markets more accurate than polls? What the record shows",
    summary: "A look at past cycles, where markets beat polling averages and where they missed.",
    coverClass: "bg-kalshi-bg",
  },
  {
    kicker: "SPORTS · PREVIEW",
    title: "This weekend in sports markets: the five biggest lines",
    summary: "Market odds next to sportsbook lines, and where the gap is widest.",
    coverClass: "bg-chip",
  },
];

export const advertiseStats = [
  { value: "[MONTHLY USERS]", label: "monthly unique visitors" },
  { value: "[SUBSCRIBERS]", label: "newsletter subscribers" },
  { value: "[TOP GEOS]", label: "top traffic countries" },
  { value: "[CRYPTO %]", label: "of readers hold crypto" },
];

export const adsEmail = "[ADS EMAIL]";
