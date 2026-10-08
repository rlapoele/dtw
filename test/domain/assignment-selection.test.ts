import { describe, expect, it } from "vitest";

import { selectMostSpecificAssignment } from "../../src/domain/assignment-selection";
import { createVariationAxis } from "../../src/domain/variation-axis";
import { createVariationCondition } from "../../src/domain/variation-condition";
import {
  completeVariationSelection,
  createVariationSelection,
} from "../../src/domain/variation-selection";

describe("selectMostSpecificAssignment", () => {
  const axes = [
    createVariationAxis({
      id: "axis-color",
      projectId: "project-1",
      name: "Color scheme",
      options: [
        { id: "option-light", name: "Light" },
        { id: "option-dark", name: "Dark" },
      ],
      defaultOptionId: "option-light",
    }),
    createVariationAxis({
      id: "axis-contrast",
      projectId: "project-1",
      name: "Contrast",
      options: [
        { id: "option-standard", name: "Standard" },
        { id: "option-high", name: "High" },
      ],
      defaultOptionId: "option-standard",
    }),
  ];
  const activeSelection = completeVariationSelection(
    axes,
    createVariationSelection([]),
    createVariationSelection([
      { axisId: "axis-color", optionId: "option-dark" },
      { axisId: "axis-contrast", optionId: "option-high" },
    ]),
  );

  it("returns missing when no assignment matches", () => {
    const result = selectMostSpecificAssignment(
      [
        {
          condition: createVariationCondition([
            { axisId: "axis-color", optionId: "option-light" },
          ]),
          value: "light",
        },
      ],
      activeSelection,
    );

    expect(result).toEqual({ status: "missing" });
  });

  it("uses an unconditional assignment as a specificity-zero fallback", () => {
    const fallback = {
      condition: createVariationCondition([]),
      value: "fallback",
    };

    expect(
      selectMostSpecificAssignment([fallback], activeSelection),
    ).toEqual({
      status: "matched",
      assignment: fallback,
      specificity: 0,
    });
  });

  it("selects the matching assignment with the greatest specificity", () => {
    const fallback = {
      condition: createVariationCondition([]),
      value: "fallback",
    };
    const dark = {
      condition: createVariationCondition([
        { axisId: "axis-color", optionId: "option-dark" },
      ]),
      value: "dark",
    };
    const darkHighContrast = {
      condition: createVariationCondition([
        { axisId: "axis-color", optionId: "option-dark" },
        { axisId: "axis-contrast", optionId: "option-high" },
      ]),
      value: "dark-high-contrast",
    };

    expect(
      selectMostSpecificAssignment(
        [dark, darkHighContrast, fallback],
        activeSelection,
      ),
    ).toEqual({
      status: "matched",
      assignment: darkHighContrast,
      specificity: 2,
    });
  });

  it("reports equally specific matching conditions as ambiguous", () => {
    const dark = {
      condition: createVariationCondition([
        { axisId: "axis-color", optionId: "option-dark" },
      ]),
      value: "dark",
    };
    const highContrast = {
      condition: createVariationCondition([
        { axisId: "axis-contrast", optionId: "option-high" },
      ]),
      value: "high-contrast",
    };

    expect(
      selectMostSpecificAssignment(
        [dark, highContrast],
        activeSelection,
      ),
    ).toEqual({
      status: "ambiguous",
      candidates: [dark, highContrast],
      specificity: 1,
    });
  });

  it("does not break a tie when candidate values are equal", () => {
    const dark = {
      condition: createVariationCondition([
        { axisId: "axis-color", optionId: "option-dark" },
      ]),
      value: "same-value",
    };
    const highContrast = {
      condition: createVariationCondition([
        { axisId: "axis-contrast", optionId: "option-high" },
      ]),
      value: "same-value",
    };

    expect(
      selectMostSpecificAssignment(
        [dark, highContrast],
        activeSelection,
      ).status,
    ).toBe("ambiguous");
  });

  it("ignores a more-specific condition that does not match", () => {
    const dark = {
      condition: createVariationCondition([
        { axisId: "axis-color", optionId: "option-dark" },
      ]),
      value: "dark",
    };
    const lightHighContrast = {
      condition: createVariationCondition([
        { axisId: "axis-color", optionId: "option-light" },
        { axisId: "axis-contrast", optionId: "option-high" },
      ]),
      value: "light-high-contrast",
    };

    expect(
      selectMostSpecificAssignment(
        [lightHighContrast, dark],
        activeSelection,
      ),
    ).toEqual({
      status: "matched",
      assignment: dark,
      specificity: 1,
    });
  });
});
