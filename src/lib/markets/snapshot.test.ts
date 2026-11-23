import { describe, expect, it } from "vitest";
import { buildSnapshot, snapshotFromLastGood, type LastGood } from "./snapshot";
import type { Market } from "./types";

const m = (id: string, venue: Market["venue"]): Market => ({
  id,
  venue,
  question: id,
  slug: id,
  category: "Other",
  yesPrice: 0.5,
  yesOutcome: "Yes",
  change24h: null,
  volume24h: 1,
  closeTime: null,
  url: "",
  eventId: id,
  isOpen: true,
});

const t1 = () => new Date("2026-11-16T10:00:00Z");
const t2 = () => new Date("2026-11-16T10:01:00Z");
const fail = async (): Promise<Market[]> => {
  throw new Error("503 from gamma-api.polymarket.com");
};

describe("buildSnapshot", () => {
  it("returns fresh data from both venues and remembers it", async () => {
    const lastGood: LastGood = {};
    const { snapshot, freshVenues } = await buildSnapshot(
      { polymarket: async () => [m("p1", "polymarket")], kalshi: async () => [m("k1", "kalshi")] },
      lastGood,
      t1,
    );
    expect(freshVenues).toBe(2);
    expect(snapshot.markets.map((x) => x.id)).toEqual(["p1", "k1"]);
    expect(snapshot.venues.polymarket).toEqual({ status: "ok", fetchedAt: "2026-11-16T10:00:00.000Z" });
    expect(lastGood.kalshi?.markets.map((x) => x.id)).toEqual(["k1"]);
  });

  it("serves the last good data for a venue that fails", async () => {
    const lastGood: LastGood = {};
    await buildSnapshot(
      { polymarket: async () => [m("p1", "polymarket")], kalshi: async () => [m("k1", "kalshi")] },
      lastGood,
      t1,
    );
    const { snapshot, freshVenues } = await buildSnapshot(
      { polymarket: fail, kalshi: async () => [m("k2", "kalshi")] },
      lastGood,
      t2,
    );
    expect(freshVenues).toBe(1);
    expect(snapshot.markets.map((x) => x.id)).toEqual(["p1", "k2"]);
    expect(snapshot.venues.polymarket.status).toBe("stale");
    expect(snapshot.venues.polymarket.fetchedAt).toBe("2026-11-16T10:00:00.000Z");
    expect(snapshot.venues.polymarket.error).toMatch(/503/);
    expect(snapshot.venues.kalshi.status).toBe("ok");
  });

  it("treats an empty response as a failure instead of wiping the data", async () => {
    const lastGood: LastGood = { kalshi: { markets: [m("k1", "kalshi")], fetchedAt: "earlier" } };
    const { snapshot } = await buildSnapshot(
      { polymarket: async () => [m("p1", "polymarket")], kalshi: async () => [] },
      lastGood,
      t2,
    );
    expect(snapshot.venues.kalshi).toMatchObject({ status: "stale", error: "returned no markets" });
    expect(snapshot.markets.map((x) => x.id)).toContain("k1");
  });

  it("marks a venue unavailable when it fails and nothing was saved", async () => {
    const { snapshot, freshVenues } = await buildSnapshot({ polymarket: fail, kalshi: fail }, {}, t1);
    expect(freshVenues).toBe(0);
    expect(snapshot.markets).toEqual([]);
    expect(snapshot.venues.polymarket.status).toBe("unavailable");
    expect(snapshot.venues.kalshi.status).toBe("unavailable");
  });
});

describe("snapshotFromLastGood", () => {
  it("builds a stale snapshot from whatever was saved", () => {
    const snapshot = snapshotFromLastGood({ polymarket: { markets: [m("p1", "polymarket")], fetchedAt: "t" } }, "boom");
    expect(snapshot.markets.map((x) => x.id)).toEqual(["p1"]);
    expect(snapshot.venues.polymarket).toEqual({ status: "stale", fetchedAt: "t", error: "boom" });
    expect(snapshot.venues.kalshi.status).toBe("unavailable");
  });
});
