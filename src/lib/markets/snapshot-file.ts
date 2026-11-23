import path from "node:path";

/** Where scripts/fetch-markets.ts saves the market snapshot for the static build. */
export const SNAPSHOT_DIR = path.join(process.cwd(), ".data");
export const SNAPSHOT_FILE = path.join(SNAPSHOT_DIR, "markets-snapshot.json");
