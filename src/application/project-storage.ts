import type { Project } from "../domain/project";
import type { Token } from "../domain/token";
import type { TokenGroup } from "../domain/token-group";

// Operational coordination data, not a canonical aggregate or file schema.
// This workflow has no axes or presets and authors unconditional assignments.
export type ProjectSnapshot = {
  readonly project: Project;
  readonly groups: readonly TokenGroup[];
  readonly tokens: readonly Token[];
};

export type StorageResult<T> =
  | { readonly status: "ok"; readonly value: T }
  | { readonly status: "failure"; readonly message: string };

// Sequential single-writer calls only. Loads return detached data. Commit must
// copy its input and replace the project atomically, or leave prior data intact
// on failure. Expected storage failures are results; programmer faults throw.
export interface ProjectStorage {
  load(projectId: string): StorageResult<ProjectSnapshot | undefined>;
  commit(snapshot: ProjectSnapshot): StorageResult<void>;
}
