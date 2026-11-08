import { describe, expect, it } from "vitest";
import { visualRangeState } from "../../src/delivery/visual-range";

// These exact coordinates collapse onto a binary Number endpoint. The range
// must be withheld rather than displaying a thumb for that different value.
const intervals = [
  {
    name: "RGB / P3 / lightness / alpha",
    min: "0",
    max: "1",
    below: "-0." + "0".repeat(400) + "1",
    above: "1.0000000000000000000000001",
  },
  {
    name: "byte RGB",
    min: "0",
    max: "255",
    below: "-0." + "0".repeat(400) + "1",
    above: "255.0000000000000000000000001",
  },
  {
    name: "hue",
    min: "0",
    max: "359.9",
    below: "-0." + "0".repeat(400) + "1",
    above: "359.9000000000000000000000001",
  },
  {
    name: "HSL saturation / lightness",
    min: "0",
    max: "100",
    below: "-0." + "0".repeat(400) + "1",
    above: "100.0000000000000000000000001",
  },
  {
    name: "OKLab axes",
    min: "-0.4",
    max: "0.4",
    below: "-0.4000000000000000000000001",
    above: "0.4000000000000000000000001",
  },
  {
    name: "OKLCH chroma",
    min: "0",
    max: "0.4",
    below: "-0." + "0".repeat(400) + "1",
    above: "0.4000000000000000000000001",
  },
];

describe("exact visual interval eligibility", () => {
  for (const range of intervals) {
    it(`${range.name}: keeps legitimate endpoints and withholds exact outside values`, () => {
      expect(Number(range.above)).toBe(Number(range.max));
      expect(Number(range.below) === Number(range.min)).toBe(true);
      expect(visualRangeState(range.min, range.min, range.max)).toBe(
        "available",
      );
      expect(visualRangeState(range.max, range.min, range.max)).toBe(
        "available",
      );
      expect(visualRangeState(range.above, range.min, range.max)).toBe(
        "outside",
      );
      expect(visualRangeState(range.below, range.min, range.max)).toBe(
        "outside",
      );
    });
  }
  it("distinguishes missing/incomplete values from numeric outside values without rewriting text", () => {
    expect(visualRangeState("none", "0", "1")).toBe("missing");
    for (const input of ["", "-", "1.0", "1e0", "-0"]) {
      expect(visualRangeState(input, "0", "1")).toBe("invalid");
    }
    expect(visualRangeState("9".repeat(500), "0", "1")).toBe("outside");
    expect(visualRangeState("0.9999999999999999999999999", "0", "1")).toBe(
      "available",
    );
  });
});
