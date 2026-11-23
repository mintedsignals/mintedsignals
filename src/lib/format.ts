/** Display formatting for market numbers, matching the design ("64%", "+4.2", "$3.1M"). */

/** 0.64 -> "64%". Below 1% and above 99% show as "<1%" / ">99%" rather than rounding to 0 or 100. */
export function formatChance(price: number): string {
  const pct = price * 100;
  if (pct > 0 && pct < 0.5) return "<1%";
  if (pct < 100 && pct > 99.5) return ">99%";
  return `${Math.round(pct)}%`;
}

/** 24h change in percentage points: 0.042 -> "+4.2", -0.028 -> "-2.8", null -> "–". */
export function formatChange(change: number | null): string {
  if (change === null) return "–";
  const points = Math.round(change * 1000) / 10;
  if (points === 0) return "0.0";
  return `${points > 0 ? "+" : ""}${points.toFixed(1)}`;
}

export type ChangeTone = "up" | "down" | "flat";

export function changeTone(change: number | null): ChangeTone {
  if (change === null) return "flat";
  const points = Math.round(change * 1000) / 10;
  return points > 0 ? "up" : points < 0 ? "down" : "flat";
}

/** 3_100_000 -> "$3.1M", 950_000 -> "$950K", 612 -> "$612". */
export function formatVolume(usd: number): string {
  if (usd >= 1e9) return `$${trim(usd / 1e9)}B`;
  if (usd >= 1e6) return `$${trim(usd / 1e6)}M`;
  if (usd >= 1e3) return `$${Math.round(usd / 1e3)}K`;
  return `$${Math.round(usd)}`;
}

/** One decimal, dropping ".0" only for 100 and above ("$120M", "$3.1M"). */
const trim = (n: number) => (n >= 100 ? Math.round(n).toString() : (Math.round(n * 10) / 10).toFixed(1));

/** Whole-number count with separators: 1826 -> "1,826". */
export const formatCount = (n: number) => n.toLocaleString("en-US");

/** "2026-12-09T18:59:00Z" -> "Dec 9, 2026" (UTC, so server and browser agree). */
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** "2026-11-16T20:34:12Z" -> "20:34 UTC". */
export function formatTimeUtc(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC`;
}
