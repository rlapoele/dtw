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
/** Decimal display rounding only: nearest, ties away from zero, no Number conversion. */
function rowDecimal(value: string): string {
  if (value === "none") return value;
  const negative = value.startsWith("-");
  const [integer, fraction = ""] = (negative ? value.slice(1) : value).split(".");
  if (fraction.length <= 4) return value;
  let units = BigInt(integer + fraction.slice(0, 4));
  if (fraction[4] >= "5") units += 1n;
  if (units === 0n) return "0";
  const digits = units.toString().padStart(5, "0");
  const tail = digits.slice(-4).replace(/0+$/, "");
  return (negative ? "-" : "") + digits.slice(0, -4) + (tail ? "." + tail : "");
}
/** Exact by default; only row consumers opt in to approximation. */
export function authoredColorCoordinates(
  value: ColorLiteralValue,
  layout: "expanded" | "compact" = "expanded",
  approximate = false,
): string[] {
  const separator = layout === "compact" ? ": " : " ";
  return [
    ...COLOR_COMPONENTS[value.colorSpace].map((identity, index) => {
      const exact = value.components[index];
      const displayed = approximate ? rowDecimal(exact) : exact;
      const name = layout === "compact" ? compactNames[identity] : COMPONENT_NAMES[identity];
      return name + separator + displayed +
        (exact === "none" ? "" : componentSuffix(value.colorSpace, identity));
    }),
    "Alpha" + separator + (approximate ? rowDecimal(value.alpha) : value.alpha),
  ];
}
