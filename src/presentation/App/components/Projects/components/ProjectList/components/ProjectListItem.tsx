import type { CatalogueEntry } from "@application/retention/ports";
export function ProjectListItem({ entry, disabled, selected, onSelect }: { entry: CatalogueEntry; disabled: boolean; selected: boolean; onSelect: (entry: CatalogueEntry) => void }) {
  return <li><button type="button" disabled={disabled} aria-pressed={selected} onClick={() => onSelect(entry)} className="project-row w-full text-left border border-border rounded-md p-4 bg-background hover:bg-row-hover aria-pressed:bg-selected disabled:opacity-45">
    <strong className="block wrap-anywhere">{entry.status === "supported" ? entry.name || "(unnamed project)" : "Project unavailable"}</strong>
    <span className="text-caption text-muted-foreground block mt-2">{entry.status === "supported" ? `${entry.tokens} tokens · ${entry.groups} groups` : `Project unavailable: ${entry.reason}`}</span>
    <span className="text-caption block mt-2 wrap-anywhere">Identity: {JSON.stringify(entry.id)}</span>
  </button></li>;
}
