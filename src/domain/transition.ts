import { compareDecimals, decimalFromCanonical } from "@domain/decimal";
import { createDurationLiteral } from "@domain/duration-literal";
import type { DurationLiteralValue } from "@domain/duration-literal";
import { createCubicBezierLiteral } from "@domain/cubic-bezier-literal";
import type { CubicBezierLiteralValue } from "@domain/cubic-bezier-literal";
import { createTokenReference } from "@domain/token-reference";
import type { TokenReference } from "@domain/token-reference";

export const TRANSITION_FIELDS = ["duration", "delay", "timingFunction"] as const;
export type TransitionField = (typeof TRANSITION_FIELDS)[number];
export const TRANSITION_FIELD_TYPES = {
  duration: "duration",
  delay: "duration",
  timingFunction: "cubicBezier",
} as const;

export type TransitionValue = {
  readonly kind: "composite";
  readonly valueType: "transition";
  readonly duration?: DurationLiteralValue | TokenReference;
  readonly delay?: DurationLiteralValue | TokenReference;
  readonly timingFunction?: CubicBezierLiteralValue | TokenReference;
};

export type TransitionInput = Pick<TransitionValue, TransitionField>;

export type ResolvedTransitionValue = {
  readonly kind: "composite";
  readonly valueType: "transition";
  readonly duration: DurationLiteralValue;
  readonly delay: DurationLiteralValue;
  readonly timingFunction: CubicBezierLiteralValue;
};

const zero = decimalFromCanonical("0");

export function isValidTransitionDuration(value: DurationLiteralValue): boolean {
  return compareDecimals(value.value, zero) >= 0;
}

export function isTransitionFieldValue(
  value: unknown,
  field: TransitionField,
): value is DurationLiteralValue | CubicBezierLiteralValue | TokenReference {
  if (typeof value !== "object" || value === null || !("kind" in value)) return false;
  return value.kind === "token-reference" ||
    (value.kind === "literal" && "valueType" in value && value.valueType === TRANSITION_FIELD_TYPES[field]);
}

export function createTransition(input: TransitionInput): TransitionValue {
  function fields(source: object): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(source)) {
      if (![...TRANSITION_FIELDS, "kind", "valueType"].includes(key)) throw new RangeError("Unknown transition field");
    }
    for (const field of TRANSITION_FIELDS) {
      if (!Object.hasOwn(source, field)) continue;
      const value = (source as Record<string, unknown>)[field];
      if (!isTransitionFieldValue(value, field)) throw new RangeError(`Invalid ${field} field`);
      if (value.kind === "token-reference") { result[field] = createTokenReference(value); continue; }
      if (value.valueType === "cubicBezier") result[field] = createCubicBezierLiteral(value.controlPoints);
      else { if (field === "duration" && !isValidTransitionDuration(value)) throw new RangeError("Transition duration must be non-negative"); result[field] = createDurationLiteral(value.value,value.unit); }
    }
    return result;
  }
  return {kind:"composite", valueType:"transition", ...fields(input)} as TransitionValue;
}
