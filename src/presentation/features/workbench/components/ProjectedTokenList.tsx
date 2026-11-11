import type {
  DisplayRow,
  ProjectContext,
} from "@application/retention/projections";
import { AuthoredValue } from "./AuthoredValue";
import { Swatch } from "./swatch";
import { Button } from "@presentation/components/ui/button";
import { identityLabels } from "@presentation/features/workbench/readback";
import { colorPreview } from "@presentation/features/workbench/color/preview";
export function ProjectedTokenList({
  context,
  rows,
  selected,
  query,
  onSelect,
  onEmptyAction,
}: {
  context: ProjectContext;
  rows: readonly DisplayRow[];
  selected: string | null;
  query: string;
  onSelect(id: string): void;
  onEmptyAction(): void;
}) {
  const labels = identityLabels(context.tokens);
  return (
    <div className="token-table @container border-t border-border">
      <div className="table-heading border-b border-border p-3 narrow:px-2 grid grid-cols-2 @3xl:grid-cols-3 gap-3 text-muted-foreground">
        <span>Token</span>
        <span className="hidden @3xl:block">Description</span>
        <span>Authored value</span>
      </div>
      {rows.map((row) => (
        <button
          key={row.id}
          type="button"
          className={`token-row border-0 border-b border-border hover:bg-row-hover aria-pressed:bg-selected relative grid grid-cols-2 @3xl:grid-cols-3 gap-3 items-start w-full text-left p-3 narrow:px-2 bg-transparent ${selected === row.id ? "selected" : ""}`}
          aria-pressed={selected === row.id}
          onClick={() => onSelect(row.id)}
        >
          <span className="flex gap-3 min-w-0 items-start">
            <Swatch css={colorPreview(row.preview).css} />
            <span className="token-identity flex-1 min-w-0">
              <strong className="block text-xs/normal small:text-caption token-name wrap-anywhere">
                {labels.get(row.id)}
              </strong>
              <small className="block text-secondary mt-1 wrap-anywhere">
                {row.layer} · {row.type}
              </small>
              {row.description !== undefined && (
                <span className="@3xl:hidden mt-2 line-clamp-2 whitespace-pre-wrap wrap-anywhere text-caption text-secondary">
                  {row.description}
                </span>
              )}
            </span>
          </span>
          <span className="hidden @3xl:block min-w-0 text-caption text-secondary">
            <span className="line-clamp-2 whitespace-pre-wrap wrap-anywhere">
              {row.description ?? "—"}
            </span>
          </span>
          <span className="value-summary min-w-0 text-value text-caption wrap-anywhere">
            {row.color ? (
              <AuthoredValue
                value={row.color}
                project={context}
                layout="compact"
              />
            ) : row.targetId !== undefined ? (
              <span className="block">
                Reference
                <span className="block text-secondary mt-1">
                  {labels.get(row.targetId) ?? "Missing target"}
                </span>
              </span>
            ) : (
              row.valueKind
            )}
          </span>
        </button>
      ))}
      {rows.length === 0 && (
        <div className="empty px-5 py-17.5 text-center text-muted-foreground">
          <h2 className="text-foreground text-base/normal">
            {query
              ? "No matching colors"
              : context.tokens.length
                ? "This group is empty"
                : "Your project is empty"}
          </h2>
          <p className="text-xs/normal mt-2 mb-5">
            Create a color at the root, or add a group to organize it.
          </p>
          <Button onClick={onEmptyAction}>
            {query ? "Clear search" : "New token"}
          </Button>
        </div>
      )}
    </div>
  );
}
