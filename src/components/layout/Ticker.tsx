/**
 * Dark "LIVE ODDS" strip above the header.
 * Phase 1 shows the frame only; live markets are passed in from phase 3.
 */
export function Ticker() {
  return (
    <div className="flex h-10 items-center overflow-hidden bg-ink text-white">
      <div className="flex items-center gap-8 whitespace-nowrap px-6 text-[13px]">
        <span className="font-mono text-[11px] tracking-[0.08em] text-dark-label">LIVE ODDS</span>
        <span className="text-dark-ticker">[Live odds from Polymarket and Kalshi]</span>
      </div>
    </div>
  );
}
