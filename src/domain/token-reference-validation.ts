import { selectMostSpecificAssignment } from "./assignment-selection";
import type { TokenId } from "./identifiers";
import type { Token, TokenValueAssignment } from "./token";
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
  const selectedTargets = new Map<TokenId, TokenId>();
  for (const token of tokens) {
    if (token.projectId !== projectId) {
      diagnostics.push({ code: "token-project-mismatch", tokenId: token.id });
      continue;
    }

    const assignments = token.definition?.assignments ?? [];
    const validAssignments = new Set<TokenValueAssignment>();
    for (const assignment of assignments) {
      if (assignment.value.kind !== "token-reference") continue;
      const issues = validateReference(token, assignment.value, tokenById);
      if (issues.length === 0) validAssignments.add(assignment);
      for (const code of issues) {
        diagnostics.push({ code, tokenId: token.id,
          targetTokenId: assignment.value.targetTokenId,
          condition: assignment.condition });
      }
    }

    const match = selectMostSpecificAssignment(assignments, selection);
    if (match.status === "ambiguous") {
      diagnostics.push({ code: "ambiguous-assignment", tokenId: token.id });
    } else if (match.status === "matched" &&
      match.assignment.value.kind === "token-reference" &&
      validAssignments.has(match.assignment)) {
      selectedTargets.set(token.id, match.assignment.value.targetTokenId);
    }
  }

  return [...diagnostics, ...findSelectedCycles(selectedTargets)];
}

function validateReference(
  source: Token,
  reference: TokenReference,
  tokenById: ReadonlyMap<TokenId, Token>,
): TokenReferenceIssueCode[] {
  const issues: TokenReferenceIssueCode[] = [];
  // No part-value schemas are implemented yet. Never navigate arbitrary fields.
  if (reference.valuePath.length > 0) issues.push("unsupported-value-path");
  const target = tokenById.get(reference.targetTokenId);
  if (target === undefined) {
    issues.push("missing-reference");
  } else if (target.projectId !== source.projectId) {
    issues.push("cross-project-reference");
  } else if (target.definition === undefined) {
    issues.push("target-type-missing");
  } else if (reference.valuePath.length === 0 &&
    target.definition.type !== source.definition?.type) {
    issues.push("type-mismatch");
  }
  return issues;
}

// The selected whole-value alias graph has at most one outgoing edge per token.
// Iterative traversal avoids call-stack limits for long alias chains.
function findSelectedCycles(
  targets: ReadonlyMap<TokenId, TokenId>,
): TokenReferenceDiagnostic[] {
  const visited = new Set<TokenId>();
  const diagnostics: TokenReferenceDiagnostic[] = [];
  for (const start of targets.keys()) {
    const path: TokenId[] = [];
    const positions = new Map<TokenId, number>();
    let current: TokenId | undefined = start;
    while (current !== undefined && !visited.has(current)) {
      const cycleStart = positions.get(current);
      if (cycleStart !== undefined) {
        diagnostics.push({ code: "reference-cycle",
          cycle: [...path.slice(cycleStart), current] });
        break;
      }
      positions.set(current, path.length);
      path.push(current);
      current = targets.get(current);
    }
    for (const id of path) visited.add(id);
  }
  return diagnostics;
}
