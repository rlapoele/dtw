import type { ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@presentation/components/ui/button";
import { Icon } from "@presentation/components/ui/icon";

export function NavigationPane({
  expanded,
  onToggle,
  children,
}: {
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <nav
      className="sidebar flex min-h-0 flex-col overflow-hidden border-r border-border bg-surface"
      aria-label="Project groups"
    >
      <Button
        variant="ghost"
        size="pane"
        className="pane-toggle sidebar-toggle"
        aria-label={
          expanded ? "Collapse project groups" : "Expand project groups"
        }
        aria-expanded={expanded}
        onClick={() => onToggle()}
      >
        {expanded ? (
          <Icon name="chevron-left" />
        ) : (
          <Icon name="chevron-right" />
        )}
        <span>Project groups</span>
      </Button>
      <div
        hidden={!expanded}
        className="sidebar-content flex-1 px-3 pt-5.5 pb-5 flex flex-col min-h-0 overflow-auto"
      >
        {children}
      </div>
    </nav>
  );
}

export function NavigationDrawer({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="navigation-backdrop fixed inset-0 z-30 bg-scrim" />
        <Dialog.Popup className="navigation-drawer fixed top-0 bottom-0 left-0 z-35 border-r border-border bg-background flex flex-col overflow-hidden">
          <div className="navigation-heading border-b border-border px-4 py-3 flex items-center justify-between gap-3">
            <Dialog.Title>Project navigation</Dialog.Title>
            <Dialog.Close
              render={<Button variant="ghost" size="icon" />}
              aria-label="Close project navigation"
            >
              <Icon name="close" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Browse groups. Closing preserves drafts.
          </Dialog.Description>
          <nav className="sidebar-content flex-1 px-3 py-6 overflow-auto">
            {children}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
