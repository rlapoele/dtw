import { COLOR_COMPONENTS, COMPONENT_NAMES, componentSuffix } from "@domain/color-components";
import { Field } from "@presentation/components/field";
import { Input } from "@presentation/components/input";
import type { CSSProperties } from "react";
import { COLOR_SPACES } from "@domain/color-literal";
import type { ColorSpace } from "@domain/color-literal";
import { normalizedToByte } from "@domain/color-calculation";
import { Select } from "@presentation/Select";
import {
  changeView,
  displayed,
  editComponent,
  fields,
} from "@presentation/session";
import type { DraftSession } from "@presentation/session";
import { visualRangeState } from "@presentation/visual-range";
import { spaceName } from "@presentation/authored-color";
export { spaceName } from "@presentation/authored-color";
function illustrativeGradient(space: ColorSpace, index: number): string {
  const identity = COLOR_COMPONENTS[space][index];
  if (identity === "hue")
    return "linear-gradient(to right,#e33333,#d3c825,#30b94c,#31c8cb,#3655e1,#b737cd,#e33333)";
  if (space === "srgb" || space === "display-p3")
    return `linear-gradient(to right,#222,${({ red: "#e45c5c", green: "#4f9e61", blue: "#557bd0" } as Record<string, string>)[identity]})`;
  if (space === "hsl")
    return identity === "lightness"
      ? "linear-gradient(to right,#111,#999,#fff)"
      : "linear-gradient(to right,#9b9b9b,#4b78bd)";
  if (space === "oklab" && identity !== "lightness")
    return identity === "a"
      ? "linear-gradient(to right,#389d70,#aaa,#c4598e)"
      : "linear-gradient(to right,#5670be,#aaa,#c1ae45)";
  if (space === "oklch" && identity === "chroma")
    return "linear-gradient(to right,#aaa,#456bc8)";
  return "linear-gradient(to right,#111,#fff)";
}
export function ColorFields({
  session: s,
  onChange,
  onError,
}: {
  session: DraftSession;
  onChange: (s: DraftSession) => void;
  onError: (s: string) => void;
}) {
  const d = displayed(s),
    bytes = d.colorSpace === "srgb" && s.scale === "bytes";
  let values: [string, string, string];
  try {
    values = fields(s);
  } catch {
    values = d.components;
  }
  const change = (i: number, text: string) => {
    onChange(editComponent(s, i, text));
    onError("");
  };
  const alphaRangeState = visualRangeState(s.literal.alpha, "0", "1");
  return (
    <>
      <Field>
        View color space
        <Select
          value={s.viewSpace}
          onChange={(e) => {
            try {
              onChange(changeView(s, e.target.value as ColorSpace));
              onError("");
            } catch (e) {
              onError(
                e instanceof Error ? e.message : "Representation unavailable",
              );
            }
          }}
        >
          {COLOR_SPACES.map((space) => (
            <option key={space} value={space}>
              {spaceName(space)}
            </option>
          ))}
        </Select>
      </Field>
      <p
        id="space-note"
        className="view-note text-caption pt-2.5 pb-4 -mt-2.5 text-muted-foreground wrap-anywhere"
      >
        {s.viewSpace === s.literal.colorSpace
          ? `Draft in ${spaceName(s.literal.colorSpace)}. Switching view keeps exact values.`
          : `Viewing approximate ${spaceName(s.viewSpace)}. Draft remains in ${spaceName(s.literal.colorSpace)} until a component edit.`}
      </p>
      {d.colorSpace === "srgb" && (
        <Field>
          RGB entry scale
          <Select
            value={s.scale}
            onChange={(e) => {
              if (s.byteInvalid) {
                onError("Finish the byte entries before changing scale.");
                return;
              }
              try {
                if (e.target.value === "bytes")
                  d.components.forEach(normalizedToByte);
                onChange({
                  ...s,
                  scale: e.target.value as DraftSession["scale"],
                });
                onError("");
              } catch (e) {
                onError(
                  e instanceof Error ? e.message : "Byte display unavailable",
                );
              }
            }}
          >
            <option value="normalized">Normalized · 0–1</option>
            <option value="bytes">0–255 scale</option>
          </Select>
        </Field>
      )}
      <div className="component-controls">
        {values.map((value, i) => {
          const identity = COLOR_COMPONENTS[d.colorSpace][i];
          const suffix = componentSuffix(d.colorSpace, identity);
          const label = COMPONENT_NAMES[identity] + (suffix ? ` (${suffix})` : "");
          const hue = identity === "hue";
          const min = d.colorSpace === "oklab" && identity !== "lightness" ? -0.4 : 0,
            max = hue
              ? 359.9
              : d.colorSpace === "hsl"
                ? 100
                : (d.colorSpace === "oklab" && identity !== "lightness") ||
                    (d.colorSpace === "oklch" && identity === "chroma")
                  ? 0.4
                  : bytes
                    ? 255
                    : 1;
          const step = hue || d.colorSpace === "hsl" ? 0.1 : bytes ? 1 : 0.001;
          const rangeState = visualRangeState(value, String(min), String(max));
          const available = rangeState === "available";
          return (
            <div
              className="component-control small:gap-x-3 grid min-w-0 gap-x-4 gap-y-0 mb-5"
              key={d.colorSpace + "-" + i}
            >
              <label className="component-value col-start-2 row-start-1 row-span-2 flex min-w-0 flex-col items-stretch gap-1.5 m-0 text-caption font-medium">
                <span>{label}</span>
                <Input
                  className="small:h-11 small:min-h-11"
                  value={value}
                  spellCheck={false}
                  aria-describedby={`range-note-${i} editor-error`}
                  aria-invalid={s.byteInvalid || undefined}
                  onChange={(e) => change(i, e.target.value)}
                />
              </label>
              {available ? (
                <>
                  <input
                    className="component-range small:h-11 col-start-1 row-start-2 self-center block h-10 w-full min-w-0 appearance-none rounded cursor-pointer touch-pan-y p-0 border-0 bg-transparent text-foreground"
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={Number(value)}
                    style={
                      {
                        "--range-gradient": illustrativeGradient(
                          d.colorSpace,
                          i,
                        ),
                      } as CSSProperties
                    }
                    aria-label={label + " slider"}
                    aria-valuetext={value}
                    onChange={(e) => change(i, e.target.value)}
                  />
                  <div
                    className="range-ends col-start-1 row-start-3 flex justify-between gap-2 text-muted-foreground mt-0.5"
                    aria-hidden="true"
                  >
                    <span>{min}</span>
                    <span>{max}</span>
                  </div>
                </>
              ) : (
                <p className="helper text-muted-foreground font-normal range-unavailable col-start-1 row-start-2 row-span-2 self-center wrap-anywhere">
                  {value === "none"
                    ? "Missing component · use exact entry."
                    : rangeState === "outside"
                      ? "Outside visual range · exact value retained."
                      : "Complete exact entry to use slider."}
                </p>
              )}
              <p className="sr-only" id={`range-note-${i}`}>
                Illustrative range {min} to {max}, step {step}. Exact values are
                retained.
              </p>
            </div>
          );
        })}
      </div>
      <div className="component-control small:gap-x-3 grid min-w-0 gap-x-4 gap-y-0 mb-5 alpha-control border-t border-border pt-4.5">
        <label className="component-value col-start-2 row-start-1 row-span-2 flex min-w-0 flex-col items-stretch gap-1.5 m-0 text-caption font-medium">
          <span>Alpha</span>
          <Input
            className="small:h-11 small:min-h-11"
            value={s.literal.alpha}
            aria-describedby="editor-error"
            onChange={(e) =>
              onChange({
                ...s,
                literal: { ...s.literal, alpha: e.target.value },
                edited: true,
              })
            }
          />
        </label>
        {alphaRangeState === "available" ? (
          <input
            className="component-range small:h-11 col-start-1 row-start-2 self-center block h-10 w-full min-w-0 appearance-none rounded cursor-pointer touch-pan-y p-0 border-0 bg-transparent text-foreground alpha-range"
            type="range"
            min="0"
            max="1"
            step="0.01"
            aria-label="Alpha slider"
            value={Number(s.literal.alpha)}
            onChange={(e) =>
              onChange({
                ...s,
                literal: { ...s.literal, alpha: e.target.value },
                edited: true,
              })
            }
          />
        ) : (
          <p className="helper text-muted-foreground font-normal range-unavailable col-start-1 row-start-2 row-span-2 self-center wrap-anywhere">
            {alphaRangeState === "outside"
              ? "Outside visual range · exact alpha retained."
              : "Complete alpha in exact entry."}
          </p>
        )}
      </div>
      <p className="helper text-muted-foreground font-normal">
        Exact canonical decimal text or none; alpha 0–1. Sliders are
        illustrative stepped edits. Derived views and byte displays may be
        approximate. Apply uses {s.literal.colorSpace}.
      </p>
      {bytes && (
        <p className="helper text-muted-foreground font-normal mono break-words">
          Normalized draft: [{s.literal.components.join(", ")}]
        </p>
      )}
    </>
  );
}
