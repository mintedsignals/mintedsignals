import Link from "next/link";
import { Suspense } from "react";
import { HottestMarkets } from "@/components/markets/HottestMarkets";
import { HottestMarketsSkeleton } from "@/components/markets/HottestMarketsSkeleton";
import { MARKETS_REFRESH_MINUTES } from "@/config/markets";
import { formatCount } from "@/lib/format";
import { getMarketsSnapshot } from "@/lib/markets";

const statValue = "font-display text-[26px] font-bold";

/** Live count of tracked markets. Before the first successful fetch, the design's placeholder. */
async function MarketsTracked() {
  const { markets } = await getMarketsSnapshot();
  return <dd className={statValue}>{markets.length > 0 ? formatCount(markets.length) : "[N]"}</dd>;
}

export function Hero() {
  return (
    <section id="markets" className="page-container flex flex-wrap items-start gap-12 pt-14 pb-16">
      <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-5 pt-2">
        <span className="eyebrow">PREDICTION MARKETS, DECODED</span>
        <h1 className="font-display text-[42px] leading-[1.02] font-bold tracking-[-0.035em] sm:text-[56px]">
          What the crowd is betting on, and what it means.
        </h1>
        <p className="max-w-[460px] text-lg leading-[1.55] text-body">
          Live odds from Polymarket and Kalshi, plain-English guides, and analysis of the markets moving the most
          each day.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            href="/guides/what-is-a-prediction-market"
            className="rounded-control bg-accent px-5 py-3.5 text-[15px] font-semibold text-white no-underline hover:bg-link hover:text-white"
          >
            New here? Start with the basics
          </Link>
          <Link
            href="/platforms"
            className="rounded-control border border-line-strong px-5 py-[13px] text-[15px] font-semibold text-ink no-underline hover:border-ink"
          >
            Compare platforms
          </Link>
        </div>
        <dl className="mt-5 flex flex-wrap gap-7 border-t border-line pt-6">
          <div className="flex flex-col-reverse gap-1">
            <dt className="text-[13px] text-muted">markets tracked</dt>
            <Suspense fallback={<dd className={statValue}>…</dd>}>
              <MarketsTracked />
            </Suspense>
          </div>
          <div className="flex flex-col-reverse gap-1">
            <dt className="text-[13px] text-muted">venues at launch</dt>
            <dd className={statValue}>2</dd>
          </div>
          <div className="flex flex-col-reverse gap-1">
            <dt className="text-[13px] text-muted">odds refresh</dt>
            <dd className={statValue}>{MARKETS_REFRESH_MINUTES}m</dd>
          </div>
        </dl>
      </div>

      <Suspense fallback={<HottestMarketsSkeleton />}>
        <HottestMarkets />
      </Suspense>
    </section>
  );
}
