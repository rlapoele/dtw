export function Swatch({ css }: { css?: string }) {
  return (
    <span
      className={`swatch size-8.5 border border-swatch-border rounded block shrink-0 overflow-hidden ${css ? "" : "swatch-unavailable"}`}
      aria-hidden="true"
    >
      <span className="block size-full" style={{ background: css }} />
    </span>
  );
}
