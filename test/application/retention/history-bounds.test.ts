import { createProject } from "@domain/project";
import { expect, it } from "vitest";
import { createSessionHistory } from "@application/retention/history";
import type { ProjectSnapshot } from "@application/project-storage";
const snapshot = (name: string): ProjectSnapshot => ({project: createProject({id: "p", name}), groups: [], tokens: []});
function edit(h: ReturnType<typeof createSessionHistory>, id: string, before: ProjectSnapshot, after: ProjectSnapshot) {
  h.accepted({projectId: "p", incarnation: "db", expectedRevision: "old", record: {recordVersion: 1, authoredVersion: 1, revision: id, snapshot: after, lastAcceptedCommand: {commandId: id, operation: "renameGroup", result: {entityKind: "group", id: "g"}}}}, before);
}
it("evicts oldest count steps and refuses an oversize step while keeping acceptance", () => {
  const h = createSessionHistory({steps: 2, bytes: 10000});
  edit(h, "1", snapshot("a"), snapshot("b")); edit(h, "2", snapshot("b"), snapshot("c")); edit(h, "3", snapshot("c"), snapshot("d"));
  expect(h.state()).toMatchObject({undoCount: 2, redoCount: 0});
  expect(h.state().notice).toContain("Earlier"); expect(h.state().undo?.id).toBe("3");
  const small = createSessionHistory({steps: 50, bytes: 10}); edit(small, "1", snapshot("a"), snapshot("b"));
  expect(small.state()).toMatchObject({undoCount: 0, redoCount: 0});
  expect(small.state().undo).toBeUndefined(); expect(small.state().notice).toContain("cannot be undone");
});
