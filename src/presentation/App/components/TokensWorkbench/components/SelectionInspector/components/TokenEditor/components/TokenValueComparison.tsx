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
      aria-label="Applied and draft color context"
    >
      {(
        ["applied", ...(feedback.tab === "resolved" ? [] : ["draft"])] as (
          | "applied"
          | "draft"
        )[]
      ).map((kind) => (
        <div
          key={kind}
          className="text-caption flex flex-col items-center w-16"
        >
          <span>{kind === "applied" ? "Applied" : "Draft"}</span>
          {feedback[kind] ? (
            <span
              aria-hidden="true"
              className="header-specimen rounded border-hairline border-specimen-border block w-9 h-4"
              style={{ background: feedback[kind] }}
            />
          ) : (
            <span>Unavailable</span>
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
