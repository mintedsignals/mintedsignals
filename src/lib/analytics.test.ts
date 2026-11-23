import { describe, expect, it } from "vitest";
import { affiliateClickParams, consentDefaultsScript } from "./analytics";

describe("consentDefaultsScript", () => {
  it("denies everything by default and only ever restores analytics storage", () => {
    const script = consentDefaultsScript();
    expect(script).toContain("gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied'");
    expect(script).toContain("ad_user_data:'denied',ad_personalization:'denied'");
    expect(script).toContain(`localStorage.getItem("ms-analytics-consent")==='granted'`);
    expect(script).toContain("gtag('consent','update',{analytics_storage:'granted'})");
    expect(script).not.toMatch(/ad_storage:'granted'/);
  });

  it("runs as valid JavaScript and queues the consent default first", () => {
    const fakeWindow: { dataLayer?: unknown[][]; gtag?: unknown } = {};
    const storage = { getItem: () => "granted" };
    new Function("window", "localStorage", consentDefaultsScript().replace(/gtag\(/g, "window.gtag("))(fakeWindow, storage);
    const calls = (fakeWindow.dataLayer ?? []).map((args) => Array.from(args as ArrayLike<unknown>).slice(0, 2).join(" "));
    expect(calls).toEqual(["consent default", "set ads_data_redaction", "consent update"]);
  });
});

describe("affiliateClickParams", () => {
  it("reads the partner and market from /go links", () => {
    expect(affiliateClickParams("/go/kalshi?m=kalshi%3AKX-1&to=https%3A%2F%2Fkalshi.com%2F")).toEqual({
      partner: "kalshi",
      market_id: "kalshi:KX-1",
    });
    expect(affiliateClickParams("/go/polymarket")).toEqual({ partner: "polymarket", market_id: undefined });
  });

  it("ignores other links", () => {
    expect(affiliateClickParams("/guides/x")).toBeNull();
    expect(affiliateClickParams("https://kalshi.com/go/x")).toBeNull();
    expect(affiliateClickParams("https://mintedsignals.io/go/kalshi")).toEqual({ partner: "kalshi", market_id: undefined });
    expect(affiliateClickParams("http://localhost:3200/go/kalshi", "http://localhost:3200")?.partner).toBe("kalshi");
  });
});
