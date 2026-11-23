import { resolveToken } from "@domain/token-resolution";
import {
  completeVariationSelection,
  createVariationSelection,
} from "@domain/variation-selection";
import type { ProjectSnapshot } from "@application/project-storage";
import { colorPreview } from "@presentation/App/components/TokensWorkbench/helpers/color-preview";
const selection = completeVariationSelection(
  [],
  createVariationSelection([]),
  createVariationSelection([]),
);
export function RampImpactPreview({
  before,
  after,
  tokenId,
  path,
}: {
  before: ProjectSnapshot;
  after: ProjectSnapshot;
  tokenId: string;
  path: (id: string) => string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        ["Current", before],
        ["New", after],
      ].map(([label, snapshot]) => {
        const s = snapshot as ProjectSnapshot,
          result = resolveToken(s.project.id, s.tokens, tokenId, selection);
        return (
          <section
            key={String(label)}
            className="text-caption min-w-0 wrap-anywhere"
          >
            <h4>{String(label)}</h4>
            {result.status === "resolved" ? (
              <>
                {result.value.kind === "literal" &&
                  result.value.valueType === "color" && (
                    <div
                      className="h-10 rounded"
                      style={{ background: colorPreview(result.value).css }}
                    />
                  )}
                <p>Resolved {result.value.valueType}</p>
              </>
            ) : (
              <p>Unavailable · {result.reason}</p>
            )}
            <p>{result.trace.map((t) => path(t.tokenId)).join(" → ")}</p>
          </section>
        );
      })}
    </div>
  );
}
