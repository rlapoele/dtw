import type { ProjectSnapshot } from "@application/project-storage";
import type { TokenInspection } from "@application/authoring";
import type { Token } from "@domain/token";
import type { NamespacePathResult } from "@domain/namespace";
import {
  createNamespaceReadView,
} from "@domain/namespace";
import { canReviseColorToken } from "@application/color-revision-policy";
import { resolveToken } from "@domain/token-resolution";
import {
  completeVariationSelection,
  createVariationSelection,
} from "@domain/variation-selection";
import type { ColorLiteralValue } from "@domain/color-literal";
export type DisplayPath = NamespacePathResult | {
  status: "unavailable";
  reason: string;
};
const pathUnavailable: DisplayPath = {
  status: "unavailable",
  reason: "Derived path display unavailable: resource limit exceeded. Exact authored names and identities remain available in All authored data.",
};
/** Bound amplification before collecting ancestry or joining a display label.
 * The aggregate is a display budget, independent of authored admission. */
function boundedPaths(snapshot: ProjectSnapshot) {
  const groups = new Map(snapshot.groups.map(group => [group.id as string, group]));
  const view = createNamespaceReadView({ projectId: snapshot.project.id, groups: snapshot.groups, tokens: snapshot.tokens });
  let remainingUnits = 262144, remainingSteps = 50000;
  return (entity: ProjectSnapshot["groups"][number] | ProjectSnapshot["tokens"][number], kind: "group" | "token"): DisplayPath => {
    let current = entity, units = 0;
    const visited = new Set<object>();
    while (true) {
      if (--remainingSteps < 0) return pathUnavailable;
      units += (current.localName.length || 9) + (visited.size ? 3 : 0);
      if (units > 65536 || units > remainingUnits) return pathUnavailable;
      if (visited.has(current) || current.projectId !== snapshot.project.id) break;
      visited.add(current);
      if (current.parentGroupId === null) break;
      const parent = groups.get(current.parentGroupId);
      if (!parent) break;
      current = parent;
    }
    remainingUnits -= units;
    return kind === "group" ? view.groupPath(entity.id) : view.tokenPath(entity.id);
  };
}
function displayPathLabel(path: DisplayPath): string {
  return path.status === "derived"
    ? path.path.map(part => part || "(unnamed)").join(" / ")
    : path.status === "unavailable" ? "(derived path unavailable · resource limit)" : "(invalid namespace)";
}
export type ContextToken = {
  authored: Pick<Token, "id" | "localName" | "parentGroupId"> & {
    definition?: Pick<NonNullable<Token["definition"]>, "type">;
  };
  path: DisplayPath;
};
export type ProjectContext = {
  project: ProjectSnapshot["project"];
  groups: readonly {
    authored: ProjectSnapshot["groups"][number];
    path: DisplayPath;
  }[];
  tokens: readonly ContextToken[];
};
export type DisplayRow = {
  id: string;
  parentGroupId: string | null;
  label: string;
  description?: string;
  layer: string;
  type: string;
  valueKind: string;
  color?: ColorLiteralValue;
  targetId?: string;
  preview?: ColorLiteralValue;
};
export function projectContext(snapshot: ProjectSnapshot): ProjectContext {
  const path = boundedPaths(snapshot);
  return {
    project: snapshot.project,
    groups: snapshot.groups.map((authored) => ({
      authored,
      path: path(authored, "group"),
    })),
    tokens: snapshot.tokens.map((token) => ({
      authored: {
        id: token.id,
        localName: token.localName,
        parentGroupId: token.parentGroupId,
        ...(token.definition
          ? { definition: { type: token.definition.type } }
          : {}),
      },
      path: path(token, "token"),
    })),
  };
}
export function displayRows(
  snapshot: ProjectSnapshot,
  offset: number,
  count: number,
): DisplayRow[] {
  const path = boundedPaths(snapshot);
  const byId = new Map(
    snapshot.tokens.map((token) => [token.id as string, token]),
  );
  return snapshot.tokens.slice(offset, offset + count).map((token) => {
    const value = token.definition?.assignments[0]?.value;
    const tokenPath = path(token, "token");
    const color =
      value?.kind === "literal" && value.valueType === "color"
        ? value
        : undefined;
    let preview = color,
      target = value;
    const visited = new Set<string>();
    while (
      token.definition?.type === "color" &&
      target?.kind === "token-reference" &&
      target.valuePath.length === 0 &&
      !visited.has(target.targetTokenId)
    ) {
      visited.add(target.targetTokenId);
      const referenced = byId.get(target.targetTokenId);
      if (referenced?.definition?.type !== "color") break;
      target = referenced.definition.assignments[0]?.value;
      if (target?.kind === "literal" && target.valueType === "color")
        preview = target;
    }
    return {
      id: token.id,
      parentGroupId: token.parentGroupId,
      label: displayPathLabel(tokenPath),
      ...(token.description !== undefined
        ? { description: token.description }
        : {}),
      layer: token.layer ?? "Unspecified",
      type: token.definition?.type ?? "Unassigned",
      valueKind: value?.kind ?? "No assignment",
      ...(color ? { color } : {}),
      ...(value?.kind === "token-reference"
        ? { targetId: value.targetTokenId }
        : {}),
      ...(preview ? { preview } : {}),
    };
  });
}
export type SelectedToken = {
  token: Omit<Token, "definition"> & {
    definition?: { type: NonNullable<Token["definition"]>["type"] };
  };
  authoredValue?:
    | Extract<
        NonNullable<Token["definition"]>["assignments"][number]["value"],
        { kind: "token-reference" }
      >
    | ColorLiteralValue;
  authoredKind: string;
  editable: boolean;
  path: DisplayPath;
  resolution:
    | TokenInspection["resolution"]
    | {
        status: "unavailable";
        reason: string;
        trace: readonly [];
        diagnostics: readonly [];
      };
};
export function selectedInspection(
  snapshot: ProjectSnapshot,
  id: string,
): SelectedToken {
  const token = snapshot.tokens.find((t) => t.id === id);
  if (!token)
    throw Error(
      "Selected token no longer exists. Preserved input is not retargeted.",
    );
  const { definition, ...metadata } = token;
  const value = definition?.assignments[0]?.value;
  let resolution: SelectedToken["resolution"];
  let scheduled = 0;
  try {
    resolution = resolveToken(
      snapshot.project.id,
      snapshot.tokens,
      id,
      completeVariationSelection(
        [],
        createVariationSelection([]),
        createVariationSelection([]),
      ),
      {},
      {
        schedule(amount) {
          if ((scheduled += amount) > 10_000)
            throw Error(
              "Evaluation unavailable: scheduled task limit 10000 exceeded.",
            );
        },
        arithmetic(left, right, operation) {
          const parts = (v: string) => {
            const [integer, fraction = ""] = v.replace(/^-/, "").split(".");
            return {
              digits: integer.length + fraction.length,
              scale: fraction.length,
            };
          };
          const a = parts(left),
            b = parts(right);
          const scale =
            operation === "multiply"
              ? a.scale + b.scale
              : Math.max(a.scale, b.scale);
          const digits =
            operation === "multiply"
              ? a.digits + b.digits
              : Math.max(
                  a.digits + scale - a.scale,
                  b.digits + scale - b.scale,
                ) + 1;
          if (digits > 8192 || scale > 8192)
            throw Error(
              "Evaluation unavailable: derived Decimal digits/scale exceed 8192.",
            );
        },
      },
    );
    if (JSON.stringify(resolution).length > 65536)
      throw Error(
        "Derived representation unavailable: 65536 UTF-16 unit display limit exceeded.",
      );
  } catch (error) {
    resolution = {
      status: "unavailable",
      reason: error instanceof Error ? error.message : "Evaluation unavailable",
      trace: [],
      diagnostics: [],
    };
  }
  return {
    token: {
      ...metadata,
      ...(definition ? { definition: { type: definition.type } } : {}),
    },
    authoredKind: value?.kind ?? "No assignment",
    ...(value?.kind === "token-reference" ||
    (value?.kind === "literal" && value.valueType === "color")
      ? { authoredValue: value }
      : {}),
    editable: canReviseColorToken(token),
    path: boundedPaths(snapshot)(token, "token"),
    resolution,
  };
}
