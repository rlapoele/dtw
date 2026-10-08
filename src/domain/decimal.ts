declare const decimalBrand: unique symbol;

export type Decimal = string & {
  readonly [decimalBrand]: "Decimal";
};

export type DecimalComparison = -1 | 0 | 1;

const canonicalDecimalPattern = /^-?(?:0|[1-9]\d*)(?:\.\d*[1-9])?$/;

export function decimalFromCanonical(value: string): Decimal {
  if (!canonicalDecimalPattern.test(value) || value === "-0") {
    throw new RangeError("Value is not canonical Decimal text");
  }

  return value as Decimal;
}

export function compareDecimals(
  left: Decimal,
  right: Decimal,
): DecimalComparison {
  if (left === right) {
    return 0;
  }

  const leftParts = splitDecimal(left);
  const rightParts = splitDecimal(right);

  if (leftParts.negative !== rightParts.negative) {
    return leftParts.negative ? -1 : 1;
  }

  const magnitudeComparison = compareMagnitude(leftParts, rightParts);

  return leftParts.negative
    ? invertComparison(magnitudeComparison)
    : magnitudeComparison;
}

type DecimalParts = {
  negative: boolean;
  integer: string;
  fraction: string;
};

function splitDecimal(value: Decimal): DecimalParts {
  const negative = value.startsWith("-");
  const unsignedValue = negative ? value.slice(1) : value;
  const [integer, fraction = ""] = unsignedValue.split(".");

  return { negative, integer, fraction };
}

function compareMagnitude(
  left: DecimalParts,
  right: DecimalParts,
): DecimalComparison {
  if (left.integer.length !== right.integer.length) {
    return left.integer.length < right.integer.length ? -1 : 1;
  }

  if (left.integer !== right.integer) {
    return left.integer < right.integer ? -1 : 1;
  }

  const fractionLength = Math.max(
    left.fraction.length,
    right.fraction.length,
  );
  const leftFraction = left.fraction.padEnd(fractionLength, "0");
  const rightFraction = right.fraction.padEnd(fractionLength, "0");

  if (leftFraction === rightFraction) {
    return 0;
  }

  return leftFraction < rightFraction ? -1 : 1;
}

function invertComparison(comparison: DecimalComparison): DecimalComparison {
  return comparison === 0 ? 0 : comparison === 1 ? -1 : 1;
}
