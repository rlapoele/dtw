import { useBackupRestore } from "@presentation/features/workbench/backup/useBackupRestore";

import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/components/ui/dialog-content";
import { Button } from "@presentation/components/ui/button";

import type {
  RestorePreview,
  WorkbenchHost,
} from "@presentation/host/protocol";
export function RestoreDialog({
  host,
  initial,
  onCancel,
  onOpen,
  restage,
}: {
  host: WorkbenchHost;
  initial: RestorePreview;
  onCancel(reset?: boolean): void;
  onOpen(id: string): void;
  restage?: () => Promise<RestorePreview>;
}) {
  const {
    preview,
    replacement,
    setReplacement,
    protection,
    setProtection,
    acknowledgement,
    setAcknowledgement,
    busy,
    error,
    notice,
    unknown,
    leaving,
    setLeaving,
    activeMutation,
    stageLost,
    retained,
    stay,
    finish,
    restore,
    protectLocal,
    checkPending,
    reviewFile,
    checkUnknown,
  } = useBackupRestore({ host, initial, onCancel, onOpen, restage });
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !busy) {
          if (leaving) setLeaving(false);
          else if (!unknown) onCancel();
        }
      }}
    >
      <DialogContent initialFocus={() => (leaving ? stay.current : undefined)}>
        {leaving ? (
          <>
            <Dialog.Title>Review before leaving</Dialog.Title>
            <Dialog.Description>
              An issued restore may already be retained. Leaving discards
              session input; it does not roll back retained data.
            </Dialog.Description>
            <div className="dialog-actions flex justify-end gap-3 mt-6">
              <Button ref={stay} onClick={() => setLeaving(false)}>
                Stay here
              </Button>
              <Button
                disabled={busy}
                onClick={() => {
                  host.fence();
                  onCancel(true);
                }}
              >
                Leave
              </Button>
            </div>
          </>
        ) : (
          <>
            <Dialog.Title>
              {replacement ? "Replace local project" : "Review project backup"}
            </Dialog.Title>
            <Dialog.Description>
              Restore preserves identities and exact supported authored data.
              This is a project backup, separate from token interchange.
            </Dialog.Description>
            <h2 className="mt-5 wrap-anywhere">
              {preview.project.name || "(unnamed project)"}
            </h2>
            <dl className="text-caption mt-3 space-y-2">
              <div>
                <dt>Project identity</dt>
                <dd className="wrap-anywhere">
                  {JSON.stringify(preview.project.id)}
                </dd>
              </div>
              <div>
                <dt>Snapshot date</dt>
                <dd>{preview.createdAt}</dd>
              </div>
              <div>
                <dt>Supported content</dt>
                <dd>
                  {preview.groups} groups · {preview.tokens} tokens
                </dd>
              </div>
            </dl>
            <details className="text-caption my-4">
              <summary>
                Backup diagnostics · {preview.diagnostics.total}
              </summary>
              {preview.diagnostics.items.map((item, i) => (
                <pre className="whitespace-pre-wrap wrap-anywhere my-3" key={i}>
                  {item}
                </pre>
              ))}
              {!preview.diagnostics.complete && (
                <p role="status">
                  Diagnostic display is incomplete. This is not an all-clear
                  result; structural admission checks are complete.
                </p>
              )}
            </details>
            {preview.local && !replacement && (
              <section className="border border-border rounded p-3 text-caption">
                <h3>Same project identity already exists in this browser</h3>
                <p className="mt-2">
                  Local name: {preview.local.name || "(unnamed project)"}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    disabled={busy || unknown}
                    onClick={() => onOpen(preview.project.id)}
                  >
                    Open local project
                  </Button>
                  <Button
                    disabled={busy || unknown}
                    onClick={() => {
                      setReplacement(true);
                      setProtection(null);
                      setAcknowledgement(false);
                    }}
                  >
                    Review replacement
                  </Button>
                </div>
              </section>
            )}
            {replacement && preview.local && (
              <section className="border border-error-border bg-error-surface rounded p-3 text-caption">
                <p>
                  The complete selected backup will replace this local project's
                  applied state. Local-only authored content will be removed.
                  This does not merge projects.
                </p>
                <p className="mt-2 wrap-anywhere">
                  Protect local revision: {preview.local.revision}
                </p>
                <Button
                  className="mt-3"
                  disabled={busy || unknown}
                  onClick={protectLocal}
                >
                  Download current local backup
                </Button>
                <label className="flex gap-3 items-start mt-4">
                  <input
                    type="checkbox"
                    checked={acknowledgement}
                    disabled={!protection || busy || unknown}
                    onChange={(e) => setAcknowledgement(e.target.checked)}
                  />
                  <span>
                    I kept an independent backup of this exact local revision
                    and accept complete replacement.
                  </span>
                </label>
              </section>
            )}
            {busy && activeMutation.current && !unknown && (
              <section role="status" className="text-caption mt-4">
                <p>Retention pending. Duplicate restore is blocked.</p>
                <Button onClick={checkPending}>Check retained result</Button>
              </section>
            )}
            {retained && (
              <section role="status" className="text-caption mt-4">
                <p>
                  The original restore is retained. It will not be repeated.
                </p>
                <Button
                  disabled={busy}
                  onClick={() => onOpen(preview.project.id)}
                >
                  Open retained project
                </Button>
              </section>
            )}
            {stageLost && (
              <section role="status" className="text-caption mt-4">
                <p>
                  Selected file input is preserved; staging needs a fresh
                  explicit review.
                </p>
                <Button disabled={busy || !restage} onClick={reviewFile}>
                  Review selected file again
                </Button>
              </section>
            )}
            {unknown && (
              <section role="status" className="text-caption mt-4">
                <p>Retained result unknown. Do not repeat restore.</p>
                <Button disabled={busy} onClick={checkUnknown}>
                  Check retained result
                </Button>
                <Button disabled={busy} onClick={() => setLeaving(true)}>
                  Review before leaving
                </Button>
              </section>
            )}
            {error && (
              <p role="alert" className="text-caption text-destructive mt-4">
                {error}
              </p>
            )}
            <p role="status" className="text-caption mt-3">
              {notice}
            </p>
            <div className="dialog-actions flex justify-end gap-3 mt-6">
              <Button disabled={busy || unknown} onClick={() => onCancel()}>
                Cancel
              </Button>
              {(!preview.local || replacement) && (
                <Button
                  variant="default"
                  disabled={
                    busy ||
                    unknown ||
                    retained ||
                    stageLost ||
                    (!!preview.local &&
                      (!protection ||
                        !acknowledgement ||
                        protection !== preview.local.revision))
                  }
                  onClick={() => void restore()}
                >
                  {busy
                    ? "Retaining project…"
                    : preview.local
                      ? "Replace complete project"
                      : "Restore project"}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog.Root>
  );
}
