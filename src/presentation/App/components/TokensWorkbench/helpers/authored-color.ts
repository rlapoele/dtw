import { colorDecimalDisplay } from "@presentation/App/components/TokensWorkbench/helpers/color-decimal-display";
import {
  COLOR_COMPONENTS,
  COMPONENT_NAMES,
  componentSuffix,
  type ColorComponentIdentity,
} from "@domain/color-components";
import type { ColorLiteralValue } from "@domain/color-literal";
const compactNames: Record<ColorComponentIdentity, string> = {
  red: "R", green: "G", blue: "B", hue: "H", saturation: "S",
  lightness: "L", chroma: "C", a: "a", b: "b",
};
/** Exact by default; readable summaries opt in to approximation. */
export function authoredColorCoordinates(
  value: ColorLiteralValue,
  layout: "expanded" | "compact" = "expanded",
  approximate = false,
): string[] {
  const separator = layout === "compact" ? ": " : " ";
  return [
    ...COLOR_COMPONENTS[value.colorSpace].map((identity, index) => {
      const exact = value.components[index];
      const displayed = approximate ? colorDecimalDisplay(exact) : exact;
      const name = layout === "compact" ? compactNames[identity] : COMPONENT_NAMES[identity];
      return name + separator + displayed +
        (exact === "none" ? "" : componentSuffix(value.colorSpace, identity));
    }),
    "Alpha" + separator + (approximate ? colorDecimalDisplay(value.alpha) : value.alpha),
  ];
}
