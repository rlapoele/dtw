export const GENERIC_FONT_FAMILIES = [
  "serif",
  "sans-serif",
  "monospace",
  "system-ui",
] as const;

export type GenericFontFamily = (typeof GENERIC_FONT_FAMILIES)[number];

export type FontFamilyEntry =
  | { readonly kind: "named"; readonly name: string }
  | { readonly kind: "generic"; readonly family: GenericFontFamily };

export type FontFamilyEntryInput =
  | { readonly kind: "named"; readonly name: string }
  | { readonly kind: "generic"; readonly family: string };

export type FontFamilyLiteralValue = {
  readonly kind: "literal";
  readonly valueType: "fontFamily";
  readonly families: readonly [FontFamilyEntry, ...FontFamilyEntry[]];
};

const genericFamilySet: ReadonlySet<string> = new Set(GENERIC_FONT_FAMILIES);

export function createFontFamilyLiteral(
  families: readonly FontFamilyEntryInput[],
): FontFamilyLiteralValue {
  if (families.length === 0) {
    throw new RangeError("A font-family literal requires at least one entry");
  }

  const [first, ...rest] = Array.from(families, copyEntry);
  return {
    kind: "literal",
    valueType: "fontFamily",
    families: [first, ...rest],
  };
}

function copyEntry(entry: FontFamilyEntryInput): FontFamilyEntry {
  if (typeof entry !== "object" || entry === null) {
    throw new RangeError("A font-family stack must contain explicit entries");
  }
  switch (entry.kind) {
    case "named":
      if (typeof entry.name !== "string" || entry.name.trim().length === 0) {
        throw new RangeError("A named font family must not be blank");
      }
      // Trimming checks emptiness only; the authored name is preserved.
      return { kind: "named", name: entry.name };
    case "generic":
      if (!isGenericFontFamily(entry.family)) {
        throw new RangeError("Unsupported generic font family");
      }
      return { kind: "generic", family: entry.family };
    default:
      throw new RangeError("Unsupported font-family entry kind");
  }
}

function isGenericFontFamily(value: string): value is GenericFontFamily {
  return genericFamilySet.has(value);
}
