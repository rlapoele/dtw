import { describe, expect, it } from "vitest";

import { createColorLiteral } from "../../src/domain/color-literal";
import { createNumberLiteral } from "../../src/domain/numeric-literals";
import {
  addTokenAssignment,
  changeTokenType,
  createToken,
  defineToken,
  deriveTokenDefinitionState,
  removeTokenAssignment,
  removeTokenDefinition,
  renameToken,
} from "../../src/domain/token";
import { createVariationAxis } from "../../src/domain/variation-axis";

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

describe("createToken", () => {
  it("creates a name-only token without inventing a definition", () => {
    expect(
      createToken(
        {
          id: "token-primary",
          projectId: "project-1",
          localName: "primary",
          parentGroupId: null,
          regeneration: "allowed",
        },
        [colorAxis],
      ),
    ).toEqual({
      id: "token-primary",
      projectId: "project-1",
      localName: "primary",
      parentGroupId: null,
      authoring: { regeneration: "allowed" },
    });
  });

  it("creates a typed but unassigned token", () => {
    const token = createToken(
      {
        id: "token-primary",
        projectId: "project-1",
        localName: "primary",
        parentGroupId: null,
        regeneration: "protected",
        definition: { type: "color", assignments: [] },
      },
      [colorAxis],
    );

    expect(token.definition).toEqual({ type: "color", assignments: [] });
    expect(deriveTokenDefinitionState(token)).toBe("typed-unassigned");
  });

  it("creates an authored token with normalized conditions", () => {
    const dark = createColorLiteral({
      colorSpace: "oklch",
      components: ["0.2", "0.05", "270"],
      alpha: "1",
    });
    const token = createToken(
      {
        id: "token-primary",
        projectId: "project-1",
        localName: "primary",
        parentGroupId: null,
        regeneration: "allowed",
        definition: {
          type: "color",
          assignments: [
            {
              condition: [
                { axisId: "axis-color", optionId: "option-dark" },
              ],
              value: dark,
            },
          ],
        },
      },
      [colorAxis],
    );

    expect(token.definition?.assignments).toEqual([
      {
        condition: [
          { axisId: "axis-color", optionId: "option-dark" },
        ],
        value: dark,
      },
    ]);
    expect(deriveTokenDefinitionState(token)).toBe("authored");
  });

  it("rejects an unsupported token type", () => {
    expect(() =>
      createToken(
        {
          id: "token-primary",
          projectId: "project-1",
          localName: "primary",
          parentGroupId: null,
          regeneration: "allowed",
          definition: { type: "paint", assignments: [] },
        },
        [colorAxis],
      ),
    ).toThrow(RangeError);
  });

  it("rejects an authored value incompatible with the explicit type", () => {
    expect(() =>
      createToken(
        {
          id: "token-primary",
          projectId: "project-1",
          localName: "primary",
          parentGroupId: null,
          regeneration: "allowed",
          definition: {
            type: "color",
            assignments: [
              { condition: [], value: createNumberLiteral("1") },
            ],
          },
        },
        [colorAxis],
      ),
    ).toThrow(RangeError);
  });

  it("rejects duplicate normalized assignment conditions", () => {
    const value = createNumberLiteral("1");

    expect(() =>
      createToken(
        {
          id: "token-scale",
          projectId: "project-1",
          localName: "scale",
          parentGroupId: null,
          regeneration: "allowed",
          definition: {
            type: "number",
            assignments: [
              {
                condition: [
                  { axisId: "axis-color", optionId: "option-dark" },
                ],
                value,
              },
              {
                condition: [
                  { axisId: "axis-color", optionId: "option-dark" },
                ],
                value,
              },
            ],
          },
        },
        [colorAxis],
      ),
    ).toThrow(RangeError);
  });

  it("rejects a condition whose option is not owned by its axis", () => {
    expect(() =>
      createToken(
        {
          id: "token-scale",
          projectId: "project-1",
          localName: "scale",
          parentGroupId: null,
          regeneration: "allowed",
          definition: {
            type: "number",
            assignments: [
              {
                condition: [
                  { axisId: "axis-color", optionId: "option-compact" },
                ],
                value: createNumberLiteral("1"),
              },
            ],
          },
        },
        [colorAxis],
      ),
    ).toThrow(RangeError);
  });

  it("enforces the component layer and component-definition association together", () => {
    expect(() =>
      createToken(
        {
          id: "token-button-background",
          projectId: "project-1",
          localName: "background",
          parentGroupId: null,
          layer: "component",
          regeneration: "allowed",
        },
        [colorAxis],
      ),
    ).toThrow(RangeError);

    expect(() =>
      createToken(
        {
          id: "token-button-background",
          projectId: "project-1",
          localName: "background",
          parentGroupId: null,
          layer: "semantic",
          componentDefinitionId: "component-button",
          regeneration: "allowed",
        },
        [colorAxis],
      ),
    ).toThrow(RangeError);
  });
});

describe("token changes", () => {
  it("renames a token while preserving its identity", () => {
    const token = createToken(
      {
        id: "token-primary",
        projectId: "project-1",
        localName: "primary",
        parentGroupId: null,
        regeneration: "allowed",
      },
      [colorAxis],
    );

    expect(renameToken(token, "main")).toEqual({
      ...token,
      localName: "main",
    });
    expect(token.localName).toBe("primary");
  });

  it("rejects adding an assignment to a name-only token", () => {
    const token = createToken(
      {
        id: "token-scale",
        projectId: "project-1",
        localName: "scale",
        parentGroupId: null,
        regeneration: "allowed",
      },
      [colorAxis],
    );

    expect(() =>
      addTokenAssignment(
        token,
        { condition: [], value: createNumberLiteral("1") },
        [colorAxis],
      ),
    ).toThrow(RangeError);
  });

  it("adds an empty typed definition to a name-only token", () => {
    const token = createToken(
      {
        id: "token-scale",
        projectId: "project-1",
        localName: "scale",
        parentGroupId: null,
        regeneration: "allowed",
      },
      [colorAxis],
    );

    const defined = defineToken(token, "number");

    expect(defined.definition).toEqual({ type: "number", assignments: [] });
    expect(deriveTokenDefinitionState(defined)).toBe("typed-unassigned");
    expect(deriveTokenDefinitionState(token)).toBe("name-only");
  });

  it("adds a unique compatible assignment without mutating the token", () => {
    const token = createToken(
      {
        id: "token-scale",
        projectId: "project-1",
        localName: "scale",
        parentGroupId: null,
        regeneration: "allowed",
        definition: { type: "number", assignments: [] },
      },
      [colorAxis],
    );

    const changed = addTokenAssignment(
      token,
      { condition: [], value: createNumberLiteral("1") },
      [colorAxis],
    );

    expect(changed.definition?.assignments).toHaveLength(1);
    expect(token.definition?.assignments).toHaveLength(0);
  });

  it("removes the last assignment while retaining the typed definition", () => {
    const token = createToken(
      {
        id: "token-scale",
        projectId: "project-1",
        localName: "scale",
        parentGroupId: null,
        regeneration: "allowed",
        definition: {
          type: "number",
          assignments: [
            { condition: [], value: createNumberLiteral("1") },
          ],
        },
      },
      [colorAxis],
    );

    const changed = removeTokenAssignment(token, []);

    expect(changed.definition).toEqual({ type: "number", assignments: [] });
    expect(deriveTokenDefinitionState(changed)).toBe("typed-unassigned");
  });

  it("changes type only when no assignments would be reinterpreted", () => {
    const unassigned = createToken(
      {
        id: "token-scale",
        projectId: "project-1",
        localName: "scale",
        parentGroupId: null,
        regeneration: "allowed",
        definition: { type: "number", assignments: [] },
      },
      [colorAxis],
    );
    const authored = addTokenAssignment(
      unassigned,
      { condition: [], value: createNumberLiteral("1") },
      [colorAxis],
    );

    expect(changeTokenType(unassigned, "dimension").definition).toEqual({
      type: "dimension",
      assignments: [],
    });
    expect(() => changeTokenType(authored, "dimension")).toThrow(RangeError);
  });

  it("removes a definition without inventing another lifecycle field", () => {
    const token = createToken(
      {
        id: "token-scale",
        projectId: "project-1",
        localName: "scale",
        parentGroupId: null,
        regeneration: "allowed",
        definition: { type: "number", assignments: [] },
      },
      [colorAxis],
    );

    const changed = removeTokenDefinition(token);

    expect(changed).not.toHaveProperty("definition");
    expect(deriveTokenDefinitionState(changed)).toBe("name-only");
  });
});
