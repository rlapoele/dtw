import { useOutcomeFeedback } from "@presentation/App/components/OutcomeFeedback/OutcomeFeedback";
import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction, RefObject, MutableRefObject } from "react";
import type { HistoryDirection, HistoryState } from "@application/retention/history";
import type { ProjectContext } from "@application/retention/projections";
import type { ProjectHeader, PublicAcceptance } from "@hosts/browser/protocol";
import type { Selection } from "@presentation/App/components/TokensWorkbench/hooks/useProjectReadback";
import { creationParent } from "@presentation/App/components/TokensWorkbench/helpers/browse-view";
import type { TokenBrowseView } from "@presentation/App/components/TokensWorkbench/helpers/browse-view";
import { historyShortcut, ownsHistoryShortcut } from "@presentation/App/components/TokensWorkbench/helpers/history-shortcuts";
type Setter<T> = Dispatch<SetStateAction<T>>;
type Options = {
  history: HistoryState; traverse(direction: HistoryDirection, stepId: string): Promise<PublicAcceptance>;
  blocked: boolean; unknown: boolean; retainedPending: boolean; readFailure: string;
  header: ProjectHeader; dialog: boolean; pending: boolean; request(action: () => void): void;
  current: MutableRefObject<ProjectHeader>; completion: MutableRefObject<((clarification?: string) => void) | undefined>;
  setDirty: Setter<boolean>; setEditorVersion: Setter<number>; setNotice: Setter<string>; setError: Setter<string>;
  panel: RefObject<HTMLElement | null>; narrow: boolean; back(moveFocus?: boolean): void;
  context: ProjectContext | undefined; selection: Selection; setSelection: Setter<Selection>; view: TokenBrowseView; setView: Setter<TokenBrowseView>;
};
/** Workbench delivery coordination only: captured intent, native shortcut ownership,
 * surviving-ID browse/selection and focus. Commands stay in useProjectCommands. */
export function useHistoryInteraction({history, traverse, blocked, unknown, retainedPending, readFailure, header, dialog, pending, request, current, completion, setDirty, setEditorVersion, setNotice, setError, panel, narrow, back, context, selection, setSelection, view, setView}: Options) {
  const outcomes = useOutcomeFeedback();
  const [historyIntent, setHistoryIntent] = useState<{direction: HistoryDirection; label: string}>();
  const historyReturn = useRef<HTMLElement | null>(null);
  const [retry, setRetry] = useState<{direction: HistoryDirection; id: string; revision: string}>();
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const outcomeMessage = useRef("");
  const processedRefresh = useRef(0);
  const pendingFocus = useRef<{invoked: HTMLElement | null; direction: HistoryDirection} | undefined>(undefined);
  const historyReason = blocked ? unknown ? "Result unknown. Check retained result before Undo/Redo." : retainedPending || readFailure ? "Current project read unavailable. Retry reading project." : !header.writable ? "Paused. Another tab has write access." : "Paused until access and retained state are checked." : dialog ? "Close the current form before Undo/Redo." : undefined;
  function requestHistory(direction: HistoryDirection) {
    const step = history[direction];
    if (blocked || dialog || !step || pending) return;
    const baseline = {revision: header.revision, incarnation: header.incarnation};
    const invoked = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    historyReturn.current = invoked;
    setHistoryIntent({direction, label: step.label});
    previousGroups.current = context?.groups.map(g => g.authored) ?? [];
    request(() => {
      setHistoryIntent(undefined);
      if (current.current.revision !== baseline.revision || current.current.incarnation !== baseline.incarnation) {
        setError("Original history action is no longer available. No change was retained."); return;
      }
      const finish = (clarification?: string) => {
        setDirty(false); setEditorVersion(v => v + 1); setHistoryRefresh(v => v + 1);
        setNotice("");
        outcomeMessage.current = `${direction === "undo" ? "Undid" : "Redid"} ${step.label}.${clarification ? ` ${clarification}` : ""}`;
        pendingFocus.current = {invoked, direction};
      };
      setRetry(undefined);
      completion.current = finish;
      setNotice(`${direction === "undo" ? "Undoing" : "Redoing"} ${step.label}…`);
      void traverse(direction, step.id).then(result => {
        if (result.status === "retained" && result.readback === "available") {
          const done = completion.current; completion.current = undefined; done?.();
        } else if (result.status === "rejected") {
          setNotice(""); setError(`Could not ${direction} ${step.label}. No change was retained. ${result.reason}`);
          setRetry({direction, id: step.id, revision: baseline.revision});
        }
      });
    });
  }
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const direction = historyShortcut(event);
      if (direction && ownsHistoryShortcut(event.target) && !blocked && !pending && history[direction]) {
        event.preventDefault(); requestHistory(direction);
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  });
  useEffect(() => {
    if (!historyRefresh || historyRefresh === processedRefresh.current || !context) return;
    processedRefresh.current = historyRefresh;
    if (selection && !(selection.kind === "token" ? context.tokens : context.groups).some(item => item.authored.id === selection.id)) {
      setSelection(null); setDirty(false); setEditorVersion(v => v + 1);
      if (narrow) back(false);
      outcomeMessage.current += ` Selected ${selection.kind} was removed.`;
    }
    outcomes.publish(outcomeMessage.current);
    outcomeMessage.current = "";
    const scopedGroup = creationParent(view);
    if (scopedGroup !== null && !context.groups.some(g => g.authored.id === scopedGroup)) {
      // Follow the previous scope's authored parent chain, never a matching name.
      let parent = previousGroups.current.find(g => g.id === scopedGroup)?.parentGroupId ?? null;
      const seen = new Set<string>();
      while (parent && !context.groups.some(g => g.authored.id === parent) && !seen.has(parent)) {
        seen.add(parent); parent = previousGroups.current.find(g => g.id === parent)?.parentGroupId ?? null;
      }
      setView(view.kind === "type" ? {...view, location: parent ? {kind: "group", id: parent} : undefined} : parent ? {kind: "group", id: parent} : {kind: "all-tokens"});
    }
  }, [historyRefresh, context]);
  const previousGroups = useRef(context?.groups.map(g => g.authored) ?? []);

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target || blocked) return;
    const opposite = target.direction === "undo" ? "redo" : "undo";
    if (!history[opposite]) return;
    pendingFocus.current = undefined;
    requestAnimationFrame(() => {
      const invoked = target.invoked;
      if (invoked?.matches("[data-history]")) {
        const current = document.querySelector<HTMLElement>(`[data-history="${target.direction}"]:not(:disabled)`);
        const fallback = document.querySelector<HTMLElement>(`[data-history="${opposite}"]:not(:disabled)`);
        (current ?? fallback ?? panel.current)?.focus({preventScroll: true});
      } else if (!invoked?.isConnected || invoked.closest("[hidden]")) {
        const heading = panel.current?.querySelector<HTMLElement>("h1");
        if (heading) heading.tabIndex = -1;
        (heading ?? panel.current)?.focus({preventScroll: true});
      }
    });
  }, [historyRefresh, blocked, history]);
  return {historyReason, historyIntent, historyReturn, requestHistory, historyRetry: retry && history[retry.direction]?.id === retry.id && header.revision === retry.revision && !blocked ? retry.direction : undefined, clearHistoryIntent: () => setHistoryIntent(undefined)};
}
