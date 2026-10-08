import { describe, expect, it } from "vitest";

import {
  createThemePreset,
  renameThemePreset,
  replaceThemePresetSelections,
} from "../../src/domain/theme-preset";
import { createVariationAxis } from "../../src/domain/variation-axis";
import {
  completeVariationSelection,
  createVariationSelection,
} from "../../src/domain/variation-selection";

const colorAxis = createVariationAxis({
  id: "axis-color",
  projectId: "project-1",
  name: "Color scheme",
  options: [
    { id: "option-light", name: "Light" },
    { id: "option-dark", name: "Dark" },
  ],
  defaultOptionId: "option-light",
});

const contrastAxis = createVariationAxis({
  id: "axis-contrast",
  projectId: "project-1",
  name: "Contrast",
  options: [
    { id: "option-standard", name: "Standard" },
    { id: "option-high", name: "High" },
  ],
  defaultOptionId: "option-standard",
});

describe("createThemePreset", () => {
  it("creates a project-owned preset with normalized partial selections", () => {
    expect(
      createThemePreset(
        {
          id: "preset-dark-high",
          projectId: "project-1",
          name: "Dark high contrast",
          description: "Dark appearance with stronger contrast",
          selections: [
            { axisId: "axis-contrast", optionId: "option-high" },
            { axisId: "axis-color", optionId: "option-dark" },
          ],
        },
        [colorAxis, contrastAxis],
      ),
    ).toEqual({
      id: "preset-dark-high",
      projectId: "project-1",
      name: "Dark high contrast",
      description: "Dark appearance with stronger contrast",
      selections: [
        { axisId: "axis-color", optionId: "option-dark" },
        { axisId: "axis-contrast", optionId: "option-high" },
      ],
    });
  });

  it("accepts an empty selection", () => {
    expect(
      createThemePreset(
        {
          id: "preset-defaults",
          projectId: "project-1",
          name: "Defaults",
          selections: [],
        },
        [colorAxis, contrastAxis],
      ).selections,
    ).toEqual([]);
  });

  it("rejects an unknown axis", () => {
    expect(() =>
      createThemePreset(
        {
          id: "preset-invalid",
          projectId: "project-1",
          name: "Invalid",
          selections: [
            { axisId: "axis-density", optionId: "option-compact" },
          ],
        },
        [colorAxis, contrastAxis],
      ),
    ).toThrow(RangeError);
  });

  it("rejects an option owned by another axis", () => {
    expect(() =>
      createThemePreset(
        {
          id: "preset-invalid",
          projectId: "project-1",
          name: "Invalid",
          selections: [
            { axisId: "axis-color", optionId: "option-high" },
          ],
        },
        [colorAxis, contrastAxis],
      ),
    ).toThrow(RangeError);
  });

  it("rejects axes owned by another project", () => {
    const foreignAxis = createVariationAxis({
      id: "axis-density",
      projectId: "project-2",
      name: "Density",
      options: [{ id: "option-compact", name: "Compact" }],
      defaultOptionId: "option-compact",
    });

    expect(() =>
      createThemePreset(
        {
          id: "preset-compact",
          projectId: "project-1",
          name: "Compact",
          selections: [
            { axisId: "axis-density", optionId: "option-compact" },
          ],
        },
        [colorAxis, contrastAxis, foreignAxis],
      ),
    ).toThrow(RangeError);
  });
});

describe("theme-preset changes", () => {
  it("renames a preset while preserving its identity and selection", () => {
    const preset = createThemePreset(
      {
        id: "preset-dark",
        projectId: "project-1",
        name: "Night",
        selections: [
          { axisId: "axis-color", optionId: "option-dark" },
        ],
      },
      [colorAxis, contrastAxis],
    );

    expect(renameThemePreset(preset, "Dark")).toEqual({
      ...preset,
      name: "Dark",
    });
    expect(preset.name).toBe("Night");
  });

  it("replaces selections after validating them against project axes", () => {
    const preset = createThemePreset(
      {
        id: "preset-dark",
        projectId: "project-1",
        name: "Dark",
        selections: [
          { axisId: "axis-color", optionId: "option-dark" },
        ],
      },
      [colorAxis, contrastAxis],
    );

    const changed = replaceThemePresetSelections(
      preset,
      [{ axisId: "axis-contrast", optionId: "option-high" }],
      [colorAxis, contrastAxis],
    );

    expect(changed.selections).toEqual([
      { axisId: "axis-contrast", optionId: "option-high" },
    ]);
    expect(preset.selections).toEqual([
      { axisId: "axis-color", optionId: "option-dark" },
    ]);
  });
});

describe("completeVariationSelection", () => {
  it("uses every axis default when the partial selections are empty", () => {
    expect(
      completeVariationSelection(
        [colorAxis, contrastAxis],
        createVariationSelection([]),
        createVariationSelection([]),
      ),
    ).toEqual([
      { axisId: "axis-color", optionId: "option-light" },
      { axisId: "axis-contrast", optionId: "option-standard" },
    ]);
  });

  it("applies preset choices over defaults and explicit choices over the preset", () => {
    const presetSelections = createVariationSelection([
      { axisId: "axis-color", optionId: "option-dark" },
      { axisId: "axis-contrast", optionId: "option-high" },
    ]);
    const explicitSelections = createVariationSelection([
      { axisId: "axis-color", optionId: "option-light" },
    ]);

    expect(
      completeVariationSelection(
        [colorAxis, contrastAxis],
        presetSelections,
        explicitSelections,
      ),
    ).toEqual([
      { axisId: "axis-color", optionId: "option-light" },
      { axisId: "axis-contrast", optionId: "option-high" },
    ]);
  });

  it("rejects an invalid explicit option", () => {
    expect(() =>
      completeVariationSelection(
        [colorAxis, contrastAxis],
        createVariationSelection([]),
        createVariationSelection([
          { axisId: "axis-color", optionId: "option-high" },
        ]),
      ),
    ).toThrow(RangeError);
  });

  it("rejects axes from different projects", () => {
    const foreignAxis = createVariationAxis({
      id: "axis-density",
      projectId: "project-2",
      name: "Density",
      options: [{ id: "option-compact", name: "Compact" }],
      defaultOptionId: "option-compact",
    });

    expect(() =>
      completeVariationSelection(
        [colorAxis, foreignAxis],
        createVariationSelection([]),
        createVariationSelection([]),
      ),
    ).toThrow(RangeError);
  });

  it("rejects an option identity owned by more than one axis", () => {
    const densityAxis = createVariationAxis({
      id: "axis-density",
      projectId: "project-1",
      name: "Density",
      options: [{ id: "option-light", name: "Comfortable" }],
      defaultOptionId: "option-light",
    });

    expect(() =>
      completeVariationSelection(
        [colorAxis, densityAxis],
        createVariationSelection([]),
        createVariationSelection([]),
      ),
    ).toThrow(RangeError);
  });
});
