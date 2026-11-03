import type { ProjectSnapshot, ProjectStorage, StorageResult } from "../application/project-storage";

export class InMemoryProjectStorage implements ProjectStorage {
  private readonly projects = new Map<string, ProjectSnapshot>();

  // Preloading is for focused adapter/test fixtures, not an import/loader API.
  constructor(initial: readonly ProjectSnapshot[] = []) {
    for (const snapshot of initial) {
      if (this.projects.has(snapshot.project.id)) throw new RangeError("Duplicate preloaded project identity");
      this.projects.set(snapshot.project.id, copyPlainData(snapshot));
    }
  }

  load(projectId: string): StorageResult<ProjectSnapshot | undefined> {
    const snapshot = this.projects.get(projectId);
    return { status: "ok", value: snapshot === undefined ? undefined : copyPlainData(snapshot) };
  }

  commit(snapshot: ProjectSnapshot): StorageResult<void> {
    const copy = copyPlainData(snapshot);
    this.projects.set(copy.project.id, copy);
    return { status: "ok", value: undefined };
  }
}

// Domain data consists only of plain records, arrays and scalar values. Copy
// without selecting a serialization format or relying on host clone APIs.
function copyPlainData<T>(value: T): T {
  if (Array.isArray(value)) return value.map(item => copyPlainData(item)) as T;
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, copyPlainData(item)])) as T;
  }
  return value;
}
