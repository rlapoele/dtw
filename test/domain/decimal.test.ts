import { describe, expect, it } from "vitest";

import {
  compareDecimals,
  decimalFromCanonical,
} from "../../src/domain/decimal";

describe("decimalFromCanonical", () => {
  it.each([
    "0",
    "1",
    "-1",
    "0.5",
    "-0.5",
    "10.01",
    "123456789012345678901234567890.123456789",
  ])("accepts canonical Decimal text: %s", (value) => {
    expect(decimalFromCanonical(value)).toBe(value);
  });

  it.each([
    "",
    " 1",
    "1 ",
    "+1",
    "01",
    "-01",
    ".5",
    "1.",
    "1.0",
    "1.20",
    "-0",
    "-0.0",
    "1e3",
    "NaN",
    "Infinity",
  ])("rejects non-canonical Decimal text: %s", (value) => {
    expect(() => decimalFromCanonical(value)).toThrow(RangeError);
  });
});

describe("compareDecimals", () => {
  it.each([
    ["0", "0", 0],
    ["1.2", "1.2", 0],
    ["1.2", "1.11", 1],
    ["-1.2", "-1.11", -1],
    ["-2", "-1.999", -1],
    ["0", "-0.001", 1],
    ["100000000000000000000", "99999999999999999999.9", 1],
  ] as const)("compares %s with %s", (left, right, expected) => {
    expect(
      compareDecimals(
        decimalFromCanonical(left),
        decimalFromCanonical(right),
      ),
    ).toBe(expected);
  });
});
