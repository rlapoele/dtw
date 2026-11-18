import type { IconName } from "@presentation/ui/icon";
export function typeIcon(type: string): IconName {
  if (type === "color" || type === "gradient") return "swatch";
  if (type === "dimension") return "dimension";
  if (type === "duration" || type === "transition") return "clock";
  if (["number", "percentage", "angle"].includes(type)) return "number";
  if (["fontFamily", "fontWeight", "typography", "string"].includes(type)) return "text";
  if (["shadow", "border"].includes(type)) return "stack";
  return "settings";
}

export const typeLabel = (type: string): string => ({color: "Colors", number: "Numbers", dimension: "Dimensions", percentage: "Percentages", angle: "Angles", duration: "Durations", string: "Strings", boolean: "Booleans", fontFamily: "Font families", fontWeight: "Font weights", cubicBezier: "Cubic Béziers", typography: "Typography", shadow: "Shadows", gradient: "Gradients", border: "Borders", transition: "Transitions"})[type] ?? type;
export const layerLabel = (layer: string) => layer.charAt(0).toUpperCase() + layer.slice(1);
