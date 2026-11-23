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

export const advertiseStats = [
  { value: "[MONTHLY USERS]", label: "monthly unique visitors" },
  { value: "[SUBSCRIBERS]", label: "newsletter subscribers" },
  { value: "[TOP GEOS]", label: "top traffic countries" },
  { value: "[CRYPTO %]", label: "of readers hold crypto" },
];

export const adsEmail = "[ADS EMAIL]";
