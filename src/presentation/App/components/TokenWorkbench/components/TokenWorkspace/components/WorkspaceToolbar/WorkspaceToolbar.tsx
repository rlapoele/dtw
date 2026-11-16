import type { BrowserView } from "@presentation/App/components/TokenWorkbench/helpers/workspace-view";
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
  onRenameGroup,
}: {
  view: BrowserView;
  groupLabels: Map<string, string>;
  blocked: boolean;
  query: string;
  onQuery: (query: string) => void;
  onCreateToken: () => void;
  onRenameGroup: () => void;
}) {
  const allContent = view.kind === "all-content",
    group = view.kind === "group" ? view.id : null;
  return (
    <>
      <div className="panel-header source-compact:items-start compact:flex-wrap mb-6.5 flex justify-between items-center gap-3">
        <div>
          {!allContent && (
            <span className="eyebrow uppercase text-muted-foreground font-semibold">
              Tokens
            </span>
          )}
          <h1 className="my-1.5 small-title">
            {allContent
              ? "All content"
              : group === null
                ? "All tokens"
                : (groupLabels.get(group) ?? "Missing group")}
          </h1>
          <p className="text-xs/normal text-muted-foreground">
            {allContent
              ? "Every group and token, including items outside the group tree."
              : group === null
                ? "Browse and create color tokens."
                : "Browse and create color tokens in this group."}
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
      {!allContent && (
        <div className="list-tools compact:flex-wrap narrow:gap-2 flex gap-3 items-center mb-5">
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
        </div>
      )}
    </>
  );
}
