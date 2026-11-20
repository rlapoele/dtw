import { describe, expect, it } from "vitest";
import { createRetainedWorkbench as createWithClock } from "@application/retention/service";
import type { Acceptance, RetainedRecord, RetentionPort } from "@application/retention/ports";
const createRetainedWorkbench = (port: RetentionPort, nextId: () => string) => createWithClock(port, nextId, () => "2026-11-18T10:00:00.000Z");

function setup() {
  let record: RetainedRecord | undefined, n = 0, writes = 0;
  let outcome: "retained" | "rejected" | "unknown" = "retained";
  let incarnation = "db", unreadable = false;
  const port: RetentionPort = {
    catalogue: async () => [], acquire: async () => true, owns: () => true, release: async () => {},
    read: async () => { if (unreadable) throw Error("read failed"); return {record, incarnation}; },
    commit: async a => { writes++; if (outcome === "rejected") return {status: "rejected", reason: "quota"}; record = a.record; return {status: outcome, ...(outcome === "unknown" ? {reason: "lost"} : {})} as never; },
  };
  const app = createRetainedWorkbench(port, () => `id${++n}`);
  const finish = (r: Acceptance) => { if (r.status === "retained") app.consume(r.receipt.commandId); return r; };
  return {app, port, finish, record: () => record!, writes: () => writes, setOutcome: (o: typeof outcome) => outcome = o, unreadable: (v: boolean) => unreadable = v, external: () => record = {...record!, revision: "external"}, incarnation: () => incarnation = "new-db"};
}
async function opened() {
  const f = setup(); f.finish(await f.app.createProject({id: "p", name: "Project"})); await f.app.openProject("p"); return f;
}
async function group(f: Awaited<ReturnType<typeof opened>>, id = "g") {
  return f.finish(await f.app.command({operation: "createGroup", input: {id, projectId: "p", parentGroupId: null, localName: id, description: "exact"}}, f.record().revision));
}
async function traverse(f: Awaited<ReturnType<typeof opened>>, direction: "undo" | "redo") {
  const state = f.app.historyState();
  return f.finish(await f.app.traverse(direction, "p", f.record().revision, state[direction]!.id));
}
describe("session retained history", () => {
  it("undoes and redoes creation using fresh project-target receipts and the exact stable data", async () => {
    const f = await opened(); await group(f); const created = f.record();
    expect((await traverse(f, "undo")).status).toBe("retained");
    expect(f.record().snapshot.groups).toEqual([]);
    expect(f.record().lastAcceptedCommand).toMatchObject({operation: "undo", result: {entityKind: "project", id: "p"}});
    expect(f.record().recordVersion).toBe(2);
    expect(f.record().revision).not.toBe(created.revision);
    await traverse(f, "redo"); expect(f.record().snapshot).toEqual(created.snapshot);
  });
  it("preserves redo and revision on exact no-op; changing acknowledgment alone branches", async () => {
    const f = await opened(); await group(f); await group(f, "h"); await traverse(f, "undo");
    const before = f.record(), writes = f.writes(), redo = f.app.historyState().redo;
    const result = await f.app.command({operation: "renameGroup", projectId: "p", groupId: "g", localName: "g"}, before.revision);
    expect(result.status).toBe("unchanged"); expect(f.record()).toBe(before); expect(f.writes()).toBe(writes); expect(f.app.historyState().redo).toEqual(redo);
    await group(f, "i"); expect(f.app.historyState().redo).toBeUndefined();
  });
  it("keeps rejected traversal retryable and finalizes an unknown retained result exactly once", async () => {
    const f = await opened(); await group(f); const state = f.app.historyState();
    f.setOutcome("rejected"); expect((await traverse(f, "undo")).status).toBe("rejected"); expect(f.app.historyState()).toEqual(state);
    f.setOutcome("unknown"); expect((await traverse(f, "undo")).status).toBe("unknown"); expect(f.app.historyState()).toEqual(state);
    f.finish(await f.app.checkRetainedResult()); expect(f.app.historyState().undo).toBeUndefined(); expect(f.app.historyState().redo).toBeDefined();
    await f.app.checkRetainedResult(); expect(f.app.historyState().redo).toBeDefined();
  });
  it("invalidates external revisions and clears on departure while retaining project data", async () => {
    const f = await opened(); await group(f); f.external(); await f.app.openProject("p"); expect(f.app.historyState().undo).toBeUndefined(); expect(f.app.historyState().notice).toContain("outside");
    await group(f, "h"); await f.app.leaveProject("p"); await f.app.openProject("p"); expect(f.app.historyState().undo).toBeUndefined(); expect(f.record().snapshot.groups).toHaveLength(2);
  });
});

it("reverses rename and multiple exact authored token changes independently including alias identity", async () => {
  const f = await opened(); await group(f);
  const create = async (id: string, value: unknown) => f.finish(await f.app.command({operation: "createColorToken", input: {projectId: "p", id, parentGroupId: "g", localName: id, type: "color", regeneration: "protected", description: "  metadata  ", layer: "semantic", value} as never}, f.record().revision));
  await create("a", {kind: "literal", colorSpace: "srgb", components: ["0.1234567890123456789", "0", "0"], alpha: "1"});
  await create("b", {kind: "token-reference", targetTokenId: "a", valuePath: []});
  const original = f.record().snapshot;
  f.finish(await f.app.command({operation: "renameGroup", projectId: "p", groupId: "g", localName: "colors"}, f.record().revision));
  const renamed = f.record().snapshot;
  const value = {kind: "literal", colorSpace: "display-p3", components: ["0.25", "0.5", "0.75"], alpha: "0.5"} as const;
  const r = f.finish(await f.app.command({operation: "reviseColorToken", input: {projectId: "p", tokenId: "b", value: value as never}}, f.record().revision)); if (r.status === "rejected") throw Error(r.reason);
  const revised = f.record().snapshot;
  expect(revised).not.toEqual(renamed);
  await traverse(f, "undo"); expect(f.record().snapshot).toEqual(renamed);
  await traverse(f, "undo"); expect(f.record().snapshot).toEqual(original);
  await traverse(f, "undo"); expect(f.record().snapshot.tokens.map(t => t.id)).toEqual(["a"]);
  await traverse(f, "redo"); await traverse(f, "redo"); await traverse(f, "redo"); expect(f.record().snapshot).toEqual(revised);
});

it("blocks suspended traversal and rejects a captured stale step without replacing it", async () => {
  const f = await opened(); await group(f); const undo = f.app.historyState().undo!;
  f.app.suspend(); expect((await traverse(f, "undo")).status).toBe("rejected"); f.app.resume();
  await group(f, "h"); const before = f.record();
  expect((await f.app.traverse("undo", "p", before.revision, undo.id)).status).toBe("rejected"); expect(f.record()).toBe(before);
});

it("restores only the exact admitted diagnostic baseline, retaining its diagnostics", async () => {
  const f = await opened();
  Object.assign(f.record().snapshot, {groups: ["g1", "g2"].map(id => ({id, projectId: "p", localName: "collision", parentGroupId: null}))});
  const baseline = JSON.parse(JSON.stringify(f.record().snapshot));
  const repaired = f.finish(await f.app.command({operation: "renameGroup", projectId: "p", groupId: "g2", localName: "fixed"}, f.record().revision));
  expect(repaired.status).toBe("retained");
  await traverse(f, "undo"); expect(f.record().snapshot).toEqual(baseline);
});

it("finalizes retained-unreadable traversal once, blocks writes and retries only coherent reading", async () => {
  const f = await opened(); await group(f);
  const commit = f.port.commit.bind(f.port);
  f.port.commit = async a => {const result = await commit(a); f.unreadable(true); return result;};
  const undo = await traverse(f, "undo");
  expect(undo).toMatchObject({status:"retained",readback:"unavailable"});
  expect(f.app.historyState().undo).toBeUndefined();
  const writes = f.writes();
  expect((await traverse(f,"redo")).status).toBe("rejected");
  f.unreadable(false); await f.app.openProject("p");
  expect(f.writes()).toBe(writes); expect(f.app.historyState().redo).toBeDefined();
});

it("preserves history on unchanged resume, clears incarnation changes, and cannot reconstruct interrupted history", async () => {
  const f = await opened(); await group(f); const state = f.app.historyState();
  f.app.suspend(); f.app.resume(); await f.app.openProject("p"); expect(f.app.historyState()).toEqual(state);
  f.incarnation(); await f.app.openProject("p"); expect(f.app.historyState().undo).toBeUndefined();
  await group(f,"h");
  const before = f.record(), step = f.app.historyState().undo!;
  const identity = {projectId:"p",expectedRevision:before.revision,incarnation:"new-db",commandId:"original-undo",revision:"undo-revision",operation:"undo",result:{entityKind:"project",id:"p"}} as const;
  f.setOutcome("unknown"); await f.app.traverse("undo","p",before.revision,step.id,identity);
  const replacement = createRetainedWorkbench(f.port,()=>"unused");
  expect((await replacement.checkInterruptedAttempt(identity)).status).toBe("retained");
  expect(replacement.historyState().undo).toBeUndefined(); expect(replacement.historyState().redo).toBeUndefined();
});


it("reports true retained counts through traversal, branching, suspension and invalidation", async () => {
  const f = await opened();
  expect(f.app.historyState()).toMatchObject({undoCount: 0, redoCount: 0});
  await group(f); await group(f, "h");
  expect(f.app.historyState()).toMatchObject({undoCount: 2, redoCount: 0});
  await traverse(f, "undo");
  expect(f.app.historyState()).toMatchObject({undoCount: 1, redoCount: 1});
  f.app.suspend(); expect(f.app.historyState()).toMatchObject({undoCount: 1, redoCount: 1}); f.app.resume();
  await traverse(f, "redo"); expect(f.app.historyState()).toMatchObject({undoCount: 2, redoCount: 0});
  await traverse(f, "undo"); await group(f, "i");
  expect(f.app.historyState()).toMatchObject({undoCount: 2, redoCount: 0});
  f.external(); await f.app.openProject("p");
  expect(f.app.historyState()).toMatchObject({undoCount: 0, redoCount: 0});
  await group(f, "j"); await f.app.leaveProject("p");
  expect(f.app.historyState()).toMatchObject({undoCount: 0, redoCount: 0});
});

it("retains layer edits and exact backup data in one history step, preserving redo on a no-op", async () => {
  const { decodeRetainedRecord } = await import("@application/retention/record");
  const { encodeBackup, decodeBackup } = await import("@application/retention/codec");
  const f = await opened();
  const value = {kind: "literal", colorSpace: "srgb", components: ["0.123456789123456789", "none", "0"], alpha: "1"} as const;
  f.finish(await f.app.command({operation: "createColorToken", input: {projectId: "p", id: "t", localName: "color", parentGroupId: null, type: "color", regeneration: "protected", layer: "primitive", value}}, f.record().revision));
  const original = f.record().snapshot;
  const count = f.app.historyState().undoCount;
  f.finish(await f.app.command({operation: "reviseColorToken", input: {projectId: "p", tokenId: "t", value, layer: "semantic"}}, f.record().revision));
  expect(f.app.historyState().undoCount).toBe(count + 1);
  const changed = f.record().snapshot;
  expect(changed.tokens[0].layer).toBe("semantic");
  expect(changed.tokens[0].definition).toEqual(original.tokens[0].definition);
  expect(decodeRetainedRecord(f.record(), "p").snapshot).toEqual(changed);
  expect(decodeBackup(encodeBackup(changed, "2026-11-19T10:00:00.000Z")).snapshot).toEqual(changed);
  await traverse(f, "undo");
  expect(f.record().snapshot).toEqual(original);
  const before = f.record(), writes = f.writes(), redo = f.app.historyState().redo;
  expect(await f.app.command({operation: "reviseColorToken", input: {projectId: "p", tokenId: "t", value, layer: "primitive"}}, before.revision)).toMatchObject({status: "unchanged"});
  expect(f.record()).toBe(before); expect(f.writes()).toBe(writes); expect(f.app.historyState().redo).toEqual(redo);
  await traverse(f, "redo"); expect(f.record().snapshot).toEqual(changed);
  f.finish(await f.app.command({operation: "reviseColorToken", input: {projectId: "p", tokenId: "t", value: {...value, alpha: "0.5"}, layer: null}}, f.record().revision));
  expect(Object.hasOwn(f.record().snapshot.tokens[0], "layer")).toBe(false);
  await traverse(f, "undo"); expect(f.record().snapshot).toEqual(changed);
});

it("retains description and combined revisions in one step without rewriting unchanged absence or historical empty text", async () => {
  const { encodeBackup, decodeBackup } = await import("@application/retention/codec");
  const f = await opened();
  const value = {kind: "literal", colorSpace: "srgb", components: ["0.123456789123456789", "0", "0"], alpha: "0.987654321"} as const;
  f.finish(await f.app.command({operation: "createColorToken", input: {projectId: "p", id: "t", localName: "t", parentGroupId: null, type: "color", regeneration: "protected", description: "", value}}, f.record().revision));
  const input = {projectId: "p", tokenId: "t", value};
  const original = f.record(); const writes = f.writes(); const history = f.app.historyState();
  expect((await f.app.command({operation: "reviseColorToken", input}, original.revision)).status).toBe("unchanged");
  expect(f.record()).toBe(original); expect(f.writes()).toBe(writes); expect(f.app.historyState()).toEqual(history);
  const description = "  Exact\nmultiline  \n";
  f.finish(await f.app.command({operation: "reviseColorToken", input: {...input, description, layer: "semantic"}}, f.record().revision));
  const changed = f.record().snapshot;
  expect(changed.tokens[0].description).toBe(description);
  expect(changed.tokens[0].definition).toEqual(original.snapshot.tokens[0].definition);
  expect(f.app.historyState().undoCount).toBe(history.undoCount + 1);
  expect(decodeBackup(encodeBackup(changed, "2026-11-20T10:00:00.000Z")).snapshot).toEqual(changed);
  await traverse(f, "undo"); expect(f.record().snapshot).toEqual(original.snapshot);
  await traverse(f, "redo"); expect(f.record().snapshot).toEqual(changed);
  f.finish(await f.app.command({operation: "reviseColorToken", input: {...input, description: null}}, f.record().revision));
  expect(Object.hasOwn(f.record().snapshot.tokens[0], "description")).toBe(false);
  const removed = f.record();
  expect((await f.app.command({operation: "reviseColorToken", input}, removed.revision)).status).toBe("unchanged");
  expect(f.record()).toBe(removed);
  await f.app.leaveProject("p"); await f.app.openProject("p");
  expect(f.record().snapshot).toEqual(removed.snapshot);
  const restored = decodeBackup(encodeBackup(changed, "2026-11-20T10:00:00.000Z")).snapshot;
  expect(f.finish(await f.app.restoreProject(restored, f.record().revision, f.record().revision)).status).toBe("retained");
  expect(f.record().snapshot).toEqual(changed);
});
