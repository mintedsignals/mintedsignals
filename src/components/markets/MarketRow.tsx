import Link from "next/link";
import { changeTone, formatChance, formatChange, formatVolume } from "@/lib/format";
import { marketPath } from "@/lib/markets/links";
import type { MarketSummary } from "@/lib/markets/types";
import { VenueBadge } from "./VenueBadge";

const toneClass = { up: "text-positive", down: "text-negative", flat: "text-muted" };

// Mobile: question on its own row, numbers below. From sm: the design's four columns.
export const rowGrid = "grid grid-cols-[minmax(0,1fr)_70px_76px] gap-x-3 sm:grid-cols-[minmax(0,1fr)_150px_70px_76px]";

/** Column headings for a list of MarketRows (hidden on mobile, where rows stack). */
export function MarketRowHeader() {
  return (
    <div
      aria-hidden="true"
      className={`${rowGrid} hidden border-b border-line bg-subtle px-5 py-2.5 font-mono text-[11px] tracking-[0.08em] text-muted sm:grid`}
    >
      <span>MARKET</span>
      <span>YES CHANCE</span>
      <span>24H</span>
      <span className="text-right">VOLUME</span>
    </div>
  );
}

/** One market as a row: question, venue, chance with bar, 24h change, 24h volume. */
export function MarketRow({ market: m }: { market: MarketSummary }) {
  return (
    <Link
      href={marketPath(m)}
      className={`${rowGrid} items-center gap-y-3 border-b border-line-soft px-5 py-3.5 text-ink no-underline hover:bg-subtle hover:text-ink`}
    >
      <span className="col-span-3 flex min-w-0 flex-col gap-1.5 sm:col-span-1">
        <span className="text-[15px] leading-[1.3] font-semibold">{m.question}</span>
        <span className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <VenueBadge venue={m.venue} />
          <span>{m.category}</span>
          {m.yesOutcome !== "Yes" && <span>· Chance of “{m.yesOutcome}”</span>}
          {!m.isOpen && <span>· Closed</span>}
        </span>
      </span>
      <span className="flex flex-col gap-1.5">
        <span className="font-mono text-base font-semibold">
          <span className="sr-only">Chance: </span>
          {formatChance(m.yesPrice)}
        </span>
        <span className="block h-1.5 overflow-hidden rounded-[3px] bg-[#F3E3D9]" aria-hidden="true">
          <span className="block h-1.5 rounded-[3px] bg-accent" style={{ width: `${Math.round(m.yesPrice * 100)}%` }} />
        </span>
      </span>
      <span className={`font-mono text-[13px] font-semibold ${toneClass[changeTone(m.change24h)]}`}>
        <span className="sr-only">24 hour change: </span>
        {formatChange(m.change24h)}
      </span>
      <span className="text-right font-mono text-[13px] text-body">
        <span className="sr-only">24 hour volume: </span>
        {formatVolume(m.volume24h)}
      </span>
    </Link>
  );
}
