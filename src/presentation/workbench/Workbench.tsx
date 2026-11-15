import { useWorkbenchHistory } from "./hooks/useWorkbenchHistory";
import { WorkbenchStatus } from "@presentation/Workbench/components/WorkbenchStatus/WorkbenchStatus";
import { NavigationPane, NavigationDrawer } from "@presentation/Workbench/components/WorkbenchNavigation/WorkbenchNavigation";
import { useWorkbenchLifecycle } from "@presentation/Workbench/hooks/useWorkbenchLifecycle";
import { creationParent } from "@presentation/Workbench/helpers/workspace-view";
import type { BrowserView } from "@presentation/Workbench/helpers/workspace-view";
import { RetentionRecovery } from "@presentation/Workbench/components/WorkbenchRecovery/components/RetentionRecovery";
import { TokenWorkspace } from "@presentation/Workbench/components/TokenWorkspace/TokenWorkspace";
import { DepartureGuard } from "@presentation/Workbench/components/WorkbenchRecovery/components/DepartureGuard";
import { ProjectDiagnostics } from "@presentation/Workbench/components/WorkbenchRecovery/components/ProjectDiagnostics";
import { WorkbenchHeader } from "@presentation/Workbench/components/WorkbenchHeader/WorkbenchHeader";
import { useProjectReadback } from "@presentation/Workbench/hooks/useProjectReadback";
import { useProjectCommands } from "@presentation/Workbench/hooks/useProjectCommands";
import { useCreationForm } from "@presentation/Workbench/components/CreationDialog/hooks/useCreationForm";
import { useWorkbenchLayout } from "@presentation/Workbench/hooks/useWorkbenchLayout";

import { readExactSource } from "@presentation/host/source";
import { useEffect, useRef, useState, useMemo } from "react";
import { ApplicationShell } from "@presentation/components/ApplicationShell/ApplicationShell";
import { WorkbenchFeedback } from "./components/WorkbenchRecovery/components/WorkbenchFeedback";
import { SelectionBar } from "./components/TokenWorkspace/components/SelectionBar/SelectionBar";
import type { ApplicationResult } from "@application/authoring";
import type { Token } from "@domain/token";
import type { ProjectHeader, WorkbenchHost } from "@presentation/host/protocol";
import { Button } from "@presentation/ui/button";

import { WorkbenchInspector } from "@presentation/Workbench/components/WorkbenchInspector/WorkbenchInspector";
import { TokenEditor } from "@presentation/Workbench/components/WorkbenchInspector/components/TokenEditor/TokenEditor";
import { CreationDialog } from "@presentation/Workbench/components/CreationDialog/CreationDialog";
import { NamespaceTree } from "@presentation/Workbench/components/WorkbenchNavigation/components/NamespaceTree/NamespaceTree";

import { identityLabels } from "@presentation/token-display/helpers/identity-labels";
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
      import("@presentation/Workbench/hooks/useProjectReadback").Selection
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
    navigationTrigger, navigationReturn, navigationFinalFocus, compact, narrow, surface, browse, inspector, reopen, showInspector, back,
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
    history,
    traverse,
    check,
    retryReading,
    setBusy,
  } = useProjectCommands(
    host,
    current,
    reading,
    lifecycleBlocked || !!readFailure,
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
        showInspector();
      } else if (kind === "group") setView({ kind: "group", id });
      requestAnimationFrame(() => panel.current?.focus());
    },
  );
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
      if (!narrow) setInspectorExpanded(true);
      return;
    }
    request(() => {
      setSelection({ kind, id });
      select({ kind, id });
      if (!narrow) setInspectorExpanded(true);
      setDirty(false);
    });
  }
  function open(kind: "token" | "group" | "rename") {
    if (lifecycleBlocked || !header.writable || readFailure || busy || unknown)
      return;
    setNavigationOpen(false);
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
  const { historyReason, historyIntent, historyReturn, requestHistory, historyRetry, clearHistoryIntent } = useWorkbenchHistory({
    history, traverse, blocked, unknown: !!unknown, retainedPending: !!retainedPending,
    readFailure, header, dialog: !!dialog, pending: !!pending, request, current,
    completion, setDirty, setEditorVersion, setNotice, setError, panel, narrow, back,
    context, selection, setSelection, view, setView,
  });
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
    <NamespaceTree
      drawer={compact}
      project={context}
      view={view}
      unavailable={blocked}
      onSelect={(id) => {
        if (!busy) {
          setView(id === null ? { kind: "all-tokens" } : { kind: "group", id });
          navigationReturn.current = "workspace";
          setNavigationOpen(false);
        }
      }}
      onCreateGroup={() => open("group")}
      onAllContent={() => {
        if (!busy) {
          setView({ kind: "all-content" });
          navigationReturn.current = "workspace";
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
  // Closing clears intent before Base UI invokes its latest finalFocus callback.
  // Keep the captured history target through close; every ordinary guard opening
  // resets it so unrelated departures retain their existing return behavior.
  const guardHistoryReturn = useRef<HTMLElement | null>(null);
  if (pending !== null) guardHistoryReturn.current = historyIntent ? historyReturn.current : null;
  const departureGuard = (
    <DepartureGuard
      historyIntent={historyIntent}
      open={pending !== null}
      unknown={!!unknown}
      busy={busy}
      onStay={() => { setPending(null); clearHistoryIntent(); }}
      finalFocus={() =>
        guardHistoryReturn.current?.isConnected ? guardHistoryReturn.current : dialog
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
    <ApplicationShell>
      <a
        className="skip-link fixed -top-20 left-5 z-20 bg-background focus:top-2.5 p-2"
        href="#tokens"
      >
        Skip to tokens
      </a>
      <WorkbenchHeader
        history={history}
        historyReason={historyReason}
        onTraverse={requestHistory}
        compact={compact}
        onBack={narrow && surface === "inspect" ? back : undefined}
        projectName={header.project.name}
        busy={busy}
        onProjectsClick={onProjectsClick}
        navigationRef={navigationTrigger}
        onNavigation={() => { navigationReturn.current = "trigger"; setNavigationOpen(true); }}
      />
      <WorkbenchFeedback>
        {!header.writable && <p className="py-2">Inspection only. Another tab has editing access. <Button disabled={busy} onClick={() => void refresh()}>Check access</Button></p>}
        {lifecycleBlocked && !busy && !unknown && <section role="status" className="py-2"><p>Editing paused. Recheck current retained state before applying preserved input.</p><Button onClick={() => void host.call("resume", header.project.id).then(next => refresh(next)).then(() => setLifecycleBlocked(false)).catch(e => setReadFailure(String(e)))}>Check access and retained state</Button></section>}
        {readFailure && <section role="alert" className="py-2 text-destructive"><h2>Project read unavailable</h2><p>{readFailure}</p><p>Last coherent data is stale. Inputs are preserved; writes are blocked.</p><Button disabled={busy} onClick={() => void retryReading()}>Retry reading project</Button></section>}
        {recovery}
        {historyRetry && <Button onClick={() => requestHistory(historyRetry)}>Retry {historyRetry === "undo" ? "Undo" : "Redo"}</Button>}
        {history.notice && <p role="status" className="py-2">{history.notice}</p>}
        {error && !dialog && <p role="alert" className="py-2 text-destructive">{error}</p>}
        {notice && <p role="status" className="py-2">{notice}</p>}
      </WorkbenchFeedback>
      <div
        className={`workbench ${narrow ? `narrow-${surface}` : ""} grid flex-1 h-0 min-h-0 overflow-hidden ${compact ? "compact-navigation" : ""} ${sidebarExpanded ? "groups-expanded" : "groups-collapsed"} ${inspectorExpanded ? "inspector-expanded" : "inspector-collapsed"}`}
      >
        {!compact && (
          <NavigationPane
            expanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          >
            {navigation}
          </NavigationPane>
        )}
        <TokenWorkspace
          panel={panel}
          surfaceRef={browse}
          hidden={narrow && surface === "inspect"}
          selectionBar={narrow && selection ? <SelectionBar actionRef={reopen} label={selection.kind === "token" ? rows.find(row => row.id === selection.id)?.label ?? selection.id : groupLabels.get(selection.id) ?? selection.id} dirty={dirty} editable={selection.kind === "token" && !!inspection?.editable && !blocked && !targetUnavailable} onInspect={showInspector} /> : null}
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
          notice=""
          error=""
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
          recovery={null}
          diagnostics={
            <ProjectDiagnostics
              diagnostics={diagnostics}
              onLoad={() => void loadDiagnostics(setError)}
              onAllContent={() => setView({ kind: "all-content" })}
            />
          }
        />

        <WorkbenchInspector
          surfaceRef={inspector}
          hidden={narrow && surface !== "inspect"}
          selection={selection}
          context={context}
          groupLabels={groupLabels}
          header={header}
          inspectorExpanded={inspectorExpanded}
          onToggle={() => narrow ? back() : setInspectorExpanded(!inspectorExpanded)}
          readFailure={readFailure}
          targetUnavailable={targetUnavailable}
          requestSource={(id) => source("group", id)}
        >
          {selection?.kind === "token" && inspection && context ? (
            <TokenEditor
              inspectorExpanded={inspectorExpanded}
              onToggle={() => narrow ? back() : setInspectorExpanded(!inspectorExpanded)}
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
                  result.status !== "unchanged" && (result.status !== "retained" ||
                  result.readback === "unavailable")
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
      <WorkbenchStatus tokens={header.tokens} busy={busy} unknown={!!unknown} readFailure={readFailure} writable={header.writable} dirty={dirty} />
      <NavigationDrawer
        finalFocus={navigationFinalFocus}
        open={compact && navigationOpen}
        onOpenChange={setNavigationOpen}
      >
        {navigation}
      </NavigationDrawer>
      {dialog === null && departureGuard}
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
    </ApplicationShell>
  );
}
