import type { ApplicationFailure } from "@application/authoring";
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

