import type { ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";

export function TokenNavigationPane({
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
      className="sidebar flex min-h-0 flex-col overflow-hidden border-r-hairline border-border bg-surface"
      aria-label="Token navigation"
    >
      <div className="sidebar-header shrink-0 flex items-center gap-2 p-1.5 min-w-0">
        <h2 aria-hidden={!expanded} className="sidebar-heading flex-1 pl-2.5 text-caption font-semibold text-muted-foreground">NAVIGATION</h2>
        <Button
          variant="ghost"
          size="icon"
          className="sidebar-toggle ml-auto"
          aria-label={
            expanded ? "Collapse token navigation" : "Expand token navigation"
          }
          aria-expanded={expanded}
          onClick={() => onToggle()}
        >
          <Icon name="chevron-right" className={`panel-motion-chevron ${expanded ? "rotate-180" : "rotate-0"}`} />
        </Button>
      </div>
      <div
        inert={!expanded}
        aria-hidden={!expanded}
        className="sidebar-content flex-1 p-6 mobile:p-4 flex flex-col min-h-0 overflow-auto"
      >
        {children}
      </div>
    </nav>
  );
}

export function TokenNavigationDrawer({
  finalFocus,
  open,
  onOpenChange,
  children,
}: {
  finalFocus?: () => HTMLElement | null | false;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="navigation-backdrop fixed inset-0 z-30 bg-scrim" />
        <Dialog.Popup finalFocus={finalFocus} className="navigation-drawer shadow-drawer fixed top-0 bottom-0 left-0 z-35 border-r-hairline border-border bg-background flex flex-col overflow-hidden">
          <div className="navigation-heading shrink-0 border-b-hairline border-border px-4 py-3 flex items-center justify-between gap-3">
            <Dialog.Title>Project navigation</Dialog.Title>
            <Dialog.Close
              render={<Button variant="ghost" size="icon" />}
              aria-label="Close project navigation"
            >
              <Icon name="close" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Browse tokens and groups. Closing preserves drafts.
          </Dialog.Description>
          <nav className="sidebar-content flex-1 min-h-0 p-6 mobile:p-4 overflow-auto">
            {children}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
