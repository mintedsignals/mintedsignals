/**
 * Fetches the market snapshot once, before `next build`, and saves it to .data/ so every page
 * of the static build reads the same data without calling the APIs again (Next.js builds in
 * several processes, and Kalshi rate-limits repeated fetches).
 *
 * Exits with an error, failing the build and keeping the live site as it is, if a venue is
 * down or more than a quarter of the Kalshi series fail.
 *
 * Run by `pnpm build` (see package.json). Needs the react-server condition because the
 * market code is marked server-only.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { KALSHI_SERIES, POLYMARKET_MAX_MARKETS } from "@/config/markets";
import { getJson } from "@/lib/markets/http";
import { fetchKalshiMarkets } from "@/lib/markets/kalshi";
import { fetchPolymarketMarkets } from "@/lib/markets/polymarket";
import { SNAPSHOT_DIR, SNAPSHOT_FILE } from "@/lib/markets/snapshot-file";
import { buildSnapshot } from "@/lib/markets/snapshot";
import { venues } from "@/lib/markets/types";

async function main() {
  const started = Date.now();
  const { snapshot } = await buildSnapshot(
    {
      polymarket: () => fetchPolymarketMarkets(getJson, POLYMARKET_MAX_MARKETS),
      kalshi: () => fetchKalshiMarkets(getJson, KALSHI_SERIES),
    },
    {},
  );

  const failed = venues.filter((v) => snapshot.venues[v].status !== "ok");
  if (failed.length > 0) {
    console.error(`[markets] snapshot failed: ${JSON.stringify(snapshot.venues)}`);
    process.exit(1);
  }

  mkdirSync(SNAPSHOT_DIR, { recursive: true });
  writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot));
  const counts = venues.map((v) => `${v} ${snapshot.markets.filter((m) => m.venue === v).length}`).join(", ");
  console.log(`[markets] snapshot saved: ${snapshot.markets.length} markets (${counts}) in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

main().catch((error) => {
  console.error("[markets] snapshot failed", error);
  process.exit(1);
});
