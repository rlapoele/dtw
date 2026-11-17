import type { HistoryDirection, HistoryState } from "@application/retention/history";
import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";
export function HistoryControls({history, reason, onTraverse}: {history: HistoryState; reason?: string; onTraverse(direction: HistoryDirection): void}) {
  return <>{(["undo", "redo"] as const).map(direction => {
    const name = direction === "undo" ? "Undo" : "Redo", action = history[direction];
    return <Button key={direction} size="history" data-history={direction} disabled={!!reason || !action} aria-label={action ? `${name}: ${action.label}` : name} className="relative" title={`${name}: ${reason ?? action?.label ?? `No changes to ${direction}`}`} aria-describedby={`history-${direction}-description`} onClick={() => onTraverse(direction)}><Icon name={direction} /><span className="hidden sm:inline">{name}</span><span aria-hidden="true" className="history-count absolute -top-1.5 -right-1.5 min-w-4.5 min-h-4.5 px-1 rounded-full border-hairline border-primary bg-primary text-primary-foreground flex items-center justify-center">{history[`${direction}Count`]}</span></Button>;
  })}</>;
}
export function HistoryDescriptions({history, reason}: {history: HistoryState; reason?: string}) {
  return <div className="sr-only">{(["undo", "redo"] as const).map(direction => <p key={direction} id={`history-${direction}-description`}>{direction === "undo" ? "Undo" : "Redo"}: {reason ?? history[direction]?.label ?? `No changes to ${direction}`}</p>)}</div>;
}
