import { describe, expect, it } from "vitest";
import { acceptanceProject } from "@tests/fixtures/acceptance-project";
import { decodeBackup, encodeBackup } from "@application/retention/codec";
import { selectedInspection } from "@application/retention/projections";
import { validateHostOutput } from "@presentation/host/validation";
describe("preserved baseline authored fixture on the retained path", () => {
  it.each([false, true])(
    "roundtrips the baseline fixture with repairable diagnostics %s",
    (broken) => {
      const snapshot = acceptanceProject(broken);
      expect(
        decodeBackup(encodeBackup(snapshot, "2026-11-11T00:00:00.000Z"))
          .snapshot,
      ).toEqual(snapshot);
      for (const token of snapshot.tokens) {
        const display = selectedInspection(snapshot, token.id);
        expect(() =>
          validateHostOutput(
            "inspection",
            {
              projectId: snapshot.project.id,
              revision: "r",
              tokenId: token.id,
            },
            display,
          ),
        ).not.toThrow();
      }
    },
  );
});

it("preserves every supported literal/composite/AST value, absent descriptions and exact optional metadata", () => {
  const literal = (valueType: string, extra: Record<string, unknown>) => ({
    kind: "literal",
    valueType,
    ...extra,
  });
  const color = literal("color", {
      colorSpace: "oklch",
      components: ["0.7", "none", "359.999999999999999999"],
      alpha: "0",
    }),
    dimension = literal("dimension", { value: "0", unit: "px" }),
    number = literal("number", { value: "1.25" }),
    duration = literal("duration", { value: "0", unit: "s" }),
    bezier = literal("cubicBezier", { controlPoints: ["0", "-2", "1", "3"] }),
    family = literal("fontFamily", {
      families: [
        { kind: "named", name: "  Exact Font  " },
        { kind: "generic", family: "serif" },
      ],
    }),
    weight = literal("fontWeight", { value: "400.5" });
  const values: [string, unknown][] = [
    ["color", color],
    ["dimension", dimension],
    ["number", number],
    ["duration", duration],
    ["percentage", literal("percentage", { ratio: "-1.234" })],
    ["boolean", literal("boolean", { value: false })],
    ["fontWeight", weight],
    ["cubicBezier", bezier],
    ["fontFamily", family],
    [
      "transition",
      {
        kind: "composite",
        valueType: "transition",
        duration,
        delay: literal("duration", { value: "-3", unit: "ms" }),
        timingFunction: bezier,
      },
    ],
    [
      "typography",
      {
        kind: "composite",
        valueType: "typography",
        fontFamily: family,
        fontSize: dimension,
        fontWeight: weight,
        letterSpacing: literal("dimension", { value: "-0.1", unit: "rem" }),
        lineHeight: number,
      },
    ],
    [
      "shadow",
      {
        kind: "composite",
        valueType: "shadow",
        layers: [
          {
            color,
            offsetX: dimension,
            offsetY: dimension,
            blur: dimension,
            spread: dimension,
            inset: literal("boolean", { value: false }),
          },
        ],
      },
    ],
    [
      "number",
      {
        kind: "expression",
        operation: "portable.math.add.v1",
        operands: [number, { kind: "context-reference", key: "font.rootSize" }],
      },
    ],
    [
      "angle",
      {
        kind: "token-reference",
        targetTokenId: "missing",
        valuePath: [
          { kind: "field", key: "x" },
          { kind: "index", index: 0 },
        ],
      },
    ],
  ];
  for (const [type, value] of values) {
    const snapshot = {
      project: { id: "", name: "\ud800😀" },
      groups: [],
      tokens: [
        {
          id: "",
          projectId: "",
          localName: "",
          parentGroupId: null,
          description: "",
          layer: "component",
          componentDefinitionId: "",
          semanticRole: " exact ",
          authoring: { regeneration: "protected" },
          definition: { type, assignments: [{ condition: [], value }] },
        },
      ],
    };
    expect(
      decodeBackup(encodeBackup(snapshot, "2026-11-11T00:00:00.000Z")).snapshot,
    ).toEqual(snapshot);
  }
});
