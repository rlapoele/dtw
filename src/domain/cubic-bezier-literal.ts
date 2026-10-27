import { compareDecimals, decimalFromCanonical } from "./decimal";
import type { Decimal } from "./decimal";

export type CubicBezierLiteralValue = {
  readonly kind: "literal";
  readonly valueType: "cubicBezier";
  readonly controlPoints: readonly [Decimal, Decimal, Decimal, Decimal];
};

const zero = decimalFromCanonical("0");
const one = decimalFromCanonical("1");

export function createCubicBezierLiteral(
  controlPoints: readonly string[],
): CubicBezierLiteralValue {
  if (controlPoints.length !== 4) {
    throw new RangeError("A cubic Bézier literal requires exactly four coordinates");
  }

  const [x1, y1, x2, y2] = controlPoints.map(decimalFromCanonical);
  for (const x of [x1, x2]) {
    if (compareDecimals(x, zero) < 0 || compareDecimals(x, one) > 0) {
      throw new RangeError("Cubic Bézier x coordinates must be between zero and one");
    }
  }

  return {
    kind: "literal",
    valueType: "cubicBezier",
    controlPoints: [x1, y1, x2, y2],
  };
}
