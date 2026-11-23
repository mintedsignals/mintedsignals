# Deploy checklist

Status as of 2026-11-17: phases 1 to 7 of `docs/BRIEF.md` are built. The site builds and runs in production mode locally. It has **not** been deployed yet. Work through this list in order.

## 1. Must test before launch: Kalshi rate limits

This is the main open risk.

Kalshi limits unauthenticated requests per IP and doesn't publish the limit. Our data layer fetches 42 Kalshi series (three at a time, with retries on 429) every 60 seconds, per server instance. Locally this mostly works, but we saw 429s, especially:

- during builds, when several workers loaded data at once. This is fixed: the build now uses one worker (`experimental.staticGenerationMinPagesPerWorker` in `next.config.ts`).
- on the dev server, which refreshes caches more often.

On Vercel, every serverless instance has its own in-memory cache, so several instances can each fetch Kalshi every minute, and they may share outbound IPs.

**What happens if it goes wrong:** if more than a quarter of the series fail, the refresh is abandoned and the previous page keeps being served. Visitors don't see a broken page, but Kalshi odds go stale. The server log shows `[markets] Kalshi series failed: …` lines.

**How to test:** deploy to a preview and leave it under normal traffic for an hour. Search the Vercel logs for `Kalshi series failed` and `429`.

**If it's a problem, in order of effort:**

1. Raise `MARKETS_REVALIDATE_SECONDS` in `src/config/markets.ts` (e.g. 120), or trim `KALSHI_SERIES`.
2. Try `"use cache: remote"` instead of `"use cache"` in `loadSnapshot` in `src/lib/markets/index.ts`. On Vercel this shares one cache across all instances (Next.js recommends it for rate-limited APIs). Check that the homepage and market pages still prerender with data.
3. Get a free Kalshi API key, which has documented, much higher limits. Kalshi signs requests with an RSA key, so this needs a small code change in `src/lib/markets/http.ts` (keys go in env vars, never in the repo).

## 2. Vercel project setup

- Import the repo into Vercel (framework: Next.js; install: `pnpm install`; build: `pnpm build`). Node 20.9+ is required, and Vercel's default is fine.
- Environment variables (Production, and Preview where noted):

| Variable | Required | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | The production origin, e.g. `https://example.com` (no trailing slash). Used for canonical URLs, Open Graph and the sitemap. It's baked in at build time, so redeploy after changing it. On Preview, set it to the preview URL or leave it unset. |
| `NEXT_PUBLIC_AD_SCRIPT_URL` | No | The ad network's script URL, from its publisher dashboard. |
| `NEXT_PUBLIC_AD_ZONE_728X90`, `_300X250`, `_300X600`, `_NATIVE` | No | Zone IDs. With none set, no ad markup or script is served. Also match `src/components/ads/AdZone.tsx` to the network's tag code. |
| `NEWSLETTER_PROVIDER` | No | Leave unset until a provider is implemented in `src/lib/newsletter`. Until then the signup form shows "Signups aren't open yet". |
| `POLYMARKET_API_BASE`, `KALSHI_API_BASE` | No | Leave unset in production (testing overrides only). |

- Preview deployments automatically block crawlers (`robots.txt` checks `VERCEL_ENV`).
- The build fetches live market data. If Polymarket or Kalshi is down during a build, **the build fails on purpose** and the previous deployment stays live. Retry later.

## 3. Content and placeholders before launch

Nothing below is filled in with guesses. Each item needs a real value or a decision.

**Brand and business**

- [ ] Site name: "Oddsboard" is a working name, set in `src/config/site.ts`.
- [ ] `[ADS EMAIL]` in `src/config/home.ts` (also used by "Contact sales").
- [ ] `[MONTHLY USERS]`, `[SUBSCRIBERS]`, `[TOP GEOS]`, `[CRYPTO %]` in `src/config/home.ts`. Leave them out until you have real numbers.
- [ ] `[MEDIA KIT PDF]` on `/advertise`.
- [ ] `[Platform 3]` card (`[MODEL]`, `[CURRENCY]`, `[FEE]`, `[OFFER]`) in `src/config/home.ts`, or remove the card until there's a partner.
- [ ] `[FEE]` and `[CHECK REGIONS]` on the Polymarket and Kalshi cards in `src/config/home.ts`.
- [ ] Affiliate tracking parameters in `src/config/partners.ts`.
- [ ] `[CHECK: …]` notes on `/disclosure` (list only partners with signed agreements), `/platforms` (review methodology) and `/advertise`.

**Pages still to write** (placeholders, marked noindex)

- [ ] `/about` (including editorial policy and review methodology), `/contact`, `/privacy`, `/glossary`. When each is done, remove its `robots` noindex and add it to `staticPaths` in `src/app/sitemap.ts`.
- [ ] Privacy policy and cookies: ad networks and any analytics may require a consent banner in some regions (e.g. EU/UK). Check with the networks and a legal adviser.

**Guides, reviews and articles** (all drafts: noindex, out of the sitemap, with a draft banner)

- [ ] Fix the 52 highlighted `<Check>` items: legality (17), Polymarket vs Kalshi (14), each review (7 and 7), resolution (3), and one per analysis outline. Search the MDX for `<Check`.
- [ ] Three guides are complete apart from review: what is a prediction market, reading odds, liquidity and slippage. Review them and publish them first.
- [ ] Write the four analysis articles (currently outlines), with `[AUTHOR]`, cover images and dates.
- [ ] To publish, set `status: "published"` and `updated` in `src/content/index.ts` (see the README).

## 4. After the first production deploy

- [ ] `https://<domain>/robots.txt` disallows `/go/` and `/api/` and points at the sitemap on the real domain.
- [ ] `https://<domain>/sitemap.xml` lists the real domain and about 1,800 market URLs.
- [ ] A market page, a guide and `/tools/odds-calculator` pass Google's Rich Results Test (BreadcrumbList, Article, FAQPage).
- [ ] Share a market URL in a link-preview debugger: the image shows the question and live chance.
- [ ] Click a "Trade on Kalshi" button: it redirects to kalshi.com, and Vercel logs show an `affiliate_click` line.
- [ ] Add the domain to Google Search Console and Bing Webmaster Tools, and submit the sitemap.
- [ ] Run Lighthouse on the live homepage and a market page (local production scores on 2026-11-17: performance 100, accessibility 100, best practices 100, SEO 100 on indexable pages; drafts score lower on SEO only because they're noindex).

## 5. Monitoring

- Vercel logs: `[markets] Kalshi series failed`, `[markets] snapshot failed` (a venue down), `affiliate_click` (outbound clicks), `[newsletter]` (provider errors).
- If odds look stale, check those log lines first (see section 1).

## Known limitations

- The last-good fallback for market data lives in each server instance's memory; a new instance relies on Next.js keeping the previous page (verified locally on a production build).
- Kalshi links go to the series page (`kalshi.com/markets/<series>`); Kalshi doesn't document deeper market URLs.
- Kalshi 24h volume is contracts traded, counted as $1 each, so it's approximate next to Polymarket's dollar volume.
- Open Graph images use the default image font (no bold weight). Loading the brand fonts into `src/components/og/OgCard.tsx` would match the site.
- The 728×90 leaderboard is hidden on phones; add a mobile size (e.g. 320×50) when the ad network supports it.
