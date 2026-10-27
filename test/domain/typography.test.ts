import { describe, expect, it } from "vitest";
import { createTypography, TYPOGRAPHY_FIELDS } from "../../src/domain/typography";
import type { TypographyInput } from "../../src/domain/typography";
import { createFontFamilyLiteral } from "../../src/domain/font-family-literal";
import { createFontWeightLiteral } from "../../src/domain/font-weight-literal";
import { createNumberLiteral as number, createDimensionLiteral as dimension } from "../../src/domain/numeric-literals";
import { createExpression } from "../../src/domain/expression";
import { createToken, addTokenAssignment } from "../../src/domain/token";
import type { ImplementedAuthoredValue, Token } from "../../src/domain/token";
import { createTokenReference } from "../../src/domain/token-reference";
import { validateProjectTokenReferences } from "../../src/domain/token-reference-validation";
import { resolveToken } from "../../src/domain/token-resolution";
import { createVariationAxis } from "../../src/domain/variation-axis";
import { completeVariationSelection, createVariationSelection } from "../../src/domain/variation-selection";

const family = createFontFamilyLiteral([{ kind: "named", name: "Inter" }, { kind: "generic", family: "sans-serif" }]);
const ref = (targetTokenId: string) => createTokenReference({ targetTokenId, valuePath: [] });
const fields = () => ({ fontFamily: family, fontSize: dimension("1", "rem"), fontWeight: createFontWeightLiteral("450.5"), letterSpacing: dimension("-0.2", "px"), lineHeight: number("1.5") });
const axis = createVariationAxis({ id: "contrast", projectId: "p", name: "Contrast", options: [{ id: "normal", name: "Normal" }, { id: "high", name: "High" }], defaultOptionId: "normal" });
const empty = createVariationSelection([]);
const normal = completeVariationSelection([axis], empty, empty);
const highCondition = [{ axisId: "contrast", optionId: "high" }];
const high = completeVariationSelection([axis], empty, createVariationSelection(highCondition));
function token(id: string, type: string, value: ImplementedAuthoredValue, projectId = "p") {
  return createToken({ id, projectId, localName: id, parentGroupId: null, regeneration: "allowed", definition: { type, assignments: [{ condition: [], value }] } }, projectId === "p" ? [axis] : []);
}

describe("createTypography", () => {
  it("preserves explicit literal fields, authored units, and signed spacing", () => {
    expect(createTypography(fields())).toEqual({ kind: "composite", valueType: "typography", ...fields() });
  });
  it.each(TYPOGRAPHY_FIELDS)("requires %s without supplying a default", field => {
    const input: Record<string, unknown> = { ...fields() };
    delete input[field];
    expect(() => createTypography(input as unknown as TypographyInput)).toThrow(RangeError);
  });
  it.each(TYPOGRAPHY_FIELDS)("rejects a wrongly typed literal or direct expression in %s", field => {
    const wrong = field === "lineHeight" ? dimension("1", "px") : number("1");
    const expression = createExpression({ operation: "portable.math.add.v1", operands: [number("1"), number("2")] });
    for (const value of [wrong, expression]) {
      expect(() => createTypography({ ...fields(), [field]: value } as unknown as TypographyInput)).toThrow(RangeError);
    }
  });
  it.each(["fontSize", "lineHeight"] as const)("enforces non-negative %s, including zero", field => {
    const zero = field === "fontSize" ? dimension("0", "px") : number("0");
    const negative = field === "fontSize" ? dimension("-0.00000000000000000001", "rem") : number("-0.00000000000000000001");
    expect(createTypography({ ...fields(), [field]: zero })[field]).toEqual(zero);
    expect(() => createTypography({ ...fields(), [field]: negative })).toThrow(RangeError);
  });
  it("copies constituent values and references without normalizing them", () => {
    const input = { ...fields(), fontSize: ref("size") };
    const value = createTypography(input);
    expect(value.fontFamily).toEqual(input.fontFamily);
    expect(value.fontFamily).not.toBe(input.fontFamily);
    expect(value.fontSize).toEqual(input.fontSize);
    expect(value.fontSize).not.toBe(input.fontSize);
  });
});

describe("typography assignments and resolution", () => {
  it("adds to a typed-unassigned token without mutating it", () => {
    const source = createToken({ id: "a", projectId: "p", localName: "a", parentGroupId: null, regeneration: "allowed", definition: { type: "typography", assignments: [] } }, [axis]);
    const changed = addTokenAssignment(source, { condition: [], value: createTypography(fields()) }, [axis]);
    expect(source.definition?.assignments).toEqual([]);
    expect(resolveToken("p", [changed], "a", normal)).toMatchObject({ status: "resolved", value: { kind: "composite", valueType: "typography", ...fields() } });
  });
  it("rejects wrong token assignment types", () => {
    expect(() => token("a", "transition", createTypography(fields()))).toThrow(RangeError);
    expect(() => token("a", "typography", number("1"))).toThrow(RangeError);
  });
  it("resolves whole-value aliases and all five typed field references", () => {
    const value = createTypography({ fontFamily: ref("family"), fontSize: ref("size"), fontWeight: ref("weight"), letterSpacing: ref("spacing"), lineHeight: ref("height") });
    const tokens = [token("a", "typography", ref("b")), token("b", "typography", value), token("family", "fontFamily", family), token("size", "dimension", fields().fontSize), token("weight", "fontWeight", fields().fontWeight), token("spacing", "dimension", fields().letterSpacing), token("height", "number", fields().lineHeight)];
    const before = JSON.stringify(tokens);
    expect(validateProjectTokenReferences("p", tokens, normal)).toEqual([]);
    expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "resolved", value: { kind: "composite", valueType: "typography", ...fields() } });
    expect(JSON.stringify(tokens)).toBe(before);
  });
  it("selects each field target independently under the same completed selection", () => {
    const size = addTokenAssignment(token("size", "dimension", dimension("1", "rem")), { condition: highCondition, value: dimension("20", "px") }, [axis]);
    const weight = addTokenAssignment(token("weight", "fontWeight", createFontWeightLiteral("400")), { condition: highCondition, value: createFontWeightLiteral("650.5") }, [axis]);
    const source = token("a", "typography", createTypography({ ...fields(), fontSize: ref("size"), fontWeight: ref("weight") }));
    expect(resolveToken("p", [source, size, weight], "a", high)).toMatchObject({ status: "resolved", value: { fontSize: dimension("20", "px"), fontWeight: createFontWeightLiteral("650.5"), lineHeight: number("1.5") } });
  });
  it.each(["fontSize", "lineHeight"] as const)("checks referenced %s sign after resolution", field => {
    const value = field === "fontSize" ? dimension("-1", "rem") : number("-1");
    const target = token("negative", field === "fontSize" ? "dimension" : "number", value);
    const source = token("a", "typography", createTypography({ ...fields(), [field]: ref("negative") }));
    expect(resolveToken("p", [target], "negative", normal).status).toBe("resolved");
    expect(resolveToken("p", [source, target], "a", normal)).toMatchObject({ status: "unresolved", reason: "invalid-composite", diagnostics: [{ field, fieldOwnerId: "a" }] });
  });
  it("keeps negative letter spacing valid through a reference and repeated dimension dependencies cycle-free", () => {
    const source = token("a", "typography", createTypography({ ...fields(), letterSpacing: ref("spacing") }));
    const spacing = token("spacing", "dimension", dimension("-1", "px"));
    expect(resolveToken("p", [source, spacing], "a", normal)).toMatchObject({ status: "resolved", value: { letterSpacing: dimension("-1", "px") } });
    const repeated = token("b", "typography", createTypography({ ...fields(), fontSize: ref("shared"), letterSpacing: ref("shared") }));
    const shared = token("shared", "dimension", dimension("0", "rem"));
    expect(validateProjectTokenReferences("p", [repeated, shared], normal)).toEqual([]);
    expect(resolveToken("p", [repeated, shared], "b", normal).status).toBe("resolved");
  });
  it.each(TYPOGRAPHY_FIELDS)("reports missing and wrong-type targets in %s", field => {
    const source = token("a", "typography", createTypography({ ...fields(), [field]: ref("target") }));
    expect(validateProjectTokenReferences("p", [source], normal)).toContainEqual(expect.objectContaining({ code: "missing-reference", field }));
    expect(resolveToken("p", [source], "a", normal)).toMatchObject({ status: "unresolved", reason: "missing-reference", diagnostics: [{ field }] });
    const wrong = field === "lineHeight" ? token("target", "dimension", dimension("1", "px")) : token("target", "number", number("1"));
    expect(validateProjectTokenReferences("p", [source, wrong], normal)).toContainEqual(expect.objectContaining({ code: "type-mismatch", field }));
    expect(resolveToken("p", [source, wrong], "a", normal)).toMatchObject({ status: "unresolved", reason: "type-mismatch", diagnostics: [{ field }] });
  });
  it("rejects foreign field targets", () => {
    const source = token("a", "typography", createTypography({ ...fields(), fontSize: ref("foreign") }));
    const foreign = token("foreign", "dimension", dimension("1", "rem"), "other");
    expect(validateProjectTokenReferences("p", [source, foreign], normal)).toContainEqual(expect.objectContaining({ code: "cross-project-reference", field: "fontSize" }));
    expect(resolveToken("p", [source, foreign], "a", normal)).toMatchObject({ status: "unresolved", reason: "cross-project-reference" });
  });
  it("propagates missing assignments and cycles through field dependencies", () => {
    const source = token("a", "typography", createTypography({ ...fields(), fontSize: ref("size") }));
    const emptySize = createToken({ id: "size", projectId: "p", localName: "size", parentGroupId: null, regeneration: "allowed", definition: { type: "dimension", assignments: [] } }, [axis]);
    expect(resolveToken("p", [source, emptySize], "a", normal)).toMatchObject({ status: "unresolved", reason: "missing-assignment", diagnostics: [{ field: "fontSize" }] });
    const cyclic = token("size", "dimension", ref("size"));
    expect(validateProjectTokenReferences("p", [source, cyclic], normal)).toContainEqual(expect.objectContaining({ code: "reference-cycle" }));
    expect(resolveToken("p", [source, cyclic], "a", normal)).toMatchObject({ status: "unresolved", reason: "reference-cycle" });
  });
  it("does not merge assignments or fall back when a selected field fails", () => {
    const source = addTokenAssignment(token("a", "typography", createTypography(fields())), { condition: highCondition, value: createTypography({ ...fields(), fontSize: ref("missing") }) }, [axis]);
    expect(resolveToken("p", [source], "a", normal).status).toBe("resolved");
    expect(resolveToken("p", [source], "a", high)).toMatchObject({ status: "unresolved", reason: "missing-reference" });
    expect(validateProjectTokenReferences("p", [source], normal)).toContainEqual(expect.objectContaining({ code: "missing-reference", field: "fontSize" }));
  });
  it("allows references to independently evaluated dimension and number tokens", () => {
    const source = token("a", "typography", createTypography({ ...fields(), fontSize: ref("size"), lineHeight: ref("height") }));
    const size = token("size", "dimension", createExpression({ operation: "portable.math.scale.v1", operands: [dimension("1", "rem"), number("2")] }));
    const height = token("height", "number", createExpression({ operation: "portable.math.add.v1", operands: [number("1"), number("0.5")] }));
    expect(resolveToken("p", [source, size, height], "a", normal)).toMatchObject({ status: "resolved", value: { fontSize: dimension("2", "rem"), lineHeight: number("1.5") } });
  });
  it("diagnoses malformed loaded fields and sign violations without throwing", () => {
    const source = token("a", "typography", createTypography(fields()));
    for (const value of [null, undefined, number("1"), dimension("-1", "rem")]) {
      const broken = { ...source, definition: { type: "typography", assignments: [{ condition: source.definition!.assignments[0].condition, value: { kind: "composite", valueType: "typography", ...fields(), fontSize: value } }] } } as unknown as Token;
      expect(resolveToken("p", [broken], "a", normal)).toMatchObject({ status: "unresolved", reason: "invalid-composite", diagnostics: [{ field: "fontSize" }] });
    }
  });
  it("rejects whole-value alias type mismatches and part-value paths", () => {
    const target = token("base", "typography", createTypography(fields()));
    const wrong = token("wrong", "number", ref("base"));
    expect(resolveToken("p", [wrong, target], "wrong", normal)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
    const part = token("part", "dimension", createTokenReference({ targetTokenId: "base", valuePath: [{ kind: "field", key: "fontSize" }] }));
    expect(resolveToken("p", [part, target], "part", normal)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path" });
    const fieldPart = token("fieldPart", "typography", createTypography({ ...fields(), fontSize: createTokenReference({ targetTokenId: "base", valuePath: [{ kind: "field", key: "fontSize" }] }) }));
    expect(validateProjectTokenReferences("p", [fieldPart, target], normal)).toContainEqual(expect.objectContaining({ code: "unsupported-value-path", field: "fontSize" }));
  });
  it("propagates ambiguity in a field target without selecting a tied candidate", () => {
    const locale = createVariationAxis({ id: "locale", projectId: "p", name: "Locale", options: [{ id: "latin", name: "Latin" }], defaultOptionId: "latin" });
    const axes = [axis, locale];
    const source = token("a", "typography", createTypography({ ...fields(), fontSize: ref("size") }));
    const size = createToken({ id: "size", projectId: "p", localName: "size", parentGroupId: null, regeneration: "allowed", definition: { type: "dimension", assignments: [
      { condition: highCondition, value: dimension("1", "rem") },
      { condition: [{ axisId: "locale", optionId: "latin" }], value: dimension("1", "rem") },
    ] } }, axes);
    const active = completeVariationSelection(axes, empty, createVariationSelection(highCondition));
    expect(resolveToken("p", [source, size], "a", active)).toMatchObject({ status: "unresolved", reason: "ambiguous-assignment", diagnostics: [{ field: "fontSize", fieldOwnerId: "a" }] });
  });
  it("accepts zero referenced size and line height without converting the multiplier", () => {
    const source = token("a", "typography", createTypography({ ...fields(), fontSize: ref("zeroSize"), lineHeight: ref("zeroHeight") }));
    const tokens = [source, token("zeroSize", "dimension", dimension("0", "rem")), token("zeroHeight", "number", number("0"))];
    expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "resolved", value: { fontSize: dimension("0", "rem"), lineHeight: number("0") } });
  });
  it("rejects numeric expression references to a whole typography value", () => {
    const target = token("base", "typography", createTypography(fields()));
    const source = token("a", "number", createExpression({ operation: "portable.math.add.v1", operands: [ref("base"), number("1")] }));
    expect(validateProjectTokenReferences("p", [source, target], normal)).toContainEqual(expect.objectContaining({ code: "type-mismatch" }));
    expect(resolveToken("p", [source, target], "a", normal)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
  it("rejects direct field expressions in repairable loaded data", () => {
    const source = token("a", "typography", createTypography(fields()));
    const expression = createExpression({ operation: "portable.math.add.v1", operands: [number("1"), number("0.5")] });
    const broken = { ...source, definition: { type: "typography", assignments: [{ condition: source.definition!.assignments[0].condition, value: { kind: "composite", valueType: "typography", ...fields(), lineHeight: expression } }] } } as unknown as Token;
    expect(resolveToken("p", [broken], "a", normal)).toMatchObject({ status: "unresolved", reason: "invalid-composite", diagnostics: [{ compositeCode: "invalid-typography-field", field: "lineHeight" }] });
  });

});
