import { describe, expect, it } from "vitest";
import { integerByteDisplay, integerByteToNormalized } from "@presentation/integer-rgb";
import { visualRangeState } from "@presentation/visual-range";

describe("exact integer RGB presentation", () => {
  it.each([
    ["0.1", "26", true], ["0.3", "76", true], ["0.5", "128", true],
    ["-0.1", "-26", true], ["-0.3", "-76", true],
    ["0.099999999999999999999999999", "25", true],
    ["0.100000000000000000000000001", "26", true],
    ["0.299999999999999999999999999", "76", true],
    ["0.300000000000000000000000001", "77", true],
    ["-0.099999999999999999999999999", "-25", true],
    ["-0.300000000000000000000000001", "-77", true],
    ["0.2314", "59", true], ["0.2", "51", false],
    ["1", "255", false], ["0", "0", false], ["none", "none", false],
    ["-1", "-255", false], ["2", "510", false],
  ])("scales %s exactly before deciding nearest integer", (source, text, approximate) => {
    expect(integerByteDisplay(source)).toEqual({ text, approximate });
  });
  it("does not let endpoint rounding establish interval eligibility", () => {
    for (const source of ["-0.000000000000000000001", "1.000000000000000000001"]) {
      expect(["0", "255"]).toContain(integerByteDisplay(source).text);
      expect(visualRangeState(source, "0", "1")).toBe("outside");
    }
  });
  it("preserves calculation budgets and exact extended entry", () => {
    expect(() => integerByteDisplay("0." + "0".repeat(4096) + "1")).toThrow();
    expect(integerByteToNormalized("-255")).toBe("-1");
    expect(integerByteToNormalized("510")).toBe("2");
  });
});
