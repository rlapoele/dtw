import { describe, expect, it } from "vitest";
import { canReviseColorToken } from "@application/color-revision-policy";
import { createColorLiteral } from "@domain/color-literal";
import { createToken } from "@domain/token";
import type { ImplementedAuthoredValue, Token, TokenValueAssignment } from "@domain/token";
import { createTokenReference } from "@domain/token-reference";
import { createNumberLiteral } from "@domain/numeric-literals";
import { createVariationCondition } from "@domain/variation-condition";
import { createExpression } from "@domain/expression";

const literal = createColorLiteral({ colorSpace: "srgb", components: ["0.123456789123456789", "none", "1"], alpha: "0.7" });
const assigned = createToken({
  id: "color", projectId: "p", localName: "exact", parentGroupId: null,
  regeneration: "allowed", definition: { type: "color", assignments: [{ condition: createVariationCondition([]), value: literal }] },
}, []);
function withValue(value: ImplementedAuthoredValue): Token {
  return { ...assigned, definition: { type: "color", assignments: [{ condition: createVariationCondition([]), value }] } };
}

describe("color revision eligibility", () => {
  it.each([undefined, "primitive", "semantic"] as const)("permits literal manual editing at layer %s, including protected tokens", layer => {
    for (const regeneration of ["allowed", "protected"] as const) {
      const token = { ...assigned, layer, authoring: { regeneration } };
      const before = JSON.stringify(token);
      expect(canReviseColorToken(token)).toBe(true);
      expect(JSON.stringify(token)).toBe(before);
    }
  });

  it.each(["target", "absent", "color"])("permits reference editing without resolving target %s", targetTokenId => {
    const token = withValue(createTokenReference({ targetTokenId, valuePath: [] }));
    const before = JSON.stringify(token);
    expect(canReviseColorToken(token)).toBe(true);
    expect(JSON.stringify(token)).toBe(before);
  });

  const conditional = [{ axisId: "axis", optionId: "option" }] as unknown as TokenValueAssignment["condition"];
  it.each([
    { label: "name-only", token: { ...assigned, definition: undefined } },
    { label: "unassigned", token: { ...assigned, definition: { type: "color" as const, assignments: [] } } },
    { label: "non-color", token: { ...assigned, definition: { ...assigned.definition!, type: "number" as const } } },
    { label: "missing assignment slot", token: { ...assigned, definition: { type: "color" as const, assignments: new Array<TokenValueAssignment>(1) } } },
    { label: "component", token: { ...assigned, layer: "component" as const } },
    { label: "conditional", token: { ...assigned, definition: { type: "color" as const, assignments: [{ condition: conditional, value: literal }] } } },
    { label: "multiple assignments", token: { ...assigned, definition: { type: "color" as const, assignments: [{ condition: createVariationCondition([]), value: literal }, { condition: conditional, value: literal }] } } },
    { label: "non-color literal", token: withValue(createNumberLiteral("1")) },
    { label: "expression", token: withValue(createExpression({ operation: "portable.math.add.v1", operands: [createNumberLiteral("1"), createNumberLiteral("2")] })) },
    // Recognizable loaded data does not authorize reinterpreting a composite as color.
    { label: "composite", token: withValue({ kind: "composite", valueType: "shadow", layers: [] } as unknown as ImplementedAuthoredValue) },
  ])("keeps $label tokens inspect-only without changing authored data", ({ token }) => {
    const before = JSON.stringify(token);
    expect(canReviseColorToken(token)).toBe(false);
    expect(JSON.stringify(token)).toBe(before);
  });
});
