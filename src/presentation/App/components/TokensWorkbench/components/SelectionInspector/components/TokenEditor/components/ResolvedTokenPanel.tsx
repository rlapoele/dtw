import { colorDecimalDisplay } from "@presentation/App/components/TokensWorkbench/helpers/color-decimal-display";
import type {
  SelectedToken,
  ProjectContext,
} from "@application/retention/projections";
import type { TokenInspection } from "@application/authoring";
import { pathLabel } from "@presentation/App/components/TokensWorkbench/helpers/identity-labels";
import { resolvedColor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/helpers/resolved-color";
import { COLOR_COMPONENTS, COMPONENT_NAMES } from "@domain/color-components";
import { spaceName } from "@presentation/App/helpers/color-space";
import { Badge } from "@presentation/ui/badge";
import { TokenSwatch } from "@presentation/App/components/TokensWorkbench/components/TokenSwatch";
export function ResolvedTokenPanel({
  resolution,
  project,
  css,
  message,
}: {
  resolution: SelectedToken["resolution"] | TokenInspection["resolution"];
  project: ProjectContext;
  css?: string;
  message: string;
}) {
  const color = resolvedColor({ resolution });
  const label = (id: string) => {
    const t = project.tokens.find((t) => t.authored.id === id);
    return t ? pathLabel(t.path) : "Unavailable token path";
  };
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <h3>Resolved value</h3>
        <Badge>Applied value</Badge>
      </div>
      <div className="resolved-preview flex flex-col gap-2 my-3">
        <TokenSwatch css={css} />
        <p className="helper text-muted-foreground">{message}</p>
      </div>
      {resolution.status === "resolved" ? (
        color ? (
          <>
            <h4>{spaceName(color.colorSpace)}</h4>
            <p className="text-caption text-muted-foreground">
              Up to 4 decimal places. Full precision is available in raw derived resolution data.
            </p>
            <dl className="text-caption my-3">
              {color.components.map((value, index) => (
                <div className="flex justify-between gap-3 py-1" key={index}>
                  <dt>
                    {COMPONENT_NAMES[COLOR_COMPONENTS[color.colorSpace][index]]}
                  </dt>
                  <dd className="wrap-anywhere text-right min-w-0" title={value}>{colorDecimalDisplay(value)}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-3 py-1">
                <dt>Alpha</dt>
                <dd className="wrap-anywhere min-w-0" title={color.alpha}>{colorDecimalDisplay(color.alpha)}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p>
            Resolved {resolution.value.valueType} value. Full derived value is
            available below.
          </p>
        )
      ) : (
        <p
          role="status"
          className="border-hairline border-error-border bg-error-surface rounded p-3 text-caption text-destructive"
        >
          Unresolved: {resolution.reason}. Authored data retained.
        </p>
      )}
      <h3 className="mt-5">Resolution trace</h3>
      <ol className="text-caption my-3 space-y-3">
        {resolution.trace.map((step, index) => (
          <li key={index} className="wrap-anywhere">
            <strong>{label(step.tokenId)}</strong>
            <p>
              {step.targetTokenId
                ? `References ${label(step.targetTokenId)}`
                : "Authored value"}
            </p>
            <details>
              <summary>Identity details</summary>
              <p>
                {JSON.stringify(step.tokenId)}
                {step.targetTokenId
                  ? ` → ${JSON.stringify(step.targetTokenId)}`
                  : ""}
              </p>
            </details>
          </li>
        ))}
      </ol>
      <h3>Resolution diagnostics</h3>
      {resolution.diagnostics.length ? (
        <ul className="text-caption space-y-2 my-3">
          {resolution.diagnostics.map((issue, index) => (
            <li key={index}>
              <strong>{issue.code}</strong>
              <pre className="whitespace-pre-wrap wrap-anywhere">
                {JSON.stringify(issue, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-caption my-3">
          {resolution.status === "unavailable"
            ? "Resolution diagnostics unavailable."
            : "No resolution issues."}
        </p>
      )}
      <details className="text-caption mt-4">
        <summary>Raw derived resolution data</summary>
        <pre className="whitespace-pre-wrap wrap-anywhere">
          {JSON.stringify(resolution, null, 2)}
        </pre>
      </details>
    </>
  );
}
