import { convertColor, normalizedToByte } from "@domain/color-calculation";
import type { ColorLiteralValue } from "@domain/color-literal";
import { compareDecimals, decimalFromCanonical } from "@domain/decimal";

/** Supplemental quantized display only. Never clips or writes back authored data. */
export function hexPreview(source?: ColorLiteralValue): string {
  const unavailable = (reason: string) => `sRGB HEX preview unavailable: ${reason}`;
  if (!source) return unavailable("no resolved color (unresolved or unsupported value).");
  if (source.components.includes("none") || source.alpha === "none")
    return unavailable("missing components or alpha.");
  const converted = convertColor(source, "srgb");
  if (!converted.ok) return unavailable(converted.message);
  const zero = decimalFromCanonical("0"), one = decimalFromCanonical("1");
  if (converted.value.components.some(x => x === "none" || compareDecimals(x, zero) < 0 || compareDecimals(x, one) > 0))
    return unavailable("outside sRGB; no gamut clipping applied.");
  try {
    const byte = (x: string) => Math.round(Number(normalizedToByte(x).text)).toString(16).padStart(2, "0").toUpperCase();
    const hasAlpha = source.alpha !== "1";
    const hex = converted.value.components.map(byte).join("") + (hasAlpha ? byte(source.alpha) : "");
    return `sRGB HEX preview: #${hex} · RGB${hasAlpha ? " and alpha" : ""} rounded to 8-bit`;
  } catch {
    return unavailable("calculation limit; exact authored value retained.");
  }
}
