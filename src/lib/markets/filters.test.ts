import { describe, expect, it } from "vitest";
import { filtersCopy, filtersHref, parseFilters } from "./filters";

describe("parseFilters", () => {
  it("reads category, venue and page case-insensitively", () => {
    expect(parseFilters({ category: "Politics", venue: "KALSHI", page: "3" })).toEqual({
      category: "Politics",
      venue: "kalshi",
      page: 3,
    });
  });

  it("ignores unknown or malformed values", () => {
    expect(parseFilters({ category: "weather", venue: "betfair", page: "-2" })).toEqual({
      category: undefined,
      venue: undefined,
      page: 1,
    });
    expect(parseFilters({ page: "1.5" }).page).toBe(1);
    expect(parseFilters({ category: ["crypto", "sports"] }).category).toBe("Crypto");
  });
});

describe("filtersHref", () => {
  it("builds canonical URLs in a fixed order, omitting page 1", () => {
    expect(filtersHref({})).toBe("/markets");
    expect(filtersHref({ venue: "kalshi", category: "Economy", page: 1 })).toBe("/markets?category=economy&venue=kalshi");
    expect(filtersHref({ category: "Sports", page: 2 })).toBe("/markets?category=sports&page=2");
  });

  it("round-trips through parseFilters", () => {
    const f = { category: "Crypto" as const, venue: "polymarket" as const, page: 4 };
    const query = Object.fromEntries(new URLSearchParams(filtersHref(f).split("?")[1]));
    expect(parseFilters(query)).toEqual(f);
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
