import {
  convertColor,
  rawColorCoordinates,
  roundSignificant,
} from "@domain/color-calculation";
import {
  createColorLiteral,
  type ColorLiteralValue,
  type ColorSpace,
} from "@domain/color-literal";
import { compareDecimals, decimalFromCanonical } from "@domain/decimal";

export type RampGamut = "srgb" | "display-p3";
export type RampSettings = {
  seed: ColorLiteralValue;
  targetGamut: RampGamut;
  recipe: { id: string; version: number; intensity: "retained" | "restrained" };
  seedPosition: { mode: "auto" | "manual"; label: string };
};
export type ColorRamp = RampSettings & {
  schemaVersion: 1;
  members: readonly { tokenId: string; colorOrigin: "generated" | "manual" }[];
};
export function rampLabels(count: number): string[] {
  if (!Number.isInteger(count) || count < 2 || count > 20)
    throw new RangeError("Step count must be an integer from 2 to 20.");
  return Array.from({ length: count }, (_, i) =>
    String(
      i === 0
        ? 50
        : i === count - 1
          ? 950
          : Math.round((1000 * i) / (count - 1)),
    ),
  );
}
export function exactEndpoint(c: ColorLiteralValue): 0 | 1 | undefined {
  const [a, b, d] = c.components;
  if (c.colorSpace === "srgb" || c.colorSpace === "display-p3")
    return a === b && b === d && (a === "0" || a === "1")
      ? (Number(a) as 0 | 1)
      : undefined;
  if (c.colorSpace === "hsl")
    return d === "0" ? 0 : d === "100" ? 1 : undefined;
  if (
    (c.colorSpace === "oklab" && b === "0" && d === "0") ||
    (c.colorSpace === "oklch" && b === "0")
  )
    return a === "0" ? 0 : a === "1" ? 1 : undefined;
}
function endpoint(space: ColorSpace, n: 0 | 1, alpha: string) {
  return createColorLiteral({
    colorSpace: space,
    alpha,
    components:
      space === "hsl"
        ? ["none", "0", String(n * 100)]
        : space === "oklch"
          ? [String(n), "0", "none"]
          : space === "oklab"
            ? [String(n), "0", "0"]
            : Array(3).fill(String(n)),
  });
}
export function prepareRampSeed(
  source: ColorLiteralValue,
  space: ColorSpace,
): ColorLiteralValue {
  // Validate calculation eligibility even for exact endpoint equivalents.
  const raw = rawColorCoordinates(source, space);
  if (!raw.ok) throw new RangeError(raw.message);
  if (source.colorSpace === space) return source;
  const end = exactEndpoint(source);
  if (end !== undefined) return endpoint(space, end, source.alpha);
  const converted = convertColor(source, space);
  if (!converted.ok) throw new RangeError(converted.message);
  return converted.value;
}
export function rampCoordinates(source: ColorLiteralValue) {
  const raw = rawColorCoordinates(source, "oklch");
  if (!raw.ok) throw new RangeError(raw.message);
  const end = exactEndpoint(source);
  if (end !== undefined) return [end, 0, "none"] as const;
  return raw.components as [number, number, number | "none"];
}
export function inRampGamut(
  source: ColorLiteralValue,
  gamut: RampGamut,
): boolean {
  const raw = rawColorCoordinates(source, gamut);
  if (!raw.ok) throw new RangeError(raw.message);
  if (exactEndpoint(source) !== undefined) return true;
  if (source.colorSpace === gamut)
    return source.components.every(
      (x) =>
        x !== "none" &&
        compareDecimals(x, decimalFromCanonical("0")) >= 0 &&
        compareDecimals(x, decimalFromCanonical("1")) <= 0,
    );
  return raw.components.every((x) => x !== "none" && x >= 0 && x <= 1);
}
function fitChroma(
  l: number,
  c: number,
  h: number | "none",
  alpha: string,
  gamut: RampGamut,
  ceiling: string,
  outputSpace: ColorSpace = "oklch",
): ColorLiteralValue {
  if (![l, c].every(Number.isFinite) || l < 0 || l > 1 || c < 0)
    throw new RangeError("Ramp calculation is unavailable.");
  const lightness = roundSignificant(String(l)),
    hue = h === "none" ? h : roundSignificant(String(h));
  function candidate(chroma: number) {
    const text = roundSignificant(String(chroma));
    if (
      compareDecimals(
        decimalFromCanonical(text),
        decimalFromCanonical(ceiling),
      ) > 0
    )
      return undefined;
    const value = createColorLiteral({
      colorSpace: "oklch",
      components: [lightness, text, hue],
      alpha,
    });
    const result =
      outputSpace === "oklch" ? value : prepareRampSeed(value, outputSpace);
    return inRampGamut(result, gamut) ? result : undefined;
  }
  const requested = candidate(c);
  if (requested) return requested;
  let retained = candidate(0);
  if (!retained)
    throw new RangeError("Neutral candidate does not fit the target gamut.");
  let low = 0,
    high = c,
    retainedChroma = 0;
  for (let i = 0; i < 64; i++) {
    const mid = low + (high - low) / 2;
    if (mid === low || mid === high) break;
    const trial = candidate(mid);
    if (trial) {
      low = mid;
      if (Number(roundSignificant(String(mid))) > retainedChroma) {
        retained = trial;
        retainedChroma = Number(roundSignificant(String(mid)));
      }
    } else high = mid;
  }
  if (!inRampGamut(retained, gamut))
    throw new RangeError("Final gamut validation failed.");
  return retained;
}
export function adjustedRampSeed(seed: ColorLiteralValue): ColorLiteralValue {
  const [l, c, h] = rampCoordinates(seed);
  const bounded = Math.min(1, Math.max(0, l));
  if (bounded === 0 || bounded === 1)
    return endpoint(seed.colorSpace, bounded, seed.alpha);
  return fitChroma(
    bounded,
    c,
    h,
    seed.alpha,
    "srgb",
    seed.colorSpace === "oklch"
      ? seed.components[1]
      : roundSignificant(String(c), 18),
    seed.colorSpace,
  );
}
export function autoRampPosition(
  seed: ColorLiteralValue,
  count: number,
): string {
  const [l] = rampCoordinates(seed);
  if (exactEndpoint(seed) === 1) return "50";
  if (exactEndpoint(seed) === 0) return "950";
  return rampLabels(count).reduce((best, label) =>
    Math.abs(0.97 - (0.77 * (Number(label) - 50)) / 900 - l) <
    Math.abs(0.97 - (0.77 * (Number(best) - 50)) / 900 - l)
      ? label
      : best,
  );
}
export function generateColorRamp(
  settings: RampSettings,
  count: number,
): readonly { label: string; value: ColorLiteralValue }[] {
  if (
    settings.recipe.id !== "single-seed-oklch" ||
    settings.recipe.version !== 1
  )
    throw new RangeError("Unsupported ramp recipe.");
  const labels = rampLabels(count),
    position = settings.seedPosition.label;
  if (!labels.includes(position))
    throw new RangeError("Choose a valid seed position.");
  const [l, c, h] = rampCoordinates(settings.seed),
    end = exactEndpoint(settings.seed);
  if (end === 1 && position !== "50")
    throw new RangeError(
      "White needs to start the ramp. Move the seed to 50 to generate darker steps.",
    );
  if (end === 0 && position !== "950")
    throw new RangeError(
      "Black needs to end the ramp. Move the seed to 950 to generate lighter steps.",
    );
  if (l < 0 || l > 1 || !inRampGamut(settings.seed, settings.targetGamut))
    throw new RangeError(
      "Accept a seed gamut adjustment or edit the seed before continuing.",
    );
  const anchor = Number(position),
    upper = l >= 0.97 ? (1 + l) / 2 : 0.97,
    lower = l <= 0.2 ? l / 2 : 0.2;
  const ceiling =
    settings.seed.colorSpace === "oklch"
      ? settings.seed.components[1]
      : roundSignificant(String(c), 18);
  return labels.map((label) => {
    if (label === position) return { label, value: settings.seed };
    const light = Number(label) < anchor,
      distance = light
        ? (anchor - Number(label)) / (anchor - 50)
        : (Number(label) - anchor) / (950 - anchor);
    const e = light ? 0.05 : 0.15;
    const chroma =
      c *
      (e +
        (1 - e) *
          (1 -
            (settings.recipe.intensity === "retained"
              ? distance * distance
              : distance)));
    return {
      label,
      value: fitChroma(
        l + distance * ((light ? upper : lower) - l),
        chroma,
        h,
        settings.seed.alpha,
        settings.targetGamut,
        ceiling,
      ),
    };
  });
}
export function rampPreviewKey(source: ColorLiteralValue): string {
  const adjusted = inRampGamut(source, "srgb")
    ? source
    : adjustedRampSeed(source);
  const end = exactEndpoint(adjusted),
    raw = rawColorCoordinates(adjusted, "srgb");
  if (!raw.ok) throw new RangeError(raw.message);
  const bytes = raw.components.map((channel) => {
    if (channel === "none")
      throw new RangeError("Preview comparison unavailable.");
    const value = (end ?? channel) * 255,
      floor = Math.floor(value),
      fraction = value - floor;
    return fraction > 0.5 || (fraction === 0.5 && floor % 2 !== 0)
      ? floor + 1
      : floor;
  });
  return `${bytes.join(",")}/${source.alpha}`;
}
