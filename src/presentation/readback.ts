import type { NamespacePathResult } from "@domain/namespace";
import type {
  ApplicationFailure,
  TokenInspection,
} from "@application/authoring";
import type { ColorLiteralValue } from "@domain/color-literal";
export function pathLabel(path: NamespacePathResult) {
  return path.status === "derived"
    ? path.path.map((x) => (x === "" ? "(unnamed)" : x)).join(" / ")
    : "(invalid namespace)";
}
export function resolvedColor(
  inspection?: TokenInspection,
): ColorLiteralValue | undefined {
  const r = inspection?.resolution;
  return r?.status === "resolved" &&
    r.value.kind === "literal" &&
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
