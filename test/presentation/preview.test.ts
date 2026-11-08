import { describe, it, expect } from "vitest";
import { colorPreview } from "@presentation/preview";
const c = (components: string[], colorSpace = "srgb") => ({
  colorSpace,
  components,
  alpha: "0.123456789123456789",
});
describe("disposable specimens", () => {
  it("checks direct sRGB gamut exactly without the converted allowance", () => {
    expect(colorPreview(c(["1.000000000001", "0", "0"])).css).toBeUndefined();
    expect(colorPreview(c(["1", "0", "0"])).css).toBeDefined();
  });
  it("previews ordinary converted boundary colors approximately", () => {
    for (const components of [
      ["0", "100", "50"],
      ["120", "100", "50"],
      ["240", "100", "50"],
      ["none", "0", "50"],
    ])
      expect(colorPreview(c(components, "hsl")).css).toBeDefined();
  });
  it("withholds missing/out-of-gamut/invalid input and preserves source", () => {
    for (const input of [
      c(["none", "0.5", "0.5"]),
      c(["1", "0", "0"], "display-p3"),
      c(["-", "0", "0"]),
    ]) {
      const before = JSON.stringify(input);
      expect(colorPreview(input).css).toBeUndefined();
      expect(JSON.stringify(input)).toBe(before);
    }
  });
});
