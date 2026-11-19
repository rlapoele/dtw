import {
  authoredColorCoordinates,
  spaceName,
} from "@presentation/App/components/TokensWorkbench/helpers/authored-color";
import type { Token } from "@domain/token";
import type { ProjectContext } from "@application/retention/projections";
import { identityLabels } from "@presentation/App/components/TokensWorkbench/helpers/identity-labels";

type Value = NonNullable<Token["definition"]>["assignments"][number]["value"];

/** Exact authored data with semantic labels; never resolved or coerced to Number. */
export function AuthoredValue({
  value,
  project,
  layout = "expanded",
  approximate = false,
}: {
  value: Value | undefined;
  project?: ProjectContext;
  layout?: "expanded" | "compact";
  approximate?: boolean;
}) {
  if (value?.kind === "token-reference") {
    const target = project?.tokens.find(
      (t) => t.authored.id === value.targetTokenId,
    );
    return (
      <span className="block min-w-0 wrap-anywhere">
        <span className="block">Reference</span>
        <span className="block text-muted-foreground mt-1">
          {target
            ? identityLabels(project?.tokens ?? []).get(target.authored.id)
            : "Missing target"}
        </span>
      </span>
    );
  }
  if (value?.kind !== "literal" || value.valueType !== "color")
    return <span>{value?.kind ?? "No assignment"}</span>;
  const detail = approximate ? `Rounded to at most four decimal places. Original coordinates: ${authoredColorCoordinates(value).join("; ")}. Focus an inspector field or open exact source for full precision.` : undefined;
  if (layout === "expanded") {
    const rows = [
      ["Color Space", spaceName(value.colorSpace)],
      ...authoredColorCoordinates(value, layout, approximate).map(text => {
        const separator = text.indexOf(" ");
        return [text.slice(0, separator), text.slice(separator + 1)];
      }),
    ];
    return <div className="min-w-0 wrap-anywhere" title={detail}>
      {detail && <span className="sr-only">{detail}</span>}
      <dl className="details">
        {rows.map(([label, content]) => <div key={label} className="flex justify-between gap-4 py-2.5 border-b-hairline border-border text-caption">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="text-right min-w-0 wrap-anywhere">{content}</dd>
        </div>)}
      </dl>
    </div>;
  }
  return (
    <span className="block min-w-0 wrap-anywhere" title={detail}>
      {detail && <span className="sr-only">{detail}</span>}
      <span className="block">{spaceName(value.colorSpace)}</span>
      <span className="block text-muted-foreground mt-1 mono">
        {authoredColorCoordinates(value, layout, approximate).map((text, index) => (
          <span key={index}>
            {index > 0 ? " · " : ""}
            <span className="inline-block max-w-full align-top wrap-anywhere">
              {text}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
