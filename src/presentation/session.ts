import type { ColorLiteralInput, ColorSpace } from "@domain/color-literal";
import { createColorLiteral } from "@domain/color-literal";
import { convertColor } from "@domain/color-calculation";
import { integerByteDisplay, integerByteIssue, integerByteToNormalized } from "@presentation/integer-rgb";
import type { ImplementedAuthoredValue } from "@domain/token";
export { canReviseColorToken as eligible } from "@application/color-revision-policy";
export type LiteralDraft = {
  colorSpace: ColorSpace;
  components: [string, string, string];
  alpha: string;
};
export type DraftSession = {
  mode: "literal" | "reference";
  literal: LiteralDraft;
  reference: string;
  viewSpace: ColorSpace;
  scale: "normalized" | "bytes";
  byteText: [string, string, string] | null;
  byteInvalid: boolean;
  byteEdited: [boolean, boolean, boolean];
  edited: boolean;
};
export function baseline(value?: ImplementedAuthoredValue): DraftSession {
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
    mode: value?.kind === "token-reference" ? "reference" : "literal",
    literal,
    reference: value?.kind === "token-reference" ? value.targetTokenId : "",
    viewSpace: literal.colorSpace,
    scale: "normalized",
    byteText: null,
    byteInvalid: false,
    byteEdited: [false, false, false],
    edited: false,
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
  return r.ok
    ? {
        colorSpace: r.value.colorSpace,
        components: [...r.value.components],
        alpha: s.literal.alpha,
      }
    : s.literal;
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
      return { ...s, byteText: raw, byteEdited, byteInvalid: true, edited: true };
    }
    const invalid = raw.some((x, i) => byteEdited[i] && integerByteIssue(x) !== undefined);
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
