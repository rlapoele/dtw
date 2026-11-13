import { namespacePathKey } from './namespace-naming';
export type NamingMember = { readonly id: string; readonly projectId: string; readonly parentGroupId: string | null; readonly localName: string };
export type NamingNamespace = { readonly projectId: string; readonly groups: readonly NamingMember[]; readonly tokens: readonly NamingMember[] };
export type NamespaceCollisionMember = { readonly kind: 'group' | 'token'; readonly id: string; readonly path: readonly string[] };
export type NamespaceCollision = { readonly code: 'namespace-path-collision'; readonly members: readonly NamespaceCollisionMember[] };
const identity = (entry: NamespaceCollisionMember) => JSON.stringify([entry.kind, entry.id]);
function buckets(namespace: NamingNamespace) {
  const groups = new Map(namespace.groups.map(g => [g.id, g]));
  const result = new Map<string, NamespaceCollisionMember[]>();
  for (const kind of ['group', 'token'] as const) {
    for (const entity of kind === 'group' ? namespace.groups : namespace.tokens) {
      const segments: string[] = [], visited = new Set<string>();
      let current: NamingMember | undefined = entity;
      let valid = true;
      while (current) {
        if (current.projectId !== namespace.projectId || visited.has(JSON.stringify([segments.length === 0 ? kind : "group", current.id]))) { valid = false; break; }
        visited.add(JSON.stringify([segments.length === 0 ? kind : "group", current.id]));
        segments.push(current.localName);
        if (current.parentGroupId === null) break;
        current = groups.get(current.parentGroupId);
        if (!current) valid = false;
      }
      if (!valid) continue; // structural checks remain a separate authority
      const path = segments.reverse(), key = namespacePathKey(path);
      const bucket = result.get(key) ?? [];
      bucket.push({kind, id: entity.id, path});
      result.set(key, bucket);
    }
  }
  return result;
}
export function namespaceCollisions(namespace: NamingNamespace): readonly NamespaceCollision[] {
  return [...buckets(namespace).values()].filter(members => members.length > 1).map(members => ({code:'namespace-path-collision', members}));
}
/** Compare collision relationships, including every descendant. An unchanged
 * legacy collision does not become a new whole-project admission gate. */
export function introducedNamespaceCollisions(before: NamingNamespace, after: NamingNamespace): readonly NamespaceCollision[] {
  const previous = new Map<string, string>();
  for (const [key, members] of buckets(before))
    for (const member of members) previous.set(identity(member), key);
  return namespaceCollisions(after).filter(collision => {
    const keys = collision.members.map(member => previous.get(identity(member)));
    return keys.some(key => key === undefined || key !== keys[0]);
  });
}
