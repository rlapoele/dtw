import { isColorSpace, type ColorSpace } from "@domain/color-literal";
import type { ProjectId } from "@domain/identifiers";

export type ProjectName = string;

export type ProjectPreferences = { readonly defaultColorSpace: ColorSpace };
export const NEW_PROJECT_COLOR_SPACE: ColorSpace = "oklch";

export function assertProjectPreferences(value: unknown): asserts value is ProjectPreferences {
  if (value === null || typeof value !== "object" || Array.isArray(value) ||
      Object.keys(value).length !== 1 || !Object.hasOwn(value, "defaultColorSpace") ||
      !isColorSpace((value as ProjectPreferences).defaultColorSpace))
    throw new RangeError("Invalid project preferences");
}

export function effectiveDefaultColorSpace(project: Project): ColorSpace {
  return project.preferences?.defaultColorSpace ?? "srgb";
}

export type Project = {
  readonly id: ProjectId;
  readonly name: ProjectName;
  readonly description?: string;
  readonly preferences?: ProjectPreferences;
  readonly creationDate?: string;
  readonly lastUpdatedDate?: string;
};

export type ProjectInput = {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly preferences?: ProjectPreferences;
};

// Identity is supplied by the caller. Identifier formats and name rules remain
// open; workspace location and project-owned collections are separate concerns.
export function createProject(input: ProjectInput): Project {
  if (Object.hasOwn(input, "preferences")) assertProjectPreferences(input.preferences);
  return {
    id: input.id as ProjectId,
    name: input.name,
    preferences: { defaultColorSpace: input.preferences?.defaultColorSpace ?? NEW_PROJECT_COLOR_SPACE },
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
