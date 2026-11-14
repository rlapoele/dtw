import { WorkspaceToolbar } from "./WorkspaceToolbar/WorkspaceToolbar";
import type { BrowserView } from "../workspace-view";
import { Button } from "@presentation/ui/button";
import { AllContent } from "./AllContent/AllContent";
import { TokenTable } from "./TokenTable/TokenTable";
import type {
  ProjectContext,
  DisplayRow,
} from "@application/retention/projections";
import type { ProjectHeader } from "@presentation/host/protocol";
import type { Selection } from "../useProjectReadback";
import type { ReactNode, RefObject } from "react";
export function TokenWorkspace({
  panel,
  view,
  groupLabels,
  blocked,
  query,
  complete,
  readFailure,
  rows,
  header,
  selection,
  visible,
  context,
  recovery,
  diagnostics,
  notice,
  error,
  dialog,
  onQuery,
  onCreateToken,
  onRenameGroup,
  onAllContent,
  onReveal,
  choose,
}: {
  panel: RefObject<HTMLElement | null>;
  view: BrowserView;
  groupLabels: Map<string, string>;
  blocked: boolean;
  query: string;
  complete: boolean;
  readFailure: string;
  rows: DisplayRow[];
  header: ProjectHeader;
  selection: Selection;
  visible: DisplayRow[];
  context?: ProjectContext;
  recovery: ReactNode;
  diagnostics: ReactNode;
  notice: string;
  error: string;
  dialog: string | null;
  onQuery: (query: string) => void;
  onCreateToken: () => void;
  onRenameGroup: () => void;
  onAllContent: () => void;
  onReveal: () => void;
  choose: (kind: "token" | "group", id: string) => void;
}) {
  const allContent = view.kind === "all-content",
    group = view.kind === "group" ? view.id : null;
  return (
    <main
      id="tokens"
      ref={panel}
      tabIndex={-1}
      className="token-panel relative min-w-0 min-h-0 overflow-auto"
    >
      <WorkspaceToolbar
        view={view}
        groupLabels={groupLabels}
        blocked={blocked}
        query={query}
        onQuery={onQuery}
        onCreateToken={onCreateToken}
        onRenameGroup={onRenameGroup}
      />
      {recovery}
      {!complete && !readFailure && (
        <p role="status">
          Preparing complete project list… {rows.length} of {header.tokens}{" "}
          tokens
        </p>
      )}
      {!allContent &&
        selection?.kind === "token" &&
        complete &&
        !visible.some((row) => row.id === selection.id) && (
          <section className="selection-context flex-wrap border border-border rounded-md mb-4 text-caption flex items-center justify-between gap-3 p-3 bg-muted">
            <p className="mt-2">Selected token is outside this list.</p>
            <Button size="selection" onClick={onReveal}>
              Show selected token
            </Button>
          </section>
        )}
      {context &&
        (allContent ? (
          <AllContent
            key={JSON.stringify([header.project.id, header.revision])}
            context={context}
            groupLabels={groupLabels}
            onSelect={choose}
          />
        ) : (
          <>
            <TokenTable
              context={context}
              creationParentLabel={
                group === null
                  ? "Project root"
                  : (groupLabels.get(group) ?? "Unavailable group")
              }
              rows={visible}
              selected={selection?.kind === "token" ? selection.id : null}
              query={query}
              onSelect={(id) => choose("token", id)}
              onEmptyAction={() => (query ? onQuery("") : onCreateToken())}
            />
          </>
        ))}
      {diagnostics}
      <p role="status" className="helper text-muted-foreground">
        {notice}
      </p>
      {error && !dialog && (
        <p role="alert" className="text-destructive text-caption mt-3">
          {error}
        </p>
      )}
    </main>
  );
}
