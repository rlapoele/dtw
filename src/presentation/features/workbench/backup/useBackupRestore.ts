import { useRef, useState, useEffect, useReducer } from "react";

import { downloadProjectBackup } from "@presentation/host/backup-file";
import type {
  RestorePreview,
  WorkbenchHost,
  PublicAcceptance,
} from "@presentation/host/protocol";
export type RestoreProtection = {
  protection: string | null;
  acknowledgement: boolean;
};
export function restoreProtectionReducer(
  state: RestoreProtection,
  action:
    | { type: "protect"; revision: string | null }
    | { type: "acknowledge"; value: boolean },
): RestoreProtection {
  return action.type === "protect"
    ? { protection: action.revision, acknowledgement: false }
    : { ...state, acknowledgement: !!state.protection && action.value };
}
export function useBackupRestore({
  host,
  initial,
  onCancel,
  onOpen,
  restage,
}: {
  host: WorkbenchHost;
  initial: RestorePreview;
  onCancel(reset?: boolean): void;
  onOpen(id: string): void;
  restage?: () => Promise<RestorePreview>;
}) {
  const [{ protection, acknowledgement }, dispatchProtection] = useReducer(
    restoreProtectionReducer,
    { protection: null, acknowledgement: false },
  );
  const setProtection = (revision: string | null) =>
    dispatchProtection({ type: "protect", revision });
  const setAcknowledgement = (value: boolean) =>
    dispatchProtection({ type: "acknowledge", value });

  const [preview, setPreview] = useState(initial),
    [replacement, setReplacement] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [unknown, setUnknown] = useState(false),
    [leaving, setLeaving] = useState(false);
  const knownAccepted = useRef(false),
    activeMutation = useRef(false);
  const [stageLost, setStageLost] = useState(false),
    [retained, setRetained] = useState(false);
  const stay = useRef<HTMLButtonElement>(null);
  async function refresh() {
    const next = await host.call("refreshStage", preview.stageId);
    setPreview(next);
    setProtection(null);
    setAcknowledgement(false);
  }
  async function finish(result: PublicAcceptance) {
    if (result.status === "unknown") {
      if (!knownAccepted.current) setUnknown(true);
      setError(result.reason);
      return;
    }
    if (result.status === "rejected") {
      setUnknown(false);
      setError(result.reason);
      try {
        await refresh();
      } catch {
        setStageLost(true);
        setError(
          result.reason +
            " The original worker stage is unavailable. Review the selected file again before an explicit retry.",
        );
      }
      return;
    }
    setUnknown(false);
    knownAccepted.current = true;
    setRetained(true);
    await host.call("consume", result.receipt.commandId);
    if (result.readback === "unavailable")
      setError(
        "Project retained; readback unavailable. Use Open local project to retry reading without repeating restore.",
      );
    else onOpen(result.receipt.result.id);
  }
  useEffect(() => {
    if (leaving) requestAnimationFrame(() => stay.current?.focus());
  }, [leaving]);
  async function restore() {
    if (busy || unknown || retained || stageLost) return;
    setBusy(true);
    activeMutation.current = true;
    setError("");
    try {
      await finish(
        await host.call("restore", {
          stageId: preview.stageId,
          projectId: preview.project.id,
          expectedRevision: preview.local?.revision ?? null,
          protectedRevision: protection,
          acknowledgement,
        }),
      );
    } catch (e) {
      if (!knownAccepted.current) setUnknown(true);
      setError(
        e instanceof Error
          ? e.message
          : "Restore outcome unknown; selected backup remains staged.",
      );
    } finally {
      activeMutation.current = false;
      setBusy(false);
    }
  }
  const protectLocal = async () => {
    setBusy(true);
    setError("");
    try {
      const revision = await downloadProjectBackup(
        host,
        preview.project.id,
        preview.local!.revision,
      );
      setProtection(revision);
      setAcknowledgement(false);
      setNotice(
        "Backup download requested. Confirm you kept the independent file before replacing.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Backup generation failed");
      await refresh();
    } finally {
      setBusy(false);
    }
  };
  const checkPending = async () => {
    try {
      await finish(await host.call("check", null));
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Check failed; original outcome remains unknown.",
      );
    }
  };
  const reviewFile = async () => {
    setBusy(true);
    try {
      const next = await restage!();
      setPreview(next);
      setStageLost(false);
      setProtection(null);
      setAcknowledgement(false);
      setReplacement(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Selected file could not be reviewed.",
      );
    } finally {
      setBusy(false);
    }
  };
  const checkUnknown = async () => {
    setBusy(true);
    try {
      await finish(await host.call("check", null));
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Result check failed; outcome remains unknown",
      );
    } finally {
      setBusy(false);
    }
  };
  return {
    preview,
    replacement,
    setReplacement,
    protection,
    setProtection,
    acknowledgement,
    setAcknowledgement,
    busy,
    error,
    notice,
    unknown,
    leaving,
    setLeaving,
    activeMutation,
    stageLost,
    retained,
    stay,
    finish,
    restore,
    protectLocal,
    checkPending,
    reviewFile,
    checkUnknown,
  };
}
