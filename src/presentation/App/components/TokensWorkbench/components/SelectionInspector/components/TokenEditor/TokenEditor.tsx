import { InspectorToggle } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/InspectorToggle";
import { useTokenEditor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor";
import { TokenEditorContent } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenEditorContent";
export function TokenEditor({
  inspectorExpanded,
  onToggle,
  readFailure,
  ...props
}: Parameters<typeof useTokenEditor>[0] & {
  inspectorExpanded: boolean;
  onToggle: () => void;
  readFailure: string;
}) {
  const editor = useTokenEditor(props);
  return (
    <>
      <div className="token-inspector-toggle absolute top-4 left-4 z-20 touch:hidden">
        <InspectorToggle expanded={inspectorExpanded} onToggle={onToggle} />
      </div>
      {editor.readUnavailable && inspectorExpanded && (
        <p role="status" className="notification notification-warning text-caption wrap-anywhere m-4">
          {readFailure || props.targetUnavailable || "Inspection unavailable"}
        </p>
      )}
      <div
        id="token-inspector-content"
        className="inspector-content flex-1 bg-surface overflow-auto min-h-0"
        inert={!inspectorExpanded}
        aria-hidden={!inspectorExpanded}
      >
        <TokenEditorContent editor={editor} />
      </div>
    </>
  );
}
