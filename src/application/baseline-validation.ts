import type { ProjectSnapshot } from "@application/project-storage";
import type { ProjectValidation } from "@application/authoring";
import { collectReferenceUses } from "@domain/token-reference-validation";
import { rampProblems } from "@application/color-ramp-authoring";

/** Fingerprint only facts used by the current closed diagnostic vocabulary. */
function cause(
  snapshot: ProjectSnapshot,
  diagnostic:
    | ProjectValidation["namespaceDiagnostics"][number]
    | ProjectValidation["referenceDiagnostics"][number],
): string {
  const token = (id: string) => snapshot.tokens.find((t) => t.id === id),
    group = (id: string) => snapshot.groups.find((g) => g.id === id);
  const identity = (id: string) => {
    const t = token(id);
    return t ? [t.projectId, t.definition?.type] : null;
  };
  const edges = (id: string) => {
    const t = token(id);
    return t?.definition?.assignments.map((a) => [
      a.condition,
      collectReferenceUses(a.value, t.definition!.type),
    ]);
  };
  if (diagnostic.code === "reference-cycle") {
    const ids =
      diagnostic.cycle.at(-1) === diagnostic.cycle[0]
        ? diagnostic.cycle.slice(0, -1)
        : diagnostic.cycle;
    const rotations = ids.map((_, i) => [...ids.slice(i), ...ids.slice(0, i)]);
    return JSON.stringify([
      rotations.sort((a, b) =>
        JSON.stringify(a).localeCompare(JSON.stringify(b)),
      )[0],
      ids.map((id) => [id, edges(id)]).sort(),
    ]);
  }
  if (diagnostic.code === "group-cycle")
    return JSON.stringify(
      diagnostic.cycle.map((id) => [id, group(id)?.parentGroupId]).sort(),
    );
  if ("targetTokenId" in diagnostic) {
    const t = token(diagnostic.tokenId),
      assignment = t?.definition?.assignments.find(
        (a) =>
          JSON.stringify(a.condition) === JSON.stringify(diagnostic.condition),
      );
    const use =
      assignment &&
      collectReferenceUses(assignment.value, t!.definition!.type).find(
        (u) =>
          u.field === diagnostic.field &&
          u.layerIndex === diagnostic.layerIndex &&
          JSON.stringify(u.path) ===
            JSON.stringify(diagnostic.operandPath ?? []) &&
          u.reference.targetTokenId === diagnostic.targetTokenId,
      );
    return JSON.stringify([
      diagnostic,
      identity(diagnostic.tokenId),
      use,
      identity(diagnostic.targetTokenId),
    ]);
  }
  if (
    diagnostic.code === "token-project-mismatch" ||
    diagnostic.code === "ambiguous-assignment"
  )
    return JSON.stringify([
      diagnostic,
      identity(diagnostic.tokenId),
      edges(diagnostic.tokenId),
    ]);
  if ("entityKind" in diagnostic) {
    const entity =
      diagnostic.entityKind === "group"
        ? group(diagnostic.entityId)
        : token(diagnostic.entityId);
    return JSON.stringify([
      diagnostic,
      entity?.projectId,
      entity?.parentGroupId,
      entity?.parentGroupId ? group(entity.parentGroupId)?.projectId : null,
    ]);
  }
  if (
    diagnostic.code === "missing-group" ||
    diagnostic.code === "missing-token"
  )
    return JSON.stringify([
      diagnostic,
      group(diagnostic.entityId)?.id,
      token(diagnostic.entityId)?.id,
    ]);
  throw new RangeError("Unrecognized validation diagnostic.");
}
export function newIntegrityErrors(
  previous: ProjectSnapshot,
  candidate: ProjectSnapshot,
  before: ProjectValidation,
  after: ProjectValidation,
): ProjectValidation {
  const oldNamespace = new Set(
      before.namespaceDiagnostics.map((d) => cause(previous, d)),
    ),
    oldReferences = new Set(
      before.referenceDiagnostics.map((d) => cause(previous, d)),
    );
  return {
    namespaceDiagnostics: after.namespaceDiagnostics.filter(
      (d) => !oldNamespace.has(cause(candidate, d)),
    ),
    referenceDiagnostics: after.referenceDiagnostics.filter(
      (d) => !oldReferences.has(cause(candidate, d)),
    ),
  };
}
export function assertRampIntegrity(
  previous: ProjectSnapshot | undefined,
  candidate: ProjectSnapshot,
) {
  for (const g of candidate.groups) {
    if (!g.colorRamp) continue;
    const issues = rampProblems(candidate, g.id);
    if (!issues.length) continue;
    const old = previous?.groups.find((x) => x.id === g.id);
    const facts = (s: ProjectSnapshot, r: typeof g) => [
      r.colorRamp,
      r.colorRamp?.members.map((m) => {
        const t = s.tokens.find((t) => t.id === m.tokenId);
        return [
          t?.id,
          t?.projectId,
          t?.parentGroupId,
          t?.localName,
          t?.layer,
          t?.definition,
        ];
      }),
    ];
    if (
      !previous ||
      !old?.colorRamp ||
      JSON.stringify(facts(previous, old)) !==
        JSON.stringify(facts(candidate, g))
    )
      throw new RangeError(issues.join(" "));
  }
}
