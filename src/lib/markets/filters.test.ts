import { describe, expect, it } from "vitest";
import { allFilterViews, filterSegments, filtersCopy, filtersHref, parseFilterSegments } from "./filters";

describe("filtersHref", () => {
  it("builds path URLs in a fixed order, omitting page 1", () => {
    expect(filtersHref({})).toBe("/markets");
    expect(filtersHref({ page: 2 })).toBe("/markets/page/2");
    expect(filtersHref({ venue: "kalshi", category: "Economy", page: 1 })).toBe("/markets/category/economy/venue/kalshi");
    expect(filtersHref({ category: "Sports", page: 3 })).toBe("/markets/category/sports/page/3");
    expect(filtersHref({ venue: "polymarket", page: 2 })).toBe("/markets/venue/polymarket/page/2");
  });
});

describe("parseFilterSegments", () => {
  it("round-trips every shape of URL", () => {
    for (const f of [
      { page: 1 },
      { page: 4 },
      { category: "Crypto" as const, page: 1 },
      { venue: "kalshi" as const, page: 2 },
      { category: "Politics" as const, venue: "polymarket" as const, page: 5 },
    ]) {
      expect(parseFilterSegments(filterSegments(f))).toEqual(f);
    }
  });

  it("rejects anything that isn't a valid view", () => {
    for (const bad of [
      ["category", "weather"],
      ["venue", "betfair"],
      ["page", "1"],
      ["page", "0"],
      ["page", "02"],
      ["page", "x"],
      ["venue", "kalshi", "category", "crypto"], // wrong order
      ["category", "crypto", "extra"],
      ["category"],
    ]) {
      expect(parseFilterSegments(bad)).toBeNull();
    }
  });
});

describe("allFilterViews", () => {
  it("lists every combination with the right number of pages", () => {
    const views = allFilterViews(({ category, venue }) => (!category && !venue ? 120 : category === "Crypto" ? 51 : 0));
    // all markets: 120 / 50 -> 3 pages
    expect(views.filter((v) => !v.category && !v.venue).map((v) => v.page)).toEqual([1, 2, 3]);
    // Crypto, any venue: 51 -> 2 pages
    expect(views.filter((v) => v.category === "Crypto" && !v.venue).map((v) => v.page)).toEqual([1, 2]);
    // empty views still get one page
    expect(views.filter((v) => v.category === "Sports" && v.venue === "kalshi")).toEqual([
      { category: "Sports", venue: "kalshi", page: 1 },
    ]);
    // (6 categories + all) x (2 venues + all) = 21 views, plus extra pages: 2 for all markets
    // and 1 for each of the three Crypto views (this fake count ignores the venue).
    expect(views.length).toBe(21 + 2 + 3);
  });
});

describe("filtersCopy", () => {
  it("gives each view a distinct heading and title", () => {
    expect(filtersCopy({ page: 1 }, 10).heading).toBe("All prediction markets");
    expect(filtersCopy({ category: "Politics", page: 1 }, 10).heading).toBe("Politics prediction markets");
    expect(filtersCopy({ venue: "kalshi", page: 1 }, 10).heading).toBe("Kalshi prediction markets");
    expect(filtersCopy({ category: "Crypto", venue: "polymarket", page: 2 }, 10).title).toBe(
      "Crypto prediction markets on Polymarket (page 2)",
    );
    expect(filtersCopy({ category: "Sports", page: 1 }, 1234).description).toContain("1,234 open sports prediction markets");
  });
});
