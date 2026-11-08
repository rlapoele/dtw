import { compareDecimals, decimalFromCanonical } from "../domain/decimal";

export type VisualRangeState = "available" | "outside" | "missing" | "invalid";

/** Visual travel is an exact interval; binary rounding cannot establish eligibility. */
export function visualRangeState(
  text: string,
  minimum: string,
  maximum: string,
): VisualRangeState {
  if (text === "none") return "missing";
  let value;
  try {
    value = decimalFromCanonical(text);
  } catch {
    return "invalid";
  }
  return compareDecimals(value, decimalFromCanonical(minimum)) >= 0 &&
    compareDecimals(value, decimalFromCanonical(maximum)) <= 0
    ? "available"
    : "outside";
}
