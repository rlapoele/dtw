import { convertColor } from "@domain/color-calculation";
import type { ColorLiteralValue } from "@domain/color-literal";
import { formatHex, toGamut } from "culori/fn";

const mapPreview = toGamut("rgb", "oklch");
/** Six-digit, display-only sRGB approximation. Alpha and authored data stay separate. */
export function hexPreview(source?: ColorLiteralValue): string {
  const unavailable = (reason: string) => `sRGB HEX preview unavailable: ${reason}`;
  if (!source) return unavailable("no resolved color (unresolved or unsupported value).");
  if (source.components.includes("none") || source.alpha === "none")
    return unavailable("missing components or alpha.");
  const converted = convertColor(source, "srgb");
  if (!converted.ok) return unavailable(converted.message);
  if (converted.value.components.includes("none")) return unavailable("missing components.");
  const [r, g, b] = converted.value.components.map(Number);
  if (![r, g, b].every(Number.isFinite)) return unavailable("nonfinite conversion.");
  try {
    const rgb = { mode: "rgb" as const, r, g, b };
    const mapped = [r, g, b].every(channel => channel >= 0 && channel <= 1) ? rgb : mapPreview(rgb);
    if (!mapped || ![mapped.r, mapped.g, mapped.b].every(Number.isFinite)) return unavailable("nonfinite preview.");
    return `sRGB HEX preview: ${formatHex(mapped).toUpperCase()}`;
  } catch {
    return unavailable("calculation limit; exact authored value retained.");
  }
}
