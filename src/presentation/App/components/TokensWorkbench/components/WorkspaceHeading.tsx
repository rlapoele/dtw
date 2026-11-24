import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";

export function WorkspaceHeading({ title, eyebrow = "Tokens", onRename, renameDisabled = false }: {
  title: string;
  eyebrow?: string;
  onRename?: () => void;
  renameDisabled?: boolean;
}) {
  return <div>
    {eyebrow && <span className="eyebrow uppercase text-muted-foreground font-semibold">{eyebrow}</span>}
    <div className="flex items-center gap-2">
      <h1 className="my-1.5 small-title min-w-0 wrap-anywhere">{title}</h1>
      {onRename && <Button size="icon" variant="ghost" title="Rename group" aria-label="Rename group" disabled={renameDisabled} onClick={onRename}>
        <Icon name="pencil" />
      </Button>}
    </div>
  </div>;
}
