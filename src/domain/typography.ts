import { compareDecimals, decimalFromCanonical } from "./decimal";
import { createFontFamilyLiteral } from "./font-family-literal";
import type { FontFamilyLiteralValue } from "./font-family-literal";
import { createFontWeightLiteral } from "./font-weight-literal";
import type { FontWeightLiteralValue } from "./font-weight-literal";
import { createDimensionLiteral, createNumberLiteral } from "./numeric-literals";
import type { DimensionLiteralValue, NumberLiteralValue } from "./numeric-literals";
import { createTokenReference } from "./token-reference";
import type { TokenReference } from "./token-reference";

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
  readonly fontFamily: FontFamilyLiteralValue | TokenReference;
  readonly fontSize: DimensionLiteralValue | TokenReference;
  readonly fontWeight: FontWeightLiteralValue | TokenReference;
  readonly letterSpacing: DimensionLiteralValue | TokenReference;
  readonly lineHeight: NumberLiteralValue | TokenReference;
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
  for (const field of TYPOGRAPHY_FIELDS) {
    if (!isTypographyFieldValue(input[field], field)) {
      throw new RangeError(`Typography requires a correctly typed ${field} field`);
    }
  }
  const fontSize = copyDimensionField(input.fontSize);
  const lineHeight = input.lineHeight.kind === "token-reference"
    ? createTokenReference(input.lineHeight) : createNumberLiteral(input.lineHeight.value);
  if (fontSize.kind === "literal" && !isNonNegativeTypographyValue(fontSize)) {
    throw new RangeError("Typography font size must be non-negative");
  }
  if (lineHeight.kind === "literal" && !isNonNegativeTypographyValue(lineHeight)) {
    throw new RangeError("Typography line height must be non-negative");
  }
  return {
    kind: "composite",
    valueType: "typography",
    fontFamily: input.fontFamily.kind === "token-reference"
      ? createTokenReference(input.fontFamily) : createFontFamilyLiteral(input.fontFamily.families),
    fontSize,
    fontWeight: input.fontWeight.kind === "token-reference"
      ? createTokenReference(input.fontWeight) : createFontWeightLiteral(input.fontWeight.value),
    letterSpacing: copyDimensionField(input.letterSpacing),
    lineHeight,
  };
}

function copyDimensionField(value: DimensionLiteralValue | TokenReference): DimensionLiteralValue | TokenReference {
  return value.kind === "token-reference" ? createTokenReference(value) : createDimensionLiteral(value.value, value.unit);
}
