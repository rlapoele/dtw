import { useEffect, useRef } from "react";
import { InspectorToggle } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/InspectorToggle";
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
      <div className={`token-inspector-toggle absolute z-20 mobile:hidden ${inspectorExpanded ? "top-4 left-4" : "top-1.5 left-1.5"}`}>
        <InspectorToggle expanded={inspectorExpanded} onToggle={onToggle} />
      </div>
      {editor.readUnavailable && inspectorExpanded && (
        <p role="status" className="notification notification-warning text-caption wrap-anywhere m-4">
          {readFailure || props.targetUnavailable || "Inspection unavailable"}
        </p>
      )}
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
