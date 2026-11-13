import { readBackupFile } from "@presentation/host/backup-file";
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
) {
  const [entries, setEntries] = useState<readonly CatalogueEntry[]>();
  const [project, setProject] = useState<ProjectHeader>();
  const [unknown, setUnknown] =
    useState<Extract<PublicAcceptance, { status: "unknown" }>>();
  const [retainedId, setRetainedId] = useState<string | null>(null);
  const activeMutation = useRef(false);
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
    if (pending || unknown) return;
    setPending(true);
    setError("");
    try {
      setProject(await host.current!.call("openProject", id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Project unavailable");
    } finally {
      setPending(false);
    }
  }
  async function create() {
    if (pending || unknown || retainedId !== null) return;
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
