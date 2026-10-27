import type { ProjectId } from "./identifiers";

export type ProjectName = string;

export type Project = {
  readonly id: ProjectId;
  readonly name: ProjectName;
  readonly description?: string;
};

export type ProjectInput = {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
};

// Identity is supplied by the caller. Identifier formats and name rules remain
// open; workspace location and project-owned collections are separate concerns.
export function createProject(input: ProjectInput): Project {
  return {
    id: input.id as ProjectId,
    name: input.name,
    ...(input.description === undefined ? {} : { description: input.description }),
  };
}

export function renameProject(project: Project, name: string): Project {
  return { ...project, name };
}

export function changeProjectDescription(
  project: Project,
  description: string | undefined,
): Project {
  if (description === undefined) {
    const { description: _description, ...withoutDescription } = project;
    return withoutDescription;
  }

  return { ...project, description };
}
