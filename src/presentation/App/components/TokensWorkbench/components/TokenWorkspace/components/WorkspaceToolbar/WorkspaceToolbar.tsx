import { WorkspaceHeading } from "@presentation/App/components/TokensWorkbench/components/WorkspaceHeading";
import { typeScopeLabel } from "@presentation/App/components/TokensWorkbench/helpers/token-navigation";
import type { TokenBrowseView } from "@presentation/App/components/TokensWorkbench/helpers/browse-view";
import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";
import { Input } from "@presentation/ui/input";

export function WorkspaceToolbar({
  view,
  groupLabels,
  blocked,
  query,
  onQuery,
  onCreateToken,
  onCreateGroup,
  onRenameGroup,
}: {
  view: TokenBrowseView;
  groupLabels: Map<string, string>;
  blocked: boolean;
  query: string;
  onQuery: (query: string) => void;
  onCreateToken: () => void;
  onCreateGroup: () => void;
  onRenameGroup: () => void;
}) {
  const allContent = view.kind === "all-content",
    group = view.kind === "group" ? view.id : null;
  return (
    <>
      <div className="panel-header mb-6.5 grid  items-start gap-x-3 gap-y-2">
        <WorkspaceHeading
          eyebrow={allContent ? "" : "Tokens"}
          title={view.kind === "type" ? typeScopeLabel(view, groupLabels) : allContent
            ? "All content" : group === null ? "All tokens" : (groupLabels.get(group) ?? "Missing group")}
          onRename={group === null ? undefined : onRenameGroup}
          renameDisabled={blocked}
        />
        <div className="workspace-creation flex flex-nowrap gap-2">
          <Button size="panel" className="workspace-create mobile:w-9 mobile:min-w-9 mobile:px-0" title="New group" aria-label="New group" disabled={blocked} onClick={onCreateGroup}>
            <Icon name="folder" /><span className="inline mobile:hidden">New group</span>
          </Button>
        <Button
          className="workspace-create mobile:w-9 mobile:min-w-9 mobile:px-0"
          title="New token"
          aria-label="New token"
          variant="default"
          size="panel"
          disabled={blocked}
          onClick={() => onCreateToken()}
        >
          <Icon name="plus" />
          <span className="inline mobile:hidden">New token</span>
        </Button>
        </div>
        <p className="col-span-2 text-xs/normal text-muted-foreground">
          {allContent ? "Every group and token, including items outside the group tree." : group === null ? "Browse and create tokens." : "Browse and create tokens in this group."}
        </p>
      </div>
      {!allContent && (
        <div className="list-tools compact:flex-wrap mobile:gap-2 flex gap-3 items-center mb-5">
          <label className="search tablet:min-w-25 flex-1 max-w-75 relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            <Input
              appearance="search"
              type="search"
              aria-label="Search tokens"
              placeholder="Search tokens…"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
            />
          </label>
        </div>
      )}
    </>
  );
}
