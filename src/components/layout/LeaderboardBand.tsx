import { AdSlot, adSlotVisible } from "@/components/ads/AdSlot";

/**
 * Grey band under the menu holding the 728×90 leaderboard. Hidden when no ad will show,
 * and below tablet width, where a 728px banner doesn't fit (a mobile size can go here later).
 */
export function LeaderboardBand() {
  if (!adSlotVisible("728x90")) return null;

  return (
    <div className="hidden justify-center border-b border-line bg-surface px-6 py-5 md:flex">
      <AdSlot size="728x90" />
    </div>
  );
}
