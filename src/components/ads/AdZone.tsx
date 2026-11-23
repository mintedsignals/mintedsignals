/**
 * The markup for one ad zone. THIS IS THE ONE PLACE TO MATCH TO YOUR AD NETWORK.
 *
 * Coinzilla and Blockchain-Ads don't publish their tag code; it's shown in the publisher
 * dashboard once a site is approved (checked 2026-11-17). When you have it:
 *  1. Put the network's script URL in NEXT_PUBLIC_AD_SCRIPT_URL (loaded once per page,
 *     lazily, by <AdNetworkScript />).
 *  2. Put each zone ID in NEXT_PUBLIC_AD_ZONE_<SIZE>.
 *  3. Change the element below to the container the dashboard code uses (class names and
 *     data attributes). If the network needs a per-zone inline init call, add it here
 *     with next/script (strategy "lazyOnload") so it still runs after the page loads.
 *
 * Until then this renders a neutral container carrying the zone ID.
 */
export function AdZone({
  size,
  zoneId,
  width,
  height,
}: {
  size: string;
  zoneId: string;
  width: string;
  height: number;
}) {
  return <div className="ad-zone" data-zone={zoneId} data-size={size} style={{ width, height, maxWidth: "100%" }} />;
}
