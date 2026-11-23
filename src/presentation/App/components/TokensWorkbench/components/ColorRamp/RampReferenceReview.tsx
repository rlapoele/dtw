import { useState, useRef } from "react";
import type { RampDraft, rampImpacts } from "@application/color-ramp-authoring";
import { Button } from "@presentation/ui/button";
import { Select } from "@presentation/ui/select";
import { RampPreview } from "@presentation/App/components/TokensWorkbench/components/ColorRamp/RampPreview";
export function RampReferenceReview({
  use,
  draft,
  path,
  affected,
  preview,
  disabled,
  onChoice,
  onPending,
}: {
  use: ReturnType<typeof rampImpacts>["required"][number];
  draft: RampDraft;
  path: (id: string) => string;
  affected: string[];
  preview: import("react").ReactNode;
  disabled: boolean;
  onChoice: (target: string | null) => void;
  onPending: () => void;
}) {
  const accepted = draft.choices.find((c) => c.key === use.key),
    [saved, setSaved] = useState(accepted),
    [editing, setEditing] = useState(!accepted);
  const oldLabel = Number(
      path(use.reference.targetTokenId).split(" / ").at(-1),
    ),
    suggestion = [...draft.steps].sort(
      (a, b) =>
        Math.abs(Number(a.label) - oldLabel) -
          Math.abs(Number(b.label) - oldLabel) ||
        Number(a.label) - Number(b.label),
    )[0];
  const [target, setTarget] = useState<string | null>(
      accepted ? accepted.target : suggestion.id,
    ),
    button = useRef<HTMLButtonElement>(null);
  const name = `${path(use.tokenId)}${use.layerIndex === undefined ? "" : ` · Layer ${use.layerIndex + 1} · Color`}`;
  return (
    <section className="border border-border rounded p-3 space-y-2">
      <strong className="wrap-anywhere">{name}</strong>
      <p className="text-caption wrap-anywhere">
        Current target: {path(use.reference.targetTokenId)}
      </p>
      {!use.supported ? (
        <p>Unsupported reference occurrence; replacement is blocked.</p>
      ) : editing ? (
        <>
          <Select
            aria-label={`New target for ${name}`}
            value={target ?? ""}
            disabled={disabled}
            onChange={(e) => {
              const next = e.target.value || null;
              setTarget(next);
              if (next !== saved?.target) onPending();
              else if (saved) onChoice(saved.target);
            }}
          >
            {draft.steps.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
            <option value="">Unspecified</option>
          </Select>
          {target === null && (
            <div className="notification notification-warning">
              <p>
                {use.layerIndex === undefined
                  ? "Clear this color assignment."
                  : `Only Layer ${use.layerIndex + 1} color will be missing. Other fields and layers stay unchanged.`}{" "}
                Downstream references remain connected. These tokens will have
                unavailable resolution:
              </p>
              {affected.map((p) => (
                <p key={p} className="wrap-anywhere">
                  {p}
                </p>
              ))}
            </div>
          )}
          <Button
            disabled={disabled}
            aria-label={`Accept ${target === null ? "Unspecified" : "target"} for ${name}`}
            onClick={() => {
              onChoice(target);
              setSaved({ key: use.key, target });
              setEditing(false);
              requestAnimationFrame(() => button.current?.focus());
            }}
          >
            {target === null ? "Accept Unspecified" : "Accept"}
          </Button>
          {saved && (
            <Button
              onClick={() => {
                setTarget(saved.target);
                onChoice(saved.target);
                setEditing(false);
                requestAnimationFrame(() => button.current?.focus());
              }}
            >
              Cancel change
            </Button>
          )}
        </>
      ) : (
        <>
          <p>
            {accepted?.target === null
              ? `Unspecified · ${affected.length} unavailable results`
              : `New target: ${draft.steps.find((s) => s.id === accepted?.target)?.label}`}
          </p>
          <Button
            ref={button}
            aria-label={`Change reference for ${name}`}
            onClick={() => {
              setSaved(accepted);
              setEditing(true);
            }}
          >
            Change
          </Button>
        </>
      )}
      <details>
        <summary>Details & color preview</summary>
        {preview}
        <p>
          Nearest numerical label; lower label wins a tie. Connections beyond
          this occurrence stay intact.
        </p>
        {target && (
          <RampPreview
            path={name}
            steps={draft.steps.filter((s) => s.id === target)}
          />
        )}
      </details>
    </section>
  );
}
