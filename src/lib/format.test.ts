import { describe, expect, it } from "vitest";
import { changeTone, formatChance, formatChange, formatCount, formatVolume } from "./format";

describe("formatChance", () => {
  it("rounds to whole percent", () => {
    expect(formatChance(0.64)).toBe("64%");
    expect(formatChance(0.415)).toBe("42%");
    expect(formatChance(0)).toBe("0%");
    expect(formatChance(1)).toBe("100%");
  });

  it("never rounds a live long shot or favourite to 0% or 100%", () => {
    expect(formatChance(0.001)).toBe("<1%");
    expect(formatChance(0.9995)).toBe(">99%");
  });
});

describe("formatChange", () => {
  it("shows percentage points with a sign", () => {
    expect(formatChange(0.042)).toBe("+4.2");
    expect(formatChange(-0.028)).toBe("-2.8");
    expect(formatChange(0.0001)).toBe("0.0");
    expect(formatChange(null)).toBe("–");
  });

  it("gives a tone that agrees with the rounded text", () => {
    expect(changeTone(0.042)).toBe("up");
    expect(changeTone(-0.028)).toBe("down");
    expect(changeTone(0.0001)).toBe("flat");
    expect(changeTone(null)).toBe("flat");
  });
});

describe("formatVolume", () => {
  it("matches the design's style", () => {
    expect(formatVolume(3_100_000)).toBe("$3.1M");
    expect(formatVolume(8_700_000)).toBe("$8.7M");
    expect(formatVolume(950_000)).toBe("$950K");
    expect(formatVolume(610_400)).toBe("$610K");
    expect(formatVolume(1_000_000)).toBe("$1.0M");
    expect(formatVolume(120_400_000)).toBe("$120M");
    expect(formatVolume(2_500_000_000)).toBe("$2.5B");
    expect(formatVolume(612.4)).toBe("$612");
  });
});

it("formats counts with separators", () => {
  expect(formatCount(1826)).toBe("1,826");
});
