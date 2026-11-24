import { useEffect, useRef } from "react";
import { InspectorHeader } from "@presentation/App/components/TokensWorkbench/components/InspectorHeader";
import { useTokenEditor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor";
import { TokenEditorContent } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenEditorContent";
export function TokenEditor({
  focusApplied,
  onAppliedFocused,
  inspectorExpanded,
  onToggle,
  readFailure,
  ...props
}: Parameters<typeof useTokenEditor>[0] & {
  focusApplied?: boolean;
  onAppliedFocused?: () => void;
  inspectorExpanded: boolean;
  onToggle: () => void;
  readFailure: string;
}) {
  const editor = useTokenEditor(props);
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusApplied) {
      const button = content.current?.querySelector<HTMLButtonElement>("[data-applied-summary] button");
      if (button?.getAttribute("aria-expanded") === "false") button.click();
      if (button) { button.focus(); onAppliedFocused?.(); }
    }
  }, [focusApplied]);
  return (
    <>
      <InspectorHeader
        title={`${editor.token.definition?.type ?? "Unassigned"} token`.toUpperCase()}
        readFailure={editor.readUnavailable ? readFailure || "Inspection unavailable" : ""}
        targetUnavailable={props.targetUnavailable ?? ""}
        editable={editor.editable}
        selected
        inspectorExpanded={inspectorExpanded}
        onToggle={onToggle}
      />
      <div
        ref={content}
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
