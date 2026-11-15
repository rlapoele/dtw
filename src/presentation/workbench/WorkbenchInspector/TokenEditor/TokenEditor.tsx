import { InspectorHeader } from "../InspectorHeader";
import { useTokenEditor } from "./useTokenEditor";
import { TokenEditorContent } from "./TokenEditorContent";
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
        feedback={editor.feedback}
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
