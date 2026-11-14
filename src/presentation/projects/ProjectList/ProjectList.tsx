import type { CatalogueEntry } from "@application/retention/ports";
import { ProjectListItem } from "./ProjectListItem";

export function ProjectList({
  entries,
  disabled,
  onOpen,
}: {
  entries: readonly CatalogueEntry[];
  disabled: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <ul className="my-6 space-y-3">
      {entries.map((entry) => (
        <ProjectListItem key={entry.rowKey} entry={entry} disabled={disabled} onOpen={onOpen} />
      ))}
    </ul>
  );
}
