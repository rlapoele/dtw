import { compareDecimals, decimalFromCanonical } from "@domain/decimal";
import { createColorLiteral } from "@domain/color-literal";
import type { ColorLiteralValue } from "@domain/color-literal";
import { createBooleanLiteral } from "@domain/boolean-literal";
import type { BooleanLiteralValue } from "@domain/boolean-literal";
import { createDimensionLiteral } from "@domain/numeric-literals";
import type { DimensionLiteralValue } from "@domain/numeric-literals";
import { createTokenReference } from "@domain/token-reference";
import type { TokenReference } from "@domain/token-reference";

export const SHADOW_FIELDS = ["color", "offsetX", "offsetY", "blur", "spread", "inset"] as const;
export type ShadowField = (typeof SHADOW_FIELDS)[number];
export const SHADOW_FIELD_TYPES = {
  color: "color", offsetX: "dimension", offsetY: "dimension",
  blur: "dimension", spread: "dimension", inset: "boolean",
} as const;

export type ShadowLayer = {
  readonly color?: ColorLiteralValue | TokenReference;
  readonly offsetX?: DimensionLiteralValue | TokenReference;
  readonly offsetY?: DimensionLiteralValue | TokenReference;
  readonly blur?: DimensionLiteralValue | TokenReference;
  readonly spread?: DimensionLiteralValue | TokenReference;
  readonly inset?: BooleanLiteralValue | TokenReference;
};
export type ResolvedShadowLayer = {
  readonly color: ColorLiteralValue;
  readonly offsetX: DimensionLiteralValue;
  readonly offsetY: DimensionLiteralValue;
  readonly blur: DimensionLiteralValue;
  readonly spread: DimensionLiteralValue;
  readonly inset: BooleanLiteralValue;
};
export type ShadowInput = { readonly layers: readonly ShadowLayer[] };
export type ShadowValue = {
  readonly kind: "composite";
  readonly valueType: "shadow";
  readonly layers: readonly [ShadowLayer, ...ShadowLayer[]];
};
export type ResolvedShadowValue = {
  readonly kind: "composite";
  readonly valueType: "shadow";
  readonly layers: readonly [ResolvedShadowLayer, ...ResolvedShadowLayer[]];
};

const zero = decimalFromCanonical("0");
export function isValidShadowBlur(value: DimensionLiteralValue): boolean {
  return compareDecimals(value.value, zero) >= 0;
}
export function isShadowFieldValue(value: unknown, field: ShadowField): value is ColorLiteralValue | DimensionLiteralValue | BooleanLiteralValue | TokenReference {
  if (typeof value !== "object" || value === null || !("kind" in value)) return false;
  return value.kind === "token-reference" ||
    (value.kind === "literal" && "valueType" in value && value.valueType === SHADOW_FIELD_TYPES[field]);
}

export function createShadow(input: ShadowInput): ShadowValue {
  function fields(source: object): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(source)) {
      if (!(SHADOW_FIELDS as readonly string[]).includes(key)) throw new RangeError("Unknown shadow field");
    }
    for (const field of SHADOW_FIELDS) {
      if (!Object.hasOwn(source, field)) continue;
      const value = (source as Record<string, unknown>)[field];
      if (!isShadowFieldValue(value, field)) throw new RangeError(`Invalid ${field} field`);
      if (value.kind === "token-reference") { result[field] = createTokenReference(value); continue; }
      if (value.valueType === "color") result[field] = createColorLiteral(value);
      else if (value.valueType === "boolean") result[field] = createBooleanLiteral(value.value);
      else { if (field === "blur" && !isValidShadowBlur(value)) throw new RangeError("Shadow blur must be non-negative"); result[field] = createDimensionLiteral(value.value, value.unit); }
    }
    return result;
  }
  if (!Array.isArray(input.layers) || !input.layers.length) throw new RangeError("A shadow requires a non-empty layer stack");
  const layers = Array.from(input.layers, layer => { if (!layer || typeof layer !== "object") throw new RangeError("Invalid shadow layer"); return fields(layer) as ShadowLayer; });
  return { kind: "composite", valueType: "shadow", layers: layers as [ShadowLayer, ...ShadowLayer[]] };
}
