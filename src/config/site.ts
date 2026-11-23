/**
 * Site-wide settings: name, URL, navigation and compliance copy.
 * The name is a working title (see docs/BRIEF.md). Change it here only.
 */

export const site = {
  name: "Oddsboard",
  tagline: "Independent news, data and guides on prediction markets.",
  description:
    "Live odds from Polymarket and Kalshi, plain-English guides, and analysis of the markets moving the most each day.",
  /** Absolute origin used for canonical URLs, Open Graph and the sitemap. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

export type NavLink = { label: string; href: string };

export const mainNav: NavLink[] = [
  { label: "Markets", href: "/markets" },
  { label: "Guides", href: "/guides" },
  { label: "Platforms", href: "/platforms" },
  { label: "Analysis", href: "/analysis" },
  { label: "Odds calculator", href: "/tools/odds-calculator" },
];

export const headerCta: NavLink = { label: "Get the daily brief", href: "/#newsletter" };

/** Our market categories. Each venue's own categories map onto these (phase 2). */
export const categories = ["Politics", "Crypto", "Economy", "Sports", "Culture", "Other"] as const;
export type Category = (typeof categories)[number];

export const categoryHref = (category: Category) =>
  `/markets?category=${category.toLowerCase()}`;

/** The six guides from the design. Content arrives as MDX in phase 5. */
export const guides = [
  {
    slug: "what-is-a-prediction-market",
    number: "01",
    topic: "Basics",
    title: "What is a prediction market?",
    summary: "How YES and NO shares work, and why prices act like probabilities.",
  },
  {
    slug: "how-to-read-prediction-market-odds",
    number: "02",
    topic: "Odds",
    title: "Reading odds: cents, percentages and payouts",
    summary: "Turn a 62¢ price into implied chance, payout and expected value.",
  },
  {
    slug: "polymarket-vs-kalshi",
    number: "03",
    topic: "Platforms",
    title: "Polymarket vs Kalshi",
    summary: "Regulation, fees, funding, market depth and who can use each.",
  },
  {
    slug: "how-prediction-markets-resolve",
    number: "04",
    topic: "Resolution",
    title: "How markets resolve, and when they get disputed",
    summary: "Resolution sources, oracles and what happens with ambiguous outcomes.",
  },
  {
    slug: "liquidity-spreads-and-slippage",
    number: "05",
    topic: "Strategy",
    title: "Liquidity, spreads and slippage",
    summary: "Why the price you see is not always the price you get.",
  },
  {
    slug: "are-prediction-markets-legal",
    number: "06",
    topic: "Rules",
    title: "Are prediction markets legal where you live?",
    summary: "A country-by-country page, updated as rules change.",
  },
] as const;

export type GuideSlug = (typeof guides)[number]["slug"];

/** Platform review pages. Reviews arrive in phase 5. */
export const platforms = [
  { slug: "polymarket", name: "Polymarket" },
  { slug: "kalshi", name: "Kalshi" },
] as const;

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Markets",
    links: (["Politics", "Crypto", "Economy", "Sports"] as const).map((c) => ({
      label: c,
      href: categoryHref(c),
    })),
  },
  {
    heading: "Learn",
    links: [
      { label: "Guides", href: "/guides" },
      { label: "Glossary", href: "/glossary" },
      { label: "Odds calculator", href: "/tools/odds-calculator" },
      { label: "Legality by country", href: "/guides/are-prediction-markets-legal" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About and editorial policy", href: "/about" },
      { label: "Advertise", href: "/advertise" },
      { label: "Affiliate disclosure", href: "/disclosure" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

/** Footer compliance notice, word for word from the approved design. */
export const complianceNotice =
  "18+. Trading on prediction markets involves risk of loss and is not available in every country; check your local rules. Some links are affiliate links and we may earn a commission at no cost to you. Odds are shown for information only and are not financial advice. Market data from Polymarket and Kalshi.";
