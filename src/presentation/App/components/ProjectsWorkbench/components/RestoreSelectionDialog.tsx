import type { ChangeEventHandler, ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/ui/dialog-content";
import { Button } from "@presentation/ui/button";
import { Field } from "@presentation/ui/field";

export function RestoreSelectionDialog({ open, pending, onClose, onFileChange, feedback, returnFocus, handingOff }: {
  open: boolean;
  handingOff: boolean;
  pending: boolean;
  onClose: () => void;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  feedback: ReactNode;
  returnFocus: () => HTMLElement | null;
}) {
  return <Dialog.Root open={open} onOpenChange={next => { if (!next && !pending) onClose(); }}>
    <DialogContent finalFocus={handingOff ? false : returnFocus}>
      <Dialog.Title className="dialog-title mb-3">Restore backup</Dialog.Title>
      <Dialog.Description className="text-caption text-muted-foreground mb-5">Select a project backup to review before restoring. Nothing changes until you confirm.</Dialog.Description>
      <Field>Project backup file
        <input className="block mt-3 max-w-full min-h-9" type="file" accept=".json,application/json" disabled={pending} onChange={onFileChange} />
      </Field>
      {feedback}
      <div className="dialog-actions flex justify-end gap-3 mt-6"><Button disabled={pending} onClick={onClose}>Cancel</Button></div>
    </DialogContent>
  </Dialog.Root>;
}
