import { decimalFromCanonical } from "./decimal";
import type { Decimal } from "./decimal";

export type PercentageLiteralValue = {
  readonly kind: "literal";
  readonly valueType: "percentage";
  readonly ratio: Decimal;
};

// The input is already a ratio: "0.5" represents 50%. Display-string parsing
// and use-site range restrictions belong outside this foundational literal.
export function createPercentageLiteral(ratio: string): PercentageLiteralValue {
  return {
    kind: "literal",
    valueType: "percentage",
    ratio: decimalFromCanonical(ratio),
  };
}
