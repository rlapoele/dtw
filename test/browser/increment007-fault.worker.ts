// Test-only worker, never imported by the production entry. All retained writes
// still use the real native adapter, codec/service and production worker protocol.
import { BrowserRetention } from "@adapters/browser/indexeddb-retention";
import { installWorkbenchWorker } from "@presentation/host/worker-runtime";
import type { CommitOutcome, WriteAttempt } from "@application/retention/ports";
type Mode =
  | "normal"
  | "reject"
  | "accepted-unknown"
  | "readback-once"
  | "readback-held"
  | "hold-before"
  | "hold-after";
const evidence = new BroadcastChannel("dtw007-fixture-evidence");
const receipt = (phase: string, attempt?: WriteAttempt) =>
  evidence.postMessage({
    phase,
    at: Date.now(),
    ...(attempt
      ? {
          commandId: attempt.record.lastAcceptedCommand.commandId,
          revision: attempt.record.revision,
          projectId: attempt.projectId,
        }
      : {}),
  });
class FaultRetention extends BrowserRetention {
  mode: Mode = "normal";
  private failReads = 0;
  override async read(id: string) {
    if (this.failReads) {
      if (Number.isFinite(this.failReads)) this.failReads--;
      receipt("injected-read-unavailable");
      throw Error("Controlled native retained-read unavailability");
    }
    return super.read(id);
  }
  override async commit(attempt: WriteAttempt): Promise<CommitOutcome> {
    if (this.mode === "reject")
      return {
        status: "rejected",
        reason: "Controlled known rejection before native dispatch",
      };
    if (this.mode === "hold-before") {
      receipt("hold-before-native-dispatch", attempt);
      await new Promise<void>(() => {});
    }
    const outcome = await super.commit(attempt);
    if (outcome.status === "retained") {
      receipt("native-strict-complete", attempt);
      if (this.mode === "readback-once") this.failReads = 1;
      if (this.mode === "readback-held") this.failReads = Infinity;
      if (this.mode === "accepted-unknown")
        return {
          status: "unknown",
          reason:
            "Controlled terminal observation loss after real strict native retention",
        };
      if (this.mode === "hold-after") {
        receipt("hold-after-native-complete", attempt);
        await new Promise<void>(() => {});
      }
    }
    return outcome;
  }
  recoverReads() {
    this.failReads = 0;
  }
}
const adapter = new FaultRetention();
installWorkbenchWorker(adapter);
const application = globalThis.onmessage!;
globalThis.onmessage = (event) => {
  const value = event.data;
  if (value && typeof value === "object" && "fixtureControl" in value) {
    if (value.fixtureControl === "readable") adapter.recoverReads();
    else adapter.mode = value.fixtureControl as Mode;
    return;
  }
  return application.call(
    globalThis as unknown as DedicatedWorkerGlobalScope,
    event,
  );
};
