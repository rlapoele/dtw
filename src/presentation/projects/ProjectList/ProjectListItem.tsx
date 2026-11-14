import type { CatalogueEntry } from "@application/retention/ports";
import { Button } from "@presentation/ui/button";

export function ProjectListItem({
  entry,
  disabled,
  onOpen,
}: {
  entry: CatalogueEntry;
  disabled: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <li
      className="border border-border rounded-md p-4"
    >
      {entry.status === "supported" ? (
        <>
          <Button
            disabled={disabled}
            onClick={() => onOpen(entry.id)}
          >
            {entry.name || "(unnamed project)"}
          </Button>
          <p className="text-caption text-muted-foreground mt-2">
            {entry.tokens} tokens · {entry.groups} groups
          </p>
        </>
      ) : (
        <p>Project unavailable: {entry.reason}</p>
      )}
      <p className="text-caption mt-2 wrap-anywhere">
        Identity: {JSON.stringify(entry.id)}
      </p>
    </li>
  );
}
