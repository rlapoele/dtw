import { describe, expect, it } from "vitest";
import { hexPreview } from "@presentation/App/components/TokensWorkbench/components/TokenWorkspace/components/TokenTable/helpers/hex-preview";
import { createColorLiteral } from "@domain/color-literal";
const color = (colorSpace: "srgb" | "hsl" | "display-p3", components: string[], alpha = "1") => createColorLiteral({ colorSpace, components, alpha });
describe("derived sRGB HEX preview", () => {
  it("quantizes a supplemental preview without changing authored precision or alpha", () => {
    const input = color("srgb", ["0.5", "0", "1"], "0.5");
    expect(hexPreview(input)).toContain("#8000FF");
    expect(hexPreview(input)).not.toContain("#8000FF80");
    expect(input.components[0]).toBe("0.5");
    expect(input.alpha).toBe("0.5");
  });
  it("converts supported colors and keeps alpha separate", () => {
    expect(hexPreview(color("hsl", ["0", "100", "50"]))).toContain("#FF0000");
    expect(hexPreview(color("srgb", ["0", "0", "0"], "0.9999"))).toContain("#000000");
  });
  it("maps wide gamut for display without substituting missing components", () => {
    expect(hexPreview(color("display-p3", ["1", "0", "0"]))).toMatch(/#[0-9A-F]{6}$/);
    expect(hexPreview(color("srgb", ["none", "0", "0"]))).toContain("missing components");
    expect(hexPreview()).toContain("no resolved color");
  });
});
