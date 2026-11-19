import type { CatalogueEntry } from "@application/retention/ports";

const names = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
const exactCompare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;

export function projectLabel(entry: CatalogueEntry) {
  return entry.status === "supported" ? entry.name || "(unnamed project)" : "Project unavailable";
}

export function browseProjects(entries: readonly CatalogueEntry[], query: string) {
  const needle = query.trim().toLowerCase();
  return entries.filter(entry => [
    projectLabel(entry), entry.id,
    entry.status === "supported" ? entry.description ?? "" : "",
  ].some(value => value.toLowerCase().includes(needle))).sort((a, b) =>
    names.compare(projectLabel(a), projectLabel(b)) || exactCompare(a.id, b.id) || exactCompare(a.rowKey, b.rowKey));
}

export function ambiguousProjectNames(entries: readonly CatalogueEntry[]) {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const label = projectLabel(entry);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return new Set([...counts].filter(([, count]) => count > 1).map(([name]) => name));
}
