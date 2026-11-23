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
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`.

## Where things live
- `src/config/site.ts`: site name, navigation, guide list, footer links, compliance copy
- `src/app/globals.css`: design tokens (colours, fonts, radii, container width)
- `src/components/layout/`: ticker, header, mobile menu, leaderboard band, footer
- `src/components/ads/AdSlot.tsx`: fixed-size ad slots (placeholder in dev, nothing in production until zone IDs are set)

## Phases
1. Scaffold, design tokens, layout, header and footer (done)
2. Market data layer (Polymarket and Kalshi), with tests
3. Homepage with live data
4. Market pages, `/markets`, sitemap
5. Guides, platform reviews, calculator, advertise page
6. Ads, affiliate redirects, newsletter route
7. SEO pass and deploy checklist
