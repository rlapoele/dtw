import { describe, expect, it } from "vitest";

import {
  areVariationConditionsEqual,
  createVariationCondition,
  variationConditionSpecificity,
} from "../../src/domain/variation-condition";

describe("createVariationCondition", () => {
  it("represents an unconditional assignment as an empty condition", () => {
    expect(createVariationCondition([])).toEqual([]);
  });

  it("normalizes selections deterministically by axis identity", () => {
    expect(
      createVariationCondition([
        { axisId: "axis-density", optionId: "option-compact" },
        { axisId: "axis-color", optionId: "option-dark" },
      ]),
    ).toEqual([
      { axisId: "axis-color", optionId: "option-dark" },
      { axisId: "axis-density", optionId: "option-compact" },
    ]);
  });

  it("rejects more than one selection for the same axis", () => {
    expect(() =>
      createVariationCondition([
        { axisId: "axis-color", optionId: "option-light" },
        { axisId: "axis-color", optionId: "option-dark" },
      ]),
    ).toThrow(RangeError);
  });

  it("copies selections at the value-object boundary", () => {
    const selections = [
      { axisId: "axis-color", optionId: "option-light" },
    ];
    const condition = createVariationCondition(selections);

    selections[0].optionId = "option-dark";

    expect(condition).toEqual([
      { axisId: "axis-color", optionId: "option-light" },
    ]);
  });
});

describe("variation condition behavior", () => {
  it("uses the selected axis count as specificity", () => {
    const condition = createVariationCondition([
      { axisId: "axis-color", optionId: "option-dark" },
      { axisId: "axis-contrast", optionId: "option-high" },
    ]);

    expect(variationConditionSpecificity(condition)).toBe(2);
  });

  it("compares normalized conditions by value", () => {
    const left = createVariationCondition([
      { axisId: "axis-color", optionId: "option-dark" },
      { axisId: "axis-contrast", optionId: "option-high" },
    ]);
    const same = createVariationCondition([
      { axisId: "axis-contrast", optionId: "option-high" },
      { axisId: "axis-color", optionId: "option-dark" },
    ]);
    const different = createVariationCondition([
      { axisId: "axis-color", optionId: "option-light" },
      { axisId: "axis-contrast", optionId: "option-high" },
    ]);

    expect(areVariationConditionsEqual(left, same)).toBe(true);
    expect(areVariationConditionsEqual(left, different)).toBe(false);
  });
});
