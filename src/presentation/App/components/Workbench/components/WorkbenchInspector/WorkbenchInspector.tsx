import { GroupInspector } from "@presentation/App/components/Workbench/components/WorkbenchInspector/components/GroupInspector/GroupInspector";
import { InspectorHeader } from "@presentation/App/components/Workbench/components/WorkbenchInspector/components/InspectorHeader";
import type { Selection } from "@presentation/App/components/Workbench/hooks/useProjectReadback";
import type { ProjectContext } from "@application/retention/projections";
import type { ProjectHeader } from "@hosts/browser/protocol";
import { Button } from "@presentation/ui/button";
import type { RefObject, ReactNode } from "react";
export function WorkbenchInspector({
  children, surfaceRef, hidden, back,
  selection,
  context,
  groupLabels,
  header,
  inspectorExpanded,
  onToggle,
  readFailure,
  targetUnavailable,
  requestSource,
}: {
  children: ReactNode;
  surfaceRef?: RefObject<HTMLElement | null>;
  hidden?: boolean;
  back?: () => void;
  selection: Selection;
  context?: ProjectContext;
  groupLabels: Map<string, string>;
  header: ProjectHeader;
  inspectorExpanded: boolean;
  onToggle: () => void;
  readFailure: string;
  targetUnavailable: string;
  requestSource: (id: string) => Promise<string>;
}) {
  return (
    <section ref={surfaceRef} hidden={hidden} tabIndex={-1}
      className="inspector-shell small:border-l-0 small:border-t small:isolate flex min-w-0 min-h-0 flex-col overflow-clip border-l border-border bg-surface"
      aria-label="Inspector pane"
    >
      {back && <div className="p-3 border-b border-border"><Button onClick={back}>Back to tokens</Button></div>}
      {children || (
        <>
          <InspectorHeader
            readFailure={readFailure}
            targetUnavailable={targetUnavailable}
            editable={false}
            selected={!!selection}
            inspectorExpanded={inspectorExpanded}
            onToggle={onToggle}
          />
          <div
            id="token-inspector-content"
            className="inspector-content flex-1 bg-surface overflow-auto min-h-0"
            hidden={!inspectorExpanded}
          >
            {selection?.kind === "group" && context ? (
              <GroupInspector
                entry={context.groups.find(
                  (g) => g.authored.id === selection.id,
                )}
                projectId={header.project.id}
                revision={header.revision}
                requestSource={() => requestSource(selection.id)}
              />
            ) : (
              <div className="empty px-5 py-17.5 text-center text-muted-foreground">
                <h2 className="text-foreground text-base/normal">
                  {selection ? "Preparing inspection…" : "Nothing selected"}
                </h2>
                <p className="text-xs/normal mt-2 mb-5">
                  Select a token or group to inspect it.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
