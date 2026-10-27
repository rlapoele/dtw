import { describe, expect, it } from "vitest";
import type { ExpressionValue } from "../../src/domain/expression";
import { createExpression } from "../../src/domain/expression";
import { createNumberLiteral as number, createDimensionLiteral as dimension } from "../../src/domain/numeric-literals";
import { createToken } from "../../src/domain/token";
import type { ImplementedAuthoredValue } from "../../src/domain/token";
import { createTokenReference } from "../../src/domain/token-reference";
import { resolveToken } from "../../src/domain/token-resolution";
import { validateProjectTokenReferences } from "../../src/domain/token-reference-validation";
import { createVariationAxis } from "../../src/domain/variation-axis";
import { completeVariationSelection, createVariationSelection } from "../../src/domain/variation-selection";

const axis = createVariationAxis({ id: "scheme", projectId: "p", name: "Scheme", options: [{ id: "light", name: "Light" }, { id: "dark", name: "Dark" }], defaultOptionId: "light" });
const light = completeVariationSelection([axis], createVariationSelection([]), createVariationSelection([]));
const dark = completeVariationSelection([axis], createVariationSelection([]), createVariationSelection([{ axisId: "scheme", optionId: "dark" }]));
const ref = (targetTokenId: string) => createTokenReference({ targetTokenId, valuePath: [] });
const expression = (name: string, operands: Parameters<typeof createExpression>[0]["operands"]) => createExpression({ operation: `portable.math.${name}.v1`, operands });
function token(id: string, value: ImplementedAuthoredValue, type = "number") {
  return createToken({ id, projectId: "p", localName: id, parentGroupId: null, regeneration: "allowed", definition: { type, assignments: [{ condition: [], value }] } }, [axis]);
}

describe("expression resolution", () => {
  it("evaluates nested expressions and preserves the authored AST", () => {
    const ast = expression("clamp", [number("1"), expression("add", [number("0.1"), expression("scale", [number("1.25"), number("2")])]), number("3")]);
    const source = token("a", ast);
    const before = JSON.stringify(source);
    expect(resolveToken("p", [source], "a", light)).toMatchObject({ status: "resolved", value: number("2.6") });
    expect(JSON.stringify(source)).toBe(before);
  });
  it("resolves references under the same selection and uses slot types", () => {
    const source = token("size", expression("scale", [ref("base"), ref("ratio")]), "dimension");
    const base = createToken({ id: "base", projectId: "p", localName: "base", parentGroupId: null, regeneration: "allowed", definition: { type: "dimension", assignments: [
      { condition: [], value: dimension("1", "rem") },
      { condition: [{ axisId: "scheme", optionId: "dark" }], value: dimension("2", "rem") },
    ] } }, [axis]);
    const tokens = [source, base, token("ratio", number("1.5"))];
    expect(resolveToken("p", tokens, "size", light)).toMatchObject({ status: "resolved", value: dimension("1.5", "rem") });
    expect(resolveToken("p", tokens, "size", dark)).toMatchObject({ status: "resolved", value: dimension("3", "rem") });
    expect(validateProjectTokenReferences("p", tokens, light)).toEqual([]);
  });
  it("evaluates explicit context operands and mixed-unit expressions", () => {
    const source = token("a", expression("add", [dimension("1", "rem"), { kind: "context-reference", key: "font.rootSize" }]), "dimension");
    expect(resolveToken("p", [source], "a", light)).toMatchObject({ status: "unresolved", reason: "context-required", diagnostics: [{ requiredContext: ["font.rootSize"] }] });
    expect(resolveToken("p", [source], "a", light, { "font.rootSize": dimension("16", "px") })).toMatchObject({ status: "resolved", value: dimension("32", "px") });
  });
  it("detects cycles through expressions and aliases", () => {
    const tokens = [token("a", expression("add", [ref("b"), number("1")])), token("b", ref("a"))];
    expect(resolveToken("p", tokens, "a", light)).toMatchObject({ status: "unresolved", reason: "reference-cycle", diagnostics: [{ cycle: ["a", "b", "a"] }] });
    expect(validateProjectTokenReferences("p", tokens, light)).toContainEqual(expect.objectContaining({ code: "reference-cycle" }));
  });
  it("does not confuse repeated dependencies with cycles", () => {
    const tokens = [token("a", expression("add", [ref("b"), ref("b")])), token("b", number("0.1"))];
    expect(resolveToken("p", tokens, "a", light)).toMatchObject({ status: "resolved", value: number("0.2") });
    expect(validateProjectTokenReferences("p", tokens, light)).toEqual([]);
  });
  it("propagates missing operands and rejects reference operand type mismatches", () => {
    const source = token("a", expression("scale", [dimension("1", "rem"), ref("factor")]), "dimension");
    expect(resolveToken("p", [source], "a", light)).toMatchObject({ status: "unresolved", reason: "missing-reference" });
    const tokens = [source, token("factor", dimension("2", "px"), "dimension")];
    expect(resolveToken("p", tokens, "a", light)).toMatchObject({ status: "unresolved", reason: "type-mismatch", diagnostics: [{ expectedType: "number", actualType: "dimension" }] });
    expect(validateProjectTokenReferences("p", tokens, light)).toContainEqual(expect.objectContaining({ code: "type-mismatch", targetTokenId: "factor", operandPath: [1] }));
  });
  it("reports operation failures with their AST location", () => {
    const source = token("a", expression("add", [number("1"), expression("clamp", [number("3"), number("2"), number("1")])]));
    expect(resolveToken("p", [source], "a", light)).toMatchObject({ status: "unresolved", reason: "invalid-expression", diagnostics: [{ expressionCode: "invalid-clamp-range", operandPath: [1] }] });
  });
  it("rejects invalid literal operands and incompatible root result types", () => {
    expect(resolveToken("p", [token("a", expression("add", [number("1"), dimension("1", "px")]))], "a", light)).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
    expect(resolveToken("p", [token("a", expression("add", [number("1"), number("2")]), "dimension")], "a", light)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
  it("validates references in inactive expression assignments", () => {
    const source = createToken({ id: "a", projectId: "p", localName: "a", parentGroupId: null, regeneration: "allowed", definition: { type: "number", assignments: [
      { condition: [], value: number("1") },
      { condition: [{ axisId: "scheme", optionId: "dark" }], value: expression("add", [number("1"), ref("missing")]) },
    ] } }, [axis]);
    expect(resolveToken("p", [source], "a", light).status).toBe("resolved");
    expect(validateProjectTokenReferences("p", [source], light)).toContainEqual(expect.objectContaining({ code: "missing-reference" }));
  });
  it("diagnoses repairable unknown operations and malformed known arity", () => {
    // These fixtures model loaded ASTs that bypass normal factory validation.
    const unknown = { kind: "expression", operation: "portable.math.divide.v1", operands: [number("1"), number("2")] } as unknown as ExpressionValue;
    const malformed = { kind: "expression", operation: "portable.math.add.v1", operands: [number("1")] } as unknown as ExpressionValue;
    expect(resolveToken("p", [token("a", unknown)], "a", light)).toMatchObject({ status: "unresolved", reason: "unsupported-expression" });
    expect(resolveToken("p", [token("a", malformed)], "a", light)).toMatchObject({ status: "unresolved", reason: "invalid-expression", diagnostics: [{ expressionCode: "invalid-arity" }] });
  });
  it("detects a cycle in a later expression operand", () => {
    const tokens = [token("a", expression("add", [ref("base"), ref("b")])), token("base", number("1")), token("b", ref("a"))];
    expect(resolveToken("p", tokens, "a", light)).toMatchObject({ status: "unresolved", reason: "reference-cycle" });
    expect(validateProjectTokenReferences("p", tokens, light)).toContainEqual(expect.objectContaining({ code: "reference-cycle" }));
  });
  it("does not require unused context or infer a root size", () => {
    const source = token("a", expression("add", [dimension("1", "rem"), dimension("1", "px")]), "dimension");
    expect(resolveToken("p", [source], "a", light)).toMatchObject({ status: "unresolved", reason: "context-required" });
    expect(resolveToken("p", [source], "a", light, { "font.rootSize": dimension("12.5", "px") })).toMatchObject({ status: "resolved", value: dimension("13.5", "px") });
  });

});
