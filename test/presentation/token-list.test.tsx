import { tokenNavigation } from "@presentation/App/components/TokensWorkbench/helpers/token-navigation";
import { scopeKey, creationParent } from "@presentation/App/components/TokensWorkbench/helpers/browse-view";
import { TypeBranch } from "@presentation/App/components/TokensWorkbench/components/TokenNavigation/components/TypeBranch";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { admitSnapshot, encodeBackup } from "@application/retention/codec";
import { displayRows, projectContext } from "@application/retention/projections";
import { validateHostOutput } from "@hosts/browser/validation";
import { tokenListRows } from "@presentation/App/components/TokensWorkbench/helpers/token-list-order";
import { TokenTable } from "@presentation/App/components/TokensWorkbench/components/TokenWorkspace/components/TokenTable/TokenTable";
const color = { kind: "literal", valueType: "color", colorSpace: "srgb", components: ["0.5", "0", "1"], alpha: "0.5" };
const ref = (id: string, valuePath: string[] = []) => ({ kind: "token-reference", targetTokenId: id, valuePath: valuePath.map(key => ({ kind: "field", key })) });
const group = (id: string, localName: string, parentGroupId: string | null = null) => ({ id, localName, parentGroupId, projectId: "p" });
const token = (id: string, localName: string, parentGroupId: string | null, type = "color", layer?: string, value: unknown = color) => ({ id, localName, parentGroupId, projectId: "p", authoring: { regeneration: "protected" }, description: "A description", ...(layer ? { layer } : {}), ...(layer === "component" ? { componentDefinitionId: "component" } : {}), definition: { type, assignments: [{ condition: [], value }] } });
const snapshot = () => admitSnapshot({ project: { id: "p", name: "List fixture" }, groups: [group("root", "root"), group("sub10", "10", "root"), group("sub2", "2", "root"), group("lookalike", "root"), group("cycle", "cycle", "cycle"), group("missing", "missing", "absent")], tokens: [
  token("c10", "10", "sub2", "color", "primitive"), token("c2", "2", "sub2", "color", "primitive"), token("c100", "100", "sub2", "color", "primitive"),
  token("semantic", "alias", "root", "color", "semantic", ref("c2")), token("component", "component", "sub10", "color", "component"), token("unspecified", "loose", null),
  token("dimension", "spacing", "root", "dimension", "primitive", { kind: "literal", valueType: "dimension", value: "12", unit: "px" }), token("duration", "time", "root", "duration", undefined, { kind: "literal", valueType: "duration", value: "150", unit: "ms" }),
  token("lookalike", "different", "lookalike"), token("cyclic", "cyclic", "cycle"), token("orphan", "orphan", "missing"),
  token("broken", "broken", null, "color", "semantic", ref("absent")), token("self", "self", null, "color", "semantic", ref("self")), token("path", "path", null, "color", "semantic", ref("c2", ["alpha"])),
] });
describe("production token list properties and contextual ordering", () => {
  it("sorts by declared type/layer then natural paths/names; search retains order without writes", () => {
    const source = snapshot(), context = projectContext(source), rows = displayRows(source, 0, 100), before = encodeBackup(source, "2026-11-18T00:00:00.000Z");
    const ordered = tokenListRows(rows, context, null, "");
    expect(ordered.slice(0, 3).map(row => row.id)).toEqual(["c2", "c10", "c100"]);
    expect(ordered.indexOf(rows.find(row => row.id === "semantic")!)).toBeLessThan(ordered.indexOf(rows.find(row => row.id === "component")!));
    expect(ordered.slice(-2).map(row => row.id)).toEqual(["dimension", "duration"]);
    expect(tokenListRows(rows, context, null, "root / 2").map(row => row.id)).toEqual(["c2", "c10", "c100"]);
    expect(encodeBackup(source, "2026-11-18T00:00:00.000Z")).toBe(before);
  });
  it("includes descendants by identity, direct names first, rejecting broken ancestry and lookalikes", () => {
    const source = snapshot(), context = projectContext(source), rows = displayRows(source, 0, 100);
    expect(tokenListRows(rows, context, "root", "").map(row => row.id)).toEqual(["semantic", "dimension", "duration", "c2", "c10", "c100", "component"]);
    expect(tokenListRows(rows, context, "cycle", "")).toEqual([]);
    expect(tokenListRows(rows, context, "missing", "")).toEqual([]);
    const foreign = { ...context, groups: context.groups.map(g => g.authored.id === "root" ? { ...g, authored: { ...g.authored, projectId: "foreign" as typeof g.authored.projectId } } : g) };
    expect(tokenListRows(rows, foreign, "root", "")).toEqual([]);
  });
  it("transports only needed summaries with protection and honest failed-reference previews", () => {
    const rows = displayRows(snapshot(), 0, 100);
    expect(() => validateHostOutput("rows", { projectId: "p", revision: "r", offset: 0, count: 100 }, rows)).not.toThrow();
    expect(rows.find(row => row.id === "dimension")).toMatchObject({ quantity: { value: "12", unit: "px" }, regeneration: "protected" });
    expect(rows.find(row => row.id === "duration")).toMatchObject({ quantity: { value: "150", unit: "ms" } });
    for (const id of ["broken", "self", "path"]) expect(rows.find(row => row.id === id)?.preview).toBeUndefined();
    expect(rows.find(row => row.id === "semantic")?.preview).toEqual(color);
  });
  it("renders full identity, protection, authored summary, collapsed other spaces and a resolved alias stack", () => {
    const source = snapshot(), context = projectContext(source), rows = displayRows(source, 0, 100);
    const render = (id: string) => renderToStaticMarkup(<TokenTable context={context} rows={rows.filter(row => row.id === id)} selected={id} query="" onSelect={() => {}} onEmptyAction={() => {}} />);
    const literal = render("c2"), alias = render("semantic");
    for (const label of ["Type", "Layer", "Value", "Protected from regeneration", "root / 2 / 2", "A description", "#8000FF", "sRGB", "Display P3", "HSL", "OKLAB", "OKLCH"]) expect(literal).toContain(label);
    expect(literal).toContain('aria-pressed="true"');
    expect(literal.replace(/<[^>]*>/g, "")).toContain("Alpha 0.5");
    expect(literal).toContain('class="block text-foreground"');
    expect(alias).not.toContain('class="block text-foreground"');
    expect(alias).toContain("root / 2 / 2");
    expect(alias).toContain("Resolved · sRGB");
    expect(literal).not.toContain("Resolved ·");
    expect(literal).toContain('aria-expanded="false"');
    expect(literal).toMatch(/id="[^"]+" hidden=""/);
    expect(literal).not.toMatch(/<button[^>]*class="token-row/);
    expect(render("broken")).toContain("Color unavailable");
    expect(render("dimension")).toContain("12 px");
  });
  it("offers only explicit members a renamed ramp destination, not siblings or aliases", () => {
    const source = snapshot(), context = projectContext(source), rows = displayRows(source, 0, 100);
    const group = context.groups.find(group => group.authored.id === "sub2")!;
    const changed = { ...context, groups: context.groups.map(entry => entry === group ? {
      ...entry, path: {status: "derived" as const, path: ["renamed"]}, authored: {...entry.authored, localName: "renamed", colorRamp: {members: [{tokenId: "c2", colorOrigin: "generated"}]}}
    } : entry) } as typeof context;
    const render = (id: string) => renderToStaticMarkup(<TokenTable context={changed} rows={rows.filter(row => row.id === id)} selected={null} query="" onSelect={() => {}} onEmptyAction={() => {}} onOpenRamp={() => {}} />);
    expect(render("c2")).toContain("Ramp · renamed");
    expect(render("c10")).not.toContain("Ramp ·");
    expect(render("semantic")).not.toContain("Ramp ·");
  });

});

describe("hierarchical token navigation", () => {
  it("projects whole-project counts, root scopes and stable overlapping subtree leaves", () => {
    const source = snapshot(), context = projectContext(source), rows = displayRows(source, 0, 100);
    const branches = tokenNavigation(rows, context), colors = branches.find(branch => branch.scope.type === "color")!;
    expect(colors.count).toBe(12);
    expect(branches.map(branch => branch.scope.type)).toEqual(["color", "dimension", "duration"]);
    expect(colors.children!.map(branch => branch.scope.layer)).toEqual(["primitive", "semantic", "component", "Unspecified"]);
    const root = colors.children!.find(branch => branch.scope.layer === "semantic")!.children!.find(branch => branch.label === "Project root")!;
    expect(tokenListRows(rows, context, root.scope, "").map(row => row.id)).toEqual(["broken", "path", "self"]);
    expect(tokenListRows(rows, context, {kind: "type", type: "color", layer: "primitive", location: {kind: "group", id: "root"}}, "").map(row => row.id)).toEqual(["c2", "c10", "c100"]);
    expect(tokenListRows(rows, context, {kind: "type", type: "color"}, "root / 2").map(row => row.id)).toEqual(["c2", "c10", "c100"]);
    expect(tokenNavigation(rows, context)).toEqual(branches);
    expect(creationParent(root.scope)).toBeNull();
    expect(creationParent({kind: "type", type: "color", layer: "primitive"})).toBeNull();
    expect(creationParent({kind: "type", type: "color", location: {kind: "group", id: "root"}})).toBe("root");
  });
  it("keeps identities through rename/move, disambiguates equal paths and drops empty branches", () => {
    const source = snapshot(), context = projectContext(source), rows = displayRows(source, 0, 100);
    const scope = {kind: "type" as const, type: "color" as const, layer: "Unspecified" as const, location: {kind: "group" as const, id: "lookalike"}};
    expect(tokenListRows(rows, context, scope, "").map(row => row.id)).toEqual(["lookalike"]);
    const changed = projectContext({...source, groups: source.groups.map(group => group.id === "lookalike" ? {...group, localName: "renamed", parentGroupId: source.groups[0].id} : group)});
    expect(tokenListRows(rows, changed, scope, "").map(row => row.id)).toEqual(["lookalike"]);
    expect(tokenNavigation(rows, context).find(branch => branch.scope.type === "color")!.children!.find(branch => branch.scope.layer === "Unspecified")!.children!.find(branch => branch.scope.location?.kind === "group" && branch.scope.location.id === "lookalike")!.label).toContain("lookalik");
    expect(tokenNavigation([], context)).toEqual([]);
    expect(tokenNavigation(rows.filter(row => row.type !== "duration"), context).some(branch => branch.scope.type === "duration")).toBe(false);
    const layered = [...rows, {...rows[0], id: "direct", parentGroupId: "root"}];
    const leaves = tokenNavigation(layered, context)[0].children![0].children!;
    expect(leaves.find(leaf => leaf.scope.location?.kind === "group" && leaf.scope.location.id === "root")?.count).toBe(4);
    expect(leaves.find(leaf => leaf.scope.location?.kind === "group" && leaf.scope.location.id === "sub2")?.count).toBe(3);
  });
  it("renders separate current scope and disclosure controls, with single-token paths always expanded", () => {
    const source = snapshot(), context = projectContext(source), rows = displayRows(source, 0, 100), branches = tokenNavigation(rows, context);
    const color = branches[0], duration = branches.find(branch => branch.scope.type === "duration")!;
    const render = (branch: typeof color) => renderToStaticMarkup(<TypeBranch branch={branch} depth={0} view={branch.scope} collapsed={new Set([scopeKey(branch.scope)])} onToggle={() => {}} onSelect={() => {}} />);
    const closed = render(color), single = render(duration);
    expect(closed).toContain('aria-current="page"');
    expect(closed).toContain('aria-expanded="false"');
    expect(closed).toContain('inert=""');
    expect(closed).toContain('aria-hidden="true"');
    expect(single).not.toContain('aria-expanded=');
    expect(single).not.toContain('inert=');
    expect(single).toContain('data-expanded="true"');
    expect(single).toContain("Unspecified")
  });
});
