import {
  COLOR_COMPONENTS,
  COMPONENT_NAMES,
  componentSuffix,
  type ColorComponentIdentity,
} from "@domain/color-components";
import type { ColorLiteralValue, ColorSpace } from "@domain/color-literal";
export const spaceName = (space: ColorSpace) =>
  space === "srgb" ? "sRGB" : space === "display-p3" ? "Display P3" : space.toUpperCase();
const compactNames: Record<ColorComponentIdentity, string> = {
  red: "R", green: "G", blue: "B", hue: "H", saturation: "S",
  lightness: "L", chroma: "C", a: "a", b: "b",
};
/** Exact text for the list and applied inspector; no Number conversion or rounding. */
export function authoredColorCoordinates(
  value: ColorLiteralValue,
  layout: "expanded" | "compact" = "expanded",
): string[] {
  const separator = layout === "compact" ? ": " : " ";
  return [
    ...COLOR_COMPONENTS[value.colorSpace].map((identity, index) => {
      const exact = value.components[index];
      const name = layout === "compact" ? compactNames[identity] : COMPONENT_NAMES[identity];
      return name + separator + exact +
        (exact === "none" ? "" : componentSuffix(value.colorSpace, identity));
    }),
    "Alpha" + separator + value.alpha,
  ];
}
