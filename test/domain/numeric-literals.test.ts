import { describe, expect, it } from "vitest";

import {
  createDimensionLiteral,
  createNumberLiteral,
} from "../../src/domain/numeric-literals";

describe("createNumberLiteral", () => {
  it("creates a number literal from canonical Decimal text", () => {
    expect(createNumberLiteral("-12.5")).toEqual({
      kind: "literal",
      valueType: "number",
      value: "-12.5",
    });
  });

  it("rejects non-canonical Decimal text", () => {
    expect(() => createNumberLiteral("12.50")).toThrow(RangeError);
  });
});

describe("createDimensionLiteral", () => {
  it.each(["px", "rem"] as const)(
    "creates a dimension literal with the explicit %s unit",
    (unit) => {
      expect(createDimensionLiteral("0", unit)).toEqual({
        kind: "literal",
        valueType: "dimension",
        value: "0",
        unit,
      });
    },
  );

  it("preserves a negative dimension at the foundational level", () => {
    expect(createDimensionLiteral("-1.25", "rem").value).toBe("-1.25");
  });

  it("rejects non-canonical Decimal text", () => {
    expect(() => createDimensionLiteral("1e2", "px")).toThrow(RangeError);
  });

  it.each(["", "PX", "em", "%"])("rejects unsupported unit: %s", (unit) => {
    expect(() => createDimensionLiteral("1", unit)).toThrow(RangeError);
  });
});
