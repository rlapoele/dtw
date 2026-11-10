import { Dialog } from "@base-ui/react/dialog";
/** Ordinary modal surface; navigation retains its distinct drawer geometry. */
export function DialogContent({ className, ...props }: Dialog.Popup.Props) {
  const owned =
    "dialog-popup fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background border border-border p-7 overflow-auto";
  return (
    <Dialog.Portal>
      <Dialog.Backdrop
        forceRender
        className="dialog-backdrop fixed inset-0 z-40 bg-scrim"
      />
      <Dialog.Popup
        {...props}
        className={(state) =>
          `${owned} ${(typeof className === "function" ? className(state) : className) ?? ""}`
        }
      />
    </Dialog.Portal>
  );
}
