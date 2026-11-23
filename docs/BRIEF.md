# Build brief: prediction markets affiliate site ("Oddsboard", working name)

## Goal
A fast, SEO-first content site about prediction markets. It makes money in three ways:
1. Affiliate links to platforms (Polymarket, Kalshi, later others)
2. Display ads from crypto ad networks (Coinzilla, Blockchain-Ads)
3. Direct brand deals (sponsored widgets, featured listings, newsletter placements)

Organic search traffic drives all three, so crawlability, page speed and content structure come first.

## Design reference
`design-reference.html` is the approved homepage design. It was exported from a design tool, so it uses a custom template syntax (`<x-dc>`, `<sc-for>`, `{{holes}}`, a `DCLogic` class). **Do not reuse that syntax.** Use it as a visual spec only: match the layout, sections, copy, colours, fonts and spacing.

Design tokens used in the reference:
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (numbers and labels)
- Ink #0E1116, body grey #3D4350, muted #5A6170, border #E4E6EB, surface #F5F6F8
- Accent #2F5BFF, link and positive change #1F3FD1, negative change #B4400C
- Polymarket badge #E8EDFF / #1F3FD1, Kalshi badge #E6F4F1 / #0B6B5C
- Content max width 1240px, radius 10 to 16px

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Deploy on Vercel
- Guides and articles as MDX files in the repo for now (a headless CMS can come later)
- No database for v1. Market data is fetched server-side and cached.

## Market data
- **Polymarket**: the public Gamma API (markets and events, no API key needed)
- **Kalshi**: the public market data endpoints of the Kalshi Trade API v2
- Check both APIs' current docs before writing the client code. Endpoints and fields change.
- Fetch on the server only, cache for about 60 seconds (ISR or fetch revalidate), never call the APIs from the browser.
- Normalise both into one `Market` type: id, venue, question, slug, category, yesPrice (0 to 1), change24h, volume24h, closeTime, url.
- "Hottest" = sorted by 24h volume, with optional manual pinning from a config file.
- Map each venue's categories onto ours: Politics, Crypto, Economy, Sports, Culture, Other.
- If an API fails, serve the last cached data. Never show an empty or broken widget.

## Pages (v1)
- `/`: homepage, as in the design
- `/markets`: all markets, filterable by category and venue (filters as URL params so they are crawlable)
- `/markets/[venue]/[slug]`: one page per market. Question, current odds, short explainer of how it resolves, related markets, affiliate CTA. These pages are the main SEO play ("[event] odds" searches), so they must render server-side with unique titles and descriptions.
- `/guides/[slug]`: the six guides from the design (MDX)
- `/platforms/[slug]`: platform reviews (Polymarket, Kalshi)
- `/tools/odds-calculator`: the calculator from the sidebar, as its own page
- `/advertise`: media kit page for brands and ad networks
- `/disclosure`, `/about`, `/contact`, `/privacy`

## SEO requirements
- Unique metadata per page, canonical URLs, Open Graph images
- `sitemap.xml` (including every market page) and `robots.txt`
- JSON-LD: Article for guides, FAQPage where a page has an FAQ, BreadcrumbList everywhere
- All content in the server-rendered HTML (the markets widget included). Filtering can be client-side on top of that.
- Good Core Web Vitals: self-host fonts with next/font, optimised images, no layout shift from ads

## Ads
- One `<AdSlot size="728x90" | "300x250" | "300x600" | "native" />` component
- Each slot reserves its exact size up front, so nothing shifts when the ad loads
- Network script and zone IDs come from environment variables. With no IDs set, the slot renders nothing in production and a labelled placeholder in development.
- Load ad scripts lazily, after the main content
- Placements as in the design: leaderboard under the menu, 300x250 and sticky 300x600 in the sidebar, one native unit in the article list. No ads in the hero.

## Affiliate links
- All partner links live in one config file (partner, base URL, tracking parameters)
- Links go through `/go/[partner]?m=<market-id>` which redirects, so tracking can change in one place and clicks can be logged later
- Always `rel="sponsored noopener"`
- Affiliate disclosure near every block of affiliate links, plus the full `/disclosure` page

## Compliance
- Footer notice: 18+, risk of loss, not available everywhere, not financial advice, affiliate disclosure (copy is in the design)
- Leave a hook for hiding platform CTAs by visitor country later; don't build the geo logic yet

## Newsletter
- Signup form posts to an API route. Leave the email provider behind an interface; I'll pick one later.

## Placeholders to keep as-is for now
Site name, [FEE], [CHECK REGIONS], [Platform 3], [MONTHLY USERS], [SUBSCRIBERS], [TOP GEOS], [CRYPTO %], [ADS EMAIL], cover images. Don't invent figures or facts to fill them.

## How to work
Build in phases. At the end of each phase, stop and tell me what to check before moving on.
1. Scaffold the project, design tokens, layout, header and footer
2. Market data layer (both APIs, normalising, caching) with tests
3. Homepage matching the design, with live data
4. Market pages, `/markets`, sitemap
5. Guides, platform reviews, calculator page, advertise page
6. Ads, affiliate redirects, newsletter route
7. SEO pass (metadata, JSON-LD, Lighthouse) and a deploy checklist

Before starting, read this brief and the design reference, then give me a short plan for phase 1 and any questions.
