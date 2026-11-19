import type { HistoryDirection, HistoryState } from "@application/retention/history";
import { HistoryControls, HistoryDescriptions } from "@presentation/App/components/TokensWorkbench/components/TokensHeader/components/HistoryControls";
import type { Ref } from "react";
import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";
import { ApplicationHeader } from "@presentation/App/components/ApplicationHeader/ApplicationHeader";
export function TokensHeader({ compact, projectName, busy, onProjectsClick, onNavigation, onBack, navigationRef, history = {undoCount: 0, redoCount: 0}, historyReason, onTraverse = () => {} }: { compact: boolean; projectName: string; busy: boolean; onProjectsClick: () => void; onNavigation: () => void; onBack?: () => void; history?: HistoryState; historyReason?: string; onTraverse?: (direction: HistoryDirection) => void; navigationRef?: Ref<HTMLButtonElement> }) {
  return <><div className="workbench-header shrink-0"><ApplicationHeader compactBrand navigation={onBack ? <Button onClick={onBack}>Back</Button> : compact && <Button ref={navigationRef} variant="ghost" aria-label="Open project navigation" onClick={onNavigation}><Icon name="menu" />Browse</Button>} context={
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2">
        <li><a href="./" aria-disabled={busy || undefined} className="inline-flex min-h-9 items-center font-medium text-foreground underline decoration-2 underline-offset-8 aria-disabled:opacity-45" onClick={(event) => {
          if (busy) { event.preventDefault(); return; }
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          onProjectsClick();
        }}>Projects</a></li>
        <li aria-hidden="true">/</li>
        <li className="min-w-0 wrap-anywhere" aria-current="page">{projectName || "(unnamed project)"}</li>
      </ol>
    </nav>
  } actions={<HistoryControls history={history} reason={historyReason} onTraverse={onTraverse} />} /></div><HistoryDescriptions history={history} reason={historyReason} /></>;
}
