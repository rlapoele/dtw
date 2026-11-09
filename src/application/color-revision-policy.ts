import type { Token } from "@domain/token";

// Eligibility for the bounded manual revision workflow, not project validation.
// References remain editable for explicit repair; regeneration protection does
// not prevent manual edits. The operation still validates the whole candidate.
export function canReviseColorToken(token: Token): boolean {
  const assignments = token.definition?.assignments;
  const assignment = assignments?.[0];
  return (
    token.definition?.type === "color" &&
    token.layer !== "component" &&
    assignments?.length === 1 &&
    assignment !== undefined &&
    assignment.condition.length === 0 &&
    (assignment.value.kind === "token-reference" ||
      (assignment.value.kind === "literal" && assignment.value.valueType === "color"))
  );
}
