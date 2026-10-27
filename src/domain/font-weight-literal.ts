import { compareDecimals, decimalFromCanonical } from "./decimal";
import type { Decimal } from "./decimal";

export type FontWeightLiteralValue = {
  readonly kind: "literal";
  readonly valueType: "fontWeight";
  readonly value: Decimal;
};

const minimumWeight = decimalFromCanonical("1");
const maximumWeight = decimalFromCanonical("1000");

export function createFontWeightLiteral(value: string): FontWeightLiteralValue {
  const weight = decimalFromCanonical(value);
  if (
    compareDecimals(weight, minimumWeight) < 0 ||
    compareDecimals(weight, maximumWeight) > 0
  ) {
    throw new RangeError("Font weight must be between one and one thousand");
  }

  return {
    kind: "literal",
    valueType: "fontWeight",
    value: weight,
  };
}
