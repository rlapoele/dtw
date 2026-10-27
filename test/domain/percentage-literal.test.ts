import { describe, expect, it } from "vitest";

import { createPercentageLiteral } from "../../src/domain/percentage-literal";
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
  id: "density", projectId: "p", name: "Density",
  options: [{ id: "normal", name: "Normal" }, { id: "expanded", name: "Expanded" }],
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

describe("createPercentageLiteral", () => {
  it.each(["0", "0.5", "1", "1.25", "-0.1", "12345678901234567890.123456789"])(
    "stores the exact canonical ratio %s without imposing a range", ratio => {
      expect(createPercentageLiteral(ratio)).toEqual({
        kind: "literal", valueType: "percentage", ratio,
      });
    },
  );
  it.each(["", "50%", "0.50", "-0", ".5", "1e-2", " 0.5", "NaN", "Infinity"])(
    "rejects non-canonical ratio text %j", ratio => {
      expect(() => createPercentageLiteral(ratio)).toThrow(RangeError);
    },
  );
});

describe("percentage token assignments and resolution", () => {
  it("adds a percentage to a typed-unassigned token and resolves its ratio", () => {
    const source = createToken({
      id: "a", projectId: "p", localName: "a", parentGroupId: null, regeneration: "allowed",
      definition: { type: "percentage", assignments: [] },
    }, [axis]);
    const changed = addTokenAssignment(source, { condition: [], value: createPercentageLiteral("1.25") }, [axis]);
    expect(source.definition?.assignments).toEqual([]);
    expect(resolveToken("p", [changed], "a", selection)).toMatchObject({
      status: "resolved", value: { kind: "literal", valueType: "percentage", ratio: "1.25" },
    });
  });

  it.each(["number", "dimension"])("rejects percentage assignments on %s tokens", type => {
    expect(() => token("a", type, createPercentageLiteral("0.5"))).toThrow(RangeError);
  });

  it.each([createNumberLiteral("0.5"), createDimensionLiteral("0.5", "rem")])(
    "rejects $valueType assignments on percentage tokens", value => {
      expect(() => token("a", "percentage", value)).toThrow(RangeError);
    },
  );

  it("validates and resolves percentage alias chains without changing authored data", () => {
    const tokens = [token("a", "percentage", reference("b")), token("b", "percentage", reference("c")), token("c", "percentage", createPercentageLiteral("-0.1"))];
    const before = JSON.stringify(tokens);
    expect(validateProjectTokenReferences("p", tokens, selection)).toEqual([]);
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({
      status: "resolved", value: createPercentageLiteral("-0.1"),
      trace: [{ tokenId: "a" }, { tokenId: "b" }, { tokenId: "c" }],
    });
    expect(JSON.stringify(tokens)).toBe(before);
  });

  it.each([
    ["number", "percentage"], ["percentage", "number"],
    ["dimension", "percentage"], ["percentage", "dimension"],
  ])("rejects an alias from %s to %s", (sourceType, targetType) => {
    const targetValue = targetType === "percentage" ? createPercentageLiteral("0.5")
      : targetType === "number" ? createNumberLiteral("0.5") : createDimensionLiteral("0.5", "px");
    const tokens = [token("a", sourceType, reference("b")), token("b", targetType, targetValue)];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "type-mismatch" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });

  it("selects target percentage assignments under the same completed variation selection", () => {
    const base = token("base", "percentage", createPercentageLiteral("0.5"));
    const varied = addTokenAssignment(base, {
      condition: [{ axisId: "density", optionId: "expanded" }], value: createPercentageLiteral("1.25"),
    }, [axis]);
    const tokens = [token("a", "percentage", reference("base")), varied];
    const expanded = completeVariationSelection([axis], empty, createVariationSelection([{ axisId: "density", optionId: "expanded" }]));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "resolved", value: createPercentageLiteral("0.5") });
    expect(resolveToken("p", tokens, "a", expanded)).toMatchObject({ status: "resolved", value: createPercentageLiteral("1.25") });
  });

  it("keeps the ratio field outside the supported reference paths", () => {
    const tokens = [token("a", "number", createTokenReference({ targetTokenId: "b", valuePath: [{ kind: "field", key: "ratio" }] })), token("b", "percentage", createPercentageLiteral("0.5"))];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "unsupported-value-path" }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path" });
  });
});

describe("percentages remain excluded from portable operations", () => {
  it.each(PORTABLE_OPERATION_IDS)("rejects percentage quantities in %s", operation => {
    const operands = operation === "portable.math.clamp.v1"
      ? [createPercentageLiteral("0"), createPercentageLiteral("0.5"), createPercentageLiteral("1")]
      : [createPercentageLiteral("0.5"), operation === "portable.math.scale.v1" ? createNumberLiteral("2") : createPercentageLiteral("1")];
    expect(evaluatePortableOperation(operation, operands)).toMatchObject({ status: "unresolved", reason: "invalid-expression", code: "invalid-operands" });
  });

  it.each([createNumberLiteral("2"), createDimensionLiteral("2", "rem")])(
    "rejects percentage as a scalar for $valueType", quantity => {
      expect(evaluatePortableOperation("portable.math.scale.v1", [quantity, createPercentageLiteral("0.5")])).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
    },
  );

  it("rejects percentage arithmetic through token resolution", () => {
    const value = createExpression({ operation: "portable.math.add.v1", operands: [createPercentageLiteral("0.5"), createPercentageLiteral("0.5")] });
    expect(resolveToken("p", [token("a", "percentage", value)], "a", selection)).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });

  it("does not reinterpret a percentage reference as a numeric expression operand", () => {
    const value = createExpression({ operation: "portable.math.scale.v1", operands: [createDimensionLiteral("2", "rem"), reference("ratio")] });
    const tokens = [token("a", "dimension", value), token("ratio", "percentage", createPercentageLiteral("0.5"))];
    expect(validateProjectTokenReferences("p", tokens, selection)).toContainEqual(expect.objectContaining({ code: "type-mismatch", operandPath: [1] }));
    expect(resolveToken("p", tokens, "a", selection)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
});
