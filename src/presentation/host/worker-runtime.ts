import {
  decodeBackup,
  encodeBackup,
  retentionLimits,
} from "@application/retention/codec";
import { diagnosticDisplay } from "@application/retention/diagnostics";
import type { BackupPreview } from "@application/retention/codec";
import type { RestorePreview } from "./protocol";
import {
  projectContext,
  displayRows,
  selectedInspection,
} from "@application/retention/projections";
import type { RetainedRecord } from "@application/retention/ports";
import {
  shape,
  validateAttempt,
  validateHostInput,
  validateHostOutput,
} from "./validation";
import { BrowserRetention } from "@adapters/browser/indexeddb-retention";
import { createRetainedWorkbench } from "@application/retention/service";
import type { Acceptance, WriteIdentity } from "@application/retention/ports";
import type { HostCalls, HostOperation, PublicAcceptance } from "./protocol";

export function installWorkbenchWorker(storage: BrowserRetention) {
  let loaded: RetainedRecord | undefined;
  let preparedSource:
    | { id: string; text: string; revision: string; projectId: string }
    | undefined;
  function snapshot(projectId: string, revision: string) {
    if (
      !loaded ||
      loaded.snapshot.project.id !== projectId ||
      loaded.revision !== revision
    )
      throw Error("Read context changed. Refresh this project.");
    return loaded.snapshot;
  }
  let staged: { id: string; preview: BackupPreview } | undefined;
  let protection: { projectId: string; revision: string } | undefined;
  async function stagePreview(): Promise<RestorePreview> {
    if (!staged) throw Error("No backup staged");
    const s = staged.preview.snapshot;
    const read = await storage.read(s.project.id);
    return {
      stageId: staged.id,
      project: s.project,
      createdAt: staged.preview.createdAt,
      tokens: s.tokens.length,
      groups: s.groups.length,
      diagnostics: diagnosticDisplay(s),
      local: read.record
        ? {
            revision: read.record.revision,
            name: read.record.snapshot.project.name,
          }
        : null,
    };
  }

  const app = createRetainedWorkbench(storage, () => crypto.randomUUID());
  function publish(result: Acceptance): PublicAcceptance {
    if (result.status !== "retained") return result;
    const { before: _before, after: _after, ...publicResult } = result;
    return publicResult;
  }
  const handlers: {
    [K in HostOperation]: (
      input: HostCalls[K]["input"],
      attempt?: WriteIdentity,
    ) => Promise<HostCalls[K]["output"]>;
  } = {
    async recoverInterrupted(identity) {
      return publish(await app.checkInterruptedAttempt(identity));
    },
    async suspend() {
      app.suspend();
      return true;
    },
    async resume(id) {
      app.resume();
      return handlers.openProject(id);
    },
    async diagnostics(input) {
      return diagnosticDisplay(snapshot(input.projectId, input.revision));
    },
    async stageBackup(input) {
      if (input.bytes.byteLength > retentionLimits.fileBytes)
        throw Error("Backup exceeds 16777216 bytes");
      const bytes = new Uint8Array(input.bytes);
      if (bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191)
        throw Error("UTF-8 BOM is unsupported");
      const preview = decodeBackup(
        new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      );
      staged = { id: crypto.randomUUID(), preview };
      protection = undefined;
      return stagePreview();
    },
    async refreshStage(id) {
      if (!staged || staged.id !== id) throw Error("Staged backup changed");
      protection = undefined;
      return stagePreview();
    },
    async backup(input) {
      const read = await storage.read(input.projectId);
      if (!read.record || read.record.revision !== input.revision)
        throw Error(
          "Local applied revision changed. Review and back up the current revision.",
        );
      const createdAt = new Date().toISOString();
      const text = encodeBackup(read.record.snapshot, createdAt);
      const bytes = new TextEncoder().encode(text).buffer;
      protection = { projectId: input.projectId, revision: input.revision };
      return { bytes, revision: input.revision, createdAt };
    },
    async restore(input, attempt) {
      if (
        !staged ||
        staged.id !== input.stageId ||
        staged.preview.snapshot.project.id !== input.projectId
      )
        throw Error("Staged backup changed");
      if (
        input.expectedRevision !== null &&
        (!input.acknowledgement ||
          input.protectedRevision !== input.expectedRevision ||
          protection?.projectId !== staged.preview.snapshot.project.id ||
          protection.revision !== input.expectedRevision)
      )
        throw Error(
          "Back up and acknowledge the exact current local revision before replacement.",
        );
      return publish(
        await app.restoreProject(
          staged.preview.snapshot,
          input.expectedRevision,
          input.protectedRevision ?? undefined,
          attempt,
        ),
      );
    },
    async context(input) {
      return projectContext(snapshot(input.projectId, input.revision));
    },
    async rows(input) {
      return displayRows(
        snapshot(input.projectId, input.revision),
        input.offset,
        input.count,
      );
    },
    async inspection(input) {
      return selectedInspection(
        snapshot(input.projectId, input.revision),
        input.tokenId,
      );
    },
    async source(input) {
      const s = snapshot(input.projectId, input.revision);
      const entity =
        input.entityKind === "project"
          ? s.project
          : input.entityKind === "group"
            ? s.groups.find((g) => g.id === input.entityId)
            : s.tokens.find((t) => t.id === input.entityId);
      if (!entity) throw Error("Source target unavailable");
      const text = JSON.stringify(entity, null, 2),
        sourceId = crypto.randomUUID();
      preparedSource = {
        id: sourceId,
        text,
        revision: input.revision,
        projectId: input.projectId,
      };
      return { sourceId, units: text.length, revision: input.revision };
    },
    async sourceFrame(input) {
      if (!preparedSource || input.sourceId !== preparedSource.id)
        throw Error("Source context changed");
      snapshot(preparedSource.projectId, preparedSource.revision);
      if (input.offset > preparedSource.text.length)
        throw Error("Source offset out of range");
      const text = preparedSource.text.slice(
        input.offset,
        input.offset + input.count,
      );
      return {
        sourceId: input.sourceId,
        offset: input.offset,
        units: preparedSource.text.length,
        revision: preparedSource.revision,
        text,
        complete: input.offset + text.length === preparedSource.text.length,
      };
    },
    async ready() {
      await storage.capability();
      return { incarnation: await storage.identity() };
    },
    catalogue: () => app.catalogue(),
    async createProject(input, attempt) {
      return publish(await app.createProject(input, attempt));
    },
    async consume(commandId) {
      app.consume(commandId);
      return true;
    },
    async openProject(id) {
      const read = await app.openProject(id);
      if (!read.record) throw Error("Project not found");
      loaded = read.record;
      const { snapshot, revision } = read.record;
      return {
        project: snapshot.project,
        revision,
        incarnation: read.incarnation,
        writable: read.writable,
        tokens: snapshot.tokens.length,
        groups: snapshot.groups.length,
      };
    },
    async leaveProject(id) {
      const safe = await app.leaveProject(id);
      if (safe && loaded?.snapshot.project.id === id) loaded = undefined;
      if (safe) preparedSource = undefined;
      return safe;
    },
    async command(input, attempt) {
      return publish(await app.command(input.command, input.revision, attempt));
    },
    async check() {
      return publish(await app.checkRetainedResult());
    },
  };
  globalThis.onmessage = async (event: MessageEvent<unknown>) => {
    const raw = event.data;
    if (!raw || typeof raw !== "object") return;
    const request = raw as {
      id?: unknown;
      operation?: unknown;
      input?: unknown;
      attempt?: unknown;
    };
    if (
      typeof request.id !== "number" ||
      !Number.isSafeInteger(request.id) ||
      typeof request.operation !== "string" ||
      !Object.hasOwn(handlers, request.operation)
    )
      return;
    try {
      // Every operation has a closed transport name. Commands also pass the shared
      // application candidate/runtime admission before durable acceptance.
      const mutation = ["createProject", "command", "restore"].includes(
        request.operation,
      );
      shape(raw, [
        "id",
        "operation",
        "input",
        ...(mutation ? ["attempt"] : []),
      ]);
      if (mutation)
        validateAttempt(
          request.attempt,
          request.operation as HostOperation,
          request.input,
        );
      const handler = handlers[request.operation as HostOperation] as (
        input: unknown,
        attempt?: WriteIdentity,
      ) => Promise<unknown>;
      validateHostInput(request.operation as HostOperation, request.input);
      const value = await handler(
        request.input,
        request.attempt as WriteIdentity | undefined,
      );
      validateHostOutput(
        request.operation as HostOperation,
        request.input,
        value,
      );
      globalThis.postMessage(
        { id: request.id, operation: request.operation, status: "ok", value },
        {
          transfer:
            request.operation === "backup"
              ? [(value as { bytes: ArrayBuffer }).bytes]
              : [],
        },
      );
    } catch (error) {
      globalThis.postMessage({
        id: request.id,
        operation: request.operation,
        status: "failure",
        reason:
          error instanceof Error
            ? error.message.slice(0, 500)
            : "Application operation unavailable",
      });
    }
  };
}
