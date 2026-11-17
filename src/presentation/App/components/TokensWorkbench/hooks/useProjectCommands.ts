import { useOutcomeFeedback } from "@presentation/App/components/OutcomeFeedback/OutcomeFeedback";
import type { HistoryDirection, HistoryState } from "@application/retention/history";
import { useEffect, useReducer, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import type { AuthoringCommand } from "@application/retention/ports";
import type {
  ProjectHeader,
  PublicAcceptance,
  WorkbenchHost,
} from "@hosts/browser/protocol";
import { UnknownWriteError } from "@hosts/browser/worker-client";
export type CommandState = {
  busy: boolean;
  unknown?: Extract<PublicAcceptance, { status: "unknown" }>;
  retainedPending?: Extract<PublicAcceptance, { status: "retained" }>;
};
export type CommandAction =
  | { type: "busy"; value: boolean }
  | { type: "unknown"; value: CommandState["unknown"] }
  | { type: "retained"; value: CommandState["retainedPending"] };
export function commandReducer(
  state: CommandState,
  action: CommandAction,
): CommandState {
  switch (action.type) {
    case "busy":
      return { ...state, busy: action.value };
    case "unknown":
      return { ...state, unknown: action.value };
    case "retained":
      return { ...state, retainedPending: action.value };
  }
}
export function useProjectCommands(
  host: WorkbenchHost,
  current: MutableRefObject<ProjectHeader>,
  reading: MutableRefObject<boolean>,
  lifecycleBlocked: boolean,
  refresh: (known?: ProjectHeader) => Promise<boolean | undefined>,
  setReadFailure: (message: string) => void,
  setError: (message: string) => void,
  setNotice: (message: string) => void,
) {
  const outcomes = useOutcomeFeedback();
  const [history, setHistory] = useState<HistoryState>({undoCount: 0, redoCount: 0});
  const completedRecoveries = useRef(new Set<string>());
  const historyRead = useRef(0);
  async function refreshHistory() {
    const generation = ++historyRead.current;
    const baseline = current.current;
    try {
      const next = await host.call("historyState", {projectId: current.current.project.id, revision: current.current.revision});
      if (generation === historyRead.current && current.current.revision === baseline.revision && current.current.incarnation === baseline.incarnation) setHistory(next ?? {undoCount: 0, redoCount: 0});
    } catch { /* Existing coherent read/recovery owns unavailable-state feedback. */ }
  }
  useEffect(() => { void refreshHistory(); }, [current.current.revision, current.current.incarnation, lifecycleBlocked]);
  const [{ busy, unknown, retainedPending }, dispatch] = useReducer(
    commandReducer,
    { busy: false },
  );
  const setBusy = (value: boolean) => dispatch({ type: "busy", value });
  const setUnknown = (value: CommandState["unknown"]) =>
    dispatch({ type: "unknown", value });
  const setRetainedPending = (value: CommandState["retainedPending"]) =>
    dispatch({ type: "retained", value });
  const activeMutation = useRef(false),
    completion = useRef<((clarification?: string) => void) | undefined>(undefined);
  async function execute(command: AuthoringCommand | {direction: HistoryDirection; stepId: string}): Promise<PublicAcceptance> {
    if (
      lifecycleBlocked ||
      !current.current.writable ||
      activeMutation.current ||
      reading.current ||
      busy ||
      unknown ||
      retainedPending
    )
      return {
        status: "rejected",
        reason: "Editing paused until lifecycle recovery completes.",
      };
    setBusy(true);
    activeMutation.current = true;
    setError("");
    try {
      let result = "direction" in command
        ? await host.call("traverse", {...command, projectId: current.current.project.id, revision: current.current.revision})
        : await host.call("command", {command, revision: current.current.revision});
      if (result.status === "unknown") setUnknown(result);
      else if (result.status === "retained") {
        await host.call("consume", result.receipt.commandId);
        if (result.readback === "available" && !(await refresh()))
          result = {
            ...result,
            readback: "unavailable",
            readError: "Retained, but coherent display is unavailable.",
          };
        if (result.readback === "unavailable") {
          setRetainedPending(result);
          setReadFailure(
            result.readError ??
              "Retained, but readback unavailable. Retry reading without repeating the write.",
          );
        }
      } else if (result.status === "unchanged") {
        outcomes.publish("No authored change. Undo/Redo history is unchanged.", "information");
      } else {
        completion.current = undefined;
        setError(result.reason);
      }
      return result;
    } catch (e) {
      const result = {
        status: "unknown" as const,
        reason: e instanceof Error ? e.message : "Retained outcome unknown",
        commandId:
          e instanceof UnknownWriteError
            ? e.attempt.commandId
            : "worker-observation-lost",
      };
      setUnknown(result);
      return result;
    } finally {
      activeMutation.current = false;
      setBusy(false);
      void refreshHistory();
    }
  }
  async function retryReading() {
    if (activeMutation.current || reading.current) return;
    activeMutation.current = true;
    setBusy(true);
    try {
      if (await refresh()) {
        const finish = completion.current;
        completion.current = undefined;
        setRetainedPending(undefined);
        const receipt = retainedPending?.receipt.commandId;
        if (finish || (receipt && !completedRecoveries.current.has(receipt))) {
          outcomes.recover("Retained applied state recovered. The original write was not repeated.", finish);
          if (receipt) completedRecoveries.current.add(receipt);
        }
      }
    } finally {
      activeMutation.current = false;
      setBusy(false);
    }
  }

  async function check() {
    if (activeMutation.current || reading.current) return;
    activeMutation.current = true;
    setBusy(true);
    try {
      let result = await host.call("check", null);
      if (result.status === "unknown") {
        setUnknown(result);
        setError(result.reason);
      } else {
        setUnknown(undefined);
        if (result.status === "retained") {
          await host.call("consume", result.receipt.commandId);
          if (result.readback === "available" && !(await refresh()))
            result = { ...result, readback: "unavailable" };
          if (result.readback === "unavailable") {
            setRetainedPending(result);
            setReadFailure(
              result.readError ??
                "Original write retained; retry coherent reading without repeating it.",
            );
          } else {
            const finish = completion.current;
            completion.current = undefined;
            if (!completedRecoveries.current.has(result.receipt.commandId)) {
              completedRecoveries.current.add(result.receipt.commandId);
              outcomes.recover("Original command retained and completed once.", finish);
            }
          }
        } else {
          completion.current = undefined;
          setError(result.reason);
        }
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Result check failed; original outcome remains unknown.",
      );
    } finally {
      activeMutation.current = false;
      setBusy(false);
      void refreshHistory();
    }
  }
  return {
    busy,
    unknown,
    retainedPending,
    activeMutation,
    completion,
    history,
    accept: (command: AuthoringCommand) => execute(command),
    traverse: (direction: HistoryDirection, stepId: string) => execute({direction, stepId}),
    check,
    retryReading,
    setBusy,
  };
}
