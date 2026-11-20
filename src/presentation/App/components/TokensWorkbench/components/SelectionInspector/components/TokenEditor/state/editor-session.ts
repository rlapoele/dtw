import { compareDecimals, decimalFromCanonical } from "@domain/decimal";
import type { ColorLiteralInput, ColorSpace } from "@domain/color-literal";
import { createColorLiteral } from "@domain/color-literal";
import { convertColor } from "@domain/color-calculation";
import {
  integerByteDisplay,
  integerByteIssue,
  integerByteToNormalized,
} from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/helpers/integer-rgb";
import type { ImplementedAuthoredValue } from "@domain/token";
export { canReviseColorToken as eligible } from "@application/color-revision-policy";
export type LiteralDraft = {
  colorSpace: ColorSpace;
  components: [string, string, string];
  alpha: string;
};
export type DraftSession = {
  layer: "primitive" | "semantic" | "component" | null;
  mode: "literal" | "reference";
  literal: LiteralDraft;
  reference: string | null;
  viewSpace: ColorSpace;
  scale: "normalized" | "bytes";
  byteText: [string, string, string] | null;
  byteInvalid: boolean;
  hexText: string | null;
  hexInvalid: boolean;
  byteEdited: [boolean, boolean, boolean];
  edited: boolean;
};
export function baseline(value?: ImplementedAuthoredValue, layer: DraftSession["layer"] = null): DraftSession {
  const literal =
    value?.kind === "literal" && value.valueType === "color"
      ? {
          colorSpace: value.colorSpace,
          components: [...value.components] as [string, string, string],
          alpha: value.alpha,
        }
      : {
          colorSpace: "srgb" as const,
          components: ["", "", ""] as [string, string, string],
          alpha: "1",
        };
  return {
    layer,
    mode: value?.kind === "token-reference" ? "reference" : "literal",
    literal,
    reference: value?.kind === "token-reference" ? value.targetTokenId : null,
    viewSpace: literal.colorSpace,
    scale: "normalized",
    hexText: null,
    hexInvalid: false,
    byteText: null,
    byteInvalid: false,
    byteEdited: [false, false, false],
    edited: false,
  };
}
/** A clean editor follows applied data; representation preferences stay passive. */
export function refreshCleanSession(
  session: DraftSession,
  value?: ImplementedAuthoredValue,
  layer: DraftSession["layer"] = null,
): DraftSession {
  return {
    ...baseline(value, layer),
    viewSpace: session.viewSpace,
    scale: session.scale,
  };
}
export function literalIssue(literal: ColorLiteralInput): string | undefined {
  try {
    createColorLiteral(literal);
    return undefined;
  } catch (e) {
    return e instanceof Error ? e.message : "Invalid literal";
  }
}
export function displayed(s: DraftSession): LiteralDraft {
  if (s.viewSpace === s.literal.colorSpace) return s.literal;
  // Alpha never participates in coordinate conversion. Keep the displayed
  // coordinates stable while its independent exact text is incomplete.
  const r = convertColor({ ...s.literal, alpha: "1" }, s.viewSpace);
  if (!r.ok) return s.literal;
  const components: LiteralDraft["components"] = [...r.value.components];
  // A computed powerless hue has no effect at zero saturation/chroma. Give
  // the editor a numeric starting angle, without changing the conversion or
  // replacing a genuinely missing component from the authored draft.
  if (!s.literal.components.includes("none")) {
    const hueIndex =
      s.viewSpace === "hsl" ? 0 : s.viewSpace === "oklch" ? 2 : undefined;
    if (
      hueIndex !== undefined &&
      components[hueIndex] === "none" &&
      components[1] === "0"
    )
      components[hueIndex] = "0";
  }
  return {
    colorSpace: r.value.colorSpace,
    components,
    alpha: s.literal.alpha,
  };
}
export function fields(s: DraftSession): [string, string, string] {
  const d = displayed(s);
  return d.colorSpace === "srgb" && s.scale === "bytes"
    ? (s.byteText ??
        (d.components.map((x) => integerByteDisplay(x).text) as [
          string,
          string,
          string,
        ]))
    : d.components;
}
export function changeView(s: DraftSession, target: ColorSpace): DraftSession {
  if (s.hexInvalid)
    throw new RangeError("Finish the incomplete HEX entry before changing representation.");
  if (s.byteInvalid)
    throw new RangeError(
      "Finish the incomplete byte entries before changing representation.",
    );
  const r = convertColor(s.literal, target);
  if (!r.ok) throw new RangeError(r.message);
  const next = { ...s, viewSpace: target };
  if (target === "srgb" && s.scale === "bytes") fields(next);
  return next;
}
export function editComponent(
  s: DraftSession,
  index: number,
  text: string,
): DraftSession {
  s = { ...s, hexText: null, hexInvalid: false };
  const d = displayed(s);
  const bytes = d.colorSpace === "srgb" && s.scale === "bytes";
  const components: [string, string, string] = [...d.components];
  if (bytes) {
    const raw: [string, string, string] = [...fields(s)];
    raw[index] = text;
    const byteEdited: [boolean, boolean, boolean] = [...s.byteEdited];
    byteEdited[index] = true;
    try {
      components[index] = integerByteToNormalized(text);
    } catch {
      return {
        ...s,
        byteText: raw,
        byteEdited,
        byteInvalid: true,
        edited: true,
      };
    }
    const invalid = raw.some(
      (x, i) => byteEdited[i] && integerByteIssue(x) !== undefined,
    );
    return {
      ...s,
      literal: { ...d, components },
      byteText: raw,
      byteEdited,
      byteInvalid: invalid,
      edited: true,
    };
  }
  components[index] = text;
  return {
    ...s,
    literal: { ...d, components },
    byteText: null,
    byteEdited: [false, false, false],
    byteInvalid: false,
    edited: true,
  };
}

/** HEX is only an sRGB view; display never authors quantized components. */
export function hexField(s: DraftSession): string {
  const d = displayed(s);
  if (d.colorSpace !== "srgb") return "";
  if (s.hexText !== null) return s.hexText;
  if (s.byteInvalid) return "";
  try {
    const channels = d.components.map(text => {
      const value = decimalFromCanonical(text);
      if (compareDecimals(value, decimalFromCanonical("0")) < 0 ||
          compareDecimals(value, decimalFromCanonical("1")) > 0)
        throw new RangeError("Outside sRGB HEX range");
      return Number(integerByteDisplay(text).text).toString(16).padStart(2, "0");
    });
    return "#" + channels.join("");
  } catch {
    return "";
  }
}

export function editHex(s: DraftSession, text: string): DraftSession {
  const raw = text.trim().replace(/^#/, "");
  if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw))
    return { ...s, hexText: text, hexInvalid: true, edited: true };
  const expanded = raw.length === 3 ? [...raw].map(x => x + x).join("") : raw;
  const components = [0, 2, 4].map(i =>
    integerByteToNormalized(String(parseInt(expanded.slice(i, i + 2), 16))),
  ) as LiteralDraft["components"];
  return {
    ...s,
    literal: { colorSpace: "srgb", components, alpha: s.literal.alpha },
    viewSpace: "srgb",
    hexText: text,
    hexInvalid: false,
    byteText: null,
    byteInvalid: false,
    byteEdited: [false, false, false],
    edited: true,
  };
}
