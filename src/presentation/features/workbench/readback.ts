import type { DisplayPath } from "@application/retention/projections";
import type {
  ApplicationFailure,
  TokenInspection,
} from "@application/authoring";
import type { ColorLiteralValue } from "@domain/color-literal";
export function pathLabel(path: DisplayPath) {
  return path.status === "derived"
    ? path.path.map((x) => (x === "" ? "(unnamed)" : x)).join(" / ")
    : path.status === "unavailable"
      ? "(derived path unavailable · resource limit)"
      : "(invalid namespace)";
}
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
export function failureText(failure: ApplicationFailure) {
  const e = failure.error;
  if (e.code === "storage-failure")
    return `Storage ${e.operation} failed: ${e.message}. Existing data and drafts retained.`;
  if (e.code === "invalid-domain-input")
    return `Invalid authoring: ${e.message}`;
  if (e.code === "invalid-candidate")
    return `Candidate rejected. Namespace diagnostics: ${JSON.stringify(e.namespaceDiagnostics)}. Reference diagnostics: ${JSON.stringify(e.referenceDiagnostics)}. Unrelated diagnostics can block a one-edit repair.`;
  return JSON.stringify(e);
}

/** Labels are presentation only: all consumers keep full IDs as values and keys. */
export function identityLabels(
  entries: readonly { authored: { id: string }; path: DisplayPath }[],
  reserved: readonly string[] = ["Choose a color token…", "Missing target"],
  selfTokenId?: string,
): Map<string, string> {
  if (
    new Set(entries.map((entry) => entry.authored.id)).size !== entries.length
  )
    throw new RangeError("Identity labels require unique stable IDs.");
  // Context is part of the rendered choice before collision detection.
  const bases = entries.map(
    (entry) =>
      pathLabel(entry.path) +
      (entry.authored.id === selfTokenId ? " (this token)" : ""),
  );
  const renderedKey = (text: string) => text.replace(/\s+/g, " ").trim();
  const reservedKeys = reserved.map(renderedKey);
  const keys = bases.map(renderedKey);
  const counts = (values: readonly string[]) => {
    const result = new Map<string, number>();
    values.forEach((value) => result.set(value, (result.get(value) ?? 0) + 1));
    return result;
  };
  const baseCounts = counts(keys);
  const ambiguous = entries.map(
    (entry, i) =>
      entry.path.status !== "derived" ||
      entry.path.path.length === 0 ||
      entry.path.path.some((part) => part === "") ||
      reservedKeys.includes(keys[i]) ||
      baseCounts.get(keys[i])! > 1,
  );
  const maximum = entries.reduce(
    (length, entry) => Math.max(length, entry.authored.id.length),
    8,
  );
  const collisions = (labels: readonly string[]) => {
    const keys = labels.map(renderedKey),
      labelCounts = counts(keys);
    return keys.map(
      (key) => reservedKeys.includes(key) || labelCounts.get(key)! > 1,
    );
  };
  const result = (labels: readonly string[]) =>
    new Map(entries.map((entry, i) => [entry.authored.id, labels[i]]));
  // Common IDs need only the shortest distinguishing prefix. Compare the whole
  // rendered set, including authored names that resemble an appended suffix.
  for (let length = 8; length <= maximum + entries.length; length++) {
    const labels = entries.map((entry, i) =>
      ambiguous[i]
        ? `${bases[i]} · ${entry.authored.id.slice(0, length)}`
        : bases[i],
    );
    const clashes = collisions(labels);
    if (!clashes.some(Boolean)) return result(labels);
    clashes.forEach((collision, i) => {
      if (collision) ambiguous[i] = true;
    });
  }
  // Opaque IDs may contain whitespace or the suffix delimiter. Encode UTF-16
  // units without whitespace/delimiters so distinct full IDs remain visible.
  // Newly colliding authored names also gain a suffix; each pass marks another
  // entry, making this fallback bounded even for repairable/malformed readback.
  const escaped = entries.map((entry) =>
    entry.authored.id
      .split("")
      .map((unit) => unit.charCodeAt(0).toString(16).padStart(4, "0"))
      .join(""),
  );
  for (let pass = 0; pass <= entries.length; pass++) {
    const labels = entries.map((_, i) =>
      ambiguous[i] ? `${bases[i]} · id:${escaped[i]}` : bases[i],
    );
    const clashes = collisions(labels);
    if (!clashes.some(Boolean)) return result(labels);
    clashes.forEach((collision, i) => {
      if (collision) ambiguous[i] = true;
    });
  }
  throw new RangeError("Identity labels could not be disambiguated.");
}
