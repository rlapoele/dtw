import { describe, it, expect } from "vitest";
import { createColorLiteral } from "../../src/domain/color-literal";
import {
  adjustedRampSeed,
  autoRampPosition,
  generateColorRamp,
  inRampGamut,
  prepareRampSeed,
  rampLabels,
  rampPreviewKey,
  type RampSettings,
} from "../../src/domain/color-ramp";
const seed = (components: string[], alpha = "1") =>
  createColorLiteral({ colorSpace: "srgb", components, alpha });
function settings(
  value = seed(["0.2", "0.4", "0.8"]),
  count = 11,
): RampSettings {
  return {
    seed: value,
    targetGamut: "srgb",
    recipe: { id: "single-seed-oklch", version: 1, intensity: "retained" },
    seedPosition: { mode: "auto", label: autoRampPosition(value, count) },
  };
}
describe("version-one color ramps", () => {
  it("keeps counts positional and preserves the exact anchor and alpha", () => {
    for (const count of [2, 6, 11, 20]) {
      const s = settings(
        seed(["0.2", "0.4", "0.8"], "0.1234567890123456789"),
        count,
      );
      const ramp = generateColorRamp(s, count);
      expect(ramp).toHaveLength(count);
      expect(ramp.find((x) => x.label === s.seedPosition.label)?.value).toEqual(
        s.seed,
      );
      expect(
        ramp.every(
          (x) => x.value.alpha === s.seed.alpha && inRampGamut(x.value, "srgb"),
        ),
      ).toBe(true);
      expect(generateColorRamp(s, count)).toEqual(ramp);
    }
    expect(rampLabels(6)).toEqual(["50", "200", "400", "600", "800", "950"]);
  });
  it("keeps #040404 neutral through preparation, generation and preview", () => {
    const dark = seed(Array(3).fill("0.0156862745098039"));
    const prepared = prepareRampSeed(dark, "oklch");
    expect(prepared.components[1]).toBe("0");
    const ramp = generateColorRamp(settings(prepared), 11);
    expect(ramp.every((x) => x.value.components[1] === "0")).toBe(true);
    for (const x of ramp) {
      const bytes = rampPreviewKey(x.value).split("/")[0].split(",");
      expect(new Set(bytes).size).toBe(1);
    }
  });
  it("prepares exact white/black endpoints without moving accepted positions", () => {
    for (const n of ["0", "1"]) {
      const c = prepareRampSeed(seed([n, n, n], "0"), "oklch"),
        s = settings(c);
      expect(s.seedPosition.label).toBe(n === "0" ? "950" : "50");
      expect(
        generateColorRamp(s, 11).every((x) => inRampGamut(x.value, "srgb")),
      ).toBe(true);
      expect(() =>
        generateColorRamp(
          { ...s, seedPosition: { mode: "manual", label: "500" } },
          11,
        ),
      ).toThrow();
    }
  });
});
it("offers explicit extended seed adjustment preserving authored space/alpha and final gamut", () => {
  for (const space of [
    "srgb",
    "display-p3",
    "hsl",
    "oklab",
    "oklch",
  ] as const) {
    const source = createColorLiteral({
      colorSpace: space,
      components:
        space === "hsl"
          ? ["30", "100", "50"]
          : space === "oklab"
            ? ["0.6", "0.4", "0.2"]
            : space === "oklch"
              ? ["0.6", "0.6", "30"]
              : ["1.2", "0.1", "0.2"],
      alpha: "0.000000000000000001",
    });
    const adjusted = adjustedRampSeed(source);
    expect(adjusted.colorSpace).toBe(space);
    expect(adjusted.alpha).toBe(source.alpha);
    expect(inRampGamut(adjusted, "srgb")).toBe(true);
  }
  for (const n of ["-1", "2"]) {
    const source = seed([n, n, n], "0"),
      adjusted = adjustedRampSeed(source);
    expect(adjusted.components).toEqual(Array(3).fill(n === "2" ? "1" : "0"));
    expect(source.components).toEqual([n, n, n]);
  }
});
it("keeps alpha exact in preview keys and applies both intensity curves deterministically", () => {
  const s = settings();
  const retained = generateColorRamp(s, 11),
    restrained = generateColorRamp(
      { ...s, recipe: { ...s.recipe, intensity: "restrained" } },
      11,
    );
  expect(retained).not.toEqual(restrained);
  expect(restrained.every((x) => inRampGamut(x.value, "srgb"))).toBe(true);
  expect(rampPreviewKey(seed(["0", "0", "0"], "0"))).not.toBe(
    rampPreviewKey(seed(["1", "1", "1"], "0")),
  );
  expect(rampPreviewKey(seed(["0", "0", "0"], "0.1"))).not.toBe(
    rampPreviewKey(seed(["0", "0", "0"], "0.100000000000000001")),
  );
});
