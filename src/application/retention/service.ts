import { createAuthoringOperations } from "@application/authoring";
import type { ProjectSnapshot } from "@application/project-storage";
import { candidateStorage } from "./candidate";
import { decodeRetainedRecord } from "./record";
import { admitSnapshot, encodeBackup } from "./codec";
import type {
  Acceptance,
  AuthoringCommand,
  CommandReceipt,
  RetainedRead,
  RetentionPort,
  WriteAttempt,
  WriteIdentity,
} from "./ports";
const errorText = (error: unknown) =>
  error instanceof Error
    ? error.message.slice(0, 500)
    : "Operation unavailable";
const rejected = (reason: string): Acceptance => ({
  status: "rejected",
  reason,
});
/** One live mutation per host session. No pending payload or draft is persisted.
 * Existing authoring rules prepare detached candidates; the async port alone
 * decides atomic acceptance. This module has no browser or worker dependencies. */
export function createRetainedWorkbench(
  port: RetentionPort,
  nextId: () => string,
) {
  let active = false;
  let suspended = false;
  let unconsumed: string | undefined;
  let uncertain:
    | {
        attempt: WriteAttempt;
        before: ProjectSnapshot | undefined;
        dispatched: boolean;
      }
    | undefined;
  async function accepted(
    attempt: WriteAttempt,
    before: ProjectSnapshot | undefined,
  ): Promise<Acceptance> {
    let readback: "available" | "unavailable" = "available",
      readError: string | undefined;
    try {
      const read = await port.read(attempt.projectId);
      if (!read.record) throw Error("Accepted project unavailable");
      const record = decodeRetainedRecord(read.record, attempt.projectId);
      if (
        read.incarnation !== attempt.incarnation ||
        record.revision !== attempt.record.revision ||
        !sameReceipt(
          record.lastAcceptedCommand,
          attempt.record.lastAcceptedCommand,
        )
      )
        throw Error(
          "Retained acknowledgement succeeded, but the accepted revision is unavailable or changed. Retry reading latest retained state.",
        );
    } catch (error) {
      readback = "unavailable";
      readError = errorText(error);
    }
    unconsumed = attempt.record.lastAcceptedCommand.commandId;
    return {
      status: "retained",
      revision: attempt.record.revision,
      receipt: attempt.record.lastAcceptedCommand,
      before,
      after: attempt.record.snapshot,
      readback,
      ...(readError ? { readError } : {}),
    };
  }
  async function write(
    projectId: string,
    expectedRevision: string | null,
    operation: CommandReceipt["operation"],
    prepare: (read: RetainedRead) => {
      snapshot: ProjectSnapshot;
      entityKind: CommandReceipt["result"]["entityKind"];
      id: string;
    },
    identity?: WriteIdentity,
  ): Promise<Acceptance> {
    if (suspended || active || uncertain || unconsumed)
      return rejected(
        "Another command is pending or its retained outcome is unknown.",
      );
    active = true;
    let dispatched = false,
      attempt: WriteAttempt | undefined,
      before: ProjectSnapshot | undefined;
    try {
      if (!port.owns(projectId) && !(await port.acquire(projectId)))
        return rejected("Project is open in another writable tab.");
      const read = await port.read(projectId);
      if ((read.record?.revision ?? null) !== expectedRevision)
        return rejected("revision-conflict");
      if (
        identity &&
        (identity.projectId !== projectId ||
          identity.incarnation !== read.incarnation ||
          identity.expectedRevision !== expectedRevision ||
          identity.operation !== operation)
      )
        return rejected("Attempt baseline changed before dispatch.");
      before = read.record?.snapshot;
      const candidate = prepare(read);
      if (
        identity &&
        (identity.result.id !== candidate.id ||
          identity.result.entityKind !== candidate.entityKind)
      )
        return rejected("Attempt result identity changed.");
      const snapshot = admitSnapshot(candidate.snapshot);
      // Complete emitted wrapper admission is shared with backup and restore.
      encodeBackup(snapshot, "2000-01-01T00:00:00.000Z");
      const commandId = identity?.commandId ?? nextId(),
        revision = identity?.revision ?? nextId();
      const receipt: CommandReceipt = {
        commandId,
        operation,
        result: { entityKind: candidate.entityKind, id: candidate.id },
      };
      attempt = {
        projectId,
        incarnation: read.incarnation,
        expectedRevision,
        record: {
          recordVersion: 1,
          authoredVersion: 1,
          revision,
          lastAcceptedCommand: receipt,
          snapshot,
        },
      };
      if (suspended || !port.owns(projectId))
        return rejected("Editing ownership changed. Inputs are preserved.");
      dispatched = true;
      const outcome = await port.commit(attempt);
      if (outcome.status === "rejected") return rejected(outcome.reason);
      if (outcome.status === "unknown") {
        uncertain = { attempt, before, dispatched };
        return { status: "unknown", reason: outcome.reason, commandId };
      }
      return await accepted(attempt, before);
    } catch (error) {
      if (dispatched && attempt) {
        uncertain = { attempt, before, dispatched };
        return {
          status: "unknown",
          commandId: attempt.record.lastAcceptedCommand.commandId,
          reason: errorText(error),
        };
      }
      return rejected(errorText(error));
    } finally {
      active = false;
    }
  }
  return {
    suspend() {
      suspended = true;
    },
    resume() {
      suspended = false;
    },
    catalogue: () => port.catalogue(),
    consume(commandId: string) {
      if (unconsumed === commandId) unconsumed = undefined;
    },
    async openProject(projectId: string) {
      const read = await port.read(projectId);
      if (read.record) admitSnapshot(read.record.snapshot);
      const writable = await port.acquire(projectId);
      return { ...read, writable };
    },
    async leaveProject(projectId: string) {
      if (active) return false;
      await port.release(projectId);
      return true;
    },
    async createProject(
      input: { id: string; name: string },
      identity?: WriteIdentity,
    ): Promise<Acceptance> {
      if (!input.name.trim()) return rejected("A project name is required.");
      return write(
        input.id,
        null,
        "createProject",
        () => ({
          snapshot: {
            project: input as ProjectSnapshot["project"],
            groups: [],
            tokens: [],
          },
          entityKind: "project",
          id: input.id,
        }),
        identity,
      );
    },
    command(
      command: AuthoringCommand,
      expectedRevision: string,
      identity?: WriteIdentity,
    ): Promise<Acceptance> {
      const projectId =
        command.operation === "renameGroup"
          ? command.projectId
          : command.input.projectId;
      return write(
        projectId,
        expectedRevision,
        command.operation,
        (read) => {
          if (!read.record) throw Error("Project not found");
          const memory = candidateStorage(read.record.snapshot);
          const operations = createAuthoringOperations(memory);
          const result =
            command.operation === "renameGroup"
              ? operations.renameGroup(
                  projectId,
                  command.groupId,
                  command.localName,
                )
              : command.operation === "createGroup"
                ? operations.createGroup(command.input)
                : command.operation === "createColorToken"
                  ? operations.createColorToken(command.input)
                  : operations.reviseColorToken(command.input);
          if (result.status === "failure")
            throw Error(JSON.stringify(result.error));
          const candidate = memory.load(projectId);
          if (candidate.status !== "ok" || !candidate.value)
            throw Error("Candidate unavailable");
          return {
            snapshot: candidate.value,
            entityKind:
              command.operation === "createGroup" ||
              command.operation === "renameGroup"
                ? "group"
                : "token",
            id: result.value.id,
          };
        },
        identity,
      );
    },
    restoreProject(
      snapshot: ProjectSnapshot,
      expectedRevision: string | null,
      protectedRevision?: string,
      identity?: WriteIdentity,
    ) {
      if (expectedRevision !== null && protectedRevision !== expectedRevision)
        return Promise.resolve(
          rejected(
            "Protect and acknowledge this exact local revision before replacement.",
          ),
        );
      return write(
        snapshot.project.id,
        expectedRevision,
        "restoreProject",
        () => ({ snapshot, entityKind: "project", id: snapshot.project.id }),
        identity,
      );
    },
    /** Called only by an execution host after it has terminated the original
     * worker/issuer. The host owns that stop proof; no caller verdict boolean is
     * accepted here. A newly held lock and ordered adapter read establish the
     * remaining storage proof. Missing/changed evidence stays unknown. */
    async checkInterruptedAttempt(
      identity: WriteIdentity,
    ): Promise<Acceptance> {
      try {
        if (active || uncertain || unconsumed)
          throw Error("Another live attempt still requires completion.");
        if (
          !port.owns(identity.projectId) &&
          !(await port.acquire(identity.projectId))
        )
          throw Error(
            "Editing ownership unavailable; retained outcome remains unknown.",
          );
        const read = await port.read(identity.projectId);
        if (read.incarnation !== identity.incarnation)
          throw Error(
            "Storage incarnation changed; retained outcome remains unknown.",
          );
        const record = read.record
          ? decodeRetainedRecord(read.record, identity.projectId)
          : undefined;
        const receipt: CommandReceipt = {
          commandId: identity.commandId,
          operation: identity.operation,
          result: identity.result,
        };
        if (
          record &&
          record.revision === identity.revision &&
          sameReceipt(record.lastAcceptedCommand, receipt)
        )
          return accepted(
            {
              projectId: identity.projectId,
              incarnation: identity.incarnation,
              expectedRevision: identity.expectedRevision,
              record,
            },
            undefined,
          );
        if (record?.lastAcceptedCommand.commandId === identity.commandId)
          throw Error(
            "Conflicting original receipt; retained outcome remains unknown.",
          );
        if ((record?.revision ?? null) === identity.expectedRevision)
          return rejected(
            "Original stopped attempt was not retained. Inputs are preserved; explicit correction/retry is available.",
          );
        throw Error("Current state cannot prove the original attempt outcome.");
      } catch (error) {
        return {
          status: "unknown",
          reason: errorText(error),
          commandId: identity.commandId,
        };
      }
    },
    async checkRetainedResult(): Promise<Acceptance> {
      if (active) return rejected("Original command is still running.");
      if (!uncertain) return rejected("No uncertain command.");
      const original = uncertain;
      const attempt = original.attempt;
      try {
        // commit() has settled before uncertain is published: no continuation can
        // dispatch again. Same-store reads serialize behind every issued write.
        if (
          !port.owns(attempt.projectId) &&
          !(await port.acquire(attempt.projectId))
        )
          throw Error("Ownership unavailable; result remains unknown.");
        const current = await port.read(attempt.projectId);
        if (current.incarnation !== attempt.incarnation)
          throw Error(
            "Browser storage changed; original result remains unknown.",
          );
        if (
          current.record &&
          sameReceipt(
            current.record.lastAcceptedCommand,
            attempt.record.lastAcceptedCommand,
          ) &&
          current.record.revision === attempt.record.revision
        ) {
          uncertain = undefined;
          return accepted(attempt, original.before);
        }
        if (
          current.record?.lastAcceptedCommand.commandId ===
          attempt.record.lastAcceptedCommand.commandId
        )
          throw Error(
            "Conflicting acceptance evidence; original result remains unknown.",
          );
        if ((current.record?.revision ?? null) === attempt.expectedRevision) {
          uncertain = undefined;
          return rejected(
            "Original command was not retained. Inputs are preserved.",
          );
        }
        throw Error(
          "Latest retained state cannot establish this command outcome.",
        );
      } catch (error) {
        return {
          status: "unknown",
          commandId: attempt.record.lastAcceptedCommand.commandId,
          reason: errorText(error),
        };
      }
    },
    safeToLeave() {
      return !active;
    },
  };
}

function sameReceipt(a: CommandReceipt, b: CommandReceipt) {
  return (
    a.commandId === b.commandId &&
    a.operation === b.operation &&
    a.result.entityKind === b.result.entityKind &&
    a.result.id === b.result.id
  );
}
