import { createVariationCondition } from "@domain/variation-condition";
import { createShadow } from "@domain/shadow";
import {
  generateColorRamp,
  rampLabels,
  autoRampPosition,
  type ColorRamp,
  type RampSettings,
} from "@domain/color-ramp";
import {
  createColorLiteral,
  type ColorLiteralValue,
} from "@domain/color-literal";
import { createToken, type Token } from "@domain/token";
import { createTokenGroup, type TokenGroupInput } from "@domain/token-group";
import { createTokenReference } from "@domain/token-reference";
import { collectReferenceUses } from "@domain/token-reference-validation";
import type { ProjectSnapshot } from "@application/project-storage";

export type RampStep = {
  id: string;
  label: string;
  value: ColorLiteralValue;
  description?: string;
  protected: boolean;
  colorOrigin: "generated" | "manual";
};
export type ReferenceChoice = { key: string; target: string | null };
export type RampDraft = {
  settings: RampSettings;
  steps: RampStep[];
  registry: Record<string, RampStep>;
  replacement: boolean;
  choices: ReferenceChoice[];
};
export type CreateRampInput = {
  projectId: string;
  group: TokenGroupInput;
  settings: RampSettings;
  members: { id: string; label: string }[];
  seedDescription?: string;
};
export type ApplyRampInput = {
  projectId: string;
  groupId: string;
  settings: RampSettings;
  steps: RampStep[];
  choices: ReferenceChoice[];
};
export type RefillColorInput = {
  projectId: string;
  tokenId: string;
  layerIndex?: number;
  value: ColorLiteralValue | ReturnType<typeof createTokenReference>;
};
export function rampProblems(
  snapshot: ProjectSnapshot,
  groupId: string,
): string[] {
  const group = snapshot.groups.find((g) => g.id === groupId),
    r = group?.colorRamp;
  if (!r) return ["Ramp metadata is unavailable."];
  const errors: string[] = [];
  if (r.recipe.id !== "single-seed-oklch" || r.recipe.version !== 1)
    errors.push("Unsupported ramp recipe.");
  const labels = rampLabels(r.members.length);
  r.members.forEach((member, i) => {
    const t = snapshot.tokens.find((t) => t.id === member.tokenId),
      a = t?.definition?.assignments;
    if (
      !t ||
      t.projectId !== group.projectId ||
      t.parentGroupId !== group.id ||
      t.localName !== labels[i] ||
      t.layer !== "primitive" ||
      t.definition?.type !== "color" ||
      a?.length !== 1 ||
      a[0].condition.length !== 0 ||
      a[0].value.kind !== "literal" ||
      a[0].value.valueType !== "color"
    )
      errors.push(`Incompatible or missing ramp member ${labels[i]}.`);
    if (
      snapshot.groups.filter((g) =>
        g.colorRamp?.members.some((m) => m.tokenId === member.tokenId),
      ).length !== 1
    )
      errors.push(`Duplicate ramp ownership ${member.tokenId}.`);
  });
  try {
    generateColorRamp(r, r.members.length);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Invalid recipe");
  }
  return errors;
}
export function openRampDraft(
  snapshot: ProjectSnapshot,
  groupId: string,
): RampDraft {
  const errors = rampProblems(snapshot, groupId);
  if (errors.length) throw new RangeError(errors.join(" "));
  const r = snapshot.groups.find((g) => g.id === groupId)!.colorRamp!;
  const steps = r.members.map((m) => {
    const t = snapshot.tokens.find((t) => t.id === m.tokenId)!;
    return {
      id: t.id,
      label: t.localName,
      value: t.definition!.assignments[0].value as ColorLiteralValue,
      ...(t.description === undefined ? {} : { description: t.description }),
      protected: t.authoring.regeneration === "protected",
      colorOrigin: m.colorOrigin,
    };
  });
  return {
    settings: {
      seed: r.seed,
      targetGamut: r.targetGamut,
      recipe: r.recipe,
      seedPosition: r.seedPosition,
    },
    steps,
    registry: Object.fromEntries(steps.map((s) => [s.label, s])),
    replacement: false,
    choices: [],
  };
}
export function regenerateRamp(
  draft: RampDraft,
  settings: RampSettings,
): RampDraft {
  const generated = generateColorRamp(settings, draft.steps.length);
  return {
    ...draft,
    settings,
    steps: draft.steps.map((step, i) =>
      step.protected
        ? step
        : { ...step, value: generated[i].value, colorOrigin: "generated" },
    ),
  };
}
export function replaceRampCount(
  snapshot: ProjectSnapshot,
  groupId: string,
  draft: RampDraft,
  count: number,
  id: () => string,
): RampDraft {
  const labels = rampLabels(count),
    saved =
      snapshot.groups
        .find((g) => g.id === groupId)
        ?.colorRamp?.members.map((m) => m.tokenId) ?? [];
  for (const label of labels)
    if (
      snapshot.tokens.some(
        (t) =>
          t.parentGroupId === groupId &&
          t.localName === label &&
          !saved.includes(t.id),
      ) ||
      snapshot.groups.some(
        (g) => g.parentGroupId === groupId && g.localName === label,
      )
    )
      throw new RangeError(
        `Step ${label} conflicts with a non-member. Choose another count or resolve the name through ordinary editing.`,
      );
  const registry = {
    ...draft.registry,
    ...Object.fromEntries(draft.steps.map((s) => [s.label, s])),
  };
  const settings = {
    ...draft.settings,
    seedPosition: labels.includes(draft.settings.seedPosition.label)
      ? draft.settings.seedPosition
      : {
          mode: "auto" as const,
          label: autoRampPosition(draft.settings.seed, count),
        },
  };
  const steps = generateColorRamp(settings, count).map(({ label, value }) => ({
    ...registry[label],
    id: registry[label]?.id ?? id(),
    label,
    value,
    protected: registry[label]?.protected ?? false,
    colorOrigin: "generated" as const,
  }));
  return {
    settings,
    steps,
    registry: {
      ...registry,
      ...Object.fromEntries(steps.map((s) => [s.label, s])),
    },
    replacement: true,
    choices: [],
  };
}
export function rampReferenceOccurrences(snapshot: ProjectSnapshot) {
  return snapshot.tokens.flatMap((token) =>
    (token.definition?.assignments ?? []).flatMap((assignment, index) =>
      collectReferenceUses(assignment.value, token.definition!.type).map(
        (use) => ({
          key: JSON.stringify([
            token.id,
            index,
            use.field ?? null,
            use.layerIndex ?? null,
            use.path,
          ]),
          tokenId: token.id,
          assignment: index,
          ...use,
          supported:
            assignment.condition.length === 0 &&
            use.reference.valuePath.length === 0 &&
            use.path.length === 0 &&
            use.expectedType === "color" &&
            ((!use.field && token.definition!.type === "color") ||
              (use.field === "color" && use.layerIndex !== undefined)),
        }),
      ),
    ),
  );
}
export function rampImpacts(
  snapshot: ProjectSnapshot,
  groupId: string,
  steps: readonly RampStep[],
) {
  const saved =
      snapshot.groups
        .find((g) => g.id === groupId)
        ?.colorRamp?.members.map((m) => m.tokenId) ?? [],
    final = new Set(steps.map((s) => s.id));
  const uses = rampReferenceOccurrences(snapshot),
    removed = new Set(saved.filter((id) => !final.has(id)));
  const required = uses.filter((u) => removed.has(u.reference.targetTokenId));
  const affected = new Set(saved);
  let changed = true;
  while (changed) {
    changed = false;
    for (const use of uses)
      if (
        affected.has(use.reference.targetTokenId) &&
        !affected.has(use.tokenId)
      ) {
        affected.add(use.tokenId);
        changed = true;
      }
  }
  return {
    required,
    informational: snapshot.tokens.filter(
      (t) =>
        affected.has(t.id) &&
        !saved.includes(t.id) &&
        !required.some((r) => r.tokenId === t.id),
    ),
  };
}
export function downstreamTokens(
  snapshot: ProjectSnapshot,
  id: string,
): Token[] {
  const affected = new Set([id]),
    uses = rampReferenceOccurrences(snapshot);
  let changed = true;
  while (changed) {
    changed = false;
    for (const use of uses)
      if (
        affected.has(use.reference.targetTokenId) &&
        !affected.has(use.tokenId)
      ) {
        affected.add(use.tokenId);
        changed = true;
      }
  }
  return snapshot.tokens.filter((t) => affected.has(t.id));
}
function metadata(
  settings: RampSettings,
  steps: readonly RampStep[],
): ColorRamp {
  return {
    ...settings,
    schemaVersion: 1,
    members: steps.map((s) => ({ tokenId: s.id, colorOrigin: s.colorOrigin })),
  };
}
function memberToken(
  projectId: string,
  groupId: string,
  step: RampStep,
  previous?: Token,
): Token {
  return createToken(
    {
      id: step.id,
      projectId,
      parentGroupId: groupId,
      localName: step.label,
      description: step.description,
      ...(previous?.semanticRole === undefined
        ? {}
        : { semanticRole: previous.semanticRole }),
      layer: "primitive",
      regeneration: step.protected ? "protected" : "allowed",
      definition: {
        type: "color",
        assignments: [{ condition: [], value: createColorLiteral(step.value) }],
      },
    },
    [],
  );
}
export function createRampCandidate(
  snapshot: ProjectSnapshot,
  input: CreateRampInput,
): ProjectSnapshot {
  if (
    input.group.projectId !== snapshot.project.id ||
    input.projectId !== snapshot.project.id
  )
    throw new RangeError("Project mismatch.");
  const generated = generateColorRamp(input.settings, input.members.length);
  const steps = generated.map((g, i) => {
    if (input.members[i].label !== g.label)
      throw new RangeError("Invalid member labels.");
    return {
      ...g,
      id: input.members[i].id,
      protected: false,
      colorOrigin: "generated" as const,
      ...(g.label === input.settings.seedPosition.label && input.seedDescription
        ? { description: input.seedDescription }
        : {}),
    };
  });
  const group = createTokenGroup({
    ...input.group,
    colorRamp: metadata(input.settings, steps),
  });
  if (
    snapshot.groups.some((g) => g.id === group.id) ||
    steps.some((s) => snapshot.tokens.some((t) => t.id === s.id)) ||
    new Set(steps.map((s) => s.id)).size !== steps.length
  )
    throw new RangeError("Duplicate identity.");
  return {
    ...snapshot,
    groups: [...snapshot.groups, group],
    tokens: [
      ...snapshot.tokens,
      ...steps.map((s) => memberToken(input.projectId, group.id, s)),
    ],
  };
}
export function applyRampCandidate(
  snapshot: ProjectSnapshot,
  input: ApplyRampInput,
): ProjectSnapshot {
  const problems = rampProblems(snapshot, input.groupId);
  if (problems.length) throw new RangeError(problems.join(" "));
  const group = snapshot.groups.find((g) => g.id === input.groupId)!,
    saved = group.colorRamp!.members.map((m) => m.tokenId);
  const labels = rampLabels(input.steps.length);
  generateColorRamp(input.settings, input.steps.length);
  if (new Set(input.steps.map((s) => s.id)).size !== input.steps.length)
    throw new RangeError("Duplicate member identities.");
  input.steps.forEach((step, i) => {
    if (step.label !== labels[i]) throw new RangeError("Invalid ramp label.");
    const old = snapshot.tokens.find((t) => t.id === step.id);
    if (old && (!saved.includes(old.id) || old.localName !== step.label))
      throw new RangeError("A member identity cannot be reassigned.");
    const survivor = snapshot.tokens.find(
      (t) => saved.includes(t.id) && t.localName === step.label,
    );
    if (survivor && survivor.id !== step.id)
      throw new RangeError("Surviving members retain identity.");
    if (
      snapshot.tokens.some(
        (t) =>
          t.parentGroupId === group.id &&
          t.localName === step.label &&
          !saved.includes(t.id),
      ) ||
      snapshot.groups.some(
        (g) => g.parentGroupId === group.id && g.localName === step.label,
      )
    )
      throw new RangeError("Non-member name conflict.");
  });
  const required = rampImpacts(snapshot, group.id, input.steps).required;
  if (
    input.choices.length !== required.length ||
    new Set(input.choices.map((c) => c.key)).size !== required.length
  )
    throw new RangeError(
      "Every removed reference needs an individually accepted choice.",
    );
  let tokens = snapshot.tokens.filter((t) => !saved.includes(t.id));
  for (const occurrence of required) {
    const choice = input.choices.find((c) => c.key === occurrence.key);
    if (
      !occurrence.supported ||
      !choice ||
      (choice.target !== null &&
        !input.steps.some((s) => s.id === choice.target))
    )
      throw new RangeError("Invalid or unsupported reference choice.");
    tokens = tokens.map((t) =>
      t.id !== occurrence.tokenId
        ? t
        : changeColorOccurrence(
            t,
            occurrence.layerIndex,
            choice.target === null
              ? undefined
              : createTokenReference({
                  targetTokenId: choice.target,
                  valuePath: [],
                }),
          ),
    );
  }
  return {
    ...snapshot,
    groups: snapshot.groups.map((g) =>
      g.id === group.id
        ? { ...g, colorRamp: metadata(input.settings, input.steps) }
        : g,
    ),
    tokens: [
      ...snapshot.tokens.flatMap((t) =>
        saved.includes(t.id)
          ? input.steps
              .filter((s) => s.id === t.id)
              .map((s) => memberToken(input.projectId, group.id, s, t))
          : tokens.filter((x) => x.id === t.id),
      ),
      ...input.steps
        .filter((s) => !saved.includes(s.id))
        .map((s) => memberToken(input.projectId, group.id, s)),
    ],
  };
}
function changeColorOccurrence(
  token: Token,
  layerIndex: number | undefined,
  value: RefillColorInput["value"] | undefined,
): Token {
  const definition = token.definition!;
  if (layerIndex === undefined)
    return {
      ...token,
      definition: {
        ...definition,
        assignments: value
          ? [{ condition: createVariationCondition([]), value }]
          : [],
      },
    };
  const original = definition.assignments[0];
  if (
    original.value.kind !== "composite" ||
    original.value.valueType !== "shadow" ||
    !original.value.layers[layerIndex]
  )
    throw new RangeError("Shadow field is unavailable.");
  const layers = original.value.layers.map((layer, i) => {
    if (i !== layerIndex) return layer;
    const { color: _, ...rest } = layer;
    return value ? { ...rest, color: value } : rest;
  });
  return {
    ...token,
    definition: {
      ...definition,
      assignments: [{ ...original, value: createShadow({ layers }) }],
    },
  };
}
export function refillColorCandidate(
  snapshot: ProjectSnapshot,
  input: RefillColorInput,
): ProjectSnapshot {
  const t = snapshot.tokens.find((t) => t.id === input.tokenId);
  if (!t) throw new RangeError("Token not found.");
  if (input.layerIndex === undefined) {
    if (t.definition?.type !== "color" || t.definition.assignments.length !== 0)
      throw new RangeError("Only an unassigned color can be refilled.");
  } else {
    const value = t.definition?.assignments[0]?.value;
    if (
      value?.kind !== "composite" ||
      value.valueType !== "shadow" ||
      value.layers[input.layerIndex]?.color !== undefined
    )
      throw new RangeError("Only a missing shadow color can be refilled.");
  }
  const value =
    input.value.kind === "literal"
      ? createColorLiteral(input.value)
      : createTokenReference(input.value);
  return {
    ...snapshot,
    tokens: snapshot.tokens.map((token) =>
      token.id === t.id
        ? changeColorOccurrence(token, input.layerIndex, value)
        : token,
    ),
  };
}

/** Disposable preview only. Unanswered choices remain missing references; never a commit candidate. */
export function previewRampDraft(
  snapshot: ProjectSnapshot,
  groupId: string,
  draft: RampDraft,
): ProjectSnapshot {
  const saved =
    snapshot.groups
      .find((g) => g.id === groupId)
      ?.colorRamp?.members.map((m) => m.tokenId) ?? [];
  let tokens = snapshot.tokens.filter((t) => !saved.includes(t.id));
  for (const occurrence of rampImpacts(snapshot, groupId, draft.steps)
    .required) {
    const choice = draft.choices.find((c) => c.key === occurrence.key);
    if (!choice || !occurrence.supported) continue;
    tokens = tokens.map((t) =>
      t.id === occurrence.tokenId
        ? changeColorOccurrence(
            t,
            occurrence.layerIndex,
            choice.target === null
              ? undefined
              : createTokenReference({
                  targetTokenId: choice.target,
                  valuePath: [],
                }),
          )
        : t,
    );
  }
  return {
    ...snapshot,
    tokens: [
      ...tokens,
      ...draft.steps.map((s) => memberToken(snapshot.project.id, groupId, s)),
    ],
  };
}
