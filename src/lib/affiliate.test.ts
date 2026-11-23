import { describe, expect, it } from "vitest";
import { goHref, isPartnerId, type Partner } from "@/config/partners";
import { buildPartnerUrl, isPartnerUrl, parseMarketId } from "./affiliate";

const partner: Partner = {
  name: "Kalshi",
  baseUrl: "https://kalshi.com/",
  hosts: ["kalshi.com"],
  params: { ref: "oddsboard", empty: "" },
};

describe("buildPartnerUrl", () => {
  it("uses the market's page and adds tracking params", () => {
    expect(buildPartnerUrl(partner, "https://kalshi.com/markets/kxfeddecision").toString()).toBe(
      "https://kalshi.com/markets/kxfeddecision?ref=oddsboard",
    );
  });

  it("falls back to the base URL without a market", () => {
    expect(buildPartnerUrl(partner).toString()).toBe("https://kalshi.com/?ref=oddsboard");
    expect(buildPartnerUrl(partner, null).toString()).toBe("https://kalshi.com/?ref=oddsboard");
  });

  it("never redirects off the partner's domain", () => {
    expect(buildPartnerUrl(partner, "https://evil.example/kalshi.com").hostname).toBe("kalshi.com");
    expect(buildPartnerUrl(partner, "https://kalshi.com.evil.example/").hostname).toBe("kalshi.com");
    expect(buildPartnerUrl(partner, "http://kalshi.com/markets/x").protocol).toBe("https:");
    expect(buildPartnerUrl(partner, "not a url").toString()).toBe("https://kalshi.com/?ref=oddsboard");
  });

  it("allows subdomains of the partner", () => {
    expect(isPartnerUrl(partner, new URL("https://app.kalshi.com/x"))).toBe(true);
  });

  it("skips empty params and keeps existing query strings", () => {
    const url = buildPartnerUrl(partner, "https://kalshi.com/markets/x?tab=rules");
    expect(url.searchParams.get("tab")).toBe("rules");
    expect(url.searchParams.has("empty")).toBe(false);
  });
});

describe("parseMarketId", () => {
  it("accepts our market id format", () => {
    expect(parseMarketId("polymarket:561994")).toEqual({ venue: "polymarket", nativeId: "561994" });
    expect(parseMarketId("kalshi:KXBTCD-26NOV1617-T95999.99")).toEqual({
      venue: "kalshi",
      nativeId: "KXBTCD-26NOV1617-T95999.99",
    });
  });

  it("rejects anything else", () => {
    for (const bad of [null, "", "561994", "kalshi:", "kalshi:a/b", "https://x.y", "x".repeat(200)]) {
      expect(parseMarketId(bad)).toBeNull();
    }
  });
});

describe("goHref", () => {
  it("builds /go links, encoding the market id", () => {
    expect(goHref("kalshi")).toBe("/go/kalshi");
    expect(goHref("polymarket", "polymarket:561994")).toBe("/go/polymarket?m=polymarket%3A561994");
  });

  it("knows its partners", () => {
    expect(isPartnerId("kalshi")).toBe(true);
    expect(isPartnerId("toString")).toBe(false);
  });
});
