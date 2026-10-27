import { describe, expect, it } from "vitest";

import { createColorLiteral } from "../../src/domain/color-literal";
import { createDimensionLiteral, createNumberLiteral } from "../../src/domain/numeric-literals";
import { createToken } from "../../src/domain/token";
import type { Token, TokenValueAssignmentInput } from "../../src/domain/token";
import { createTokenReference } from "../../src/domain/token-reference";
import { resolveToken } from "../../src/domain/token-resolution";
import { createVariationAxis } from "../../src/domain/variation-axis";
import { completeVariationSelection, createVariationSelection } from "../../src/domain/variation-selection";

const axes = [
  createVariationAxis({
    id: "scheme", projectId: "project", name: "Scheme",
    options: [{ id: "light", name: "Light" }, { id: "dark", name: "Dark" }],
    defaultOptionId: "light",
  }),
  createVariationAxis({
    id: "contrast", projectId: "project", name: "Contrast",
    options: [{ id: "standard", name: "Standard" }, { id: "high", name: "High" }],
    defaultOptionId: "standard",
  }),
];
const empty = createVariationSelection([]);
const light = completeVariationSelection(axes, empty, empty);
const dark = completeVariationSelection(axes, empty, createVariationSelection([
  { axisId: "scheme", optionId: "dark" },
]));
const schemeDark = [{ axisId: "scheme", optionId: "dark" }];
const contrastHigh = [{ axisId: "contrast", optionId: "high" }];
function token(id: string, assignments: readonly TokenValueAssignmentInput[] = [], type = "number"): Token {
  return createToken({
    id, projectId: "project", localName: id, parentGroupId: null,
    regeneration: "allowed", definition: { type, assignments },
  }, axes);
}
function reference(targetTokenId: string) {
  return createTokenReference({ targetTokenId, valuePath: [] });
}
function alias(id: string, target: string) {
  return token(id, [{ condition: [], value: reference(target) }]);
}

describe("resolveToken", () => {
  it.each([
    createNumberLiteral("12345678901234567890.123456789"),
    createDimensionLiteral("1.25", "rem"),
    createColorLiteral({ colorSpace: "oklch", components: ["0.6", "none", "30"], alpha: "0.5" }),
  ])("resolves an implemented literal without converting it: $valueType", (value) => {
    const source = token("base", [{ condition: [], value }], value.valueType);
    expect(resolveToken("project", [source], "base", light)).toEqual({
      status: "resolved", tokenId: "base", selection: light,
      matchedCondition: [], value, diagnostics: [],
      trace: [{ tokenId: "base", matchedCondition: [], specificity: 0 }],
    });
  });

  it.each([
    createDimensionLiteral("1.25", "rem"),
    createColorLiteral({ colorSpace: "display-p3", components: ["1.2", "-0.1", "none"], alpha: "0.3" }),
  ])("preserves $valueType representation through an alias", (value) => {
    const source = token("a", [{ condition: [], value: reference("b") }], value.valueType);
    const target = token("b", [{ condition: [], value }], value.valueType);
    expect(resolveToken("project", [source, target], "a", light)).toMatchObject({
      status: "resolved", value,
    });
  });

  it("resolves multiple alias hops with a trace and preserves authored references", () => {
    const tokens = [alias("a", "b"), alias("b", "c"), token("c", [
      { condition: [], value: createNumberLiteral("2.5") },
    ])];
    const before = JSON.stringify(tokens);
    const result = resolveToken("project", tokens, "a", light);
    expect(result).toMatchObject({
      status: "resolved", tokenId: "a", matchedCondition: [],
      value: createNumberLiteral("2.5"),
      trace: [
        { tokenId: "a", targetTokenId: "b" },
        { tokenId: "b", targetTokenId: "c" },
        { tokenId: "c" },
      ],
    });
    expect(JSON.stringify(tokens)).toBe(before);
  });

  it("selects each target independently under the same completed selection", () => {
    const tokens = [alias("a", "b"), token("b", [
      { condition: [], value: createNumberLiteral("1") },
      { condition: schemeDark, value: reference("c") },
    ]), token("c", [{ condition: schemeDark, value: createNumberLiteral("3") }])];
    expect(resolveToken("project", tokens, "a", light)).toMatchObject({ status: "resolved", value: createNumberLiteral("1") });
    expect(resolveToken("project", tokens, "a", dark)).toMatchObject({
      status: "resolved", selection: dark, matchedCondition: [], value: createNumberLiteral("3"),
      trace: [{ tokenId: "a", specificity: 0 }, { tokenId: "b", specificity: 1 }, { tokenId: "c", specificity: 1 }],
    });
  });

  it("ignores broken inactive assignments and unrelated invalid tokens", () => {
    const tokens = [token("a", [
      { condition: [], value: createNumberLiteral("1") },
      { condition: schemeDark, value: reference("missing") },
    ]), alias("unrelated", "absent")];
    expect(resolveToken("project", tokens, "a", light).status).toBe("resolved");
    expect(resolveToken("project", tokens, "a", dark)).toMatchObject({ status: "unresolved", reason: "missing-reference" });
  });

  it("does not fall back when the most-specific selected reference fails", () => {
    const source = token("a", [
      { condition: [], value: createNumberLiteral("1") },
      { condition: schemeDark, value: reference("missing") },
    ]);
    expect(resolveToken("project", [source], "a", dark)).toMatchObject({
      status: "unresolved", reason: "missing-reference", tokenId: "a",
      diagnostics: [{ tokenId: "missing" }],
    });
  });

  it("does not depend on snapshot or assignment declaration order", () => {
    const assignments = [
      { condition: [], value: createNumberLiteral("1") },
      { condition: schemeDark, value: createNumberLiteral("2") },
    ];
    const source = alias("a", "b");
    const forward = resolveToken("project", [source, token("b", assignments)], "a", dark);
    const reversed = resolveToken("project", [token("b", [...assignments].reverse()), source], "a", dark);
    expect(reversed).toEqual(forward);
    expect(forward).toMatchObject({ status: "resolved", value: createNumberLiteral("2") });
  });

  it("reports missing root and downstream tokens", () => {
    expect(resolveToken("project", [], "absent", light)).toMatchObject({ status: "unresolved", reason: "missing-reference" });
    expect(resolveToken("project", [alias("a", "b")], "a", light)).toMatchObject({
      status: "unresolved", reason: "missing-reference", diagnostics: [{ tokenId: "b" }],
      trace: [{ tokenId: "a", targetTokenId: "b" }],
    });
  });

  it("reports name-only, unassigned, and unmatched targets as missing assignments", () => {
    const nameOnly = createToken({ id: "b", projectId: "project", localName: "b", parentGroupId: null, regeneration: "allowed" }, []);
    const unassigned = token("b");
    const unmatched = token("b", [{ condition: schemeDark, value: createNumberLiteral("1") }]);
    for (const target of [nameOnly, unassigned, unmatched]) {
      expect(resolveToken("project", [alias("a", "b"), target], "a", light)).toMatchObject({
        status: "unresolved", reason: "missing-assignment", diagnostics: [{ tokenId: "b" }],
      });
    }
  });

  it("reports ambiguity downstream even when tied values are equal", () => {
    const active = completeVariationSelection(axes, empty, createVariationSelection([...schemeDark, ...contrastHigh]));
    const tokens = [alias("a", "b"), token("b", [
      { condition: [], value: createNumberLiteral("0") },
      { condition: schemeDark, value: createNumberLiteral("1") },
      { condition: contrastHigh, value: createNumberLiteral("1") },
    ])];
    expect(resolveToken("project", tokens, "a", active)).toMatchObject({
      status: "unresolved", reason: "ambiguous-assignment",
      diagnostics: [{ tokenId: "b", candidates: expect.any(Array) }],
    });
  });

  it("reports direct and indirect cycles with the actual cycle path", () => {
    expect(resolveToken("project", [alias("a", "a")], "a", light)).toMatchObject({
      status: "unresolved", reason: "reference-cycle", diagnostics: [{ cycle: ["a", "a"] }],
    });
    expect(resolveToken("project", [alias("start", "a"), alias("a", "b"), alias("b", "a")], "start", light)).toMatchObject({
      status: "unresolved", reason: "reference-cycle", diagnostics: [{ cycle: ["a", "b", "a"] }],
    });
  });

  it("does not combine mutually exclusive edges into cycles", () => {
    const tokens = [alias("a", "b"), token("b", [
      { condition: [], value: createNumberLiteral("1") },
      { condition: schemeDark, value: reference("a") },
    ])];
    expect(resolveToken("project", tokens, "a", light).status).toBe("resolved");
    expect(resolveToken("project", tokens, "a", dark)).toMatchObject({ status: "unresolved", reason: "reference-cycle" });
  });

  it("rejects cross-project dependencies and foreign roots", () => {
    const foreign = createToken({ id: "b", projectId: "foreign", localName: "b", parentGroupId: null, regeneration: "allowed",
      definition: { type: "number", assignments: [{ condition: [], value: createNumberLiteral("1") }] } }, []);
    expect(resolveToken("project", [alias("a", "b"), foreign], "a", light)).toMatchObject({ status: "unresolved", reason: "cross-project-reference" });
    expect(resolveToken("project", [foreign], "b", light)).toMatchObject({ status: "unresolved", reason: "cross-project-reference" });
  });

  it("rejects incompatible declared target types at any depth", () => {
    const tokens = [alias("a", "b"), alias("b", "c"), token("c", [
      { condition: [], value: createDimensionLiteral("1", "px") },
    ], "dimension")];
    expect(resolveToken("project", tokens, "a", light)).toMatchObject({
      status: "unresolved", reason: "type-mismatch",
      diagnostics: [{ tokenId: "c", expectedType: "number", actualType: "dimension" }],
    });
  });

  it("diagnoses part paths instead of navigating literal representation fields", () => {
    const source = token("a", [{ condition: [], value: createTokenReference({
      targetTokenId: "b", valuePath: [{ kind: "field", key: "value" }],
    }) }]);
    expect(resolveToken("project", [source, token("b")], "a", light)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path" });
  });

  it("rejects duplicate snapshot identities instead of choosing by order", () => {
    expect(() => resolveToken("project", [token("a"), token("a")], "a", light)).toThrow(RangeError);
  });

  it("handles long alias chains without exhausting the call stack", () => {
    const tokens = Array.from({ length: 12000 }, (_, index) => alias(`t-${index}`, `t-${index + 1}`));
    tokens.push(token("t-12000", [{ condition: [], value: createNumberLiteral("1") }]));
    const result = resolveToken("project", tokens, "t-0", light);
    expect(result).toMatchObject({ status: "resolved", value: createNumberLiteral("1") });
    expect(result.trace).toHaveLength(12001);
  });
});
