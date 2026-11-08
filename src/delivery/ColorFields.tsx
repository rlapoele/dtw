import type { CSSProperties } from "react";
import { COLOR_SPACES } from "../domain/color-literal";
import type { ColorSpace } from "../domain/color-literal";
import { normalizedToByte } from "../domain/color-calculation";
import { Select } from "./Select";
import { changeView, displayed, editComponent, fields } from "./session";
import type { DraftSession } from "./session";
import { visualRangeState } from "./visual-range";
const labels: Record<ColorSpace, [string, string, string]> = {
  srgb: ["Red", "Green", "Blue"],
  "display-p3": ["Red", "Green", "Blue"],
  hsl: ["Hue (°)", "Saturation (%)", "Lightness (%)"],
  oklab: ["Lightness", "a", "b"],
  oklch: ["Lightness", "Chroma", "Hue (°)"],
};
export const spaceName = (space: ColorSpace) =>
  space === "srgb"
    ? "sRGB"
    : space === "display-p3"
      ? "Display P3"
      : space.toUpperCase();
function illustrativeGradient(space: ColorSpace, index: number): string {
  if ((space === "hsl" && index === 0) || (space === "oklch" && index === 2))
    return "linear-gradient(to right,#e33333,#d3c825,#30b94c,#31c8cb,#3655e1,#b737cd,#e33333)";
  if (space === "srgb" || space === "display-p3")
    return `linear-gradient(to right,#222,${["#e45c5c", "#4f9e61", "#557bd0"][index]})`;
  if (space === "hsl")
    return index === 2
      ? "linear-gradient(to right,#111,#999,#fff)"
      : "linear-gradient(to right,#9b9b9b,#4b78bd)";
  if (space === "oklab" && index > 0)
    return index === 1
      ? "linear-gradient(to right,#389d70,#aaa,#c4598e)"
      : "linear-gradient(to right,#5670be,#aaa,#c1ae45)";
  if (space === "oklch" && index === 1)
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
      <label className="field">
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
      </label>
      <p id="space-note" className="view-note">
        {s.viewSpace === s.literal.colorSpace
          ? `Draft in ${spaceName(s.literal.colorSpace)}. Switching view keeps exact values.`
          : `Viewing approximate ${spaceName(s.viewSpace)}. Draft remains in ${spaceName(s.literal.colorSpace)} until a component edit.`}
      </p>
      {d.colorSpace === "srgb" && (
        <label className="field">
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
        </label>
      )}
      <div className="component-controls">
        {values.map((value, i) => {
          const hue =
            (d.colorSpace === "hsl" && i === 0) ||
            (d.colorSpace === "oklch" && i === 2);
          const min = d.colorSpace === "oklab" && i > 0 ? -0.4 : 0,
            max = hue
              ? 359.9
              : d.colorSpace === "hsl"
                ? 100
                : (d.colorSpace === "oklab" && i > 0) ||
                    (d.colorSpace === "oklch" && i === 1)
                  ? 0.4
                  : bytes
                    ? 255
                    : 1;
          const step = hue || d.colorSpace === "hsl" ? 0.1 : bytes ? 1 : 0.001;
          const rangeState = visualRangeState(value, String(min), String(max));
          const available = rangeState === "available";
          return (
            <div className="component-control" key={d.colorSpace + "-" + i}>
              <label className="component-value">
                <span>{labels[d.colorSpace][i]}</span>
                <input
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
                    className="component-range"
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
                    aria-label={labels[d.colorSpace][i] + " slider"}
                    aria-valuetext={value}
                    onChange={(e) => change(i, e.target.value)}
                  />
                  <div className="range-ends" aria-hidden="true">
                    <span>{min}</span>
                    <span>{max}</span>
                  </div>
                </>
              ) : (
                <p className="helper range-unavailable">
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
      <div className="component-control alpha-control">
        <label className="component-value">
          <span>Alpha</span>
          <input
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
            className="component-range alpha-range"
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
          <p className="helper range-unavailable">
            {alphaRangeState === "outside"
              ? "Outside visual range · exact alpha retained."
              : "Complete alpha in exact entry."}
          </p>
        )}
      </div>
      <p className="helper">
        Exact canonical decimal text or none; alpha 0–1. Sliders are
        illustrative stepped edits. Derived views and byte displays may be
        approximate. Apply uses {s.literal.colorSpace}.
      </p>
      {bytes && (
        <p className="helper mono break-words">
          Normalized draft: [{s.literal.components.join(", ")}]
        </p>
      )}
    </>
  );
}
