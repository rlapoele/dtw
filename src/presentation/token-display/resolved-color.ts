import type { ColorLiteralValue } from "@domain/color-literal";
export function resolvedColor(inspection?: {
  resolution: {
    status: string;
    value?: import("@domain/token-resolution").ResolvedValue;
  };
}): ColorLiteralValue | undefined {
  const r = inspection?.resolution;
  return r?.status === "resolved" &&
    r.value?.kind === "literal" &&
    r.value.valueType === "color"
    ? r.value
    : undefined;
}
