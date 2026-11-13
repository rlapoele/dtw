import type { BrowserView } from "../state/browser-view";
import { Button } from "@presentation/components/ui/button";
import { Icon } from "@presentation/components/ui/icon";
import { Input } from "@presentation/components/ui/input";
import { AllContent } from "./AllContent";
import { ProjectedTokenList } from "./ProjectedTokenList";
import type {
  ProjectContext,
  DisplayRow,
} from "@application/retention/projections";
import type { ProjectHeader } from "@presentation/host/protocol";
import type { Selection } from "../hooks/useProjectReadback";
import type { ReactNode, RefObject } from "react";
export function TokenBrowser({
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
  const allContent = view.kind === "all-content", group = view.kind === "group" ? view.id : null;
  return (
    <main
      id="tokens"
      ref={panel}
      tabIndex={-1}
      className="token-panel relative min-w-0 min-h-0 overflow-auto"
    >
      <div className="panel-header source-compact:items-start compact:flex-wrap mb-6.5 flex justify-between items-center gap-3">
        <div>
          {!allContent && <span className="eyebrow uppercase text-muted-foreground font-semibold">
            Tokens
          </span>}
          <h1 className="my-1.5 small-title">
            {allContent
              ? "All content"
              : group === null
                ? "All tokens"
                : (groupLabels.get(group) ?? "Missing group")}
          </h1>
          <p className="text-xs/normal text-muted-foreground">
            {allContent ? "Every group and token, including items outside the group tree." : group === null ? "Browse and create color tokens." : "Browse and create color tokens in this group."}
          </p>
        </div>
        <Button
          variant="default"
          size="panel"
          disabled={blocked}
          onClick={() => onCreateToken()}
        >
          <Icon name="plus" />
          New token
        </Button>
      </div>
      {!allContent && <div className="list-tools compact:flex-wrap narrow:gap-2 flex gap-3 items-center mb-5">
        <label className="search tablet:min-w-25 flex-1 max-w-75 relative">
          <Input
            appearance="search"
            type="search"
            aria-label="Search color tokens"
            placeholder="Search colors…"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
        </label>
        {group !== null && (
          <Button disabled={blocked} onClick={() => onRenameGroup()}>
            Rename group
          </Button>
        )}
      </div>}
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
            <ProjectedTokenList
              context={context}
              creationParentLabel={group === null ? "Project root" : (groupLabels.get(group) ?? "Unavailable group")}
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
