import { describe, expect, it } from "vitest";

import {
  addVariationOption,
  changeDefaultVariationOption,
  createVariationAxis,
  renameVariationAxis,
  renameVariationOption,
} from "../../src/domain/variation-axis";

describe("createVariationAxis", () => {
  it("creates a project-owned axis with an explicit owned default", () => {
    expect(
      createVariationAxis({
        id: "axis-color-scheme",
        projectId: "project-1",
        name: "Color scheme",
        description: "Controls light and dark appearances",
        options: [
          { id: "option-light", name: "Light" },
          { id: "option-dark", name: "Dark" },
        ],
        defaultOptionId: "option-light",
      }),
    ).toEqual({
      id: "axis-color-scheme",
      projectId: "project-1",
      name: "Color scheme",
      description: "Controls light and dark appearances",
      options: [
        { id: "option-light", name: "Light" },
        { id: "option-dark", name: "Dark" },
      ],
      defaultOptionId: "option-light",
    });
  });

  it("rejects an axis without options", () => {
    expect(() =>
      createVariationAxis({
        id: "axis-color-scheme",
        projectId: "project-1",
        name: "Color scheme",
        options: [],
        defaultOptionId: "option-light",
      }),
    ).toThrow(RangeError);
  });

  it("rejects duplicate option identities", () => {
    expect(() =>
      createVariationAxis({
        id: "axis-color-scheme",
        projectId: "project-1",
        name: "Color scheme",
        options: [
          { id: "option-light", name: "Light" },
          { id: "option-light", name: "Dark" },
        ],
        defaultOptionId: "option-light",
      }),
    ).toThrow(RangeError);
  });

  it("rejects a default that is not owned by the axis", () => {
    expect(() =>
      createVariationAxis({
        id: "axis-color-scheme",
        projectId: "project-1",
        name: "Color scheme",
        options: [{ id: "option-light", name: "Light" }],
        defaultOptionId: "option-dark",
      }),
    ).toThrow(RangeError);
  });

  it("copies the option collection at the aggregate boundary", () => {
    const options = [{ id: "option-light", name: "Light" }];
    const axis = createVariationAxis({
      id: "axis-color-scheme",
      projectId: "project-1",
      name: "Color scheme",
      options,
      defaultOptionId: "option-light",
    });

    options.push({ id: "option-dark", name: "Dark" });

    expect(axis.options).toEqual([{ id: "option-light", name: "Light" }]);
  });
});

describe("variation-axis changes", () => {
  it("renames an axis while preserving its identity and owned options", () => {
    const axis = createVariationAxis({
      id: "axis-color-scheme",
      projectId: "project-1",
      name: "Scheme",
      options: [{ id: "option-light", name: "Light" }],
      defaultOptionId: "option-light",
    });

    const renamed = renameVariationAxis(axis, "Color scheme");

    expect(renamed).toEqual({ ...axis, name: "Color scheme" });
    expect(axis.name).toBe("Scheme");
  });

  it("renames an owned option while preserving its identity and order", () => {
    const axis = createVariationAxis({
      id: "axis-color-scheme",
      projectId: "project-1",
      name: "Color scheme",
      options: [
        { id: "option-light", name: "Day" },
        { id: "option-dark", name: "Dark" },
      ],
      defaultOptionId: "option-light",
    });

    const renamed = renameVariationOption(
      axis,
      axis.options[0].id,
      "Light",
    );

    expect(renamed.options).toEqual([
      { id: "option-light", name: "Light" },
      { id: "option-dark", name: "Dark" },
    ]);
    expect(axis.options[0].name).toBe("Day");
  });

  it("rejects renaming an option not owned by the axis", () => {
    const axis = createVariationAxis({
      id: "axis-color-scheme",
      projectId: "project-1",
      name: "Color scheme",
      options: [{ id: "option-light", name: "Light" }],
      defaultOptionId: "option-light",
    });

    expect(() =>
      renameVariationOption(axis, "option-dark", "Dark"),
    ).toThrow(RangeError);
  });

  it("adds an option without changing the default", () => {
    const axis = createVariationAxis({
      id: "axis-color-scheme",
      projectId: "project-1",
      name: "Color scheme",
      options: [{ id: "option-light", name: "Light" }],
      defaultOptionId: "option-light",
    });

    const changed = addVariationOption(axis, {
      id: "option-dark",
      name: "Dark",
    });

    expect(changed.options).toEqual([
      { id: "option-light", name: "Light" },
      { id: "option-dark", name: "Dark" },
    ]);
    expect(changed.defaultOptionId).toBe("option-light");
    expect(axis.options).toHaveLength(1);
  });

  it("rejects adding an option whose identity is already owned", () => {
    const axis = createVariationAxis({
      id: "axis-color-scheme",
      projectId: "project-1",
      name: "Color scheme",
      options: [{ id: "option-light", name: "Light" }],
      defaultOptionId: "option-light",
    });

    expect(() =>
      addVariationOption(axis, { id: "option-light", name: "Day" }),
    ).toThrow(RangeError);
  });

  it("changes the default to another owned option", () => {
    const axis = createVariationAxis({
      id: "axis-color-scheme",
      projectId: "project-1",
      name: "Color scheme",
      options: [
        { id: "option-light", name: "Light" },
        { id: "option-dark", name: "Dark" },
      ],
      defaultOptionId: "option-light",
    });

    const changed = changeDefaultVariationOption(
      axis,
      axis.options[1].id,
    );

    expect(changed.defaultOptionId).toBe("option-dark");
    expect(axis.defaultOptionId).toBe("option-light");
  });

  it("rejects a default that is not owned by the axis", () => {
    const axis = createVariationAxis({
      id: "axis-color-scheme",
      projectId: "project-1",
      name: "Color scheme",
      options: [{ id: "option-light", name: "Light" }],
      defaultOptionId: "option-light",
    });

    expect(() =>
      changeDefaultVariationOption(axis, "option-dark"),
    ).toThrow(RangeError);
  });
});
