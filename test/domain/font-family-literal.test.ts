import { describe, expect, it } from "vitest";

import { createFontFamilyLiteral } from "../../src/domain/font-family-literal";
import type { FontFamilyEntryInput } from "../../src/domain/font-family-literal";
import { createNumberLiteral, createDimensionLiteral } from "../../src/domain/numeric-literals";
import { createToken, addTokenAssignment } from "../../src/domain/token";
import type { ImplementedAuthoredValue } from "../../src/domain/token";
import { createTokenReference } from "../../src/domain/token-reference";
import { validateProjectTokenReferences } from "../../src/domain/token-reference-validation";
import { resolveToken } from "../../src/domain/token-resolution";
import { createExpression, evaluatePortableOperation, PORTABLE_OPERATION_IDS } from "../../src/domain/expression";
import { createVariationAxis } from "../../src/domain/variation-axis";
import { completeVariationSelection, createVariationSelection } from "../../src/domain/variation-selection";

const axis = createVariationAxis({
  id: "brand", projectId: "p", name: "Brand",
  options: [{ id: "main", name: "Main" }, { id: "alternate", name: "Alternate" }],
  defaultOptionId: "main",
});
const empty = createVariationSelection([]);
const selection = completeVariationSelection([axis], empty, empty);
const reference = (targetTokenId: string) => createTokenReference({ targetTokenId, valuePath: [] });
function family() {
  return createFontFamilyLiteral([{ kind: "named", name: "Inter" }, { kind: "generic", family: "sans-serif" }]);
}
function token(id: string, type: string, value: ImplementedAuthoredValue) {
  return createToken({
    id, projectId: "p", localName: id, parentGroupId: null, regeneration: "allowed",
    definition: { type, assignments: [{ condition: [], value }] },
  }, [axis]);
}

describe("createFontFamilyLiteral", () => {
  it("requires a nonempty stack without inserting a default fallback", () => {
    expect(() => createFontFamilyLiteral([])).toThrow(RangeError);
    expect(createFontFamilyLiteral([{ kind: "named", name: "Inter" }])).toEqual({
      kind: "literal", valueType: "fontFamily", families: [{ kind: "named", name: "Inter" }],
    });
  });
  it("preserves fallback order, duplicates, and named versus generic semantics", () => {
    const entries: FontFamilyEntryInput[] = [
      { kind: "named", name: "serif" }, { kind: "named", name: "Inter" },
      { kind: "named", name: "Inter" }, { kind: "generic", family: "serif" },
      { kind: "generic", family: "serif" },
    ];
    expect(createFontFamilyLiteral(entries)).toEqual({ kind: "literal", valueType: "fontFamily", families: entries });
  });
  it.each(["serif", "sans-serif", "monospace", "system-ui"])("accepts the initial generic family %s", generic => {
    expect(createFontFamilyLiteral([{ kind: "generic", family: generic }]).families).toEqual([{ kind: "generic", family: generic }]);
  });
  it.each(["", "Serif", "SANS-SERIF", " sans-serif", "sans-serif ", "cursive", "fantasy", "inherit"])("rejects unsupported generic keyword %j", generic => {
    expect(() => createFontFamilyLiteral([{ kind: "generic", family: generic }])).toThrow(RangeError);
  });
  it.each(["", " ", "\t\n", "\u00a0"])("rejects blank named family %j", name => {
    expect(() => createFontFamilyLiteral([{ kind: "named", name }])).toThrow(RangeError);
  });
  it.each(["  Inter  ", "A, B", 'A "Quoted" Family', "é", "e\u0301", "Unavailable Font 987654", "sans-serif"])("preserves named family text %j without parsing or font checks", name => {
    expect(createFontFamilyLiteral([{ kind: "named", name }]).families).toEqual([{ kind: "named", name }]);
  });
  it("rejects sparse stacks rather than constructing an undefined entry", () => {
    expect(() => createFontFamilyLiteral(new Array<FontFamilyEntryInput>(1))).toThrow(RangeError);
  });
  it("copies the stack and its entries at the value-object boundary", () => {
    const entries = [{ kind: "named" as const, name: "Inter" }];
    const value = createFontFamilyLiteral(entries);
    entries[0].name = "Changed";
    entries.push({ kind: "named", name: "Added" });
    expect(value.families).toEqual([{ kind: "named", name: "Inter" }]);
  });
  it("rejects per-entry token references", () => {
    const entry = reference("family") as unknown as FontFamilyEntryInput;
    expect(() => createFontFamilyLiteral([entry])).toThrow(RangeError);
  });
});

describe("font-family assignments, aliases, and resolution", () => {
  it("adds a stack to a typed-unassigned token and resolves it without mutation", () => {
    const source = createToken({ id: "a", projectId: "p", localName: "a", parentGroupId: null, regeneration: "allowed", definition: { type: "fontFamily", assignments: [] } }, [axis]);
    const changed = addTokenAssignment(source, { condition: [], value: family() }, [axis]);
    expect(source.definition?.assignments).toEqual([]);
    expect(resolveToken("p", [changed], "a", selection)).toMatchObject({ status: "resolved", value: family() });
  });
  it.each(["number", "string", "fontWeight"])("rejects fontFamily assignments on %s tokens", type => {
    expect(() => token("a", type, family())).toThrow(RangeError);
  });
  it.each([createNumberLiteral("1"), createDimensionLiteral("1", "px")])("rejects $valueType assignments on fontFamily tokens", value => {
    expect(() => token("a", "fontFamily", value)).toThrow(RangeError);
  });
  it("validates and resolves whole-stack alias chains without changing authored data", () => {
    const tokens = [token("a", "fontFamily", reference("b")), token("b", "fontFamily", reference("c")), token("c", "fontFamily", family())];
    const before = JSON.stringify(tokens);
    expect(validateProjectTokenReferences("p", tokens, selection)).toEqual([]);
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "resolved", value: family(), trace: [{ tokenId: "a" }, { tokenId: "b" }, { tokenId: "c" }] });
    expect(JSON.stringify(tokens)).toBe(before);
  });
  it.each([["number", "fontFamily"], ["fontFamily", "number"]])("rejects aliases from %s to %s", (sourceType, targetType) => {
    const tokens = [token("a", sourceType, reference("b")), token("b", targetType, targetType === "fontFamily" ? family() : createNumberLiteral("1"))];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "type-mismatch" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
  it("selects the whole target stack under the same completed variation selection", () => {
    const alternateFamily = createFontFamilyLiteral([{ kind: "named", name: "Alternate Font" }, { kind: "generic", family: "serif" }]);
    const target = addTokenAssignment(token("base", "fontFamily", family()), { condition: [{ axisId: "brand", optionId: "alternate" }], value: alternateFamily }, [axis]);
    const alternate = completeVariationSelection([axis], empty, createVariationSelection([{ axisId: "brand", optionId: "alternate" }]));
    const tokens = [token("a", "fontFamily", reference("base")), target];
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "resolved", value: family() });
    expect(resolveToken("p", tokens, "a", alternate)).toMatchObject({ status: "resolved", value: alternateFamily });
  });
  it("keeps per-entry reference paths unsupported", () => {
    const tokens = [token("a", "fontFamily", createTokenReference({ targetTokenId: "b", valuePath: [{ kind: "field", key: "families" }, { kind: "index", index: 0 }] })), token("b", "fontFamily", family())];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "unsupported-value-path" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path" });
  });
});

describe("font families remain excluded from expression operations", () => {
  it.each(PORTABLE_OPERATION_IDS)("rejects fontFamily in %s", operation => {
    const operands = operation === "portable.math.clamp.v1" ? [family(), family(), family()]
      : [family(), operation === "portable.math.scale.v1" ? createNumberLiteral("2") : family()];
    expect(evaluatePortableOperation(operation, operands)).toMatchObject({ status: "unresolved", reason: "invalid-expression", code: "invalid-operands" });
  });
  it.each([createNumberLiteral("2"), createDimensionLiteral("2", "rem")])("rejects a fontFamily scalar for $valueType", value => {
    expect(evaluatePortableOperation("portable.math.scale.v1", [value, family()])).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });
  it("rejects font-family arithmetic during token resolution", () => {
    const value = createExpression({ operation: "portable.math.add.v1", operands: [family(), family()] });
    expect(resolveToken("p", [token("a", "fontFamily", value)], "a", selection)).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });
  it("does not reinterpret a font-family reference as a numeric operand", () => {
    const value = createExpression({ operation: "portable.math.add.v1", operands: [reference("family"), createNumberLiteral("1")] });
    const tokens = [token("a", "number", value), token("family", "fontFamily", family())];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "type-mismatch" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
});
