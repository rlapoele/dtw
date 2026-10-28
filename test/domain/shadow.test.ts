import { describe, expect, it } from "vitest";
import { createShadow, SHADOW_FIELDS } from "../../src/domain/shadow";
import type { ShadowLayer } from "../../src/domain/shadow";
import { createColorLiteral } from "../../src/domain/color-literal";
import { createBooleanLiteral as boolean } from "../../src/domain/boolean-literal";
import { createDimensionLiteral as dimension, createNumberLiteral as number } from "../../src/domain/numeric-literals";
import { createExpression } from "../../src/domain/expression";
import { createToken, addTokenAssignment } from "../../src/domain/token";
import type { ImplementedAuthoredValue, Token } from "../../src/domain/token";
import { createTokenReference } from "../../src/domain/token-reference";
import { validateProjectTokenReferences } from "../../src/domain/token-reference-validation";
import { resolveToken } from "../../src/domain/token-resolution";
import { createVariationAxis } from "../../src/domain/variation-axis";
import { completeVariationSelection, createVariationSelection } from "../../src/domain/variation-selection";

const color = createColorLiteral({ colorSpace: "display-p3", components: ["1.2", "none", "0"], alpha: "0.25" });
const ref = (targetTokenId: string) => createTokenReference({ targetTokenId, valuePath: [] });
const layer = (): ShadowLayer => ({ color, offsetX: dimension("-1", "px"), offsetY: dimension("0.5", "rem"), blur: dimension("0", "rem"), spread: dimension("-2", "px"), inset: boolean(false) });
const axis = createVariationAxis({ id: "contrast", projectId: "p", name: "Contrast", options: [{ id: "normal", name: "Normal" }, { id: "high", name: "High" }], defaultOptionId: "normal" });
const empty = createVariationSelection([]);
const normal = completeVariationSelection([axis], empty, empty);
const highCondition = [{ axisId: "contrast", optionId: "high" }];
const high = completeVariationSelection([axis], empty, createVariationSelection(highCondition));
function token(id: string, type: string, value: ImplementedAuthoredValue, projectId = "p") {
  return createToken({ id, projectId, localName: id, parentGroupId: null, regeneration: "allowed", definition: { type, assignments: [{ condition: [], value }] } }, projectId === "p" ? [axis] : []);
}
function loaded(value: unknown): Token {
  const source = token("a", "shadow", createShadow({ layers: [layer()] }));
  return { ...source, definition: { ...source.definition!, assignments: [{ condition: source.definition!.assignments[0].condition, value }] } } as Token;
}

describe("createShadow", () => {
  it("preserves layer order, duplicates, exact color, signed dimensions, units, and explicit false", () => {
    const first = layer();
    const second = { ...layer(), inset: boolean(true), blur: dimension("4", "px") };
    expect(createShadow({ layers: [first, second, first] })).toEqual({ kind: "composite", valueType: "shadow", layers: [first, second, first] });
  });
  it.each([undefined, null, {}, [], new Array(1), [null], [undefined]])("rejects malformed or empty stacks: %j", layers => {
    expect(() => createShadow({ layers } as unknown as Parameters<typeof createShadow>[0])).toThrow(RangeError);
  });
  it.each(SHADOW_FIELDS)("requires %s without defaults", field => {
    const input: Record<string, unknown> = { ...layer() };
    delete input[field];
    expect(() => createShadow({ layers: [input as ShadowLayer] })).toThrow(RangeError);
  });
  it.each(SHADOW_FIELDS)("rejects wrong types and direct expressions in %s", field => {
    const expression = createExpression({ operation: "portable.math.add.v1", operands: [number("1"), number("2")] });
    for (const wrong of [number("1"), expression]) {
      expect(() => createShadow({ layers: [{ ...layer(), [field]: wrong } as ShadowLayer] })).toThrow(RangeError);
    }
  });
  it("rejects even very small negative blur but accepts zero", () => {
    expect(() => createShadow({ layers: [{ ...layer(), blur: dimension("-0.00000000000000000001", "rem") }] })).toThrow(RangeError);
    expect(createShadow({ layers: [layer()] }).layers[0].blur).toEqual(dimension("0", "rem"));
  });
  it("copies the array, layers, literals, color components, and reference paths", () => {
    const input = { layers: [layer(), { ...layer(), offsetX: ref("x") }] };
    const value = createShadow(input);
    expect(value.layers).not.toBe(input.layers);
    expect(value.layers[0]).not.toBe(input.layers[0]);
    expect(value.layers[0].color).not.toBe(color);
    if (value.layers[0].color.kind === "literal") expect(value.layers[0].color.components).not.toBe(color.components);
    expect(value.layers[1].offsetX).not.toBe(input.layers[1].offsetX);
    input.layers.reverse();
    expect(value.layers[0]).toEqual(layer());
  });
  it("rejects a whole-layer reference instead of flattening it", () => {
    expect(() => createShadow({ layers: [ref("other") as unknown as ShadowLayer] })).toThrow(RangeError);
  });
});

describe("shadow assignments and resolution", () => {
  it("adds a copied stack to a typed-unassigned token", () => {
    const source = createToken({ id: "a", projectId: "p", localName: "a", parentGroupId: null, regeneration: "allowed", definition: { type: "shadow", assignments: [] } }, [axis]);
    const value = createShadow({ layers: [layer()] });
    const changed = addTokenAssignment(source, { condition: [], value }, [axis]);
    expect(source.definition!.assignments).toEqual([]);
    expect(changed.definition!.assignments[0].value).not.toBe(value);
    expect(resolveToken("p", [changed], "a", normal)).toMatchObject({ status: "resolved", value });
  });
  it("rejects incompatible assignment types", () => {
    expect(() => token("a", "number", createShadow({ layers: [layer()] }))).toThrow(RangeError);
    expect(() => token("a", "shadow", number("1"))).toThrow(RangeError);
  });
  it("resolves multi-hop whole-stack aliases and all six typed field references without mutation", () => {
    const fields = Object.fromEntries(SHADOW_FIELDS.map(field => [field, ref(field)])) as ShadowLayer;
    const value = createShadow({ layers: [fields, layer()] });
    const tokens = [token("a", "shadow", ref("b")), token("b", "shadow", ref("base")), token("base", "shadow", value), ...SHADOW_FIELDS.map(field => {
      const literal = layer()[field];
      if (literal.kind !== "literal") throw new Error("Expected literal fixture");
      return token(field, literal.valueType, literal);
    })];
    const before = JSON.stringify(tokens);
    expect(validateProjectTokenReferences("p", tokens, normal)).toEqual([]);
    expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "resolved", value: { layers: [layer(), layer()] } });
    expect(JSON.stringify(tokens)).toBe(before);
  });
  it("selects fields and stack assignments under the same completed selection, preserving order and false", () => {
    const inset = addTokenAssignment(token("inset", "boolean", boolean(true)), { condition: highCondition, value: boolean(false) }, [axis]);
    const blur = addTokenAssignment(token("blur", "dimension", dimension("1", "rem")), { condition: highCondition, value: dimension("2", "px") }, [axis]);
    const source = addTokenAssignment(token("a", "shadow", createShadow({ layers: [layer()] })), { condition: highCondition, value: createShadow({ layers: [{ ...layer(), blur: ref("blur"), inset: ref("inset") }, layer()] }) }, [axis]);
    expect(resolveToken("p", [source, inset, blur], "a", high)).toMatchObject({ status: "resolved", value: { layers: [{ ...layer(), blur: dimension("2", "px"), inset: boolean(false) }, layer()] } });
  });
  it("checks referenced blur sign after expression evaluation at its precise layer", () => {
    const negative = token("negative", "dimension", createExpression({ operation: "portable.math.subtract.v1", operands: [dimension("1", "px"), dimension("2", "px")] }));
    const source = token("a", "shadow", createShadow({ layers: [layer(), { ...layer(), blur: ref("negative") }] }));
    expect(resolveToken("p", [negative], "negative", normal).status).toBe("resolved");
    expect(resolveToken("p", [source, negative], "a", normal)).toMatchObject({ status: "unresolved", reason: "invalid-composite", diagnostics: [{ compositeCode: "negative-shadow-blur", layerIndex: 1, field: "blur", fieldOwnerId: "a" }] });
  });
  it.each(SHADOW_FIELDS)("validates missing and wrong-type targets in %s with a layer index", field => {
    const source = token("a", "shadow", createShadow({ layers: [layer(), { ...layer(), [field]: ref("target") }] }));
    for (const tokens of [[source], [source, token("target", "number", number("1"))]]) {
      const code = tokens.length === 1 ? "missing-reference" : "type-mismatch";
      expect(validateProjectTokenReferences("p", tokens, normal)).toContainEqual(expect.objectContaining({ code, field, layerIndex: 1 }));
      expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "unresolved", reason: code, diagnostics: [{ field, layerIndex: 1, fieldOwnerId: "a" }] });
    }
  });
  it("validates inactive references without falling back after a selected failure", () => {
    const source = addTokenAssignment(token("a", "shadow", createShadow({ layers: [layer()] })), { condition: highCondition, value: createShadow({ layers: [layer(), { ...layer(), color: ref("missing") }] }) }, [axis]);
    expect(resolveToken("p", [source], "a", normal).status).toBe("resolved");
    expect(validateProjectTokenReferences("p", [source], normal)).toContainEqual(expect.objectContaining({ code: "missing-reference", layerIndex: 1, field: "color" }));
    expect(resolveToken("p", [source], "a", high)).toMatchObject({ status: "unresolved", reason: "missing-reference" });
  });
  it("rejects cross-project references, missing assignments, and cycles with field locations", () => {
    const source = token("a", "shadow", createShadow({ layers: [{ ...layer(), blur: ref("blur") }] }));
    const foreign = token("blur", "dimension", dimension("0", "px"), "other");
    const unassigned = createToken({ id: "blur", projectId: "p", localName: "blur", parentGroupId: null, regeneration: "allowed", definition: { type: "dimension", assignments: [] } }, [axis]);
    const cyclic = token("blur", "dimension", ref("blur"));
    for (const [target, reason] of [[foreign, "cross-project-reference"], [unassigned, "missing-assignment"], [cyclic, "reference-cycle"]] as const) {
      expect(resolveToken("p", [source, target], "a", normal)).toMatchObject({ status: "unresolved", reason, diagnostics: [{ field: "blur", layerIndex: 0 }] });
    }
    expect(validateProjectTokenReferences("p", [source, cyclic], normal)).toContainEqual(expect.objectContaining({ code: "reference-cycle" }));
  });
  it("allows repeated dependencies across fields and layers without false cycles", () => {
    const shared = token("shared", "dimension", dimension("0", "rem"));
    const value = createShadow({ layers: [{ ...layer(), offsetX: ref("shared"), blur: ref("shared") }, { ...layer(), offsetY: ref("shared") }] });
    const source = token("a", "shadow", value);
    expect(validateProjectTokenReferences("p", [source, shared], normal)).toEqual([]);
    expect(resolveToken("p", [source, shared], "a", normal)).toMatchObject({ status: "resolved", value: { layers: [{ ...layer(), offsetX: dimension("0", "rem"), blur: dimension("0", "rem") }, { ...layer(), offsetY: dimension("0", "rem") }] } });
  });
  it("rejects nonempty paths and numeric expressions referencing a whole shadow", () => {
    const base = token("base", "shadow", createShadow({ layers: [layer()] }));
    const part = token("part", "dimension", createTokenReference({ targetTokenId: "base", valuePath: [{ kind: "field", key: "layers" }] }));
    expect(resolveToken("p", [part, base], "part", normal)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path" });
    const numeric = token("numeric", "number", createExpression({ operation: "portable.math.add.v1", operands: [ref("base"), number("1")] }));
    expect(resolveToken("p", [numeric, base], "numeric", normal)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
  it("reports ambiguous field dependencies without picking a tied assignment", () => {
    const locale = createVariationAxis({ id: "locale", projectId: "p", name: "Locale", options: [{ id: "latin", name: "Latin" }], defaultOptionId: "latin" });
    const axes = [axis, locale];
    const blur = createToken({ id: "blur", projectId: "p", localName: "blur", parentGroupId: null, regeneration: "allowed", definition: { type: "dimension", assignments: [
      { condition: highCondition, value: dimension("1", "px") },
      { condition: [{ axisId: "locale", optionId: "latin" }], value: dimension("1", "px") },
    ] } }, axes);
    const source = token("a", "shadow", createShadow({ layers: [layer(), { ...layer(), blur: ref("blur") }] }));
    const selection = completeVariationSelection(axes, empty, createVariationSelection(highCondition));
    expect(resolveToken("p", [source, blur], "a", selection)).toMatchObject({ status: "unresolved", reason: "ambiguous-assignment", diagnostics: [{ field: "blur", layerIndex: 1, fieldOwnerId: "a" }] });
  });
  it("preserves location for unsupported field paths and expression failures behind references", () => {
    const partRef = createTokenReference({ targetTokenId: "target", valuePath: [{ kind: "field", key: "value" }] });
    const source = token("a", "shadow", createShadow({ layers: [layer(), { ...layer(), blur: partRef }] }));
    const target = token("target", "dimension", dimension("0", "px"));
    expect(validateProjectTokenReferences("p", [source, target], normal)).toContainEqual(expect.objectContaining({ code: "unsupported-value-path", field: "blur", layerIndex: 1 }));
    expect(resolveToken("p", [source, target], "a", normal)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path", diagnostics: [{ field: "blur", layerIndex: 1 }] });
    const mixed = token("target", "dimension", createExpression({ operation: "portable.math.add.v1", operands: [dimension("1", "rem"), dimension("2", "px")] }));
    const contextual = token("contextual", "shadow", createShadow({ layers: [{ ...layer(), blur: ref("target") }] }));
    expect(resolveToken("p", [contextual, mixed], "contextual", normal)).toMatchObject({ status: "unresolved", reason: "context-required", diagnostics: [{ field: "blur", layerIndex: 0 }] });
    expect(resolveToken("p", [contextual, mixed], "contextual", normal, { "font.rootSize": dimension("16", "px") })).toMatchObject({ status: "resolved", value: { layers: [{ blur: dimension("18", "px") }] } });
  });
  it.each([
    { kind: "expression", operation: "future.math.v1", operands: [] },
    { kind: "expression", operation: "portable.math.add.v1", operands: [] },
  ])("retains shadow field location for malformed referenced expressions: %j", value => {
    const source = token("a", "shadow", createShadow({ layers: [layer(), { ...layer(), blur: ref("target") }] }));
    const valid = token("target", "dimension", dimension("1", "px"));
    const target = { ...valid, definition: { ...valid.definition!, assignments: [{ condition: valid.definition!.assignments[0].condition, value }] } } as unknown as Token;
    expect(resolveToken("p", [source, target], "a", normal)).toMatchObject({ status: "unresolved", diagnostics: [{ field: "blur", layerIndex: 1, fieldOwnerId: "a" }] });
  });
  it("rejects direct expressions in loaded layers", () => {
    const expression = createExpression({ operation: "portable.math.add.v1", operands: [dimension("1", "px"), dimension("2", "px")] });
    const source = loaded({ kind: "composite", valueType: "shadow", layers: [{ ...layer(), blur: expression }] });
    expect(resolveToken("p", [source], "a", normal)).toMatchObject({ status: "unresolved", reason: "invalid-composite", diagnostics: [{ compositeCode: "invalid-shadow-field", field: "blur", layerIndex: 0 }] });
  });
  it.each([undefined, null, [], new Array(1), [null], [ref("other")]])("diagnoses malformed loaded stacks: %j", layers => {
    const source = loaded({ kind: "composite", valueType: "shadow", layers });
    expect(resolveToken("p", [source], "a", normal)).toMatchObject({ status: "unresolved", reason: "invalid-composite" });
    expect(() => validateProjectTokenReferences("p", [source], normal)).not.toThrow();
  });
  it.each(SHADOW_FIELDS)("diagnoses malformed loaded %s fields", field => {
    const source = loaded({ kind: "composite", valueType: "shadow", layers: [layer(), { ...layer(), [field]: number("1") }] });
    expect(resolveToken("p", [source], "a", normal)).toMatchObject({ status: "unresolved", reason: "invalid-composite", diagnostics: [{ compositeCode: "invalid-shadow-field", field, layerIndex: 1 }] });
  });
});
