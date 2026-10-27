import { describe, expect, it } from "vitest";

import { createFontWeightLiteral } from "../../src/domain/font-weight-literal";
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
  id: "contrast", projectId: "p", name: "Contrast",
  options: [{ id: "normal", name: "Normal" }, { id: "high", name: "High" }],
  defaultOptionId: "normal",
});
const empty = createVariationSelection([]);
const normal = completeVariationSelection([axis], empty, empty);
const reference = (targetTokenId: string) => createTokenReference({ targetTokenId, valuePath: [] });
function token(id: string, type: string, value: ImplementedAuthoredValue) {
  return createToken({
    id, projectId: "p", localName: id, parentGroupId: null, regeneration: "allowed",
    definition: { type, assignments: [{ condition: [], value }] },
  }, [axis]);
}

describe("createFontWeightLiteral", () => {
  it.each(["1", "100", "350", "400", "1000", "450.5", "999.99999999999999999999"])(
    "preserves exact numeric weight %s", value => {
      expect(createFontWeightLiteral(value)).toEqual({ kind: "literal", valueType: "fontWeight", value });
    },
  );
  it.each(["0", "-1", "0.99999999999999999999", "1000.00000000000000000001"])(
    "rejects weights outside the inclusive range [1, 1000]: %s", value => {
      expect(() => createFontWeightLiteral(value)).toThrow(RangeError);
    },
  );
  it.each(["", "normal", "bold", "extra-bold", "400.0", "0400", "4e2", "+400", " 400", "400 ", "NaN", "Infinity"])(
    "rejects named or non-canonical input %j", value => {
      expect(() => createFontWeightLiteral(value)).toThrow(RangeError);
    },
  );
});

describe("font-weight assignments, aliases, and resolution", () => {
  it("adds a weight to a typed-unassigned token without mutating the source", () => {
    const source = createToken({ id: "a", projectId: "p", localName: "a", parentGroupId: null, regeneration: "allowed", definition: { type: "fontWeight", assignments: [] } }, [axis]);
    const changed = addTokenAssignment(source, { condition: [], value: createFontWeightLiteral("450.5") }, [axis]);
    expect(source.definition?.assignments).toEqual([]);
    expect(resolveToken("p", [changed], "a", normal)).toMatchObject({ status: "resolved", value: createFontWeightLiteral("450.5") });
  });
  it.each(["number", "dimension", "percentage", "duration"])("rejects fontWeight assignments on %s tokens", type => {
    expect(() => token("a", type, createFontWeightLiteral("400"))).toThrow(RangeError);
  });
  it.each([createNumberLiteral("400"), createDimensionLiteral("400", "px")])("rejects $valueType assignments on fontWeight tokens", value => {
    expect(() => token("a", "fontWeight", value)).toThrow(RangeError);
  });
  it("validates and resolves aliases without changing authored values or references", () => {
    const tokens = [token("a", "fontWeight", reference("b")), token("b", "fontWeight", reference("c")), token("c", "fontWeight", createFontWeightLiteral("450.5"))];
    const before = JSON.stringify(tokens);
    expect(validateProjectTokenReferences("p", tokens, normal)).toEqual([]);
    expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "resolved", value: createFontWeightLiteral("450.5"), trace: [{ tokenId: "a" }, { tokenId: "b" }, { tokenId: "c" }] });
    expect(JSON.stringify(tokens)).toBe(before);
  });
  it.each([["number", "fontWeight"], ["fontWeight", "number"]])("rejects aliases from %s to %s", (sourceType, targetType) => {
    const tokens = [token("a", sourceType, reference("b")), token("b", targetType, targetType === "fontWeight" ? createFontWeightLiteral("400") : createNumberLiteral("400"))];
    expect(validateProjectTokenReferences("p", tokens, normal)).toContainEqual(expect.objectContaining({ code: "type-mismatch" }));
    expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
  it("resolves target weights under the same completed variation selection", () => {
    const target = addTokenAssignment(token("base", "fontWeight", createFontWeightLiteral("400")), { condition: [{ axisId: "contrast", optionId: "high" }], value: createFontWeightLiteral("650.5") }, [axis]);
    const high = completeVariationSelection([axis], empty, createVariationSelection([{ axisId: "contrast", optionId: "high" }]));
    const tokens = [token("a", "fontWeight", reference("base")), target];
    expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "resolved", value: createFontWeightLiteral("400") });
    expect(resolveToken("p", tokens, "a", high)).toMatchObject({ status: "resolved", value: createFontWeightLiteral("650.5") });
  });
  it("keeps the internal value outside supported reference paths", () => {
    const tokens = [token("a", "number", createTokenReference({ targetTokenId: "b", valuePath: [{ kind: "field", key: "value" }] })), token("b", "fontWeight", createFontWeightLiteral("400"))];
    expect(validateProjectTokenReferences("p", tokens, normal)).toContainEqual(expect.objectContaining({ code: "unsupported-value-path" }));
    expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path" });
  });
});

describe("font weight remains excluded from expression operations", () => {
  it.each(PORTABLE_OPERATION_IDS)("rejects fontWeight in %s", operation => {
    const value = createFontWeightLiteral("400");
    const operands = operation === "portable.math.clamp.v1" ? [value, value, value]
      : [value, operation === "portable.math.scale.v1" ? createNumberLiteral("2") : value];
    expect(evaluatePortableOperation(operation, operands)).toMatchObject({ status: "unresolved", reason: "invalid-expression", code: "invalid-operands" });
  });
  it.each([createNumberLiteral("2"), createDimensionLiteral("2", "rem")])("rejects fontWeight as the scalar for $valueType", value => {
    expect(evaluatePortableOperation("portable.math.scale.v1", [value, createFontWeightLiteral("400")])).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });
  it("rejects fontWeight arithmetic during token resolution", () => {
    const value = createExpression({ operation: "portable.math.add.v1", operands: [createFontWeightLiteral("400"), createFontWeightLiteral("100")] });
    expect(resolveToken("p", [token("a", "fontWeight", value)], "a", normal)).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });
  it("does not reinterpret fontWeight references as numeric operand values", () => {
    const value = createExpression({ operation: "portable.math.scale.v1", operands: [createDimensionLiteral("1", "rem"), reference("weight")] });
    const tokens = [token("a", "dimension", value), token("weight", "fontWeight", createFontWeightLiteral("400"))];
    expect(validateProjectTokenReferences("p", tokens, normal)).toContainEqual(expect.objectContaining({ code: "type-mismatch", operandPath: [1] }));
    expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
});
