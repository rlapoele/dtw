import { utf8Bytes } from "./codec";
import type { ProjectSnapshot } from "@application/project-storage";
import type { CommandReceipt, WriteAttempt } from "./ports";
export type HistoryAction = { readonly id: string; readonly label: string };
export type HistoryState = { readonly undoCount: number; readonly redoCount: number; readonly undo?: HistoryAction; readonly redo?: HistoryAction; readonly notice?: string };
export type HistoryDirection = "undo" | "redo";
type State = { snapshot: ProjectSnapshot; text: string; bytes: number };
type Step = HistoryAction & { before: State; after: State };
export const historyLimits = { steps: 50, bytes: 32 * 1024 * 1024 } as const;
// Object field order is not authored meaning; string/component/array order is.
export function snapshotText(snapshot: ProjectSnapshot): string {
  return JSON.stringify(snapshot, (_key, value: unknown) => value && typeof value === "object" && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) : value);
}
function state(snapshot: ProjectSnapshot): State {
  const text = snapshotText(snapshot);
  return { snapshot: JSON.parse(text) as ProjectSnapshot, text, bytes: utf8Bytes(text) };
}
function path(s: ProjectSnapshot, kind: string, id: string): string {
  const entity = kind === "group" ? s.groups.find(g => g.id === id) : s.tokens.find(t => t.id === id);
  if (!entity) return id;
  const names = [entity.localName], seen = new Set<string>();
  let parent = entity.parentGroupId;
  while (parent !== null && !seen.has(parent)) {
    seen.add(parent); const g = s.groups.find(g => g.id === parent); if (!g) break;
    names.unshift(g.localName); parent = g.parentGroupId;
  }
  return names.join(".") || "(unnamed)";
}
function label(before: ProjectSnapshot, after: ProjectSnapshot, receipt: CommandReceipt) {
  const name = path(after, receipt.result.entityKind, receipt.result.id);
  switch (receipt.operation) {
    case "createGroup": return `Create group ${name}`;
    case "renameGroup": return `Rename ${path(before, "group", receipt.result.id)} to ${name}`;
    case "createColorToken": return `Create ${name}`;
    default: return `Change ${name}`;
  }
}
/** Only this coordinator can supply history candidates. Targets are detached,
 * previously admitted authored states, never renderer-supplied replacements.
 * Existing diagnostic baselines are restored exactly, not reauthored/repaired. */
export function createSessionHistory(limits: {steps: number; bytes: number} = historyLimits) {
  let steps: Step[] = [], cursor = 0, baseline: {projectId: string; incarnation: string; revision: string} | undefined;
  let notice: string | undefined, finalized: string | undefined;
  const clear = (message?: string) => { steps = []; cursor = 0; notice = message; };
  function observe(projectId: string, incarnation: string, revision: string) {
    if (baseline && (baseline.projectId !== projectId || baseline.incarnation !== incarnation || baseline.revision !== revision))
      clear("Project changed outside this session. Undo/Redo history cleared.");
    baseline = {projectId, incarnation, revision};
  }
  function next(direction: HistoryDirection) { return steps[direction === "undo" ? cursor - 1 : cursor]; }
  return {
    observe,
    end() { clear(); baseline = undefined; },
    state(): HistoryState {
      const undo = next("undo"), redo = next("redo");
      return {undoCount: cursor, redoCount: steps.length - cursor, ...(undo ? {undo: {id: undo.id, label: undo.label}} : {}), ...(redo ? {redo: {id: redo.id, label: redo.label}} : {}), ...(notice ? {notice} : {})};
    },
    target(direction: HistoryDirection, projectId: string, incarnation: string, revision: string, stepId: string) {
      observe(projectId, incarnation, revision);
      const step = next(direction);
      if (!step || step.id !== stepId) throw Error("Original history action is no longer available. No change was retained.");
      return JSON.parse((direction === "undo" ? step.before : step.after).text) as ProjectSnapshot;
    },
    accepted(attempt: WriteAttempt, before: ProjectSnapshot | undefined) {
      const receipt = attempt.record.lastAcceptedCommand;
      if (finalized === receipt.commandId) return;
      finalized = receipt.commandId;
      if (!before || receipt.operation === "createProject" || receipt.operation === "restoreProject") {
        clear(before ? "Project replaced. Undo/Redo history cleared." : undefined);
      } else if (receipt.operation === "undo" || receipt.operation === "redo") {
        cursor += receipt.operation === "undo" ? -1 : 1;
      } else {
        const previous = steps[cursor - 1]?.after;
        const beforeState = previous?.text === snapshotText(before) ? previous : state(before);
        const after = state(attempt.record.snapshot);
        steps = steps.slice(0, cursor);
        steps.push({id: receipt.commandId, label: label(before, attempt.record.snapshot, receipt), before: beforeState, after});
        cursor = steps.length;
        if (beforeState.bytes + after.bytes > limits.bytes) {
          clear("Change applied. This change cannot be undone in this session. Earlier Undo/Redo history was cleared.");
        } else {
          const bytes = () => [...new Set(steps.flatMap(s => [s.before, s.after]))].reduce((n, s) => n + s.bytes, 0);
          while (steps.length > limits.steps || bytes() > limits.bytes) {
            steps.shift(); cursor--;
            notice = "Earlier changes are no longer available to undo.";
          }
        }
      }
      baseline = {projectId: attempt.projectId, incarnation: attempt.incarnation, revision: attempt.record.revision};
    },
  };
}
