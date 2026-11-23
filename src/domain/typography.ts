import { compareDecimals, decimalFromCanonical } from "@domain/decimal";
import { createFontFamilyLiteral } from "@domain/font-family-literal";
import type { FontFamilyLiteralValue } from "@domain/font-family-literal";
import { createFontWeightLiteral } from "@domain/font-weight-literal";
import type { FontWeightLiteralValue } from "@domain/font-weight-literal";
import { createDimensionLiteral, createNumberLiteral } from "@domain/numeric-literals";
import type { DimensionLiteralValue, NumberLiteralValue } from "@domain/numeric-literals";
import { createTokenReference } from "@domain/token-reference";
import type { TokenReference } from "@domain/token-reference";

export const TYPOGRAPHY_FIELDS = ["fontFamily", "fontSize", "fontWeight", "letterSpacing", "lineHeight"] as const;
export type TypographyField = (typeof TYPOGRAPHY_FIELDS)[number];
export const TYPOGRAPHY_FIELD_TYPES = {
  fontFamily: "fontFamily",
  fontSize: "dimension",
  fontWeight: "fontWeight",
  letterSpacing: "dimension",
  lineHeight: "number",
} as const;

type TypographyLiteral = FontFamilyLiteralValue | FontWeightLiteralValue | DimensionLiteralValue | NumberLiteralValue;

export type TypographyValue = {
  readonly kind: "composite";
  readonly valueType: "typography";
  readonly fontFamily?: FontFamilyLiteralValue | TokenReference;
  readonly fontSize?: DimensionLiteralValue | TokenReference;
  readonly fontWeight?: FontWeightLiteralValue | TokenReference;
  readonly letterSpacing?: DimensionLiteralValue | TokenReference;
  readonly lineHeight?: NumberLiteralValue | TokenReference;
};
export type TypographyInput = Pick<TypographyValue, TypographyField>;
export type ResolvedTypographyValue = {
  readonly kind: "composite";
  readonly valueType: "typography";
  readonly fontFamily: FontFamilyLiteralValue;
  readonly fontSize: DimensionLiteralValue;
  readonly fontWeight: FontWeightLiteralValue;
  readonly letterSpacing: DimensionLiteralValue;
  readonly lineHeight: NumberLiteralValue;
};

const zero = decimalFromCanonical("0");

export function isNonNegativeTypographyValue(value: DimensionLiteralValue | NumberLiteralValue): boolean {
  return compareDecimals(value.value, zero) >= 0;
}

export function isTypographyFieldValue(
  value: unknown,
  field: TypographyField,
): value is TypographyLiteral | TokenReference {
  if (typeof value !== "object" || value === null || !("kind" in value)) return false;
  return value.kind === "token-reference" ||
    (value.kind === "literal" && "valueType" in value && value.valueType === TYPOGRAPHY_FIELD_TYPES[field]);
}

export function createTypography(input: TypographyInput): TypographyValue {
  function fields(source: object): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(source)) {
      if (![...TYPOGRAPHY_FIELDS, "kind", "valueType"].includes(key)) throw new RangeError("Unknown typography field");
    }
    for (const field of TYPOGRAPHY_FIELDS) {
      if (!Object.hasOwn(source, field)) continue;
      const value = (source as Record<string, unknown>)[field];
      if (!isTypographyFieldValue(value, field)) throw new RangeError(`Invalid ${field} field`);
      if (value.kind === "token-reference") { result[field] = createTokenReference(value); continue; }
      if (value.valueType === "fontFamily") result[field] = createFontFamilyLiteral(value.families);
      else if (value.valueType === "fontWeight") result[field] = createFontWeightLiteral(value.value);
      else { if ((field === "fontSize" || field === "lineHeight") && !isNonNegativeTypographyValue(value)) throw new RangeError("Typography size must be non-negative"); result[field] = value.valueType === "number" ? createNumberLiteral(value.value) : createDimensionLiteral(value.value,value.unit); }
    }
    return result;
  }
  return {kind:"composite", valueType:"typography", ...fields(input)} as TypographyValue;
}
