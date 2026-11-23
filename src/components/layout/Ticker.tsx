import Link from "next/link";
import { changeTone, formatChance, formatChange } from "@/lib/format";
import { getHottestMarkets } from "@/lib/markets";
import { marketPath } from "@/lib/markets/links";

const toneClass = { up: "text-dark-positive", down: "text-dark-negative", flat: "text-dark-label" };

/** The dark 40px strip; also the loading state while live odds stream in. */
export function TickerFrame({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-10 items-center overflow-hidden bg-ink text-white">
      <div className="flex items-center gap-8 whitespace-nowrap px-6 text-[13px]">
        <span className="font-mono text-[11px] tracking-[0.08em] text-dark-label">LIVE ODDS</span>
        {children}
      </div>
    </div>
  );
}

/** "LIVE ODDS" strip above the header: the seven hottest markets. */
export async function Ticker() {
  const markets = await getHottestMarkets({ limit: 7 });

  return (
    <TickerFrame>
      {markets.length === 0 && <span className="text-dark-ticker">Odds are refreshing. Check back in a minute.</span>}
      {markets.map((m) => (
        <Link
          key={m.id}
          href={marketPath(m)}
          className="flex items-center gap-2 text-dark-ticker no-underline hover:text-white"
        >
          <span className="max-w-[240px] truncate">{m.question}</span>
          <span className="font-mono font-semibold text-white">{formatChance(m.yesPrice)}</span>
          <span className={`font-mono ${toneClass[changeTone(m.change24h)]}`}>{formatChange(m.change24h)}</span>
        </Link>
      ))}
    </TickerFrame>
  );
}
