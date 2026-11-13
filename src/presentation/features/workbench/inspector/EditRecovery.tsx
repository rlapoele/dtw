import type { RefObject } from "react";
import { Button } from "@presentation/components/ui/button";
import type { DraftSession } from "./session";
import type { ImplementedAuthoredValue } from "@domain/token";

export function EditRecovery({
  previous,
  current,
  preserved,
  reviewed,
  headingRef,
  onReview,
}: {
  previous: ImplementedAuthoredValue | undefined;
  current: unknown;
  preserved: DraftSession;
  reviewed: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onReview: () => void;
}) {
  return (
    <section className="border border-border rounded p-3 text-caption mb-4">
      <h3 ref={headingRef} tabIndex={-1}>
        Applied state changed
      </h3>
      <p>
        Raw literal/reference input and view/scale choices are preserved. Review
        opens a comparison; only Reapply changes submits a fresh command.
      </p>
      {!reviewed ? (
        <Button onClick={onReview}>Review edit</Button>
      ) : (
        <>
          <h4 className="mt-3">Previous applied</h4>
          <pre className="whitespace-pre-wrap wrap-anywhere">
            {JSON.stringify(previous ?? null, null, 2)}
          </pre>
          <h4 className="mt-3">Current applied</h4>
          <pre className="whitespace-pre-wrap wrap-anywhere">
            {JSON.stringify(current, null, 2)}
          </pre>
          <h4 className="mt-3">Preserved input</h4>
          <pre className="whitespace-pre-wrap wrap-anywhere">
            {JSON.stringify(preserved, null, 2)}
          </pre>
        </>
      )}
    </section>
  );
}
