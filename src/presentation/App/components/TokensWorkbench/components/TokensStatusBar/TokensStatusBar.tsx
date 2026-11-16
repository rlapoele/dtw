export function TokensStatusBar({ tokens, busy, unknown, readFailure, writable, dirty }: { tokens: number; busy: boolean; unknown: boolean; readFailure: string; writable: boolean; dirty: boolean }) {
  return <footer className="statusbar shrink-0 flex flex-wrap items-center gap-3 justify-between border-t-hairline border-border bg-surface px-5 py-2 text-caption">
    <span>{tokens} tokens · {dirty ? "Unapplied changes" : "Applied state"}</span>
    <span>{busy ? "Retention pending" : unknown ? "Outcome unknown" : readFailure ? "Stale / unavailable" : writable ? "Retained locally" : "Inspection only"}</span>
    <details><summary>About retention</summary><p className="py-2 max-w-lg">Applied work is retained in this browser. Drafts stay in this page. Browser data can be cleared; keep independent backups from Projects.</p></details>
  </footer>;
}
