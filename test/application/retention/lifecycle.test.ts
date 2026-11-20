import { expect, it } from "vitest";
import { createRetainedWorkbench } from "@application/retention/service";
import { decodeBackup, encodeBackup } from "@application/retention/codec";
import { decodeRetainedRecord } from "@application/retention/record";
import type { Acceptance, RetainedRecord, RetentionPort, WriteAttempt } from "@application/retention/ports";

const date = (n: number) => `2026-11-18T10:00:${String(n).padStart(2, "0")}.000Z`;
function fixture(legacy = false) {
  let record: RetainedRecord | undefined = legacy ? {
    recordVersion: 1, authoredVersion: 1, revision: "legacy",
    lastAcceptedCommand: { commandId: "old", operation: "createProject", result: {entityKind: "project", id: "p"} },
    snapshot: { project: { id: "p" as never, name: "Legacy" }, groups: [], tokens: [] },
  } : undefined;
  let ticks = 0, ids = 0, outcome: "retained" | "unknown" | "rejected" = "retained";
  let attempt: WriteAttempt;
  const port: RetentionPort = {
    catalogue: async () => [], acquire: async () => true, owns: () => true, release: async () => {},
    read: async () => ({ record, incarnation: "db" }),
    commit: async value => { attempt = value; if (outcome !== "rejected") record = value.record; return outcome === "retained" ? {status: outcome} : {status: outcome, reason: "simulated"}; },
  };
  const clock = () => date(++ticks);
  const app = createRetainedWorkbench(port, () => `id${++ids}`, clock);
  const finish = (value: Acceptance) => { if (value.status === "retained") app.consume(value.receipt.commandId); return value; };
  return { app, port, clock, finish, ticks: () => ticks, record: () => record!, attempt: () => attempt!, outcome: (value: typeof outcome) => outcome = value };
}
it("stamps creation once, preserves exact description and never stamps reads, no-ops, rejected writes or backup", async () => {
  const f = fixture();
  f.finish(await f.app.createProject({id: "p", name: "Project", description: "  First\nSecond  "}));
  expect(f.record().snapshot.project).toEqual({id: "p", name: "Project", description: "  First\nSecond  ", preferences: { defaultColorSpace: "oklch" }, creationDate: date(1), lastUpdatedDate: date(1)});
  expect(f.record().authoredVersion).toBe(3);
  const group = {operation: "createGroup" as const, input: {id: "g", projectId: "p", localName: "group", parentGroupId: null}};
  f.finish(await f.app.command(group, f.record().revision));
  expect(f.record().snapshot.project).toMatchObject({creationDate: date(1), lastUpdatedDate: date(2)});
  const before = f.record();
  expect((await f.app.command({operation: "renameGroup", projectId: "p", groupId: "g", localName: "group"}, before.revision)).status).toBe("unchanged");
  await f.app.openProject("p");
  const backup = decodeBackup(encodeBackup(before.snapshot, date(50)));
  expect(backup.snapshot).toEqual(before.snapshot); expect(backup.createdAt).toBe(date(50));
  expect(f.ticks()).toBe(2);
  f.outcome("rejected");
  expect((await f.app.command({...group, input: {...group.input, id: "h", localName: "other"}}, before.revision)).status).toBe("rejected");
  expect(f.record()).toBe(before); expect(f.ticks()).toBe(3);
});
it.each([false, true])("history updates dates without rolling creation metadata backwards (legacy=%s)", async legacy => {
  const f = fixture(legacy);
  if (!legacy) f.finish(await f.app.createProject({id: "p", name: "Project", description: ""}));
  expect(f.record().snapshot.project.description).toBeUndefined();
  await f.app.openProject("p");
  for (const id of ["g", "h"]) f.finish(await f.app.command({operation: "createGroup", input: {id, projectId: "p", localName: id, parentGroupId: null}}, f.record().revision));
  for (const direction of ["undo", "undo", "redo", "redo"] as const) {
    const tick = f.ticks() + 1;
    f.finish(await f.app.traverse(direction, "p", f.record().revision, f.app.historyState()[direction]!.id));
    expect(f.record().snapshot.project.creationDate).toBe(legacy ? undefined : date(1));
    expect(f.record().snapshot.project.lastUpdatedDate).toBe(date(tick));
  }
});
it("unknown outcome and stopped-attempt reconciliation reuse accepted dates without another clock reading", async () => {
  const f = fixture(); f.outcome("unknown");
  expect((await f.app.createProject({id: "p", name: "Project"})).status).toBe("unknown");
  const original = f.record();
  f.finish(await f.app.checkRetainedResult());
  expect(f.record()).toBe(original); expect(f.ticks()).toBe(1);
  const a = f.attempt(), receipt = a.record.lastAcceptedCommand;
  const fresh = createRetainedWorkbench(f.port, () => "unused", f.clock);
  const recovered = await fresh.checkInterruptedAttempt({projectId: "p", incarnation: "db", expectedRevision: null, commandId: receipt.commandId, revision: a.record.revision, operation: receipt.operation, result: receipt.result});
  expect(recovered.status).toBe("retained");
  if (recovered.status === "retained") expect(recovered.after.project).toEqual(original.snapshot.project);
  expect(f.ticks()).toBe(1);
});
it.each([false, true])("restore preserves known and absent dates exactly (known=%s)", async known => {
  const f = fixture();
  const snapshot = {project: {id: "p" as never, name: "Restored", ...(known ? {creationDate: date(20), lastUpdatedDate: date(30)} : {})}, groups: [], tokens: []};
  f.finish(await f.app.restoreProject(decodeBackup(encodeBackup(snapshot, date(50))).snapshot, null));
  expect(f.record().snapshot).toEqual(snapshot); expect(f.ticks()).toBe(0);
});
it("strictly admits legacy/new versions and rejects malformed dates and future fields/versions", () => {
  const legacy = fixture(true).record();
  expect(decodeRetainedRecord(legacy, "p")).toEqual(legacy);
  const modern = {...legacy, authoredVersion: 2, snapshot: {...legacy.snapshot, project: {...legacy.snapshot.project, creationDate: date(1)}}};
  expect(decodeRetainedRecord(modern, "p").snapshot).toEqual(modern.snapshot);
  const envelope = JSON.parse(encodeBackup(modern.snapshot, date(50)));
  expect(envelope.authoredVersion).toBe(3);
  for (const bad of ["2026-02-30T10:00:00.000Z", "2026-11-18T10:00:00Z", "2026-11-18T11:00:00.000+01:00", 0, null]) {
    const snapshot = {...modern.snapshot, project: {...modern.snapshot.project, lastUpdatedDate: bad}};
    expect(() => decodeRetainedRecord({...modern, snapshot}, "p")).toThrow();
    expect(() => decodeBackup(JSON.stringify({...envelope, snapshot}))).toThrow();
  }
  for (const authoredVersion of [1, 4]) {
    expect(() => decodeRetainedRecord({...modern, authoredVersion}, "p")).toThrow();
    expect(() => decodeBackup(JSON.stringify({...envelope, authoredVersion}))).toThrow();
  }
  expect(() => decodeBackup(JSON.stringify({...envelope, snapshot: {...modern.snapshot, project: {...modern.snapshot.project, future: true}}}))).toThrow();
  expect(decodeBackup(JSON.stringify({...envelope, authoredVersion: 1, snapshot: legacy.snapshot})).snapshot).toEqual(legacy.snapshot);
});

 it.each([undefined, "srgb", "display-p3", "hsl", "oklab", "oklch"] as const)("retains creation preference %s across edit, history, reopen and exact restore", async space => {
  const f = fixture();
  f.finish(await f.app.createProject({ id: "p", name: "P", ...(space ? { preferences: { defaultColorSpace: space } } : {}) }));
  const preference = { defaultColorSpace: space ?? "oklch" };
  expect(f.record().snapshot.project.preferences).toEqual(preference);
  await f.app.openProject("p");
  f.finish(await f.app.command({operation: "createGroup", input: {id: "g", projectId: "p", localName: "g", parentGroupId: null}}, f.record().revision));
  for (const direction of ["undo", "redo"] as const) {
    f.finish(await f.app.traverse(direction, "p", f.record().revision, f.app.historyState()[direction]!.id));
    expect(f.record().snapshot.project.preferences).toEqual(preference);
  }
  const snapshot = decodeBackup(encodeBackup(f.record().snapshot, date(50))).snapshot;
  const restored = fixture(); restored.finish(await restored.app.restoreProject(snapshot, null));
  expect(restored.record().snapshot).toEqual(snapshot);
  expect((await restored.app.openProject("p")).record!.snapshot.project.preferences).toEqual(preference);
 });
 it.each([{}, null, {defaultColorSpace: "xyz"}, {defaultColorSpace: "oklch", extra: true}, {defaultColorSpace: 1}])("rejects malformed preference without retained write: %j", async preferences => {
  const f = fixture();
  expect((await f.app.createProject({id: "p", name: "P", preferences} as never)).status).toBe("rejected");
  expect(f.record()).toBeUndefined();
 });
 it("admits v3 preferences only, rejects whole malformed snapshots and leaves legacy absence intact", () => {
  const old = fixture(true).record();
  const project = {...old.snapshot.project, preferences: {defaultColorSpace: "display-p3"}};
  for (const authoredVersion of [1, 2, 3, 4]) {
    const record = {...old, authoredVersion, snapshot: {...old.snapshot, project}};
    const read = () => decodeRetainedRecord(record, "p");
    if (authoredVersion === 3) expect(read().snapshot.project).toEqual(project); else expect(read).toThrow();
    const backup = () => decodeBackup(JSON.stringify({format: "dtw.project-backup", formatVersion: 1, authoredVersion, createdAt: date(1), snapshot: record.snapshot}));
    if (authoredVersion === 3) expect(backup().snapshot.project).toEqual(project); else expect(backup).toThrow();
  }
  for (const preferences of [{}, null, {defaultColorSpace: "bad"}, {defaultColorSpace: "oklch", extra: 1}]) {
    expect(() => decodeRetainedRecord({...old, authoredVersion: 3, snapshot: {...old.snapshot, project: {...project, preferences}}}, "p")).toThrow();
  }
  for (const authoredVersion of [1, 2, 3]) expect(decodeRetainedRecord({...old, authoredVersion}, "p").snapshot.project).not.toHaveProperty("preferences");
 });
