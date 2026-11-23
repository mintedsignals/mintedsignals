import Link from "next/link";
import { changeTone, formatChance, formatChange } from "@/lib/format";
import { getHottestMarkets, type Market } from "@/lib/markets";
import { marketPath } from "@/lib/markets/links";

const toneClass = { up: "text-dark-positive", down: "text-dark-negative", flat: "text-dark-label" };

/** The dark 40px strip; also the loading state while the odds load. */
export function TickerFrame({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-10 items-center overflow-hidden bg-ink text-[13px] text-white">
      <span className="shrink-0 px-6 font-mono text-[11px] tracking-[0.08em] text-dark-label">LIVE ODDS</span>
      <div className="ticker-viewport min-w-0 flex-1 overflow-hidden whitespace-nowrap">{children}</div>
    </div>
  );
}

function TickerItems({ markets, duplicate = false }: { markets: Market[]; duplicate?: boolean }) {
  return (
    // The duplicate copy only exists to make the loop seamless: hidden from screen readers
    // and skipped by the keyboard.
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={duplicate || undefined}>
      {markets.map((m) => (
        <li key={m.id}>
          <Link
            href={marketPath(m)}
            tabIndex={duplicate ? -1 : undefined}
            className="flex items-center gap-2 text-dark-ticker no-underline hover:text-white"
          >
            <span className="max-w-[240px] truncate">{m.question}</span>
            <span className="font-mono font-semibold text-white">{formatChance(m.yesPrice)}</span>
            <span className={`font-mono ${toneClass[changeTone(m.change24h)]}`}>{formatChange(m.change24h)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * "LIVE ODDS" strip above the header: the seven hottest markets, scrolling continuously.
 * The list is rendered twice and the track slides left by exactly one copy, so the loop is
 * seamless. Pauses on hover and keyboard focus; stays still with reduced motion (globals.css).
 */
export async function Ticker() {
  const markets = await getHottestMarkets({ limit: 7 });

  return (
    <TickerFrame>
      {markets.length === 0 ? (
        <span className="text-dark-ticker">Odds are updating. Check back shortly.</span>
      ) : (
        <div className="ticker-track flex w-max items-center">
          <TickerItems markets={markets} />
          <TickerItems markets={markets} duplicate />
        </div>
      )}
    </TickerFrame>
  );
}
