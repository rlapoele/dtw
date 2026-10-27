import type { ProjectId, TokenGroupId } from "./identifiers";

export type TokenGroupName = string;

export type TokenGroup = {
  readonly id: TokenGroupId;
  readonly projectId: ProjectId;
  readonly localName: TokenGroupName;
  readonly parentGroupId: TokenGroupId | null;
  readonly description?: string;
};

export type TokenGroupInput = {
  readonly id: string;
  readonly projectId: string;
  readonly localName: string;
  readonly parentGroupId: string | null;
  readonly description?: string;
};

// Names and identifiers are opaque. Cross-group invariants require a project
// snapshot and are deliberately checked by project-scoped namespace operations.
export function createTokenGroup(input: TokenGroupInput): TokenGroup {
  return {
    id: input.id as TokenGroupId,
    projectId: input.projectId as ProjectId,
    localName: input.localName,
    parentGroupId: input.parentGroupId as TokenGroupId | null,
    ...(input.description === undefined ? {} : { description: input.description }),
  };
}

export function renameTokenGroup(group: TokenGroup, localName: string): TokenGroup {
  return { ...group, localName };
}
