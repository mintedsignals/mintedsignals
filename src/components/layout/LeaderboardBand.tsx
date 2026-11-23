import { AdSlot, adSlotVisible } from "@/components/ads/AdSlot";

/** Grey band under the menu holding the 728×90 leaderboard. Hidden when no ad will show. */
export function LeaderboardBand() {
  if (!adSlotVisible("728x90")) return null;

  return (
    <div className="flex justify-center border-b border-line bg-surface px-6 py-5">
      <AdSlot size="728x90" />
    </div>
  );
}
