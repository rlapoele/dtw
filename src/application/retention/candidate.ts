import type {
  ProjectSnapshot,
  ProjectStorage,
} from "@application/project-storage";
/** Detached application-local staging for existing synchronous domain commands.
 * No I/O adapter participates in candidate preparation or decides acceptance. */
export function candidateStorage(initial: ProjectSnapshot): ProjectStorage {
  let snapshot = clone(initial);
  return {
    load(id) {
      return {
        status: "ok",
        value: id === snapshot.project.id ? clone(snapshot) : undefined,
      };
    },
    commit(candidate) {
      snapshot = clone(candidate);
      return { status: "ok", value: undefined };
    },
  };
}
function clone<T>(value: T): T {
  if (Array.isArray(value)) return value.map(clone) as T;
  if (value !== null && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, clone(item)]),
    ) as T;
  return value;
}
