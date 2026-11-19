import { useMemo } from "react";
import { tokenNavigation } from "@presentation/App/components/TokensWorkbench/helpers/token-navigation";
import { TypeBranch } from "@presentation/App/components/TokensWorkbench/components/TokenNavigation/components/TypeBranch";
import type { TokenBrowseView } from "@presentation/App/components/TokensWorkbench/helpers/browse-view";
import type { ProjectContext } from "@application/retention/projections";
import { Icon } from "@presentation/ui/icon";
import { Button } from "@presentation/ui/button";
import { identityLabels, namespaceEntryDetails } from "@presentation/App/components/TokensWorkbench/helpers/identity-labels";
export function NavigationContent({
  rows, collapsed, onToggle,
  drawer,
  project,
  view,
  unavailable,
  onSelect,
  onCreateGroup,
  onAllContent,
}: {
  rows: readonly import("@application/retention/projections").DisplayRow[];
  collapsed: ReadonlySet<string>;
  onToggle: (key: string) => void;
  drawer: boolean;
  project: ProjectContext | undefined;
  view: TokenBrowseView;
  unavailable: boolean;
  onSelect: (view: TokenBrowseView) => void;
  onCreateGroup: () => void;
  onAllContent?: () => void;
}) {
  const branches = useMemo(() => tokenNavigation(rows, project), [rows, project]);
  const details = project
    ? namespaceEntryDetails(project)
    : new Map<string, string>();
  const labels = identityLabels(project?.groups ?? [], [
    "Project root",
    "All tokens",
  ]);
  return (
    <>
      <div
        className={`sidebar-project source-compact:gap-2 flex items-center gap-2.5 ${drawer ? "px-2 pb-6" : "px-2 pb-7.5 source-compact:px-1 source-compact:pb-6.25"}`}
      >
        <span
          className="project-icon place-items-center border-hairline border-border bg-background text-xs/normal font-heading h-8 w-8 grid"
          aria-hidden="true"
        >
          T
        </span>
        <div>
          <strong className="block text-xs/normal source-compact:text-caption">
            {project?.project.name || "(unnamed project)"}
          </strong>
          <span className="block text-caption text-muted-foreground">
            Token workbench
          </span>
        </div>
      </div>
      <div className="nav-label uppercase text-muted-foreground font-semibold px-3 pb-2.5">
        Library
      </div>
      <Button
        variant="navigation"
        size="navigation"
        className={`nav-item w-full ${view.kind === "all-tokens" ? "active" : ""}`}
        aria-current={view.kind === "all-tokens" ? "true" : undefined}
        onClick={() => {
          onSelect({kind: "all-tokens"});
        }}
      >
        <Icon name="grid" className="icon block" />
        All tokens
        <span className="count ml-auto text-muted-foreground font-normal">
          {project?.tokens.length ?? 0}
        </span>
      </Button>
      {onAllContent && (
        <Button
          variant="navigation"
          size="navigation"
          className={`nav-item w-full ${view.kind === "all-content" ? "active" : "text-muted-foreground"}`}
          aria-current={view.kind === "all-content" ? "true" : undefined}
          onClick={onAllContent}
        >
          All content
        </Button>
      )}
      <div className="nav-label uppercase text-muted-foreground font-semibold px-3 pb-2.5 mt-6">Tokens</div>
      {branches.map(branch => <TypeBranch key={branch.scope.type} branch={branch} depth={0} view={view} collapsed={collapsed} onToggle={onToggle} onSelect={onSelect} />)}
      <div className="nav-label uppercase text-muted-foreground font-semibold px-3 pb-2.5 mt-6">Groups</div>
      <div className="group-tree">
        {project?.groups.map((g) => (
          <Button
            key={g.authored.id}
            variant="navigation"
            size="group"
            className={`nav-item w-full group-item ${view.kind === "group" && view.id === g.authored.id ? "active" : ""}`}
            aria-current={
              view.kind === "group" && view.id === g.authored.id
                ? "true"
                : undefined
            }
            onClick={() => {
              onSelect({kind: "group", id: g.authored.id});
            }}
          >
            <Icon name="folder" className="icon block" />
            <span className="group-label whitespace-normal block min-w-0 text-left wrap-anywhere">
              {labels.get(g.authored.id)}
              {details.get(JSON.stringify(["group", g.authored.id])) && (
                <span className="block text-caption">
                  {details.get(JSON.stringify(["group", g.authored.id]))}
                </span>
              )}
            </span>
          </Button>
        ))}
      </div>
      <Button
        className="nav-item w-full add-group text-muted-foreground mt-4"
        variant="navigation"
        size="navigation"
        disabled={unavailable}
        onClick={() => {
          onCreateGroup();
        }}
      >
        <Icon name="plus" className="icon block" />
        New group
      </Button>
    </>
  );
}
