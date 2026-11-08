import {
  COLOR_COMPONENTS,
  type ColorComponentIdentity,
} from "@domain/color-components";
import {
  converter,
  useMode,
  modeRgb,
  modeP3,
  modeHsl,
  modeOklab,
  modeOklch,
  modeLrgb,
  modeXyz65,
} from "culori/fn";
// Register only the five supported spaces and their linear RGB / D65 route closure.
[modeRgb, modeP3, modeHsl, modeOklab, modeOklch, modeLrgb, modeXyz65].forEach(
  useMode,
);
import type { Color, Mode } from "culori";
import { createColorLiteral } from "@domain/color-literal";
import type {
  ColorLiteralInput,
  ColorLiteralValue,
  ColorSpace,
} from "@domain/color-literal";
import {
  compareDecimals,
  decimalFromCanonical,
  multiplyDecimals,
} from "@domain/decimal";

export type CalculationFailure =
  | "invalid-input"
  | "unsupported-missing-components"
  | "calculation-limit"
  | "numerical-failure"
  | "target-schema-incompatibility";
export type CalculationResult =
  | { ok: true; value: ColorLiteralValue }
  | { ok: false; reason: CalculationFailure; message: string };
const INPUT_BUDGET = 4096,
  OUTPUT_BUDGET = 4200;
function budget(text: string) {
  if (text.length > INPUT_BUDGET)
    throw new RangeError("Calculation input exceeds 4096 characters");
}
function output(text: string) {
  if (text.length > OUTPUT_BUDGET)
    throw new RangeError("Calculation output exceeds 4200 characters");
  return text;
}
function scaled(n: bigint, scale: number): string {
  if (n === 0n) return "0";
  const neg = n < 0n;
  let s = (neg ? -n : n).toString();
  if (scale < 0) {
    if (s.length - scale > OUTPUT_BUDGET)
      throw new RangeError("Calculation output budget");
    s += "0".repeat(-scale);
    scale = 0;
  }
  if (scale + 2 > OUTPUT_BUDGET)
    throw new RangeError("Calculation output budget");
  s = s.padStart(scale + 1, "0");
  const a = scale ? s.slice(0, -scale) : s,
    b = scale ? s.slice(-scale).replace(/0+$/, "") : "";
  return output((neg ? "-" : "") + a + (b ? "." + b : ""));
}
function parts(text: string) {
  const [a, b = ""] = text.split(".");
  return { n: BigInt(a + b), scale: b.length };
}
/** Round over decimal text (including shortest Number text), ties to even. */
export function roundSignificant(text: string, count = 12): string {
  const [mantissa, exponent = "0"] = text.toLowerCase().split("e");
  const p = parts(mantissa);
  let n = p.n,
    scale = p.scale - Number(exponent);
  const neg = n < 0n;
  if (neg) n = -n;
  const digits = n.toString(),
    cut = digits.length - count;
  if (cut > 0) {
    const divisor = 10n ** BigInt(cut),
      q = n / divisor,
      r = n % divisor;
    n =
      q + (r * 2n > divisor || (r * 2n === divisor && q % 2n === 1n) ? 1n : 0n);
    scale -= cut;
  }
  return scaled(neg ? -n : n, scale);
}
export function byteToNormalized(text: string): string {
  if (text === "none") return text;
  budget(text);
  decimalFromCanonical(text);
  const p = parts(text),
    negative = p.n < 0n;
  let n = negative ? -p.n : p.n,
    d = 255n * 10n ** BigInt(p.scale);
  if (n === 0n) return "0";
  let a = n,
    b = d;
  while (b) {
    const r = a % b;
    a = b;
    b = r;
  }
  n /= a;
  d /= a;
  let rest = d,
    two = 0,
    five = 0;
  while (rest % 2n === 0n) {
    two++;
    rest /= 2n;
  }
  while (rest % 5n === 0n) {
    five++;
    rest /= 5n;
  }
  if (rest === 1n) {
    const scale = Math.max(two, five);
    return scaled(
      (negative ? -1n : 1n) *
        n *
        2n ** BigInt(scale - two) *
        5n ** BigInt(scale - five),
      scale,
    );
  }
  let exponent = n.toString().length - d.toString().length;
  if (
    exponent >= 0
      ? n < d * 10n ** BigInt(exponent)
      : n * 10n ** BigInt(-exponent) < d
  )
    exponent--;
  const shift = 17 - exponent;
  if (Math.abs(shift) > OUTPUT_BUDGET)
    throw new RangeError("Calculation output budget");
  const numerator = shift >= 0 ? n * 10n ** BigInt(shift) : n,
    denominator = shift >= 0 ? d : d * 10n ** BigInt(-shift);
  let q = numerator / denominator;
  const r = numerator % denominator;
  if (r * 2n > denominator || (r * 2n === denominator && q % 2n === 1n)) q++;
  return scaled(negative ? -q : q, shift);
}
export function normalizedToByte(text: string): {
  text: string;
  approximate: boolean;
} {
  if (text === "none") return { text, approximate: false };
  budget(text);
  const exact = output(
    multiplyDecimals(decimalFromCanonical(text), decimalFromCanonical("255")),
  );
  const formatted = roundSignificant(exact);
  return { text: formatted, approximate: formatted !== exact };
}
const modes: Record<ColorSpace, Mode> = {
  srgb: "rgb",
  "display-p3": "p3",
  hsl: "hsl",
  oklab: "oklab",
  oklch: "oklch",
};
const channelKey: Record<ColorComponentIdentity, string> = {
  red: "r",
  green: "g",
  blue: "b",
  hue: "h",
  saturation: "s",
  lightness: "l",
  chroma: "c",
  a: "a",
  b: "b",
};
function coordinate(c: ColorLiteralValue, identity: ColorComponentIdentity) {
  const identities: readonly ColorComponentIdentity[] = COLOR_COMPONENTS[c.colorSpace];
  const index = identities.indexOf(identity);
  return c.components[index];
}
function neutral(c: ColorLiteralValue) {
  return c.colorSpace === "srgb" || c.colorSpace === "display-p3"
    ? coordinate(c, "red") === coordinate(c, "green") &&
      coordinate(c, "green") === coordinate(c, "blue")
    : c.colorSpace === "hsl"
      ? coordinate(c, "saturation") === "0" ||
        coordinate(c, "lightness") === "0" ||
        coordinate(c, "lightness") === "100"
      : c.colorSpace === "oklab"
        ? coordinate(c, "a") === "0" && coordinate(c, "b") === "0"
        : coordinate(c, "chroma") === "0";
}
export function rawColorCoordinates(
  source: ColorLiteralValue,
  target: ColorSpace,
):
  | { ok: true; components: (number | "none")[] }
  | Exclude<CalculationResult, { ok: true }> {
  const fail = (reason: CalculationFailure, message: string) => ({
    ok: false as const,
    reason,
    message,
  });
  const components = [...source.components];
  const s = source.colorSpace;
  if (components.includes("none")) {
    const identities = COLOR_COMPONENTS[s] as readonly ColorComponentIdentity[];
    const hue = identities.indexOf("hue");
    const power = identities.indexOf(s === "hsl" ? "saturation" : "chroma");
    const lightness = identities.indexOf("lightness");
    if (
      (s === "hsl" || s === "oklch") &&
      components[hue] === "none" &&
      components[power] === "0" &&
      components[lightness] !== "none"
    )
      components[hue] = decimalFromCanonical("0");
    else
      return fail(
        "unsupported-missing-components",
        "Conversion needs numeric components, except missing hue at exactly zero saturation or chroma.",
      );
  }
  const values: number[] = [];
  for (const text of components) {
    if (text.length > INPUT_BUDGET)
      return fail(
        "calculation-limit",
        "Calculation input exceeds 4096 characters.",
      );
    const n = Number(text);
    if (!Number.isFinite(n) || (text !== "0" && n === 0))
      return fail(
        "numerical-failure",
        "A finite nonzero Number representation is unavailable. Exact source retained.",
      );
    if (
      compareDecimals(
        decimalFromCanonical(text.startsWith("-") ? text.slice(1) : text),
        decimalFromCanonical("1000000"),
      ) > 0
    )
      return fail(
        "calculation-limit",
        "Calculation input magnitude exceeds 1000000. Exact editing remains available.",
      );
    values.push(n);
  }
  const input = {
    mode: modes[s],
    ...Object.fromEntries(
      COLOR_COMPONENTS[s].map((identity, i) => [
        channelKey[identity],
        s === "hsl" && identity !== "hue" ? values[i] / 100 : values[i],
      ]),
    ),
  } as Color;
  const converted = converter(modes[target])(input);
  if (!converted)
    return fail("numerical-failure", "Calculation produced no representation.");
  const record = converted as unknown as Record<string, unknown>;
  let result: (number | "none")[] = COLOR_COMPONENTS[target].map((identity) => {
    const x = record[channelKey[identity]];
    return typeof x === "number"
      ? target === "hsl" && identity !== "hue"
        ? x * 100
        : x
      : NaN;
  });
  if (neutral(source)) {
    const identities: readonly ColorComponentIdentity[] = COLOR_COMPONENTS[target];
    const lightness = result[identities.indexOf("lightness")];
    const rgb = result[identities.indexOf("red")];
    result = identities.map((identity) => {
      if (identity === "hue") return "none";
      if (identity === "lightness") return lightness;
      return target === "srgb" || target === "display-p3" ? rgb : 0;
    });
  }
  // Culori omits powerless hue for some approximately collapsed near-neutral results.
  // It is not an exact-neutral source; expose unavailability instead of inventing hue.
  if (result.some((x) => x !== "none" && !Number.isFinite(x)))
    return fail(
      "numerical-failure",
      "Calculated coordinates are not finite. Exact source retained.",
    );
  return { ok: true, components: result };
}
export function convertColor(
  input: ColorLiteralInput,
  target: ColorSpace,
): CalculationResult {
  let source: ColorLiteralValue;
  try {
    source = createColorLiteral(input);
  } catch (e) {
    return {
      ok: false,
      reason: "invalid-input",
      message: e instanceof Error ? e.message : "Invalid literal",
    };
  }
  if (source.colorSpace === target) return { ok: true, value: source };
  const raw = rawColorCoordinates(source, target);
  if (!raw.ok) return raw;
  let components: string[];
  try {
    components = raw.components.map((x) =>
      x === "none" ? x : roundSignificant(String(x)),
    );
  } catch {
    return {
      ok: false,
      reason: "calculation-limit",
      message: "Calculated output exceeds 4200 characters.",
    };
  }
  try {
    return {
      ok: true,
      value: createColorLiteral({
        colorSpace: target,
        components,
        alpha: source.alpha,
      }),
    };
  } catch (e) {
    const sourceInGamutRgb =
      (source.colorSpace === "srgb" || source.colorSpace === "display-p3") &&
      source.components.every(
        (x) =>
          x !== "none" &&
          compareDecimals(x, decimalFromCanonical("0")) >= 0 &&
          compareDecimals(x, decimalFromCanonical("1")) <= 0,
      );
    const reason =
      target === "hsl" && source.colorSpace === "srgb" && sourceInGamutRgb
        ? "numerical-failure"
        : "target-schema-incompatibility";
    return {
      ok: false,
      reason,
      message: `Target ${target} is unavailable: ${e instanceof Error ? e.message : "constructor refused result"}. No clamping is applied.`,
    };
  }
}
