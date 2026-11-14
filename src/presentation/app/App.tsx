import { readBackupFile } from "@presentation/host/backup-file";
import { useRef, useState } from "react";
import type { RestorePreview } from "@presentation/host/protocol";
import { useWorkbenchHost } from "@presentation/app/useWorkbenchHost";
import { useProjects } from "@presentation/projects/useProjects";

import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/ui/dialog-content";

import { RestoreDialog } from "@presentation/project-backup/RestoreDialog/RestoreDialog";

import { Workbench } from "../workbench/Workbench";

import { WorkerWorkbenchHost } from "@presentation/host/worker-client";
import type { WorkbenchHost } from "@presentation/host/protocol";

import { Button } from "@presentation/ui/button";
import { ProjectsScreen } from "@presentation/projects/ProjectsScreen";

export function App({
  createHost = () => new WorkerWorkbenchHost(),
}: { createHost?: () => WorkbenchHost } = {}) {
  const { host, ensure, reset } = useWorkbenchHost(createHost);
  const selectedBackupFile = useRef<File | undefined>(undefined),
    stay = useRef<HTMLButtonElement>(null);
  const [preview, setPreview] = useState<RestorePreview>(),
    [leaving, setLeaving] = useState(false);
  const {
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
  } = useProjects(host, ensure, reset, !!preview);
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
    <ProjectsScreen
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
            setPreview(undefined);
            void open(id);
          }}
        />
      )}
    />
  );
}
