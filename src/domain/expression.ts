import { addDecimals, subtractDecimals, multiplyDecimals, compareDecimals, decimalFromCanonical } from "./decimal";
import type { Decimal } from "./decimal";
import { createNumberLiteral, createDimensionLiteral } from "./numeric-literals";
import type { DimensionLiteralValue } from "./numeric-literals";
import type { ImplementedLiteralValue } from "./token";
import type { TokenReference } from "./token-reference";

export const PORTABLE_OPERATION_IDS = [
  "portable.math.add.v1", "portable.math.subtract.v1", "portable.math.scale.v1",
  "portable.math.min.v1", "portable.math.max.v1", "portable.math.clamp.v1",
] as const;
export type PortableOperationId = (typeof PORTABLE_OPERATION_IDS)[number];
export const EVALUATION_CONTEXT_KEYS = ["font.rootSize"] as const;
export type EvaluationContextKey = (typeof EVALUATION_CONTEXT_KEYS)[number];
export type ContextReference = {
  readonly kind: "context-reference";
  readonly key: EvaluationContextKey;
};
export type ExpressionOperand = ImplementedLiteralValue | TokenReference | ExpressionValue | ContextReference;
export type ExpressionValue = {
  [Operation in PortableOperationId]: {
    readonly kind: "expression";
    readonly operation: Operation;
    readonly operands: Operation extends "portable.math.clamp.v1"
      ? readonly [ExpressionOperand, ExpressionOperand, ExpressionOperand]
      : readonly [ExpressionOperand, ExpressionOperand];
  };
}[PortableOperationId];
export type EvaluationContext = {
  readonly "font.rootSize"?: DimensionLiteralValue;
};
export type ExpressionFailure = {
  readonly status: "unresolved";
  readonly reason: "invalid-expression" | "unsupported-expression" | "context-required";
  readonly code: "invalid-arity" | "invalid-operands" | "invalid-clamp-range" | "invalid-context" | "unknown-operation" | "context-required";
  readonly requiredContext?: readonly EvaluationContextKey[];
};
export type ExpressionEvaluationResult =
  | { readonly status: "evaluated"; readonly value: ImplementedLiteralValue }
  | ExpressionFailure;

const operationIds: ReadonlySet<string> = new Set(PORTABLE_OPERATION_IDS);
const zero = decimalFromCanonical("0");

export function isPortableOperationId(operation: string): operation is PortableOperationId {
  return operationIds.has(operation);
}

export function createExpression(input: {
  readonly operation: string;
  readonly operands: readonly ExpressionOperand[];
}): ExpressionValue {
  if (!isPortableOperationId(input.operation)) throw new RangeError("Unsupported expression operation");
  if (input.operands.length !== operationArity(input.operation)) throw new RangeError("Invalid expression arity");
  if (input.operation === "portable.math.clamp.v1") {
    return { kind: "expression", operation: input.operation, operands: [input.operands[0], input.operands[1], input.operands[2]] };
  }
  return { kind: "expression", operation: input.operation, operands: [input.operands[0], input.operands[1]] };
}

export function operationArity(operation: PortableOperationId): number {
  return operation === "portable.math.clamp.v1" ? 3 : 2;
}

export function readRootFontSize(context: EvaluationContext): DimensionLiteralValue | ExpressionFailure {
  const root = context["font.rootSize"];
  if (root === undefined) return { status: "unresolved", reason: "context-required", code: "context-required", requiredContext: ["font.rootSize"] };
  if (root.unit !== "px" || compareDecimals(root.value, zero) < 0) {
    return { status: "unresolved", reason: "invalid-expression", code: "invalid-context" };
  }
  return root;
}

// Operands have already been resolved under the caller's one active selection.
export function evaluatePortableOperation(
  operation: string,
  operands: readonly ImplementedLiteralValue[],
  context: EvaluationContext = {},
): ExpressionEvaluationResult {
  if (!isPortableOperationId(operation)) return { status: "unresolved", reason: "unsupported-expression", code: "unknown-operation" };
  if (operands.length !== operationArity(operation)) return invalid("invalid-arity");
  const first = operands[0];
  if (first.valueType !== "number" && first.valueType !== "dimension") return invalid("invalid-operands");
  const scale = operation === "portable.math.scale.v1";
  if (scale ? operands[1].valueType !== "number" : operands.some(value => value.valueType !== first.valueType)) {
    return invalid("invalid-operands");
  }

  let unit = first.valueType === "dimension" ? first.unit : undefined;
  const mixed = !scale && first.valueType === "dimension" && operands.some(value => value.valueType === "dimension" && value.unit !== unit);
  let rootSize: Decimal | undefined;
  if (mixed) {
    const root = readRootFontSize(context);
    if ("status" in root) return root;
    rootSize = root.value;
    unit = "px";
  }
  const values: Decimal[] = [];
  for (const operand of operands) {
    if (operand.valueType !== "number" && operand.valueType !== "dimension") return invalid("invalid-operands");
    values.push(rootSize !== undefined && operand.valueType === "dimension" && operand.unit === "rem"
      ? multiplyDecimals(operand.value, rootSize) : operand.value);
  }
  const [a, b, c] = values;
  let value: Decimal;
  switch (operation) {
    case "portable.math.add.v1": value = addDecimals(a, b); break;
    case "portable.math.subtract.v1": value = subtractDecimals(a, b); break;
    case "portable.math.scale.v1": value = multiplyDecimals(a, b); break;
    case "portable.math.min.v1": value = compareDecimals(a, b) <= 0 ? a : b; break;
    case "portable.math.max.v1": value = compareDecimals(a, b) >= 0 ? a : b; break;
    case "portable.math.clamp.v1":
      if (compareDecimals(a, c) > 0) return invalid("invalid-clamp-range");
      value = compareDecimals(b, a) < 0 ? a : compareDecimals(b, c) > 0 ? c : b;
      break;
  }
  return { status: "evaluated", value: unit === undefined ? createNumberLiteral(value) : createDimensionLiteral(value, unit) };
}

function invalid(code: "invalid-arity" | "invalid-operands" | "invalid-clamp-range"): ExpressionFailure {
  return { status: "unresolved", reason: "invalid-expression", code };
}

// Static analysis reports explicit context keys. Mixed-unit context requirements
// may only become known after references and nested expressions are resolved.
export function analyzeExpression(expression: ExpressionValue): {
  readonly references: readonly TokenReference[];
  readonly contextKeys: readonly EvaluationContextKey[];
} {
  const references: TokenReference[] = [];
  const contextKeys = new Set<EvaluationContextKey>();
  const stack: ExpressionOperand[] = [expression];
  while (stack.length > 0) {
    const operand = stack.pop()!;
    if (operand.kind === "token-reference") references.push(operand);
    else if (operand.kind === "context-reference") contextKeys.add(operand.key);
    else if (operand.kind === "expression") stack.push(...[...operand.operands].reverse());
  }
  return { references, contextKeys: [...contextKeys] };
}
