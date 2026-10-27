import { describe, expect, it } from "vitest";

import { createBooleanLiteral } from "../../src/domain/boolean-literal";
import { createNumberLiteral, createDimensionLiteral } from "../../src/domain/numeric-literals";
import { createToken, addTokenAssignment, deriveTokenDefinitionState } from "../../src/domain/token";
import type { ImplementedAuthoredValue } from "../../src/domain/token";
import { createTokenReference } from "../../src/domain/token-reference";
import { validateProjectTokenReferences } from "../../src/domain/token-reference-validation";
import { resolveToken } from "../../src/domain/token-resolution";
import { createExpression, evaluatePortableOperation, PORTABLE_OPERATION_IDS } from "../../src/domain/expression";
import { createVariationAxis } from "../../src/domain/variation-axis";
import { completeVariationSelection, createVariationSelection } from "../../src/domain/variation-selection";

const axis = createVariationAxis({
  id: "mode", projectId: "p", name: "Mode",
  options: [{ id: "normal", name: "Normal" }, { id: "alternate", name: "Alternate" }],
  defaultOptionId: "normal",
});
const empty = createVariationSelection([]);
const selection = completeVariationSelection([axis], empty, empty);
const reference = (targetTokenId: string) => createTokenReference({ targetTokenId, valuePath: [] });
function token(id: string, type: string, value: ImplementedAuthoredValue) {
  return createToken({
    id, projectId: "p", localName: id, parentGroupId: null, regeneration: "allowed",
    definition: { type, assignments: [{ condition: [], value }] },
  }, [axis]);
}

describe("createBooleanLiteral", () => {
  it.each([true, false])("preserves the explicit boolean %s", value => {
    expect(createBooleanLiteral(value)).toEqual({ kind: "literal", valueType: "boolean", value });
  });
  it.each([
    { input: undefined }, { input: null }, { input: 0 }, { input: 1 },
    { input: "true" }, { input: "false" }, { input: "" },
    { input: [] }, { input: {} }, { input: NaN },
    { input: new Boolean(false) },
  ])("rejects non-boolean input without coercion: $input", ({ input }) => {
    expect(() => createBooleanLiteral(input)).toThrow(TypeError);
  });
});

describe("boolean assignments, aliases, and resolution", () => {
  it.each([true, false])("adds and resolves %s as an authored value rather than an absent assignment", value => {
    const source = createToken({ id: "a", projectId: "p", localName: "a", parentGroupId: null, regeneration: "allowed", definition: { type: "boolean", assignments: [] } }, [axis]);
    const changed = addTokenAssignment(source, { condition: [], value: createBooleanLiteral(value) }, [axis]);
    expect(source.definition?.assignments).toEqual([]);
    expect(deriveTokenDefinitionState(changed)).toBe("authored");
    expect(resolveToken("p", [changed], "a", selection)).toMatchObject({ status: "resolved", value: { kind: "literal", valueType: "boolean", value } });
  });
  it.each(["number", "string", "dimension"])("rejects boolean assignments on %s tokens", type => {
    expect(() => token("a", type, createBooleanLiteral(false))).toThrow(RangeError);
  });
  it.each([createNumberLiteral("0"), createNumberLiteral("1"), createDimensionLiteral("0", "px")])("rejects $valueType assignments on boolean tokens", value => {
    expect(() => token("a", "boolean", value)).toThrow(RangeError);
  });
  it.each([true, false])("validates and resolves %s through whole-value aliases without mutating authored data", value => {
    const tokens = [token("a", "boolean", reference("b")), token("b", "boolean", reference("c")), token("c", "boolean", createBooleanLiteral(value))];
    const before = JSON.stringify(tokens);
    expect(validateProjectTokenReferences("p", tokens, selection)).toEqual([]);
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "resolved", value: createBooleanLiteral(value), trace: [{ tokenId: "a" }, { tokenId: "b" }, { tokenId: "c" }] });
    expect(JSON.stringify(tokens)).toBe(before);
  });
  it.each([["number", "boolean"], ["boolean", "number"]])("rejects aliases from %s to %s", (sourceType, targetType) => {
    const tokens = [token("a", sourceType, reference("b")), token("b", targetType, targetType === "boolean" ? createBooleanLiteral(false) : createNumberLiteral("0"))];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "type-mismatch" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
  it("selects false over a true fallback under the same completed variation selection", () => {
    const target = addTokenAssignment(token("base", "boolean", createBooleanLiteral(true)), { condition: [{ axisId: "mode", optionId: "alternate" }], value: createBooleanLiteral(false) }, [axis]);
    const alternate = completeVariationSelection([axis], empty, createVariationSelection([{ axisId: "mode", optionId: "alternate" }]));
    const tokens = [token("a", "boolean", reference("base")), target];
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "resolved", value: createBooleanLiteral(true) });
    expect(resolveToken("p", tokens, "a", alternate)).toMatchObject({ status: "resolved", value: createBooleanLiteral(false) });
  });
  it("keeps part-value reference paths unsupported", () => {
    const tokens = [token("a", "boolean", createTokenReference({ targetTokenId: "b", valuePath: [{ kind: "field", key: "value" }] })), token("b", "boolean", createBooleanLiteral(false))];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "unsupported-value-path" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path" });
  });
});

describe("booleans remain excluded from expression operations", () => {
  it.each(PORTABLE_OPERATION_IDS)("rejects boolean quantities in %s", operation => {
    for (const boolean of [true, false]) {
      const value = createBooleanLiteral(boolean);
      const operands = operation === "portable.math.clamp.v1" ? [value, value, value]
        : [value, operation === "portable.math.scale.v1" ? createNumberLiteral("2") : value];
      expect(evaluatePortableOperation(operation, operands)).toMatchObject({ status: "unresolved", reason: "invalid-expression", code: "invalid-operands" });
    }
  });
  it.each([createNumberLiteral("2"), createDimensionLiteral("2", "rem")])("rejects boolean scalars for $valueType", value => {
    for (const boolean of [true, false]) {
      expect(evaluatePortableOperation("portable.math.scale.v1", [value, createBooleanLiteral(boolean)])).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
    }
  });
  it("rejects boolean arithmetic during token resolution", () => {
    const value = createExpression({ operation: "portable.math.add.v1", operands: [createBooleanLiteral(false), createBooleanLiteral(true)] });
    expect(resolveToken("p", [token("a", "boolean", value)], "a", selection)).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });
  it("does not coerce a boolean reference into a numeric expression operand", () => {
    const value = createExpression({ operation: "portable.math.scale.v1", operands: [createDimensionLiteral("1", "rem"), reference("flag")] });
    const tokens = [token("a", "dimension", value), token("flag", "boolean", createBooleanLiteral(false))];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "type-mismatch" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
});
