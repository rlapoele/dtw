import type { Token } from "@domain/token";
import type { DisplayPath } from "@application/retention/projections";
export function TokenMetadata({
  token,
  groupLabels,
  path,
}: {
  token: Omit<Token, "definition">;
  groupLabels: ReadonlyMap<string, string>;
  path: DisplayPath;
}) {
  const rows: [string, string][] = [
    ["Regeneration", token.authoring.regeneration],
    ["Semantic role", token.semanticRole ?? "Unspecified"],
    ["Parent group", token.parentGroupId === null ? "Project root" : groupLabels.get(token.parentGroupId) ?? "Missing group"],
    ["Project identity", JSON.stringify(token.projectId)],
    ["Token identity", JSON.stringify(token.id)],
    ["Parent identity", JSON.stringify(token.parentGroupId)],
    ["Path status", path.status],
  ];
  if (path.status === "derived") rows.push(["Path segments", JSON.stringify(path.path)]);
  else if (path.status === "unavailable") rows.push(["Path unavailable", path.reason]);
  else path.diagnostics.forEach((issue, index) => rows.push([`Path diagnostic ${index + 1}`, JSON.stringify(issue)]));
  return <dl className="details text-caption">{rows.map(([label, value]) =>
    <div key={label} className="flex justify-between gap-4 py-2.5 border-b-hairline border-border last:border-0">
      <dt className="text-muted-foreground">{label}</dt><dd className="text-right min-w-0 wrap-anywhere whitespace-pre-wrap">{value}</dd>
    </div>)}
  </dl>;
}
