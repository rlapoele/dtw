import { Button } from "@presentation/components/ui/button";

import type { DiagnosticDisplay } from "@application/retention/diagnostics";

export function ProjectDiagnostics({
  diagnostics,
  onLoad,
  onAllContent,
}: {
  diagnostics?: DiagnosticDisplay;
  onLoad: () => void;
  onAllContent: () => void;
}) {
  return (
    <section className="project-diagnostics text-caption mt-6">
      <details
        onToggle={(event) => {
          if (event.currentTarget.open && !diagnostics) onLoad();
        }}
      >
        <summary>Project diagnostics · namespace and references</summary>
        {diagnostics ? (
          <>
            {diagnostics.total === 0 && (
              <p>No namespace or reference diagnostics.</p>
            )}
            {diagnostics.items.map((item, index) => (
              <pre
                key={index}
                className="whitespace-pre-wrap wrap-anywhere my-3"
              >
                {item}
              </pre>
            ))}
            {!diagnostics.complete && (
              <p role="status">
                Diagnostic display is incomplete. Structural checks remain
                complete; this is not an all-clear result.
              </p>
            )}
          </>
        ) : (
          <p role="status">Preparing diagnostics…</p>
        )}
        <Button onClick={() => onAllContent()}>Inspect all content</Button>
      </details>
    </section>
  );
}
