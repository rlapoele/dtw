import { useEffect, useRef, useState } from "react";
import type { WorkbenchHost, ProjectHeader } from "@hosts/browser/protocol";
import type { ProjectContext } from "@application/retention/projections";
import type { Token } from "@domain/token";
import { createColorLiteral } from "@domain/color-literal";
import { createTokenReference } from "@domain/token-reference";
import type { RefillColorInput } from "@application/color-ramp-authoring";
import { Button } from "@presentation/ui/button";
import { Select } from "@presentation/ui/select";
import { ColorLiteralFields } from "@presentation/App/components/TokensWorkbench/components/ColorLiteralFields";
export function MissingColorEditor({
  host,
  header,
  tokenId,
  project,
  disabled,
  onDirty,
  onSave,
  focusSummary,
  onSummaryFocused,
}: {
  host: WorkbenchHost;
  header: ProjectHeader;
  tokenId: string;
  project: ProjectContext;
  disabled: boolean;
  onDirty: (dirty: boolean) => void;
  focusSummary?: number | "whole";
  onSummaryFocused?: () => void;
  onSave: (input: RefillColorInput) => Promise<boolean>;
}) {
  const [token, setToken] = useState<Token>(),
    [field, setField] = useState<number | "whole" | null>(null),
    [mode, setMode] = useState("literal"),
    [literal, setLiteral] = useState(() =>
      createColorLiteral({
        colorSpace: "srgb",
        components: ["0", "0", "0"],
        alpha: "1",
      }),
    ),
    [target, setTarget] = useState(""),
    [valid, setValid] = useState(false),
    [error, setError] = useState("");
  const baseline = useRef(header.revision),
    container = useRef<HTMLDivElement>(null),
    editButtons = useRef(new Map<number | "whole", HTMLButtonElement>()),
    returnField = useRef<number | "whole">("whole"),
    restoreEdit = useRef(false);
  useEffect(() => {
    if (field === null && restoreEdit.current) {
      editButtons.current.get(returnField.current)?.focus();
      restoreEdit.current = false;
    }
  }, [field]);
  useEffect(() => {
    if (token && focusSummary !== undefined) {
      const summary = container.current?.querySelector<HTMLElement>(`[data-refill-summary="${focusSummary}"]`);
      if (summary) { summary.focus(); onSummaryFocused?.(); }
    }
  }, [token, focusSummary]);
  useEffect(() => {
    let live = true;
    host
      .call("rampSnapshot", {
        projectId: header.project.id,
        revision: header.revision,
      })
      .then((s) => {
        if (live) setToken(s.tokens.find((t) => t.id === tokenId));
      })
      .catch((e) => setError(String(e)));
    return () => {
      live = false;
    };
  }, [tokenId]);
  useEffect(() => onDirty(field !== null), [field]);
  const value = token?.definition?.assignments[0]?.value,
    shadow =
      value?.kind === "composite" && value.valueType === "shadow"
        ? value
        : undefined;
  function open(which: number | "whole") {
    returnField.current = which;
    setField(which);
    setValid(false);
    setTarget("");
    requestAnimationFrame(() =>
      container.current
        ?.querySelector<HTMLInputElement>('input[type="radio"]')
        ?.focus(),
    );
  }
  function cancel() {
    restoreEdit.current = true;
    setField(null);
    onDirty(false);
  }
  return (
    <div ref={container} className="overflow-auto min-h-0 p-5 space-y-4">
      <h2>{token?.localName ?? "Token"}</h2>
      {!token ? (
        <p>{error || "Loading authored fields…"}</p>
      ) : field === null ? (
        <>
          {shadow ? (
            shadow.layers.map((layer, i) => (
              <section key={i} className="space-y-2">
                <h3 tabIndex={-1} data-refill-summary={i}>Layer {i + 1}</h3>
                {!layer.color && (
                  <>
                    <p>Incomplete — Layer {i + 1} color missing</p>
                    <p>
                      Preview unavailable until required fields and dependencies
                      are complete.
                    </p>
                    <Button
                      ref={node => { if (node) editButtons.current.set(i, node); else editButtons.current.delete(i); }}
                      disabled={disabled}
                      onClick={() => open(i)}
                      aria-label={`Edit ${token.localName} Layer ${i + 1} color`}
                    >
                      Edit color
                    </Button>
                  </>
                )}
                <details>
                  <summary>Authored layer fields</summary>
                  <pre className="whitespace-pre-wrap wrap-anywhere text-caption">
                    {JSON.stringify(layer, null, 2)}
                  </pre>
                </details>
              </section>
            ))
          ) : (
            <>
              <p tabIndex={-1} data-refill-summary="whole">Current: Unspecified · Color token</p>
              <Button ref={node => { if (node) editButtons.current.set("whole", node); else editButtons.current.delete("whole"); }} disabled={disabled} onClick={() => open("whole")}>
                Edit color
              </Button>
            </>
          )}
          <p className="text-caption">
            Description: {token.description ?? "No description"} · Layer:{" "}
            {token.layer ?? "Unspecified"}
          </p>
        </>
      ) : (
        <>
          <h3>
            {field === "whole" ? "Color value" : `Layer ${field + 1} · Color`}
          </h3>
          <p>Current: Unspecified</p>
          <h3>New candidate</h3>
          <fieldset disabled={disabled}>
            <legend>Value source</legend>
            {["literal", "reference"].map((value) => (
              <label key={value} className="inline-flex gap-2 mr-3">
                <input
                  type="radio"
                  name={`refill-${tokenId}`}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                />
                {value === "literal" ? "Literal color" : "Reference"}
              </label>
            ))}
          </fieldset>
          {mode === "literal" ? (
            <ColorLiteralFields
              value={literal}
              disabled={disabled}
              onChange={(value) => {
                setLiteral(value);
                setValid(true);
              }}
              onValidity={setValid}
            />
          ) : (
            <Select
              aria-label="Reference target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={disabled}
            >
              <option value="">Choose a color token</option>
              {project.tokens
                .filter(
                  (t) =>
                    t.authored.definition?.type === "color" &&
                    t.authored.id !== tokenId,
                )
                .map((t) => (
                  <option key={t.authored.id} value={t.authored.id}>
                    {t.path.status === "derived"
                      ? t.path.path.join(" / ")
                      : t.authored.localName}
                  </option>
                ))}
            </Select>
          )}
          <p className="text-caption">
            Only{" "}
            {field === "whole"
              ? "this color assignment"
              : `Layer ${field + 1} color`}{" "}
            changes. Other fields, descriptions and identities stay unchanged.
          </p>
          <div className="flex gap-2">
            <Button
              disabled={
                disabled ||
                baseline.current !== header.revision ||
                (mode === "literal" ? !valid : !target)
              }
              variant="default"
              onClick={async () => {
                const ok = await onSave({
                  projectId: header.project.id,
                  tokenId,
                  ...(field === "whole" ? {} : { layerIndex: field }),
                  value:
                    mode === "literal"
                      ? literal
                      : createTokenReference({
                          targetTokenId: target,
                          valuePath: [],
                        }),
                });
                if (ok) { setField(null); onDirty(false); }
              }}
            >
              Apply
            </Button>
            <Button disabled={disabled} onClick={cancel}>
              Cancel
            </Button>
          </div>
        </>
      )}
      {baseline.current !== header.revision && (
        <p role="alert">
          Retained data changed. Input is preserved; discard and reopen before
          saving.
        </p>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
