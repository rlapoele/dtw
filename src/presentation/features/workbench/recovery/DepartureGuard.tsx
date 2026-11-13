import { Button } from "@presentation/components/ui/button";

import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/components/ui/dialog-content";

export function DepartureGuard({
  open,
  unknown,
  busy,
  onStay,
  onDiscard,
  finalFocus,
}: {
  open: boolean;
  unknown: boolean;
  busy: boolean;
  onStay: () => void;
  onDiscard: () => void;
  finalFocus: () => HTMLElement | null;
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) onStay();
      }}
    >
      <DialogContent finalFocus={finalFocus}>
        <Dialog.Title>
          {unknown ? "Review before leaving" : "Discard unapplied changes?"}
        </Dialog.Title>
        <Dialog.Description>
          {unknown
            ? "An issued write may already be retained. Leaving discards session input; it does not roll back applied work."
            : "Session drafts and unfinished form input will be discarded. Applied data is unchanged."}
        </Dialog.Description>
        <div className="dialog-actions justify-end flex gap-2.5 mt-6">
          <Dialog.Close render={<Button />}>
            {unknown ? "Stay here" : "Keep editing"}
          </Dialog.Close>
          <Button variant="default" disabled={busy} onClick={onDiscard}>
            {unknown ? "Leave project" : "Discard draft"}
          </Button>
        </div>
      </DialogContent>
    </Dialog.Root>
  );
}
