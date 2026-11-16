import { InspectorToggle } from "./InspectorToggle";
export function InspectorHeader({
  readFailure,
  targetUnavailable,
  editable,
  selected,
  inspectorExpanded,
  onToggle,
}: {
  readFailure: string;
  targetUnavailable: string;
  editable: boolean;
  selected: boolean;
  inspectorExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="inspector-header shrink-0 flex items-center justify-between gap-2 p-1.5 min-w-0">
      {(readFailure || targetUnavailable || !editable || !selected) && inspectorExpanded && (
        <span className="inspector-header-status text-caption text-muted-foreground wrap-anywhere">
          {readFailure || targetUnavailable || (selected ? "Inspection only" : "Select content")}
        </span>
      )}
      <InspectorToggle expanded={inspectorExpanded} onToggle={onToggle} />
    </div>
  );
}
