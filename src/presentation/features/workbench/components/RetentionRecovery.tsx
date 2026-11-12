import { Button } from "@presentation/components/ui/button";
export function RetentionRecovery({
  busy,
  activeMutation,
  unknown,
  retainedPending,
  onCheck,
  onRetry,
  onLeave,
}: {
  busy: boolean;
  activeMutation: boolean;
  unknown?: { reason: string };
  retainedPending: unknown;
  onCheck: () => void;
  onRetry: () => void;
  onLeave: () => void;
}) {
  return busy && activeMutation && !unknown && !retainedPending ? (
    <section
      role="status"
      className="border border-border text-caption p-3 rounded my-3"
    >
      <p>
        Retention pending. Inputs are preserved; duplicate submission is
        blocked.
      </p>
      <Button onClick={() => onCheck()}>Check retained result</Button>
    </section>
  ) : retainedPending ? (
    <section
      role="status"
      className="border border-border text-caption p-3 rounded my-3"
    >
      <p>
        The original change is retained. Display recovery is unavailable; inputs
        are preserved and the write will not be repeated.
      </p>
      <Button disabled={busy} onClick={() => onRetry()}>
        Retry reading project
      </Button>
    </section>
  ) : unknown ? (
    <section
      role="status"
      className="border border-error-border bg-error-surface text-caption p-3 rounded my-3"
    >
      <p>Retained result unknown. Inputs are preserved. {unknown.reason}</p>
      <Button disabled={busy} onClick={() => onCheck()}>
        Check retained result
      </Button>
      <Button disabled={busy} onClick={onLeave}>
        Review before leaving
      </Button>
    </section>
  ) : null;
}
