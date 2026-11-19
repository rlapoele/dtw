import type { CatalogueEntry } from "@application/retention/ports";
import { projectLabel } from "@presentation/App/components/ProjectsWorkbench/helpers/project-catalogue";

function ProjectDate({ value, unavailable }: { value?: string; unavailable: boolean }) {
  if (unavailable) return <>Unavailable</>;
  if (!value) return <>Unknown</>;
  const date = new Date(value);
  return <time dateTime={value} title={date.toLocaleString()}>{date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>;
}

export function ProjectListItem({ entry, disabled, selected, disambiguate, onSelect }: {
  entry: CatalogueEntry;
  disabled: boolean;
  selected: boolean;
  disambiguate: boolean;
  onSelect: (entry: CatalogueEntry) => void;
}) {
  const supported = entry.status === "supported";
  const created = <ProjectDate value={supported ? entry.creationDate : undefined} unavailable={!supported} />;
  const updated = <ProjectDate value={supported ? entry.lastUpdatedDate : undefined} unavailable={!supported} />;
  return <li>
    <button type="button" disabled={disabled} aria-pressed={selected} onClick={() => onSelect(entry)} className="project-table-row relative w-full text-left border-0 border-b-hairline border-border p-3 narrow:px-2 gap-3 items-start bg-transparent hover:bg-row-hover aria-pressed:bg-selected disabled:opacity-45">
      <span className="min-w-0">
        <strong className="block text-xs/normal small:text-caption font-medium wrap-anywhere">{projectLabel(entry)}</strong>
        {supported && entry.description && <span className="block line-clamp-2 mt-2 text-caption text-muted-foreground wrap-anywhere">{entry.description}</span>}
        {(disambiguate || !supported || !entry.name) && <span className="block mt-1.5 font-mono text-caption text-muted-foreground wrap-anywhere">Identity: {JSON.stringify(entry.id)}</span>}
        {!supported && <span className="block mt-1.5 text-caption text-muted-foreground wrap-anywhere">Project unavailable: {entry.reason}</span>}
        <span className="project-dates-compact mt-2.5 text-caption text-muted-foreground"><span>Created: {created}</span><span>Last updated: {updated}</span></span>
      </span>
      <span className="text-caption text-muted-foreground wrap-anywhere">{supported ? <><span className="block">tokens: {entry.tokens}</span><span className="block">groups: {entry.groups}</span></> : "Unavailable"}</span>
      <span className="project-date-column text-caption text-muted-foreground">{created}</span>
      <span className="project-date-column text-caption text-muted-foreground">{updated}</span>
    </button>
  </li>;
}
