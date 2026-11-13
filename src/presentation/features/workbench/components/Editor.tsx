import { ReferenceFields } from './ReferenceFields';
import { TokenMetadata } from './TokenMetadata';
import { ResolvedTokenPanel } from './ResolvedTokenPanel';
import { useTokenEditor } from "@presentation/features/workbench/hooks/useTokenEditor";

import { AuthoredValue } from "@presentation/features/workbench/components/AuthoredValue";
import { InspectionTabs } from "@presentation/features/workbench/components/inspection-tabs";
import { Badge } from "@presentation/components/ui/badge";

import { Tabs } from "@base-ui/react/tabs";

import { Button } from "@presentation/components/ui/button";
import { ColorFields } from "@presentation/features/workbench/components/ColorFields";

export type Feedback = {
  tokenId: string;
  tab: string;
  applied?: string;
  draft?: string;
  appliedMessage: string;
  draftMessage: string;
};
export function Editor(props: Parameters<typeof useTokenEditor>[0]) {
  return <EditorFields editor={useTokenEditor(props)} />;
}
export function EditorFields({
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
  return (
    <aside
      className="inspector small:min-h-0 flex min-w-0 min-h-full flex-col bg-surface"
      aria-label="Selected token"
      hidden={readUnavailable}
    >
      <div className="inspector-heading bg-surface p-3">
        <span className="eyebrow uppercase text-muted-foreground font-semibold">
          {token.definition?.type ?? "Unassigned"} token
        </span>
        <h2 className="wrap-anywhere">
          {tokenLabels.get(token.id) ??
            (token.localName || "(unnamed original token)")}
        </h2>
        {token.description && <p className="text-caption text-muted-foreground whitespace-pre-wrap wrap-anywhere">
          {token.description}
        </p>}
        {i.path.status !== "derived" && <p className="text-caption wrap-anywhere">Path unavailable · Parent identity: {JSON.stringify(token.parentGroupId)}. Exact namespace details remain available below.</p>}
        <div className="flex gap-2">
          {token.layer && <Badge>{token.layer}</Badge>}
          {!editable && <Badge>Inspection only</Badge>}
        </div>
      </div>
      <Tabs.Root value={tab} onValueChange={setTab}>
        <InspectionTabs />
        <Tabs.Panel
          value="authored"
          className="editor-body bg-surface p-3"
        >
          {targetUnavailable && (
            <p
              role="status"
              className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive"
            >
              {targetUnavailable} Preserved input remains selectable. This
              action cannot recreate or retarget it.
            </p>
          )}
          {recovery && (
            <section className="border border-border rounded p-3 text-caption mb-4">
              <h3 ref={reviewHeading} tabIndex={-1}>
                Applied state changed
              </h3>
              <p>
                Raw literal/reference input and view/scale choices are
                preserved. Review opens a comparison; only Reapply changes
                submits a fresh command.
              </p>
              {!recovery.reviewed ? (
                <Button
                  onClick={() => {
                    setRecovery({ ...recovery, reviewed: true });
                    requestAnimationFrame(() => reviewHeading.current?.focus());
                  }}
                >
                  Review edit
                </Button>
              ) : (
                <>
                  <h4 className="mt-3">Previous applied</h4>
                  <pre className="whitespace-pre-wrap wrap-anywhere">
                    {JSON.stringify(recovery.previous ?? null, null, 2)}
                  </pre>
                  <h4 className="mt-3">Current applied</h4>
                  <pre className="whitespace-pre-wrap wrap-anywhere">
                    {JSON.stringify(
                      value ?? {
                        type: token.definition?.type,
                        kind: "token" in i ? i.authoredKind : "No assignment",
                      },
                      null,
                      2,
                    )}
                  </pre>
                  <h4 className="mt-3">Preserved input</h4>
                  <pre className="whitespace-pre-wrap wrap-anywhere">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </>
              )}
            </section>
          )}
          {editable || dirty ? (
            <>
              <fieldset disabled={accepting}>
                <legend className="sr-only">Value source</legend>
                <div className="mode-switch border border-border bg-mode flex p-0.75 rounded-md gap-0.75">
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
                <ColorFields
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
                <ReferenceFields session={session} tokens={project.tokens} choices={referenceChoices} labels={referenceLabels} onChange={next => {setSession(next);setError("");}} />
              )}
              <p className="helper text-muted-foreground font-normal preview-detail mt-2 wrap-anywhere">
                Draft preview: {draft.message}
              </p>
              {error ? (
                <p
                  ref={errorRef}
                  tabIndex={-1}
                  className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4"
                  id="editor-error"
                  role="alert"
                >
                  {error}
                </p>
              ) : (
                <span id="editor-error" />
              )}
              <div className="editor-actions sticky z-1 flex justify-end gap-2 mt-3 mb-2 border-t border-border bg-surface py-3">
                <Button disabled={!dirty || accepting} onClick={cancel}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  disabled={
                    !dirty ||
                    !editable ||
                    !!targetUnavailable ||
                    (!!recovery && !recovery.reviewed) ||
                    readUnavailable ||
                    readOnly ||
                    accepting ||
                    session.byteInvalid
                  }
                  onClick={apply}
                >
                  {accepting
                    ? "Retaining changes…"
                    : recovery?.reviewed
                      ? "Reapply changes"
                      : "Apply changes"}
                </Button>
              </div>
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
            <p className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4">
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
          <section className="applied-summary border-t border-border mt-7 pt-5">
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
                <AuthoredValue value={value} project={project} />
              )}
            </div>
          </section>
          <TokenMetadata token={token} groupLabels={groupLabels} revision={revision} requestSource={requestSource} path={i.path} />
        </Tabs.Panel>
        <Tabs.Panel
          value="resolved"
          className="editor-body bg-surface p-3"
        >
          <ResolvedTokenPanel resolution={i.resolution} project={project} css={applied.css} message={applied.message} />
        </Tabs.Panel>
      </Tabs.Root>
      <div className="inspector-foot density:mt-5 small:mt-0 border-t border-border bg-surface px-6 py-4 mt-auto flex justify-between text-muted-foreground">
        <span>Regeneration</span>
        <span>{token.authoring.regeneration}</span>
      </div>
    </aside>
  );
}
