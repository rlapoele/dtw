import { admitSnapshot, encodeBackup, assertPlainRecord } from "./codec";
import type { Operation, RetainedRecord } from "./ports";
const operations: Record<Operation, string> = {
  createProject: "project",
  restoreProject: "project",
  createGroup: "group",
  renameGroup: "group",
  createColorToken: "token",
  reviseColorToken: "token",
};
function closed(input: unknown, keys: string[]): Record<string, unknown> {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    Object.keys(input).length !== keys.length ||
    keys.some((k) => !Object.hasOwn(input, k))
  )
    throw Error("Unsupported retained record shape");
  return input as Record<string, unknown>;
}
export function internalId(value: unknown): value is string {
  return (
    typeof value === "string" && value.trim().length > 0 && value.length <= 128
  );
}
export function decodeRetainedRecord(
  input: unknown,
  key: string,
): RetainedRecord {
  assertPlainRecord(input);
  const r = closed(input, [
    "recordVersion",
    "authoredVersion",
    "revision",
    "lastAcceptedCommand",
    "snapshot",
  ]);
  if (r.recordVersion !== 1 || r.authoredVersion !== 1)
    throw Error("Unsupported retained record version");
  if (!internalId(r.revision)) throw Error("Invalid retained revision");
  const c = closed(r.lastAcceptedCommand, ["commandId", "operation", "result"]);
  const result = closed(c.result, ["entityKind", "id"]);
  if (
    !internalId(c.commandId) ||
    typeof c.operation !== "string" ||
    !Object.hasOwn(operations, c.operation) ||
    operations[c.operation as Operation] !== result.entityKind ||
    typeof result.id !== "string"
  )
    throw Error("Invalid retained acceptance metadata");
  const snapshot = admitSnapshot(r.snapshot);
  encodeBackup(snapshot, "2000-01-01T00:00:00.000Z");
  if (
    (result.entityKind === "project" && result.id !== key) ||
    (result.entityKind === "group" &&
      !snapshot.groups.some((group) => group.id === result.id)) ||
    (result.entityKind === "token" &&
      !snapshot.tokens.some((token) => token.id === result.id))
  )
    throw Error("Retained receipt target mismatch");
  if (snapshot.project.id !== key) throw Error("Retained project key mismatch");
  return {
    recordVersion: 1,
    authoredVersion: 1,
    revision: r.revision,
    lastAcceptedCommand: {
      commandId: c.commandId,
      operation: c.operation as Operation,
      result: {
        entityKind: result.entityKind as "project" | "group" | "token",
        id: result.id,
      },
    },
    snapshot,
  };
}
