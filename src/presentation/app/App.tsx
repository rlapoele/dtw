import { UnknownWriteError } from "@presentation/host/worker-client";
import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/components/ui/dialog-content";
import type { PublicAcceptance } from "@presentation/host/protocol";
import { RestoreDialog } from "@presentation/features/workbench/components/RestoreDialog";
import type { RestorePreview } from "@presentation/host/protocol";
import { Workbench } from "./Workbench";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@presentation/components/ui/icon";
import { WorkerWorkbenchHost } from "@presentation/host/worker-client";
import type { WorkbenchHost, ProjectHeader } from "@presentation/host/protocol";
import type { CatalogueEntry } from "@application/retention/ports";
import { Button } from "@presentation/components/ui/button";
import { Field } from "@presentation/components/ui/field";
import { Input } from "@presentation/components/ui/input";
export function App({
  createHost = () => new WorkerWorkbenchHost(),
}: { createHost?: () => WorkbenchHost } = {}) {
  const host = useRef<WorkbenchHost | undefined>(undefined);
  const [entries, setEntries] = useState<readonly CatalogueEntry[]>();
  const [project, setProject] = useState<ProjectHeader>();
  const selectedBackupFile = useRef<File | undefined>(undefined);
  const [preview, setPreview] = useState<RestorePreview>();
  const [unknown, setUnknown] =
      useState<Extract<PublicAcceptance, { status: "unknown" }>>(),
    [leaving, setLeaving] = useState(false);
  const [retainedId, setRetainedId] = useState<string | null>(null);
  const activeMutation = useRef(false);
  const stay = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState(""),
    [error, setError] = useState(""),
    [pending, setPending] = useState(false),
    [notice, setNotice] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  async function catalogue() {
    setError("");
    setEntries(undefined);
    try {
      if (!host.current) host.current = createHost();
      await host.current.call("ready", null);
      setEntries(await host.current.call("catalogue", null));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Projects unavailable");
    }
  }
  useEffect(() => {
    void catalogue();
    return () => host.current?.dispose();
  }, []);
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (name !== "" || pending || unknown || preview) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    addEventListener("beforeunload", guard);
    return () => removeEventListener("beforeunload", guard);
  }, [name, pending, unknown, preview]);
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
  if (project && host.current)
    return (
      <Workbench
        key={project.project.id}
        onProject={(id) => void open(id)}
        host={host.current}
        initial={project}
        onProjects={(reset) => {
          if (reset) {
            host.current?.dispose();
            host.current = undefined;
          }
          setProject(undefined);
          void catalogue();
        }}
      />
    );
  return (
    <div className="app-shell flex h-dvh min-h-0 flex-col overflow-clip bg-background">
      <header className="shrink-0 border-b border-border h-16 flex items-center px-6 gap-5">
        <div className="brand flex items-center gap-2.5">
          <Icon name="stack" />
          <strong>Token Workbench</strong>
        </div>
        <span className="text-caption ml-auto text-muted-foreground">
          Browser local
        </span>
      </header>
      <main className="mx-auto w-full max-w-3xl px-7 py-10 overflow-auto">
        {
          <>
            <h1>Projects in this browser</h1>
            <p className="text-muted-foreground mt-3">
              Applied work is retained automatically. Keep independent backups:
              browser storage can be cleared or become unavailable.
            </p>
            {entries === undefined ? (
              <p role="status" className="my-5">
                {error
                  ? "Projects unavailable. Existing browser data is unchanged."
                  : "Loading projects…"}
              </p>
            ) : entries.length === 0 ? (
              <p className="my-5">No projects retained in this browser.</p>
            ) : (
              <ul className="my-6 space-y-3">
                {entries.map((entry) => (
                  <li
                    key={entry.rowKey}
                    className="border border-border rounded-md p-4"
                  >
                    {entry.status === "supported" ? (
                      <>
                        <Button
                          disabled={pending || retainedId !== null || !!unknown}
                          onClick={() => void open(entry.id)}
                        >
                          {entry.name || "(unnamed project)"}
                        </Button>
                        <p className="text-caption text-muted-foreground mt-2">
                          {entry.tokens} tokens · {entry.groups} groups
                        </p>
                      </>
                    ) : (
                      <p>Project unavailable: {entry.reason}</p>
                    )}
                    <p className="text-caption mt-2 wrap-anywhere">
                      Identity: {JSON.stringify(entry.id)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            {error && entries === undefined && (
              <Button onClick={() => void catalogue()}>
                Retry reading projects
              </Button>
            )}
            <section className="mt-8">
              <h2 className="mb-3">Restore backup</h2>
              <label className="text-caption block">
                Project backup file
                <input
                  className="block mt-3 max-w-full"
                  type="file"
                  accept=".json,application/json"
                  disabled={
                    pending ||
                    retainedId !== null ||
                    !!unknown ||
                    entries === undefined
                  }
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    selectedBackupFile.current = file;
                    if (file.size > 16777216) {
                      setError(
                        "Backup admission refused: " +
                          file.size +
                          " bytes exceeds 16777216 bytes.",
                      );
                      return;
                    }
                    setPending(true);
                    setError("");
                    try {
                      setPreview(
                        await host.current!.call("stageBackup", {
                          bytes: await file.arrayBuffer(),
                        }),
                      );
                    } catch (e) {
                      setError(
                        e instanceof Error
                          ? e.message
                          : "Backup could not be read. Browser data is unchanged.",
                      );
                    } finally {
                      setPending(false);
                      event.target.value = "";
                    }
                  }}
                />
              </label>
            </section>
            <form
              className="mt-8"
              onSubmit={(e) => {
                e.preventDefault();
                void create();
              }}
            >
              <h2 className="mb-4">New project</h2>
              <Field>
                Project name
                <Input
                  ref={nameRef}
                  value={name}
                  disabled={
                    pending ||
                    retainedId !== null ||
                    !!unknown ||
                    entries === undefined
                  }
                  onChange={(e) => setName(e.target.value)}
                  aria-describedby="project-error"
                  aria-invalid={!!error}
                />
              </Field>
              <Button
                type="submit"
                variant="default"
                disabled={
                  pending ||
                  retainedId !== null ||
                  !!unknown ||
                  entries === undefined
                }
              >
                {pending ? "Retaining project…" : "Create project"}
              </Button>
            </form>
          </>
        }
        {pending &&
          activeMutation.current &&
          !unknown &&
          retainedId === null && (
            <section role="status" className="text-caption mt-4">
              <p>Retention or preparation pending. Inputs are preserved.</p>
              <Button onClick={() => void check()}>
                Check retained result
              </Button>
            </section>
          )}
        {retainedId !== null && (
          <section
            role="status"
            className="text-caption border border-border rounded p-3 mt-5"
          >
            <p>
              The project is retained. Entered input is preserved while reading
              is unavailable; creation will not be repeated.
            </p>
            <Button
              disabled={pending}
              onClick={() => {
                setPending(true);
                void recoverCreated(retainedId).finally(() =>
                  setPending(false),
                );
              }}
            >
              Retry reading project
            </Button>
          </section>
        )}
        {unknown && (
          <section
            role="status"
            className="text-caption border border-error-border rounded p-3 mt-5"
          >
            <p>
              Retained result unknown. Entered name is preserved; do not repeat
              creation.
            </p>
            <Button disabled={pending} onClick={() => void check()}>
              Check retained result
            </Button>
            <Button disabled={pending} onClick={() => setLeaving(true)}>
              Review before leaving
            </Button>
          </section>
        )}
        <p id="project-error" role="alert" className="text-destructive mt-4">
          {error}
        </p>
        <p role="status" className="text-caption mt-4">
          {notice}
        </p>
      </main>
      <Dialog.Root open={leaving} onOpenChange={setLeaving}>
        <DialogContent initialFocus={() => stay.current}>
          <Dialog.Title>Review before leaving</Dialog.Title>
          <Dialog.Description>
            An issued write may already be retained. Leaving discards session
            input and never rolls back retained data.
          </Dialog.Description>
          <div className="dialog-actions flex justify-end gap-3 mt-6">
            <Button ref={stay} onClick={() => setLeaving(false)}>
              Stay here
            </Button>
            <Button
              onClick={() => {
                host.current?.fence();
                host.current = undefined;
                setUnknown(undefined);
                setRetainedId(null);
                setName("");
                setLeaving(false);
                void catalogue();
              }}
            >
              Leave
            </Button>
          </div>
        </DialogContent>
      </Dialog.Root>
      {preview && host.current && (
        <RestoreDialog
          restage={async () => {
            if (!selectedBackupFile.current)
              throw Error("Select a project backup file again.");
            return host.current!.call("stageBackup", {
              bytes: await selectedBackupFile.current.arrayBuffer(),
            });
          }}
          host={host.current}
          initial={preview}
          onCancel={(reset) => {
            if (reset) {
              host.current?.dispose();
              host.current = undefined;
            }
            setPreview(undefined);
            void catalogue();
          }}
          onOpen={(id) => {
            setPreview(undefined);
            void open(id);
          }}
        />
      )}
    </div>
  );
}
