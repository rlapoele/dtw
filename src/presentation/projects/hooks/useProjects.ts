import { downloadProjectBackup, readBackupFile } from "@presentation/host/backup-file";
import { UnknownWriteError } from "@presentation/host/worker-client";

import type { PublicAcceptance } from "@presentation/host/protocol";

import type { RestorePreview } from "@presentation/host/protocol";
import { useEffect, useRef, useState } from "react";

import type { WorkbenchHost, ProjectHeader } from "@presentation/host/protocol";
import type { CatalogueEntry } from "@application/retention/ports";

export function useProjects(
  host: import("react").MutableRefObject<WorkbenchHost | undefined>,
  ensureHost: () => WorkbenchHost,
  resetHost: () => void,
  hasPreview: boolean,
  onRetained?: () => void | Promise<void>,
) {
  const [entries, setEntries] = useState<readonly CatalogueEntry[]>();
  const [project, setProject] = useState<ProjectHeader>();
  const [unknown, setUnknown] =
    useState<Extract<PublicAcceptance, { status: "unknown" }>>();
  const [retainedId, setRetainedId] = useState<string | null>(null);
  const notified = useRef(new Set<string>());
  function notifyRetained(commandId: string) {
    if (notified.current.has(commandId)) return;
    notified.current.add(commandId);
    try { void Promise.resolve(onRetained?.()).catch(() => undefined); }
    catch { /* Advisory preference cannot change a retained outcome. */ }
  }
  const activeMutation = useRef(false);
  const commandPending = useRef(false);
  const [backupFeedback, setBackupFeedback] = useState("");
  const [name, setName] = useState(""),
    [error, setError] = useState(""),
    [pending, setPending] = useState(false),
    [notice, setNotice] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  async function catalogue() {
    setError("");
    setEntries(undefined);
    try {
      const activeHost = ensureHost();
      await activeHost.call("ready", null);
      setEntries(await activeHost.call("catalogue", null));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Projects unavailable");
    }
  }
  useEffect(() => {
    void catalogue();
  }, []);
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (name !== "" || pending || unknown || hasPreview) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    addEventListener("beforeunload", guard);
    return () => removeEventListener("beforeunload", guard);
  }, [name, pending, unknown, hasPreview]);
  async function recoverCreated(id: string) {
    setRetainedId(id);
    try {
      const next = await host.current!.call("openProject", id);
      // A newly created/restored project may not exist in the last catalogue.
      try { setEntries(await host.current!.call("catalogue", null)); } catch { /* Open result remains authoritative; catalogue can be retried on return. */ }
      setProject(next);
      setName("");
      setRetainedId(null);
      setNotice("Project retained in this browser.");
    } catch (e) {
      setError(
        "Project retained, but reading is unavailable. " +
          (e instanceof Error ? e.message : ""),
      );
    }
  }
  async function check() {
    setPending(true);
    try {
      const result = await host.current!.call("check", null);
      if (result.status === "unknown") {
        setUnknown(result);
        setError(result.reason);
      } else {
        setUnknown(undefined);
        if (result.status === "retained") {
          setRetainedId(result.receipt.result.id);
          notifyRetained(result.receipt.commandId);
          await host.current!.call("consume", result.receipt.commandId);
          await recoverCreated(result.receipt.result.id);
        } else setError(result.reason);
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Check failed; result remains unknown.",
      );
    } finally {
      setPending(false);
    }
  }
  async function open(id: string) {
    if (commandPending.current || pending || unknown || retainedId !== null || hasPreview) return;
    setPending(true);
    setError("");
    try {
      const next = await host.current!.call("openProject", id);
      if (!entries?.some(entry => entry.status === "supported" && entry.id === id)) {
        try { setEntries(await host.current!.call("catalogue", null)); } catch { /* Preserve successful open. */ }
      }
      setProject(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Project unavailable");
    } finally {
      setPending(false);
    }
  }
  async function create() {
    if (commandPending.current || pending || unknown || retainedId !== null || hasPreview) return;
    if (!name.trim()) {
      setError("A project name is required.");
      nameRef.current?.focus();
      return;
    }
    setPending(true);
    activeMutation.current = true;
    setError("");
    let acceptedId: string | undefined;
    try {
      const id = crypto.randomUUID();
      const result = await host.current!.call("createProject", { id, name });
      if (result.status !== "retained") {
        if (result.status === "unknown") setUnknown(result);
        setError(result.reason);
        return;
      }
      acceptedId = id;
      setRetainedId(id);
      notifyRetained(result.receipt.commandId);
      await host.current!.call("consume", result.receipt.commandId);
      await recoverCreated(id);
    } catch (e) {
      const reason =
        e instanceof Error ? e.message : "Project creation unavailable";
      if (acceptedId === undefined)
        setUnknown({
          status: "unknown",
          reason,
          commandId:
            e instanceof UnknownWriteError
              ? e.attempt.commandId
              : "worker-observation-lost",
        });
      setError(
        acceptedId === undefined
          ? reason
          : "Project retained. Retry reading without repeating creation. " +
              reason,
      );
    } finally {
      activeMutation.current = false;
      setPending(false);
    }
  }
  async function stageBackup(file: File): Promise<RestorePreview | undefined> {
    if (commandPending.current || pending || unknown || retainedId !== null || hasPreview) return;
    setPending(true);
    setError("");
    try {
      return await host.current!.call("stageBackup", {
        bytes: await readBackupFile(file),
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Backup could not be read. Browser data is unchanged.",
      );
    } finally {
      setPending(false);
    }
  }
  async function download(entry: Extract<CatalogueEntry, { status: "supported" }>) {
    if (commandPending.current || pending || unknown || retainedId !== null || hasPreview) return;
    // Capture one catalogue row, never open a project or acquire editing ownership.
    const { id, revision } = entry;
    commandPending.current = true;
    setPending(true);
    setBackupFeedback(`Preparing backup for ${JSON.stringify(id)}…`);
    try {
      await downloadProjectBackup(ensureHost(), id, revision);
      setBackupFeedback(`Download initiated for ${JSON.stringify(id)} at revision ${revision}. Confirm that you have saved an independent copy. Drafts are excluded.`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Backup unavailable";
      setBackupFeedback(`Backup for ${JSON.stringify(id)} failed: ${reason}. Refreshing catalogue facts; review them before a fresh explicit Download backup.`);
      await catalogue();
    } finally {
      commandPending.current = false;
      setPending(false);
    }
  }
  function returnToProjects(reset?: boolean) {
    if (reset) resetHost();
    setProject(undefined);
    void catalogue();
  }
  function leaveUnknown() {
    host.current?.fence();
    resetHost();
    setUnknown(undefined);
    setRetainedId(null);
    setName("");
    void catalogue();
  }
  function retryCreated() {
    if (retainedId !== null) {
      setPending(true);
      void recoverCreated(retainedId).finally(() => setPending(false));
    }
  }
  return {
    entries,
    download,
    backupFeedback,
    project,
    unknown,
    retainedId,
    activeMutation,
    name,
    setName,
    error,
    pending,
    notice,
    nameRef,
    catalogue,
    check,
    open,
    create,
    stageBackup,
    returnToProjects,
    leaveUnknown,
    retryCreated,
  };
}
