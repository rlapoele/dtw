import { describe, it, expect, vi } from "vitest";
import { colorPreview } from "@presentation/features/workbench/color/preview";
const alpha = "0.123456789123456789";
const c = (components: string[], colorSpace = "srgb") => ({
  colorSpace,
  components,
  alpha,
});
describe("native CSS color previews", () => {
  it.each([
    ["srgb", ["0.123456789123456789", "0.4", "0.6"], "color(srgb 0.123456789123456789 0.4 0.6"],
    ["display-p3", ["1", "0", "0"], "color(display-p3 1 0 0"],
    ["hsl", ["29.5", "100", "50"], "hsl(29.5 100% 50%"],
    ["oklab", ["0.6", "0.2", "-0.1"], "oklab(0.6 0.2 -0.1"],
    ["oklch", ["0.408", "0.256", "2.6"], "oklch(0.408 0.256 2.6"],
  ])("renders %s directly without changing exact source", (space, components, prefix) => {
    const input = c(components, space), before = JSON.stringify(input);
    expect(colorPreview(input).css).toBe(`${prefix} / ${alpha})`);
    expect(colorPreview(input).message).toContain("Browser-rendered");
    expect(JSON.stringify(input)).toBe(before);
  });
  it("leaves extended coordinates and hue interpretation to CSS, without authored clipping", () => {
    const input = c(["450", "100", "50"], "hsl");
    expect(colorPreview(input).css).toBe(`hsl(450 100% 50% / ${alpha})`);
    expect(input.components[0]).toBe("450");
    expect(colorPreview(c(["1.000000000001", "-0.1", "0"])).css)
      .toBe(`color(srgb 1.000000000001 -0.1 0 / ${alpha})`);
  });
  it.each(["srgb", "display-p3", "hsl", "oklab", "oklch"])("preserves missing components in native %s syntax", (space) => {
    const input = c(["none", "none", "none"], space);
    const css = colorPreview(input).css;
    expect(css).toBeDefined();
    expect(css).toContain("none none none");
    expect(css).not.toContain("none%");
    expect(input.components).toEqual(["none", "none", "none"]);
  });
  it("withholds unresolved and invalid entries without changing their source", () => {
    expect(colorPreview().css).toBeUndefined();
    for (const input of [c(["-", "0", "0"]), c(["1", "0", "0"], "unknown"), c(["0", "101", "50"], "hsl"), { ...c(["0", "0", "0"]), alpha: "2" }]) {
      const before = JSON.stringify(input);
      expect(colorPreview(input).css).toBeUndefined();
      expect(JSON.stringify(input)).toBe(before);
    }
  });
  it("reports unsupported browser syntax without substituting or mutating a color", () => {
    vi.stubGlobal("CSS", { supports: () => false });
    try {
      const input = c(["0.408", "0.256", "2.6"], "oklch"), before = JSON.stringify(input);
      expect(colorPreview(input)).toEqual({ message: "Unavailable: this browser cannot render this color syntax." });
      expect(JSON.stringify(input)).toBe(before);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
