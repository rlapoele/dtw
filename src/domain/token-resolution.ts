import { evaluatePortableOperation, isPortableOperationId, operationArity, readRootFontSize } from "./expression";
import type { EvaluationContext, EvaluationContextKey, ExpressionOperand, ExpressionFailure } from "./expression";
import { selectMostSpecificAssignment } from "./assignment-selection";
import type { TokenId } from "./identifiers";
import type { ImplementedLiteralValue, Token, TokenType } from "./token";
import type { VariationCondition } from "./variation-condition";
import type { CompleteVariationSelection } from "./variation-selection";

export const TOKEN_RESOLUTION_FAILURE_REASONS = [
  "missing-assignment",
  "ambiguous-assignment",
  "missing-reference",
  "reference-cycle",
  "type-mismatch",
  "cross-project-reference",
  "unsupported-value-path",
  "invalid-expression",
  "unsupported-expression",
  "context-required",
] as const;

export type TokenResolutionFailureReason =
  (typeof TOKEN_RESOLUTION_FAILURE_REASONS)[number];

export type ResolutionStep = {
  readonly tokenId: TokenId;
  readonly matchedCondition: VariationCondition;
  readonly specificity: number;
  readonly targetTokenId?: TokenId;
};

export type ResolutionDiagnostic = {
  readonly code: TokenResolutionFailureReason;
  readonly tokenId: TokenId;
  readonly expressionCode?: ExpressionFailure["code"];
  readonly operandPath?: readonly number[];
  readonly operation?: string;
  readonly requiredContext?: readonly EvaluationContextKey[];
  readonly cycle?: readonly TokenId[];
  readonly candidates?: readonly VariationCondition[];
  readonly expectedType?: TokenType;
  readonly actualType?: TokenType;
};

export type TokenResolutionResult =
  | {
      readonly status: "resolved";
      readonly tokenId: TokenId;
      readonly selection: CompleteVariationSelection;
      readonly matchedCondition: VariationCondition;
      readonly value: ImplementedLiteralValue;
      readonly trace: readonly ResolutionStep[];
      readonly diagnostics: readonly ResolutionDiagnostic[];
    }
  | {
      readonly status: "unresolved";
      readonly tokenId: TokenId;
      readonly selection: CompleteVariationSelection;
      readonly reason: TokenResolutionFailureReason;
      readonly trace: readonly ResolutionStep[];
      readonly diagnostics: readonly ResolutionDiagnostic[];
    };

type Task =
  | { kind: "token"; id: TokenId; expectedType?: TokenType }
  | { kind: "finish-token"; id: TokenId; type: TokenType }
  | { kind: "value"; value: ExpressionOperand; ownerId: TokenId; expectedType: TokenType; path: readonly number[] }
  | { kind: "apply"; operation: string; count: number; ownerId: TokenId; path: readonly number[] };

// The caller supplies the project snapshot and a selection completed from its
// axes. Only selected assignments are evaluated; authored data is never changed.
export function resolveToken(
  projectId: string,
  tokens: readonly Token[],
  tokenId: string,
  selection: CompleteVariationSelection,
  context: EvaluationContext = {},
): TokenResolutionResult {
  const tokenById = new Map<TokenId, Token>();
  for (const token of tokens) {
    if (tokenById.has(token.id)) {
      throw new RangeError("Token identities must be unique within the resolution snapshot");
    }
    tokenById.set(token.id, token);
  }
  const rootId = tokenId as TokenId;
  const trace: ResolutionStep[] = [];
  const activeIds: TokenId[] = [];
  const positions = new Map<TokenId, number>();
  const values: ImplementedLiteralValue[] = [];
  const tasks: Task[] = [{ kind: "token", id: rootId }];

  function fail(reason: TokenResolutionFailureReason, at: TokenId,
    details: Omit<ResolutionDiagnostic, "code" | "tokenId"> = {},
  ): TokenResolutionResult {
    return { status: "unresolved", tokenId: rootId, selection, reason, trace,
      diagnostics: [{ code: reason, tokenId: at, ...details }] };
  }

  // Explicit work and value stacks support both deep alias chains and nested
  // ASTs without recursive calls. Active token ancestry distinguishes cycles
  // from repeated references in separate operands.
  while (tasks.length > 0) {
    const task = tasks.pop()!;
    if (task.kind === "token") {
      const current = tokenById.get(task.id);
      if (current === undefined) return fail("missing-reference", task.id);
      if (current.projectId !== projectId) return fail("cross-project-reference", task.id);
      const cycleStart = positions.get(task.id);
      if (cycleStart !== undefined) return fail("reference-cycle", task.id, { cycle: [...activeIds.slice(cycleStart), task.id] });
      const definition = current.definition;
      if (definition === undefined) return fail("missing-assignment", task.id);
      if (task.expectedType !== undefined && definition.type !== task.expectedType) {
        return fail("type-mismatch", task.id, { expectedType: task.expectedType, actualType: definition.type });
      }
      const match = selectMostSpecificAssignment(definition.assignments, selection);
      if (match.status === "missing") return fail("missing-assignment", task.id);
      if (match.status === "ambiguous") return fail("ambiguous-assignment", task.id, { candidates: match.candidates.map(candidate => candidate.condition) });
      const value = match.assignment.value;
      trace.push({ tokenId: task.id, matchedCondition: match.assignment.condition, specificity: match.specificity,
        ...(value.kind === "token-reference" ? { targetTokenId: value.targetTokenId } : {}) });
      positions.set(task.id, activeIds.length);
      activeIds.push(task.id);
      tasks.push({ kind: "finish-token", id: task.id, type: definition.type });
      tasks.push({ kind: "value", value, ownerId: task.id, expectedType: definition.type, path: [] });
    } else if (task.kind === "finish-token") {
      const value = values[values.length - 1];
      if (value.valueType !== task.type) return fail("type-mismatch", task.id, { expectedType: task.type, actualType: value.valueType });
      positions.delete(task.id);
      activeIds.pop();
    } else if (task.kind === "apply") {
      const operands = values.splice(values.length - task.count, task.count);
      const result = evaluatePortableOperation(task.operation, operands, context);
      if (result.status === "unresolved") return fail(result.reason, task.ownerId, {
        expressionCode: result.code, operandPath: task.path, operation: task.operation,
        ...(result.requiredContext === undefined ? {} : { requiredContext: result.requiredContext }),
      });
      values.push(result.value);
    } else {
      const { value, ownerId, expectedType, path } = task;
      if (value.kind === "literal") {
        values.push(value);
      } else if (value.kind === "token-reference") {
        if (value.valuePath.length > 0) return fail("unsupported-value-path", ownerId, { operandPath: path });
        tasks.push({ kind: "token", id: value.targetTokenId, expectedType });
      } else if (value.kind === "context-reference") {
        if (value.key !== "font.rootSize") return fail("invalid-expression", ownerId, { expressionCode: "invalid-context", operandPath: path });
        const root = readRootFontSize(context);
        if ("status" in root) return fail(root.reason, ownerId, {
          expressionCode: root.code, operandPath: path,
          ...(root.requiredContext === undefined ? {} : { requiredContext: root.requiredContext }),
        });
        values.push(root);
      } else {
        if (!isPortableOperationId(value.operation)) return fail("unsupported-expression", ownerId, { expressionCode: "unknown-operation", operandPath: path, operation: value.operation });
        if (value.operands.length !== operationArity(value.operation)) return fail("invalid-expression", ownerId, { expressionCode: "invalid-arity", operandPath: path, operation: value.operation });
        tasks.push({ kind: "apply", operation: value.operation, count: value.operands.length, ownerId, path });
        for (let index = value.operands.length - 1; index >= 0; index -= 1) {
          tasks.push({ kind: "value", value: value.operands[index], ownerId,
            expectedType: value.operation === "portable.math.scale.v1" && index === 1 ? "number" : expectedType,
            path: [...path, index] });
        }
      }
    }
  }
  return { status: "resolved", tokenId: rootId, selection,
    matchedCondition: trace[0].matchedCondition, value: values[0], trace, diagnostics: [] };
}
