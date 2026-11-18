import type { DisplayRow, ProjectContext } from "@application/retention/projections";
import type { TokenBrowseView } from "./browse-view";
import { TOKEN_TYPES, TOKEN_LAYERS } from "@domain/token";

const natural = new Intl.Collator("en", { numeric: true, sensitivity: "variant" });
export function comparePath(a: readonly string[], b: readonly string[]): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const difference = natural.compare(a[i], b[i]);
    if (difference) return difference;
  }
  return a.length - b.length;
}
const rank = (values: readonly string[], value: string) => {
  const index = values.indexOf(value);
  return index < 0 ? values.length : index;
};
/** Identity ancestry establishes scope. Display paths are only ordering keys. */
export function tokenListRows(rows: readonly DisplayRow[], context: ProjectContext | undefined, scope: TokenBrowseView | string | null, query: string): DisplayRow[] {
  if (!context) return [];
  const view: TokenBrowseView = typeof scope === "string" ? {kind: "group", id: scope} : scope ?? {kind: "all-tokens"};
  const groupId = view.kind === "group" ? view.id : view.kind === "type" && view.location?.kind === "group" ? view.location.id : null;
  const tokens = new Map(context.tokens.map(token => [token.authored.id as string, token]));
  const groups = new Map(context.groups.map(group => [group.authored.id as string, group.authored]));
  const membership = new Map<string, boolean>();
  function belongs(parent: string | null): boolean {
    if (groupId === null) return true;
    if (parent === null) return false;
    const cached = membership.get(parent);
    if (cached !== undefined) return cached;
    let current: string | null = parent, found = false;
    const visited = new Set<string>();
    while (current !== null) {
      if (visited.has(current)) { found = false; break; }
      visited.add(current);
      const group = groups.get(current);
      if (!group || group.projectId !== context!.project.id) { found = false; break; }
      if (current === groupId) found = true;
      current = group.parentGroupId;
    }
    membership.set(parent, found);
    return found;
  }
  const keys = new Map(rows.map(row => {
    const token = tokens.get(row.id);
    return [row.id, { path: token?.path.status === "derived" ? token.path.path.slice(0, -1) : null,
      name: token?.authored.localName ?? row.id }];
  }));
  return rows.filter(row => (view.kind !== "type" || (row.type === view.type && (view.layer === undefined || row.layer === view.layer) && (view.location?.kind !== "root" || row.parentGroupId === null))) && belongs(row.parentGroupId) && row.label.toLowerCase().includes(query.toLowerCase())).sort((a, b) => {
    if (view.kind !== "group") {
      const type = rank(TOKEN_TYPES, a.type) - rank(TOKEN_TYPES, b.type);
      if (type) return type;
      const layer = rank(TOKEN_LAYERS, a.layer) - rank(TOKEN_LAYERS, b.layer);
      if (layer) return layer;
    }
    const left = keys.get(a.id)!, right = keys.get(b.id)!;
    const path = left.path && right.path ? comparePath(left.path, right.path) : Number(!left.path) - Number(!right.path);
    return path || natural.compare(left.name, right.name) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  });
}
