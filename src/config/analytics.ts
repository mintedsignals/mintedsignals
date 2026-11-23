/**
 * Google Analytics 4. The Measurement ID isn't secret: it appears in every page's HTML.
 * Leave it empty to turn analytics (and the consent banner) off entirely.
 * NEXT_PUBLIC_GA_ID overrides it, e.g. to test with a different property.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-R7P79ZCN8X";

/** Where the visitor's choice is stored in their browser: "granted" or "denied". */
export const CONSENT_STORAGE_KEY = "ms-analytics-consent";

/** Event the footer's "Cookie settings" link sends to reopen the consent banner. */
export const OPEN_CONSENT_EVENT = "ms:open-consent";
