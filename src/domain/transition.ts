import { compareDecimals, decimalFromCanonical } from "./decimal";
import { createDurationLiteral } from "./duration-literal";
import type { DurationLiteralValue } from "./duration-literal";
import { createCubicBezierLiteral } from "./cubic-bezier-literal";
import type { CubicBezierLiteralValue } from "./cubic-bezier-literal";
import { createTokenReference } from "./token-reference";
import type { TokenReference } from "./token-reference";

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
  readonly duration: DurationLiteralValue | TokenReference;
  readonly delay: DurationLiteralValue | TokenReference;
  readonly timingFunction: CubicBezierLiteralValue | TokenReference;
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
  for (const field of TRANSITION_FIELDS) {
    if (!isTransitionFieldValue(input[field], field)) {
      throw new RangeError(`A transition requires a correctly typed ${field} field`);
    }
  }
  const duration = copyDurationField(input.duration);
  if (duration.kind === "literal" && !isValidTransitionDuration(duration)) {
    throw new RangeError("A transition duration must be non-negative");
  }
  return {
    kind: "composite",
    valueType: "transition",
    duration,
    delay: copyDurationField(input.delay),
    timingFunction: input.timingFunction.kind === "token-reference"
      ? createTokenReference(input.timingFunction)
      : createCubicBezierLiteral(input.timingFunction.controlPoints),
  };
}

function copyDurationField(value: DurationLiteralValue | TokenReference): DurationLiteralValue | TokenReference {
  return value.kind === "token-reference"
    ? createTokenReference(value)
    : createDurationLiteral(value.value, value.unit);
}
