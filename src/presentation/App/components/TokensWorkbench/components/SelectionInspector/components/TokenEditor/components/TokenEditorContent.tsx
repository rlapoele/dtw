import { useLayoutEffect, useRef } from "react";
import { TokenValueComparison } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenValueComparison";
import { EditorActions } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/EditorActions";
import { EditRecovery } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/EditRecovery";
import { ReferenceFields } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/ReferenceFields";
import { TokenMetadata } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenMetadata";
import { ResolvedTokenPanel } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/ResolvedTokenPanel";
import type { useTokenEditor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor";

import { AuthoredValue } from "@presentation/App/components/TokensWorkbench/components/AuthoredValue";
import { TokenEditorTabs } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenEditorTabs";
import { Badge } from "@presentation/ui/badge";

import { Tabs } from "@base-ui/react/tabs";

import { Button } from "@presentation/ui/button";
import { ColorEditor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/ColorEditor/ColorEditor";

export function TokenEditorContent({
  editor,
}: {
  editor: ReturnType<typeof useTokenEditor>;
}) {
  const {
    i,
    project,
    projected,
    token,
    value,
    accepting,
    session,
    setSession,
    recovery,
    setRecovery,
    reviewHeading,
    tab,
    setTab,
    error,
    setError,
    notice,
    setNotice,
    modeRef,
    errorRef,
    dirty,
    applied,
    draft,
    tokenLabels,
    referenceChoices,
    referenceLabels,
    groupLabels,
    editable,
    apply,
    cancel,
    readUnavailable,
    revision,
    requestSource,
    readOnly,
    targetUnavailable,
  } = editor;
  const headingRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const heading = headingRef.current;
    const scroller = heading?.closest<HTMLElement>(".inspector-content");
    if (!heading || !scroller) return;
    // The title may wrap, and root text can grow: reserve the actual sticky height.
    const update = () => { scroller.style.scrollPaddingTop = `${heading.getBoundingClientRect().height + 8}px`; };
    update();
    const observer = new ResizeObserver(update); observer.observe(heading);
    return () => { observer.disconnect(); scroller.style.scrollPaddingTop = ""; };
  }, []);
  return (
    <aside
      className="inspector small:min-h-0 flex min-w-0 min-h-full flex-col bg-surface"
      aria-label="Selected token"
      hidden={readUnavailable}
    >
      <div ref={headingRef} className="inspector-heading sticky top-0 z-10 bg-surface border-b-hairline border-border p-4">
        <div className="flex items-start gap-2 min-w-0">
          <span aria-hidden="true" className="size-9 shrink-0 touch:hidden" />
          <div className="flex flex-wrap items-start gap-3 min-w-0 flex-1">
            <div className="min-w-0 max-w-full">
              <span className="eyebrow uppercase text-muted-foreground font-semibold">{token.definition?.type ?? "Unassigned"} token</span>
              <h2 className="wrap-anywhere my-1 text-inspector font-semibold">{tokenLabels.get(token.id) ?? (token.localName || "(unnamed original token)")}</h2>
            </div>
            {editable && !targetUnavailable && <TokenValueComparison feedback={editor.feedback} />}
          </div>
        </div>
      </div>
      <div className="px-6 pt-4 pb-5 touch:px-4">
        {token.description && (
          <p className="text-caption text-muted-foreground whitespace-pre-wrap wrap-anywhere">
            {token.description}
          </p>
        )}
        {i.path.status !== "derived" && (
          <p className="text-caption wrap-anywhere">
            Path unavailable · Parent identity:{" "}
            {JSON.stringify(token.parentGroupId)}. Exact namespace details
            remain available below.
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {token.layer && <Badge className="bg-muted text-foreground">{token.layer}</Badge>}
          {!editable && <Badge>Inspection only</Badge>}
        </div>
      </div>
      <Tabs.Root value={tab} onValueChange={setTab}>
        <TokenEditorTabs />
        <Tabs.Panel value="authored" className="editor-body bg-surface p-6 touch:p-4">
          {targetUnavailable && (
            <p
              role="status"
              className="notification notification-warning text-caption"
            >
              {targetUnavailable} Preserved input remains selectable. This
              action cannot recreate or retarget it.
            </p>
          )}
          {recovery && (
            <EditRecovery
              previous={recovery.previous}
              current={
                value ?? {
                  type: token.definition?.type,
                  kind: "token" in i ? i.authoredKind : "No assignment",
                }
              }
              preserved={session}
              reviewed={recovery.reviewed}
              headingRef={reviewHeading}
              onReview={() => {
                setRecovery({ ...recovery, reviewed: true });
                requestAnimationFrame(() => reviewHeading.current?.focus());
              }}
            />
          )}
          {editable || dirty ? (
            <>
              <fieldset disabled={accepting}>
                <legend className="sr-only">Value source</legend>
                <div className="mode-switch border-hairline border-border bg-mode flex p-0.75 rounded-md gap-0.75">
                  <Button
                    variant="mode"
                    size="mode"
                    ref={modeRef}
                    aria-pressed={session.mode === "literal"}
                    onClick={() => {
                      setSession({ ...session, mode: "literal" });
                      setError("");
                    }}
                  >
                    Literal color
                  </Button>
                  <Button
                    variant="mode"
                    size="mode"
                    aria-pressed={session.mode === "reference"}
                    onClick={() => {
                      setSession({ ...session, mode: "reference" });
                      setError("");
                    }}
                  >
                    Reference
                  </Button>
                </div>
              </fieldset>
              {session.mode === "literal" ? (
                <ColorEditor
                  readOnly={accepting || readOnly}
                  session={session}
                  onChange={(s) => {
                    setSession(s);
                    setError("");
                    setNotice("");
                  }}
                  onError={setError}
                />
              ) : (
                <ReferenceFields
                  reference={session.reference}
                  choices={referenceChoices.map(({ authored }) => ({
                    id: authored.id,
                    label: referenceLabels.get(authored.id) ?? authored.id,
                  }))}
                  missingTarget={
                    !project.tokens.some(
                      ({ authored }) => authored.id === session.reference,
                    )
                  }
                  disabled={accepting || readOnly}
                  onReferenceChange={(reference) => {
                    setSession({ ...session, reference, edited: true });
                    setError("");
                  }}
                />
              )}
              <p className="helper text-muted-foreground font-normal preview-detail mt-2 wrap-anywhere">
                Draft preview: {draft.message}
              </p>
              {error ? (
                <p
                  ref={errorRef}
                  tabIndex={-1}
                  className="notification notification-error text-caption mt-4"
                  id="editor-error"
                  role="alert"
                >
                  {error}
                </p>
              ) : (
                <span id="editor-error" />
              )}
              <EditorActions
                cancelDisabled={!dirty || accepting}
                applyDisabled={
                  !dirty ||
                  !editable ||
                  !!targetUnavailable ||
                  (!!recovery && !recovery.reviewed) ||
                  readUnavailable ||
                  readOnly ||
                  accepting ||
                  session.byteInvalid
                }
                applyLabel={
                  accepting
                    ? "Retaining changes…"
                    : recovery?.reviewed
                      ? "Reapply changes"
                      : "Apply changes"
                }
                onCancel={cancel}
                onApply={apply}
              />
              <p
                className="helper text-muted-foreground font-normal"
                role="status"
              >
                {notice ||
                  (dirty
                    ? "Changes are not applied yet."
                    : "Editing preserves name and metadata.")}
              </p>
            </>
          ) : (
            <p className="notification notification-warning text-caption mt-4">
              Inspection only: this token is outside the unconditional
              primitive/semantic color revision flow. Its data is retained.
            </p>
          )}
          {token.layer === "component" && (
            <p role="status" className="helper text-muted-foreground">
              Component association is preserved. Component ownership context is
              unavailable and unverified.
            </p>
          )}
          <section className="applied-summary border-t-hairline border-border mt-7 pt-5">
            <h3 className="mb-3.5">
              {targetUnavailable
                ? "Previous applied · target unavailable"
                : "Currently applied"}
            </h3>
            <div className="text-caption">
              {projected && !value ? (
                "token" in i ? (
                  i.authoredKind
                ) : (
                  "No assignment"
                )
              ) : (
                <AuthoredValue value={value} project={project} approximate />
              )}
            </div>
          </section>
          <TokenMetadata
            token={token}
            groupLabels={groupLabels}
            revision={revision}
            requestSource={requestSource}
            path={i.path}
          />
        </Tabs.Panel>
        <Tabs.Panel value="resolved" className="editor-body bg-surface p-6 touch:p-4">
          <ResolvedTokenPanel
            resolution={i.resolution}
            project={project}
            css={applied.css}
            message={applied.message}
          />
        </Tabs.Panel>
      </Tabs.Root>
      <div className="inspector-foot density:mt-5 small:mt-0 border-t-hairline border-border bg-surface px-6 py-4 mt-auto flex justify-between text-muted-foreground">
        <span>Regeneration</span>
        <span>{token.authoring.regeneration}</span>
      </div>
    </aside>
  );
}
