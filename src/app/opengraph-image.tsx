import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/components/og/OgCard";
import { site } from "@/config/site";

export const alt = `${site.name}: prediction market odds, guides and analysis`;
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

/** Default share image for every page without its own. */
export default function Image() {
  return new ImageResponse(
    <OgCard eyebrow="PREDICTION MARKETS, DECODED" title="What the crowd is betting on, and what it means." />,
    size,
  );
}
