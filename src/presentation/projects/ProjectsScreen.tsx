import type { ChangeEventHandler, ReactNode, Ref } from "react";
import type { CatalogueEntry } from "@application/retention/ports";
import { useState } from "react";
import { requestPersistentStorage } from "@adapters/browser/storage-preference";
import { ApplicationShell } from "@presentation/components/ApplicationShell/ApplicationShell";
import { ApplicationHeader } from "@presentation/components/ApplicationHeader/ApplicationHeader";
import { ProjectInspector } from "./components/ProjectInspector/ProjectInspector";
import { useProjectsLayout, type ProjectsView } from "./hooks/useProjectsLayout";
import { Button } from "@presentation/ui/button";
import { ProjectList } from "@presentation/projects/components/ProjectList/ProjectList";
import { CreateProjectForm } from "@presentation/projects/components/CreateProjectForm/CreateProjectForm";
import { ProjectRecovery } from "@presentation/projects/components/ProjectRecovery/ProjectRecovery";

export function ProjectsScreen({
  entries,
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
  const [storageNotice, setStorageNotice] = useState("");
  const layout = useProjectsLayout(view, onView);
  const selected = entries?.find(entry => entry.rowKey === view.selection?.rowKey) ?? view.selection;
  const missing = !!view.selection && entries !== undefined && !entries.some(entry => entry.rowKey === view.selection?.rowKey);
  const openDisabled = pending || retained || unknown || hasPreview;
  const createDisabled = openDisabled || entries === undefined;
  return (
    <ApplicationShell>
      <ApplicationHeader actions={<span className="projects-header-context text-caption text-muted-foreground">Browser local</span>} />
      <div className="projects-layout flex-1 min-h-0 grid overflow-hidden">
      <main ref={layout.browse} tabIndex={-1} hidden={layout.narrow && view.surface === "inspect"} onScroll={event => onView({ ...view, scroll: event.currentTarget.scrollTop })} className="projects-browse min-w-0 overflow-auto p-6">
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

          </>
        }
        <section className="mt-8 border-t border-border pt-5"><h2>Browser retention</h2><p className="mt-3 text-muted-foreground">Applied work is retained in this browser. Browser data can be cleared. Keep independent backups.</p><Button className="mt-4" disabled={openDisabled} onClick={() => void requestPersistentStorage().then(setStorageNotice)}>Request persistent storage</Button><p role="status" className="mt-3 text-caption">{storageNotice}</p></section>
      </main>
      <section ref={layout.inspector} tabIndex={-1} aria-label="Project inspector" hidden={layout.narrow && view.surface !== "inspect"} className="projects-inspector min-w-0 overflow-auto border-l border-border bg-surface">
        {layout.narrow && <div className="p-4 border-b border-border"><Button onClick={() => layout.show("browse")}>Back to projects</Button></div>}
        <ProjectInspector entry={selected} missing={missing} catalogueUnavailable={entries === undefined} disabled={openDisabled || entries === undefined} onOpen={onOpen} onDownload={onDownload} />
      </section>
      </div>
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
      {backupFeedback && <p role="status" className="shrink-0 border-t border-border p-3 text-caption wrap-anywhere">{backupFeedback}</p>}
      {departureDialog}
      {restoreDialog}
    </ApplicationShell>
  );
}
