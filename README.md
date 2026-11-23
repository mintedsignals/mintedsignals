# Oddsboard (working name)

SEO-first content site about prediction markets. The brief is in [docs/BRIEF.md](docs/BRIEF.md), and the approved homepage design is [docs/design/design-reference.html](docs/design/design-reference.html), a visual spec only.

## Stack
Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4, pnpm. Deployed on Vercel.

## Commands
```bash
pnpm dev --port 3200   # dev server
pnpm typecheck         # route types + tsc
pnpm lint
pnpm build
pnpm test              # unit tests (no network)
pnpm test:live         # calls the real Polymarket and Kalshi APIs
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`.

## Where things live
- `src/config/site.ts`: site name, navigation, guide list, footer links, compliance copy
- `src/app/globals.css`: design tokens (colours, fonts, radii, container width)
- `src/components/layout/`: ticker, header, mobile menu, leaderboard band, footer
- `src/config/markets.ts`: Kalshi series to track, Polymarket market count, cache time, hottest-list pins
- `src/lib/markets/`: market data layer. Server only; import from `@/lib/markets` (`getMarketsSnapshot`, `getHottestMarkets`, `getMarket`)
- `src/content/`: guides, reviews and analysis as MDX, listed in `src/content/index.ts`
- `src/mdx-components.tsx`: MDX styles and the `<Check>`, `<Callout>` and `<OddsCalculator>` components
- `src/components/ads/`: fixed-size ad slots (placeholder in dev, nothing in production until zone IDs are set); `AdZone.tsx` is the one place to match to the ad network's tag code
- `src/config/partners.ts`: affiliate partners, base URLs and tracking params; all partner links go through `/go/[partner]?m=<market-id>`
- `src/lib/newsletter/`: newsletter provider interface; pick a provider with `NEWSLETTER_PROVIDER`

## Phases
1. Scaffold, design tokens, layout, header and footer (done)
2. Market data layer (Polymarket and Kalshi), with tests (done)
3. Homepage with live data (done)
4. Market pages, `/markets`, sitemap (done)
5. Guides, platform reviews, calculator, advertise page (done; content in draft)
6. Ads, affiliate redirects, newsletter route (done)
7. SEO pass and deploy checklist (done; see [docs/DEPLOY.md](docs/DEPLOY.md))

## Market data notes
- Polymarket: Gamma API `/markets/keyset`, top markets by 24h volume. Category comes from tags.
- Kalshi: only the series listed in `src/config/markets.ts` (Kalshi can't sort by volume and has 12,000+ open events). Requests go three at a time, with retries on 429, because Kalshi rate-limits public traffic per IP.
- Kalshi 24h volume is in contracts, counted as $1 each, so it is approximate next to Polymarket's dollar volume.
- `POLYMARKET_API_BASE` / `KALSHI_API_BASE` override the API hosts (testing, or Kalshi's demo environment).
- Market pages use our own slugs, `<question words>--<venue id>`, because venue slugs aren't reliably readable.
- Data is cached for 60 seconds. If a venue fails, its last good data is served (kept in server memory per instance).

## Publishing content
Every guide, review and article starts as a draft: it renders with a draft banner, is marked noindex and stays out of the sitemap.
1. Replace every highlighted `<Check>…</Check>` in the MDX file with checked facts (search the file for `<Check`).
2. In `src/content/index.ts`, set the entry's `status` to `"published"` and `updated` to the review date.
Bracketed placeholders such as [FEE] or [ADS EMAIL] in pages and config also need real values before launch.
