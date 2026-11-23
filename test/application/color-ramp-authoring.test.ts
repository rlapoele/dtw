import { selectedInspection } from "@application/retention/projections";
import { describe, it, expect } from "vitest";
import { createAuthoringOperations } from "../../src/application/authoring";
import { candidateStorage } from "../../src/application/retention/candidate";
import {
  admitSnapshot,
  encodeBackup,
  decodeBackup,
} from "../../src/application/retention/codec";
import { createProject } from "../../src/domain/project";
import { createToken } from "../../src/domain/token";
import { createColorLiteral } from "../../src/domain/color-literal";
import { createTokenReference } from "../../src/domain/token-reference";
import {
  autoRampPosition,
  rampLabels,
  type RampSettings,
} from "../../src/domain/color-ramp";
import {
  regenerateRamp,
  openRampDraft,
  replaceRampCount,
  rampImpacts,
  applyRampCandidate,
} from "../../src/application/color-ramp-authoring";
const seed = createColorLiteral({
  colorSpace: "srgb",
  components: ["0.2", "0.4", "0.8"],
  alpha: "1",
});
const settings: RampSettings = {
  seed,
  targetGamut: "srgb",
  recipe: { id: "single-seed-oklch", version: 1, intensity: "retained" },
  seedPosition: { mode: "auto", label: autoRampPosition(seed, 11) },
};
function fixture() {
  const storage = candidateStorage({
      project: createProject({ id: "p", name: "P" }),
      groups: [],
      tokens: [],
    }),
    ops = createAuthoringOperations(storage);
  expect(
    ops.createColorRamp({
      projectId: "p",
      group: {
        id: "g",
        projectId: "p",
        localName: "brand",
        parentGroupId: null,
      },
      settings,
      members: rampLabels(11).map((label) => ({ label, id: "t" + label })),
    }).status,
  ).toBe("ok");
  const loaded = storage.load("p");
  if (loaded.status !== "ok" || !loaded.value) throw Error();
  return { storage, ops, snapshot: loaded.value };
}
describe("atomic ramp authoring", () => {
  it("retains returning identity/description/protection but discards manual color and choices", () => {
    const { snapshot } = fixture();
    let draft = openRampDraft(snapshot, "g");
    draft = {
      ...draft,
      steps: draft.steps.map((s) =>
        s.label === "300"
          ? {
              ...s,
              description: "Keep",
              protected: true,
              colorOrigin: "manual",
              value: seed,
            }
          : s,
      ),
    };
    draft = replaceRampCount(snapshot, "g", draft, 6, () => "new");
    draft = replaceRampCount(snapshot, "g", draft, 11, () => "new");
    expect(draft.steps.find((s) => s.label === "300")).toMatchObject({
      id: "t300",
      description: "Keep",
      protected: true,
      colorOrigin: "generated",
    });
    expect(
      applyRampCandidate(snapshot, {
        projectId: "p",
        groupId: "g",
        settings: draft.settings,
        steps: draft.steps,
        choices: [],
      }),
    ).toBeDefined();
  });
  it("requires each shadow occurrence, clears only that field and preserves chains", () => {
    const { snapshot } = fixture();
    const ref = (id: string) =>
      createTokenReference({ targetTokenId: id, valuePath: [] });
    const t = (id: string, type: string, value: any) =>
      createToken(
        {
          id,
          projectId: "p",
          localName: id,
          parentGroupId: null,
          regeneration: "allowed",
          definition: { type, assignments: [{ condition: [], value }] },
        },
        [],
      );
    const baseline = {
      ...snapshot,
      tokens: [
        ...snapshot.tokens,
        t("shadow", "shadow", {
          kind: "composite",
          valueType: "shadow",
          layers: [{ color: ref("t300") }, { color: ref("t700") }],
        }),
        t("indirect", "shadow", ref("shadow")),
      ],
    };
    const draft = replaceRampCount(
      baseline,
      "g",
      openRampDraft(baseline, "g"),
      6,
      () => "new",
    );
    const impacts = rampImpacts(baseline, "g", draft.steps);
    expect(impacts.required).toHaveLength(2);
    const input = {
      projectId: "p",
      groupId: "g",
      settings: draft.settings,
      steps: draft.steps,
      choices: impacts.required.map((u) => ({ key: u.key, target: null })),
    };
    const result = applyRampCandidate(baseline, input);
    expect(
      result.tokens.find((t) => t.id === "shadow")?.definition?.assignments[0]
        .value,
    ).toMatchObject({ layers: [{}, {}] });
    expect(result.tokens.find((t) => t.id === "indirect")).toEqual(
      baseline.tokens.find((t) => t.id === "indirect"),
    );
    expect(admitSnapshot(result, 4)).toEqual(result);
    expect(() => admitSnapshot(result, 3)).toThrow();
    expect(() =>
      applyRampCandidate(baseline, { ...input, choices: [] }),
    ).toThrow();
  });
  it("keeps an unchanged draft byte-equivalent and rejects unknown schemas", () => {
    const { snapshot } = fixture(),
      draft = openRampDraft(snapshot, "g");
    expect(
      applyRampCandidate(snapshot, { projectId: "p", groupId: "g", ...draft }),
    ).toEqual(snapshot);
    expect(() =>
      admitSnapshot(
        {
          ...snapshot,
          groups: [
            {
              ...snapshot.groups[0],
              colorRamp: { ...snapshot.groups[0].colorRamp, schemaVersion: 2 },
            },
          ],
        },
        4,
      ),
    ).toThrow();
  });
});
it("preserves protected/manual colors in ordinary regeneration and clears unprotected manual origin", () => {
  const { snapshot } = fixture();
  let draft = openRampDraft(snapshot, "g");
  draft = {
    ...draft,
    steps: draft.steps.map((s, i) =>
      i < 2
        ? { ...s, value: seed, colorOrigin: "manual", protected: i === 0 }
        : s,
    ),
  };
  const next = regenerateRamp(draft, {
    ...draft.settings,
    recipe: { ...draft.settings.recipe, intensity: "restrained" },
  });
  expect(next.steps[0]).toEqual(draft.steps[0]);
  expect(next.steps[1].colorOrigin).toBe("generated");
  expect(next.steps[1].value).not.toEqual(seed);
});
it("keeps unknown recipes inspectable and permits unrelated edits while blocking their operations", () => {
  const { snapshot } = fixture();
  const unknown = {
    ...snapshot,
    groups: [
      {
        ...snapshot.groups[0],
        colorRamp: {
          ...snapshot.groups[0].colorRamp!,
          recipe: { id: "future", version: 8, intensity: "retained" as const },
        },
      },
    ],
  };
  expect(admitSnapshot(unknown, 4)).toEqual(unknown);
  expect(() => openRampDraft(unknown, "g")).toThrow();
  const storage = candidateStorage(unknown),
    ops = createAuthoringOperations(storage);
  expect(
    ops.createColorToken({
      projectId: "p",
      id: "other",
      localName: "other",
      parentGroupId: null,
      type: "color",
      regeneration: "allowed",
      value: seed,
    }).status,
  ).toBe("ok");
});
it("refills only a missing shadow color and leaves other fields and references intact", () => {
  const { snapshot } = fixture();
  const token = createToken(
    {
      id: "shadow",
      projectId: "p",
      localName: "shadow",
      parentGroupId: null,
      regeneration: "allowed",
      definition: {
        type: "shadow",
        assignments: [
          {
            condition: [],
            value: {
              kind: "composite",
              valueType: "shadow",
              layers: [
                {
                  inset: {
                    kind: "literal",
                    valueType: "boolean",
                    value: false,
                  },
                },
                { color: seed },
              ],
            },
          },
        ],
      },
    },
    [],
  );
  const storage = candidateStorage({
      ...snapshot,
      tokens: [...snapshot.tokens, token],
    }),
    ops = createAuthoringOperations(storage);
  expect(
    ops.refillColor({
      projectId: "p",
      tokenId: "shadow",
      layerIndex: 0,
      value: createTokenReference({ targetTokenId: "t200", valuePath: [] }),
    }).status,
  ).toBe("ok");
  const read = storage.load("p");
  if (read.status !== "ok") throw Error();
  const updated = read.value!.tokens.find((t) => t.id === "shadow")!;
  expect(updated.definition!.assignments[0].value).toMatchObject({
    layers: [
      { inset: { value: false }, color: { targetTokenId: "t200" } },
      { color: seed },
    ],
  });
  expect(
    ops.refillColor({
      projectId: "p",
      tokenId: "shadow",
      layerIndex: 1,
      value: seed,
    }).status,
  ).toBe("failure");
});
it("ordinary member revision fixes Primitive/literal constraints and retains intentional edit-return origin", () => {
  const { snapshot, ops, storage } = fixture();
  const value = snapshot.tokens[0].definition!.assignments[0]
    .value as typeof seed;
  expect(
    ops.reviseColorToken({ projectId: "p", tokenId: "t50", value, layer: null })
      .status,
  ).toBe("failure");
  expect(
    ops.reviseColorToken({
      projectId: "p",
      tokenId: "t50",
      value: { kind: "token-reference", targetTokenId: "t200", valuePath: [] },
    }).status,
  ).toBe("failure");
  expect(
    ops.reviseColorToken({
      projectId: "p",
      tokenId: "t50",
      value,
      markManual: true,
    }).status,
  ).toBe("ok");
  const result = storage.load("p");
  if (result.status !== "ok") throw Error();
  expect(result.value!.groups[0].colorRamp!.members[0].colorOrigin).toBe(
    "manual",
  );
  expect(result.value!.tokens[0].definition!.assignments[0].value).toEqual(
    value,
  );
});
it("preserves unrelated member metadata and exposes refill only for locally missing shadow colors", () => {
  const { snapshot } = fixture();
  const source = {
    ...snapshot,
    tokens: snapshot.tokens.map((t, i) =>
      i === 0 ? { ...t, semanticRole: "preserved" } : t,
    ),
  };
  const draft = openRampDraft(source, "g");
  expect(
    applyRampCandidate(source, {
      projectId: "p",
      groupId: "g",
      settings: draft.settings,
      steps: draft.steps,
      choices: [],
    }).tokens[0].semanticRole,
  ).toBe("preserved");
  const partial = createToken(
    {
      id: "shadow",
      projectId: "p",
      localName: "shadow",
      parentGroupId: null,
      regeneration: "allowed",
      definition: {
        type: "shadow",
        assignments: [
          {
            condition: [],
            value: { kind: "composite", valueType: "shadow", layers: [{}] },
          },
        ],
      },
    },
    [],
  );
  const alias = createToken(
    {
      id: "alias",
      projectId: "p",
      localName: "alias",
      parentGroupId: null,
      regeneration: "allowed",
      definition: {
        type: "shadow",
        assignments: [
          {
            condition: [],
            value: createTokenReference({
              targetTokenId: "shadow",
              valuePath: [],
            }),
          },
        ],
      },
    },
    [],
  );
  const stored = { ...source, tokens: [...source.tokens, partial, alias] };
  expect(selectedInspection(stored, "shadow").missingColorLayers).toEqual([0]);
  expect(
    selectedInspection(stored, "alias").missingColorLayers,
  ).toBeUndefined();
});
