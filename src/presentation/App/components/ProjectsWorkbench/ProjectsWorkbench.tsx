import type { ChangeEventHandler, ReactNode, Ref } from "react";
import type { CatalogueEntry } from "@application/retention/ports";
import type { StoragePersistenceStatus } from "@presentation/App/hooks/useStoragePersistence";
import { StorageProtection } from "./components/StorageProtection/StorageProtection";
import { WorkbenchLayout } from "@presentation/App/components/WorkbenchLayout/WorkbenchLayout";
import { ApplicationHeader } from "@presentation/App/components/ApplicationHeader/ApplicationHeader";
import { ProjectInspector } from "./components/ProjectInspector/ProjectInspector";
import { useProjectsLayout, type ProjectsView } from "./hooks/useProjectsLayout";
import { Button } from "@presentation/ui/button";
import { ProjectList } from "@presentation/App/components/ProjectsWorkbench/components/ProjectList/ProjectList";
import { CreateProjectForm } from "@presentation/App/components/ProjectsWorkbench/components/CreateProjectForm/CreateProjectForm";
import { ProjectRecovery } from "@presentation/App/components/ProjectsWorkbench/components/ProjectRecovery/ProjectRecovery";

export function ProjectsWorkbench({
  entries,
  storageStatus, onRetryStorage,
  view, onView, onDownload, backupFeedback, hasPreview,
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
  storageStatus: StoragePersistenceStatus;
  onRetryStorage: () => void;
  view: ProjectsView;
  onView: (next: ProjectsView) => void;
  onDownload: (entry: Extract<CatalogueEntry, { status: "supported" }>) => void;
  backupFeedback: string;
  hasPreview: boolean;
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
  const layout = useProjectsLayout(view, onView);
  const selected = entries?.find(entry => entry.rowKey === view.selection?.rowKey) ?? view.selection;
  const missing = !!view.selection && entries !== undefined && !entries.some(entry => entry.rowKey === view.selection?.rowKey);
  const openDisabled = pending || retained || unknown || hasPreview;
  const createDisabled = openDisabled || entries === undefined;
  return (
    <WorkbenchLayout
      narrow={layout.narrow} surface={view.surface}
      header={<ApplicationHeader actions={<span className="projects-header-context text-caption text-muted-foreground">Browser local</span>} />}
      workspace={
      <main ref={layout.browse} tabIndex={-1} hidden={layout.narrow && view.surface === "inspect"} onScroll={event => onView({ ...view, scroll: event.currentTarget.scrollTop })} className="projects-browse min-w-0 overflow-auto p-7 touch:px-4 touch:py-5">
        {
          <>
            <p className="eyebrow text-muted-foreground uppercase mb-2">Your workspace</p>
            <h1>Projects in this browser</h1>
            <p className="text-muted-foreground mt-3">
              Applied work is retained automatically. Keep independent backups:
              browser storage can be cleared or become unavailable.
            </p>
            <div className="flex items-center justify-between gap-3 border-t-hairline border-border mt-7 pt-4 mb-4"><h2>Local collection</h2><span className="font-mono text-caption text-muted-foreground">{entries === undefined ? "—" : `${entries.length} ${entries.length === 1 ? "project" : "projects"}`}</span></div>
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
                selected={selected?.rowKey}
                onSelect={entry => onView({ ...view, selection: entry })}
              />
            )}
            {layout.narrow && selected && <Button ref={layout.entry} className="w-full" disabled={openDisabled} onClick={() => layout.show("inspect")}>Inspect selected project</Button>}
            <CreateProjectForm
              name={name}
              disabled={createDisabled}
              pending={pending}
              error={error}
              nameRef={nameRef}
              onNameChange={onNameChange}
              onSubmit={onCreate}
            />
            <section className="mt-8 border-t-hairline border-border pt-6">
              <h2 className="mb-3">Restore backup</h2>
              <label className="text-caption block">
                Project backup file
                <input
                  className="block mt-3 max-w-full touch:min-h-11"
                  type="file"
                  accept=".json,application/json"
                  disabled={createDisabled}
                  onChange={onBackupChange}
                />
              </label>
            </section>

          </>
        }
        <StorageProtection status={storageStatus} disabled={openDisabled} onRetry={onRetryStorage} />
      </main>}
      inspector={<section ref={layout.inspector} tabIndex={-1} aria-label="Project inspector" hidden={layout.narrow && view.surface !== "inspect"} className="projects-inspector min-w-0 overflow-auto border-l-hairline touch:border-l-0 border-border bg-surface">
        {layout.narrow && <div className="p-4 border-b-hairline border-border"><Button onClick={() => layout.show("browse")}>Back to projects</Button></div>}
        <ProjectInspector entry={selected} missing={missing} catalogueUnavailable={entries === undefined} disabled={openDisabled || entries === undefined} onOpen={onOpen} onDownload={onDownload} />
      </section>}
      afterBody={<>
      <section aria-label="Project feedback" className="shrink-0 max-h-48 overflow-auto px-4 text-caption wrap-anywhere">
        <ProjectRecovery
          pending={pending}
          activeMutation={activeMutation}
          retained={retained}
          unknown={unknown}
          onCheck={onCheck}
          onRetryReading={onRetryReading}
          onReviewLeaving={onReviewLeaving}
        />
        <p id="project-error" role="alert" className={error ? "text-destructive py-2" : "sr-only"}>
          {error}
        </p>
        <p role="status" className={notice ? "text-caption py-2" : "sr-only"}>
          {notice}
        </p>
        {error && entries === undefined && (
          <Button disabled={pending || hasPreview} onClick={onRetryCatalogue}>
            Retry reading projects
          </Button>
        )}
      </section>
      {backupFeedback && <p role="status" className="shrink-0 border-t-hairline border-border p-3 text-caption wrap-anywhere">{backupFeedback}</p>}
      </>}
      overlays={<>{departureDialog}{restoreDialog}</>}
    />
  );
}
