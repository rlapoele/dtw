import type { CatalogueEntry } from "@application/retention/ports";
import { ProjectListItem } from "./components/ProjectListItem";
export function ProjectList({ entries, disabled, selected, onSelect }: { entries: readonly CatalogueEntry[]; disabled: boolean; selected?: string; onSelect: (entry: CatalogueEntry) => void }) {
  return <ul className="my-6 space-y-3">{entries.map(entry => <ProjectListItem key={entry.rowKey} entry={entry} disabled={disabled} selected={selected === entry.rowKey} onSelect={onSelect} />)}</ul>;
}
