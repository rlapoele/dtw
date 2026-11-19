import { useOutcomeFeedback } from "@presentation/App/components/OutcomeFeedback/OutcomeFeedback";
import type { SelectedToken } from "@application/retention/projections";
import type { ProjectContext } from "@application/retention/projections";

import { useEffect, useRef, useState, useMemo } from "react";

import type {
  TokenInspection,
  ApplicationResult,
} from "@application/authoring";
import type { Token } from "@domain/token";
import type { ReviseColorTokenInput } from "@application/authoring";

import {
  type DraftSession,
  baseline,
  refreshCleanSession,
  eligible,
  literalIssue,
} from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/state/editor-session";
import { colorPreview } from "@presentation/App/components/TokensWorkbench/helpers/color-preview";
import { identityLabels } from "@presentation/App/components/TokensWorkbench/helpers/identity-labels";
import { failureText } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/helpers/editor-failure";
import { resolvedColor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/helpers/resolved-color";
export function useTokenEditor({
  inspection: i,
  project,
  inspect,
  onApply,
  onDirty,
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
    layer?: ReviseColorTokenInput["layer"],
  ) =>
    | ApplicationResult<Pick<Token, "definition" | "layer">>
    | Promise<ApplicationResult<Pick<Token, "definition" | "layer">>>;
  onDirty: (d: boolean) => void;
  readUnavailable: boolean;
  revision?: string;
  requestSource?: () => Promise<string>;
  readOnly?: boolean;
  targetUnavailable?: string;
}) {
  const outcomes = useOutcomeFeedback();
  const projected = "token" in i;
  const token = projected ? i.token : i.authored,
    value = projected
      ? i.authoredValue
      : i.authored.definition?.assignments[0]?.value;
  const [accepting, setAccepting] = useState(false);
  const [session, setSession] = useState(() => baseline(value, token.layer ?? null));
  const initial = useRef(session);
  const baselineRevision = useRef({
    revision,
    value: JSON.stringify({ token, value }),
    previous: { value, layer: token.layer ?? null },
  });
  const [recovery, setRecovery] = useState<{
    previous: { value: typeof value; layer: DraftSession["layer"] };
    reviewed: boolean;
  }>();
  const reviewHeading = useRef<HTMLHeadingElement>(null);

  const [tab, setTab] = useState("authored"),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const layerRef = useRef<HTMLSelectElement>(null);
  const modeRef = useRef<HTMLInputElement>(null),
    errorRef = useRef<HTMLParagraphElement>(null);
  const [restoreApplyFocus, setRestoreApplyFocus] = useState(false);
  useEffect(() => {
    if (restoreApplyFocus && !accepting) {
      // The mode radio inherits disabled from the retaining fieldset. Focus
      // only after React commits the successful, re-enabled editor.
      (tab === "authored" ? modeRef.current : layerRef.current)?.focus();
      setRestoreApplyFocus(false);
    }
  }, [restoreApplyFocus, accepting, tab]);
  const dirty =
    session.edited || session.reference !== initial.current.reference || session.layer !== initial.current.layer;
  useEffect(() => onDirty(dirty), [dirty, onDirty]);
  useEffect(() => {
    const before = baselineRevision.current;
    if (before.revision !== revision) {
      if (dirty && before.value !== JSON.stringify({ token, value }))
        setRecovery({ previous: before.previous, reviewed: false });
      if (!dirty) {
        const next = refreshCleanSession(session, value, token.layer ?? null);
        initial.current = next;
        setSession(next);
        setRecovery(undefined);
      }
      baselineRevision.current = {
        revision,
        value: JSON.stringify({ token, value }),
        previous: { value, layer: token.layer ?? null },
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
  function changeLayer(layer: DraftSession["layer"]) {
    if (layer === "component") return;
    setSession({ ...session, layer });
    setError("");
  }
  function changeMode(mode: DraftSession["mode"]) {
    setSession({ ...session, mode });
    setError("");
  }
  function changeReference(reference: string | null) {
    setSession({ ...session, reference, edited: true });
    setError("");
  }
  function changeColorDraft(next: DraftSession) {
    setSession(next);
    setError("");
    setNotice("");
  }
  function reportColorError(message: string) {
    setError(message);
  }
  function selectTab(next: string) {
    setTab(next);
  }
  function reviewRecovery() {
    if (!recovery) return;
    setRecovery({ ...recovery, reviewed: true });
    requestAnimationFrame(() => reviewHeading.current?.focus());
  }
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
    let result: ApplicationResult<Pick<Token, "definition" | "layer">>;
    try {
      result = await onApply(candidate, session.layer === "component" ? undefined : session.layer);
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
    const next = baseline(result.value.definition?.assignments[0]?.value, result.value.layer ?? null);
    initial.current = next;
    baselineRevision.current = {
      revision,
      value: JSON.stringify(result.value.definition?.assignments[0]?.value),
      previous: { value: result.value.definition?.assignments[0]?.value, layer: result.value.layer ?? null },
    };
    setRecovery(undefined);
    setSession(next);
    onDirty(false);
    setError("");
    setRestoreApplyFocus(true);
  }
  function cancel() {
    const currentBaseline = baseline(value, token.layer ?? null);
    initial.current = currentBaseline;
    setSession(currentBaseline);
    setRecovery(undefined);
    onDirty(false);
    setError("");
    outcomes.publish("Draft changes discarded. Applied value and layer unchanged.", "information");
    setRestoreApplyFocus(true);
  }
  return {
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
    feedback,
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
  };
}
