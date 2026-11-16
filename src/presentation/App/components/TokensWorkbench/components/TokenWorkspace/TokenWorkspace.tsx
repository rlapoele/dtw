import { WorkspaceToolbar } from "@presentation/App/components/TokensWorkbench/components/TokenWorkspace/components/WorkspaceToolbar/WorkspaceToolbar";
import type { TokenBrowseView } from "@presentation/App/components/TokensWorkbench/helpers/browse-view";
import { Button } from "@presentation/ui/button";
import { NamespaceInventory } from "@presentation/App/components/TokensWorkbench/components/TokenWorkspace/components/NamespaceInventory/NamespaceInventory";
import { TokenTable } from "@presentation/App/components/TokensWorkbench/components/TokenWorkspace/components/TokenTable/TokenTable";
import type {
  ProjectContext,
  DisplayRow,
} from "@application/retention/projections";
import type { ProjectHeader } from "@hosts/browser/protocol";
import type { Selection } from "@presentation/App/components/TokensWorkbench/hooks/useProjectReadback";
import type { ReactNode, RefObject } from "react";
export function TokenWorkspace({
  panel, surfaceRef, hidden, selectionBar,
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
  surfaceRef?: RefObject<HTMLElement | null>;
  hidden?: boolean;
  selectionBar?: ReactNode;
  view: TokenBrowseView;
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
      hidden={hidden}
      ref={node => { panel.current = node; if (surfaceRef) surfaceRef.current = node; }}
      tabIndex={-1}
      className="token-panel relative min-w-0 min-h-0 overflow-auto p-6 compact:px-4 compact:py-5"
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
      {selectionBar}
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
          <section className="selection-context flex-wrap border-hairline border-border rounded-md mb-4 text-caption flex items-center justify-between gap-3 p-3 bg-muted">
            <p className="mt-2">Selected token is outside this list.</p>
            <Button size="selection" onClick={onReveal}>
              Show selected token
            </Button>
          </section>
        )}
      {context &&
        (allContent ? (
          <NamespaceInventory
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
