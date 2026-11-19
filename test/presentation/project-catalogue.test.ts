import { expect, it } from "vitest";
import { ambiguousProjectNames, browseProjects } from "@presentation/App/components/ProjectsWorkbench/helpers/project-catalogue";
import type { CatalogueEntry } from "@application/retention/ports";

const entry = (rowKey: string, name: string, id = rowKey): CatalogueEntry => ({ rowKey, id, name, status: "supported", revision: "r", tokens: 0, groups: 0 });
it("matches exact authored fields with deterministic case folding and trimmed query edges", () => {
  const entries: CatalogueEntry[] = [
    { ...entry("one", "Atlas"), description: "  STOREFRONT\nDesign  " } as CatalogueEntry,
    { rowKey: "bad", id: "opaque", status: "unavailable", reason: "Unsupported version" },
  ];
  expect(browseProjects(entries, " storefront ").map(e => e.rowKey)).toEqual(["one"]);
  expect(browseProjects(entries, " OPAQUE ").map(e => e.rowKey)).toEqual(["bad"]);
  expect(browseProjects(entries, "Project unavailable").map(e => e.rowKey)).toEqual(["bad"]);
  expect(browseProjects(entries, "Unsupported version")).toEqual([]);
  expect(browseProjects(entries, "   ")).toHaveLength(2);
});
it("sorts naturally, breaks ties by exact identity then rowKey, without mutating the catalogue", () => {
  const entries = [entry("z", "Project 10"), entry("b", "Project 2", "same"), entry("a", "project 2", "same"), entry("c", "PROJECT 2", "A")];
  expect(browseProjects(entries, "").map(e => e.rowKey)).toEqual(["c", "a", "b", "z"]);
  expect(entries[0].rowKey).toBe("z");
});
it("keeps duplicate disambiguation based on the complete catalogue", () => {
  const entries = [entry("first", "Atlas"), entry("second", "Atlas")];
  expect(browseProjects(entries, "first")).toHaveLength(1);
  expect(ambiguousProjectNames(entries).has("Atlas")).toBe(true);
});
