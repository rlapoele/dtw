import type { CatalogueEntry } from "@application/retention/ports";
import { Button } from "@presentation/ui/button";
export function ProjectInspector({ entry, missing, catalogueUnavailable = false, disabled, onOpen, onDownload }: {
  entry?: CatalogueEntry; missing: boolean; catalogueUnavailable?: boolean; disabled: boolean; onOpen: (id: string) => void;
  onDownload: (entry: Extract<CatalogueEntry, { status: "supported" }>) => void;
}) {
  if (!entry) return <div className="p-6"><h2>Select a project</h2><p className="mt-3 text-muted-foreground">Select a project to inspect it.</p></div>;
  const supported = entry.status === "supported" && !missing;
  return <div className="p-6 space-y-5">
    <div><p className="text-caption text-muted-foreground">PROJECT</p><h2 className="wrap-anywhere mt-2">{entry.status === "supported" ? entry.name || "(unnamed project)" : "Project unavailable"}</h2></div>
    {supported && <div className="flex flex-col gap-3"><Button variant="default" disabled={disabled} onClick={() => onOpen(entry.id)}>Open project</Button><Button disabled={disabled} onClick={() => onDownload(entry)}>Download backup</Button></div>}
    <dl className="space-y-4"><div><dt className="text-muted-foreground">Identity</dt><dd className="m-0 mt-1 font-mono text-xs wrap-anywhere">{JSON.stringify(entry.id)}</dd></div><div><dt className="text-muted-foreground">Status</dt><dd className="m-0 mt-1">{missing ? "Unavailable — selected entry is no longer in the catalogue." : catalogueUnavailable ? "Catalogue unavailable or being refreshed. Last-known facts are shown." : entry.status === "supported" ? "Supported" : entry.reason}</dd></div>
    {supported && <><div><dt className="text-muted-foreground">Contents</dt><dd className="m-0 mt-1">{entry.tokens} tokens · {entry.groups} groups</dd></div></>}
    </dl><p className="text-caption text-muted-foreground">{supported ? "Catalogue facts are read only. Opening checks current retained state. Backups contain applied work, excluding drafts." : "This entry can be inspected. Open and backup are unavailable."}</p>
  </div>;
}
