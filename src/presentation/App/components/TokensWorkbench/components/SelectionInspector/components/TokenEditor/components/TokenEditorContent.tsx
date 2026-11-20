import { InspectorSection } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/InspectorSection";
import { ExactSource } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/ExactSource";
import { Button } from "@presentation/ui/button";
import { literalIssue } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/state/editor-session";
import { hexPreview } from "@presentation/App/components/TokensWorkbench/helpers/hex-preview";
import { resolvedColor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/helpers/resolved-color";
import { useId, useLayoutEffect, useRef } from "react";
import { TokenValueComparison } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenValueComparison";
import { EditorActions } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/EditorActions";
import { EditRecovery } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/EditRecovery";
import { ReferenceFields } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/ReferenceFields";
import { TokenMetadata } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenMetadata";
import { ResolvedTokenPanel } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/ResolvedTokenPanel";
import type { useTokenEditor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor";

import { AuthoredValue } from "@presentation/App/components/TokensWorkbench/components/AuthoredValue";
import { TokenEditorTabs } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenEditorTabs";
import { Select } from "@presentation/ui/select";


import { Tabs } from "@base-ui/react/tabs";

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
    recovery,
    reviewHeading,
    tab,
    error,
    notice,
    modeRef,
    layerRef,
    errorRef,
    dirty,
    applied,
    draft,
    tokenLabels,
    referenceChoices,
    referenceLabels,
    groupLabels,
    editable,
    changeMode,
    changeLayer,
    changeReference,
    changeColorDraft,
    reportColorError,
    selectTab,
    reviewRecovery,
    apply,
    cancel,
    readUnavailable,
    revision,
    requestSource,
    readOnly,
    targetUnavailable,
  } = editor;
  const { sections, toggleSection, descriptionRef, changeDescription, revealDescription } = editor;
  const disabled = !editable || accepting || readOnly || readUnavailable || !!targetUnavailable || (!!recovery && !recovery.reviewed);
  const invalid = session.mode === "literal" ? session.hexInvalid || session.byteInvalid || !!literalIssue(session.literal) : session.reference === null;
  const descriptionId = useId();
  const modeName = useId();
  const layerId = useId();
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
  const appliedHex = hexPreview(
    value?.kind === "literal" && value.valueType === "color" ? value : resolvedColor(i),
  );
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
      <div className="px-6 touch:px-4">
        <InspectorSection title="Edit token" open={sections.edit} onToggle={() => toggleSection("edit")}
          badge={!sections.edit && dirty ? "Unapplied changes" : !editable ? "Inspection only" : undefined}
          footer={<div className="pb-4">
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
                current={{ value, layer: token.layer ?? null, description: token.description }}
                preserved={session}
                reviewed={recovery.reviewed}
                headingRef={reviewHeading}
                onReview={reviewRecovery}
              />
            )}
            {(editable || dirty) && <>
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
                {!sections.edit && invalid && <Button onClick={revealDescription}>Open editable fields</Button>}
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
                    invalid
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
                      : "")}
                </p>
            </>}
          </div>}>
          {(editable || dirty) ? <>
            <label htmlFor={descriptionId} className="block text-caption font-medium mb-1.75">Description</label>
            <textarea id={descriptionId} ref={descriptionRef} rows={3} value={session.description} disabled={disabled}
              onChange={event => changeDescription(event.target.value)}
              className="block w-full min-w-0 rounded-md border-2 border-input bg-background text-foreground px-2.5 py-2 text-caption resize-y mb-4.25" />
          <div className="w-full mb-4.25">
            <label htmlFor={layerId} className="block text-caption font-medium mb-1">Layer</label>
            <Select id={layerId} ref={layerRef} value={session.layer ?? ""}
              aria-describedby={`${layerId}-help`}
              disabled={!editable || accepting || readOnly || readUnavailable || !!targetUnavailable || (!!recovery && !recovery.reviewed)}
              onChange={event => changeLayer(event.target.value === "" ? null : event.target.value as "primitive" | "semantic")}>
              <option value="">Unspecified</option>
              <option value="primitive">Primitive</option>
              <option value="semantic">Semantic</option>
              <option value="component" disabled>Component</option>
            </Select>
            <p id={`${layerId}-help`} className="text-caption text-muted-foreground mt-2">Component requires a component association; editing it is not available yet.</p>
          </div>
                <fieldset disabled={disabled} className="mb-0">
                  <legend className="sr-only">Value source</legend>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {(["literal", "reference"] as const).map(mode => <label key={mode} className="inline-flex min-h-9 items-center gap-2 text-caption cursor-pointer">
                      <input
                        type="radio"
                        name={modeName}
                        value={mode}
                        ref={mode === "literal" ? modeRef : undefined}
                        checked={session.mode === mode}
                        onChange={() => changeMode(mode)}
                        className="size-4 shrink-0 accent-primary disabled:cursor-default"
                      />
                      {mode === "literal" ? "Literal color" : "Reference"}
                    </label>)}
                  </div>
                </fieldset>
                <div className="mt-4.25">{session.mode === "literal" ? (
                  <ColorEditor
                    readOnly={disabled}
                    session={session}
                    onChange={changeColorDraft}
                    onError={reportColorError}
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
                    disabled={disabled}
                    onReferenceChange={changeReference}
                  />
                )}
                </div>
                <p className="helper text-muted-foreground font-normal preview-detail mt-2 wrap-anywhere">
                  Draft preview: {draft.message}
                </p>
          </> : <p className="notification notification-warning text-caption">Inspection only: this token is outside the unconditional primitive/semantic color revision flow. Its data is retained.</p>}
        </InspectorSection>
      </div>
      <Tabs.Root value={tab} onValueChange={selectTab}>
        <TokenEditorTabs />
        <Tabs.Panel value={tab} className="editor-body bg-surface px-6 pb-6 touch:px-4 touch:pb-4">
          {tab === "authored" ? <>
            {token.layer === "component" && (
              <p role="status" className="helper text-muted-foreground">
                Component association is preserved. Component ownership context is
                unavailable and unverified.
              </p>
            )}
            <InspectorSection title={targetUnavailable ? "Previous applied · target unavailable" : "Currently applied"} open={sections.applied} onToggle={() => toggleSection("applied")}>
              <dl className="text-caption mb-3"><dt className="text-muted-foreground">Description</dt><dd className="whitespace-pre-wrap wrap-anywhere">{token.description ?? "No description"}</dd><dt className="text-muted-foreground mt-3">Layer</dt><dd>{token.layer ?? "Unspecified"}</dd></dl>
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
              <dl className="details text-caption">
                <div className="flex justify-between gap-4 py-2.5 border-b-hairline border-border">
                  <dt className="text-muted-foreground">HEX (sRGB preview)</dt>
                  <dd className="text-right min-w-0 wrap-anywhere font-mono"
                    title={appliedHex}>
                    {appliedHex.match(/#[0-9A-F]{6}$/)?.[0] ?? "Unavailable"}
                  </dd>
                </div>
              </dl>
            </InspectorSection>
            <InspectorSection title="Metadata" open={sections.metadata} onToggle={() => toggleSection("metadata")}><TokenMetadata
              token={token}
              groupLabels={groupLabels}
              path={i.path}
            /></InspectorSection>
            <ExactSource key={revision} revision={revision} expanded={sections.source} onToggle={() => toggleSection("source")} request={requestSource ?? (() => Promise.resolve(JSON.stringify("authored" in i ? i.authored : token, null, 2)))} />
          </> : (
            <ResolvedTokenPanel
              sections={sections}
              onToggle={toggleSection}
              revision={revision}
              resolution={i.resolution}
              project={project}
              css={applied.css}
              message={applied.message}
            />
          )}
        </Tabs.Panel>
      </Tabs.Root>
    </aside>
  );
}
