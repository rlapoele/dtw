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
  baseline,
  refreshCleanSession,
  eligible,
  literalIssue,
} from "@presentation/features/workbench/inspector/session";
import { colorPreview } from "@presentation/features/workbench/color/preview";
import {
  identityLabels,
  failureText,
  resolvedColor,
} from "@presentation/features/workbench/coordination/readback";
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
  ) =>
    | ApplicationResult<Pick<Token, "definition">>
    | Promise<ApplicationResult<Pick<Token, "definition">>>;
  onDirty: (d: boolean) => void;
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
  const [restoreApplyFocus, setRestoreApplyFocus] = useState(false);
  useEffect(() => {
    if (restoreApplyFocus && !accepting) {
      // The mode button inherits disabled from the retaining fieldset. Focus
      // only after React commits the successful, re-enabled editor.
      modeRef.current?.focus();
      setRestoreApplyFocus(false);
    }
  }, [restoreApplyFocus, accepting]);
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
    setRestoreApplyFocus(true);
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
  return {
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
    feedback,
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
  };
}
