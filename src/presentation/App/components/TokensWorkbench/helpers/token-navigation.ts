import type { DisplayRow, ProjectContext } from "@application/retention/projections";
import { TOKEN_TYPES, TOKEN_LAYERS } from "@domain/token";
import { identityLabels } from "./identity-labels";
import { tokenListRows, comparePath } from "./token-list-order";
import type { TokenTypeScope } from "./browse-view";
import { typeLabel, layerLabel } from "./token-type-presentation";
export type NavigationBranch = { scope: TokenTypeScope; label: string; count: number; children?: NavigationBranch[] };
/** Complete project rows only; selection/search never influence these counts. */
export function tokenNavigation(rows: readonly DisplayRow[], context: ProjectContext | undefined): NavigationBranch[] {
  if (!context) return [];
  const labels = identityLabels(context.groups, ["Project root"]);
  const groups = new Map(context.groups.map(group => [group.authored.id as string, group]));
  return [...TOKEN_TYPES, "Unassigned" as const].flatMap(type => {
    const typed = rows.filter(row => row.type === type);
    if (!typed.length) return [];
    return [{scope: {kind: "type" as const, type}, label: typeLabel(type), count: typed.length,
      children: [...TOKEN_LAYERS, "Unspecified" as const].flatMap(layer => {
        const layered = typed.filter(row => row.layer === layer);
        if (!layered.length) return [];
        const scope: TokenTypeScope = {kind: "type", type, layer};
        const locations = [...new Set(layered.map(row => row.parentGroupId))].sort((a, b) => {
          if (a === null || b === null) return a === b ? 0 : a === null ? -1 : 1;
          const left = groups.get(a)?.path, right = groups.get(b)?.path;
          return (left?.status === "derived" && right?.status === "derived" ? comparePath(left.path, right.path) : 0) || a.localeCompare(b);
        });
        return [{scope, label: layerLabel(layer), count: layered.length, children: locations.flatMap(id => {
          const location = id === null ? {kind: "root" as const} : {kind: "group" as const, id};
          const leaf = {...scope, location};
          const count = tokenListRows(layered, context, leaf, "").length;
          return count ? [{scope: leaf, label: id === null ? "Project root" : labels.get(id) ?? `Missing group · ${id}`, count}] : [];
        })}];
      })}];
  });
}
export function typeScopeLabel(scope: TokenTypeScope, labels: Map<string, string>): string {
  return [typeLabel(scope.type), scope.layer && layerLabel(scope.layer), scope.location && (scope.location.kind === "root" ? "Project root" : labels.get(scope.location.id) ?? "Missing group")].filter(Boolean).join(" / ");
}
