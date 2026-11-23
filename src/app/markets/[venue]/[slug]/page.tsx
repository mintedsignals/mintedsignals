import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateNote } from "@/components/AffiliateNote";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarketRow, MarketRowHeader } from "@/components/markets/MarketRow";
import { VenueBadge } from "@/components/markets/VenueBadge";
import { MARKETS_REVALIDATE_SECONDS } from "@/config/markets";
import { goHref } from "@/config/partners";
import { categoryHref } from "@/config/site";
import { platformCtaAllowed } from "@/lib/compliance";
import { changeTone, formatChance, formatChange, formatDate, formatTimeUtc, formatVolume } from "@/lib/format";
import {
  getMarket,
  getMarketsSnapshot,
  getRelatedMarkets,
  getTopMarketParams,
  isVenue,
  venueNames,
  type Market,
  type MarketSummary,
} from "@/lib/markets";
import { marketPath } from "@/lib/markets/links";

/**
 * Market pages are the main SEO play ("[event] odds"), so they render fully on the server
 * and unknown markets return a real 404. `instant = false` lets this route wait for its
 * data before responding instead of streaming a shell first.
 */
export const instant = false;

/** Prerender the busiest markets at build time; the rest render on first visit, then cache. */
export async function generateStaticParams() {
  const params = await getTopMarketParams(100);
  // Cache Components needs at least one param; this one 404s.
  return params.length > 0 ? params : [{ venue: "polymarket", slug: "placeholder" }];
}

async function load(params: PageProps<"/markets/[venue]/[slug]">["params"]): Promise<Market | null> {
  const { venue, slug } = await params;
  if (!isVenue(venue)) return null;
  return getMarket(venue, decodeURIComponent(slug));
}

const chanceOf = (m: Market) => (m.yesOutcome === "Yes" ? "YES" : `“${m.yesOutcome}”`);

export async function generateMetadata({ params }: PageProps<"/markets/[venue]/[slug]">): Promise<Metadata> {
  const market = await load(params);
  if (!market) return { title: "Market not found" };

  const venue = venueNames[market.venue];
  // "Will X happen? Live odds" / "Next NVIDIA CEO: Jensen Huang: live odds" -> keeps "odds" in every title.
  const title = market.question.endsWith("?") ? `${market.question} Live odds` : `${market.question}: live odds`;
  const description = market.isOpen
    ? `Live ${venue} odds: ${formatChance(market.yesPrice)} chance of ${chanceOf(market)}. See the 24-hour move, how this market resolves and related markets, updated every minute.`
    : `This ${venue} market has closed. Final price: ${formatChance(market.yesPrice)} for ${chanceOf(market)}. See how it resolved and related markets.`;
  return {
    title,
    description,
    alternates: { canonical: marketPath(market) },
    openGraph: { title, description, type: "article", url: marketPath(market) },
  };
}

export default async function MarketPage({ params }: PageProps<"/markets/[venue]/[slug]">) {
  const market = await load(params);
  if (!market) notFound();

  const [{ venues: status }, related] = await Promise.all([getMarketsSnapshot(), getRelatedMarkets(market)]);
  const venue = venueNames[market.venue];
  const tone = changeTone(market.change24h);
  const closes = formatDate(market.closeTime);
  const updated = formatTimeUtc(status[market.venue].fetchedAt);
  const showCta = platformCtaAllowed(market.venue);

  return (
    <div className="page-container flex flex-col gap-10 py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Markets", href: "/markets" },
          { label: market.category, href: categoryHref(market.category) },
          { label: market.question },
        ]}
      />

      <div className="flex flex-wrap items-start gap-10">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-8">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
              <VenueBadge venue={market.venue} />
              <span>{market.category}</span>
              {closes && <span>· {market.isOpen ? "Closes" : "Closed"} {closes}</span>}
            </div>
            <h1 className="font-display text-[32px] leading-[1.1] font-bold tracking-[-0.03em] sm:text-[44px]">
              {market.question}
            </h1>
          </header>

          {!market.isOpen && (
            <p className="rounded-control border border-line bg-surface px-4 py-3 text-sm text-body">
              This market is closed to trading. The price below is its last price on {venue}.
            </p>
          )}

          {/* Current odds */}
          <section aria-labelledby="odds" className="rounded-panel border border-line p-6">
            <h2 id="odds" className="sr-only">
              Current odds
            </h2>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted">Chance of {chanceOf(market)}</span>
                <span className="font-mono text-5xl font-semibold">{formatChance(market.yesPrice)}</span>
              </div>
              <dl className="flex flex-wrap gap-8">
                <div>
                  <dt className="text-xs text-muted">24h change</dt>
                  <dd className={`font-mono text-lg font-semibold ${tone === "up" ? "text-positive" : tone === "down" ? "text-negative" : "text-muted"}`}>
                    {formatChange(market.change24h)}
                    {market.change24h !== null && <span className="text-xs font-normal text-muted"> pts</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">24h volume</dt>
                  <dd className="font-mono text-lg font-semibold">{formatVolume(market.volume24h)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">YES price</dt>
                  <dd className="font-mono text-lg font-semibold">{Math.round(market.yesPrice * 100)}¢</dd>
                </div>
              </dl>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded bg-[#F3E3D9]" aria-hidden="true">
              <div className="h-2 rounded bg-accent" style={{ width: `${Math.round(market.yesPrice * 100)}%` }} />
            </div>
            <p className="mt-4 text-xs text-muted">
              Odds from {venue}
              {updated && `, as of ${updated}`}. Refreshed every {MARKETS_REVALIDATE_SECONDS} seconds.
              {market.venue === "kalshi" && " Kalshi volume is contracts traded, counted at $1 each."}
            </p>
          </section>

          {/* How it resolves */}
          <section aria-labelledby="resolves" className="flex flex-col gap-4">
            <h2 id="resolves" className="font-display text-2xl font-bold tracking-[-0.02em]">
              How this market resolves
            </h2>
            <p className="text-[17px] leading-[1.6] text-body">
              Each {market.yesOutcome === "Yes" ? "YES" : `“${market.yesOutcome}”`} share pays $1 if that outcome
              happens and nothing if it doesn’t. At {Math.round(market.yesPrice * 100)}¢ a share, traders put the
              chance at about {formatChance(market.yesPrice)}.{" "}
              <Link href="/guides/how-to-read-prediction-market-odds">How to read prediction market odds</Link>.
            </p>
            {market.rules ? (
              <figure className="flex flex-col gap-2 rounded-card bg-surface p-5">
                <blockquote className="flex flex-col gap-3 text-[15px] leading-[1.6] whitespace-pre-line text-body">
                  {market.rules}
                </blockquote>
                <figcaption className="text-xs text-muted">Resolution rules as published by {venue}.</figcaption>
              </figure>
            ) : (
              <p className="text-[15px] text-body">{venue} hasn’t published detailed rules for this market.</p>
            )}
          </section>

          <RelatedList title="Other outcomes in this event" markets={related.sameEvent} />
          <RelatedList title={`More ${market.category.toLowerCase()} markets`} markets={related.sameCategory} />
        </div>

        {/* Call to action */}
        {showCta && (
          <aside className="flex w-full min-w-0 flex-[1_1_300px] flex-col gap-3 rounded-card border border-line p-6 lg:sticky lg:top-6 lg:max-w-[340px]">
            <h2 className="font-display text-xl font-bold">Trade this market</h2>
            <p className="text-sm leading-normal text-body">
              {market.isOpen
                ? `This market trades on ${venue}. Check that ${venue} is available where you live before signing up.`
                : `This market has closed, but ${venue} lists similar markets.`}
            </p>
            <a
              href={goHref(market.venue, market.id)}
              rel="sponsored noopener"
              className="rounded-control bg-accent px-5 py-3.5 text-center text-[15px] font-semibold text-white no-underline hover:bg-link hover:text-white"
            >
              {market.isOpen ? `Trade on ${venue}` : `Visit ${venue}`}
            </a>
            <Link href={`/platforms/${market.venue}`} className="text-center text-sm font-semibold">
              Read our {venue} review
            </Link>
            <AffiliateNote className="mt-1" />
          </aside>
        )}
      </div>
    </div>
  );
}

function RelatedList({ title, markets }: { title: string; markets: MarketSummary[] }) {
  if (markets.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">{title}</h2>
      <div className="overflow-hidden rounded-card border border-line">
        <MarketRowHeader />
        <ul>
          {markets.map((m) => (
            <li key={m.id}>
              <MarketRow market={m} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
