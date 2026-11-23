/**
 * Ad slot that reserves its exact size up front, so nothing shifts when an ad loads.
 *
 * Phase 1: reserves space and shows a labelled placeholder in development.
 * Phase 6 adds the network script (loaded lazily) and per-size zone IDs from env vars.
 * With no zone ID set, the slot renders nothing in production.
 */

export type AdSize = "728x90" | "300x250" | "300x600" | "native";

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

const isDev = process.env.NODE_ENV !== "production";

/** True when a slot of this size will render (a placeholder in dev, or a configured zone). */
export function adSlotVisible(size: AdSize): boolean {
  return isDev || Boolean(zoneId(size));
}

export function AdSlot({ size, className = "" }: { size: AdSize; className?: string }) {
  if (!adSlotVisible(size)) return null;

  const slot = SLOTS[size];
  const zone = zoneId(size);

  return (
    <div
      className={`max-w-full shrink-0 ${className}`}
      style={{ width: slot.width, height: slot.height }}
      data-ad-size={size}
      data-ad-zone={zone}
    >
      {!zone && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line-dashed bg-white">
          <span className="font-mono text-[11px] tracking-[0.1em] text-muted">ADVERTISEMENT</span>
          <span className="text-[13px] text-muted">{slot.label}</span>
          <span className="sr-only">Development placeholder. Set {slot.envVar} to enable.</span>
        </div>
      )}
    </div>
  );
}
