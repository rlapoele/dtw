import { Button } from "@presentation/components/ui/button";
import { Icon } from "@presentation/components/ui/icon";

import type { RefObject, ChangeEvent } from "react";
export function WorkbenchHeader({
  compact,
  projectName,
  busy,
  unknown,
  readFailure,
  restoreInput,
  onBackupFile,
  onDownload,
  onProjectsClick,
  onNavigation,
}: {
  compact: boolean;
  projectName: string;
  busy: boolean;
  unknown: boolean;
  readFailure: string;
  restoreInput: RefObject<HTMLInputElement | null>;
  onBackupFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onDownload: () => void;
  onProjectsClick: () => void;
  onNavigation: () => void;
}) {
  return (
    <header
      className={`topbar small:h-13 short:h-11 shrink-0 border-b border-border h-16 flex items-center ${compact ? "pl-2 pr-6 gap-2" : "px-6 gap-5"}`}
    >
      {compact && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open project navigation"
          onClick={() => onNavigation()}
        >
          <Icon name="menu" className="size-5" />
        </Button>
      )}
      <div className="brand flex items-center gap-2.5">
        <Icon name="stack" />
        <strong>Token Workbench</strong>
      </div>
      <span className="project-title small:hidden min-w-0 wrap-anywhere text-muted-foreground">
        {projectName || "(unnamed project)"}
      </span>
      <input
        ref={restoreInput}
        className="sr-only"
        type="file"
        aria-label="Project backup file"
        accept=".json,application/json"
        disabled={busy || !!unknown}
        onChange={onBackupFile}
      />
      <Button
        className="ml-auto"
        disabled={busy || !!unknown}
        onClick={() => restoreInput.current?.click()}
      >
        Restore backup
      </Button>
      <Button disabled={busy || !!readFailure} onClick={onDownload}>
        Download backup
      </Button>
      <Button disabled={busy} onClick={onProjectsClick}>
        Projects
      </Button>
    </header>
  );
}
