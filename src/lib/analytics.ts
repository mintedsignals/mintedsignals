/**
 * Small, browser-only helpers around Google's gtag(). Safe to call when analytics is off:
 * they do nothing if gtag isn't on the page.
 */
import { CONSENT_STORAGE_KEY } from "@/config/analytics";

type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | null =>
  typeof window !== "undefined" && typeof (window as { gtag?: Gtag }).gtag === "function"
    ? (window as unknown as { gtag: Gtag }).gtag
    : null;

/** Send a GA4 event, e.g. trackEvent("sign_up", { method: "newsletter" }). */
export function trackEvent(name: string, params: Record<string, string | number | undefined> = {}): void {
  gtag()?.("event", name, params);
}

export type ConsentChoice = "granted" | "denied";

/** Fired on window after the visitor makes a choice in this tab. */
export const CONSENT_CHANGED_EVENT = "ms:consent-changed";

export function readConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null; // storage blocked: ask again next time
  }
}

/** Save the visitor's choice and tell Google's tag. Only analytics storage is ever granted. */
export function saveConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {}
  gtag()?.("consent", "update", { analytics_storage: choice });
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
}

/**
 * Inline script for <head>, run before Google's tag loads: Consent Mode v2 starts with
 * everything denied, then restores a choice the visitor made on an earlier visit.
 * Ad signals stay denied: the site doesn't use Google Ads.
 */
export function consentDefaultsScript(): string {
  const key = JSON.stringify(CONSENT_STORAGE_KEY);
  return [
    "window.dataLayer=window.dataLayer||[];",
    "window.gtag=function(){window.dataLayer.push(arguments);};",
    "gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});",
    "gtag('set','ads_data_redaction',true);",
    `try{if(localStorage.getItem(${key})==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`,
  ].join("");
}

/**
 * "/go/kalshi?m=kalshi:KX...&to=..." -> { partner: "kalshi", market_id: "kalshi:KX..." }.
 * Only links on our own site (`origin`) count; a /go/ path on another site is ignored.
 */
export function affiliateClickParams(
  href: string,
  origin = "https://mintedsignals.io",
): { partner: string; market_id?: string } | null {
  let url: URL;
  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }
  if (url.origin !== origin) return null;
  const match = /^\/go\/([a-z0-9-]+)\/?$/.exec(url.pathname);
  if (!match) return null;
  return { partner: match[1], market_id: url.searchParams.get("m") ?? undefined };
}
