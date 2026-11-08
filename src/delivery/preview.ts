import { createColorLiteral } from "../domain/color-literal";
import type { ColorLiteralInput } from "../domain/color-literal";
import { compareDecimals, decimalFromCanonical } from "../domain/decimal";
import { rawColorCoordinates } from "../domain/color-calculation";
export function colorPreview(input?: ColorLiteralInput): {
  css?: string;
  message: string;
} {
  if (!input) return { message: "Unavailable: no resolved color." };
  let source;
  try {
    source = createColorLiteral(input);
  } catch {
    return {
      message: "Unavailable: finish valid exact component and alpha entries.",
    };
  }
  let values: number[];
  if (source.colorSpace === "srgb") {
    if (
      source.components.some(
        (x) =>
          x === "none" ||
          compareDecimals(x, decimalFromCanonical("0")) < 0 ||
          compareDecimals(x, decimalFromCanonical("1")) > 0,
      )
    )
      return {
        message: "Unavailable: missing or out-of-sRGB-gamut coordinates.",
      };
    values = source.components.map(Number);
  } else {
    const raw = rawColorCoordinates(source, "srgb");
    if (!raw.ok) return { message: `Unavailable: ${raw.message}` };
    if (raw.components.some((x) => x === "none" || x < -1e-10 || x > 1 + 1e-10))
      return { message: "Unavailable: converted color is outside sRGB gamut." };
    values = raw.components.map((x) => Math.max(0, Math.min(1, Number(x))));
  }
  return {
    css: `color(srgb ${values.join(" ")} / ${source.alpha})`,
    message:
      source.colorSpace === "srgb"
        ? "Illustrative sRGB specimen."
        : "Approximate sRGB specimen; display-only boundary allowance 1e-10.",
  };
}
