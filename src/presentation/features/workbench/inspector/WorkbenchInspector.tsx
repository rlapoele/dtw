import { GroupInspector } from "./GroupInspector";
import type { Selection } from "../coordination/useProjectReadback";
import type { ProjectContext } from "@application/retention/projections";
import type { ProjectHeader } from "@presentation/host/protocol";
import { Button } from "@presentation/components/ui/button";
import { Icon } from "@presentation/components/ui/icon";
import type { Feedback } from "./Editor";
import type { ReactNode } from "react";
import { useTokenEditor } from "./useTokenEditor";
import { EditorFields } from "./Editor";
export function InspectorHeader({
  readFailure,
  targetUnavailable,
  editable,
  feedback,
  selected,
  inspectorExpanded,
  onToggle,
}: {
  readFailure: string;
  targetUnavailable: string;
  editable: boolean;
  feedback?: Feedback;
  selected: boolean;
  inspectorExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="inspector-header border-b border-border bg-surface h-11 min-h-11 shrink-0 flex items-center gap-2 pl-3 min-w-0">
      <span className="inspector-region-title flex-1 text-caption leading-3.5 min-w-0 font-medium">
        Inspector
      </span>
      {!readFailure && !targetUnavailable && editable && feedback && (
        <section
          className="inspector-feedback flex items-center gap-2 shrink-0"
          aria-label="Applied and draft color context"
        >
          {(
            ["applied", ...(feedback.tab === "resolved" ? [] : ["draft"])] as (
              | "applied"
              | "draft"
            )[]
          ).map((kind) => (
            <div
              key={kind}
              className="text-caption flex flex-col items-center w-16"
            >
              <span>{kind === "applied" ? "Applied" : "Draft"}</span>
              {feedback[kind] ? (
                <span
                  aria-hidden="true"
                  className="header-specimen rounded border border-specimen-border block w-9 h-4"
                  style={{ background: feedback[kind] }}
                />
              ) : (
                <span>Unavailable</span>
              )}
              <span className="sr-only">
                {
                  feedback[
                    kind === "applied" ? "appliedMessage" : "draftMessage"
                  ]
                }
              </span>
            </div>
          ))}
        </section>
      )}
      {(readFailure || targetUnavailable || !editable || !feedback) && (
        <span className="inspector-header-status text-caption leading-4 text-secondary">
          {readFailure || targetUnavailable
            ? "Unavailable"
            : selected
              ? "Inspection only"
              : "Select content"}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="pane-toggle inspector-toggle"
        aria-label={
          inspectorExpanded ? "Collapse inspector" : "Expand inspector"
        }
        aria-expanded={inspectorExpanded}
        aria-controls="token-inspector-content"
        onClick={() => onToggle()}
      >
        <Icon name="chevron-down" />
      </Button>
    </div>
  );
}
export function WorkbenchInspector({
  children,
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
    <section
      className="inspector-shell small:border-l-0 small:border-t small:isolate flex min-w-0 min-h-0 flex-col overflow-clip border-l border-border bg-surface"
      aria-label="Inspector pane"
    >
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
export function EditableTokenInspector({
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
        <EditorFields editor={editor} />
      </div>
    </>
  );
}
