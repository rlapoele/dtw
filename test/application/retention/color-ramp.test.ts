import { it, expect } from "vitest";
import { createRetainedWorkbench } from "@application/retention/service";
import type {
  RetentionPort,
  RetainedRecord,
  Acceptance,
} from "@application/retention/ports";
import {
  openRampDraft,
  replaceRampCount,
  rampImpacts,
} from "@application/color-ramp-authoring";
import { createColorLiteral } from "@domain/color-literal";
import {
  autoRampPosition,
  rampLabels,
  type RampSettings,
} from "@domain/color-ramp";
import { encodeBackup, decodeBackup } from "@application/retention/codec";
import {
  validateHostInput,
  validateHostOutput,
} from "@hosts/browser/validation";
it("retains ramp creation and replacement as single history entries, exact backup and no-op", async () => {
  let record: RetainedRecord | undefined,
    writes = 0,
    id = 0;
  const port: RetentionPort = {
    catalogue: async () => [],
    acquire: async () => true,
    owns: () => true,
    release: async () => {},
    read: async () => ({ record, incarnation: "db" }),
    commit: async (a) => {
      record = a.record;
      writes++;
      return { status: "retained" };
    },
  };
  const app = createRetainedWorkbench(
    port,
    () => `id${++id}`,
    () => "2026-11-23T12:00:00.000Z",
  );
  const finish = (r: Acceptance) => {
    if (r.status === "retained") app.consume(r.receipt.commandId);
    return r;
  };
  finish(await app.createProject({ id: "p", name: "P" }));
  await app.openProject("p");
  const seed = createColorLiteral({
      colorSpace: "srgb",
      components: ["0.2", "0.4", "0.8"],
      alpha: "0",
    }),
    settings: RampSettings = {
      seed,
      targetGamut: "srgb",
      recipe: { id: "single-seed-oklch", version: 1, intensity: "retained" },
      seedPosition: { mode: "auto", label: autoRampPosition(seed, 11) },
    };
  const command = {
    operation: "createColorRamp" as const,
    input: {
      projectId: "p",
      group: {
        id: "g",
        projectId: "p",
        localName: "brand",
        parentGroupId: null,
      },
      settings,
      members: rampLabels(11).map((label) => ({ label, id: "t" + label })),
    },
  };
  validateHostInput("command", { command, revision: record!.revision });
  const result = finish(await app.command(command, record!.revision));
  expect(result.status).toBe("retained");
  if (result.status !== "retained") throw Error(JSON.stringify(result));
  const { before: _, after: __, ...publicResult } = result;
  validateHostOutput(
    "command",
    { command, revision: record!.revision },
    publicResult,
  );
  expect(app.historyState().undoCount).toBe(1);
  const created = record!.snapshot;
  const draft = openRampDraft(created, "g"),
    unchangedWrites = writes;
  expect(
    (
      await app.command(
        {
          operation: "applyColorRamp",
          input: {
            projectId: "p",
            groupId: "g",
            settings: draft.settings,
            steps: draft.steps,
            choices: [],
          },
        },
        record!.revision,
      )
    ).status,
  ).toBe("unchanged");
  expect(writes).toBe(unchangedWrites);
  const next = replaceRampCount(created, "g", draft, 6, () => `new${++id}`);
  const apply = {
    operation: "applyColorRamp" as const,
    input: {
      projectId: "p",
      groupId: "g",
      settings: next.settings,
      steps: next.steps,
      choices: [],
    },
  };
  validateHostInput("command", { command: apply, revision: record!.revision });
  expect(finish(await app.command(apply, record!.revision)).status).toBe(
    "retained",
  );
  expect(record!.snapshot.tokens).toHaveLength(6);
  expect(app.historyState().undoCount).toBe(2);
  expect(
    decodeBackup(encodeBackup(record!.snapshot, "2026-11-23T12:00:00.000Z"))
      .snapshot,
  ).toEqual(record!.snapshot);
  expect(
    finish(
      await app.traverse(
        "undo",
        "p",
        record!.revision,
        app.historyState().undo!.id,
      ),
    ).status,
  ).toBe("retained");
  expect(record!.snapshot).toEqual(created);
  expect(
    finish(
      await app.traverse(
        "undo",
        "p",
        record!.revision,
        app.historyState().undo!.id,
      ),
    ).status,
  ).toBe("retained");
  expect(record!.snapshot.groups).toEqual([]);
  expect(
    finish(
      await app.traverse(
        "redo",
        "p",
        record!.revision,
        app.historyState().redo!.id,
      ),
    ).status,
  ).toBe("retained");
  expect(record!.snapshot).toEqual(created);
});

it("rejects stale ramp creation and replacement without writes or history changes", async () => {
  const f = await recoveryFixture();
  const initialRevision = f.record().revision;
  const before = f.record();
  expect((await f.app.command(f.create, "stale")).status).toBe("rejected");
  expect(f.record()).toBe(before);
  expect(f.writes()).toBe(1);
  expect(f.app.historyState().undoCount).toBe(0);
  f.finish(await f.app.command(f.create, initialRevision));
  const created = f.record(), history = f.app.historyState();
  expect((await f.app.command(f.replacement(), initialRevision)).status).toBe("rejected");
  expect(f.record()).toBe(created);
  expect(f.writes()).toBe(2);
  expect(f.app.historyState()).toEqual(history);
});

it.each(["create", "replace"] as const)("reconciles an unknown ramp %s exactly once and blocks duplicate mutations", async (operation) => {
  const f = await recoveryFixture();
  if (operation === "replace") f.finish(await f.app.command(f.create, f.record().revision));
  const before = f.record().snapshot, history = f.app.historyState();
  const command = operation === "create" ? f.create : f.replacement();
  f.loseAcknowledgement();
  expect((await f.app.command(command, f.record().revision)).status).toBe("unknown");
  const accepted = f.record(), writes = f.writes();
  expect(accepted.snapshot.tokens).toHaveLength(operation === "create" ? 11 : 6);
  expect(f.app.historyState()).toEqual(history);
  expect((await f.app.command(command, accepted.revision)).status).toBe("rejected");
  expect(f.writes()).toBe(writes);
  const recovered = await f.app.checkRetainedResult();
  expect(recovered.status).toBe("retained");
  if (recovered.status !== "retained") throw Error(JSON.stringify(recovered));
  expect(recovered.before).toEqual(before);
  expect(recovered.after).toEqual(accepted.snapshot);
  expect(f.app.historyState().undoCount).toBe(history.undoCount + 1);
  await f.app.checkRetainedResult();
  expect(f.app.historyState().undoCount).toBe(history.undoCount + 1);
  f.finish(recovered);
  expect(f.writes()).toBe(writes);
});

async function recoveryFixture() {
  let record: RetainedRecord | undefined, writes = 0, id = 0, unknown = false;
  const port: RetentionPort = {
    catalogue: async () => [], acquire: async () => true, owns: () => true, release: async () => {},
    read: async () => ({ record, incarnation: "db" }),
    commit: async (attempt) => {
      writes++;
      record = attempt.record;
      return unknown ? { status: "unknown", reason: "Acknowledgement lost" } : { status: "retained" };
    },
  };
  const app = createRetainedWorkbench(port, () => `recovery-${++id}`, () => "2026-11-23T12:00:00.000Z");
  const finish = (result: Acceptance) => {
    if (result.status === "retained") app.consume(result.receipt.commandId);
    return result;
  };
  finish(await app.createProject({ id: "p", name: "Recovery" }));
  await app.openProject("p");
  const seed = createColorLiteral({ colorSpace: "srgb", components: ["0.2", "0.4", "0.8"], alpha: "1" });
  const settings: RampSettings = { seed, targetGamut: "srgb", recipe: { id: "single-seed-oklch", version: 1, intensity: "retained" }, seedPosition: { mode: "auto", label: autoRampPosition(seed, 11) } };
  const create = { operation: "createColorRamp" as const, input: {
    projectId: "p", group: { id: "g", projectId: "p", localName: "brand", parentGroupId: null }, settings,
    members: rampLabels(11).map(label => ({ label, id: `t${label}` })),
  } };
  return { app, finish, create, record: () => record!, writes: () => writes, loseAcknowledgement: () => { unknown = true; },
    replacement: () => {
      const draft = replaceRampCount(record!.snapshot, "g", openRampDraft(record!.snapshot, "g"), 6, () => `step-${++id}`);
      return { operation: "applyColorRamp" as const, input: { projectId: "p", groupId: "g", settings: draft.settings, steps: draft.steps, choices: [] } };
    },
  };
}
