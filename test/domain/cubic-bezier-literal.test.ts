import { describe, expect, it } from "vitest";

import { createCubicBezierLiteral } from "../../src/domain/cubic-bezier-literal";
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
const curve = () => createCubicBezierLiteral(["0.25", "-0.5", "0.75", "1.5"]);

describe("createCubicBezierLiteral", () => {
  it("preserves coordinate order and y overshoot", () => {
    expect(curve()).toEqual({ kind: "literal", valueType: "cubicBezier", controlPoints: ["0.25", "-0.5", "0.75", "1.5"] });
  });
  it("accepts inclusive x boundaries and exact y values beyond floating-point precision", () => {
    expect(createCubicBezierLiteral(["0", "-12345678901234567890.123456789", "1", "12345678901234567890.123456789"]).controlPoints).toEqual(["0", "-12345678901234567890.123456789", "1", "12345678901234567890.123456789"]);
  });
  it("does not impose x-coordinate ordering", () => {
    expect(createCubicBezierLiteral(["1", "0", "0", "1"]).controlPoints).toEqual(["1", "0", "0", "1"]);
  });
  it.each([{ points: [] }, { points: ["0", "0", "1"] }, { points: ["0", "0", "1", "1", "0"] }])(
    "rejects a coordinate count other than four: $points", ({ points }) => {
      expect(() => createCubicBezierLiteral(points)).toThrow(RangeError);
    },
  );
  it.each([0, 2])("rejects out-of-range x at index %s with exact Decimal comparisons", index => {
    for (const value of ["-0.00000000000000000001", "1.00000000000000000001"]) {
      const points = ["0", "0", "1", "1"];
      points[index] = value;
      expect(() => createCubicBezierLiteral(points)).toThrow(RangeError);
    }
  });
  it.each([0, 1, 2, 3])("rejects non-canonical and non-finite coordinates at index %s", index => {
    for (const value of ["NaN", "Infinity", "-Infinity", "0.50", "1e-2", "-0", ".5", " 0.5"]) {
      const points = ["0", "0", "1", "1"];
      points[index] = value;
      expect(() => createCubicBezierLiteral(points)).toThrow(RangeError);
    }
  });
  it("copies the input coordinate array", () => {
    const points = ["0", "0", "1", "1"];
    const literal = createCubicBezierLiteral(points);
    points[0] = "0.5";
    expect(literal.controlPoints).toEqual(["0", "0", "1", "1"]);
  });
});

describe("cubic Bézier assignments, aliases, and resolution", () => {
  it("adds a curve to a typed-unassigned token without mutating the token", () => {
    const source = createToken({ id: "a", projectId: "p", localName: "a", parentGroupId: null, regeneration: "allowed", definition: { type: "cubicBezier", assignments: [] } }, [axis]);
    const changed = addTokenAssignment(source, { condition: [], value: curve() }, [axis]);
    expect(source.definition?.assignments).toEqual([]);
    expect(resolveToken("p", [changed], "a", selection)).toMatchObject({ status: "resolved", value: curve() });
  });
  it.each(["number", "dimension", "percentage", "color"])("rejects a curve assignment on a %s token", type => {
    expect(() => token("a", type, curve())).toThrow(RangeError);
  });
  it.each([createNumberLiteral("0.5"), createDimensionLiteral("0.5", "px")])("rejects a $valueType assignment on a cubicBezier token", value => {
    expect(() => token("a", "cubicBezier", value)).toThrow(RangeError);
  });
  it("validates and resolves alias chains while preserving authored curves and references", () => {
    const tokens = [token("a", "cubicBezier", reference("b")), token("b", "cubicBezier", reference("c")), token("c", "cubicBezier", curve())];
    const before = JSON.stringify(tokens);
    expect(validateProjectTokenReferences("p", tokens, selection)).toEqual([]);
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "resolved", value: curve(), trace: [{ tokenId: "a" }, { tokenId: "b" }, { tokenId: "c" }] });
    expect(JSON.stringify(tokens)).toBe(before);
  });
  it.each([["number", "cubicBezier"], ["cubicBezier", "number"]])("rejects aliases from %s to %s", (sourceType, targetType) => {
    const tokens = [token("a", sourceType, reference("b")), token("b", targetType, targetType === "number" ? createNumberLiteral("0.5") : curve())];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "type-mismatch" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
  it("selects target curves under the same completed variation selection", () => {
    const alternate = createCubicBezierLiteral(["0", "0", "1", "1"]);
    const target = addTokenAssignment(token("base", "cubicBezier", curve()), {
      condition: [{ axisId: "motion", optionId: "alternate" }], value: alternate,
    }, [axis]);
    const tokens = [token("a", "cubicBezier", reference("base")), target];
    const active = completeVariationSelection([axis], empty, createVariationSelection([{ axisId: "motion", optionId: "alternate" }]));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "resolved", value: curve() });
    expect(resolveToken("p", tokens, "a", active)).toMatchObject({ status: "resolved", value: alternate });
  });
  it("does not expose control-point fields or indices as referenceable numbers", () => {
    const tokens = [token("a", "number", createTokenReference({ targetTokenId: "b", valuePath: [{ kind: "field", key: "controlPoints" }, { kind: "index", index: 0 }] })), token("b", "cubicBezier", curve())];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "unsupported-value-path" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path" });
  });
});

describe("cubic Bézier values remain excluded from expression operations", () => {
  it.each(PORTABLE_OPERATION_IDS)("rejects a curve in %s", operation => {
    const operands = operation === "portable.math.clamp.v1" ? [curve(), curve(), curve()]
      : [curve(), operation === "portable.math.scale.v1" ? createNumberLiteral("2") : curve()];
    expect(evaluatePortableOperation(operation, operands)).toMatchObject({ status: "unresolved", reason: "invalid-expression", code: "invalid-operands" });
  });
  it.each([createNumberLiteral("2"), createDimensionLiteral("2", "rem")])("rejects a curve as the scalar for $valueType", value => {
    expect(evaluatePortableOperation("portable.math.scale.v1", [value, curve()])).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });
  it("rejects curve expressions during token resolution", () => {
    const value = createExpression({ operation: "portable.math.add.v1", operands: [curve(), curve()] });
    expect(resolveToken("p", [token("a", "cubicBezier", value)], "a", selection)).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });
  it("rejects curve references in numeric operand slots", () => {
    const value = createExpression({ operation: "portable.math.scale.v1", operands: [createNumberLiteral("2"), reference("curve")] });
    const tokens = [token("a", "number", value), token("curve", "cubicBezier", curve())];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "type-mismatch", operandPath: [1] }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
});
