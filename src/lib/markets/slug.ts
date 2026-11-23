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
 * Kalshi tickers aren't readable, so Kalshi slugs are "<question words>--<ticker>".
 * slugify never produces "--", so the last "--" always separates the ticker.
 */
export function kalshiSlug(question: string, ticker: string): string {
  return `${slugify(question)}--${ticker.toLowerCase()}`;
}

export function tickerFromKalshiSlug(slug: string): string | null {
  const i = slug.lastIndexOf("--");
  if (i === -1) return null;
  const ticker = slug.slice(i + 2).toUpperCase();
  return /^[A-Z0-9][A-Z0-9.-]*$/.test(ticker) ? ticker : null;
}
