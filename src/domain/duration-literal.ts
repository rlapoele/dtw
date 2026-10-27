import { decimalFromCanonical } from "./decimal";
import type { Decimal } from "./decimal";

export const DURATION_UNITS = ["ms", "s"] as const;

export type DurationUnit = (typeof DURATION_UNITS)[number];

export type DurationLiteralValue = {
  readonly kind: "literal";
  readonly valueType: "duration";
  readonly value: Decimal;
  readonly unit: DurationUnit;
};

const durationUnitSet: ReadonlySet<string> = new Set(DURATION_UNITS);

export function createDurationLiteral(
  value: string,
  unit: string,
): DurationLiteralValue {
  if (!isDurationUnit(unit)) {
    throw new RangeError("Unsupported duration unit");
  }

  return {
    kind: "literal",
    valueType: "duration",
    value: decimalFromCanonical(value),
    unit,
  };
}

function isDurationUnit(unit: string): unit is DurationUnit {
  return durationUnitSet.has(unit);
}
