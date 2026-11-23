import Script from "next/script";
import { AdZone } from "./AdZone";

/**
 * Ad slot that reserves its exact size up front, so nothing shifts when an ad loads.
 *
 * - Zone IDs come from env vars, one per size (see .env.example).
 * - No zone ID: a labelled placeholder in development, nothing at all in production.
 * - With a zone ID: a visible "Advertisement" label (its height is reserved too) and the
 *   network's zone markup from AdZone.tsx. The network script itself is loaded once per
 *   page by <AdNetworkScript />, lazily, after the page has finished loading.
 */

export type AdSize = "728x90" | "300x250" | "300x600" | "native";

const LABEL_HEIGHT = 18;

const SLOTS: Record<AdSize, { width: string; height: number; label: string; envVar: string }> = {
  "728x90": {
    width: "728px",
    height: 90,
    label: "728 × 90 leaderboard · Coinzilla / Blockchain-Ads",
    envVar: "NEXT_PUBLIC_AD_ZONE_728X90",
  },
  "300x250": { width: "300px", height: 250, label: "300 × 250", envVar: "NEXT_PUBLIC_AD_ZONE_300X250" },
  "300x600": {
    width: "300px",
    height: 600,
    label: "300 × 600 · sticky",
    envVar: "NEXT_PUBLIC_AD_ZONE_300X600",
  },
  native: { width: "100%", height: 150, label: "Native in-feed unit", envVar: "NEXT_PUBLIC_AD_ZONE_NATIVE" },
};

/** Zone IDs must be read with literal names so Next.js can inline them at build time. */
function zoneId(size: AdSize): string | undefined {
  switch (size) {
    case "728x90":
      return process.env.NEXT_PUBLIC_AD_ZONE_728X90 || undefined;
    case "300x250":
      return process.env.NEXT_PUBLIC_AD_ZONE_300X250 || undefined;
    case "300x600":
      return process.env.NEXT_PUBLIC_AD_ZONE_300X600 || undefined;
    case "native":
      return process.env.NEXT_PUBLIC_AD_ZONE_NATIVE || undefined;
  }
}

const AD_SCRIPT_URL = process.env.NEXT_PUBLIC_AD_SCRIPT_URL || undefined;
const isDev = process.env.NODE_ENV !== "production";

/** True when a slot of this size will render (a placeholder in dev, or a configured zone). */
export function adSlotVisible(size: AdSize): boolean {
  return isDev || Boolean(zoneId(size));
}

/**
 * The ad network's script, once per page, loaded when the browser is idle after the page
 * has loaded (strategy "lazyOnload"), so it never delays the main content.
 */
export function AdNetworkScript() {
  const anyZone = (Object.keys(SLOTS) as AdSize[]).some((s) => zoneId(s));
  if (!AD_SCRIPT_URL || !anyZone) return null;
  return <Script id="ad-network" src={AD_SCRIPT_URL} strategy="lazyOnload" />;
}

export function AdSlot({
  size,
  className = "",
  tone = "white",
}: {
  size: AdSize;
  className?: string;
  /** Placeholder background: white on grey bands, surface grey on white pages (as in the design). */
  tone?: "white" | "surface";
}) {
  if (!adSlotVisible(size)) return null;

  const slot = SLOTS[size];
  const zone = zoneId(size);

  if (!zone) {
    return (
      <div className={`max-w-full shrink-0 ${className}`} style={{ width: slot.width, height: slot.height }} data-ad-size={size}>
        <div
          className={`flex h-full w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line-dashed ${
            tone === "white" ? "bg-white" : "bg-surface"
          }`}
        >
          <span className="font-mono text-[11px] tracking-[0.1em] text-muted">ADVERTISEMENT</span>
          <span className="text-[13px] text-muted">{slot.label}</span>
          <span className="sr-only">Development placeholder. Set {slot.envVar} to enable.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-full shrink-0 ${className}`}
      style={{ width: slot.width, height: slot.height + LABEL_HEIGHT }}
      data-ad-size={size}
    >
      <span
        className="block font-mono text-[10px] tracking-[0.1em] text-muted"
        style={{ height: LABEL_HEIGHT, lineHeight: `${LABEL_HEIGHT}px` }}
      >
        {size === "native" ? "SPONSORED" : "ADVERTISEMENT"}
      </span>
      <div className="overflow-hidden" style={{ width: "100%", height: slot.height }}>
        <AdZone size={size} zoneId={zone} width={slot.width} height={slot.height} />
      </div>
    </div>
  );
}
