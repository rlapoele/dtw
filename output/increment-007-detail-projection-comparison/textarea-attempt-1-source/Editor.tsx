import {Summary} from "./Summary";
import type {SelectedEditor,Derived,Preview} from "./projections";
import { Swatch } from "@presentation/components/swatch";
import { InspectionTabs } from "@presentation/components/inspection-tabs";
import { Badge } from "@presentation/components/badge";
import { Field } from "@presentation/components/field";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Tabs } from "@base-ui/react/tabs";
import { createColorLiteral } from "@domain/color-literal";
import type {
  TokenInspection,
  ProjectReadback,
  ApplicationResult,
} from "@application/authoring";
import type { Token } from "@domain/token";
import type { ReviseColorTokenInput } from "@application/authoring";
import { Button } from "@presentation/components/button";
import { Select } from "@presentation/Select";
import { ColorFields } from "@presentation/ColorFields";
import { baseline, eligible, literalIssue } from "@presentation/session";
import { colorPreview } from "@presentation/preview";
import { identityLabels, failureText, pathLabel, resolvedColor } from "@presentation/readback";
export type Feedback = {
  tokenId: string;
  tab: string;
  applied?: string;
  draft?: string;
  appliedMessage: string;
  draftMessage: string;
};
export function Editor({
  data: token,
  derived,
  targetPreview,
  requestPreview,
  rawText,
  requestRaw,
  requestDerived,
  onApply,
  onDirty,
  onFeedback,
  readUnavailable,
}: {
  data:SelectedEditor;
  derived?:Derived;
  targetPreview?:Preview;
  requestPreview:(id:string,context:string)=>void;
  rawText?:string;
  requestRaw:()=>void;
  requestDerived:()=>void;
  onApply: (value: ReviseColorTokenInput["value"]) => ApplicationResult<Token>;
  onDirty: (d: boolean) => void;
  onFeedback: (f: Feedback) => void;
  readUnavailable: boolean;
}) {
  const value = token.baseline;
  const [session, setSession] = useState(() => baseline(value));
  const initial = useRef(session);
  const [tab, setTab] = useState("authored"),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const modeRef = useRef<HTMLButtonElement>(null),
    errorRef = useRef<HTMLParagraphElement>(null);
  const dirty =
    session.edited || session.reference !== initial.current.reference;
  useEffect(() => onDirty(dirty), [dirty, onDirty]);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  const applied = token.preview;
  useEffect(()=>{if(session.mode==="reference")requestPreview(session.reference,JSON.stringify([session.mode,session.reference,session.viewSpace,session.scale]));},[session.mode,session.reference,session.viewSpace,session.scale,requestPreview]);
  const draft =
    session.mode === "literal"
      ? session.byteInvalid
        ? { message: "Unavailable: finish the incomplete byte entries." }
        : colorPreview(session.literal)
      : (targetPreview ?? {message:"Preparing reference preview…"});
  const feedback = {
    tokenId: token.id,
    tab,
    applied: applied.css,
    draft: draft.css,
    appliedMessage: applied.message,
    draftMessage: draft.message,
  };
  const feedbackText = JSON.stringify(feedback);
  useLayoutEffect(
    () => onFeedback(JSON.parse(feedbackText) as Feedback),
    [feedbackText, onFeedback],
  );
  const referenceChoices = token.references;
  const editable = token.editable;
  useEffect(()=>{if(tab==="resolved")requestDerived();},[tab,requestDerived]);
  function apply() {
    if (readUnavailable) {
      setError("Project read unavailable. Retry reading; drafts retained.");
      return;
    }
    if (!editable) return;
    if (
      session.mode === "literal" &&
      (session.byteInvalid || literalIssue(session.literal))
    ) {
      setError(
        session.byteInvalid
          ? "Finish the incomplete byte entries."
          : (literalIssue(session.literal) ?? "Invalid color"),
      );
      return;
    }
    if (session.mode === "reference" && !session.reference) {
      setError("Choose a color target.");
      return;
    }
    const candidate: ReviseColorTokenInput["value"] =
      session.mode === "literal"
        ? { ...session.literal, kind: "literal" }
        : {
            kind: "token-reference",
            targetTokenId: session.reference,
            valuePath: [],
          };
    const result = onApply(candidate);
    if (result.status === "failure") {
      setError("Apply failed. " + failureText(result));
      return;
    }
    const next = baseline(result.value.definition?.assignments[0]?.value);
    initial.current = next;
    setSession(next);
    onDirty(false);
    setError("");
    setNotice("Changes applied for this session.");
    modeRef.current?.focus();
  }
  function cancel() {
    setSession(initial.current);
    onDirty(false);
    setError("");
    setNotice("Both drafts discarded. Applied value unchanged.");
    modeRef.current?.focus();
  }
  return (
    <aside
      className="inspector small:min-h-0 flex min-w-0 min-h-full flex-col bg-surface"
      aria-label="Selected token"
      hidden={readUnavailable}
    >
      <div className="inspector-heading source-compact:p-5 bg-surface">
        <span className="eyebrow uppercase text-muted-foreground font-semibold">
          {token.type ?? "Unassigned"} token
        </span>
        <h2 className="wrap-anywhere">{token.label}</h2>
        <p className="text-caption text-muted-foreground whitespace-pre-wrap wrap-anywhere">
          {token.description ?? "No description"}
        </p>
        <div className="flex gap-2 mt-3">
          <Badge>{token.layer ?? "Unspecified layer"}</Badge>
          <Badge>{editable ? "Unconditional" : "Inspection only"}</Badge>
        </div>
      </div>
      <Tabs.Root value={tab} onValueChange={setTab}>
        <InspectionTabs />
        <Tabs.Panel
          value="authored"
          className="editor-body source-compact:p-5 bg-surface p-6"
        >
          {editable ? (
            <>
              <div className="section-title flex items-center justify-between mb-5">
                <h3>Value</h3>
                {dirty && <Badge>Draft</Badge>}
              </div>
              <fieldset>
                <legend>Value source</legend>
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
                  session={session}
                  onChange={(s) => {
                    setSession(s);
                    setError("");
                    setNotice("");
                  }}
                  onError={setError}
                />
              ) : (
                <>
                  <Field>
                    Target token
                    <Select
                      value={session.reference}
                      aria-describedby="reference-note editor-error"
                      onChange={(e) => {
                        setSession({
                          ...session,
                          reference: e.target.value,
                          edited: true,
                        });
                        setError("");
                      }}
                    >
                      <option value="">Choose a color token…</option>
                      {session.reference &&
                        !referenceChoices.some(t => t.id === session.reference) && (
                          <option value={session.reference}>
                            Missing target
                          </option>
                        )}
                      {referenceChoices.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                    </Select>
                  </Field>
                  <p
                    id="reference-note"
                    className="helper text-muted-foreground font-normal"
                  >
                    Whole color value. Alias chains remain linked by identity;
                    cycles are rejected on Apply.
                  </p>
                </>
              )}
              <p className="helper text-muted-foreground font-normal preview-detail mt-3 wrap-anywhere">
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
              <div className="editor-actions sticky z-1 flex justify-end gap-2 mt-5.5 mb-2.5 border-t border-border bg-surface py-3">
                <Button disabled={!dirty} onClick={cancel}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  disabled={!dirty || readUnavailable || session.byteInvalid}
                  onClick={apply}
                >
                  Apply changes
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
          <section className="applied-summary border-t border-border mt-7 pt-5">
            <h3 className="mb-3.5">Currently applied</h3>
            <div className="text-caption"><Summary data={token.summary} /></div>
          </section>
          <section className="applied-summary border-t border-border mt-7 pt-5">
            <h3 className="mb-3.5">Metadata · read only</h3>
            <dl className="details">
              <div className="flex justify-between gap-4 py-2.5 border-b border-border text-caption">
                <dt className="text-muted-foreground">Regeneration</dt>
                <dd className="text-right wrap-anywhere">
                  {token.regeneration}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5 border-b border-border text-caption">
                <dt className="text-muted-foreground">Semantic role</dt>
                <dd className="text-right wrap-anywhere">
                  {token.semanticRole ?? "Unspecified"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5 border-b border-border text-caption">
                <dt className="text-muted-foreground">Parent group</dt>
                <dd className="text-right wrap-anywhere">
                  {token.parentLabel}
                </dd>
              </div>
            </dl>
            <details onToggle={e=>{if(e.currentTarget.open)requestRaw();}}>
              <summary>All authored data</summary>
              {rawText===undefined?<p role="status">Preparing authored data…</p>:<textarea data-raw="complete" readOnly wrap="off" rows={30} aria-label="All authored data exact text" className="exact-data raw-source raw-textarea text-caption my-3 max-w-full" value={rawText} />}
            </details>
          </section>
        </Tabs.Panel>
        <Tabs.Panel
          value="resolved"
          className="editor-body source-compact:p-5 bg-surface p-6"
        >
          <div className="section-title flex items-center mb-5 resolved-heading flex-wrap justify-start gap-2">
            <h3>Resolved value</h3>
            <Badge>Applied value</Badge>
          </div>
          <div className="resolved-preview flex flex-col items-stretch gap-2 my-5.5">
            <Swatch css={applied.css} />
            <p className="helper text-muted-foreground font-normal">
              {applied.message}
            </p>
          </div>
          {derived===undefined?<p role="status">Preparing resolved value and trace…</p>:derived.status==='unavailable'?<p role="status">{derived.reason}. Authored data retained.</p>:<>
          {derived.resolved!==undefined?<pre className="exact-data raw-source text-caption my-3 max-w-full">{derived.resolved}</pre>:<p role="status">Unresolved: {derived.reason}. Authored data retained.</p>}
          <h3 className="trace-heading mt-7">Resolution trace</h3>
          <ol className="trace list-none mt-4.5 mb-6 p-0">{derived.trace.map((step,index)=><li className="relative pb-6 pl-6" key={index}><span className="trace-dot size-2.75 left-0 top-1 border-2 border-trace bg-background absolute rounded-full"/><strong className="block text-caption font-medium wrap-anywhere">{step.label}</strong><small className="mono block mt-1 text-muted-foreground">{step.id}{step.target?` → ${step.target}`:' · authored value'}</small></li>)}</ol>
          <h3>Resolution diagnostics</h3><pre className="exact-data raw-source text-caption my-3 max-w-full">{derived.diagnostics}</pre></>}

        </Tabs.Panel>
      </Tabs.Root>
      <div className="inspector-foot density:mt-5 small:mt-0 border-t border-border bg-surface px-6 py-4 mt-auto flex justify-between text-muted-foreground">
        <span>Regeneration</span>
        <span>{token.regeneration}</span>
      </div>
    </aside>
  );
}
