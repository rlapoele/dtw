import type { ProjectContext } from "@application/retention/projections";
import { pathLabel } from "../coordination/readback";
import { ExactSource } from "../components/ExactSource";
export function GroupInspector({
  entry,
  projectId,
  revision,
  requestSource,
}: {
  entry: ProjectContext["groups"][number] | undefined;
  projectId: string;
  revision: string;
  requestSource: () => Promise<string>;
}) {
  return (
    <div className="p-5">
      <p className="text-caption text-muted-foreground">Group · Read only</p>
      <h2 className="wrap-anywhere">
        {entry?.authored.localName || "(unnamed group)"}
      </h2>
      <p className="wrap-anywhere mt-2">
        {entry?.path.status === "derived"
          ? pathLabel(entry.path)
          : "Path unavailable"}
      </p>
      {entry && entry.path.status !== "derived" && (
        <p className="text-caption wrap-anywhere">
          Parent identity: {JSON.stringify(entry.authored.parentGroupId)}. Exact
          namespace diagnostics are available below.
        </p>
      )}
      <details className="text-caption mt-4">
        <summary>Identity and path details</summary>
        <p className="wrap-anywhere">
          Project identity: {JSON.stringify(projectId)}
        </p>
        <p className="wrap-anywhere">
          Group identity: {JSON.stringify(entry?.authored.id)}
        </p>
        <pre className="whitespace-pre-wrap wrap-anywhere">
          {JSON.stringify(entry?.path, null, 2)}
        </pre>
      </details>
      <ExactSource
        key={JSON.stringify([entry?.authored.id, revision])}
        revision={revision}
        request={requestSource}
      />
    </div>
  );
}
