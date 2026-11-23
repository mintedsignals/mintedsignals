/**
 * Affiliate partners. Every outbound partner link on the site goes through /go/[partner],
 * which builds the final URL from this file, so tracking can change here in one place.
 *
 * `params` are added to every outbound URL (e.g. a referral code). Leave them empty until
 * the affiliate agreement gives you the real values: links still work, just untracked.
 */
export interface Partner {
  name: string;
  /** Where /go/[partner] sends people when no specific market is given. */
  baseUrl: string;
  /** Hosts we're allowed to redirect to for this partner (exact host or subdomain). */
  hosts: string[];
  /** Tracking parameters added to every outbound URL. */
  params: Record<string, string>;
}

export const partners = {
  polymarket: {
    name: "Polymarket",
    baseUrl: "https://polymarket.com/",
    hosts: ["polymarket.com"],
    params: {
      // [POLYMARKET TRACKING PARAMS] e.g. { ref: "..." } once the affiliate agreement is signed
    },
  },
  kalshi: {
    name: "Kalshi",
    baseUrl: "https://kalshi.com/",
    hosts: ["kalshi.com"],
    params: {
      // [KALSHI TRACKING PARAMS]
    },
  },
} satisfies Record<string, Partner>;

export type PartnerId = keyof typeof partners;

export const isPartnerId = (value: string): value is PartnerId => Object.hasOwn(partners, value);

/** Link to use in pages: /go/kalshi or /go/kalshi?m=kalshi:KXFED... for a specific market. */
export function goHref(partner: PartnerId, marketId?: string): string {
  return marketId ? `/go/${partner}?m=${encodeURIComponent(marketId)}` : `/go/${partner}`;
}
