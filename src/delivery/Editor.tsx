import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Tabs } from "@base-ui/react/tabs";
import { createColorLiteral } from "../domain/color-literal";
import type {
  TokenInspection,
  ProjectReadback,
  ApplicationResult,
} from "../application/authoring";
import type { Token } from "../domain/token";
import type { ReviseColorTokenInput } from "../application/authoring";
import { Button } from "./components/button";
import { Select } from "./Select";
import { ColorFields } from "./ColorFields";
import { baseline, eligible, literalIssue } from "./session";
import { colorPreview } from "./preview";
import { failureText, pathLabel, resolvedColor } from "./readback";
export type Feedback = {
  tokenId: string;
  tab: string;
  applied?: string;
  draft?: string;
  appliedMessage: string;
  draftMessage: string;
};
export function Swatch({ css }: { css?: string }) {
  return (
    <span
      className={`swatch ${css ? "" : "swatch-unavailable"}`}
      aria-hidden="true"
    >
      <span style={{ background: css }} />
    </span>
  );
}
export function Editor({
  inspection: i,
  project,
  inspect,
  onApply,
  onDirty,
  onFeedback,
  readUnavailable,
}: {
  inspection: TokenInspection;
  project: ProjectReadback;
  inspect: (id: string) => TokenInspection | undefined;
  onApply: (value: ReviseColorTokenInput["value"]) => ApplicationResult<Token>;
  onDirty: (d: boolean) => void;
  onFeedback: (f: Feedback) => void;
  readUnavailable: boolean;
}) {
  const token = i.authored,
    value = token.definition?.assignments[0]?.value;
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
  const applied = colorPreview(resolvedColor(i));
  const targetInspection = session.reference
    ? inspect(session.reference)
    : undefined;
  const draft =
    session.mode === "literal"
      ? session.byteInvalid
        ? { message: "Unavailable: finish the incomplete byte entries." }
        : colorPreview(session.literal)
      : colorPreview(resolvedColor(targetInspection));
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
  const editable = eligible(token);
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
      className="inspector"
      aria-label="Selected token"
      hidden={readUnavailable}
    >
      <div className="inspector-heading">
        <span className="eyebrow">
          {token.definition?.type ?? "Unassigned"} token
        </span>
        <h2>{pathLabel(i.path)}</h2>
        <p>{token.description ?? "No description"}</p>
        <div className="flex gap-2 mt-3">
          <span className="badge">{token.layer ?? "Unspecified layer"}</span>
          <span className="badge">
            {editable ? "Unconditional" : "Inspection only"}
          </span>
        </div>
        <p className="helper mono break-words">Token {token.id}</p>
      </div>
      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List className="tabs" aria-label="Token inspection">
          <Tabs.Tab value="authored">Authored value</Tabs.Tab>
          <Tabs.Tab value="resolved">Resolved &amp; trace</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="authored" className="editor-body">
          {editable ? (
            <>
              <div className="section-title">
                <h3>Value</h3>
                {dirty && <span className="badge">Draft</span>}
              </div>
              <fieldset>
                <legend>Value source</legend>
                <div className="mode-switch">
                  <Button
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
                  <label className="field">
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
                        !project.tokens.some(
                          (t) => t.authored.id === session.reference,
                        ) && (
                          <option value={session.reference}>
                            Missing target · {session.reference}
                          </option>
                        )}
                      {project.tokens
                        .filter((t) => t.authored.definition?.type === "color")
                        .map((t) => (
                          <option key={t.authored.id} value={t.authored.id}>
                            {pathLabel(t.path)} · {t.authored.id}
                            {t.authored.id === token.id ? " (this token)" : ""}
                          </option>
                        ))}
                    </Select>
                  </label>
                  <p id="reference-note" className="helper">
                    Whole color value. Alias chains remain linked by identity;
                    cycles are rejected on Apply.
                  </p>
                </>
              )}
              <p className="helper preview-detail">
                Draft preview: {draft.message}
              </p>
              {error ? (
                <p
                  ref={errorRef}
                  tabIndex={-1}
                  className="error"
                  id="editor-error"
                  role="alert"
                >
                  {error}
                </p>
              ) : (
                <span id="editor-error" />
              )}
              <div className="editor-actions">
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
              <p className="helper" role="status">
                {notice ||
                  (dirty
                    ? "Changes are not applied yet."
                    : "Editing preserves name and metadata.")}
              </p>
            </>
          ) : (
            <p className="error">
              Inspection only: this token is outside the unconditional
              primitive/semantic color revision flow. Its data is retained.
            </p>
          )}
          <section className="applied-summary">
            <h3>Currently applied</h3>
            <pre className="exact-data">{JSON.stringify(value, null, 2)}</pre>
          </section>
          <section className="applied-summary">
            <h3>Metadata · read only</h3>
            <dl className="details">
              <div>
                <dt>Regeneration</dt>
                <dd>{token.authoring.regeneration}</dd>
              </div>
              <div>
                <dt>Semantic role</dt>
                <dd>{token.semanticRole ?? "Unspecified"}</dd>
              </div>
              <div>
                <dt>Parent group ID</dt>
                <dd>{token.parentGroupId ?? "Project root"}</dd>
              </div>
            </dl>
            <details>
              <summary>All authored data</summary>
              <pre className="exact-data">{JSON.stringify(token, null, 2)}</pre>
            </details>
          </section>
        </Tabs.Panel>
        <Tabs.Panel value="resolved" className="editor-body">
          <div className="section-title resolved-heading">
            <h3>Resolved value</h3>
            <span className="badge">Applied value</span>
          </div>
          <div className="resolved-preview">
            <Swatch css={applied.css} />
            <p className="helper">{applied.message}</p>
          </div>
          {i.resolution.status === "resolved" ? (
            <pre className="exact-data">
              {JSON.stringify(i.resolution.value, null, 2)}
            </pre>
          ) : (
            <p className="error" role="status">
              Unresolved: {i.resolution.reason}. Authored data retained.
            </p>
          )}
          <h3 className="trace-heading">Resolution trace</h3>
          <ol className="trace">
            {i.resolution.trace.map((step, index) => {
              const t = project.tokens.find(
                (t) => t.authored.id === step.tokenId,
              );
              return (
                <li key={index}>
                  <span className="trace-dot" />
                  <strong>{t ? pathLabel(t.path) : step.tokenId}</strong>
                  <small className="mono">
                    {step.tokenId}
                    {step.targetTokenId
                      ? ` → ${step.targetTokenId}`
                      : " · authored value"}
                  </small>
                </li>
              );
            })}
          </ol>
          <h3>Resolution diagnostics</h3>
          <pre className="exact-data">
            {JSON.stringify(i.resolution.diagnostics, null, 2)}
          </pre>
        </Tabs.Panel>
      </Tabs.Root>
      <div className="inspector-foot">
        <span>Regeneration</span>
        <span>{token.authoring.regeneration}</span>
      </div>
    </aside>
  );
}
