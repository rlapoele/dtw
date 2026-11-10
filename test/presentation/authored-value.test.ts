import { describe, expect, it } from "vitest";
import { authoredColorCoordinates } from "@presentation/features/workbench/color/authored-color";
import { createColorLiteral } from "@domain/color-literal";

describe("readable authored coordinates", () => {
  const cases = [
    ["srgb", ["-0.2", "0.4", "1.234567890123456789"], ["Red -0.2", "Green 0.4", "Blue 1.234567890123456789"]],
    ["display-p3", ["0.1", "0.3", "0.7"], ["Red 0.1", "Green 0.3", "Blue 0.7"]],
    ["hsl", ["37", "42", "63"], ["Hue 37°", "Saturation 42%", "Lightness 63%"]],
    ["oklab", ["0.6", "-0.2", "0.3"], ["Lightness 0.6", "a -0.2", "b 0.3"]],
    ["oklch", ["0.7", "0.2", "39"], ["Lightness 0.7", "Chroma 0.2", "Hue 39°"]],
  ] as const;
  it.each(cases)("renders exact named %s values in order with separate Alpha", (colorSpace, components, expected) => {
    const html = authoredColorCoordinates(createColorLiteral({ colorSpace, components, alpha: "0.1234567890123456789" })).join(" · ");
    let position = -1;
    for (const text of [...expected, "Alpha 0.1234567890123456789"]) {
      expect(html).toContain(text);
      expect(html.indexOf(text)).toBeGreaterThan(position);
      position = html.indexOf(text);
    }
  });
  it("shows none without units", () => {
    const html = authoredColorCoordinates(createColorLiteral({ colorSpace: "hsl", components: ["none", "none", "none"], alpha: "1" })).join(" · ");
    expect(html).toContain("Hue none"); expect(html).not.toContain("none°"); expect(html).not.toContain("none%");
  });
});

describe("compact authored coordinates", () => {
  it.each([
    ["srgb", ["-0.2", "0.4", "1.234567890123456789"], ["R: -0.2", "G: 0.4", "B: 1.234567890123456789", "Alpha: 0.37"]],
    ["display-p3", ["0.1", "0.3", "0.7"], ["R: 0.1", "G: 0.3", "B: 0.7", "Alpha: 0.37"]],
    ["hsl", ["none", "42", "63"], ["H: none", "S: 42%", "L: 63%", "Alpha: 0.37"]],
    ["oklab", ["0.6", "-0.2", "0.3"], ["L: 0.6", "a: -0.2", "b: 0.3", "Alpha: 0.37"]],
    ["oklch", ["0.7", "0.2", "39"], ["L: 0.7", "C: 0.2", "H: 39°", "Alpha: 0.37"]],
  ] as const)("preserves exact %s pairs and semantic order", (colorSpace, components, expected) => {
    expect(authoredColorCoordinates(createColorLiteral({ colorSpace, components, alpha: "0.37" }), "compact")).toEqual(expected);
  });
});
