import type { HistoryDirection, HistoryState } from "@application/retention/history";
import { HistoryControls, HistoryDescriptions } from "./components/HistoryControls";
import type { Ref } from "react";
import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";
import { ApplicationHeader } from "@presentation/components/ApplicationHeader/ApplicationHeader";
export function WorkbenchHeader({ compact, projectName, busy, onProjectsClick, onNavigation, onBack, navigationRef, history = {}, historyReason, onTraverse = () => {} }: { compact: boolean; projectName: string; busy: boolean; onProjectsClick: () => void; onNavigation: () => void; onBack?: () => void; history?: HistoryState; historyReason?: string; onTraverse?: (direction: HistoryDirection) => void; navigationRef?: Ref<HTMLButtonElement> }) {
  return <><div className="workbench-header shrink-0"><ApplicationHeader compactBrand navigation={onBack ? <Button onClick={onBack}>Back</Button> : compact && <Button ref={navigationRef} variant="ghost" aria-label="Open project navigation" onClick={onNavigation}><Icon name="menu" />Browse</Button>} context={projectName || "(unnamed project)"} actions={<><HistoryControls history={history} reason={historyReason} onTraverse={onTraverse} /><Button disabled={busy} onClick={onProjectsClick}>Projects</Button></>} /></div><HistoryDescriptions history={history} reason={historyReason} /></>;
}
