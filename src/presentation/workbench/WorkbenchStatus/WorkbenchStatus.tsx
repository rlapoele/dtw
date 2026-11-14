import { Button } from "@presentation/ui/button";

export function WorkbenchStatus({
  tokens,
  busy,
  unknown,
  readFailure,
  writable,
  onRequestPersistentStorage,
}: {
  tokens: number;
  busy: boolean;
  unknown: boolean;
  readFailure: string;
  writable: boolean;
  onRequestPersistentStorage: () => void;
}) {
  return (
    <footer className="statusbar narrow:flex-wrap small:px-4 small:py-1.5 short:hidden shrink-0 flex justify-between gap-4 border-t border-border bg-surface text-status px-5 py-2">
      <span>{tokens} tokens</span>
      <span className="small:hidden">
        {busy
          ? "Retention pending"
          : unknown
            ? "Outcome unknown"
            : readFailure
              ? "Stale / unavailable"
              : writable
                ? "Applied state retained locally"
                : "Inspection only"}
      </span>
      <Button
        size="selection"
        disabled={busy}
        onClick={onRequestPersistentStorage}
      >
        Request persistent storage
      </Button>
    </footer>
  );
}
