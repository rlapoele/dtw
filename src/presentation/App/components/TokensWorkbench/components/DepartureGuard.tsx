import { Button } from "@presentation/ui/button";

import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/ui/dialog-content";

export function DepartureGuard({
  historyIntent,
  open,
  unknown,
  busy,
  onStay,
  onDiscard,
  onApply,
  finalFocus,
}: {
  historyIntent?: {direction: "undo" | "redo"; label: string};
  open: boolean;
  unknown: boolean;
  busy: boolean;
  onStay: () => void;
  onDiscard: () => void;
  onApply?:()=>void;
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
          {historyIntent ? `Discard unapplied changes and ${historyIntent.direction}?` : unknown ? "Review before leaving" : "Discard unapplied changes?"}
        </Dialog.Title>
        <Dialog.Description>
          {historyIntent ? `Session input will be discarded. Then ${historyIntent.direction}: ${historyIntent.label}. No draft value will be applied.` : unknown
            ? "An issued write may already be retained. Leaving discards session input; it does not roll back applied work."
            : "Session drafts and unfinished form input will be discarded. Applied data is unchanged."}
        </Dialog.Description>
        <div className="dialog-actions justify-end flex gap-2.5 mt-6">
          <Dialog.Close render={<Button />}>
            {unknown ? "Stay here" : "Keep editing"}
          </Dialog.Close>
          {onApply&&<Button disabled={busy} onClick={onApply}>Apply and leave</Button>}
          <Button variant="default" disabled={busy} onClick={onDiscard}>
            {historyIntent ? `Discard and ${historyIntent.direction}` : unknown ? "Leave project" : "Discard draft"}
          </Button>
        </div>
      </DialogContent>
    </Dialog.Root>
  );
}
