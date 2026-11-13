import {
  COLOR_COMPONENTS,
  COMPONENT_NAMES,
  componentSuffix,
} from "@domain/color-components";
import { Field } from "@presentation/components/ui/field";
import { Input } from "@presentation/components/ui/input";
import type { CSSProperties } from "react";
import { COLOR_SPACES } from "@domain/color-literal";
import type { ColorSpace } from "@domain/color-literal";
import {
  integerByteDisplay,
  integerByteIssue,
} from "@presentation/features/workbench/color/integer-rgb";
import { Select } from "@presentation/components/ui/select";
import {
  changeView,
  displayed,
  editComponent,
  fields,
} from "@presentation/features/workbench/inspector/session";
import type { DraftSession } from "@presentation/features/workbench/inspector/session";
import { visualRangeState } from "@presentation/features/workbench/color/visual-range";
import { spaceName } from "@presentation/features/workbench/color/authored-color";
export { spaceName } from "@presentation/features/workbench/color/authored-color";
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
  readOnly = false,
}: {
  session: DraftSession;
  onChange: (s: DraftSession) => void;
  onError: (s: string) => void;
  readOnly?: boolean;
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
      <div className="grid grid-cols-2 gap-3 mt-3">
        <Field className="mb-1!">
          View color space
          <Select
            disabled={readOnly}
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
        {d.colorSpace === "srgb" && (
          <Field className="mb-1!">
            RGB entry scale
            <Select
              disabled={readOnly}
              value={s.scale}
              onChange={(e) => {
                if (s.byteInvalid) {
                  onError("Finish the byte entries before changing scale.");
                  return;
                }
                try {
                  if (e.target.value === "bytes")
                    d.components.forEach(integerByteDisplay);
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
      </div>
      <p
        id="space-note"
        className="view-note text-caption pt-1 pb-2 -mt-1 text-muted-foreground wrap-anywhere"
      >
        {s.viewSpace === s.literal.colorSpace
          ? `Draft in ${spaceName(s.literal.colorSpace)}. Switching view keeps exact values.`
          : `Viewing approximate ${spaceName(s.viewSpace)}. Draft remains in ${spaceName(s.literal.colorSpace)} until a component edit.`}
      </p>
      <div className="component-controls grid grid-cols-3 gap-x-3 min-w-0">
        {values.map((value, i) => {
          const identity = COLOR_COMPONENTS[d.colorSpace][i];
          const suffix = componentSuffix(d.colorSpace, identity);
          const label =
            COMPONENT_NAMES[identity] + (suffix ? ` (${suffix})` : "");
          const hue = identity === "hue";
          const min =
              d.colorSpace === "oklab" && identity !== "lightness" ? -0.4 : 0,
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
          const issue =
            bytes && s.byteEdited[i] ? integerByteIssue(value) : undefined;
          const approximate =
            bytes &&
            !s.byteEdited[i] &&
            integerByteDisplay(d.components[i]).approximate;
          const rangeState =
            bytes && !s.byteEdited[i]
              ? visualRangeState(d.components[i], "0", "1")
              : issue
                ? "invalid"
                : visualRangeState(value, String(min), String(max));
          const available = rangeState === "available";
          return (
            <div
              className="component-control flex min-w-0 flex-col mb-1"
              key={d.colorSpace + "-" + i}
            >
              <label
                htmlFor={`color-component-${i}`}
                className="component-value min-w-0 m-0 text-caption font-medium wrap-anywhere"
              >
                {label}
              </label>
              {available ? (
                <>
                  <input
                    className="component-range small:h-11 block h-10 w-full min-w-0 shrink-0 appearance-none rounded cursor-pointer touch-pan-y p-0 border-0 bg-transparent text-foreground"
                    type="range"
                    disabled={readOnly}
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
                </>
              ) : (
                <p className="helper text-muted-foreground font-normal range-unavailable flex min-h-10 items-center wrap-anywhere small:min-h-11">
                  {value === "none"
                    ? "Missing component · use exact entry."
                    : rangeState === "outside"
                      ? "Outside visual range · exact value retained."
                      : "Complete exact entry to use slider."}
                </p>
              )}
              <Input
                id={`color-component-${i}`}
                readOnly={readOnly}
                className="small:h-11 small:min-h-11"
                value={value}
                spellCheck={false}
                aria-describedby={`range-note-${i} byte-note-${i} editor-error`}
                aria-invalid={!!issue || undefined}
                onChange={(e) => change(i, e.target.value)}
              />
              {bytes && (
                <p
                  id={`byte-note-${i}`}
                  className={`text-caption mt-1 wrap-anywhere ${issue ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {issue ??
                    (approximate
                      ? `Approximate · exact normalized ${d.components[i]}`
                      : "")}
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
      <div className="component-control flex min-w-0 flex-col mb-1 alpha-control border-t border-border pt-1">
        <label
          htmlFor="color-alpha"
          className="component-value min-w-0 m-0 text-caption font-medium"
        >
          Alpha
        </label>
        {alphaRangeState === "available" ? (
          <input
            className="component-range small:h-11 block h-10 w-full min-w-0 shrink-0 appearance-none rounded cursor-pointer touch-pan-y p-0 border-0 bg-transparent text-foreground alpha-range"
            type="range"
            disabled={readOnly}
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
          <p className="helper text-muted-foreground font-normal range-unavailable flex min-h-10 items-center wrap-anywhere small:min-h-11">
            {alphaRangeState === "outside"
              ? "Outside visual range · exact alpha retained."
              : "Complete alpha in exact entry."}
          </p>
        )}
        <Input
          id="color-alpha"
          readOnly={readOnly}
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
      </div>
      <details className="text-caption text-muted-foreground">
        <summary>Color entry guidance</summary>
        <p className="helper text-muted-foreground font-normal">
          {bytes
            ? "Canonical whole numbers or none on the 0–255 scale"
            : "Exact canonical decimal text or none"}
          ; alpha 0–1. Sliders are illustrative stepped edits. Derived views and
          byte displays may be approximate. Apply uses {s.literal.colorSpace}.
        </p>
      </details>
      {bytes && (
        <p className="helper text-muted-foreground font-normal mono break-words">
          Normalized draft: [{s.literal.components.join(", ")}]
        </p>
      )}
    </>
  );
}
