import type { ProjectContext } from "@application/retention/projections";
import { Icon } from "@presentation/components/ui/icon";
import { Button } from "@presentation/components/ui/button";
import { identityLabels } from "@presentation/features/workbench/readback";
export function ProjectNavigation({
  drawer,
  project,
  group,
  unavailable,
  onSelect,
  onCreateGroup,
  onAllContent,
}: {
  drawer: boolean;
  project: ProjectContext | undefined;
  group: string | null;
  unavailable: boolean;
  onSelect: (group: string | null) => void;
  onCreateGroup: () => void;
  onAllContent?: () => void;
}) {
  const labels = identityLabels(project?.groups ?? [], [
    "Project root",
    "All tokens",
  ]);
  return (
    <>
      <div
        className={`sidebar-project source-compact:gap-2 flex items-center gap-2.5 ${drawer ? "px-2 pb-6" : "px-2 pb-7.5 source-compact:px-1 source-compact:pb-6.25"}`}
      >
        <span
          className="project-icon place-items-center border border-border bg-background text-xs/normal font-heading h-8 w-8 grid"
          aria-hidden="true"
        >
          T
        </span>
        <div>
          <strong className="block text-xs/normal source-compact:text-caption">
            {project?.project.name || "(unnamed project)"}
          </strong>
          <span className="block text-caption text-muted-foreground">
            Color foundations
          </span>
        </div>
      </div>
      <div className="nav-label uppercase text-muted-foreground font-semibold px-3 pb-2.5">
        Library
      </div>
      <Button
        variant="navigation"
        size="navigation"
        className={`nav-item w-full ${group === null ? "active" : ""}`}
        aria-current={group === null ? "true" : undefined}
        onClick={() => {
          onSelect(null);
        }}
      >
        <Icon name="grid" className="icon block" />
        All tokens
        <span className="count ml-auto text-secondary font-normal">
          {project?.tokens.length ?? 0}
        </span>
      </Button>
      {onAllContent && (
        <Button
          variant="navigation"
          size="navigation"
          className="text-muted-foreground w-full"
          onClick={onAllContent}
        >
          All content
        </Button>
      )}
      <div className="group-tree">
        {project?.groups.map((g) => (
          <Button
            key={g.authored.id}
            variant="navigation"
            size="group"
            className={`nav-item w-full group-item ${group === g.authored.id ? "active" : ""}`}
            aria-current={group === g.authored.id ? "true" : undefined}
            onClick={() => {
              onSelect(g.authored.id);
            }}
          >
            <Icon name="folder" className="icon block" />
            <span className="group-label whitespace-normal block min-w-0 text-left wrap-anywhere">
              {labels.get(g.authored.id)}
            </span>
          </Button>
        ))}
      </div>
      <Button
        className="nav-item w-full add-group text-muted-foreground mt-4"
        variant="navigation"
        size="navigation"
        disabled={unavailable}
        onClick={() => {
          onCreateGroup();
        }}
      >
        <Icon name="plus" className="icon block" />
        New group
      </Button>
      <div
        className={`sidebar-bottom mt-auto px-3 pt-8 pb-1 ${drawer ? "" : "density:hidden"}`}
      >
        <span className="eyebrow uppercase text-muted-foreground font-semibold">
          Project
        </span>
        <p className="my-2 text-secondary">
          One vocabulary.
          <br />
          Clear relationships.
        </p>
        <span className="helper text-muted-foreground font-normal">
          {project?.groups.length ?? 0} groups
        </span>
      </div>
    </>
  );
}
