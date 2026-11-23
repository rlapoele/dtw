import { useRef, useState } from "react";
import {
  createColorLiteral,
  type ColorLiteralValue,
  type ColorSpace,
} from "@domain/color-literal";
import { byteToNormalized } from "@domain/color-calculation";
import {
  prepareRampSeed,
  inRampGamut,
  adjustedRampSeed,
  rampPreviewKey,
  type RampGamut,
} from "@domain/color-ramp";
import { ColorLiteralFields } from "@presentation/App/components/TokensWorkbench/components/ColorLiteralFields";
import { Button } from "@presentation/ui/button";
import { Field } from "@presentation/ui/field";
import { Input } from "@presentation/ui/input";
import { colorPreview } from "@presentation/App/components/TokensWorkbench/helpers/color-preview";
export function RampSeedFields({
  seed,
  gamut,
  defaultSpace,
  onChange,
  onValidity,
  disabled,
}: {
  seed: ColorLiteralValue;
  gamut: RampGamut;
  defaultSpace: ColorSpace;
  onChange: (seed: ColorLiteralValue, gamut: RampGamut) => void;
  onValidity: (valid: boolean) => void;
  disabled?: boolean;
}) {
  const advancedButton = useRef<HTMLButtonElement>(null);
  const advancedHeading = useRef<HTMLHeadingElement>(null);
  function closeAdvanced() {
    advancedButton.current?.focus();
    setAdvanced(false);
  }
  function seedHex(value: ColorLiteralValue) {
    try {
      return (
        "#" +
        rampPreviewKey(value)
          .split("/")[0]
          .split(",")
          .map((n) => Number(n).toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase()
      );
    } catch {
      return "";
    }
  }
  const [hex, setHex] = useState(() => seedHex(seed)),
    [error, setError] = useState(""),
    [advanced, setAdvanced] = useState(false),
    [advancedSeed, setAdvancedSeed] = useState(seed),
    [advancedValid, setAdvancedValid] = useState(true),
    [advancedSpace, setAdvancedSpace] = useState(seed.colorSpace),
    [original, setOriginal] = useState<ColorLiteralValue>();
  let srgb = false,
    p3 = false,
    candidate: ColorLiteralValue | undefined,
    calculation = "";
  try {
    srgb = inRampGamut(seed, "srgb");
    p3 = inRampGamut(seed, "display-p3");
    if (!srgb) candidate = adjustedRampSeed(seed);
  } catch (e) {
    calculation = e instanceof Error ? e.message : "Calculation unavailable";
  }
  function changed(value: ColorLiteralValue) {
    setOriginal(undefined);
    onChange(value, "srgb");
    onValidity(true);
    setError("");
  }
  return (
    <fieldset disabled={disabled} className="space-y-3">
      <Field>
        Seed HEX
        <Input
          value={hex}
          placeholder="Enter sRGB HEX"
          disabled={disabled}
          onChange={(e) => {
            const text = e.target.value;
            setHex(text);
            try {
              let code = text.replace(/^#/, "");
              if (/^[0-9a-f]{3}$/i.test(code))
                code = code
                  .split("")
                  .map((x) => x + x)
                  .join("");
              if (!/^[0-9a-f]{6}$/i.test(code))
                throw Error("Enter 3 or 6 HEX digits.");
              const source = createColorLiteral({
                colorSpace: "srgb",
                components: [0, 2, 4].map((i) =>
                  byteToNormalized(String(parseInt(code.slice(i, i + 2), 16))),
                ),
                alpha: seed.alpha,
              });
              changed(prepareRampSeed(source, defaultSpace));
            } catch (e) {
              onValidity(false);
              setError(e instanceof Error ? e.message : "Invalid HEX");
            }
          }}
        />
      </Field>
      <p className="text-caption text-muted-foreground">
        HEX is sRGB input, prepared in the project default {defaultSpace} space.
        Alpha stays separate.
      </p>
      <Button
        ref={advancedButton}
        disabled={disabled}
        onClick={() => {
          setAdvancedSeed(seed);
          setAdvancedSpace(seed.colorSpace);
          setAdvancedValid(true);
          setAdvanced(true);
          requestAnimationFrame(() => advancedHeading.current?.focus());
          onValidity(false);
        }}
      >
        Advanced
      </Button>
      {advanced && (
        <section className="border border-border rounded p-3">
          <h3 ref={advancedHeading} tabIndex={-1}>Advanced seed color</h3>
          <ColorLiteralFields
            key={String(advanced)}
            value={advancedSeed}
            onChange={setAdvancedSeed}
            onViewChange={setAdvancedSpace}
            onValidity={setAdvancedValid}
          />
          <Button
            disabled={!advancedValid}
            onClick={() => {
              try {
                const prepared = prepareRampSeed(advancedSeed, advancedSpace);
                changed(prepared);
                setHex(seedHex(prepared));
                closeAdvanced();
              } catch (e) {
                setError(
                  e instanceof Error
                    ? e.message
                    : "Seed conversion unavailable",
                );
              }
            }}
          >
            Use color
          </Button>
          <Button
            onClick={() => {
              closeAdvanced();
              onValidity(!error);
            }}
          >
            Cancel
          </Button>
        </section>
      )}
      <p className="text-caption wrap-anywhere">
        {seed.colorSpace} {seed.components.join(" / ")} · Alpha {seed.alpha}
      </p>
      <div
        className="h-10 rounded border border-border"
        style={{ background: colorPreview(seed).css }}
      />
      {!srgb && !(gamut === "display-p3" && p3) && (
        <section className="notification notification-warning space-y-2">
          <h3>Choose the seed gamut</h3>
          <p>
            Original: {seed.colorSpace} {seed.components.join(" / ")} · Alpha{" "}
            {seed.alpha}
          </p>
          {p3 && (
            <Button onClick={() => onChange(seed, "display-p3")}>
              Preserve exact seed with Display P3
            </Button>
          )}
          {candidate && (
            <>
              <p>
                Adjusted sRGB candidate: {candidate.colorSpace}{" "}
                {candidate.components.join(" / ")} · Alpha {candidate.alpha}.
                Lightness is bounded to 0–100%; chroma may be reduced.
              </p>
              <Button
                onClick={() => {
                  setOriginal(seed);
                  onChange(candidate!, "srgb");
                }}
              >
                Accept sRGB adjustment
              </Button>
            </>
          )}
          {calculation && <p>{calculation}</p>}
          <p>Edit the seed to choose another color.</p>
        </section>
      )}
      {original && (
        <Button
          onClick={() => {
            onChange(original, "srgb");
            setHex(seedHex(original));
            setOriginal(undefined);
          }}
        >
          Restore original seed
        </Button>
      )}
      {error && <p role="alert">{error}</p>}
    </fieldset>
  );
}
