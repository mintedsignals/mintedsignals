import { WIDGET_LIMIT } from "./widgetConfig";

/**
 * Same outer size as the widget, shown only while live data streams in on client-side
 * navigation (the prerendered HTML already contains the real list).
 */
export function HottestMarketsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading hottest markets"
      className="min-w-0 flex-[1.35_1_560px] overflow-hidden rounded-panel border border-line bg-white shadow-[0_1px_2px_rgba(14,17,22,0.04),0_12px_32px_rgba(14,17,22,0.06)]"
    >
      <div className="flex flex-col gap-3.5 border-b border-line px-5 pt-5 pb-4">
        <h2 className="font-display text-[22px] font-bold tracking-[-0.02em]">Hottest markets</h2>
        <div className="h-9 w-3/4 animate-pulse rounded-full bg-chip" />
      </div>
      <div className="hidden h-[37px] border-b border-line bg-subtle sm:block" />
      {Array.from({ length: WIDGET_LIMIT }, (_, i) => (
        <div key={i} className="flex h-[76px] flex-col justify-center gap-2 border-b border-line-soft px-5">
          <div className="h-4 w-2/3 animate-pulse rounded bg-chip" />
          <div className="h-3 w-1/4 animate-pulse rounded bg-chip" />
        </div>
      ))}
      <div className="h-[52px]" />
    </div>
  );
}
