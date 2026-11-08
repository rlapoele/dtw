import { describe, it, expect } from "vitest";
import fixtures from "@tests/domain/color-reference-fixtures.json";
import { createColorLiteral } from "@domain/color-literal";
import type { ColorSpace } from "@domain/color-literal";
import {
  convertColor,
  rawColorCoordinates,
  roundSignificant,
} from "@domain/color-calculation";
// Independent CSS Color 4 high-precision references, copied unchanged from the
// frozen 003-numerical-feasibility/reference.json (see its README for equations).
// Reference near-neutral hue is intentionally not an accuracy oracle.
describe("independent 180-case CSS reference corpus", () => {
  for (const f of fixtures)
    it(f.id, () => {
      const input = createColorLiteral({
        colorSpace: f.space,
        components: f.input,
        alpha: "0.123456789123456789123456789",
      });
      const result = convertColor(input, f.target as ColorSpace);
      const expectedSourceNeutral =
        f.space === "srgb" || f.space === "display-p3"
          ? f.input[0] === f.input[1] && f.input[1] === f.input[2]
          : f.space === "hsl"
            ? f.input[1] === "0" || f.input[2] === "0" || f.input[2] === "100"
            : f.space === "oklab"
              ? f.input[1] === "0" && f.input[2] === "0"
              : f.input[1] === "0";
      const targetInvalid =
        f.target === "hsl" &&
        !expectedSourceNeutral &&
        f.expected.slice(1).some((x) => Number(x) < 0 || Number(x) > 100);
      const knownTiny =
        f.space === "srgb" &&
        f.input[0] === "0.000000000000001" &&
        f.input[1] === "0" &&
        f.input[2] === "0" &&
        f.target === "hsl";
      if (targetInvalid) {
        expect(result).toMatchObject({
          ok: false,
          reason: "target-schema-incompatibility",
        });
        return;
      }
      if (knownTiny) {
        expect(result).toMatchObject({
          ok: false,
          reason: "numerical-failure",
        });
        return;
      }
      expect(result.ok, result.ok ? "" : result.message).toBe(true);
      if (!result.ok) return;
      expect(result.value.alpha).toBe(input.alpha);
      const rgb = rawColorCoordinates(result.value, "srgb");
      expect(rgb.ok).toBe(true);
      if (rgb.ok)
        rgb.components.forEach((x, i) => {
          expect(Number.isFinite(Number(x))).toBe(true);
          expect(Math.abs(Number(x) - Number(f.expectedSrgb[i]))).toBeLessThan(
            1e-8,
          );
        });
      if (f.target === "oklab")
        result.value.components.forEach((x, i) =>
          expect(Math.abs(Number(x) - Number(f.expected[i]))).toBeLessThan(
            1e-8,
          ),
        );
      if (f.target === "oklch" && Number(f.expected[1]) >= 1e-4) {
        const actual = Number(result.value.components[2]),
          expected = Number(f.expected[2]);
        expect(
          Math.min(
            Math.abs(actual - expected),
            360 - Math.abs(actual - expected),
          ),
        ).toBeLessThan(1e-5);
      }
    });
  it("bounds 100 deliberately calculated round trips separately from passive browsing", () => {
    let c = createColorLiteral({
      colorSpace: "srgb",
      components: ["0.2", "0.4", "0.6"],
      alpha: "1",
    });
    for (let i = 0; i < 100; i++) {
      for (const target of ["oklch", "srgb"] as const) {
        const r = convertColor(c, target);
        expect(r.ok).toBe(true);
        if (r.ok) c = r.value;
      }
    }
    c.components.forEach((x, i) =>
      expect(Math.abs(Number(x) - [0.2, 0.4, 0.6][i])).toBeLessThan(1e-6),
    );
  });
  it("uses exact decimal rounding on both sides of half-even ties and exponent expansion", () => {
    for (const [input, n, output] of [
      ["9.995", 3, "10"],
      ["-1.245", 3, "-1.24"],
      ["0.0000000000001", 12, "0.0000000000001"],
      ["1e-320", 12, "0." + "0".repeat(319) + "1"],
      ["-0", 12, "0"],
    ] as const)
      expect(roundSignificant(input, n)).toBe(output);
  });
});

// Independently fixed CSS fixtures exercise both adapter directions for every
// space with distinct coordinates, including HSL percentages and Lab axes.
describe("component-identity adapter order", () => {
  for (const fixture of fixtures.filter((f) => f.id.includes("-0-"))) {
    it(fixture.id, () => {
      const result = convertColor(createColorLiteral({ colorSpace: fixture.space, components: fixture.input, alpha: "0.37" }), fixture.target as ColorSpace);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      fixture.expected.forEach((expected, index) => {
        expect(Math.abs(Number(result.value.components[index]) - Number(expected))).toBeLessThan(1e-7);
      });
      expect(result.value.alpha).toBe("0.37");
    });
  }
});
