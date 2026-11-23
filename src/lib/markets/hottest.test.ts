import { describe, expect, it } from "vitest";
import type { Category } from "@/config/site";
import { selectHottest } from "./hottest";
import type { Market, Venue } from "./types";

function market(id: string, volume24h: number, extra: Partial<Market> = {}): Market {
  return {
    id,
    venue: "polymarket" as Venue,
    question: id,
    slug: id,
    category: "Politics" as Category,
    yesPrice: 0.5,
    yesOutcome: "Yes",
    change24h: null,
    volume24h,
    closeTime: null,
    url: "",
    eventId: `event-${id}`,
    isOpen: true,
    ...extra,
  };
}

const ids = (ms: Market[]) => ms.map((m) => m.id);

describe("selectHottest", () => {
  it("sorts by 24h volume and applies the limit", () => {
    const ms = [market("a", 10), market("b", 30), market("c", 20)];
    expect(ids(selectHottest(ms, { limit: 2 }))).toEqual(["b", "c"]);
  });

  it("keeps only the top market per event", () => {
    const ms = [market("a", 30, { eventId: "e1" }), market("b", 20, { eventId: "e1" }), market("c", 10)];
    expect(ids(selectHottest(ms))).toEqual(["a", "c"]);
    expect(ids(selectHottest(ms, { onePerEvent: false }))).toEqual(["a", "b", "c"]);
  });

  it("filters by venue and category, and drops closed markets", () => {
    const ms = [
      market("a", 30, { venue: "kalshi" }),
      market("b", 20, { category: "Crypto" }),
      market("c", 10),
      market("d", 99, { isOpen: false }),
    ];
    expect(ids(selectHottest(ms, { venue: "kalshi" }))).toEqual(["a"]);
    expect(ids(selectHottest(ms, { category: "Crypto" }))).toEqual(["b"]);
    expect(ids(selectHottest(ms))).toEqual(["a", "b", "c"]);
  });

  it("puts pins first in pin order, ignoring pins that are missing or filtered out", () => {
    const ms = [market("a", 30), market("b", 20), market("c", 10, { category: "Crypto" })];
    expect(ids(selectHottest(ms, { pinned: ["c", "missing", "b"] }))).toEqual(["c", "b", "a"]);
    expect(ids(selectHottest(ms, { pinned: ["c"], category: "Politics" }))).toEqual(["a", "b"]);
  });

  it("lets a pin claim its event so the event isn't repeated", () => {
    const ms = [market("a", 30, { eventId: "e1" }), market("b", 5, { eventId: "e1" })];
    expect(ids(selectHottest(ms, { pinned: ["b"] }))).toEqual(["b"]);
  });
});
