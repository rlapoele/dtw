import { afterEach, describe, expect, it, vi } from "vitest";
import {
  UnknownWriteError,
  WorkerWorkbenchHost,
} from "@hosts/browser/worker-client";
class FakeWorker {
  static instances: FakeWorker[] = [];
  onmessage: ((event: { data: unknown }) => void) | null = null;
  onerror: (() => void) | null = null;
  onmessageerror: (() => void) | null = null;
  terminated = false;
  messages: Record<string, unknown>[] = [];
  constructor(readonly url: URL) {
    FakeWorker.instances.push(this);
  }
  postMessage(message: Record<string, unknown>) {
    this.messages.push(message);
    if (message.operation === "ready")
      queueMicrotask(() => this.reply(message, { incarnation: "db" }));
  }
  reply(message: Record<string, unknown>, value: unknown) {
    this.onmessage?.({
      data: {
        id: message.id,
        operation: message.operation,
        status: "ok",
        value,
      },
    });
  }
  terminate() {
    this.terminated = true;
  }
}
afterEach(() => {
  vi.unstubAllGlobals();
  FakeWorker.instances = [];
});
async function fixture() {
  vi.stubGlobal("Worker", FakeWorker);
  vi.stubGlobal("isSecureContext", true);
  const host = new WorkerWorkbenchHost();
  await host.call("ready", null);
  return { host, worker: FakeWorker.instances[0] };
}
describe("actual host dispatch fence and client attempt identity", () => {
  it("allocates command/result/database identity before posting and preserves it when the issuer fails", async () => {
    const { host, worker } = await fixture();
    const pending = host.call("createProject", { id: "p", name: "Name" });
    const posted = worker.messages.at(-1)!;
    expect(posted.attempt).toMatchObject({
      projectId: "p",
      expectedRevision: null,
      incarnation: "db",
      operation: "createProject",
      result: { entityKind: "project", id: "p" },
    });
    worker.onerror!();
    await expect(pending).rejects.toBeInstanceOf(UnknownWriteError);
    expect(worker.terminated).toBe(true);
    host.dispose();
  });
  it("stops a still-pending issuer before same-attempt checking and never replays the command", async () => {
    const { host, worker } = await fixture();
    const pending = host.call("createProject", { id: "p", name: "Name" });
    const rejection = expect(pending).rejects.toBeInstanceOf(UnknownWriteError);
    const original = worker.messages.at(-1)!.attempt;
    const check = host.call("check", null);
    expect(worker.terminated).toBe(true);
    await rejection;
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    const replacement = FakeWorker.instances[1];
    const recover = replacement.messages.find(
      (message) => message.operation === "recoverInterrupted",
    );
    expect(recover?.input).toEqual(original);
    replacement.reply(recover!, {
      status: "rejected",
      reason: "Original stopped attempt not retained",
    });
    expect((await check).status).toBe("rejected");
    expect(
      FakeWorker.instances
        .flatMap((w) => w.messages)
        .filter((message) => message.operation === "createProject"),
    ).toHaveLength(1);
    host.dispose();
  });
  it("fails closed on a malformed retained response rather than publish an unchecked success", async () => {
    const { host, worker } = await fixture();
    const pending = host.call("createProject", { id: "p", name: "Name" });
    worker.reply(worker.messages.at(-1)!, {
      status: "retained",
      revision: "r",
      readback: "available",
    });
    await expect(pending).rejects.toBeInstanceOf(UnknownWriteError);
    expect(worker.terminated).toBe(true);
    host.dispose();
  });
});

it("keeps the Vite worker entry a relative TypeScript URL rather than a runtime alias", async () => {
  const { host, worker } = await fixture();
  expect(worker.url.pathname).toMatch(/\/hosts\/browser\/workbench\.worker\.ts$/);
  expect(worker.url.pathname).not.toContain("@presentation");
  expect(worker.url.pathname).not.toContain("@hosts");
  host.dispose();
});

it("fences a lost Undo issuer and reconciles its project-target identity without replay", async () => {
  const {host,worker}=await fixture();
  const pending=host.call("traverse",{direction:"undo",projectId:"p",revision:"r",stepId:"step"});
  const rejection=expect(pending).rejects.toBeInstanceOf(UnknownWriteError);
  const original=worker.messages.at(-1)!.attempt as {commandId:string;revision:string};
  expect(original).toMatchObject({operation:"undo",result:{entityKind:"project",id:"p"},expectedRevision:"r"});
  const checked=host.call("check",null); await rejection;
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  const replacement=FakeWorker.instances[1], recover=replacement.messages.find(m=>m.operation==="recoverInterrupted")!;
  expect(recover.input).toEqual(original);
  replacement.reply(recover,{status:"retained",revision:original.revision,receipt:{commandId:original.commandId,operation:"undo",result:{entityKind:"project",id:"p"}},readback:"available"});
  expect((await checked).status).toBe("retained");
  const history=host.call("historyState",{projectId:"p",revision:original.revision}); replacement.reply(replacement.messages.at(-1)!,{undoCount:0,redoCount:0});
  expect(await history).toMatchObject({notice:expect.stringContaining("Session restarted")});
  expect(FakeWorker.instances.flatMap(w=>w.messages).filter(m=>m.operation==="traverse")).toHaveLength(1);
  host.dispose();
});
