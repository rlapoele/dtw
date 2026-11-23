import { useState } from "react";
import {
  createColorLiteral,
  type ColorLiteralValue,
  type ColorSpace,
} from "@domain/color-literal";
import { ColorEditor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/ColorEditor/ColorEditor";
import {
  baseline,
  changeView,
  type DraftSession,
} from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/state/editor-session";
export function RampColorFields({
  value,
  space,
  disabled,
  onChange,
  onValidity,
  onViewChange,
}: {
  value: ColorLiteralValue;
  space?: ColorSpace;
  disabled?: boolean;
  onChange: (value: ColorLiteralValue) => void;
  onValidity: (valid: boolean) => void;
  onViewChange?: (space: ColorSpace) => void;
}) {
  const [session, setSession] = useState(() => {
      const s = baseline(value);
      return space ? changeView(s, space) : s;
    }),
    [error, setError] = useState("");
  function change(next: DraftSession) {
    setSession(next);
    try {
      if (next.hexInvalid || next.byteInvalid)
        throw Error("Complete the color entry.");
      const color = createColorLiteral(next.literal);
      onValidity(true);
      setError("");
      if (next.viewSpace !== session.viewSpace) onViewChange?.(next.viewSpace);
      if (JSON.stringify(color) !== JSON.stringify(value)) onChange(color);
    } catch (e) {
      onValidity(false);
      setError(e instanceof Error ? e.message : "Invalid color");
    }
  }
  return (
    <>
      <ColorEditor
        session={session}
        onChange={change}
        onError={setError}
        readOnly={disabled}
      />
      {error && <p role="alert">{error}</p>}
    </>
  );
}
