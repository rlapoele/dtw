export type Feedback = {
  tokenId: string;
  tab: string;
  applied?: string;
  draft?: string;
  appliedMessage: string;
  draftMessage: string;
};
export function TokenValueComparison({ feedback }: { feedback: Feedback }) {
  return (
    <section
      className="inspector-feedback flex flex-wrap items-center gap-2 shrink-0 max-w-full"
      aria-label="Current and new color context"
    >
      {(
        ["applied", ...(feedback.tab === "resolved" ? [] : ["draft"])] as (
          | "applied"
          | "draft"
        )[]
      ).map((kind) => (
        <div
          key={kind}
          className="text-caption flex flex-col items-center max-w-full min-w-8.5"
        >
          <span>{kind === "applied" ? "Current" : "New"}</span>
          {feedback[kind] ? (
            <span
              aria-hidden="true"
              className="header-specimen rounded border-hairline border-specimen-border block size-8.5 shrink-0"
              style={{ background: feedback[kind] }}
            />
          ) : (
            <span className="size-8.5 swatch-unavailable rounded border-hairline border-specimen-border" title="Preview unavailable" aria-label="Preview unavailable" />
          )}
          <span className="sr-only">
            {
              feedback[
                kind === "applied" ? "appliedMessage" : "draftMessage"
              ]
            }
          </span>
        </div>
      ))}
    </section>
  );
}
