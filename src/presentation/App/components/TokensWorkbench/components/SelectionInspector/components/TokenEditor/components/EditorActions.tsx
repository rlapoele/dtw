import { Button } from "@presentation/ui/button";

export function EditorActions({
  cancelDisabled,
  applyDisabled,
  applyLabel,
  onCancel,
  onApply,
}: {
  cancelDisabled: boolean;
  applyDisabled: boolean;
  applyLabel: string;
  onCancel: () => void;
  onApply: () => void;
}) {
  return (
    <div className="editor-actions flex justify-end gap-2 mt-3 mb-2 bg-surface pt-1 pb-3">
      <Button disabled={cancelDisabled} onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="default" disabled={applyDisabled} onClick={onApply}>
        {applyLabel}
      </Button>
    </div>
  );
}
