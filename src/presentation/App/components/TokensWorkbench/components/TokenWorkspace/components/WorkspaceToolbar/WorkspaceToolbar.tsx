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
        <div>
          {!allContent && (
            <span className="eyebrow uppercase text-muted-foreground font-semibold">
              Tokens
            </span>
          )}
          <div className="flex items-center gap-2">
            <h1 className="my-1.5 small-title min-w-0 wrap-anywhere">
              {view.kind === "type" ? typeScopeLabel(view, groupLabels) : allContent
                ? "All content"
                : group === null
                  ? "All tokens"
                  : (groupLabels.get(group) ?? "Missing group")}
            </h1>
            {group !== null && (
              <Button size="icon" variant="ghost" title="Rename group" aria-label="Rename group" disabled={blocked} onClick={onRenameGroup}>
                <Icon name="pencil" />
              </Button>
            )}
          </div>
        </div>
        <div className="workspace-creation flex flex-nowrap gap-2">
          <Button size="panel" className="workspace-create" title="New group" aria-label="New group" disabled={blocked} onClick={onCreateGroup}>
            <Icon name="folder" /><span className="hidden sm:inline">New group</span>
          </Button>
        <Button
          className="workspace-create"
          title="New token"
          aria-label="New token"
          variant="default"
          size="panel"
          disabled={blocked}
          onClick={() => onCreateToken()}
        >
          <Icon name="plus" />
          <span className="hidden sm:inline">New token</span>
        </Button>
        </div>
        <p className="col-span-2 text-xs/normal text-muted-foreground">
          {allContent ? "Every group and token, including items outside the group tree." : group === null ? "Browse and create tokens." : "Browse and create tokens in this group."}
        </p>
      </div>
      {!allContent && (
        <div className="list-tools compact:flex-wrap narrow:gap-2 flex gap-3 items-center mb-5">
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
