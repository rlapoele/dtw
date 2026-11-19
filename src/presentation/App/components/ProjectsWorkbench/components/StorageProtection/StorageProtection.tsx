import type { StoragePersistenceStatus } from "@presentation/App/hooks/useStoragePersistence";
import { Button } from "@presentation/ui/button";

const messages: Record<StoragePersistenceStatus, string> = {
  checking: "Checking browser storage protection…",
  requesting: "Requesting browser storage protection…",
  protected: "Storage protection is enabled for this browser.",
  unprotected: "Storage protection has not been granted. Projects continue to save normally.",
  unsupported: "Storage protection is unavailable in this browser. Projects continue to save normally.",
  "check-error": "Storage protection status could not be checked. Projects continue to save normally.",
  "request-error": "The storage protection request failed. Projects continue to save normally.",
};
export function StorageProtection({ status, disabled, onRetry }: {
  status: StoragePersistenceStatus;
  disabled: boolean;
  onRetry: () => void;
}) {
  const actionable = status === "unprotected" || status === "check-error" || status === "request-error";
  return <details className="mt-8 border-t-hairline border-border pt-5">
    <summary className="cursor-pointer text-caption min-h-9">Browser retention</summary>
    <p role="status" className="mt-3 text-caption">{messages[status]}</p>
    <p className="mt-3 text-muted-foreground">Keep independent backups. Clearing browser data still removes projects. Drafts stay in this session.</p>
    {actionable && <Button className="mt-4" disabled={disabled} onClick={onRetry}>Retry storage protection</Button>}
  </details>;
}
