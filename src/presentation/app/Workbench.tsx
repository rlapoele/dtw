import { NavigationPane, NavigationDrawer } from "./WorkbenchNavigation";
import { useWorkbenchLifecycle } from "@presentation/features/workbench/coordination/useWorkbenchLifecycle";
import { useWorkbenchBackup } from "@presentation/features/workbench/backup/useWorkbenchBackup";
import { creationParent } from "@presentation/features/workbench/browser/browser-view";
import type { BrowserView } from "@presentation/features/workbench/browser/browser-view";
import { RetentionRecovery } from "@presentation/features/workbench/recovery/RetentionRecovery";
import { TokenBrowser } from "@presentation/features/workbench/browser/TokenBrowser";
import { DepartureGuard } from "@presentation/features/workbench/recovery/DepartureGuard";
import { ProjectDiagnostics } from "@presentation/features/workbench/recovery/ProjectDiagnostics";
import { WorkbenchHeader } from "@presentation/features/workbench/components/WorkbenchHeader";
import { useProjectReadback } from "@presentation/features/workbench/coordination/useProjectReadback";
import { useProjectCommands } from "@presentation/features/workbench/coordination/useProjectCommands";
import { useCreationForm } from "@presentation/features/workbench/creation/useCreationForm";
import { useWorkbenchLayout } from "@presentation/features/workbench/coordination/useWorkbenchLayout";

import { RestoreDialog } from "@presentation/features/workbench/backup/RestoreDialog";
import { requestPersistentStorage } from "@adapters/browser/storage-preference";
import { readExactSource } from "@presentation/host/source";
import { useEffect, useRef, useState, useMemo } from "react";
import { Icon } from "@presentation/components/ui/icon";
import type { ApplicationResult } from "@application/authoring";
import type { Token } from "@domain/token";
import type { ProjectHeader, WorkbenchHost } from "@presentation/host/protocol";
import { Button } from "@presentation/components/ui/button";

import {
  WorkbenchInspector,
  EditableTokenInspector,
} from "@presentation/features/workbench/inspector/WorkbenchInspector";
import { CreationDialog } from "@presentation/features/workbench/creation/CreationDialog";
import { ProjectNavigation } from "@presentation/features/workbench/browser/ProjectNavigation";

import { identityLabels } from "@presentation/features/workbench/coordination/readback";
export function Workbench({
  host,
  initial,
  onProjects,
  onProject,
}: {
  host: WorkbenchHost;
  initial: ProjectHeader;
  onProjects(reset?: boolean): void;
  onProject(id: string): void;
}) {
  const [selection, setSelection] =
    useState<
      import("@presentation/features/workbench/coordination/useProjectReadback").Selection
    >(null);
  const [view, setView] = useState<BrowserView>({ kind: "all-tokens" });
  const group = creationParent(view);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false),
    [pending, setPending] = useState<(() => void) | null>(null),
    [editorVersion, setEditorVersion] = useState(0);
  const {
    compact,
    navigationOpen,
    setNavigationOpen,
    sidebarExpanded,
    setSidebarExpanded,
    inspectorExpanded,
    setInspectorExpanded,
  } = useWorkbenchLayout();
  const {
    header,
    context,
    rows,
    complete,
    inspection,
    readFailure,
    targetUnavailable,
    diagnostics,
    refresh,
    inspect,
    select,
    invalidate,
    loadDiagnostics,
    setReadFailure,
    reading,
    current,
  } = useProjectReadback(host, initial, selection);
  const [lifecycleBlocked, setLifecycleBlocked] = useState(false);
  const {
    busy,
    unknown,
    retainedPending,
    activeMutation,
    completion,
    accept,
    check,
    retryReading,
    setBusy,
  } = useProjectCommands(
    host,
    current,
    reading,
    lifecycleBlocked,
    refresh,
    setReadFailure,
    setError,
    setNotice,
  );
  const panel = useRef<HTMLElement>(null),
    formError = useRef<HTMLParagraphElement>(null);
  const {
    dialog,
    name,
    description,
    parent,
    layer,
    formDirty,
    formBaseline,
    formReviewed,
    begin,
    create,
    change,
    close,
    discard,
    review,
  } = useCreationForm(
    header,
    context,
    group,
    busy,
    unknown,
    readFailure,
    accept,
    completion,
    setError,
    setNotice,
    (kind, id) => {
      if (kind === "token") {
        setView({ kind: "all-tokens" });
        setQuery("");
        setSelection({ kind: "token", id });
        select({ kind: "token", id });
        setInspectorExpanded(true);
      } else if (kind === "group") setView({ kind: "group", id });
      requestAnimationFrame(() => panel.current?.focus());
    },
  );
  const {
    restorePreview,
    setRestorePreview,
    restoreInput,
    restage,
    onBackupFile,
    onDownload,
  } = useWorkbenchBackup(host, header, setBusy, setError, setNotice);
  useWorkbenchLifecycle({
    host,
    projectId: initial.project.id,
    busy,
    unknown: !!unknown,
    dirty,
    formDirty,
    setBlocked: setLifecycleBlocked,
    refresh,
    setReadFailure,
  });
  useEffect(() => {
    if (error) formError.current?.focus();
  }, [error]);
  function request(action: () => void) {
    if (busy || reading.current) return;
    if (dirty || formDirty || unknown) setPending(() => action);
    else action();
  }
  function choose(kind: "token" | "group", id: string) {
    if (selection?.kind === kind && selection.id === id) {
      setInspectorExpanded(true);
      return;
    }
    request(() => {
      setSelection({ kind, id });
      select({ kind, id });
      setInspectorExpanded(true);
      setDirty(false);
    });
  }
  function open(kind: "token" | "group" | "rename") {
    if (lifecycleBlocked || !header.writable || readFailure || busy || unknown)
      return;
    request(() => {
      begin(kind);
    });
  }
  const blocked =
    !!retainedPending ||
    reading.current ||
    lifecycleBlocked ||
    busy ||
    !!unknown ||
    !header.writable ||
    !!readFailure;
  const visible = useMemo(
    () =>
      rows.filter(
        (row) =>
          (group === null || row.parentGroupId === group) &&
          row.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, group, query],
  );
  const groupLabels = useMemo(
    () => identityLabels(context?.groups ?? [], ["Project root", "All tokens"]),
    [context],
  );
  const source = (kind: "project" | "group" | "token", id: string) =>
    readExactSource(host, header.project.id, header.revision, kind, id);
  const onProjectsClick = () =>
    request(() => {
      void host.call("leaveProject", header.project.id).then((safe) => {
        if (safe) {
          invalidate();
          onProjects();
        }
      });
    });
  const navigation = (
    <ProjectNavigation
      drawer={compact}
      project={context}
      view={view}
      unavailable={blocked}
      onSelect={(id) => {
        if (!busy) {
          setView(id === null ? { kind: "all-tokens" } : { kind: "group", id });
          setNavigationOpen(false);
        }
      }}
      onCreateGroup={() => open("group")}
      onAllContent={() => {
        if (!busy) {
          setView({ kind: "all-content" });
          setNavigationOpen(false);
        }
      }}
    />
  );
  const recovery = (
    <RetentionRecovery
      busy={busy}
      activeMutation={activeMutation.current}
      unknown={unknown}
      retainedPending={retainedPending}
      onCheck={() => void check()}
      onRetry={() => void retryReading()}
      onLeave={() =>
        setPending(() => () => {
          host.fence();
          invalidate();
          onProjects(true);
        })
      }
    />
  );
  const departureGuard = (
    <DepartureGuard
      open={pending !== null}
      unknown={!!unknown}
      busy={busy}
      onStay={() => setPending(null)}
      finalFocus={() =>
        dialog
          ? document.querySelector<HTMLElement>('[role="dialog"] input')
          : panel.current
      }
      onDiscard={() => {
        const action = pending;
        setPending(null);
        setDirty(false);
        discard();
        setEditorVersion((v) => v + 1);
        action?.();
      }}
    />
  );
  return (
    <div className="app-shell flex h-dvh min-h-0 flex-col overflow-clip bg-background">
      <a
        className="skip-link fixed -top-20 left-5 z-20 bg-background focus:top-2.5 p-2"
        href="#tokens"
      >
        Skip to tokens
      </a>
      <WorkbenchHeader
        compact={compact}
        projectName={header.project.name}
        busy={busy}
        unknown={!!unknown}
        readFailure={readFailure}
        restoreInput={restoreInput}
        onBackupFile={onBackupFile}
        onDownload={onDownload}
        onProjectsClick={onProjectsClick}
        onNavigation={() => setNavigationOpen(true)}
      />
      <div className="session-notice shrink-0 border-b border-border bg-notice text-notice-foreground text-caption px-5 py-2 min-h-9 flex items-center justify-center gap-2">
        <Icon name="info" />
        <span>
          {header.writable
            ? "Applied work is retained in this browser. Drafts stay in this page. Keep independent backups."
            : "Inspection only. Another tab has editing access. Local drafts remain in this page."}
        </span>
        {!header.writable && (
          <Button disabled={busy} onClick={() => void refresh()}>
            Check access
          </Button>
        )}
      </div>
      <div
        className={`workbench grid flex-1 h-0 min-h-0 overflow-hidden ${compact ? "compact-navigation" : ""} ${sidebarExpanded ? "groups-expanded" : "groups-collapsed"} ${inspectorExpanded ? "inspector-expanded" : "inspector-collapsed"}`}
      >
        {!compact && (
          <NavigationPane
            expanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          >
            {navigation}
          </NavigationPane>
        )}
        <TokenBrowser
          panel={panel}
          view={view}
          groupLabels={groupLabels}
          blocked={blocked}
          query={query}
          complete={complete}
          readFailure={readFailure}
          rows={rows}
          header={header}
          selection={selection}
          visible={visible}
          context={context}
          notice={notice}
          error={error}
          dialog={dialog}
          onQuery={setQuery}
          onCreateToken={() => open("token")}
          onRenameGroup={() => open("rename")}
          onAllContent={() => setView({ kind: "all-content" })}
          choose={choose}
          onReveal={() => {
            setView({ kind: "all-tokens" });
            setQuery("");
            requestAnimationFrame(() =>
              panel.current
                ?.querySelector<HTMLElement>('[aria-pressed="true"]')
                ?.focus(),
            );
          }}
          recovery={
            <>
              {lifecycleBlocked && !busy && !unknown && (
                <section
                  role="status"
                  className="text-caption border border-border rounded p-3 mb-3"
                >
                  <p>
                    Editing paused. Recheck current retained state before
                    applying preserved input.
                  </p>
                  <Button
                    onClick={() => {
                      void host
                        .call("resume", header.project.id)
                        .then((next) => refresh(next))
                        .then(() => setLifecycleBlocked(false))
                        .catch((e) => setReadFailure(String(e)));
                    }}
                  >
                    Check access and retained state
                  </Button>
                </section>
              )}
              {readFailure && (
                <section
                  role="alert"
                  tabIndex={-1}
                  className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4"
                >
                  <h2>Project read unavailable</h2>
                  <p>{readFailure}</p>
                  <p>
                    Last coherent data is stale. Inputs are preserved; writes
                    are blocked.
                  </p>
                  <Button disabled={busy} onClick={() => void retryReading()}>
                    Retry reading project
                  </Button>
                </section>
              )}
              {recovery}
            </>
          }
          diagnostics={
            <ProjectDiagnostics
              diagnostics={diagnostics}
              onLoad={() => void loadDiagnostics(setError)}
              onAllContent={() => setView({ kind: "all-content" })}
            />
          }
        />

        <WorkbenchInspector
          selection={selection}
          context={context}
          groupLabels={groupLabels}
          header={header}
          inspectorExpanded={inspectorExpanded}
          onToggle={() => setInspectorExpanded(!inspectorExpanded)}
          readFailure={readFailure}
          targetUnavailable={targetUnavailable}
          requestSource={(id) => source("group", id)}
        >
          {selection?.kind === "token" && inspection && context ? (
            <EditableTokenInspector
              inspectorExpanded={inspectorExpanded}
              onToggle={() => setInspectorExpanded(!inspectorExpanded)}
              readFailure={readFailure}
              key={JSON.stringify([selection.id, editorVersion])}
              inspection={inspection}
              project={context}
              inspect={(id) => {
                const row = rows.find((r) => r.id === id);
                return row?.preview
                  ? { resolution: { status: "resolved", value: row.preview } }
                  : undefined;
              }}
              onDirty={setDirty}
              readUnavailable={false}
              readOnly={blocked}
              targetUnavailable={targetUnavailable}
              revision={header.revision}
              requestSource={() => source("token", selection.id)}
              onApply={async (value) => {
                completion.current = () => {
                  setEditorVersion((v) => v + 1);
                  setDirty(false);
                };
                const result = await accept({
                  operation: "reviseColorToken",
                  input: {
                    projectId: header.project.id,
                    tokenId: selection.id,
                    value,
                  },
                });
                if (
                  result.status !== "retained" ||
                  result.readback === "unavailable"
                )
                  return {
                    status: "failure",
                    error: {
                      code: "storage-failure",
                      operation: "commit",
                      message:
                        result.status === "retained"
                          ? "Retained, readback unavailable. Retry reading only."
                          : result.reason,
                    },
                  };
                const next = await inspect(selection.id, {
                  ...header,
                  revision: result.revision,
                });
                if (!next?.authoredValue)
                  return {
                    status: "failure",
                    error: {
                      code: "invalid-domain-input",
                      message: "Accepted color unavailable for inspection",
                    },
                  };
                completion.current = undefined;
                return {
                  status: "ok",
                  value: {
                    definition: {
                      type: "color",
                      assignments: [
                        { condition: [] as never, value: next.authoredValue },
                      ],
                    },
                  },
                } satisfies ApplicationResult<Pick<Token, "definition">>;
              }}
            />
          ) : null}
        </WorkbenchInspector>
      </div>
      <footer className="statusbar narrow:flex-wrap small:px-4 small:py-1.5 short:hidden shrink-0 flex justify-between gap-4 border-t border-border bg-surface text-status px-5 py-2">
        <span>{header.tokens} tokens</span>
        <span className="small:hidden">
          {busy
            ? "Retention pending"
            : unknown
              ? "Outcome unknown"
              : readFailure
                ? "Stale / unavailable"
                : header.writable
                  ? "Applied state retained locally"
                  : "Inspection only"}
        </span>
        <Button
          size="selection"
          disabled={busy}
          onClick={() => void requestPersistentStorage().then(setNotice)}
        >
          Request persistent storage
        </Button>
      </footer>
      <NavigationDrawer
        open={compact && navigationOpen}
        onOpenChange={setNavigationOpen}
      >
        {navigation}
      </NavigationDrawer>
      {dialog === null && departureGuard}
      {restorePreview && (
        <RestoreDialog
          restage={restage}
          host={host}
          initial={restorePreview}
          onCancel={(reset) => {
            setRestorePreview(undefined);
            if (reset) {
              invalidate();
              onProjects(true);
            }
          }}
          onOpen={(id) => {
            setRestorePreview(undefined);
            if (id === header.project.id) {
              void refresh();
              setNotice(
                "Retained project refreshed. Preserved drafts have not been applied; review any changed baseline before reapplying.",
              );
            } else
              request(() => {
                void host
                  .call("leaveProject", header.project.id)
                  .then((safe) => {
                    if (safe) {
                      invalidate();
                      onProject(id);
                    }
                  });
              });
          }}
        />
      )}
      <CreationDialog
        guard={dialog !== null ? departureGuard : undefined}
        dialog={dialog}
        project={context}
        name={name}
        renameTarget={formBaseline?.target}
        description={description}
        onDescriptionChange={(value) => {
          change("description", value);
        }}
        parent={parent}
        layer={layer}
        readFailure={readFailure}
        error={error}
        formError={formError}
        finalFocus={() => panel.current}
        onClose={() => request(close)}
        onCreate={() => void create()}
        onNameChange={(value) => {
          change("name", value);
        }}
        onParentChange={(value) => {
          change("parent", value);
        }}
        onLayerChange={(value) => {
          change("layer", value);
        }}
        onRetry={() => void retryReading()}
        submissionBlocked={
          !!formBaseline &&
          formBaseline.revision !== header.revision &&
          !formReviewed
            ? "Review the changed baseline before creating or renaming."
            : dialog === "rename" &&
                !context?.groups.some(
                  (g) => g.authored.id === formBaseline?.target,
                )
              ? "Original rename target is unavailable. Input is preserved; mutation is blocked."
              : dialog !== "rename" &&
                  parent !== null &&
                  !context?.groups.some((g) => g.authored.id === parent)
                ? "Original parent is unavailable. Input is preserved; mutation is blocked without retargeting."
                : undefined
        }
        pending={busy || !!unknown || !!retainedPending || pending !== null}
        recovery={
          <>
            {recovery}
            {formBaseline && formBaseline.revision !== header.revision && (
              <section className="text-caption border border-border rounded p-3 mb-4">
                <h3>Form baseline changed</h3>
                <p className="wrap-anywhere">
                  Original target/parent identity:{" "}
                  {JSON.stringify(formBaseline.target)}
                </p>
                <p className="whitespace-pre-wrap wrap-anywhere">
                  Previous applied name: {formBaseline.name || "(unnamed)"}
                </p>
                <p className="whitespace-pre-wrap wrap-anywhere">
                  Current applied name:{" "}
                  {context?.groups.find(
                    (g) => g.authored.id === formBaseline.target,
                  )?.authored.localName ?? "(target unavailable)"}
                </p>
                <p className="whitespace-pre-wrap wrap-anywhere">
                  Preserved input: {name}
                </p>
                <Button disabled={busy || !!unknown} onClick={review}>
                  Review changes
                </Button>
                {formReviewed && (
                  <p>
                    Reviewed. The existing Create/Rename action will validate
                    this preserved input against the current revision.
                  </p>
                )}
              </section>
            )}
          </>
        }
      />
    </div>
  );
}
