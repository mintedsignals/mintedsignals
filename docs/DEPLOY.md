# Deploy checklist

Status as of 2026-11-23: phases 1 to 7 of `docs/BRIEF.md` are built. The site is live at **https://mintedsignals.io** on the **Cloudflare Workers Free plan**.

## How the site is hosted (and why)

The Free plan allows only 10 ms of CPU and 50 outbound requests per Worker request. A Next.js server rendering pages on each request goes over both (we measured 11 to 1,021 ms per page), so the site is a **static export** instead:

- `pnpm build` first runs `scripts/fetch-markets.ts`, which fetches the market snapshot once and saves it to `.data/`, then `next build` writes every page (about 2,100, including one per market) to `out/` as plain files.
- Cloudflare serves `out/` as **static assets: free, unlimited, and not counted against the Free plan's 100,000 requests a day**. No Worker code runs for a page view.
- Only two paths run code, in `worker/index.ts`: `/go/*` (affiliate redirects, logged) and `/api/newsletter`. Each uses under 1 ms of CPU.
- **Odds refresh by rebuilding:** `.github/workflows/deploy.yml` rebuilds and redeploys every 30 minutes, so odds are up to about 30 minutes old (shown on the site from `MARKETS_REFRESH_MINUTES` in `src/config/markets.ts`).
- Market filter pages use path URLs (`/markets/category/crypto/venue/kalshi/page/2`, see `src/lib/markets/filters.ts`), since a static site can't read `?category=` on the server.
- Market pages share the site's default share image (per-market images added 1,921 files; the Free plan allows 20,000 files per deploy, and the site uses about 12,700).

If you later move to Workers Paid ($5/month), the site can go back to rendering on request with 60-second odds. See the git history before this change (the OpenNext setup) for that version.

## 1. Deploy by hand

One-time setup (already done for this account):

1. A Cloudflare account on the Free plan.
2. Log in from the project folder (opens a browser window for you to approve):
   ```bash
   npx wrangler login
   ```
3. The site URL for builds, in `.env.production.local` (not committed):
   ```
   NEXT_PUBLIC_SITE_URL=https://mintedsignals.io
   ```

Deploy (fetch odds, build, upload only the changed files):

```bash
pnpm run deploy
```

A typical deploy uploads about 8,000 changed files in 30 seconds; the build takes about 30 seconds.

**Custom domain:** `wrangler.jsonc` attaches `mintedsignals.io` as a custom domain on deploy. Cloudflare refuses if the domain still has other DNS records (copied from Namecheap when the nameservers moved): delete the `A`, `AAAA` and `CNAME` records for `mintedsignals.io` under the domain's DNS → Records, then deploy again.

**Environment variables.** `NEXT_PUBLIC_*` values are baked in at build time: set them in `.env.production.local` for hand deploys and in the workflow for scheduled ones.

| Variable | Required | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://mintedsignals.io`. Used for canonical URLs, Open Graph and the sitemap. |
| `NEXT_PUBLIC_AD_SCRIPT_URL` | No | The ad network's script URL, from its publisher dashboard. |
| `NEXT_PUBLIC_AD_ZONE_728X90`, `_300X250`, `_300X600`, `_NATIVE` | No | Zone IDs. With none set, no ad markup or script is served. Also match `src/components/ads/AdZone.tsx` to the network's tag code. |
| `NEWSLETTER_PROVIDER` | No | A Worker variable (Workers & Pages → oddsboard → Settings → Variables). Leave unset until a provider is implemented in `src/lib/newsletter`; until then the form says "Signups aren't open yet". |
| `POLYMARKET_API_BASE`, `KALSHI_API_BASE` | No | Leave unset (testing overrides only). |

If Polymarket or Kalshi is down when the odds are fetched, **the build fails on purpose** and the live site keeps its last good version.

## 2. Scheduled rebuilds (GitHub Actions)

`.github/workflows/deploy.yml` rebuilds every 30 minutes, on every push to `main`, and on demand. To turn it on:

1. Push this repository to GitHub.
2. Create a Cloudflare API token: My Profile → API Tokens → Create Token → **Edit Cloudflare Workers** template, scoped to your account and to the `mintedsignals.io` zone.
3. In the GitHub repository, add two secrets under Settings → Secrets and variables → Actions: `CLOUDFLARE_API_TOKEN` (the token) and `CLOUDFLARE_ACCOUNT_ID` (shown by `npx wrangler whoami`).
4. Run it once by hand (Actions → Rebuild and deploy → Run workflow) and check it goes green.

**GitHub Actions minutes:** each run takes about 2 to 3 minutes. Public repositories get unlimited minutes. Private repositories on GitHub Free get 2,000 minutes a month, which covers a run about every 60 to 90 minutes, not every 30: change the `cron` line (and `MARKETS_REFRESH_MINUTES`) to match.

**Kalshi rate limits:** each rebuild fetches 42 Kalshi series once, from GitHub's servers. If more than a quarter fail with 429, that run fails and the site keeps the previous odds. Watch the Actions history for repeated failures; the fix is a free Kalshi API key (higher limits; needs a small change in `src/lib/markets/http.ts`, with the key stored as a GitHub secret).

## 3. Content and placeholders before launch

Nothing below is filled in with guesses. Each item needs a real value or a decision.

**Brand and business**

- [x] Site name: "Minted Signals" (set in `src/config/site.ts`). The Cloudflare Worker and R2 bucket keep their internal names, `oddsboard` and `oddsboard-cache`.
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
- [ ] Click a "Trade on Kalshi" button: it redirects to kalshi.com, and the Worker logs (Workers & Pages → oddsboard → Logs) show an `affiliate_click` line.
- [ ] Add the domain to Google Search Console and Bing Webmaster Tools, and submit the sitemap.
- [ ] Run Lighthouse on the live homepage and a market page (local production scores on 2026-11-17: performance 100, accessibility 100, best practices 100, SEO 100 on indexable pages; drafts score lower on SEO only because they're noindex).

## 5. Monitoring

- GitHub Actions history: failed "Rebuild and deploy" runs mean the odds didn't refresh (a venue down, or Kalshi rate limits; the log shows `[markets] Kalshi series failed` or `snapshot failed`).
- Worker logs (Workers & Pages → oddsboard → Logs): `affiliate_click` (outbound clicks), `[newsletter]` (provider errors).
- If odds look stale, check the Actions history first (see section 2).

## Known limitations

- Odds are up to about 30 minutes old (the rebuild schedule), not live.
- Kalshi links go to the series page (`kalshi.com/markets/<series>`); Kalshi doesn't document deeper market URLs.
- Kalshi 24h volume is contracts traded, counted as $1 each, so it's approximate next to Polymarket's dollar volume.
- The share image uses the default image font (no bold weight). Loading the brand fonts into `src/components/og/OgCard.tsx` would match the site. Market pages use the site-wide share image.
- The 728×90 leaderboard is hidden on phones; add a mobile size (e.g. 320×50) when the ad network supports it.
