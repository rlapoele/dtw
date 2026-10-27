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

// The caller supplies a complete token snapshot and a selection already
// completed from this project's axes. Validation of inactive assignments is a
// separate operation; resolution follows only the selected dependency chain.
export function resolveToken(
  projectId: string,
  tokens: readonly Token[],
  tokenId: string,
  selection: CompleteVariationSelection,
): TokenResolutionResult {
  const tokenById = new Map<TokenId, Token>();
  for (const token of tokens) {
    if (tokenById.has(token.id)) {
      throw new RangeError(
        "Token identities must be unique within the resolution snapshot",
      );
    }
    tokenById.set(token.id, token);
  }

  const rootId = tokenId as TokenId;
  const trace: ResolutionStep[] = [];
  const positions = new Map<TokenId, number>();
  let currentId = rootId;
  let expectedType: TokenType | undefined;

  function fail(
    reason: TokenResolutionFailureReason,
    at: TokenId,
    details: Omit<ResolutionDiagnostic, "code" | "tokenId"> = {},
  ): TokenResolutionResult {
    return {
      status: "unresolved",
      tokenId: rootId,
      selection,
      reason,
      trace,
      diagnostics: [{ code: reason, tokenId: at, ...details }],
    };
  }

  // Whole-value aliases have one outgoing edge at most. Iteration implements
  // recursive domain semantics without imposing a host call-stack depth limit.
  while (true) {
    const current = tokenById.get(currentId);
    if (current === undefined) {
      return fail("missing-reference", currentId);
    }
    if (current.projectId !== projectId) {
      return fail("cross-project-reference", currentId);
    }

    const cycleStart = positions.get(currentId);
    if (cycleStart !== undefined) {
      return fail("reference-cycle", currentId, {
        cycle: [...trace.slice(cycleStart).map((step) => step.tokenId), currentId],
      });
    }

    const definition = current.definition;
    if (definition === undefined) {
      return fail("missing-assignment", currentId);
    }
    if (expectedType !== undefined && definition.type !== expectedType) {
      return fail("type-mismatch", currentId, {
        expectedType,
        actualType: definition.type,
      });
    }

    const match = selectMostSpecificAssignment(definition.assignments, selection);
    if (match.status === "missing") {
      return fail("missing-assignment", currentId);
    }
    if (match.status === "ambiguous") {
      return fail("ambiguous-assignment", currentId, {
        candidates: match.candidates.map((candidate) => candidate.condition),
      });
    }

    const value = match.assignment.value;
    positions.set(currentId, trace.length);
    trace.push({
      tokenId: currentId,
      matchedCondition: match.assignment.condition,
      specificity: match.specificity,
      ...(value.kind === "token-reference"
        ? { targetTokenId: value.targetTokenId }
        : {}),
    });

    if (value.kind === "literal") {
      if (value.valueType !== definition.type) {
        return fail("type-mismatch", currentId, {
          expectedType: definition.type,
          actualType: value.valueType,
        });
      }
      return {
        status: "resolved",
        tokenId: rootId,
        selection,
        matchedCondition: trace[0].matchedCondition,
        value,
        trace,
        diagnostics: [],
      };
    }

    if (value.valuePath.length > 0) {
      return fail("unsupported-value-path", currentId);
    }
    expectedType = definition.type;
    currentId = value.targetTokenId;
  }
}
