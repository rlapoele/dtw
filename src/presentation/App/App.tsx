import { readBackupFile } from "@hosts/browser/backup-file";
import { useEffect, useRef, useState } from "react";
import type { RestorePreview } from "@hosts/browser/protocol";
import { useWorkbenchHost } from "@presentation/App/hooks/useWorkbenchHost";
import { useStoragePersistence } from "@presentation/App/hooks/useStoragePersistence";
import { useProjects } from "@presentation/App/components/Projects/hooks/useProjects";

import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/ui/dialog-content";

import { RestoreDialog } from "@presentation/App/components/Projects/components/RestoreDialog/RestoreDialog";

import { Workbench } from "@presentation/App/components/Workbench/Workbench";

import { WorkerWorkbenchHost } from "@hosts/browser/worker-client";
import type { WorkbenchHost } from "@hosts/browser/protocol";

import { Button } from "@presentation/ui/button";
import type { ProjectsView } from "@presentation/App/components/Projects/hooks/useProjectsLayout";
import { Projects } from "@presentation/App/components/Projects/Projects";

export function App({
  createHost = () => new WorkerWorkbenchHost(),
}: { createHost?: () => WorkbenchHost } = {}) {
  const storage = useStoragePersistence();
  const { host, ensure, reset } = useWorkbenchHost(createHost);
  const selectedBackupFile = useRef<File | undefined>(undefined),
    stay = useRef<HTMLButtonElement>(null);
  const [preview, setPreview] = useState<RestorePreview>(),
    [leaving, setLeaving] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState<string>();
  const [projectsView, setProjectsView] = useState<ProjectsView>({ scroll: 0, surface: "browse" });
  const {
    download, backupFeedback,
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
  } = useProjects(host, ensure, reset, !!preview, storage.onRetained);
  // Restore completion is an explicit request, issued only by a render after
  // preview disposal. Normal Open keeps its conflicting-preview gate intact.
  useEffect(() => {
    if (preview || restoreOpen === undefined) return;
    setRestoreOpen(undefined);
    void open(restoreOpen);
  }, [preview, restoreOpen]);
  useEffect(() => {
    if (!project) return;
    setProjectsView(view => ({ ...view, selection: { rowKey: entries?.find(entry => entry.status === "supported" && entry.id === project.project.id)?.rowKey ?? project.project.id, status: "supported", id: project.project.id, name: project.project.name, revision: project.revision, tokens: project.tokens, groups: project.groups } }));
  }, [project]);
  useEffect(() => {
    if (!entries) return;
    setProjectsView(view => {
      const current = entries.find(entry => entry.rowKey === view.selection?.rowKey);
      return current ? { ...view, selection: current } : view;
    });
  }, [entries]);
  if (project && host.current)
    return (
      <Workbench
        key={project.project.id}
        onProject={(id) => void open(id)}
        host={host.current}
        initial={project}
        onProjects={returnToProjects}
      />
    );
  return (
    <Projects
      storageStatus={storage.status} onRetryStorage={storage.retry}
      view={projectsView} onView={setProjectsView} onDownload={entry => void download(entry)} backupFeedback={backupFeedback} hasPreview={!!preview}
      entries={entries}
      error={error}
      notice={notice}
      name={name}
      pending={pending}
      activeMutation={activeMutation.current}
      retained={retainedId !== null}
      unknown={!!unknown}
      nameRef={nameRef}
      onOpen={(id) => void open(id)}
      onRetryCatalogue={() => void catalogue()}
      onBackupChange={async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        selectedBackupFile.current = file;
        const next = await stageBackup(file);
        if (next) setPreview(next);
        event.target.value = "";
      }}
      onNameChange={setName}
      onCreate={() => void create()}
      onCheck={() => void check()}
      onRetryReading={retryCreated}
      onReviewLeaving={() => setLeaving(true)}
      departureDialog={
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
                leaveUnknown();
                setLeaving(false);
              }}
            >
              Leave
            </Button>
          </div>
        </DialogContent>
      </Dialog.Root>
      }
      restoreDialog={preview && host.current && (
        <RestoreDialog
          onRetained={storage.onRetained}
          restage={async () => {
            if (!selectedBackupFile.current)
              throw Error("Select a project backup file again.");
            return host.current!.call("stageBackup", {
              bytes: await readBackupFile(selectedBackupFile.current),
            });
          }}
          host={host.current}
          initial={preview}
          onCancel={(shouldReset) => {
            setPreview(undefined);
            returnToProjects(shouldReset);
          }}
          onOpen={(id) => {
            setRestoreOpen(id);
            setPreview(undefined);
          }}
        />
      )}
    />
  );
}
