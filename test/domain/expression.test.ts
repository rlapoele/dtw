import { describe, expect, it } from "vitest";
import { addDecimals, subtractDecimals, multiplyDecimals, decimalFromCanonical } from "../../src/domain/decimal";
import { createExpression, evaluatePortableOperation, analyzeExpression } from "../../src/domain/expression";
import { createNumberLiteral as number, createDimensionLiteral as dimension } from "../../src/domain/numeric-literals";
import { createColorLiteral } from "../../src/domain/color-literal";
import { createTokenReference } from "../../src/domain/token-reference";

const decimal = decimalFromCanonical;
const op = (name: string) => `portable.math.${name}.v1`;

describe("exact decimal arithmetic", () => {
  it.each([
    ["0.1", "0.2", "0.3"], ["-1.25", "0.25", "-1"],
    ["999999999999999999999.9", "0.1", "1000000000000000000000"],
    ["-0.0001", "0.0001", "0"],
  ])("adds %s and %s exactly", (a, b, expected) => {
    expect(addDecimals(decimal(a), decimal(b))).toBe(expected);
  });
  it("subtracts with unequal scales and normalizes zero", () => {
    expect(subtractDecimals(decimal("0.1"), decimal("1.001"))).toBe("-0.901");
    expect(subtractDecimals(decimal("-2"), decimal("-2"))).toBe("0");
  });
  it("multiplies exactly without rounding", () => {
    expect(multiplyDecimals(decimal("-1.25"), decimal("0.008"))).toBe("-0.01");
    expect(multiplyDecimals(decimal("0"), decimal("-999"))).toBe("0");
  });
});

describe("portable operations", () => {
  it.each([
    ["add", ["0.1", "0.2"], "0.3"],
    ["subtract", ["1", "1.25"], "-0.25"],
    ["scale", ["1.25", "0.008"], "0.01"],
    ["min", ["-1.2", "-1.11"], "-1.2"],
    ["max", ["-1.2", "-1.11"], "-1.11"],
    ["clamp", ["1", "0", "3"], "1"],
    ["clamp", ["1", "2", "3"], "2"],
    ["clamp", ["1", "4", "3"], "3"],
  ])("evaluates number %s", (name, values, expected) => {
    expect(evaluatePortableOperation(op(name), values.map(number))).toEqual({ status: "evaluated", value: number(expected) });
  });
  it.each([
    ["add", ["1", "0.5"], "1.5"], ["subtract", ["1", "2"], "-1"],
    ["min", ["1", "2"], "1"], ["max", ["1", "2"], "2"],
    ["clamp", ["1", "3", "2"], "2"],
  ])("preserves same-unit dimensions for %s", (name, values, expected) => {
    expect(evaluatePortableOperation(op(name), values.map(value => dimension(value, "rem")))).toEqual({ status: "evaluated", value: dimension(expected, "rem") });
  });
  it("scales a dimension by a number and preserves its unit", () => {
    expect(evaluatePortableOperation(op("scale"), [dimension("1.25", "rem"), number("-2")])).toEqual({ status: "evaluated", value: dimension("-2.5", "rem") });
  });
  it.each(["add", "subtract", "min", "max", "clamp"])("requires context for mixed-unit %s", name => {
    const values = name === "clamp" ? [dimension("1", "rem"), dimension("20", "px"), dimension("2", "rem")] : [dimension("1", "rem"), dimension("20", "px")];
    expect(evaluatePortableOperation(op(name), values)).toMatchObject({ status: "unresolved", reason: "context-required", requiredContext: ["font.rootSize"] });
  });
  it.each([
    ["add", "36"], ["subtract", "-4"], ["min", "16"], ["max", "20"],
  ])("converts mixed-unit %s to px with explicit context", (name, expected) => {
    expect(evaluatePortableOperation(op(name), [dimension("1", "rem"), dimension("20", "px")], { "font.rootSize": dimension("16", "px") })).toEqual({ status: "evaluated", value: dimension(expected, "px") });
  });
  it("compares clamp bounds after unit conversion", () => {
    expect(evaluatePortableOperation(op("clamp"), [dimension("1", "rem"), dimension("20", "px"), dimension("2", "rem")], { "font.rootSize": dimension("16", "px") })).toEqual({ status: "evaluated", value: dimension("20", "px") });
  });
  it("rejects reversed clamp bounds after mixed-unit conversion", () => {
    expect(evaluatePortableOperation(op("clamp"), [dimension("2", "rem"), dimension("25", "px"), dimension("20", "px")], { "font.rootSize": dimension("16", "px") })).toMatchObject({ status: "unresolved", reason: "invalid-expression", code: "invalid-clamp-range" });
  });
  it("does not consult unused context for same-unit operations", () => {
    expect(evaluatePortableOperation(op("add"), [dimension("1", "rem"), dimension("2", "rem")], { "font.rootSize": dimension("-1", "px") })).toEqual({ status: "evaluated", value: dimension("3", "rem") });
  });
  it("accepts zero root size without division or defaults", () => {
    expect(evaluatePortableOperation(op("add"), [dimension("1", "rem"), dimension("1", "px")], { "font.rootSize": dimension("0", "px") })).toEqual({ status: "evaluated", value: dimension("1", "px") });
  });
  it.each([dimension("-1", "px"), dimension("1", "rem")])("rejects invalid required context", root => {
    expect(evaluatePortableOperation(op("add"), [dimension("1", "rem"), dimension("1", "px")], { "font.rootSize": root })).toMatchObject({ status: "unresolved", reason: "invalid-expression", code: "invalid-context" });
  });
  it("reports reversed clamp bounds", () => {
    expect(evaluatePortableOperation(op("clamp"), [number("3"), number("2"), number("1")])).toMatchObject({ status: "unresolved", reason: "invalid-expression", code: "invalid-clamp-range" });
  });
  it.each([
    ["add", [number("1")]],
    ["add", [number("1"), dimension("1", "px")]],
    ["scale", [dimension("1", "px"), dimension("2", "px")]],
    ["scale", [number("1"), dimension("2", "px")]],
    ["min", [createColorLiteral({ colorSpace: "srgb", components: ["0", "0", "0"], alpha: "1" }), number("1")]],
  ])("rejects invalid operation operands: %s", (name, values) => {
    expect(evaluatePortableOperation(op(name), values)).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });
  it("distinguishes unknown operations from invalid known operations", () => {
    expect(evaluatePortableOperation("portable.math.divide.v1", [number("1"), number("2")])).toMatchObject({ status: "unresolved", reason: "unsupported-expression" });
  });
});

describe("expression construction and analysis", () => {
  it("constructs a serializable AST without storing a result type", () => {
    const expression = createExpression({ operation: op("add"), operands: [number("1"), number("2")] });
    expect(expression).toEqual({ kind: "expression", operation: op("add"), operands: [number("1"), number("2")] });
    expect(JSON.parse(JSON.stringify(expression))).toEqual(expression);
  });
  it("rejects unknown operations and wrong arity during normal construction", () => {
    expect(() => createExpression({ operation: op("divide"), operands: [number("1"), number("2")] })).toThrow(RangeError);
    expect(() => createExpression({ operation: op("clamp"), operands: [number("1"), number("2")] })).toThrow(RangeError);
  });
  it("extracts nested references and explicit context requirements without evaluation", () => {
    const reference = createTokenReference({ targetTokenId: "base", valuePath: [] });
    const expression = createExpression({ operation: op("add"), operands: [reference, createExpression({ operation: op("scale"), operands: [{ kind: "context-reference", key: "font.rootSize" }, number("2")] })] });
    expect(analyzeExpression(expression)).toEqual({ references: [reference], contextKeys: ["font.rootSize"] });
  });
});
