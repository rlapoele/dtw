import { InspectorHeader } from "@presentation/App/components/TokensWorkbench/components/WorkbenchInspector/components/InspectorHeader";
import { useTokenEditor } from "@presentation/App/components/TokensWorkbench/components/WorkbenchInspector/components/TokenEditor/hooks/useTokenEditor";
import { TokenEditorContent } from "@presentation/App/components/TokensWorkbench/components/WorkbenchInspector/components/TokenEditor/components/TokenEditorContent";
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
      <InspectorHeader
        readFailure={readFailure}
        targetUnavailable={props.targetUnavailable ?? ""}
        editable={editor.editable}
        selected
        inspectorExpanded={inspectorExpanded}
        onToggle={onToggle}
      />
      <div
        id="token-inspector-content"
        className="inspector-content flex-1 bg-surface overflow-auto min-h-0"
        hidden={!inspectorExpanded}
      >
        <TokenEditorContent editor={editor} />
      </div>
    </>
  );
}
