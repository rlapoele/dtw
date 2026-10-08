import { decimalFromCanonical } from "./decimal";
import type { Decimal } from "./decimal";

export type NumberLiteralValue = {
  kind: "literal";
  valueType: "number";
  value: Decimal;
};

export const DIMENSION_UNITS = ["px", "rem"] as const;

export type DimensionUnit = (typeof DIMENSION_UNITS)[number];

export type DimensionLiteralValue = {
  kind: "literal";
  valueType: "dimension";
  value: Decimal;
  unit: DimensionUnit;
};

const dimensionUnitSet: ReadonlySet<string> = new Set(DIMENSION_UNITS);

export function createNumberLiteral(value: string): NumberLiteralValue {
  return {
    kind: "literal",
    valueType: "number",
    value: decimalFromCanonical(value),
  };
}

export function createDimensionLiteral(
  value: string,
  unit: string,
): DimensionLiteralValue {
  if (!isDimensionUnit(unit)) {
    throw new RangeError("Unsupported dimension unit");
  }

  return {
    kind: "literal",
    valueType: "dimension",
    value: decimalFromCanonical(value),
    unit,
  };
}

function isDimensionUnit(unit: string): unit is DimensionUnit {
  return dimensionUnitSet.has(unit);
}
