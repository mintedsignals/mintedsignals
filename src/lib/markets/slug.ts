/** "Will Bitcoin hit $100k?" -> "will-bitcoin-hit-100k" */
export function slugify(text: string, maxLength = 80): string {
  const slug = text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length <= maxLength) return slug;
  return slug.slice(0, maxLength).replace(/-[^-]*$/, ""); // cut at a word boundary
}

/**
 * Our market URL slugs are "<question words>--<venue id>" for both venues. Venue slugs and
 * tickers aren't reliably readable (Polymarket reuses slugs like "will-candidate-a-be-...",
 * Kalshi tickers are codes), and the question is what people search for.
 * slugify never produces "--", so the last "--" always separates the id.
 */
export function marketSlug(question: string, venueId: string): string {
  return `${slugify(question)}--${venueId.toLowerCase()}`;
}

/** The venue id part of a market slug, lowercase as it appears in the URL. */
function idPart(slug: string): string | null {
  const i = slug.lastIndexOf("--");
  return i === -1 ? null : slug.slice(i + 2);
}

/** Kalshi ticker from our slug ("...--kxfeddecision-26dec-h0" -> "KXFEDDECISION-26DEC-H0"). */
export function tickerFromKalshiSlug(slug: string): string | null {
  const ticker = idPart(slug)?.toUpperCase();
  return ticker && /^[A-Z0-9][A-Z0-9.-]*$/.test(ticker) ? ticker : null;
}

/** Polymarket market id from our slug ("...--561994" -> "561994"). */
export function idFromPolymarketSlug(slug: string): string | null {
  const id = idPart(slug);
  return id && /^\d+$/.test(id) ? id : null;
}
