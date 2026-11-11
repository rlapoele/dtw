import { ExactSource } from "./ExactSource";
import type { SelectedToken } from "@application/retention/projections";
import type { ProjectContext } from "@application/retention/projections";
import { AuthoredValue } from "@presentation/features/workbench/components/AuthoredValue";
import { Swatch } from "@presentation/features/workbench/components/swatch";
import { InspectionTabs } from "@presentation/features/workbench/components/inspection-tabs";
import { Badge } from "@presentation/components/ui/badge";
import { Field } from "@presentation/components/ui/field";
import { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
import { Tabs } from "@base-ui/react/tabs";
import { createColorLiteral } from "@domain/color-literal";
import type {
  TokenInspection,
  ApplicationResult,
} from "@application/authoring";
import type { Token } from "@domain/token";
import type { ReviseColorTokenInput } from "@application/authoring";
import { Button } from "@presentation/components/ui/button";
import { Select } from "@presentation/components/ui/select";
import { ColorFields } from "@presentation/features/workbench/components/ColorFields";
import {
  baseline,
  refreshCleanSession,
  eligible,
  literalIssue,
} from "@presentation/features/workbench/state/session";
import { colorPreview } from "@presentation/features/workbench/color/preview";
import {
  identityLabels,
  failureText,
  pathLabel,
  resolvedColor,
} from "@presentation/features/workbench/readback";
export type Feedback = {
  tokenId: string;
  tab: string;
  applied?: string;
  draft?: string;
  appliedMessage: string;
  draftMessage: string;
};
export function Editor({
  inspection: i,
  project,
  inspect,
  onApply,
  onDirty,
  onFeedback,
  readUnavailable,
  revision = "session",
  requestSource,
  readOnly = false,
  targetUnavailable,
}: {
  inspection: TokenInspection | SelectedToken;
  project: ProjectContext;
  inspect: (id: string) =>
    | {
        resolution: {
          status: string;
          value?: import("@domain/token-resolution").ResolvedValue;
        };
      }
    | undefined;
  onApply: (
    value: ReviseColorTokenInput["value"],
  ) =>
    | ApplicationResult<Pick<Token, "definition">>
    | Promise<ApplicationResult<Pick<Token, "definition">>>;
  onDirty: (d: boolean) => void;
  onFeedback: (f: Feedback) => void;
  readUnavailable: boolean;
  revision?: string;
  requestSource?: () => Promise<string>;
  readOnly?: boolean;
  targetUnavailable?: string;
}) {
  const projected = "token" in i;
  const token = projected ? i.token : i.authored,
    value = projected
      ? i.authoredValue
      : i.authored.definition?.assignments[0]?.value;
  const [accepting, setAccepting] = useState(false);
  const [session, setSession] = useState(() => baseline(value));
  const initial = useRef(session);
  const baselineRevision = useRef({
    revision,
    value: JSON.stringify({ token, value }),
    previous: value,
  });
  const [recovery, setRecovery] = useState<{
    previous: typeof value;
    reviewed: boolean;
  }>();
  const reviewHeading = useRef<HTMLHeadingElement>(null);

  const [tab, setTab] = useState("authored"),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const modeRef = useRef<HTMLButtonElement>(null),
    errorRef = useRef<HTMLParagraphElement>(null);
  const dirty =
    session.edited || session.reference !== initial.current.reference;
  useEffect(() => onDirty(dirty), [dirty, onDirty]);
  useEffect(() => {
    const before = baselineRevision.current;
    if (before.revision !== revision) {
      if (dirty && before.value !== JSON.stringify({ token, value }))
        setRecovery({ previous: before.previous, reviewed: false });
      if (!dirty) {
        const next = refreshCleanSession(session, value);
        initial.current = next;
        setSession(next);
        setRecovery(undefined);
      }
      baselineRevision.current = {
        revision,
        value: JSON.stringify({ token, value }),
        previous: value,
      };
    }
  }, [revision, value, dirty]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  const applied = colorPreview(resolvedColor(i));
  const targetInspection =
    session.reference !== null ? inspect(session.reference) : undefined;
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
  const tokenLabels = useMemo(
    () => identityLabels(project.tokens),
    [project.tokens],
  );
  const referenceChoices = useMemo(
    () => project.tokens.filter((t) => t.authored.definition?.type === "color"),
    [project.tokens],
  );
  const referenceLabels = useMemo(
    () => identityLabels(referenceChoices, undefined, token.id),
    [referenceChoices, token.id],
  );
  const groupLabels = useMemo(
    () => identityLabels(project.groups, ["Project root", "All tokens"]),
    [project.groups],
  );
  const editable = projected ? i.editable : eligible(i.authored);
  async function apply() {
    if (
      accepting ||
      readOnly ||
      targetUnavailable ||
      (recovery && !recovery.reviewed)
    )
      return;
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
    if (session.mode === "reference" && session.reference === null) {
      setError("Choose a color target.");
      return;
    }
    const candidate: ReviseColorTokenInput["value"] =
      session.mode === "literal"
        ? { ...session.literal, kind: "literal" }
        : {
            kind: "token-reference",
            targetTokenId: session.reference!,
            valuePath: [],
          };
    setAccepting(true);
    let result: ApplicationResult<Pick<Token, "definition">>;
    try {
      result = await onApply(candidate);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Apply outcome unavailable. Drafts retained.",
      );
      setAccepting(false);
      return;
    }
    setAccepting(false);
    if (result.status === "failure") {
      setError("Apply failed. " + failureText(result));
      return;
    }
    const next = baseline(result.value.definition?.assignments[0]?.value);
    initial.current = next;
    baselineRevision.current = {
      revision,
      value: JSON.stringify(result.value.definition?.assignments[0]?.value),
      previous: result.value.definition?.assignments[0]?.value,
    };
    setRecovery(undefined);
    setSession(next);
    onDirty(false);
    setError("");
    setNotice("Changes applied and retained.");
    modeRef.current?.focus();
  }
  function cancel() {
    const currentBaseline = baseline(value);
    initial.current = currentBaseline;
    setSession(currentBaseline);
    setRecovery(undefined);
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
          {token.definition?.type ?? "Unassigned"} token
        </span>
        <h2 className="wrap-anywhere">
          {tokenLabels.get(token.id) ??
            (token.localName || "(unnamed original token)")}
        </h2>
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
                        kind: projected ? i.authoredKind : "No assignment",
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
              <div className="section-title flex items-center justify-between mb-5">
                <h3>Value</h3>
                {dirty && <Badge>Draft</Badge>}
              </div>
              <fieldset disabled={accepting}>
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
                <>
                  <Field>
                    Target token
                    <Select
                      value={
                        session.reference === null
                          ? ""
                          : JSON.stringify(session.reference)
                      }
                      aria-describedby="reference-note editor-error"
                      onChange={(e) => {
                        setSession({
                          ...session,
                          reference:
                            e.target.value === ""
                              ? null
                              : (JSON.parse(e.target.value) as string),
                          edited: true,
                        });
                        setError("");
                      }}
                    >
                      <option value="">Choose a color token…</option>
                      {session.reference !== null &&
                        !project.tokens.some(
                          (t) => t.authored.id === session.reference,
                        ) && (
                          <option
                            value={
                              session.reference === null
                                ? ""
                                : JSON.stringify(session.reference)
                            }
                          >
                            Missing target
                          </option>
                        )}
                      {referenceChoices.map((t) => (
                        <option
                          key={t.authored.id}
                          value={JSON.stringify(t.authored.id)}
                        >
                          {referenceLabels.get(t.authored.id)}
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
                i.authoredKind
              ) : (
                <AuthoredValue value={value} project={project} />
              )}
            </div>
          </section>
          <section className="applied-summary border-t border-border mt-7 pt-5">
            <h3 className="mb-3.5">Metadata · read only</h3>
            <dl className="details">
              <div className="flex justify-between gap-4 py-2.5 border-b border-border text-caption">
                <dt className="text-muted-foreground">Regeneration</dt>
                <dd className="text-right wrap-anywhere">
                  {token.authoring.regeneration}
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
                  {token.parentGroupId !== null
                    ? (groupLabels.get(token.parentGroupId) ?? "Missing group")
                    : "Project root"}
                </dd>
              </div>
            </dl>
            <ExactSource
              key={`${token.id}-${revision}`}
              revision={revision}
              request={
                requestSource ??
                (() => Promise.resolve(JSON.stringify(token, null, 2)))
              }
            />
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
          {i.resolution.status === "resolved" ? (
            <pre className="exact-data whitespace-pre-wrap text-caption my-3 max-w-full wrap-anywhere">
              {JSON.stringify(i.resolution.value, null, 2)}
            </pre>
          ) : (
            <p
              className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4"
              role="status"
            >
              Unresolved: {i.resolution.reason}. Authored data retained.
            </p>
          )}
          <h3 className="trace-heading mt-7">Resolution trace</h3>
          <ol className="trace list-none mt-4.5 mb-6 p-0">
            {i.resolution.trace.map((step, index) => {
              const t = project.tokens.find(
                (t) => t.authored.id === step.tokenId,
              );
              return (
                <li className="relative pb-6 pl-6" key={index}>
                  <span className="trace-dot size-2.75 left-0 top-1 border-2 border-trace bg-background absolute rounded-full" />
                  <strong className="block text-caption font-medium wrap-anywhere">
                    {t ? pathLabel(t.path) : step.tokenId}
                  </strong>
                  <small className="mono block mt-1 text-muted-foreground">
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
          <pre className="exact-data whitespace-pre-wrap text-caption my-3 max-w-full wrap-anywhere">
            {JSON.stringify(i.resolution.diagnostics, null, 2)}
          </pre>
        </Tabs.Panel>
      </Tabs.Root>
      <div className="inspector-foot density:mt-5 small:mt-0 border-t border-border bg-surface px-6 py-4 mt-auto flex justify-between text-muted-foreground">
        <span>Regeneration</span>
        <span>{token.authoring.regeneration}</span>
      </div>
    </aside>
  );
}
