import { describe, expect, it } from "vitest";
import { createRetainedWorkbench } from "@application/retention/service";
import type {
  RetainedRecord,
  RetentionPort,
} from "@application/retention/ports";
function fixture() {
  const records = new Map<string, RetainedRecord>();
  let held = false;
  let block: (() => void) | undefined;
  const port: RetentionPort = {
    async catalogue() {
      return [...records.values()].map((record) => ({
        rowKey: record.snapshot.project.id,
        id: record.snapshot.project.id,
        name: record.snapshot.project.name,
        revision: record.revision,
        tokens: record.snapshot.tokens.length,
        groups: record.snapshot.groups.length,
        status: "supported" as const,
      }));
    },
    async read(id) {
      return { record: records.get(id), incarnation: "db" };
    },
    async acquire() {
      held = true;
      return true;
    },
    async release() {
      held = false;
    },
    owns() {
      return held;
    },
    async commit(attempt) {
      if (block)
        await new Promise<void>((resolve) => {
          block = resolve;
        });
      if (
        (records.get(attempt.projectId)?.revision ?? null) !==
        attempt.expectedRevision
      )
        return { status: "rejected", reason: "revision-conflict" };
      records.set(attempt.projectId, attempt.record);
      return { status: "retained" };
    },
  };
  return {
    port,
    records,
    hold() {
      block = () => {};
    },
    unblock() {
      block?.();
    },
  };
}
describe("retained application acceptance", () => {
  it("enforces required creation name at command boundary without trimming accepted text", async () => {
    const f = fixture(),
      app = createRetainedWorkbench(f.port, () => "id");
    expect((await app.createProject({ id: "p", name: "  " })).status).toBe(
      "rejected",
    );
    expect(f.records.size).toBe(0);
    const result = await app.createProject({ id: "p", name: "  Exact  " });
    expect(result.status).toBe("retained");
    expect(f.records.get("p")?.snapshot.project.name).toBe("  Exact  ");
  });
  it("does not expose acceptance or allow duplicate submission before terminal acknowledgement", async () => {
    const f = fixture();
    let n = 0;
    const app = createRetainedWorkbench(f.port, () => `id${++n}`);
    f.hold();
    const pending = app.createProject({ id: "p", name: "Name" });
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(f.records.size).toBe(0);
    expect((await app.createProject({ id: "q", name: "Other" })).status).toBe(
      "rejected",
    );
    f.unblock();
    expect((await pending).status).toBe("retained");
  });
  it("retains detached accepted before/after and rejects a stale revision without modifying storage", async () => {
    const f = fixture();
    let n = 0;
    const app = createRetainedWorkbench(f.port, () => `id${++n}`);
    const creation = await app.createProject({ id: "p", name: "Name" });
    if (creation.status === "retained") app.consume(creation.receipt.commandId);
    const opened = await app.openProject("p");
    const result = await app.command(
      {
        operation: "createGroup",
        input: {
          id: "g",
          projectId: "p",
          localName: "group",
          parentGroupId: null,
        },
      },
      opened.record!.revision,
    );
    expect(result.status).toBe("retained");
    if (result.status === "retained") {
      expect(result.before?.groups).toHaveLength(0);
      expect(result.after.groups).toHaveLength(1);
      app.consume(result.receipt.commandId);
    }
    expect(
      (
        await app.command(
          {
            operation: "renameGroup",
            projectId: "p",
            groupId: "g",
            localName: "changed",
          },
          opened.record!.revision,
        )
      ).status,
    ).toBe("rejected");
    expect(f.records.get("p")?.snapshot.groups[0].localName).toBe("group");
  });
});

describe("accepted and uncertain readback evidence", () => {
  it("keeps known acceptance but marks changed database readback unavailable", async () => {
    const f = fixture();
    let n = 0,
      committed = false;
    const read = f.port.read.bind(f.port),
      commit = f.port.commit.bind(f.port);
    f.port.commit = async (attempt) => {
      const outcome = await commit(attempt);
      committed = true;
      return outcome;
    };
    f.port.read = async (id) => ({
      ...(await read(id)),
      incarnation: committed ? "changed-db" : "db",
    });
    const result = await createRetainedWorkbench(
      f.port,
      () => `id${++n}`,
    ).createProject({ id: "p", name: "Name" });
    expect(result.status).toBe("retained");
    if (result.status === "retained")
      expect(result.readback).toBe("unavailable");
  });
  it("keeps a mismatched full receipt unknown and blocks another mutation", async () => {
    const f = fixture();
    let n = 0;
    f.port.commit = async (attempt) => {
      f.records.set(attempt.projectId, {
        ...attempt.record,
        lastAcceptedCommand: {
          ...attempt.record.lastAcceptedCommand,
          operation: "restoreProject",
        },
      });
      return { status: "unknown", reason: "Observation lost" };
    };
    const app = createRetainedWorkbench(f.port, () => `id${++n}`);
    expect((await app.createProject({ id: "p", name: "Name" })).status).toBe(
      "unknown",
    );
    expect((await app.checkRetainedResult()).status).toBe("unknown");
    expect((await app.createProject({ id: "q", name: "Other" })).status).toBe(
      "rejected",
    );
  });
  it("reserves accepted receipt until explicitly consumed by the issuing session", async () => {
    const f = fixture();
    let n = 0;
    const app = createRetainedWorkbench(f.port, () => `id${++n}`);
    const first = await app.createProject({ id: "p", name: "Name" });
    expect((await app.createProject({ id: "q", name: "Other" })).status).toBe(
      "rejected",
    );
    app.consume("different");
    expect((await app.createProject({ id: "q", name: "Other" })).status).toBe(
      "rejected",
    );
    if (first.status === "retained") app.consume(first.receipt.commandId);
    expect((await app.createProject({ id: "q", name: "Other" })).status).toBe(
      "retained",
    );
  });
});

describe("renderer-owned attempt and stopped-host reconciliation", () => {
  const identity = {
    commandId: "renderer-command",
    revision: "renderer-revision",
    projectId: "p",
    expectedRevision: null,
    incarnation: "db",
    operation: "createProject" as const,
    result: { entityKind: "project" as const, id: "p" },
  };
  it("uses the original pre-dispatch identity and rejects a changed database baseline", async () => {
    const f = fixture();
    const app = createRetainedWorkbench(f.port, () => {
      throw Error("Unexpected hidden identity");
    });
    const result = await app.createProject({ id: "p", name: "Name" }, identity);
    expect(result.status).toBe("retained");
    if (result.status === "retained") {
      expect(result.receipt.commandId).toBe(identity.commandId);
      expect(result.revision).toBe(identity.revision);
    }
    const other = fixture();
    expect(
      (
        await createRetainedWorkbench(other.port, () => "unused").createProject(
          { id: "p", name: "Name" },
          { ...identity, incarnation: "changed" },
        )
      ).status,
    ).toBe("rejected");
    expect(other.records.size).toBe(0);
  });
  it("reconciles a stopped host through ownership and ordered exact receipt evidence without replay", async () => {
    const f = fixture();
    const first = createRetainedWorkbench(f.port, () => "unused");
    await first.createProject({ id: "p", name: "Name" }, identity);
    const fresh = createRetainedWorkbench(f.port, () => {
      throw Error("No replay");
    });
    const result = await fresh.checkInterruptedAttempt(identity);
    expect(result.status).toBe("retained");
    expect(f.records.size).toBe(1);
  });
  it("keeps a changed incarnation and a newer unmatching receipt unknown", async () => {
    const f = fixture();
    await createRetainedWorkbench(f.port, () => "unused").createProject(
      { id: "p", name: "Name" },
      identity,
    );
    const fresh = createRetainedWorkbench(f.port, () => "unused");
    expect(
      (
        await fresh.checkInterruptedAttempt({
          ...identity,
          incarnation: "missing-db",
        })
      ).status,
    ).toBe("unknown");
    expect(
      (
        await fresh.checkInterruptedAttempt({
          ...identity,
          commandId: "different",
          revision: "different",
        })
      ).status,
    ).toBe("unknown");
  });
  it("suspends new dispatch and requires explicit resume before new authoring", async () => {
    const f = fixture();
    let i = 0;
    const app = createRetainedWorkbench(f.port, () => `id${++i}`);
    app.suspend();
    expect((await app.createProject({ id: "p", name: "Name" })).status).toBe(
      "rejected",
    );
    expect(f.records.size).toBe(0);
    app.resume();
    expect((await app.createProject({ id: "p", name: "Name" })).status).toBe(
      "retained",
    );
  });
});
