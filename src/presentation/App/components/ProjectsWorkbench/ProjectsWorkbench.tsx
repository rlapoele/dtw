import type { ColorSpace } from "@domain/color-literal";
import { useRef, type ChangeEventHandler, type ReactNode, type Ref } from "react";
import type { CatalogueEntry } from "@application/retention/ports";
import type { StoragePersistenceStatus } from "@presentation/App/hooks/useStoragePersistence";
import { StorageProtection } from "@presentation/App/components/ProjectsWorkbench/components/StorageProtection/StorageProtection";
import { WorkbenchLayout } from "@presentation/App/components/WorkbenchLayout/WorkbenchLayout";
import { ApplicationHeader } from "@presentation/App/components/ApplicationHeader/ApplicationHeader";
import { ProjectInspector } from "@presentation/App/components/ProjectsWorkbench/components/ProjectInspector/ProjectInspector";
import { useProjectsLayout, type ProjectsView } from "@presentation/App/components/ProjectsWorkbench/hooks/useProjectsLayout";
import { Button } from "@presentation/ui/button";
import { ProjectList } from "@presentation/App/components/ProjectsWorkbench/components/ProjectList/ProjectList";
import { CreateProjectDialog } from "@presentation/App/components/ProjectsWorkbench/components/CreateProjectDialog/CreateProjectDialog";
import { RestoreSelectionDialog } from "@presentation/App/components/ProjectsWorkbench/components/RestoreSelectionDialog";
import { Input } from "@presentation/ui/input";
import { Icon } from "@presentation/ui/icon";
import { ambiguousProjectNames, browseProjects } from "@presentation/App/components/ProjectsWorkbench/helpers/project-catalogue";
import { ProjectRecovery } from "@presentation/App/components/ProjectsWorkbench/components/ProjectRecovery/ProjectRecovery";

type ProjectCreation = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDiscard: () => void;
  nameError: string;
  name: string;
  description: string;
  defaultColorSpace: ColorSpace;
  onDefaultColorSpaceChange: (space: ColorSpace) => void;
  nameRef: Ref<HTMLInputElement>;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onCreate: () => void;
};

type ProjectRecoveryControls = {
  pending: boolean;
  activeMutation: boolean;
  retained: boolean;
  unknown: boolean;
  onCheck: () => void;
  onRetryReading: () => void;
  onReviewLeaving: () => void;
};

type ProjectStorageProtection = {
  status: StoragePersistenceStatus;
  onRetry: () => void;
};

type ProjectBackup = {
  selectionOpen: boolean;
  onSelectFile: () => void;
  onCloseSelection: () => void;
  onDownload: (entry: Extract<CatalogueEntry, { status: "supported" }>) => void;
  feedback: string;
  feedbackKind?: "information" | "error";
  hasPreview: boolean;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
};

type ProjectsFeedback = {
  error: string;
  notice: string;
};

type ProjectsWorkbenchProps = {
  entries: readonly CatalogueEntry[] | undefined;
  view: ProjectsView;
  onView: (next: ProjectsView) => void;
  onOpen: (id: string) => void;
  onRetryCatalogue: () => void;
  creation: ProjectCreation;
  recovery: ProjectRecoveryControls;
  storage: ProjectStorageProtection;
  backup: ProjectBackup;
  feedback: ProjectsFeedback;
  departureDialog: ReactNode;
  restoreDialog: ReactNode;
};

// App owns these workflows across screen changes; this screen only composes them.
export function ProjectsWorkbench({
  entries,
  view,
  onView,
  onOpen,
  onRetryCatalogue,
  creation,
  recovery: { pending, activeMutation, retained, unknown, onCheck, onRetryReading, onReviewLeaving },
  storage: { status: storageStatus, onRetry: onRetryStorage },
  backup: {
    selectionOpen, onSelectFile, onCloseSelection,
    onDownload,
    feedback: backupFeedback,
    feedbackKind: backupFeedbackKind = "information",
    hasPreview,
    onFileChange: onBackupChange,
  },
  feedback: { error, notice },
  departureDialog,
  restoreDialog,
}: ProjectsWorkbenchProps) {
  const returnFocus = useRef<HTMLElement | null>(null);
  const { defaultColorSpace, onDefaultColorSpaceChange, name, description, nameRef, onNameChange, onDescriptionChange, onCreate } = creation;
  const query = view.query ?? "";
  const visible = browseProjects(entries ?? [], query);
  const ambiguousNames = ambiguousProjectNames(entries ?? []);
  const layout = useProjectsLayout(view, onView);
  const selected = entries?.find(entry => entry.rowKey === view.selection?.rowKey) ?? view.selection;
  const missing = !!view.selection && entries !== undefined && !entries.some(entry => entry.rowKey === view.selection?.rowKey);
  const openDisabled = pending || retained || unknown || hasPreview;
  const createDisabled = openDisabled || entries === undefined;
  const recoveryControls = <ProjectRecovery pending={pending} activeMutation={activeMutation} retained={retained} unknown={unknown} onCheck={onCheck} onRetryReading={onRetryReading} onReviewLeaving={onReviewLeaving} />;
  const feedback = <>
    <div className={error ? `notification ${unknown || retained ? "notification-warning" : "notification-error"} my-2` : "sr-only"}>
      <p role="alert">{error}</p>
      {error && entries === undefined && <Button disabled={pending || hasPreview} onClick={onRetryCatalogue}>Retry reading projects</Button>}
    </div>
    <p role="status" className={notice ? "notification notification-information text-caption my-2" : "sr-only"}>{notice}</p>
  </>;
  function beginDialog(action: () => void) {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    action();
  }
  return (
    <WorkbenchLayout
      narrow={layout.narrow} surface={view.surface}
      header={<ApplicationHeader actions={<span className="projects-header-context text-caption text-muted-foreground">Browser local</span>} />}
      workspace={
        <main ref={layout.browse} tabIndex={-1} hidden={layout.narrow && view.surface === "inspect"} onScroll={event => onView({ ...view, scroll: event.currentTarget.scrollTop })} className="projects-browse min-w-0 overflow-auto p-7 mobile:px-4 mobile:py-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div><p className="eyebrow text-muted-foreground uppercase mb-2">Projects</p><h1>All projects</h1></div>
            <div className="flex flex-wrap gap-2">
              <Button disabled={createDisabled} onClick={() => beginDialog(onSelectFile)}>Restore backup</Button>
              <Button variant="default" disabled={createDisabled} onClick={() => beginDialog(creation.onOpen)}><Icon name="plus" />New project</Button>
            </div>
            <p className="w-full text-caption text-muted-foreground">Browse and create projects in this browser.</p>
          </div>
          <div className="relative max-w-xs mb-5">
            <Icon name="search" className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <Input appearance="search" type="search" aria-label="Search projects" placeholder="Search projects…" value={query} disabled={entries === undefined} onChange={event => onView({ ...view, query: event.target.value })} />
          </div>
          {selected && !missing && entries !== undefined && !visible.some(entry => entry.rowKey === selected.rowKey) && <section className="mb-4 rounded-md border-hairline border-border bg-muted p-3 flex flex-wrap items-center justify-between gap-3 text-caption">
            <p>Selected project is outside this list.</p><Button onClick={() => onView({ ...view, query: "" })}>Show selected project</Button>
          </section>}
          <section className="project-list-container border-t-hairline border-border" aria-label="Project collection">
            <div aria-hidden="true" className="project-table-head table-heading p-3 mobile:px-2 border-b-hairline border-border gap-3 text-muted-foreground"><span>Project</span><span>Contents</span><span className="project-date-column">Created</span><span className="project-date-column">Last updated</span></div>
            {entries === undefined ? <p role="status" className="py-12 text-center">{error ? "Projects unavailable. Existing browser data is unchanged." : "Loading projects…"}</p>
              : entries.length === 0 ? <div className="py-12 text-center space-y-3"><h2>No projects yet</h2><p className="text-muted-foreground">No projects retained in this browser.</p><Button variant="default" disabled={createDisabled} onClick={() => beginDialog(creation.onOpen)}>New project</Button></div>
              : visible.length === 0 ? <div className="py-12 text-center space-y-3"><h2>No matching projects</h2><p className="text-muted-foreground">Try another name, description or identity.</p><Button onClick={() => onView({ ...view, query: "" })}>Clear search</Button></div>
              : <ProjectList entries={visible} ambiguousNames={ambiguousNames} disabled={openDisabled} selected={selected?.rowKey} onSelect={entry => onView({ ...view, selection: entry })} />}
          </section>
          {entries !== undefined && <p className="text-caption text-muted-foreground mt-3">{query.trim() ? `${visible.length} of ${entries.length}` : entries.length} {entries.length === 1 ? "project" : "projects"}</p>}
          {layout.narrow && selected && <Button ref={layout.entry} className="w-full mt-4" disabled={openDisabled} onClick={() => layout.show("inspect")}>Inspect selected project</Button>}
          <StorageProtection status={storageStatus} disabled={openDisabled} onRetry={onRetryStorage} />
        </main>
      }
      inspector={<section ref={layout.inspector} tabIndex={-1} aria-label="Project inspector" hidden={layout.narrow && view.surface !== "inspect"} className="projects-inspector min-w-0 overflow-auto border-l-hairline mobile:border-l-0 border-border bg-surface">
        {layout.narrow && <div className="p-4 border-b-hairline border-border"><Button onClick={() => layout.show("browse")}>Back to projects</Button></div>}
        <ProjectInspector entry={selected} missing={missing} catalogueUnavailable={entries === undefined} disabled={openDisabled || entries === undefined} onOpen={onOpen} onDownload={onDownload} />
      </section>}
      afterBody={<>
        {!creation.open && !selectionOpen && <section aria-label="Project feedback" className="shrink-0 max-h-48 overflow-auto px-4 text-caption wrap-anywhere">{recoveryControls}{feedback}</section>}
        {backupFeedback && <p role="status" className={`notification notification-${backupFeedbackKind} shrink-0 text-caption wrap-anywhere`}>{backupFeedback}</p>}
      </>}
      overlays={<>
        <CreateProjectDialog open={creation.open} onClose={creation.onClose} onDiscard={creation.onDiscard} returnFocus={() => returnFocus.current} blocked={pending || retained || unknown}
          form={{ defaultColorSpace, onDefaultColorSpaceChange, name, description, nameRef, onNameChange, onDescriptionChange, onSubmit: onCreate, disabled: createDisabled, pending, error: creation.nameError }}
          recovery={<>{recoveryControls}{feedback}</>} departureDialog={departureDialog} />
        {!creation.open && departureDialog}
        <RestoreSelectionDialog handingOff={hasPreview} open={selectionOpen} pending={pending} onClose={onCloseSelection} onFileChange={onBackupChange} feedback={feedback} returnFocus={() => returnFocus.current} />
        {restoreDialog}
      </>}
    />
  );
}
