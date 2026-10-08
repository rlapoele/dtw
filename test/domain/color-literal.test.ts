import { describe, expect, it } from "vitest";

import { createColorLiteral } from "../../src/domain/color-literal";

describe("createColorLiteral", () => {
  it.each(["srgb", "display-p3"] as const)(
    "preserves extended coordinates for %s",
    (colorSpace) => {
      expect(
        createColorLiteral({
          colorSpace,
          components: ["1.2", "-0.1", "0.5"],
          alpha: "1",
        }),
      ).toEqual({
        kind: "literal",
        valueType: "color",
        colorSpace,
        components: ["1.2", "-0.1", "0.5"],
        alpha: "1",
      });
    },
  );

  it("normalizes HSL hue modulo 360", () => {
    expect(
      createColorLiteral({
        colorSpace: "hsl",
        components: ["-30", "50", "25"],
        alpha: "1",
      }).components,
    ).toEqual(["330", "50", "25"]);
  });

  it("normalizes fractional hue without binary-floating-point rounding", () => {
    expect(
      createColorLiteral({
        colorSpace: "hsl",
        components: ["-0.5", "50", "25"],
        alpha: "1",
      }).components[0],
    ).toBe("359.5");
  });

  it("accepts signed unbounded OKLAB axes", () => {
    expect(
      createColorLiteral({
        colorSpace: "oklab",
        components: ["0.7", "1.25", "-0.75"],
        alpha: "0.5",
      }).components,
    ).toEqual(["0.7", "1.25", "-0.75"]);
  });

  it("normalizes OKLCH hue 360 to zero", () => {
    expect(
      createColorLiteral({
        colorSpace: "oklch",
        components: ["0.7", "0.2", "360"],
        alpha: "1",
      }).components,
    ).toEqual(["0.7", "0.2", "0"]);
  });

  it("preserves missing components instead of replacing them with zero", () => {
    expect(
      createColorLiteral({
        colorSpace: "hsl",
        components: ["none", "0", "100"],
        alpha: "1",
      }).components,
    ).toEqual(["none", "0", "100"]);
  });

  it.each([
    { colorSpace: "hsl", components: ["0", "100.1", "50"] },
    { colorSpace: "hsl", components: ["0", "50", "-0.1"] },
    { colorSpace: "oklab", components: ["1.1", "0", "0"] },
    { colorSpace: "oklch", components: ["0.5", "-0.1", "0"] },
  ] as const)(
    "rejects out-of-range components for $colorSpace",
    ({ colorSpace, components }) => {
      expect(() =>
        createColorLiteral({ colorSpace, components, alpha: "1" }),
      ).toThrow(RangeError);
    },
  );

  it.each(["-0.1", "1.1"])("rejects out-of-range alpha: %s", (alpha) => {
    expect(() =>
      createColorLiteral({
        colorSpace: "srgb",
        components: ["0", "0", "0"],
        alpha,
      }),
    ).toThrow(RangeError);
  });

  it("rejects non-canonical component text", () => {
    expect(() =>
      createColorLiteral({
        colorSpace: "oklch",
        components: ["0.50", "0.2", "30"],
        alpha: "1",
      }),
    ).toThrow(RangeError);
  });

  it("rejects a component array that does not contain exactly three values", () => {
    expect(() =>
      createColorLiteral({
        colorSpace: "srgb",
        components: ["0", "0"],
        alpha: "1",
      }),
    ).toThrow(RangeError);
  });

  it("rejects an unsupported color space", () => {
    expect(() =>
      createColorLiteral({
        colorSpace: "lab",
        components: ["50", "0", "0"],
        alpha: "1",
      }),
    ).toThrow(RangeError);
  });
});
