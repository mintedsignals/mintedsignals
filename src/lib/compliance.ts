/**
 * Hook for hiding platform calls to action where a venue isn't available.
 * Not built yet (see docs/BRIEF.md): every CTA shows. When geo rules are added, pass the
 * visitor's country (e.g. from Vercel's request geo headers, read outside any cached
 * function) and return false where the venue shouldn't be promoted.
 */
import type { Venue } from "./markets/types";

export function platformCtaAllowed(_venue: Venue, _country?: string | null): boolean {
  return true;
}
