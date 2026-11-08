import type { ColorLiteralInput, ColorSpace } from "@domain/color-literal";
import { createColorLiteral } from "@domain/color-literal";
import {
  byteToNormalized,
  convertColor,
  normalizedToByte,
} from "@domain/color-calculation";
import type { ImplementedAuthoredValue, Token } from "@domain/token";
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
    edited: false,
  };
}
export function eligible(token: Token) {
  const a = token.definition?.assignments;
  const v = a?.[0]?.value;
  return (
    token.definition?.type === "color" &&
    token.layer !== "component" &&
    a?.length === 1 &&
    a[0].condition.length === 0 &&
    (v?.kind === "token-reference" ||
      (v?.kind === "literal" && v.valueType === "color"))
  );
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
        (d.components.map((x) => normalizedToByte(x).text) as [
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
    try {
      components[index] = byteToNormalized(text);
    } catch {
      return { ...s, byteText: raw, byteInvalid: true, edited: true };
    }
    const invalid = raw.some((x) => {
      try {
        byteToNormalized(x);
        return false;
      } catch {
        return true;
      }
    });
    return {
      ...s,
      literal: { ...d, components },
      byteText: raw,
      byteInvalid: invalid,
      edited: true,
    };
  }
  components[index] = text;
  return {
    ...s,
    literal: { ...d, components },
    byteText: null,
    byteInvalid: false,
    edited: true,
  };
}
