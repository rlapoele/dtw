import { describe, expect, it } from "vitest";
import { createTokenReference } from "../../src/domain/token-reference";
import { createToken, addTokenAssignment, renameToken } from "../../src/domain/token";
import type { Token, TokenValueAssignmentInput } from "../../src/domain/token";
import { createNumberLiteral } from "../../src/domain/numeric-literals";
import { validateProjectTokenReferences } from "../../src/domain/token-reference-validation";
import { createVariationAxis } from "../../src/domain/variation-axis";
import { completeVariationSelection, createVariationSelection } from "../../src/domain/variation-selection";

const axis = createVariationAxis({
  id: "scheme", projectId: "project", name: "Scheme",
  options: [{ id: "light", name: "Light" }, { id: "dark", name: "Dark" }],
  defaultOptionId: "light",
});
const selection = completeVariationSelection([axis], createVariationSelection([]), createVariationSelection([]));
function token(id: string, assignments: readonly TokenValueAssignmentInput[] = [], type = "number", projectId = "project"): Token {
  return createToken({ id, projectId, localName: id, parentGroupId: null,
    regeneration: "allowed", definition: { type, assignments } }, projectId === "project" ? [axis] : []);
}
function alias(id: string, target: string): Token {
  return token(id, [{ condition: [], value: createTokenReference({ targetTokenId: target, valuePath: [] }) }]);
}
function validate(tokens: readonly Token[]) {
  return validateProjectTokenReferences("project", tokens, selection);
}

describe("TokenReference", () => {
  it("stores only the stable target identity and explicit whole-value path", () => {
    expect(createTokenReference({ targetTokenId: "base", valuePath: [] })).toEqual({
      kind: "token-reference", targetTokenId: "base", valuePath: [],
    });
  });
  it("copies structural paths for repair without interpreting them as properties", () => {
    const path = [{ kind: "field" as const, key: "fontSize" }];
    const reference = createTokenReference({ targetTokenId: "base", valuePath: path });
    path[0].key = "other";
    expect(reference.valuePath).toEqual([{ kind: "field", key: "fontSize" }]);
  });
  it.each([-1, 0.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1])("rejects invalid index %s", (index) => {
    expect(() => createTokenReference({ targetTokenId: "base", valuePath: [{ kind: "index", index }] })).toThrow(RangeError);
  });
  it("allows a reference assignment without inventing a stored expected type", () => {
    const source = token("source");
    const changed = addTokenAssignment(source, { condition: [], value: createTokenReference({ targetTokenId: "base", valuePath: [] }) }, [axis]);
    expect(changed.definition?.assignments[0].value.kind).toBe("token-reference");
    expect(source.definition?.assignments).toEqual([]);
  });
});

describe("validateProjectTokenReferences", () => {
  it("accepts compatible aliases and stable targets after renaming", () => {
    const base = token("base", [{ condition: [], value: createNumberLiteral("1") }]);
    expect(validate([alias("source", "base"), renameToken(base, "renamed")])).toEqual([]);
  });
  it("accepts compatible alias chains", () => {
    expect(validate([alias("a", "b"), alias("b", "c"), token("c")])).toEqual([]);
  });
  it("reports a missing target and preserves authored data", () => {
    const source = alias("a", "missing");
    expect(validate([source])).toEqual([expect.objectContaining({ code: "missing-reference", tokenId: "a", targetTokenId: "missing", condition: [] })]);
    expect(source.definition?.assignments[0].value).toEqual(createTokenReference({ targetTokenId: "missing", valuePath: [] }));
  });
  it("reports foreign-project targets", () => {
    expect(validate([alias("a", "foreign"), token("foreign", [], "number", "other")])).toContainEqual(expect.objectContaining({ code: "cross-project-reference", tokenId: "a" }));
  });
  it("rejects duplicate token identities instead of silently choosing a target", () => {
    expect(() => validate([token("a"), token("a")])).toThrow(RangeError);
  });
  it("reports incompatible whole-value target types", () => {
    expect(validate([alias("a", "b"), token("b", [], "dimension")])).toContainEqual(expect.objectContaining({ code: "type-mismatch", tokenId: "a", targetTokenId: "b" }));
  });
  it("reports targets without a declared type", () => {
    const base = createToken({ id: "b", projectId: "project", localName: "b", parentGroupId: null, regeneration: "allowed" }, []);
    expect(validate([alias("a", "b"), base])).toContainEqual(expect.objectContaining({ code: "target-type-missing" }));
  });
  it.each([{ valuePath: [{ kind: "field" as const, key: "value" }] }, { valuePath: [{ kind: "index" as const, index: 0 }] }])("diagnoses unsupported part paths: %j", ({ valuePath }) => {
    const source = token("a", [{ condition: [], value: createTokenReference({ targetTokenId: "b", valuePath }) }]);
    expect(validate([source, token("b")])).toContainEqual(expect.objectContaining({ code: "unsupported-value-path" }));
  });
  it("checks inactive assignments for broken references", () => {
    const source = token("a", [{ condition: [{ axisId: "scheme", optionId: "dark" }], value: createTokenReference({ targetTokenId: "missing", valuePath: [] }) }]);
    expect(validate([source])).toContainEqual(expect.objectContaining({ code: "missing-reference" }));
  });
  it("reports direct and indirect selected cycles", () => {
    expect(validate([alias("a", "a")])).toContainEqual(expect.objectContaining({ code: "reference-cycle", cycle: ["a", "a"] }));
    expect(validate([alias("a", "b"), alias("b", "a")])).toContainEqual(expect.objectContaining({ code: "reference-cycle", cycle: ["a", "b", "a"] }));
  });
  it("does not combine mutually exclusive assignment edges into a cycle", () => {
    const a = token("a", [
      { condition: [], value: createNumberLiteral("1") },
      { condition: [{ axisId: "scheme", optionId: "dark" }], value: createTokenReference({ targetTokenId: "b", valuePath: [] }) },
    ]);
    const b = alias("b", "a");
    expect(validate([a, b])).toEqual([]);
    const dark = completeVariationSelection([axis], createVariationSelection([]), createVariationSelection([{ axisId: "scheme", optionId: "dark" }]));
    expect(validateProjectTokenReferences("project", [a, b], dark)).toContainEqual(expect.objectContaining({ code: "reference-cycle" }));
  });
  it("does not choose an arbitrary edge from ambiguous assignments", () => {
    const contrast = createVariationAxis({
      id: "contrast", projectId: "project", name: "Contrast",
      options: [{ id: "high", name: "High" }], defaultOptionId: "high",
    });
    const axes = [axis, contrast];
    const active = completeVariationSelection(axes, createVariationSelection([]), createVariationSelection([]));
    const source = createToken({
      id: "a", projectId: "project", localName: "a", parentGroupId: null,
      regeneration: "allowed", definition: { type: "number", assignments: [
        { condition: [{ axisId: "scheme", optionId: "light" }], value: createTokenReference({ targetTokenId: "a", valuePath: [] }) },
        { condition: [{ axisId: "contrast", optionId: "high" }], value: createNumberLiteral("1") },
      ] },
    }, axes);
    expect(validateProjectTokenReferences("project", [source], active)).toEqual([
      { code: "ambiguous-assignment", tokenId: "a" },
    ]);
  });
  it("uses each target's own matching condition under the same selection", () => {
    const source = alias("a", "b");
    const target = token("b", [
      { condition: [], value: createNumberLiteral("1") },
      { condition: [{ axisId: "scheme", optionId: "light" }], value: createTokenReference({ targetTokenId: "a", valuePath: [] }) },
    ]);
    expect(validate([source, target])).toContainEqual(expect.objectContaining({ code: "reference-cycle" }));
  });
  it("reports each cycle once even with inbound aliases", () => {
    const issues = validate([alias("inbound", "a"), alias("a", "b"), alias("b", "a")]);
    expect(issues).toEqual([{ code: "reference-cycle", cycle: ["a", "b", "a"] }]);
  });
  it("validates long chains without recursive traversal", () => {
    const chain = Array.from({ length: 12000 }, (_, index) => alias(`t-${index}`, `t-${index + 1}`));
    expect(validate([...chain, token("t-12000")])).toEqual([]);
  });

});
