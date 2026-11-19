import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/ui/dialog-content";
import { Button } from "@presentation/ui/button";
import { CreateProjectForm } from "@presentation/App/components/ProjectsWorkbench/components/CreateProjectDialog/components/CreateProjectForm";

type CreationForm = Omit<ComponentProps<typeof CreateProjectForm>, "onCancel" | "closeBlocked">;

export function CreateProjectDialog({ open, onClose, onDiscard, returnFocus, form, recovery, departureDialog, blocked }: {
  open: boolean;
  onClose: () => void;
  onDiscard: () => void;
  returnFocus: () => HTMLElement | null;
  form: CreationForm;
  recovery: ReactNode;
  departureDialog: ReactNode;
  blocked: boolean;
}) {
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const keepEditing = useRef<HTMLButtonElement>(null);
  const focusName = () => typeof form.nameRef === "object" ? form.nameRef?.current ?? null : null;
  function requestClose() {
    if (blocked) return;
    if (form.name !== "" || form.description !== "") setConfirmDiscard(true);
    else onClose();
  }
  return <Dialog.Root open={open} onOpenChange={next => { if (!next) requestClose(); }}>
    <DialogContent initialFocus={focusName} finalFocus={returnFocus}>
      <Dialog.Title className="dialog-title mb-3">New project</Dialog.Title>
      <Dialog.Description className="text-caption text-muted-foreground">Create a project retained in this browser. A name is required; descriptions are optional.</Dialog.Description>
      {recovery}
      <CreateProjectForm {...form} closeBlocked={blocked} onCancel={requestClose} />
      <Dialog.Root open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <DialogContent initialFocus={keepEditing} finalFocus={focusName}>
          <Dialog.Title className="dialog-title mb-3">Discard this project draft?</Dialog.Title>
          <Dialog.Description className="text-caption text-muted-foreground">Your name and description have not been saved.</Dialog.Description>
          <div className="dialog-actions flex justify-end gap-3 mt-6">
            <Button ref={keepEditing} onClick={() => setConfirmDiscard(false)}>Keep editing</Button>
            <Button variant="default" onClick={() => { onDiscard(); setConfirmDiscard(false); onClose(); }}>Discard draft</Button>
          </div>
        </DialogContent>
      </Dialog.Root>
      {departureDialog}
    </DialogContent>
  </Dialog.Root>;
}
