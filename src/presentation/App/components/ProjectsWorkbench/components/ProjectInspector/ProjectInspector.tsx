import type { CatalogueEntry } from "@application/retention/ports";
import { Button } from "@presentation/ui/button";
export function ProjectInspector({ entry, missing, catalogueUnavailable = false, disabled, onOpen, onDownload }: {
  entry?: CatalogueEntry; missing: boolean; catalogueUnavailable?: boolean; disabled: boolean; onOpen: (id: string) => void;
  onDownload: (entry: Extract<CatalogueEntry, { status: "supported" }>) => void;
}) {
  if (!entry) return <div className="p-6"><h2 className="text-inspector font-semibold">Select a project</h2><p className="mt-3 text-muted-foreground">Select a project to inspect it.</p></div>;
  const supported = entry.status === "supported" && !missing;
  return <div className="p-6 space-y-5">
    <div><p className="text-caption text-muted-foreground">PROJECT</p><h2 className="text-inspector font-semibold wrap-anywhere mt-2">{entry.status === "supported" ? entry.name || "(unnamed project)" : "Project unavailable"}</h2></div>
    {supported && <div className="flex flex-col gap-3"><Button variant="default" disabled={disabled} onClick={() => onOpen(entry.id)}>Open project</Button><Button disabled={disabled} onClick={() => onDownload(entry)}>Download backup</Button></div>}
    <dl className="space-y-4">
      {supported && <div className="flex items-start justify-between gap-4"><dt className="shrink-0 text-muted-foreground">Description</dt><dd tabIndex={entry.description ? 0 : undefined} className="m-0 min-w-0 max-h-48 overflow-auto text-right whitespace-pre-wrap wrap-anywhere">{entry.description || "No description"}</dd></div>}
      <div className="flex items-start justify-between gap-4"><dt className="shrink-0 text-muted-foreground">Status</dt><dd className="m-0 min-w-0 text-right wrap-anywhere">{missing ? "Unavailable — selected entry is no longer in the catalogue." : catalogueUnavailable ? "Catalogue unavailable or being refreshed. Last-known facts are shown." : entry.status === "supported" ? "Supported" : entry.reason}</dd></div>
      {supported && <>
        <div className="flex items-start justify-between gap-4"><dt className="shrink-0 text-muted-foreground">Created</dt><dd className="m-0 min-w-0 text-right wrap-anywhere">{entry.creationDate ? <time dateTime={entry.creationDate} title={entry.creationDate}>{new Date(entry.creationDate).toLocaleString()}</time> : "Unknown"}</dd></div>
        <div className="flex items-start justify-between gap-4"><dt className="shrink-0 text-muted-foreground">Last updated</dt><dd className="m-0 min-w-0 text-right wrap-anywhere">{entry.lastUpdatedDate ? <time dateTime={entry.lastUpdatedDate} title={entry.lastUpdatedDate}>{new Date(entry.lastUpdatedDate).toLocaleString()}</time> : "Unknown"}</dd></div>
        <div className="flex items-start justify-between gap-4"><dt className="shrink-0 text-muted-foreground">Tokens</dt><dd className="m-0 text-right">{entry.tokens}</dd></div>
        <div className="flex items-start justify-between gap-4"><dt className="shrink-0 text-muted-foreground">Groups</dt><dd className="m-0 text-right">{entry.groups}</dd></div>
      </>}
    </dl>
    <section className="border-t-hairline border-border pt-5" aria-label="Identity">
      <h3 className="text-caption font-semibold mb-3">Identity</h3>
      <dl><div className="flex items-start justify-between gap-4"><dt className="shrink-0 text-muted-foreground">ID</dt><dd className="m-0 min-w-0 text-right font-mono text-xs wrap-anywhere">{JSON.stringify(entry.id)}</dd></div></dl>
    </section><p className="text-caption text-muted-foreground">{supported ? "Catalogue facts are read only. Opening checks current retained state. Backups contain applied work, excluding drafts." : "This entry can be inspected. Open and backup are unavailable."}</p>
  </div>;
}
