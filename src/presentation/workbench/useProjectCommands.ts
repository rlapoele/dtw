import { useReducer, useRef } from "react";
import type { MutableRefObject } from "react";
import type { AuthoringCommand } from "@application/retention/ports";
import type {
  ProjectHeader,
  PublicAcceptance,
  WorkbenchHost,
} from "@presentation/host/protocol";
import { UnknownWriteError } from "@presentation/host/worker-client";
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
    completion = useRef<(() => void) | undefined>(undefined);
  async function accept(command: AuthoringCommand): Promise<PublicAcceptance> {
    if (
      lifecycleBlocked ||
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
      let result = await host.call("command", {
        command,
        revision: current.current.revision,
      });
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
    }
  }
  async function retryReading() {
    setBusy(true);
    try {
      if (await refresh()) {
        const finish = completion.current;
        completion.current = undefined;
        setRetainedPending(undefined);
        finish?.();
        setNotice(
          "Retained applied state recovered. The original write was not repeated.",
        );
      }
    } finally {
      setBusy(false);
    }
  }

  async function check() {
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
            finish?.();
            setNotice("Original command retained and completed once.");
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
      setBusy(false);
    }
  }
  return {
    busy,
    unknown,
    retainedPending,
    activeMutation,
    completion,
    accept,
    check,
    retryReading,
    setBusy,
  };
}
