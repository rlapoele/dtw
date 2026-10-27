export type BooleanLiteralValue = {
  readonly kind: "literal";
  readonly valueType: "boolean";
  readonly value: boolean;
};

export function createBooleanLiteral(value: unknown): BooleanLiteralValue {
  if (typeof value !== "boolean") {
    throw new TypeError("A boolean literal requires an actual boolean value");
  }

  return {
    kind: "literal",
    valueType: "boolean",
    value,
  };
}
