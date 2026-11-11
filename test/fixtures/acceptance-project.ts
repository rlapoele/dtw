// Portable baseline authored fixture, used through the real backup decoder.
import { createTokenGroup } from "@domain/token-group";
import { createProject } from "@domain/project";
import { createToken } from "@domain/token";
import { createColorLiteral } from "@domain/color-literal";
import { createTokenReference } from "@domain/token-reference";
import { createNumberLiteral } from "@domain/numeric-literals";
import type { ProjectSnapshot } from "@application/project-storage";
export function acceptanceProject(broken = false): ProjectSnapshot {
  const literal = createColorLiteral({
    colorSpace: "srgb",
    components: ["0.2314", "0.41234567890123456789", "0.67890123456789"],
    alpha: "0.1234567890123456789",
  });
  const make = (
    id: string,
    value: Parameters<typeof createToken>[0]["definition"],
    extra: Partial<Parameters<typeof createToken>[0]> = {},
  ) =>
    createToken(
      {
        id,
        projectId: "fixture-project",
        localName: id,
        parentGroupId: null,
        regeneration: "allowed",
        definition: value,
        ...extra,
      },
      [],
    );
  const definition = {
    type: "color",
    assignments: [{ condition: [], value: literal }],
  };
  const tokens = [
    make("protected-color", definition, {
      regeneration: "protected",
      description: "Retained authored description",
      semanticRole: "content.primary",
      layer: "primitive",
    }),
    make(
      "alias",
      {
        type: "color",
        assignments: [
          {
            condition: [],
            value: createTokenReference({
              targetTokenId: "protected-color",
              valuePath: [],
            }),
          },
        ],
      },
      { layer: "semantic" },
    ),
    make("number", {
      type: "number",
      assignments: [{ condition: [], value: createNumberLiteral("8") }],
    }),
  ];
  if (broken)
    for (const id of ["broken-a", "broken-b"])
      tokens.push(
        make(id, {
          type: "color",
          assignments: [
            {
              condition: [],
              value: createTokenReference({
                targetTokenId: "missing-" + id,
                valuePath: [],
              }),
            },
          ],
        }),
      );
  for (const [space, components] of [
    [
      "srgb",
      ["-0.2", "0.4", "1.234567890123456789012345678901234567890123456789"],
    ],
    ["display-p3", ["0.1", "0.3", "0.7"]],
    ["hsl", ["none", "none", "63"]],
    ["oklab", ["0.6", "-0.2", "0.3"]],
    ["oklch", ["0.7", "0.2", "39"]],
  ] as const)
    tokens.push(
      make(
        space,
        {
          type: "color",
          assignments: [
            {
              condition: [],
              value: createColorLiteral({
                colorSpace: space,
                components,
                alpha: "0.1234567890123456789",
              }),
            },
          ],
        },
        {
          layer: "primitive",
          description:
            " First descriptive line\nSecond descriptive line\nThird full inspector line. ",
        },
      ),
    );
  const groups = [
    "common-long-prefix-group-a",
    "common-long-prefix-group-b",
  ].map((id) =>
    createTokenGroup({
      id,
      projectId: "fixture-project",
      localName: "same group",
      parentGroupId: null,
    }),
  );
  groups.push(
    createTokenGroup({
      id: "root-named-group",
      projectId: "fixture-project",
      localName: "Project root",
      parentGroupId: null,
    }),
  );
  for (const [id, localName, parentGroupId] of [
    ["common-long-prefix-token-a", "duplicate", null],
    ["common-long-prefix-token-b", "duplicate", null],
    ["empty-token", "", null],
    ["fallback-token", "(unnamed)", null],
    ["space-token-a", "a  b", null],
    ["space-token-b", "a b", null],
    ["suffix-like-token", "duplicate · common-long-prefix-token-a", null],
    ["placeholder-token", "Choose a color token…", null],
    ["missing-label-token", "Missing target", null],
    ["nested-token", "nested", "common-long-prefix-group-a"],
  ] as const)
    tokens.push(make(id, definition, { localName, parentGroupId }));
  for (const [id, components] of [
    ["half-ties", ["0.1", "0.3", "-0.3"]],
    [
      "half-sides",
      ["0.099999999999999999999999999", "0.300000000000000000000000001", "0.2"],
    ],
    [
      "outside-endpoints",
      ["-0.000000000000000000001", "1.000000000000000000001", "none"],
    ],
  ] as const)
    tokens.push(
      make(id, {
        type: "color",
        assignments: [
          {
            condition: [],
            value: createColorLiteral({
              colorSpace: "srgb",
              components,
              alpha: "0.37",
            }),
          },
        ],
      }),
    );
  if (broken) {
    tokens.push(
      make("invalid-path-token", definition, { parentGroupId: "absent" }),
    );
    tokens.push(
      make("invalid-fallback-token", definition, {
        localName: "(invalid namespace)",
      }),
    );
  }
  const initial: ProjectSnapshot = {
    project: createProject({
      id: "fixture-project",
      name: "Acceptance fixture",
    }),
    groups,
    tokens,
  };
  return initial;
}
