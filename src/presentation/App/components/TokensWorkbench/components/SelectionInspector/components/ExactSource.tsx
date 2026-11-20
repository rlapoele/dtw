import { useEffect, useRef, useState } from "react";
import { InspectorSection } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/InspectorSection";
import { Button } from "@presentation/ui/button";
export function ExactSource({
  revision,
  request,
  expanded,
  onToggle,
  title = "All authored data",
}: {
  revision: string;
  request: () => Promise<string>;
  expanded?: boolean;
  onToggle?: () => void;
  title?: string;
}) {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = expanded ?? localOpen;
  const requestRef = useRef(request);
  requestRef.current = request;
  const [text, setText] = useState<string>(),
    [error, setError] = useState(""),
    [preparing, setPreparing] = useState(false);
  const generation = useRef(0),
    open = useRef(false);
  async function prepare() {
    const current = ++generation.current;
    setPreparing(true);
    setError("");
    setText(undefined);
    try {
      const source = await requestRef.current();
      if (open.current && current === generation.current) setText(source);
    } catch {
      if (open.current && current === generation.current)
        setError(
          "Source unavailable. Applied data and drafts are unchanged.",
        );
    } finally {
      if (current === generation.current) setPreparing(false);
    }
  }
  useEffect(() => {
    open.current = isOpen;
    if (isOpen) void prepare();
    else { setPreparing(false); setText(undefined); setError(""); }
    return () => { open.current = false; generation.current++; };
  }, [isOpen, revision]);
  return (
    <InspectorSection title={title} open={isOpen} onToggle={onToggle ?? (() => setLocalOpen(value => !value))}>
        <p className="helper text-muted-foreground">Opening very large exact source may briefly pause this view.</p>
        <p className="text-caption my-3 wrap-anywhere">
          {title === "All authored data" ? "Applied data" : "Derived resolution data"} · Revision {revision} · Read only
        </p>
        {preparing && <p role="status">Preparing source…</p>}
        {error && (
          <div role="status">
            <p>{error}</p>
            <Button onClick={() => void prepare()}>Retry source</Button>
          </div>
        )}
        {text !== undefined && (
          <pre
            tabIndex={0}
            aria-label={title === "All authored data" ? "Complete applied authored data" : "Raw derived resolution data"}
            className="exact-source text-caption my-3"
          >
            {text}
          </pre>
        )}
    </InspectorSection>
  );
}
