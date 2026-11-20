import type { ColorSpace } from "@domain/color-literal";
export const spaceName = (space: ColorSpace) =>
  space === "srgb" ? "sRGB" : space === "display-p3" ? "Display P3" : space.toUpperCase();
