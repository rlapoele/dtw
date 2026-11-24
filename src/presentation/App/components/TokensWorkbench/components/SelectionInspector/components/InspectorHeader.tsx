import { InspectorToggle } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/InspectorToggle";
export function InspectorHeader({
  title = "INSPECTOR",
  readFailure,
  targetUnavailable,
  editable,
  selected,
  inspectorExpanded,
  onToggle,
}: {
  title?: string;
  readFailure: string;
  targetUnavailable: string;
  editable: boolean;
  selected: boolean;
  inspectorExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="inspector-header shrink-0 flex items-center gap-2 p-1.5 min-w-0">
      <InspectorToggle expanded={inspectorExpanded} onToggle={onToggle} />
        <div aria-hidden={!inspectorExpanded} className="inspector-heading-label min-w-0">
          <h2 className="text-caption font-semibold text-muted-foreground">{title}</h2>
          {(readFailure || targetUnavailable || (selected && !editable)) && (
            <p className="inspector-header-status text-caption text-muted-foreground wrap-anywhere">
              {readFailure || targetUnavailable || "Inspection only"}
            </p>
          )}
        </div>
    </div>
  );
}
