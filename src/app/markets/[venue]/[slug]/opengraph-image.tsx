import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/components/og/OgCard";
import { formatChance, formatChange } from "@/lib/format";
import { getMarket, isVenue, venueNames } from "@/lib/markets";

export const alt = "Live prediction market odds";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Share image for a market: the question, the current chance and the venue. */
export default async function Image({ params }: { params: Promise<{ venue: string; slug: string }> }) {
  const { venue, slug } = await params;
  const market = isVenue(venue) ? await getMarket(venue, decodeURIComponent(slug)).catch(() => null) : null;

  if (!market) {
    return new ImageResponse(<OgCard eyebrow="MARKETS" title="Live prediction market odds" />, size);
  }

  const outcome = market.yesOutcome === "Yes" ? "YES" : market.yesOutcome;
  return new ImageResponse(
    <OgCard
      eyebrow={`${venueNames[market.venue].toUpperCase()} · ${market.category.toUpperCase()}`}
      title={market.question}
      footer={
        <>
          <span style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span style={{ fontSize: 64, fontWeight: 700, color: "#0E1116" }}>{formatChance(market.yesPrice)}</span>
            <span>chance of {outcome}</span>
          </span>
          {market.change24h !== null && <span>24h: {formatChange(market.change24h)} pts</span>}
        </>
      }
    />,
    size,
  );
}
