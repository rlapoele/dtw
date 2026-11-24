import { useEffect, useRef, useState, type ReactNode } from "react";
import { createColorLiteral, type ColorSpace } from "@domain/color-literal";
import {
  prepareRampSeed,
  generateColorRamp,
  inRampGamut,
  rampCoordinates,
  autoRampPosition,
  rampLabels,
  type RampSettings,
} from "@domain/color-ramp";
import { RampSeedFields } from "@presentation/App/components/TokensWorkbench/components/RampSeedFields";
import { RampPreview } from "@presentation/App/components/TokensWorkbench/components/RampPreview";
import { Button } from "@presentation/ui/button";
import { Field } from "@presentation/ui/field";
import { Input } from "@presentation/ui/input";
import { Select } from "@presentation/ui/select";
export type RampCreationValue = {
  settings: RampSettings;
  count: number;
  seedDescription: string;
};
export function RampCreation({
  defaultSpace, path, identity, identityReady, feedback, onCancel, onCreate,
  disabled, pending,
}: {
  defaultSpace: ColorSpace;
  path: string;
  identity: ReactNode;
  identityReady: boolean;
  feedback: ReactNode;
  onCancel: () => void;
  onCreate: (value: RampCreationValue) => void;
  disabled: boolean;
  pending: boolean;
}) {
  const [stage, setStage] = useState<"configure" | "review">("configure"),
    [countInput, setCountInput] = useState("11"),
    [description, setDescription] = useState(""),
    [valid, setValid] = useState(true);
  const count = Number(countInput);
  const [settings, setSettings] = useState<RampSettings>(() => {
    const seed = prepareRampSeed(
      createColorLiteral({
        colorSpace: "srgb",
        components: ["0.2", "0.4", "0.8"],
        alpha: "1",
      }),
      defaultSpace,
    );
    return {
      seed,
      targetGamut: "srgb",
      recipe: { id: "single-seed-oklch", version: 1, intensity: "retained" },
      seedPosition: { mode: "auto", label: autoRampPosition(seed, 11) },
    };
  });
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [stage]);
  let seedReady = false;
  try {
    const [lightness] = rampCoordinates(settings.seed);
    seedReady =
      lightness >= 0 &&
      lightness <= 1 &&
      inRampGamut(settings.seed, settings.targetGamut);
  } catch {
    /* Original seed remains editable. */
  }
  const countReady = Number.isInteger(count) && count >= 2 && count <= 20;
  function positionFor(seed: typeof settings.seed, nextCount = count) {
    if (settings.seedPosition.mode !== "auto") return settings.seedPosition;
    if (!Number.isInteger(nextCount) || nextCount < 2 || nextCount > 20)
      return settings.seedPosition;
    try {
      return { mode: "auto" as const, label: autoRampPosition(seed, nextCount) };
    } catch {
      return settings.seedPosition;
    }
  }
  function acceptSeedValidity(nextValid: boolean) {
    setValid(nextValid);
    if (!nextValid || !countReady) return;
    // Advanced Cancel/acceptance and valid HEX recovery may follow a count edit.
    // Read the latest accepted seed, including an onChange in this same event.
    setSettings((current) => {
      if (current.seedPosition.mode !== "auto") return current;
      try {
        return { ...current, seedPosition: {
          mode: "auto", label: autoRampPosition(current.seed, count),
        } };
      } catch {
        return current;
      }
    });
  }
  let autoPosition: string | undefined;
  if (valid && seedReady && countReady) {
    try { autoPosition = autoRampPosition(settings.seed, count); } catch { /* Shown below by generation. */ }
  }
  let steps: ReturnType<typeof generateColorRamp> = [], error = "";
  if (valid && seedReady && countReady) {
    try { steps = generateColorRamp(settings, count); }
    catch (e) { error = e instanceof Error ? e.message : "Unavailable ramp"; }
  }
  const ready = identityReady && valid && seedReady && countReady && steps.length > 0 && !error;
  const controlsDisabled = disabled || !identityReady;
  return (
    <form className="flex min-h-0 flex-col" onSubmit={(event) => {
      event.preventDefault();
      // Enter in Configure only advances. Creation requires the explicit review button.
      if (stage === "configure" && ready && !disabled) setStage("review");
    }}>
      <div className="min-h-0 overflow-auto scroll-py-4 p-1.5 space-y-4">
        <h3 ref={heading} tabIndex={-1}>
          {stage === "configure" ? "1 of 2 · Configure" : "2 of 2 · Review color ramp"}
        </h3>
        <div hidden={stage !== "configure"} className="space-y-4">
          {identity}
          {!identityReady && <p id="ramp-identity-help" className="text-caption text-muted-foreground">
            Enter a valid, available group name and parent to configure the ramp.
          </p>}
          <fieldset disabled={controlsDisabled} aria-describedby={!identityReady ? "ramp-identity-help" : undefined} className="space-y-4 disabled:opacity-45">
            <legend className="font-medium mb-3">Seed</legend>
            <RampSeedFields
              seed={settings.seed}
              gamut={settings.targetGamut}
              defaultSpace={defaultSpace}
              disabled={controlsDisabled}
              onValidity={acceptSeedValidity}
              onChange={(seed, targetGamut) => setSettings({
                ...settings, seed, targetGamut, seedPosition: positionFor(seed),
              })}
            />
            <Field>
              Seed description
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </Field>
            <p className="text-caption">Saved only on the final seed-position token.</p>
            <h3 className="font-medium">Scale and placement</h3>
            <div className="grid grid-cols-2 mobile:grid-cols-1 gap-3">
              <Field>
                Step count
                <Input type="number" min={2} max={20} step={1} value={countInput}
                  aria-invalid={!countReady || undefined} aria-describedby="ramp-count-error"
                  onChange={(e) => {
                    setCountInput(e.target.value);
                    setSettings({ ...settings, seedPosition: valid && seedReady ? positionFor(settings.seed, Number(e.target.value)) : settings.seedPosition });
                  }} />
              </Field>
              <Field>
                Color intensity
                <Select value={settings.recipe.intensity} onChange={(e) => setSettings({
                  ...settings, recipe: { ...settings.recipe, intensity: e.target.value as "retained" | "restrained" },
                })}>
                  <option value="retained">Retained</option>
                  <option value="restrained">Restrained</option>
                </Select>
              </Field>
            </div>
            <p id="ramp-count-error" role={!countReady ? "alert" : undefined}>
              {!countReady && "Enter a whole number from 2 to 20."}
            </p>
            <Field>
              Seed position
              <Select value={settings.seedPosition.label} aria-describedby="ramp-position-status ramp-generation-error"
                aria-invalid={!!error || undefined}
                onChange={(e) => setSettings({ ...settings, seedPosition: { mode: "manual", label: e.target.value } })}>
                {(!countReady || !rampLabels(count).includes(settings.seedPosition.label)) &&
                  <option value={settings.seedPosition.label}>{settings.seedPosition.label} · needs review</option>}
                {countReady && rampLabels(count).map((label) => <option key={label}>{label}</option>)}
              </Select>
            </Field>
            <p id="ramp-position-status" className="text-caption">
              Seed at {settings.seedPosition.label} · {settings.seedPosition.mode === "auto" ? "Auto" : "Manual"}
            </p>
            <Button type="button" disabled={controlsDisabled || autoPosition === undefined} onClick={() => {
              if (!controlsDisabled && autoPosition !== undefined) setSettings({
                ...settings, seedPosition: { mode: "auto", label: autoPosition },
              });
            }}>Use Auto position</Button>
          </fieldset>
          <p className="text-caption">Target: {settings.targetGamut} · Generated space: OKLCH · Primitive tokens</p>
          {identityReady && valid && seedReady && countReady && !error && <RampPreview steps={steps} path={path} layout="compact" />}
        </div>
        <div hidden={stage !== "review"} className="space-y-4">
          <p className="text-caption">Nothing saved yet.</p>
          <p className="font-medium wrap-anywhere">{path}</p>
          <section className="bg-muted rounded-md p-3 space-y-2 text-caption wrap-anywhere">
            <p>{count} steps · {settings.recipe.intensity === "retained" ? "Retained" : "Restrained"} intensity</p>
            <p>Seed at {settings.seedPosition.label} · {settings.seedPosition.mode === "auto" ? "Auto" : "Manual"}</p>
            <p>Target: {settings.targetGamut} · Generated space: OKLCH · Primitive tokens</p>
            <p>Seed: {settings.seed.colorSpace} {settings.seed.components.join(" / ")} · Alpha {settings.seed.alpha}</p>
            {description && <p>Seed description: {description}</p>}
          </section>
          {!identityReady && <p role="alert">The group identity needs review. Go Back to check its name and parent.</p>}
          <h3>Tokens to create</h3>
          {ready && <RampPreview steps={steps} path={path} layout="full" />}
        </div>
        <p id="ramp-generation-error" role={error ? "alert" : undefined}>{error}</p>
        {pending && <p role="status">Creation is unavailable while a pending operation or recovery is unresolved.</p>}
        {feedback}
      </div>
      <div className="shrink-0 border-t border-border bg-background flex flex-wrap gap-2 pt-3 mt-3">
        {stage === "review" && <Button type="button" disabled={pending} onClick={() => setStage("configure")}>Back</Button>}
        <Button type="button" disabled={pending} onClick={onCancel}>Cancel</Button>
        {stage === "configure" ?
          <Button type="submit" variant="default" disabled={disabled || !ready}>Review ramp</Button> :
          <Button type="button" variant="default" disabled={disabled || !ready} onClick={() => {
            if (ready && !disabled) onCreate({ settings, count, seedDescription: description });
          }}>Create color ramp</Button>}
      </div>
    </form>
  );
}
