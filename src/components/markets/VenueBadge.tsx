import { venueNames, type Venue } from "@/lib/markets/types";

const styles: Record<Venue, string> = {
  polymarket: "bg-polymarket-bg text-polymarket-fg",
  kalshi: "bg-kalshi-bg text-kalshi-fg",
};

export function VenueBadge({ venue }: { venue: Venue }) {
  return (
    <span className={`rounded-[5px] px-[7px] py-0.5 text-xs font-semibold ${styles[venue]}`}>
      {venueNames[venue]}
    </span>
  );
}
