import { describe, expect, it } from "vitest";
import { hexPreview } from "@presentation/App/components/TokenWorkbench/components/TokenWorkspace/components/TokenTable/helpers/hex-preview";
import { createColorLiteral } from "@domain/color-literal";
const color = (colorSpace: "srgb" | "hsl" | "display-p3", components: string[], alpha = "1") => createColorLiteral({ colorSpace, components, alpha });
describe("derived sRGB HEX preview", () => {
  it("quantizes a supplemental preview without changing authored precision or alpha", () => {
    const input = color("srgb", ["0.5", "0", "1"], "0.5");
    expect(hexPreview(input)).toContain("#8000FF80");
    expect(hexPreview(input)).toContain("alpha rounded to 8-bit");
    expect(input.components[0]).toBe("0.5");
    expect(input.alpha).toBe("0.5");
  });
  it("converts supported colors and omits alpha only for exactly opaque source", () => {
    expect(hexPreview(color("hsl", ["0", "100", "50"]))).toContain("#FF0000");
    expect(hexPreview(color("srgb", ["0", "0", "0"], "0.9999"))).toContain("#000000FF");
  });
  it("does not clip out-of-gamut colors or substitute missing components", () => {
    expect(hexPreview(color("display-p3", ["1", "0", "0"]))).toContain("outside sRGB");
    expect(hexPreview(color("srgb", ["none", "0", "0"]))).toContain("missing components");
    expect(hexPreview()).toContain("no resolved color");
  });
});
