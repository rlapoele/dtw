import type { WriteIdentity } from "@application/retention/ports";
import { shape, validateHostInput, validateHostOutput } from "./validation";
import type { HostCalls, HostOperation, WorkbenchHost } from "./protocol";
/** The renderer owns only responses for its live host. No mutation replay after
 * worker loss. Termination fences dispatch and publication, not issued rollback. */
export class UnknownWriteError extends Error {
  constructor(
    message: string,
    readonly attempt: WriteIdentity,
  ) {
    super(message);
  }
}
export class WorkerWorkbenchHost implements WorkbenchHost {
  private worker: Worker;
  private sequence = 0;
  private incarnation: string | undefined;
  private lastAttempt: WriteIdentity | undefined;
  private interruptedAttempt: WriteIdentity | undefined;
  private recoveryTask: Promise<HostCalls["check"]["output"]> | undefined;
  private stopped = false;
  private readonly pending = new Map<
    number,
    {
      operation: HostOperation;
      input: unknown;
      attempt?: WriteIdentity;
      resolve(value: unknown): void;
      reject(reason: Error): void;
    }
  >();
  constructor(
    private readonly createWorker: () => Worker = () =>
      new Worker(new URL("./workbench.worker.ts", import.meta.url), {
        type: "module",
        name: "dtw-application",
      }),
  ) {
    if (
      typeof window !== "undefined" &&
      (window.top !== window || window.location.protocol === "file:")
    )
      throw Error(
        "Use the top-level secure browser application; embedded/file authoring is unavailable.",
      );
    if (
      typeof window !== "undefined" &&
      (!("File" in globalThis) ||
        typeof File.prototype.arrayBuffer !== "function" ||
        typeof URL.createObjectURL !== "function")
    )
      throw Error(
        "Project backup file and download capabilities are required for authoring.",
      );
    if (!isSecureContext || !("Worker" in globalThis))
      throw Error("A secure context and application worker are required.");
    this.worker = this.createWorker();
    this.connectHandlers();
  }
  private connectHandlers() {
    this.worker.onmessage = (event) => {
      try {
        const response = shape(
          event.data,
          ["id", "operation", "status"],
          ["value", "reason"],
        );
        if (
          typeof response.id !== "number" ||
          !Number.isSafeInteger(response.id)
        )
          throw Error("Invalid response correlation");
        const pending = this.pending.get(response.id);
        if (!pending) return;
        if (response.operation !== pending.operation)
          throw Error("Response operation mismatch");
        if (response.status === "ok") {
          shape(response, ["id", "operation", "status", "value"]);
          validateHostOutput(pending.operation, pending.input, response.value);
          if (pending.attempt) {
            const result = response.value as {
              status: string;
              commandId?: string;
              receipt?: { commandId: string };
            };
            if (
              (result.status === "retained" &&
                result.receipt?.commandId !== pending.attempt.commandId) ||
              (result.status === "unknown" &&
                result.commandId !== pending.attempt.commandId)
            )
              throw Error("Mutation attempt response mismatch");
          }
          if (
            pending.operation === "ready" ||
            pending.operation === "openProject" ||
            pending.operation === "resume"
          )
            this.incarnation = (
              response.value as { incarnation: string }
            ).incarnation;
          this.pending.delete(response.id);
          pending.resolve(response.value);
        } else {
          shape(response, ["id", "operation", "status", "reason"]);
          if (
            response.status !== "failure" ||
            typeof response.reason !== "string"
          )
            throw Error("Invalid failure response");
          if (pending.attempt) {
            this.stop(response.reason);
            return;
          }
          this.pending.delete(response.id);
          pending.reject(Error(response.reason));
        }
      } catch {
        this.stop(
          "Application response failed validation. An issued write may already be retained.",
        );
      }
    };
    this.worker.onerror = () =>
      this.stop(
        "Application worker unavailable. An issued write may already be retained. Reload to inspect latest storage; session input is not recoverable after reload.",
      );
    this.worker.onmessageerror = () =>
      this.stop(
        "Application response unavailable. An issued write may already be retained.",
      );
  }
  call<K extends HostOperation>(
    operation: K,
    input: HostCalls[K]["input"],
  ): Promise<HostCalls[K]["output"]> {
    if (
      operation === "check" &&
      !this.interruptedAttempt &&
      [...this.pending.values()].some((p) => p.attempt)
    ) {
      this.stop(
        "Original issuer stopped before checking retained result. An issued transaction may already be retained.",
      );
    }
    if (operation === "check" && this.interruptedAttempt)
      return this.recoverAfterTermination() as Promise<HostCalls[K]["output"]>;
    if (
      this.stopped &&
      ["ready", "catalogue", "openProject", "resume"].includes(operation)
    )
      return this.restartReader().then(() => this.call(operation, input));
    if (this.stopped)
      return Promise.reject(
        Error(
          "Application worker unavailable. Reload to inspect latest retained data.",
        ),
      );
    validateHostInput(operation, input);
    const attempt = this.allocateAttempt(operation, input);
    if (attempt) this.lastAttempt = attempt;
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      this.pending.set(id, {
        operation,
        input,
        attempt,
        resolve: (value) => resolve(value as HostCalls[K]["output"]),
        reject,
      });
      this.worker.postMessage(
        { id, operation, input, ...(attempt ? { attempt } : {}) },
        operation === "stageBackup"
          ? [(input as { bytes: ArrayBuffer }).bytes]
          : [],
      );
    });
  }
  private async restartReader() {
    if (!this.stopped) return;
    this.worker.terminate();
    this.worker = this.createWorker();
    this.stopped = false;
    this.connectHandlers();
    await this.call("ready", null);
  }
  private recoverAfterTermination(): Promise<HostCalls["check"]["output"]> {
    if (this.recoveryTask) return this.recoveryTask;
    const identity = this.interruptedAttempt!;
    this.recoveryTask = (async () => {
      // This is an actual host action, not a boolean supplied by UI code. The
      // stopped worker cannot schedule another dispatch or publish a response.
      if (this.stopped) {
        this.worker.terminate();
        this.worker = this.createWorker();
        this.stopped = false;
        this.connectHandlers();
        await this.call("ready", null);
      }
      const result = await this.call("recoverInterrupted", identity);
      if (result.status !== "unknown") this.interruptedAttempt = undefined;
      return result;
    })().finally(() => {
      this.recoveryTask = undefined;
    });
    return this.recoveryTask;
  }
  private allocateAttempt<K extends HostOperation>(
    operation: K,
    input: HostCalls[K]["input"],
  ): WriteIdentity | undefined {
    if (!["createProject", "command", "restore"].includes(operation))
      return undefined;
    if (this.interruptedAttempt)
      throw Error(
        "Original attempt outcome remains unknown. Check retained result before another write.",
      );
    if (!this.incarnation)
      throw Error(
        "Storage session identity is unavailable. Retry reading Projects.",
      );
    const value = input as unknown as Record<string, unknown>;
    let op: WriteIdentity["operation"],
      projectId: string,
      expectedRevision: string | null,
      result: WriteIdentity["result"];
    if (operation === "createProject") {
      op = "createProject";
      projectId = value.id as string;
      expectedRevision = null;
      result = { entityKind: "project", id: projectId };
    } else if (operation === "restore") {
      op = "restoreProject";
      projectId = value.projectId as string;
      expectedRevision = value.expectedRevision as string | null;
      result = { entityKind: "project", id: projectId };
    } else {
      const command =
        value.command as import("@application/retention/ports").AuthoringCommand;
      op = command.operation;
      projectId =
        command.operation === "renameGroup"
          ? command.projectId
          : command.input.projectId;
      expectedRevision = value.revision as string;
      result = {
        entityKind:
          command.operation === "renameGroup" ||
          command.operation === "createGroup"
            ? "group"
            : "token",
        id:
          command.operation === "renameGroup"
            ? command.groupId
            : command.operation === "reviseColorToken"
              ? command.input.tokenId
              : command.input.id,
      };
    }
    return {
      commandId: crypto.randomUUID(),
      revision: crypto.randomUUID(),
      projectId,
      expectedRevision,
      incarnation: this.incarnation,
      operation: op,
      result,
    };
  }
  private stop(message: string) {
    this.stopped = true;
    this.worker.terminate();
    for (const pending of this.pending.values()) {
      if (pending.attempt) this.interruptedAttempt = pending.attempt;
      pending.reject(
        pending.attempt
          ? new UnknownWriteError(message, pending.attempt)
          : Error(message),
      );
    }
    this.pending.clear();
  }
  fence() {
    this.stop(
      "Application context fenced. An issued transaction may already be retained; no payload is replayed.",
    );
  }
  dispose() {
    this.stop("Application context closed");
  }
}
