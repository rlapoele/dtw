import { Button } from "@presentation/ui/button";

export function ProjectRecovery({
  pending,
  activeMutation,
  retained,
  unknown,
  onCheck,
  onRetryReading,
  onReviewLeaving,
}: {
  pending: boolean;
  activeMutation: boolean;
  retained: boolean;
  unknown: boolean;
  onCheck: () => void;
  onRetryReading: () => void;
  onReviewLeaving: () => void;
}) {
  return (
    <>
      {pending &&
        activeMutation &&
        !unknown &&
        !retained && (
          <section role="status" className="text-caption mt-4">
            <p>Retention or preparation pending. Inputs are preserved.</p>
            <Button onClick={onCheck}>
              Check retained result
            </Button>
          </section>
        )}
      {retained && (
        <section
          role="status"
          className="text-caption border-hairline border-border rounded p-3 mt-5"
        >
          <p>
            The project is retained. Entered input is preserved while reading
            is unavailable; creation will not be repeated.
          </p>
          <Button disabled={pending} onClick={onRetryReading}>
            Retry reading project
          </Button>
        </section>
      )}
      {unknown && (
        <section
          role="status"
          className="text-caption border-hairline border-error-border rounded p-3 mt-5"
        >
          <p>
            Retained result unknown. Entered name is preserved; do not repeat
            creation.
          </p>
          <Button disabled={pending} onClick={onCheck}>
            Check retained result
          </Button>
          <Button disabled={pending} onClick={onReviewLeaving}>
            Review before leaving
          </Button>
        </section>
      )}
    </>
  );
}
