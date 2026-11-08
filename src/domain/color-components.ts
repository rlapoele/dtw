/** Closed semantic identities, in canonical tuple order. No library channel keys. */
export const COLOR_COMPONENTS = {
  srgb: ["red", "green", "blue"],
  "display-p3": ["red", "green", "blue"],
  hsl: ["hue", "saturation", "lightness"],
  oklab: ["lightness", "a", "b"],
  oklch: ["lightness", "chroma", "hue"],
} as const;
export type ColorComponentIdentity =
  (typeof COLOR_COMPONENTS)[keyof typeof COLOR_COMPONENTS][number];
export const COMPONENT_NAMES: Record<ColorComponentIdentity, string> = {
  red: "Red",
  green: "Green",
  blue: "Blue",
  hue: "Hue",
  saturation: "Saturation",
  lightness: "Lightness",
  chroma: "Chroma",
  a: "a",
  b: "b",
};
export function componentSuffix(
  space: keyof typeof COLOR_COMPONENTS,
  identity: ColorComponentIdentity,
): string {
  if (identity === "hue") return "°";
  return space === "hsl" && (identity === "saturation" || identity === "lightness")
    ? "%"
    : "";
}
