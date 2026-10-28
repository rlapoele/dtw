import { compareDecimals, decimalFromCanonical } from "./decimal";
import { createColorLiteral } from "./color-literal";
import type { ColorLiteralValue } from "./color-literal";
import { createBooleanLiteral } from "./boolean-literal";
import type { BooleanLiteralValue } from "./boolean-literal";
import { createDimensionLiteral } from "./numeric-literals";
import type { DimensionLiteralValue } from "./numeric-literals";
import { createTokenReference } from "./token-reference";
import type { TokenReference } from "./token-reference";

export const SHADOW_FIELDS = ["color", "offsetX", "offsetY", "blur", "spread", "inset"] as const;
export type ShadowField = (typeof SHADOW_FIELDS)[number];
export const SHADOW_FIELD_TYPES = {
  color: "color", offsetX: "dimension", offsetY: "dimension",
  blur: "dimension", spread: "dimension", inset: "boolean",
} as const;

export type ShadowLayer = {
  readonly color: ColorLiteralValue | TokenReference;
  readonly offsetX: DimensionLiteralValue | TokenReference;
  readonly offsetY: DimensionLiteralValue | TokenReference;
  readonly blur: DimensionLiteralValue | TokenReference;
  readonly spread: DimensionLiteralValue | TokenReference;
  readonly inset: BooleanLiteralValue | TokenReference;
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
  if (!Array.isArray(input.layers) || input.layers.length === 0) {
    throw new RangeError("A shadow requires a non-empty ordered layer stack");
  }
  // Array.from visits holes so sparse stacks cannot bypass layer validation.
  const layers = Array.from(input.layers, layer => {
    if (typeof layer !== "object" || layer === null) throw new RangeError("A shadow requires explicit layers");
    for (const field of SHADOW_FIELDS) {
      if (!isShadowFieldValue(layer[field], field)) throw new RangeError(`A shadow layer requires a correctly typed ${field} field`);
    }
    const blur = copyDimension(layer.blur);
    if (blur.kind === "literal" && !isValidShadowBlur(blur)) throw new RangeError("Shadow blur must be non-negative");
    return {
      color: layer.color.kind === "token-reference" ? createTokenReference(layer.color) : createColorLiteral(layer.color),
      offsetX: copyDimension(layer.offsetX), offsetY: copyDimension(layer.offsetY),
      blur, spread: copyDimension(layer.spread),
      inset: layer.inset.kind === "token-reference" ? createTokenReference(layer.inset) : createBooleanLiteral(layer.inset.value),
    };
  });
  return { kind: "composite", valueType: "shadow", layers: layers as [ShadowLayer, ...ShadowLayer[]] };
}

function copyDimension(value: DimensionLiteralValue | TokenReference): DimensionLiteralValue | TokenReference {
  return value.kind === "token-reference" ? createTokenReference(value) : createDimensionLiteral(value.value, value.unit);
}
