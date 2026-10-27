import { TYPOGRAPHY_FIELDS, TYPOGRAPHY_FIELD_TYPES, isTypographyFieldValue } from "./typography";
import type { TypographyField } from "./typography";
import { TRANSITION_FIELDS, TRANSITION_FIELD_TYPES, isTransitionFieldValue } from "./transition";
import type { TransitionField } from "./transition";
import { selectMostSpecificAssignment } from "./assignment-selection";
import type { TokenId } from "./identifiers";
import type { ExpressionOperand } from "./expression";
import type { Token, TokenType, TokenValueAssignment, ImplementedAuthoredValue, ImplementedCompositeValue } from "./token";
import type { TokenReference } from "./token-reference";
import type { VariationCondition } from "./variation-condition";
import type { CompleteVariationSelection } from "./variation-selection";

export const TOKEN_REFERENCE_ISSUE_CODES = [
  "missing-reference",
  "cross-project-reference",
  "target-type-missing",
  "type-mismatch",
  "unsupported-value-path",
] as const;

export type TokenReferenceIssueCode = (typeof TOKEN_REFERENCE_ISSUE_CODES)[number];

export type TokenReferenceDiagnostic =
  | {
      readonly code: TokenReferenceIssueCode;
      readonly tokenId: TokenId;
      readonly targetTokenId: TokenId;
      readonly condition: VariationCondition;
      readonly operandPath?: readonly number[];
      readonly field?: TransitionField | TypographyField;
    }
  | {
      readonly code: "token-project-mismatch" | "ambiguous-assignment";
      readonly tokenId: TokenId;
    }
  | {
      readonly code: "reference-cycle";
      readonly cycle: readonly TokenId[];
    };

// Validate every authored reference; inspect cycles only in the graph selected
// under the supplied completed project selection. This is not value resolution.
export function validateProjectTokenReferences(
  projectId: string,
  tokens: readonly Token[],
  selection: CompleteVariationSelection,
): readonly TokenReferenceDiagnostic[] {
  const tokenById = new Map<TokenId, Token>();
  for (const token of tokens) {
    if (tokenById.has(token.id)) {
      throw new RangeError("Token identities must be unique within the validation snapshot");
    }
    tokenById.set(token.id, token);
  }

  const diagnostics: TokenReferenceDiagnostic[] = [];
  const selectedTargets = new Map<TokenId, readonly TokenId[]>();
  for (const token of tokens) {
    if (token.projectId !== projectId) {
      diagnostics.push({ code: "token-project-mismatch", tokenId: token.id });
      continue;
    }

    const assignments = token.definition?.assignments ?? [];
    const assignmentTargets = new Map<TokenValueAssignment, readonly TokenId[]>();
    for (const assignment of assignments) {
      const targets: TokenId[] = [];
      for (const use of collectReferenceUses(assignment.value, token.definition!.type)) {
        const issues = validateReference(use.expectedType, token.projectId, use.reference, tokenById);
        if (issues.length === 0) targets.push(use.reference.targetTokenId);
        for (const code of issues) {
          diagnostics.push({ code, tokenId: token.id,
            targetTokenId: use.reference.targetTokenId,
            condition: assignment.condition,
            ...(use.path.length === 0 ? {} : { operandPath: use.path }),
            ...(use.field === undefined ? {} : { field: use.field }) });
        }
      }
      assignmentTargets.set(assignment, [...new Set(targets)]);
    }

    const match = selectMostSpecificAssignment(assignments, selection);
    if (match.status === "ambiguous") {
      diagnostics.push({ code: "ambiguous-assignment", tokenId: token.id });
    } else if (match.status === "matched") {
      selectedTargets.set(token.id, assignmentTargets.get(match.assignment) ?? []);
    }
  }

  return [...diagnostics, ...findSelectedCycles(selectedTargets)];
}

function validateReference(
  expectedType: TokenType,
  projectId: string,
  reference: TokenReference,
  tokenById: ReadonlyMap<TokenId, Token>,
): TokenReferenceIssueCode[] {
  const issues: TokenReferenceIssueCode[] = [];
  // No part-value schemas are implemented yet. Never navigate arbitrary fields.
  if (reference.valuePath.length > 0) issues.push("unsupported-value-path");
  const target = tokenById.get(reference.targetTokenId);
  if (target === undefined) {
    issues.push("missing-reference");
  } else if (target.projectId !== projectId) {
    issues.push("cross-project-reference");
  } else if (target.definition === undefined) {
    issues.push("target-type-missing");
  } else if (reference.valuePath.length === 0 &&
    target.definition.type !== expectedType) {
    issues.push("type-mismatch");
  }
  return issues;
}

function collectReferenceUses(value: ImplementedAuthoredValue, expectedType: TokenType): {
  reference: TokenReference;
  expectedType: TokenType;
  path: readonly number[];
  field?: TransitionField | TypographyField;
}[] {
  const uses: { reference: TokenReference; expectedType: TokenType; path: readonly number[]; field?: TransitionField | TypographyField }[] = [];
  const stack: { value: ExpressionOperand | ImplementedCompositeValue; expectedType: TokenType; path: readonly number[]; field?: TransitionField | TypographyField }[] = [{ value, expectedType, path: [] }];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current.value.kind === "token-reference") uses.push({ reference: current.value, expectedType: current.expectedType, path: current.path, ...(current.field === undefined ? {} : { field: current.field }) });
    else if (current.value.kind === "composite") {
      if (current.value.valueType === "transition") {
        for (const field of [...TRANSITION_FIELDS].reverse()) {
          const fieldValue = current.value[field];
          if (isTransitionFieldValue(fieldValue, field)) stack.push({ value: fieldValue, expectedType: TRANSITION_FIELD_TYPES[field], path: [], field });
        }
      } else {
        for (const field of [...TYPOGRAPHY_FIELDS].reverse()) {
          const fieldValue = current.value[field];
          if (isTypographyFieldValue(fieldValue, field)) stack.push({ value: fieldValue, expectedType: TYPOGRAPHY_FIELD_TYPES[field], path: [], field });
        }
      }
    }
    else if (current.value.kind === "expression") {
      for (let index = current.value.operands.length - 1; index >= 0; index -= 1) {
        stack.push({ value: current.value.operands[index], expectedType:
          current.value.operation === "portable.math.scale.v1" && index === 1 ? "number" : current.expectedType, path: [...current.path, index] });
      }
    }
  }
  return uses;
}

// Iterative DFS now supports multiple expression-reference edges per token.
function findSelectedCycles(
  targets: ReadonlyMap<TokenId, readonly TokenId[]>,
): TokenReferenceDiagnostic[] {
  const visited = new Set<TokenId>();
  const diagnostics: TokenReferenceDiagnostic[] = [];
  for (const start of targets.keys()) {
    if (visited.has(start)) continue;
    const stack = [{ id: start, next: 0 }];
    const positions = new Map<TokenId, number>([[start, 0]]);
    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const outgoing = targets.get(frame.id) ?? [];
      if (frame.next === outgoing.length) {
        positions.delete(frame.id);
        visited.add(frame.id);
        stack.pop();
        continue;
      }
      const target = outgoing[frame.next++];
      const cycleStart = positions.get(target);
      if (cycleStart !== undefined) {
        diagnostics.push({ code: "reference-cycle", cycle: [...stack.slice(cycleStart).map(item => item.id), target] });
      } else if (!visited.has(target)) {
        positions.set(target, stack.length);
        stack.push({ id: target, next: 0 });
      }
    }
  }
  return diagnostics;
}
