import { describe, expect, it } from "vitest";
import { createAuthoringOperations } from "@application/authoring";
import { InMemoryProjectStorage } from "@adapters/in-memory-project-storage";
import type { ApplicationResult, CreateColorTokenInput } from "@application/authoring";
import type { ProjectSnapshot, ProjectStorage, StorageResult } from "@application/project-storage";

function ok<T>(result: ApplicationResult<T>): T {
  expect(result.status).toBe("ok");
  if (result.status !== "ok") throw new Error(JSON.stringify(result));
  return result.value;
}

const literalInput: CreateColorTokenInput = {
  projectId: "p", id: "primitive", localName: "900", parentGroupId: "neutral", type: "color",
  layer: "primitive", regeneration: "protected",
  value: { kind: "literal", colorSpace: "srgb", components: ["-0.2", "none", "1.23456789123456789"], alpha: "0.9" },
};

function setup() {
  const storage = new InMemoryProjectStorage();
  const app = createAuthoringOperations(storage);
  ok(app.createProject({ id: "p", name: "Product" }));
  return { app, storage };
}

function organize(app: ReturnType<typeof createAuthoringOperations>) {
  ok(app.createGroup({ projectId: "p", id: "palette", localName: "  palette.one  ", parentGroupId: null }));
  ok(app.createGroup({ projectId: "p", id: "neutral", localName: "neutral", parentGroupId: "palette", description: "Exact" }));
}

describe("project authoring boundary", () => {
  it("creates and reads an empty project without a workspace path", () => {
    const app = createAuthoringOperations(new InMemoryProjectStorage());
    expect(app.createProject({ id: "p", name: "  Product  ", description: "" })).toEqual({
      status: "ok", value: { id: "p", name: "  Product  ", description: "" },
    });
    expect(app.readProject("p")).toEqual({
      status: "ok", value: {
        project: { id: "p", name: "  Product  ", description: "" }, groups: [], tokens: [],
      },
    });
  });

  it("reports unknown projects and rejects duplicate project IDs without overwriting", () => {
    const app = createAuthoringOperations(new InMemoryProjectStorage());
    expect(app.readProject("missing")).toEqual({ status: "failure", error: { code: "project-not-found", projectId: "missing" } });
    app.createProject({ id: "p", name: "Original" });
    expect(app.createProject({ id: "p", name: "Replacement" })).toEqual({
      status: "failure", error: { code: "duplicate-identity", entityKind: "project", entityId: "p" },
    });
    expect(app.readProject("p")).toMatchObject({ status: "ok", value: { project: { name: "Original" } } });
  });
});

describe("color authoring workflow", () => {
  it("authors literals and explicit aliases, then renames an ancestor without rewriting identities or values", () => {
    const { app } = setup();
    organize(app);
    const primitive = ok(app.createColorToken(literalInput));
    const alias = ok(app.createColorToken({
      projectId: "p", id: "content", localName: "content.primary", parentGroupId: null, type: "color",
      layer: "semantic", semanticRole: "content", description: "", regeneration: "allowed",
      value: { kind: "token-reference", targetTokenId: primitive.id, valuePath: [] },
    }));
    expect(primitive.definition).toEqual({ type: "color", assignments: [{ condition: [], value: {
      kind: "literal", valueType: "color", colorSpace: "srgb", components: ["-0.2", "none", "1.23456789123456789"], alpha: "0.9",
    } }] });
    expect(alias).toMatchObject({ layer: "semantic", semanticRole: "content", description: "", definition: { assignments: [{ condition: [], value: { kind: "token-reference", targetTokenId: "primitive", valuePath: [] } }] } });
    const before = ok(app.readProject("p"));
    expect(before.groups.map(entry => entry.path)).toEqual([
      { status: "derived", path: ["  palette.one  "] }, { status: "derived", path: ["  palette.one  ", "neutral"] },
    ]);
    expect(ok(app.inspectToken("p", "primitive")).path).toEqual({ status: "derived", path: ["  palette.one  ", "neutral", "900"] });
    const inspected = ok(app.inspectToken("p", "content"));
    expect(inspected.path).toEqual({ status: "derived", path: ["content.primary"] });
    expect(inspected.resolution).toMatchObject({ status: "resolved", selection: [], matchedCondition: [], value: primitive.definition!.assignments[0].value, diagnostics: [], trace: [
      { tokenId: "content", matchedCondition: [], specificity: 0, targetTokenId: "primitive" },
      { tokenId: "primitive", matchedCondition: [], specificity: 0 },
    ] });
    expect(app.readProject("p")).toEqual({ status: "ok", value: before });
    ok(app.renameGroup("p", "palette", "colors"));
    expect(ok(app.inspectToken("p", "primitive")).path).toEqual({ status: "derived", path: ["colors", "neutral", "900"] });
    expect(ok(app.inspectToken("p", "content"))).toEqual(inspected);
    expect(ok(app.readProject("p")).tokens.map(entry => entry.authored)).toEqual([primitive, alias]);
    expect(ok(app.validateProject("p"))).toEqual({ namespaceDiagnostics: [], referenceDiagnostics: [] });
  });

  it.each([
    { colorSpace: "hsl", components: ["-30.5", "50", "25"], alpha: "1", expected: ["329.5", "50", "25"] },
    { colorSpace: "display-p3", components: ["1.2", "0", "none"], alpha: "0", expected: ["1.2", "0", "none"] },
    { colorSpace: "oklab", components: ["0.5", "-0.1", "0.2"], alpha: "0.5", expected: ["0.5", "-0.1", "0.2"] },
    { colorSpace: "oklch", components: ["0.5", "0.2", "720"], alpha: "1", expected: ["0.5", "0.2", "0"] },
  ])("accepts existing $colorSpace construction semantics", ({ expected, ...value }) => {
    const { app } = setup();
    const token = ok(app.createColorToken({ ...literalInput, parentGroupId: null, value: { kind: "literal", ...value } }));
    expect(token.definition!.assignments[0].value).toMatchObject({ ...value, components: expected });
  });

  it("preserves opaque duplicate sibling names and reports structural checks only", () => {
    const { app } = setup();
    ok(app.createGroup({ projectId: "p", id: "g1", localName: "", parentGroupId: null }));
    ok(app.createGroup({ projectId: "p", id: "g2", localName: "", parentGroupId: null }));
    ok(app.createColorToken({ ...literalInput, localName: "", parentGroupId: null }));
    expect(ok(app.readProject("p")).groups.map(entry => entry.path)).toEqual([
      { status: "derived", path: [""] }, { status: "derived", path: [""] },
    ]);
    expect(ok(app.validateProject("p"))).toEqual({ namespaceDiagnostics: [], referenceDiagnostics: [] });
  });
});

describe("rejected commands and storage boundary", () => {
  it.each([
    { colorSpace: "srgb", components: ["0.10", "0", "0"], alpha: "1" },
    { colorSpace: "srgb", components: ["0", "0"], alpha: "1" },
    { colorSpace: "srgb", components: new Array<string>(3), alpha: "1" },
    { colorSpace: "rgb", components: ["0", "0", "0"], alpha: "1" },
    { colorSpace: "srgb", components: ["0", "0", "0"], alpha: "1.1" },
    { colorSpace: "srgb", components: ["#fff", "0", "0"], alpha: "1" },
  ])("rejects invalid color input without a write: %j", value => {
    const { app, storage } = setup();
    const before = storage.load("p");
    expect(app.createColorToken({ ...literalInput, parentGroupId: null, value: { kind: "literal", ...value } })).toMatchObject({
      status: "failure", error: { code: "invalid-domain-input", message: expect.any(String) },
    });
    expect(storage.load("p")).toEqual(before);
  });

  it("rejects unknown projects and entities, duplicate IDs, missing/foreign parents and foreign targets without changing either project", () => {
    const { app, storage } = setup();
    organize(app);
    ok(app.createColorToken(literalInput));
    ok(app.createProject({ id: "q", name: "Other" }));
    ok(app.createGroup({ projectId: "q", id: "foreign-group", localName: "Other", parentGroupId: null }));
    ok(app.createColorToken({ ...literalInput, projectId: "q", id: "foreign-token", parentGroupId: null }));
    const before = [storage.load("p"), storage.load("q")];
    expect(app.createGroup({ projectId: "missing", id: "g", localName: "", parentGroupId: null })).toMatchObject({ status: "failure", error: { code: "project-not-found" } });
    expect(app.createColorToken({ ...literalInput, projectId: "missing" })).toMatchObject({ status: "failure", error: { code: "project-not-found" } });
    expect(app.renameGroup("missing", "palette", "new")).toMatchObject({ status: "failure", error: { code: "project-not-found" } });
    expect(app.inspectToken("missing", "primitive")).toMatchObject({ status: "failure", error: { code: "project-not-found" } });
    expect(app.validateProject("missing")).toMatchObject({ status: "failure", error: { code: "project-not-found" } });
    expect(app.renameGroup("p", "foreign-group", "new")).toMatchObject({ status: "failure", error: { code: "entity-not-found" } });
    expect(app.inspectToken("p", "foreign-token")).toMatchObject({ status: "failure", error: { code: "entity-not-found" } });
    expect(app.renameGroup("p", "absent", "new")).toMatchObject({ status: "failure", error: { code: "entity-not-found" } });
    expect(app.createColorToken(literalInput)).toMatchObject({ status: "failure", error: { code: "duplicate-identity", entityKind: "token" } });
    expect(app.createGroup({ projectId: "p", id: "palette", localName: "overwrite", parentGroupId: null })).toMatchObject({ status: "failure", error: { code: "duplicate-identity", entityKind: "group" } });
    for (const parentGroupId of ["missing", "foreign-group"]) {
      expect(app.createGroup({ projectId: "p", id: "proposed", localName: "", parentGroupId })).toMatchObject({ status: "failure", error: { code: "invalid-candidate", namespaceDiagnostics: [{ code: "missing-parent-group", entityId: "proposed", parentGroupId }] } });
      expect(app.createColorToken({ ...literalInput, id: "proposed", parentGroupId })).toMatchObject({ status: "failure", error: { code: "invalid-candidate", namespaceDiagnostics: [{ code: "missing-parent-group", entityId: "proposed", parentGroupId }] } });
    }
    for (const targetTokenId of ["missing", "foreign-token"]) {
      expect(app.createColorToken({ ...literalInput, id: "alias", value: { kind: "token-reference", targetTokenId, valuePath: [] } })).toMatchObject({ status: "failure", error: { code: "invalid-candidate", referenceDiagnostics: [{ code: "missing-reference", tokenId: "alias", targetTokenId, condition: [] }] } });
    }
    expect([storage.load("p"), storage.load("q")]).toEqual(before);
    expect(ok(app.readProject("p")).tokens.map(entry => entry.authored.id)).toEqual(["primitive"]);
    // Identities are project/collection-scoped; no global identity registry.
    ok(app.createGroup({ projectId: "q", id: "primitive", localName: "", parentGroupId: null }));
    ok(app.createColorToken({ ...literalInput, projectId: "q", parentGroupId: null }));
  });

  it("copies caller inputs, command results, project reads and resolution results", () => {
    const { app, storage } = setup();
    const components = ["0.1", "none", "1"];
    const input = { ...literalInput, parentGroupId: null, value: { kind: "literal" as const, colorSpace: "srgb", components, alpha: "1" } };
    const token = ok(app.createColorToken(input));
    const before = storage.load("p");
    components[0] = "0.8";
    (token as { localName: string }).localName = "mutated result";
    const read = ok(app.readProject("p"));
    (read.project as { name: string }).name = "mutated read";
    (read.tokens[0].authored.definition!.assignments as unknown[]).length = 0;
    const inspection = ok(app.inspectToken("p", "primitive"));
    if (inspection.resolution.status !== "resolved") throw new Error("Expected resolution");
    (inspection.resolution.selection as unknown as unknown[]).push({ axisId: "invented", optionId: "invented" });
    (inspection.resolution.value as unknown as { components: string[] }).components[0] = "0.7";
    expect(storage.load("p")).toEqual(before);
    expect(ok(app.inspectToken("p", "primitive")).resolution).toMatchObject({ status: "resolved", selection: [], value: { components: ["0.1", "none", "1"] } });
  });

  it("commits exactly once for successful modifications and never for rejected candidates", () => {
    const storage = new ControlledStorage();
    const app = createAuthoringOperations(storage);
    ok(app.createProject({ id: "p", name: "Product" }));
    expect(storage.commits).toBe(1);
    ok(app.createGroup({ projectId: "p", id: "neutral", localName: "neutral", parentGroupId: null }));
    expect(storage.commits).toBe(2);
    ok(app.renameGroup("p", "neutral", "gray"));
    expect(storage.commits).toBe(3);
    ok(app.createColorToken(literalInput));
    expect(storage.commits).toBe(4);
    app.createColorToken(literalInput);
    app.createGroup({ projectId: "p", id: "bad", localName: "", parentGroupId: "missing" });
    app.readProject("p"); app.inspectToken("p", "primitive"); app.validateProject("p");
    expect(storage.commits).toBe(4);
  });

  it("distinguishes load/commit failures and preserves prior state for every modifying operation", () => {
    const storage = new ControlledStorage();
    const app = createAuthoringOperations(storage);
    ok(app.createProject({ id: "p", name: "Product" }));
    ok(app.createGroup({ projectId: "p", id: "neutral", localName: "neutral", parentGroupId: null }));
    const before = storage.delegate.load("p");
    storage.failCommit = true;
    const commands = [
      () => app.createProject({ id: "q", name: "Other" }),
      () => app.createGroup({ projectId: "p", id: "g", localName: "", parentGroupId: null }),
      () => app.renameGroup("p", "neutral", "changed"),
      () => app.createColorToken(literalInput),
    ];
    for (const command of commands) {
      expect(command()).toEqual({ status: "failure", error: { code: "storage-failure", operation: "commit", message: "Commit unavailable" } });
      expect(storage.delegate.load("p")).toEqual(before);
      expect(storage.delegate.load("q")).toEqual({ status: "ok", value: undefined });
    }
    storage.failLoad = true;
    expect(app.readProject("p")).toEqual({ status: "failure", error: { code: "storage-failure", operation: "load", message: "Load unavailable" } });
    expect(app.createProject({ id: "q", name: "Other" })).toMatchObject({ status: "failure", error: { code: "storage-failure", operation: "load" } });
  });

  it("does not relabel unexpected programmer exceptions as invalid authoring", () => {
    const storage = new ControlledStorage();
    const app = createAuthoringOperations(storage);
    ok(app.createProject({ id: "p", name: "Product" }));
    storage.commit = () => { throw new TypeError("Programmer fault"); };
    expect(() => app.createColorToken({ ...literalInput, parentGroupId: null })).toThrow("Programmer fault");
  });
});

class ControlledStorage implements ProjectStorage {
  readonly delegate = new InMemoryProjectStorage();
  commits = 0;
  failLoad = false;
  failCommit = false;
  load(projectId: string): StorageResult<ProjectSnapshot | undefined> {
    return this.failLoad ? { status: "failure", message: "Load unavailable" } : this.delegate.load(projectId);
  }
  commit(snapshot: ProjectSnapshot): StorageResult<void> {
    this.commits += 1;
    return this.failCommit ? { status: "failure", message: "Commit unavailable" } : this.delegate.commit(snapshot);
  }
}

describe("token creation descriptions", () => {
  it.each([undefined, "", "  ", " First line\nSecond line  "])("retains exact optional description %j through real creation and revision", (description) => {
    const { app } = setup();
    const token = ok(app.createColorToken({
      ...literalInput, parentGroupId: null, description,
    }));
    expect(token.description).toBe(description);
    expect(ok(app.readProject("p")).tokens[0].authored.description).toBe(description);
    const revised = ok(app.reviseColorToken({ projectId: "p", tokenId: token.id, value: { kind: "literal", colorSpace: "hsl", components: ["37", "42", "63"], alpha: "0.5" } }));
    expect(revised.description).toBe(description);
  });
});
