import { AuthoredValue } from "@presentation/features/workbench/components/AuthoredValue";
import type { ProjectReadback, TokenInspection } from "@application/authoring";
import { Button } from "@presentation/components/ui/button";
import { Swatch } from "@presentation/features/workbench/components/swatch";
import { identityLabels, resolvedColor } from "@presentation/features/workbench/readback";
import { colorPreview } from "@presentation/features/workbench/color/preview";
export function TokenList({
  project,
  visible,
  selected,
  query,
  inspect,
  onSelect,
  onEmptyAction,
}: {
  project: ProjectReadback | undefined;
  visible: ProjectReadback["tokens"];
  selected: string | undefined;
  query: string;
  inspect: (id: string) => TokenInspection | undefined;
  onSelect: (id: string) => void;
  onEmptyAction: () => void;
}) {
  const labels = identityLabels(project?.tokens ?? visible);
  return (
    <div className="token-table @container border-t border-border">
      <div className="table-heading border-b border-border p-3 narrow:px-2 grid grid-cols-2 @3xl:grid-cols-3 gap-3 text-muted-foreground">
        <span>Token</span>
        <span className="hidden @3xl:block">Description</span>
        <span>Authored value</span>
      </div>
      {visible.map((t) => {
        const v = t.authored.definition?.assignments[0]?.value,
          preview = colorPreview(resolvedColor(inspect(t.authored.id)));
        return (
          <button
            key={t.authored.id}
            type="button"
            className={`token-row border-0 border-b border-border hover:bg-row-hover aria-pressed:bg-selected relative grid grid-cols-2 @3xl:grid-cols-3 gap-3 items-start w-full text-left p-3 narrow:px-2 bg-transparent ${selected === t.authored.id ? "selected" : ""}`}
            aria-pressed={selected === t.authored.id}
            onClick={() => onSelect(t.authored.id)}
          >
            <span className="flex gap-3 min-w-0 items-start"><Swatch css={preview.css} />
            <span className="token-identity flex-1 min-w-0">
              <strong className="block text-xs/normal small:text-caption token-name wrap-anywhere">
                {labels.get(t.authored.id)}
              </strong>
              <small className="block text-secondary mt-1 wrap-anywhere">
                {t.authored.layer ?? "Unspecified"} ·{" "}
                {t.authored.definition?.type ?? "Unassigned"}
              </small>
              {t.authored.description !== undefined && <span className="@3xl:hidden mt-2 line-clamp-2 whitespace-pre-wrap wrap-anywhere text-caption text-secondary">{t.authored.description}</span>}
            </span>
            </span>
            <span className="hidden @3xl:block min-w-0 text-caption text-secondary"><span className="line-clamp-2 whitespace-pre-wrap wrap-anywhere">{t.authored.description ?? "—"}</span></span>
            <span className="value-summary min-w-0 text-value text-caption wrap-anywhere"><AuthoredValue value={v} project={project} layout="compact" /></span>
          </button>
        );
      })}
      {visible.length === 0 && (
        <div className="empty px-5 py-17.5 text-center text-muted-foreground">
          <h2 className="text-foreground text-base/normal">
            {query
              ? "No matching colors"
              : project?.tokens.length
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
