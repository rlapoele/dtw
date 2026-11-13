import type { ProjectContext } from '@application/retention/projections';
import { prepareNamespaceName } from '@domain/namespace-naming';
import { introducedNamespaceCollisions } from '@domain/namespace-collisions';
import type { NamingNamespace } from '@domain/namespace-collisions';
export function namingPreview(project: ProjectContext | undefined, kind: 'token' | 'group' | 'rename' | null, raw: string, parent: string | null, renameTarget?: string | null) {
  let name: string;
  try { name = prepareNamespaceName(raw); }
  catch (error) { return { error: error instanceof Error ? error.message : 'Name preparation unavailable.', collisions: [] }; }
  if (!project) return { name, error: 'Project context unavailable.', collisions: [] };
  const before: NamingNamespace = {
    projectId: project.project.id,
    groups: project.groups.map(g => g.authored),
    tokens: project.tokens.map(t => ({...t.authored, projectId: project.project.id})),
  };
  // A synthetic preview identity never becomes an authored identity.
  let id = 'preview';
  while ([...before.groups,...before.tokens].some(entry => entry.id === id)) id += '-';
  const target = before.groups.find(g => g.id === renameTarget);
  const member = {id, projectId:project.project.id, parentGroupId:parent, localName:name};
  const after = kind === 'rename'
    ? {...before, groups:before.groups.map(g => g.id === renameTarget ? {...g,localName:name} : g)}
    : kind === 'group' ? {...before,groups:[...before.groups,member]} : {...before,tokens:[...before.tokens,member]};
  const parentId = kind === 'rename' ? target?.parentGroupId : parent;
  const parentPath = parentId === null ? [] : project.groups.find(g => g.authored.id === parentId)?.path;
  const path = Array.isArray(parentPath) ? [...parentPath,name] : parentPath && 'status' in parentPath && parentPath.status === 'derived' ? [...parentPath.path,name] : undefined;
  return {name, path, collisions:introducedNamespaceCollisions(before,after), previewId:id};
}
