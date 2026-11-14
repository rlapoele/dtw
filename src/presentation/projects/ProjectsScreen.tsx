import type { ChangeEventHandler, ReactNode, Ref } from "react";
import type { CatalogueEntry } from "@application/retention/ports";
import { Icon } from "@presentation/ui/icon";
import { Button } from "@presentation/ui/button";
import { ProjectList } from "./ProjectList/ProjectList";
import { CreateProjectForm } from "./CreateProjectForm/CreateProjectForm";
import { ProjectRecovery } from "./ProjectRecovery/ProjectRecovery";

export function ProjectsScreen({
  entries,
  error,
  notice,
  name,
  pending,
  activeMutation,
  retained,
  unknown,
  nameRef,
  onOpen,
  onRetryCatalogue,
  onBackupChange,
  onNameChange,
  onCreate,
  onCheck,
  onRetryReading,
  onReviewLeaving,
  departureDialog,
  restoreDialog,
}: {
  entries: readonly CatalogueEntry[] | undefined;
  error: string;
  notice: string;
  name: string;
  pending: boolean;
  activeMutation: boolean;
  retained: boolean;
  unknown: boolean;
  nameRef: Ref<HTMLInputElement>;
  onOpen: (id: string) => void;
  onRetryCatalogue: () => void;
  onBackupChange: ChangeEventHandler<HTMLInputElement>;
  onNameChange: (name: string) => void;
  onCreate: () => void;
  onCheck: () => void;
  onRetryReading: () => void;
  onReviewLeaving: () => void;
  departureDialog: ReactNode;
  restoreDialog: ReactNode;
}) {
  const openDisabled = pending || retained || unknown;
  const createDisabled = openDisabled || entries === undefined;
  return (
    <div className="app-shell flex h-dvh min-h-0 flex-col overflow-clip bg-background">
      <header className="shrink-0 border-b border-border h-16 flex items-center px-6 gap-5">
        <div className="brand flex items-center gap-2.5">
          <Icon name="stack" />
          <strong>Token Workbench</strong>
        </div>
        <span className="text-caption ml-auto text-muted-foreground">
          Browser local
        </span>
      </header>
      <main className="mx-auto w-full max-w-3xl px-7 py-10 overflow-auto">
        {
          <>
            <h1>Projects in this browser</h1>
            <p className="text-muted-foreground mt-3">
              Applied work is retained automatically. Keep independent backups:
              browser storage can be cleared or become unavailable.
            </p>
            {entries === undefined ? (
              <p role="status" className="my-5">
                {error
                  ? "Projects unavailable. Existing browser data is unchanged."
                  : "Loading projects…"}
              </p>
            ) : entries.length === 0 ? (
              <p className="my-5">No projects retained in this browser.</p>
            ) : (
              <ProjectList
                entries={entries}
                disabled={openDisabled}
                onOpen={onOpen}
              />
            )}
            {error && entries === undefined && (
              <Button onClick={onRetryCatalogue}>
                Retry reading projects
              </Button>
            )}
            <section className="mt-8">
              <h2 className="mb-3">Restore backup</h2>
              <label className="text-caption block">
                Project backup file
                <input
                  className="block mt-3 max-w-full"
                  type="file"
                  accept=".json,application/json"
                  disabled={createDisabled}
                  onChange={onBackupChange}
                />
              </label>
            </section>
            <CreateProjectForm
              name={name}
              disabled={createDisabled}
              pending={pending}
              error={error}
              nameRef={nameRef}
              onNameChange={onNameChange}
              onSubmit={onCreate}
            />
          </>
        }
        <ProjectRecovery
          pending={pending}
          activeMutation={activeMutation}
          retained={retained}
          unknown={unknown}
          onCheck={onCheck}
          onRetryReading={onRetryReading}
          onReviewLeaving={onReviewLeaving}
        />
        <p id="project-error" role="alert" className="text-destructive mt-4">
          {error}
        </p>
        <p role="status" className="text-caption mt-4">
          {notice}
        </p>
      </main>
      {departureDialog}
      {restoreDialog}
    </div>
  );
}
