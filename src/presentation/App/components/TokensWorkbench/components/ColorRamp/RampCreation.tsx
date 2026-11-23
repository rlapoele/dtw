import { useState } from "react";
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
import { RampSeedFields } from "@presentation/App/components/TokensWorkbench/components/ColorRamp/RampSeedFields";
import { RampPreview } from "@presentation/App/components/TokensWorkbench/components/ColorRamp/RampPreview";
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
  defaultSpace,
  path,
  onBack,
  onCancel,
  onCreate,
  disabled,
}: {
  defaultSpace: ColorSpace;
  path: string;
  onBack: () => void;
  onCancel: () => void;
  onCreate: (value: RampCreationValue) => void;
  disabled: boolean;
}) {
  const [stage, setStage] = useState(1),
    [count, setCount] = useState(11),
    [description, setDescription] = useState(""),
    [valid, setValid] = useState(true);
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
  let steps: ReturnType<typeof generateColorRamp> = [],
    error = "";
  try {
    steps = generateColorRamp(settings, count);
  } catch (e) {
    error = e instanceof Error ? e.message : "Unavailable ramp";
  }
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
  function seedPosition(seed: typeof settings.seed) {
    if (settings.seedPosition.mode !== "auto") return settings.seedPosition;
    try {
      return { mode: "auto" as const, label: autoRampPosition(seed, count) };
    } catch {
      return settings.seedPosition;
    }
  }
  return (
    <section className="space-y-4">
      <h3>
        {stage === 1
          ? "2 · Seed color"
          : stage === 2
            ? "3 · Ramp settings"
            : "4 · Seed position and final review"}
      </h3>
      <div hidden={stage !== 1}>
        <RampSeedFields
          seed={settings.seed}
          gamut={settings.targetGamut}
          defaultSpace={defaultSpace}
          disabled={disabled}
          onValidity={setValid}
          onChange={(seed, targetGamut) =>
            setSettings({
              ...settings,
              seed,
              targetGamut,
              seedPosition: seedPosition(seed),
            })
          }
        />
        <Field>
          Seed description
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <p className="text-caption">
          Saved only on the final seed-position token.
        </p>
      </div>
      <div hidden={stage !== 2}>
        <Field>
          Step count
          <Input
            type="number"
            min={2}
            max={20}
            value={count}
            onChange={(e) => {
              const n = Number(e.target.value);
              setCount(n);
              if (
                Number.isInteger(n) &&
                n >= 2 &&
                n <= 20 &&
                settings.seedPosition.mode === "auto"
              )
                setSettings({
                  ...settings,
                  seedPosition: {
                    mode: "auto",
                    label: autoRampPosition(settings.seed, n),
                  },
                });
            }}
          />
        </Field>
        <Field>
          Color intensity
          <Select
            value={settings.recipe.intensity}
            onChange={(e) =>
              setSettings({
                ...settings,
                recipe: {
                  ...settings.recipe,
                  intensity: e.target.value as "retained" | "restrained",
                },
              })
            }
          >
            <option value="retained">Retained</option>
            <option value="restrained">Restrained</option>
          </Select>
        </Field>
        <RampPreview steps={steps} path={path} />
      </div>
      <div hidden={stage !== 3}>
        <Field>
          Seed position
          <Select
            value={settings.seedPosition.label}
            onChange={(e) =>
              setSettings({
                ...settings,
                seedPosition: { mode: "manual", label: e.target.value },
              })
            }
          >
            {!steps.some((s) => s.label === settings.seedPosition.label) && (
              <option value={settings.seedPosition.label}>
                {settings.seedPosition.label} · needs review
              </option>
            )}
            {Number.isInteger(count) &&
              count >= 2 &&
              count <= 20 &&
              rampLabels(count).map((label) => (
                <option key={label}>{label}</option>
              ))}
          </Select>
        </Field>
        <Button
          onClick={() =>
            setSettings({
              ...settings,
              seedPosition: {
                mode: "auto",
                label: autoRampPosition(settings.seed, count),
              },
            })
          }
        >
          Use Auto position
        </Button>
        <p>
          Target: {settings.targetGamut} · Generated space: OKLCH · Primitive
          tokens
        </p>
        <RampPreview steps={steps} path={path} />
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="sticky bottom-0 bg-background flex flex-wrap gap-2 py-3">
        <Button
          disabled={disabled}
          onClick={() => (stage === 1 ? onBack() : setStage(stage - 1))}
        >
          Back
        </Button>
        <Button disabled={disabled} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="default"
          disabled={
            disabled ||
            !valid ||
            !seedReady ||
            (stage >= 2 && !countReady) ||
            (stage === 3 && !!error)
          }
          onClick={() =>
            stage < 3
              ? setStage(stage + 1)
              : onCreate({ settings, count, seedDescription: description })
          }
        >
          {stage < 3 ? "Continue" : "Create color ramp"}
        </Button>
      </div>
    </section>
  );
}
