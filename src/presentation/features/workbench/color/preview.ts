import { createColorLiteral } from "@domain/color-literal";
import type { ColorLiteralInput } from "@domain/color-literal";

/** Native CSS is display-only: never convert or write back authored coordinates. */
export function colorPreview(input?: ColorLiteralInput): {
  css?: string;
  message: string;
} {
  if (!input) return { message: "Unavailable: no resolved color." };
  let space;
  try {
    space = createColorLiteral(input).colorSpace;
  } catch {
    return {
      message: "Unavailable: finish valid exact component and alpha entries.",
    };
  }
  // Validate with the domain constructor, but serialize the original text rather
  // than its normalized copy or a binary-number conversion.
  const [first, second, third] = input.components;
  const alpha = input.alpha;
  const percent = (value: string) => value === "none" ? value : `${value}%`;
  let css: string;
  switch (space) {
    case "srgb":
    case "display-p3":
      css = `color(${space} ${first} ${second} ${third} / ${alpha})`;
      break;
    case "hsl":
      css = `hsl(${first} ${percent(second)} ${percent(third)} / ${alpha})`;
      break;
    case "oklab":
    case "oklch":
      css = `${space}(${first} ${second} ${third} / ${alpha})`;
      break;
  }
  const browserCss = (globalThis as typeof globalThis & {
    CSS?: { supports(property: string, value: string): boolean };
  }).CSS;
  if (browserCss && !browserCss.supports("color", css))
    return { message: "Unavailable: this browser cannot render this color syntax." };
  return {
    css,
    message: input.components.includes("none")
      ? "Browser-rendered preview; missing components follow CSS display semantics. Authored values are unchanged."
      : "Browser-rendered preview; appearance depends on your display. Authored values are unchanged.",
  };
}
