import type { TokenId } from "./identifiers";

export type TokenValuePathSegment =
  | { readonly kind: "field"; readonly key: string }
  | { readonly kind: "index"; readonly index: number };

export type TokenValuePath = readonly TokenValuePathSegment[];

export type TokenReference = {
  readonly kind: "token-reference";
  readonly targetTokenId: TokenId;
  readonly valuePath: TokenValuePath;
};

export type TokenReferenceInput = {
  readonly targetTokenId: string;
  readonly valuePath: TokenValuePath;
};

// Structural construction preserves repairable paths. Schema support and target
// compatibility are checked with the owning project, not inferred from strings.
export function createTokenReference(input: TokenReferenceInput): TokenReference {
  const valuePath = input.valuePath.map((segment): TokenValuePathSegment => {
    switch (segment.kind) {
      case "field":
        return { kind: "field", key: segment.key };
      case "index":
        if (!Number.isSafeInteger(segment.index) || segment.index < 0) {
          throw new RangeError("A value-path index must be a non-negative safe integer");
        }
        return { kind: "index", index: segment.index };
    }
  });

  return {
    kind: "token-reference",
    targetTokenId: input.targetTokenId as TokenId,
    valuePath,
  };
}
