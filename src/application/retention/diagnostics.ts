import type { ProjectSnapshot } from "@application/project-storage";
import { validateProjectNamespace } from "@domain/namespace";
import { validateProjectTokenReferences } from "@domain/token-reference-validation";
import {
  completeVariationSelection,
  createVariationSelection,
} from "@domain/variation-selection";
export type DiagnosticDisplay = {
  items: string[];
  complete: boolean;
  total: number;
};
export function diagnosticDisplay(
  snapshot: ProjectSnapshot,
): DiagnosticDisplay {
  const diagnostics: unknown[] = [
    ...validateProjectNamespace({
      projectId: snapshot.project.id,
      groups: snapshot.groups,
      tokens: snapshot.tokens,
    }),
    ...validateProjectTokenReferences(
      snapshot.project.id,
      snapshot.tokens,
      completeVariationSelection(
        [],
        createVariationSelection([]),
        createVariationSelection([]),
      ),
    ),
  ];
  if (snapshot.tokens.some((t) => t.layer === "component"))
    diagnostics.push({
      code: "component-ownership-unverified",
      message:
        "Component association IDs are preserved. Component ownership context is unavailable and unverified.",
    });
  let complete = diagnostics.length <= 1000;
  const items = diagnostics.slice(0, 1000).map((diagnostic) => {
    const text = JSON.stringify(diagnostic, null, 2);
    if (text.length > 65536) {
      complete = false;
      return "Diagnostic detail unavailable: this item exceeds 65536 UTF-16 display units. Authored data remains intact.";
    }
    return text;
  });
  return { items, complete, total: diagnostics.length };
}
