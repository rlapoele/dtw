import {
  authoredColorCoordinates,
  spaceName,
} from "@presentation/features/workbench/color/authored-color";
import type { Token } from "@domain/token";
import type { ProjectContext } from "@application/retention/projections";
import { identityLabels } from "@presentation/features/workbench/readback";

type Value = NonNullable<Token["definition"]>["assignments"][number]["value"];

/** Exact authored data with semantic labels; never resolved or coerced to Number. */
export function AuthoredValue({
  value,
  project,
  layout = "expanded",
}: {
  value: Value | undefined;
  project?: ProjectContext;
  layout?: "expanded" | "compact";
}) {
  if (value?.kind === "token-reference") {
    const target = project?.tokens.find(
      (t) => t.authored.id === value.targetTokenId,
    );
    return (
      <span className="block min-w-0 wrap-anywhere">
        <span className="block">Reference</span>
        <span className="block text-secondary mt-1">
          {target
            ? identityLabels(project?.tokens ?? []).get(target.authored.id)
            : "Missing target"}
        </span>
      </span>
    );
  }
  if (value?.kind !== "literal" || value.valueType !== "color")
    return <span>{value?.kind ?? "No assignment"}</span>;
  return (
    <span className="block min-w-0 wrap-anywhere">
      <span className="block">{spaceName(value.colorSpace)}</span>
      <span className="block text-secondary mt-1 mono">
        {authoredColorCoordinates(value, layout).map((text, index) => (
          <span key={index}>
            {layout === "compact" && index > 0 ? " · " : ""}
            <span
              className={
                layout === "compact"
                  ? "inline-block max-w-full align-top wrap-anywhere"
                  : "block"
              }
            >
              {text}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
