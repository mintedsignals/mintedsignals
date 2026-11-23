import type { Partner } from "@/config/partners";

/** True if `url` is on one of the partner's hosts (or a subdomain), over https. */
export function isPartnerUrl(partner: Partner, url: URL): boolean {
  if (url.protocol !== "https:") return false;
  return partner.hosts.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`));
}

/**
 * The outbound URL for a /go click: the market's page on the partner's site if we know it
 * and it's on the partner's domain, otherwise the partner's base URL; plus tracking params.
 */
export function buildPartnerUrl(partner: Partner, marketUrl?: string | null): URL {
  let target = new URL(partner.baseUrl);
  if (marketUrl) {
    try {
      const candidate = new URL(marketUrl);
      if (isPartnerUrl(partner, candidate)) target = candidate;
    } catch {
      // not a valid URL: keep the base URL
    }
  }
  for (const [key, value] of Object.entries(partner.params)) {
    if (value) target.searchParams.set(key, value);
  }
  return target;
}

/** Market ids look like "polymarket:561994" or "kalshi:KXFED-26DEC-H0". */
export function parseMarketId(value: string | null): { venue: string; nativeId: string } | null {
  if (!value || value.length > 120) return null;
  const match = /^([a-z]+):([A-Za-z0-9.-]+)$/.exec(value);
  return match ? { venue: match[1], nativeId: match[2] } : null;
}

export interface ClickEvent {
  partner: string;
  marketId: string | null;
  /** Path of the page the click came from, if the browser sent a same-site referrer. */
  from: string | null;
  at: string;
}

/**
 * Records a click. For now this writes one JSON line to the server log; swap in a real
 * store (analytics, database) here later. No IP addresses or other personal data.
 */
export function logClick(event: ClickEvent): void {
  console.info(JSON.stringify({ type: "affiliate_click", ...event }));
}
