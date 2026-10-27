import { describe, expect, it } from "vitest";

import { createDurationLiteral } from "../../src/domain/duration-literal";
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
  id: "motion", projectId: "p", name: "Motion",
  options: [{ id: "standard", name: "Standard" }, { id: "alternate", name: "Alternate" }],
  defaultOptionId: "standard",
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

describe("createDurationLiteral", () => {
  it.each(["ms", "s"])("preserves exact signed values and explicit %s units", unit => {
    for (const value of ["0", "1", "-1", "0.125", "-0.125", "12345678901234567890.123456789"]) {
      expect(createDurationLiteral(value, unit)).toEqual({ kind: "literal", valueType: "duration", value, unit });
    }
  });
  it.each(["", "MS", "S", "sec", "min", "px", "rem", "%"])("rejects unsupported or missing unit %j", unit => {
    expect(() => createDurationLiteral("0", unit)).toThrow(RangeError);
  });
  it.each(["", ".5", "01", "0.50", "1e3", "-0", " 1", "1ms", "NaN", "Infinity"])("rejects non-canonical value %j", value => {
    expect(() => createDurationLiteral(value, "ms")).toThrow(RangeError);
  });
  it("preserves authored seconds and milliseconds without unit normalization", () => {
    expect(createDurationLiteral("0.2", "s")).toEqual({ kind: "literal", valueType: "duration", value: "0.2", unit: "s" });
    expect(createDurationLiteral("200", "ms")).toEqual({ kind: "literal", valueType: "duration", value: "200", unit: "ms" });
  });
});

describe("duration assignments, aliases, and resolution", () => {
  it("adds a duration to a typed-unassigned token and resolves it without mutating the token", () => {
    const source = createToken({ id: "a", projectId: "p", localName: "a", parentGroupId: null, regeneration: "allowed", definition: { type: "duration", assignments: [] } }, [axis]);
    const changed = addTokenAssignment(source, { condition: [], value: createDurationLiteral("200", "ms") }, [axis]);
    expect(source.definition?.assignments).toEqual([]);
    expect(resolveToken("p", [changed], "a", selection)).toMatchObject({ status: "resolved", value: createDurationLiteral("200", "ms") });
  });
  it.each(["number", "dimension", "percentage"])("rejects duration assignments on %s tokens", type => {
    expect(() => token("a", type, createDurationLiteral("1", "s"))).toThrow(RangeError);
  });
  it.each([createNumberLiteral("1"), createDimensionLiteral("1", "px")])("rejects $valueType assignments on duration tokens", value => {
    expect(() => token("a", "duration", value)).toThrow(RangeError);
  });
  it.each(["ms", "s"])("validates and resolves signed %s alias chains while preserving authored data", unit => {
    const value = createDurationLiteral("-0.125", unit);
    const tokens = [token("a", "duration", reference("b")), token("b", "duration", reference("c")), token("c", "duration", value)];
    const before = JSON.stringify(tokens);
    expect(validateProjectTokenReferences("p", tokens, selection)).toEqual([]);
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "resolved", value, trace: [{ tokenId: "a" }, { tokenId: "b" }, { tokenId: "c" }] });
    expect(JSON.stringify(tokens)).toBe(before);
  });
  it.each([["number", "duration"], ["duration", "number"], ["dimension", "duration"], ["duration", "dimension"]])("rejects aliases from %s to %s", (sourceType, targetType) => {
    const target = targetType === "duration" ? createDurationLiteral("1", "s")
      : targetType === "number" ? createNumberLiteral("1") : createDimensionLiteral("1", "px");
    const tokens = [token("a", sourceType, reference("b")), token("b", targetType, target)];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "type-mismatch" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
  it("selects target assignments under the same variation selection without converting units", () => {
    const base = token("base", "duration", createDurationLiteral("200", "ms"));
    const varied = addTokenAssignment(base, { condition: [{ axisId: "motion", optionId: "alternate" }], value: createDurationLiteral("0.2", "s") }, [axis]);
    const tokens = [token("a", "duration", reference("base")), varied];
    const alternate = completeVariationSelection([axis], empty, createVariationSelection([{ axisId: "motion", optionId: "alternate" }]));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "resolved", value: createDurationLiteral("200", "ms") });
    expect(resolveToken("p", tokens, "a", alternate)).toMatchObject({ status: "resolved", value: createDurationLiteral("0.2", "s") });
  });
  it("keeps duration representation fields outside supported reference paths", () => {
    const tokens = [token("a", "number", createTokenReference({ targetTokenId: "b", valuePath: [{ kind: "field", key: "value" }] })), token("b", "duration", createDurationLiteral("1", "s"))];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "unsupported-value-path" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path" });
  });
});

describe("duration remains excluded from expression operations", () => {
  it.each(PORTABLE_OPERATION_IDS)("rejects durations in %s", operation => {
    const value = createDurationLiteral("1", "s");
    const operands = operation === "portable.math.clamp.v1" ? [value, value, value]
      : [value, operation === "portable.math.scale.v1" ? createNumberLiteral("2") : value];
    expect(evaluatePortableOperation(operation, operands)).toMatchObject({ status: "unresolved", reason: "invalid-expression", code: "invalid-operands" });
  });
  it.each([createNumberLiteral("2"), createDimensionLiteral("2", "rem")])("rejects a duration as a scalar for $valueType", value => {
    expect(evaluatePortableOperation("portable.math.scale.v1", [value, createDurationLiteral("1", "s")])).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });
  it("rejects duration arithmetic during token resolution", () => {
    const value = createExpression({ operation: "portable.math.add.v1", operands: [createDurationLiteral("1", "s"), createDurationLiteral("200", "ms")] });
    expect(resolveToken("p", [token("a", "duration", value)], "a", selection)).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });
  it("rejects duration references in numeric operand slots", () => {
    const value = createExpression({ operation: "portable.math.scale.v1", operands: [createDimensionLiteral("1", "rem"), reference("time")] });
    const tokens = [token("a", "dimension", value), token("time", "duration", createDurationLiteral("1", "s"))];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "type-mismatch", operandPath: [1] }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
});
