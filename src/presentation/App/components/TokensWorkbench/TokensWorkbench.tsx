import { tokenListRows } from "@presentation/App/components/TokensWorkbench/helpers/token-list-order";
import { useOutcomeFeedback } from "@presentation/App/components/OutcomeFeedback/OutcomeFeedback";
import { useHistoryInteraction } from "@presentation/App/components/TokensWorkbench/hooks/useHistoryInteraction";
import { TokensStatusBar } from "@presentation/App/components/TokensWorkbench/components/TokensStatusBar/TokensStatusBar";
import { TokenNavigationPane, TokenNavigationDrawer } from "@presentation/App/components/TokensWorkbench/components/TokenNavigation/TokenNavigation";
import { useProjectLifecycle } from "@presentation/App/components/TokensWorkbench/hooks/useProjectLifecycle";
import { creationParent } from "@presentation/App/components/TokensWorkbench/helpers/browse-view";
import type { TokenBrowseView } from "@presentation/App/components/TokensWorkbench/helpers/browse-view";
import { RetentionRecovery } from "@presentation/App/components/TokensWorkbench/components/RetentionRecovery";
import { TokenWorkspace } from "@presentation/App/components/TokensWorkbench/components/TokenWorkspace/TokenWorkspace";
import { DepartureGuard } from "@presentation/App/components/TokensWorkbench/components/DepartureGuard";
import { ProjectDiagnostics } from "@presentation/App/components/TokensWorkbench/components/ProjectDiagnostics";
import { TokensHeader } from "@presentation/App/components/TokensWorkbench/components/TokensHeader/TokensHeader";
import { useProjectReadback } from "@presentation/App/components/TokensWorkbench/hooks/useProjectReadback";
import { useProjectCommands } from "@presentation/App/components/TokensWorkbench/hooks/useProjectCommands";
import { useAuthoringForm } from "@presentation/App/components/TokensWorkbench/components/AuthoringDialog/hooks/useAuthoringForm";
import { useTokensLayout } from "@presentation/App/components/TokensWorkbench/hooks/useTokensLayout";

import { readExactSource } from "@presentation/App/components/TokensWorkbench/helpers/read-exact-source";
import { useEffect, useRef, useState, useMemo } from "react";
import { WorkbenchLayout } from "@presentation/App/components/WorkbenchLayout/WorkbenchLayout";
import { FeedbackRegion } from "@presentation/App/components/TokensWorkbench/components/FeedbackRegion";
import { SelectionBar } from "@presentation/App/components/TokensWorkbench/components/TokenWorkspace/components/SelectionBar/SelectionBar";
import type { ApplicationResult } from "@application/authoring";
import type { Token } from "@domain/token";
import type { ProjectHeader, WorkbenchHost } from "@hosts/browser/protocol";
import { Button } from "@presentation/ui/button";

import { SelectionInspector } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/SelectionInspector";
import { TokenEditor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/TokenEditor";
import { AuthoringDialog } from "@presentation/App/components/TokensWorkbench/components/AuthoringDialog/AuthoringDialog";
import { NavigationContent } from "@presentation/App/components/TokensWorkbench/components/TokenNavigation/components/NavigationContent";

import { identityLabels } from "@presentation/App/components/TokensWorkbench/helpers/identity-labels";
export function TokensWorkbench({
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
  const outcomes = useOutcomeFeedback();
  const [selection, setSelection] =
    useState<
      import("@presentation/App/components/TokensWorkbench/hooks/useProjectReadback").Selection
    >(null);
  const [view, setView] = useState<TokenBrowseView>({ kind: "all-tokens" });
  const group = creationParent(view);
  const [collapsedNavigation, setCollapsedNavigation] = useState<Set<string>>(() => new Set());
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
  } = useTokensLayout();
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
  const authoringReturn = useRef<HTMLElement | null>(null);
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
  } = useAuthoringForm(
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
      authoringReturn.current = null;
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
  useProjectLifecycle({
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
    authoringReturn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
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
  const { historyReason, historyIntent, historyReturn, requestHistory, historyRetry, clearHistoryIntent } = useHistoryInteraction({
    history, traverse, blocked, unknown: !!unknown, retainedPending: !!retainedPending,
    readFailure, header, dialog: !!dialog, pending: !!pending, request, current,
    completion, setDirty, setEditorVersion, setNotice, setError, panel, narrow, back,
    context, selection, setSelection, view, setView,
  });
  useEffect(() => {
    if (context && complete && view.kind === "type" && view.location?.kind === "group" && !context.groups.some(g => g.authored.id === group)) {
      setView(currentView => currentView.kind === "type" && currentView.location?.kind === "group" && !context.groups.some(g => g.authored.id === creationParent(currentView)) ? {...currentView, location: undefined} : currentView);
    }
  }, [context, complete, view, group]);
  const visible = useMemo(
    () => tokenListRows(rows, context, view, query),
    [rows, context, view, query],
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
    <NavigationContent
      rows={complete ? rows : []}
      collapsed={collapsedNavigation}
      onToggle={key => setCollapsedNavigation(previous => { const next = new Set(previous); if (next.has(key)) next.delete(key); else next.add(key); return next; })}
      drawer={compact}
      project={context}
      view={view}
      unavailable={blocked}
      onSelect={(next) => {
        if (!busy) {
          setView(next);
          if (compact) back(false);
          navigationReturn.current = "workspace";
          setNavigationOpen(false);
        }
      }}
      onCreateGroup={() => open("group")}
      onAllContent={() => {
        if (!busy) {
          setView({ kind: "all-content" });
          if (compact) back(false);
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
    <WorkbenchLayout
      compact={compact} narrow={narrow} surface={surface}
      navigationCollapsed={!sidebarExpanded} inspectorCollapsed={!inspectorExpanded}
      header={<>
      <a
        className="skip-link fixed -top-20 left-5 z-20 bg-background focus:top-2.5 p-2"
        href="#tokens"
      >
        Skip to tokens
      </a>
      <TokensHeader
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
      </>}
      beforeBody={<FeedbackRegion>
        {!header.writable && <p className="notification notification-warning my-2">Inspection only. Another tab has editing access. <Button disabled={busy} onClick={() => void refresh()}>Check access</Button></p>}
        {lifecycleBlocked && !busy && !unknown && <section role="status" className="notification notification-warning my-2"><p>Editing paused. Recheck current retained state before applying preserved input.</p><Button onClick={() => void host.call("resume", header.project.id).then(next => refresh(next)).then(() => setLifecycleBlocked(false)).catch(e => setReadFailure(String(e)))}>Check access and retained state</Button></section>}
        {readFailure && <section role="alert" className="notification notification-error my-2"><h2>Project read unavailable</h2><p>{readFailure}</p><p>Last coherent data is stale. Inputs are preserved; writes are blocked.</p><Button disabled={busy} onClick={() => void retryReading()}>Retry reading project</Button></section>}
        {recovery}
        {historyRetry && <Button onClick={() => requestHistory(historyRetry)}>Retry {historyRetry === "undo" ? "Undo" : "Redo"}</Button>}
        {history.notice && <p role="status" className="notification notification-information my-2">{history.notice}</p>}
        {error && !dialog && <p role="alert" className={`notification ${unknown || retainedPending ? "notification-warning" : "notification-error"} my-2`}>{error}</p>}
        {notice && <p role="status" className="notification notification-information my-2">{notice}</p>}
      </FeedbackRegion>}
      navigation={
          <TokenNavigationPane
            expanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          >
            {navigation}
          </TokenNavigationPane>
      }
      workspace={<TokenWorkspace
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
          onQuery={setQuery}
          onCreateToken={() => open("token")}
          onCreateGroup={() => open("group")}
          onRenameGroup={() => open("rename")}
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
          diagnostics={
            <ProjectDiagnostics
              diagnostics={diagnostics}
              onLoad={() => void loadDiagnostics(setError)}
              onAllContent={() => setView({ kind: "all-content" })}
            />
          }
        />}
      inspector={<SelectionInspector
          surfaceRef={inspector}
          hidden={narrow && surface !== "inspect"}
          selection={selection}
          context={context}
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
                completion.current = (clarification) => {
                  setEditorVersion((v) => v + 1);
                  setDirty(false);
                  outcomes.publish(`Changes applied and retained.${clarification ? ` ${clarification}` : ""}`);
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
                if (result.status === "retained") outcomes.publish("Changes applied and retained.");
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
        </SelectionInspector>}
      afterBody={<TokensStatusBar tokens={header.tokens} busy={busy} unknown={!!unknown} readFailure={readFailure} writable={header.writable} dirty={dirty} />}
      overlays={<>
      <TokenNavigationDrawer
        finalFocus={navigationFinalFocus}
        open={compact && navigationOpen}
        onOpenChange={setNavigationOpen}
      >
        {navigation}
      </TokenNavigationDrawer>
      {dialog === null && departureGuard}
      <AuthoringDialog
        guard={dialog !== null ? departureGuard : undefined}
        open={dialog !== null}
        form={dialog === "token" ? {
          kind: "token",
          name,
          onNameChange: value => change("name", value),
          parent,
          onParentChange: value => change("parent", value),
          description,
          onDescriptionChange: value => change("description", value),
          layer,
          onLayerChange: value => change("layer", value),
        } : dialog === "rename" ? {
          kind: "rename",
          name,
          onNameChange: value => change("name", value),
          target: formBaseline?.target,
        } : {
          // Preserve the existing group-shaped content while the dialog is closed.
          kind: "group",
          name,
          onNameChange: value => change("name", value),
          parent,
          onParentChange: value => change("parent", value),
        }}
        project={context}
        readFailure={readFailure}
        error={error}
        formError={formError}
        finalFocus={() => authoringReturn.current?.isConnected && authoringReturn.current.getClientRects().length ? authoringReturn.current : panel.current}
        onClose={() => request(close)}
        onSubmit={() => void create()}
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
              <section className="text-caption border-hairline border-border rounded p-3 mb-4">
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
      </>}
    />
  );
}
