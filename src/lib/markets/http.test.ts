import { describe, expect, it } from "vitest";
import { retryDelayMs } from "./http";

describe("retryDelayMs", () => {
  it("honours Retry-After, capped at 5 seconds", () => {
    expect(retryDelayMs(1, "2")).toBe(2000);
    expect(retryDelayMs(1, "60")).toBe(5000);
  });

  it("backs off 0.5s, 1s, 2s without Retry-After", () => {
    expect([1, 2, 3].map((n) => retryDelayMs(n, null))).toEqual([500, 1000, 2000]);
    expect(retryDelayMs(1, "not-a-number")).toBe(500);
  });
});
