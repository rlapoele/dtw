import type { ProjectReadback, TokenInspection } from "@application/authoring";
import { Button } from "@presentation/components/button";
import { Swatch } from "@presentation/components/swatch";
import { pathLabel, resolvedColor } from "@presentation/readback";
import { colorPreview } from "@presentation/preview";
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
  return (
    <div className="token-table border-t border-border">
      <div className="table-heading border-b border-border p-3 flex justify-between text-muted-foreground">
        <span>Token</span>
        <span>Authored value</span>
      </div>
      {visible.map((t) => {
        const v = t.authored.definition?.assignments[0]?.value,
          preview = colorPreview(resolvedColor(inspect(t.authored.id)));
        return (
          <button
            key={t.authored.id}
            type="button"
            className={`token-row border-0 border-b border-border hover:bg-row-hover aria-pressed:bg-selected relative flex gap-3 items-center w-full text-left p-3 tablet:gap-2 narrow:px-2 narrow:gap-2 bg-transparent ${selected === t.authored.id ? "selected" : ""}`}
            aria-pressed={selected === t.authored.id}
            onClick={() => onSelect(t.authored.id)}
          >
            <Swatch css={preview.css} />
            <span className="token-identity flex-1 min-w-0">
              <strong className="block text-xs/normal small:text-caption token-name wrap-anywhere">
                {pathLabel(t.path)}
              </strong>
              <small className="block text-secondary mt-1 wrap-anywhere">
                {t.authored.layer ?? "Unspecified"} ·{" "}
                {t.authored.definition?.type ?? "Unassigned"} · {t.authored.id}
              </small>
            </span>
            <span className="value-summary text-value text-caption flex items-center gap-2 wrap-anywhere mono">
              {v?.kind === "token-reference" ? (
                <>
                  {project?.tokens.find(
                    (x) => x.authored.id === v.targetTokenId,
                  )
                    ? pathLabel(
                        project.tokens.find(
                          (x) => x.authored.id === v.targetTokenId,
                        )!.path,
                      )
                    : "Missing target"}
                  <small className="block text-secondary mt-1 wrap-anywhere">
                    {v.targetTokenId}
                  </small>
                </>
              ) : v?.kind === "literal" && v.valueType === "color" ? (
                <>
                  {v.colorSpace}
                  <small className="block text-secondary mt-1 wrap-anywhere">
                    {v.components.join(" · ")}
                  </small>
                </>
              ) : (
                (v?.kind ?? "No assignment")
              )}
            </span>
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
