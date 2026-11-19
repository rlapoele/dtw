import type { CatalogueEntry } from "@application/retention/ports";
import { ProjectListItem } from "@presentation/App/components/ProjectsWorkbench/components/ProjectList/components/ProjectListItem";
import { projectLabel } from "@presentation/App/components/ProjectsWorkbench/helpers/project-catalogue";

export function ProjectList({ entries, ambiguousNames, disabled, selected, onSelect }: {
  entries: readonly CatalogueEntry[];
  ambiguousNames: ReadonlySet<string>;
  disabled: boolean;
  selected?: string;
  onSelect: (entry: CatalogueEntry) => void;
}) {
  return <ul aria-label="Projects">{entries.map(entry =>
    <ProjectListItem key={entry.rowKey} entry={entry} disambiguate={ambiguousNames.has(projectLabel(entry))} disabled={disabled} selected={selected === entry.rowKey} onSelect={onSelect} />
  )}</ul>;
}
