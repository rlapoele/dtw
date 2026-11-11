import { UnknownWriteError } from "@presentation/host/worker-client";
import { useRef, useState, useEffect } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/components/ui/dialog-content";
import { Button } from "@presentation/components/ui/button";
import { downloadProjectBackup } from "@presentation/host/backup-file";
import type {
  RestorePreview,
  WorkbenchHost,
  PublicAcceptance,
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
  const [preview, setPreview] = useState(initial),
    [replacement, setReplacement] = useState(false),
    [protection, setProtection] = useState<string | null>(null),
    [acknowledgement, setAcknowledgement] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [unknown, setUnknown] = useState(false),
    [leaving, setLeaving] = useState(false);
  const knownAccepted = useRef(false),
    activeMutation = useRef(false);
  const [stageLost, setStageLost] = useState(false),
    [retained, setRetained] = useState(false);
  const stay = useRef<HTMLButtonElement>(null);
  async function refresh() {
    const next = await host.call("refreshStage", preview.stageId);
    setPreview(next);
    setProtection(null);
    setAcknowledgement(false);
  }
  async function finish(result: PublicAcceptance) {
    if (result.status === "unknown") {
      if (!knownAccepted.current) setUnknown(true);
      setError(result.reason);
      return;
    }
    if (result.status === "rejected") {
      setUnknown(false);
      setError(result.reason);
      try {
        await refresh();
      } catch {
        setStageLost(true);
        setError(
          result.reason +
            " The original worker stage is unavailable. Review the selected file again before an explicit retry.",
        );
      }
      return;
    }
    setUnknown(false);
    knownAccepted.current = true;
    setRetained(true);
    await host.call("consume", result.receipt.commandId);
    if (result.readback === "unavailable")
      setError(
        "Project retained; readback unavailable. Use Open local project to retry reading without repeating restore.",
      );
    else onOpen(result.receipt.result.id);
  }
  useEffect(() => {
    if (leaving) requestAnimationFrame(() => stay.current?.focus());
  }, [leaving]);
  async function restore() {
    if (busy || unknown || retained || stageLost) return;
    setBusy(true);
    activeMutation.current = true;
    setError("");
    try {
      await finish(
        await host.call("restore", {
          stageId: preview.stageId,
          projectId: preview.project.id,
          expectedRevision: preview.local?.revision ?? null,
          protectedRevision: protection,
          acknowledgement,
        }),
      );
    } catch (e) {
      if (!knownAccepted.current) setUnknown(true);
      setError(
        e instanceof Error
          ? e.message
          : "Restore outcome unknown; selected backup remains staged.",
      );
    } finally {
      activeMutation.current = false;
      setBusy(false);
    }
  }
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
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      const revision = await downloadProjectBackup(
                        host,
                        preview.project.id,
                        preview.local!.revision,
                      );
                      setProtection(revision);
                      setAcknowledgement(false);
                      setNotice(
                        "Backup download requested. Confirm you kept the independent file before replacing.",
                      );
                    } catch (e) {
                      setError(
                        e instanceof Error
                          ? e.message
                          : "Backup generation failed",
                      );
                      await refresh();
                    } finally {
                      setBusy(false);
                    }
                  }}
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
                <Button
                  onClick={async () => {
                    try {
                      await finish(await host.call("check", null));
                    } catch (e) {
                      setError(
                        e instanceof Error
                          ? e.message
                          : "Check failed; original outcome remains unknown.",
                      );
                    }
                  }}
                >
                  Check retained result
                </Button>
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
                <Button
                  disabled={busy || !restage}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      const next = await restage!();
                      setPreview(next);
                      setStageLost(false);
                      setProtection(null);
                      setAcknowledgement(false);
                      setReplacement(false);
                    } catch (error) {
                      setError(
                        error instanceof Error
                          ? error.message
                          : "Selected file could not be reviewed.",
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Review selected file again
                </Button>
              </section>
            )}
            {unknown && (
              <section role="status" className="text-caption mt-4">
                <p>Retained result unknown. Do not repeat restore.</p>
                <Button
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await finish(await host.call("check", null));
                    } catch (e) {
                      setError(
                        e instanceof Error
                          ? e.message
                          : "Result check failed; outcome remains unknown",
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
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
