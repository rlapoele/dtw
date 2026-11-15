import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";
import { TokenValueComparison, type Feedback } from "@presentation/Workbench/components/WorkbenchInspector/components/TokenValueComparison";
export function InspectorHeader({
  readFailure,
  targetUnavailable,
  editable,
  feedback,
  selected,
  inspectorExpanded,
  onToggle,
}: {
  readFailure: string;
  targetUnavailable: string;
  editable: boolean;
  feedback?: Feedback;
  selected: boolean;
  inspectorExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="inspector-header border-b border-border bg-surface h-11 min-h-11 shrink-0 flex items-center gap-2 pl-3 min-w-0">
      <span className="inspector-region-title flex-1 text-caption leading-3.5 min-w-0 font-medium">
        Inspector
      </span>
      {!readFailure && !targetUnavailable && editable && feedback && (
        <TokenValueComparison feedback={feedback} />
      )}
      {(readFailure || targetUnavailable || !editable || !feedback) && (
        <span className="inspector-header-status text-caption leading-4 text-secondary">
          {readFailure || targetUnavailable
            ? "Unavailable"
            : selected
              ? "Inspection only"
              : "Select content"}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="pane-toggle inspector-toggle"
        aria-label={
          inspectorExpanded ? "Collapse inspector" : "Expand inspector"
        }
        aria-expanded={inspectorExpanded}
        aria-controls="token-inspector-content"
        onClick={() => onToggle()}
      >
        <Icon name="chevron-down" />
      </Button>
    </div>
  );
}
