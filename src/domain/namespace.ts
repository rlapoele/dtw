import type { TokenGroupId, TokenId } from "./identifiers";
import type { Token } from "./token";
import type { TokenGroup } from "./token-group";

// An operation input, not a persisted Project aggregate or ownership list.
export type ProjectNamespaceSnapshot = {
  readonly projectId: string;
  readonly groups: readonly TokenGroup[];
  readonly tokens: readonly Token[];
};

export type NamespaceDiagnostic =
  | {
      readonly code: "project-mismatch" | "missing-parent-group" | "foreign-parent-group";
      readonly entityKind: "group" | "token";
      readonly entityId: TokenGroupId | TokenId;
      readonly parentGroupId?: TokenGroupId;
    }
  | { readonly code: "group-cycle"; readonly cycle: readonly TokenGroupId[] }
  | { readonly code: "missing-group" | "missing-token"; readonly entityId: string };

export type NamespacePathResult =
  | { readonly status: "derived"; readonly path: readonly string[] }
  | { readonly status: "invalid"; readonly diagnostics: readonly NamespaceDiagnostic[] };

export type NamespaceChangeResult =
  | { readonly status: "updated"; readonly namespace: ProjectNamespaceSnapshot }
  | { readonly status: "invalid"; readonly diagnostics: readonly NamespaceDiagnostic[] };

type NamespaceIndex = {
  groups: ReadonlyMap<string, TokenGroup>;
  tokens: ReadonlyMap<string, Token>;
};

type NamespaceEntity = TokenGroup | Token;

// Structural validation only: opaque names are not normalized, compared for
// sibling uniqueness, split, escaped, or joined into target-specific strings.
export function validateProjectNamespace(
  namespace: ProjectNamespaceSnapshot,
): readonly NamespaceDiagnostic[] {
  return validateIndexedNamespace(namespace, indexNamespace(namespace));
}

export function deriveTokenGroupPath(
  namespace: ProjectNamespaceSnapshot,
  groupId: string,
): NamespacePathResult {
  const index = indexNamespace(namespace);
  const group = index.groups.get(groupId);
  if (group === undefined) return invalidPath({ code: "missing-group", entityId: groupId });
  return deriveEntityPath(namespace.projectId, index.groups, group, "group");
}

export function deriveTokenPath(
  namespace: ProjectNamespaceSnapshot,
  tokenId: string,
): NamespacePathResult {
  const index = indexNamespace(namespace);
  const token = index.tokens.get(tokenId);
  if (token === undefined) return invalidPath({ code: "missing-token", entityId: tokenId });
  return deriveEntityPath(namespace.projectId, index.groups, token, "token");
}

export function moveTokenGroup(
  namespace: ProjectNamespaceSnapshot,
  groupId: string,
  parentGroupId: string | null,
): NamespaceChangeResult {
  const index = indexNamespace(namespace);
  const group = index.groups.get(groupId);
  if (group === undefined) return { status: "invalid", diagnostics: [{ code: "missing-group", entityId: groupId }] };
  const groups = namespace.groups.map(current => current.id === group.id
    ? { ...current, parentGroupId: parentGroupId as TokenGroupId | null }
    : current);
  return validateChange({ ...namespace, groups });
}

export function moveTokenInNamespace(
  namespace: ProjectNamespaceSnapshot,
  tokenId: string,
  parentGroupId: string | null,
): NamespaceChangeResult {
  const index = indexNamespace(namespace);
  const token = index.tokens.get(tokenId);
  if (token === undefined) return { status: "invalid", diagnostics: [{ code: "missing-token", entityId: tokenId }] };
  const tokens = namespace.tokens.map(current => current.id === token.id
    ? { ...current, parentGroupId: parentGroupId as TokenGroupId | null }
    : current);
  return validateChange({ ...namespace, tokens });
}

function validateChange(namespace: ProjectNamespaceSnapshot): NamespaceChangeResult {
  const diagnostics = validateProjectNamespace(namespace);
  return diagnostics.length === 0
    ? { status: "updated", namespace }
    : { status: "invalid", diagnostics };
}

function indexNamespace(namespace: ProjectNamespaceSnapshot): NamespaceIndex {
  const groups = new Map<string, TokenGroup>();
  const tokens = new Map<string, Token>();
  for (const group of namespace.groups) {
    if (groups.has(group.id)) throw new RangeError("Duplicate group identity in namespace snapshot");
    groups.set(group.id, group);
  }
  for (const token of namespace.tokens) {
    if (tokens.has(token.id)) throw new RangeError("Duplicate token identity in namespace snapshot");
    tokens.set(token.id, token);
  }
  return { groups, tokens };
}

function validateIndexedNamespace(
  namespace: ProjectNamespaceSnapshot,
  index: NamespaceIndex,
): readonly NamespaceDiagnostic[] {
  const diagnostics: NamespaceDiagnostic[] = [];
  // Only valid project-owned edges participate in cycle detection.
  const parents = new Map<TokenGroupId, TokenGroupId>();
  for (const group of namespace.groups) {
    const issue = validateEntity(namespace.projectId, index.groups, group, "group");
    if (issue !== undefined) diagnostics.push(issue);
    else if (group.parentGroupId !== null) parents.set(group.id, group.parentGroupId);
  }
  for (const token of namespace.tokens) {
    const issue = validateEntity(namespace.projectId, index.groups, token, "token");
    if (issue !== undefined) diagnostics.push(issue);
  }

  const visited = new Set<TokenGroupId>();
  for (const start of parents.keys()) {
    const ancestry: TokenGroupId[] = [];
    const positions = new Map<TokenGroupId, number>();
    let current: TokenGroupId | undefined = start;
    while (current !== undefined && !visited.has(current)) {
      const position = positions.get(current);
      if (position !== undefined) {
        diagnostics.push({ code: "group-cycle", cycle: [...ancestry.slice(position), current] });
        break;
      }
      positions.set(current, ancestry.length);
      ancestry.push(current);
      current = parents.get(current);
    }
    for (const id of ancestry) visited.add(id);
  }
  return diagnostics;
}

function validateEntity(
  projectId: string,
  groups: ReadonlyMap<string, TokenGroup>,
  entity: NamespaceEntity,
  entityKind: "group" | "token",
): NamespaceDiagnostic | undefined {
  if (entity.projectId !== projectId) return { code: "project-mismatch", entityKind, entityId: entity.id };
  if (entity.parentGroupId === null) return undefined;
  const parent = groups.get(entity.parentGroupId);
  if (parent === undefined) return { code: "missing-parent-group", entityKind, entityId: entity.id, parentGroupId: entity.parentGroupId };
  if (parent.projectId !== projectId) return { code: "foreign-parent-group", entityKind, entityId: entity.id, parentGroupId: entity.parentGroupId };
  return undefined;
}

function deriveEntityPath(
  projectId: string,
  groups: ReadonlyMap<string, TokenGroup>,
  entity: NamespaceEntity,
  entityKind: "group" | "token",
): NamespacePathResult {
  const names: string[] = [];
  const ancestry: TokenGroupId[] = [];
  const positions = new Map<TokenGroupId, number>();
  let current: NamespaceEntity = entity;
  let currentKind = entityKind;
  while (true) {
    const issue = validateEntity(projectId, groups, current, currentKind);
    if (issue !== undefined) return invalidPath(issue);
    if (currentKind === "group") {
      const groupId = current.id as TokenGroupId;
      const position = positions.get(groupId);
      if (position !== undefined) return invalidPath({ code: "group-cycle", cycle: [...ancestry.slice(position), groupId] });
      positions.set(groupId, ancestry.length);
      ancestry.push(groupId);
    }
    names.push(current.localName);
    if (current.parentGroupId === null) return { status: "derived", path: names.reverse() };
    // validateEntity established that the parent exists in this project.
    current = groups.get(current.parentGroupId)!;
    currentKind = "group";
  }
}

function invalidPath(diagnostic: NamespaceDiagnostic): NamespacePathResult {
  return { status: "invalid", diagnostics: [diagnostic] };
}
