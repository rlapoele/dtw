import { useRef, useState } from "react";
import { Button } from "@presentation/components/ui/button";
export function ExactSource({
  revision,
  request,
}: {
  revision: string;
  request: () => Promise<string>;
}) {
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
      const source = await request();
      if (open.current && current === generation.current) setText(source);
    } catch {
      if (open.current && current === generation.current)
        setError(
          "Authored data unavailable. Applied data and drafts are unchanged.",
        );
    } finally {
      if (current === generation.current) setPreparing(false);
    }
  }
  return (
    <div className="mt-4">
      <p className="helper text-muted-foreground">
        Opening very large exact source may briefly pause this view.
      </p>
      <details
        onToggle={(event) => {
          open.current = event.currentTarget.open;
          if (open.current) void prepare();
          else {
            generation.current++;
            setPreparing(false);
            setText(undefined);
          }
        }}
      >
        <summary>All authored data</summary>
        <p className="text-caption my-3 wrap-anywhere">
          Applied data · Revision {revision} · Read only
        </p>
        {preparing && <p role="status">Preparing authored data…</p>}
        {error && (
          <div role="status">
            <p>{error}</p>
            <Button onClick={() => void prepare()}>Retry authored data</Button>
          </div>
        )}
        {text !== undefined && (
          <pre
            tabIndex={0}
            aria-label="Complete applied authored data"
            className="exact-source text-caption my-3"
          >
            {text}
          </pre>
        )}
      </details>
    </div>
  );
}
