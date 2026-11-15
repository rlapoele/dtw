import type { HistoryDirection, HistoryState } from "@application/retention/history";
import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";
export function HistoryControls({history, reason, onTraverse}: {history: HistoryState; reason?: string; onTraverse(direction: HistoryDirection): void}) {
  return <>{(["undo", "redo"] as const).map(direction => {
    const name = direction === "undo" ? "Undo" : "Redo", action = history[direction];
    return <Button key={direction} className="min-h-11 min-w-11" data-history={direction} disabled={!!reason || !action} aria-label={action ? `${name}: ${action.label}` : name} aria-describedby={`history-${direction}-description`} onClick={() => onTraverse(direction)}><Icon name={direction} /><span className="hidden sm:inline">{name}</span></Button>;
  })}</>;
}
export function HistoryDescriptions({history, reason}: {history: HistoryState; reason?: string}) {
  return <div className="shrink-0 border-b border-border px-5 py-2 text-caption text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 wrap-anywhere">{(["undo", "redo"] as const).map(direction => <p key={direction} id={`history-${direction}-description`}>{direction === "undo" ? "Undo" : "Redo"}: {reason ?? history[direction]?.label ?? `No changes to ${direction}`}</p>)}</div>;
}
