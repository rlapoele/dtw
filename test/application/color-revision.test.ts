import { describe, expect, it } from "vitest";
import { createAuthoringOperations } from "@application/authoring";
import type { ApplicationResult, CreateColorTokenInput } from "@application/authoring";
import { InMemoryProjectStorage } from "@adapters/in-memory-project-storage";
import type { ProjectSnapshot, ProjectStorage, StorageResult } from "@application/project-storage";
import { createProject } from "@domain/project";
import { createToken } from "@domain/token";
import type { ImplementedAuthoredValue, Token, TokenDefinitionInput, TokenValueAssignment } from "@domain/token";
import { createTokenReference } from "@domain/token-reference";
import type { TokenValuePath } from "@domain/token-reference";
import { createColorLiteral } from "@domain/color-literal";
import { createTokenGroup } from "@domain/token-group";
import { createExpression } from "@domain/expression";
import { createNumberLiteral } from "@domain/numeric-literals";

function ok<T>(result: ApplicationResult<T>): T {
  expect(result.status).toBe("ok");
  if (result.status !== "ok") throw new Error(JSON.stringify(result));
  return result.value;
}
const literal = { kind: "literal" as const, colorSpace: "srgb", components: ["0", "0", "0"], alpha: "1" };
const reference = (targetTokenId: string) => ({ kind: "token-reference" as const, targetTokenId, valuePath: [] as const });
const color = (id: string, value: CreateColorTokenInput["value"] = literal): CreateColorTokenInput => ({
  projectId: "p", id, localName: id, parentGroupId: null, type: "color", description: "Exact description",
  layer: "primitive", semanticRole: "content", regeneration: "protected", value,
});
function setup() {
  const storage = new InMemoryProjectStorage();
  const app = createAuthoringOperations(storage);
  ok(app.createProject({ id: "p", name: "Product" }));
  return { storage, app };
}

describe("color value revision", () => {
  it("AC-1/2: revises a primitive and recomputes a chain without changing authored aliases", () => {
    const { app, storage } = setup();
    ok(app.createGroup({ projectId: "p", id: "palette", localName: "colors", parentGroupId: null }));
    const primitive = ok(app.createColorToken({ ...color("base"), parentGroupId: "palette" }));
    const first = ok(app.createColorToken(color("first", reference("base"))));
    const second = ok(app.createColorToken(color("second", reference("first"))));
    const value = { ...literal, colorSpace: "display-p3", components: ["-0.2", "none", "1.23456789123456789"], alpha: "0.7" };
    const revised = ok(app.reviseColorToken({ projectId: "p", tokenId: "base", value }));
    expect(revised).toEqual({ ...primitive, definition: { type: "color", assignments: [{ condition: [], value: { ...value, valueType: "color" } }] } });
    const beforeReads = storage.load("p");
    for (const [id, authored, trace] of [
      ["first", first, [{ tokenId: "first", matchedCondition: [], specificity: 0, targetTokenId: "base" }, { tokenId: "base", matchedCondition: [], specificity: 0 }]],
      ["second", second, [{ tokenId: "second", matchedCondition: [], specificity: 0, targetTokenId: "first" }, { tokenId: "first", matchedCondition: [], specificity: 0, targetTokenId: "base" }, { tokenId: "base", matchedCondition: [], specificity: 0 }]],
    ] as const) {
      expect(ok(app.inspectToken("p", id))).toMatchObject({ authored, resolution: { status: "resolved", value: revised.definition!.assignments[0].value, trace } });
    }
    expect(ok(app.validateProject("p"))).toEqual({ namespaceDiagnostics: [], referenceDiagnostics: [] });
    expect(storage.load("p")).toEqual(beforeReads);
  });

  it("AC-3: explicitly retargets and changes both value forms while preserving layer and role", () => {
    const { app } = setup();
    const original = ok(app.createColorToken(color("edited")));
    ok(app.createColorToken(color("a")));
    ok(app.createColorToken(color("b", { ...literal, components: ["1", "1", "1"] })));
    for (const value of [reference("a"), reference("b"), { ...literal, components: ["0.4", "none", "0.2"] }]) {
      const revised = ok(app.reviseColorToken({ projectId: "p", tokenId: "edited", value }));
      expect(revised).toEqual({ ...original, definition: { type: "color", assignments: [{ condition: [], value: value.kind === "literal" ? { ...value, valueType: "color" } : value }] } });
    }
    expect(ok(app.inspectToken("p", "edited")).resolution).toMatchObject({ status: "resolved", value: { components: ["0.4", "none", "0.2"] } });
  });
});

describe("revision construction and graph checks", () => {
  it.each([
    ["srgb", ["-1", "none", "1.23456789123456789"], ["-1", "none", "1.23456789123456789"]],
    ["display-p3", ["1.2", "0", "none"], ["1.2", "0", "none"]],
    ["hsl", ["-30.5", "0", "25"], ["329.5", "0", "25"]],
    ["oklab", ["none", "-0.1", "0.2"], ["none", "-0.1", "0.2"]],
    ["oklch", ["0.5", "0", "720"], ["0.5", "0", "0"]],
  ])("AC-1: preserves %s semantics for both regeneration policies", (colorSpace, components, expected) => {
    const { app } = setup();
    for (const regeneration of ["allowed", "protected"] as const) {
      const original = ok(app.createColorToken({ ...color(regeneration), regeneration }));
      const revised = ok(app.reviseColorToken({ projectId: "p", tokenId: regeneration, value: { kind: "literal", colorSpace, components, alpha: "0" } }));
      expect(revised).toEqual({ ...original, definition: { type: "color", assignments: [{ condition: [], value: { kind: "literal", valueType: "color", colorSpace, components: expected, alpha: "0" } }] } });
    }
  });

  it.each([
    { ...literal, alpha: "1.1" }, { ...literal, colorSpace: "rgb" },
    { ...literal, components: ["0.10", "0", "0"] }, { ...literal, components: ["0", "0"] },
    { ...literal, components: new Array<string>(3) },
    { ...literal, colorSpace: "oklch", components: ["0.5", "-1", "20"] },
  ])("AC-1/7: rejects invalid replacement without committing: %j", value => {
    const { app, storage } = controlledSetup();
    ok(app.createColorToken(color("edited")));
    const before = storage.delegate.load("p");
    const commits = storage.commits;
    expect(app.reviseColorToken({ projectId: "p", tokenId: "edited", value })).toMatchObject({ status: "failure", error: { code: "invalid-domain-input" } });
    expect(storage.delegate.load("p")).toEqual(before);
    expect(storage.commits).toBe(commits);
  });

  it.each(["edited", "second"])("AC-5: rejects a cycle via %s and preserves all authored data", targetTokenId => {
    const { app, storage } = controlledSetup();
    ok(app.createColorToken(color("edited")));
    ok(app.createColorToken(color("first", reference("edited"))));
    ok(app.createColorToken(color("second", reference("first"))));
    const before = storage.delegate.load("p");
    const commits = storage.commits;
    const cycle = targetTokenId === "edited" ? ["edited", "edited"] : ["edited", "second", "first", "edited"];
    expect(app.reviseColorToken({ projectId: "p", tokenId: "edited", value: reference(targetTokenId) })).toEqual({ status: "failure", error: { code: "invalid-candidate", namespaceDiagnostics: [], referenceDiagnostics: [{ code: "reference-cycle", cycle }] } });
    expect(storage.delegate.load("p")).toEqual(before);
    expect(storage.commits).toBe(commits);
  });
});

// Storage fixtures preserve recognizable loaded data without adding a loader API.
function storedToken(id: string, definition?: TokenDefinitionInput, projectId = "p"): Token {
  return createToken({ id, projectId, localName: id, parentGroupId: null, regeneration: "allowed", definition }, []);
}
const storedAlias = (id: string, targetTokenId: string, valuePath: TokenValuePath = []) => storedToken(id, {
  type: "color", assignments: [{ condition: [], value: createTokenReference({ targetTokenId, valuePath }) }],
});
const storedColor = (id: string) => storedToken(id, { type: "color", assignments: [{ condition: [], value: createColorLiteral(literal) }] });
function fixture(tokens: readonly Token[], groups: ProjectSnapshot["groups"] = []) {
  const storage = new ControlledStorage([{ project: createProject({ id: "p", name: "Loaded" }), tokens, groups }]);
  return { storage, app: createAuthoringOperations(storage) };
}
function controlledSetup() {
  const storage = new ControlledStorage();
  const app = createAuthoringOperations(storage);
  ok(app.createProject({ id: "p", name: "Product" }));
  return { storage, app };
}
class ControlledStorage implements ProjectStorage {
  readonly delegate: InMemoryProjectStorage;
  commits = 0;
  failLoad = false;
  failCommit = false;
  committed: ProjectSnapshot | undefined;
  constructor(initial: readonly ProjectSnapshot[] = []) { this.delegate = new InMemoryProjectStorage(initial); }
  load(projectId: string): StorageResult<ProjectSnapshot | undefined> {
    return this.failLoad ? { status: "failure", message: "Load unavailable" } : this.delegate.load(projectId);
  }
  commit(snapshot: ProjectSnapshot): StorageResult<void> {
    this.commits += 1;
    this.committed = snapshot;
    return this.failCommit ? { status: "failure", message: "Commit unavailable" } : this.delegate.commit(snapshot);
  }
}

describe("reference targets and bounded repair", () => {
  it.each([
    { target: undefined, targetId: "absent", code: "missing-reference" },
    { target: storedToken("target"), targetId: "target", code: "target-type-missing" },
    { target: storedToken("target", { type: "number", assignments: [] }), targetId: "target", code: "type-mismatch" },
    { target: storedToken("target", { type: "color", assignments: [] }, "q"), targetId: "target", code: "cross-project-reference" },
  ])("AC-4: rejects $code with the domain diagnostic details", ({ target, targetId, code }) => {
    const { app, storage } = fixture([storedColor("edited"), ...(target === undefined ? [] : [target])]);
    const before = storage.delegate.load("p");
    expect(app.reviseColorToken({ projectId: "p", tokenId: "edited", value: reference(targetId) })).toMatchObject({ status: "failure", error: { code: "invalid-candidate", referenceDiagnostics: expect.arrayContaining([{ code, tokenId: "edited", targetTokenId: targetId, condition: [] }]) } });
    expect(storage.delegate.load("p")).toEqual(before);
    expect(storage.commits).toBe(0);
  });

  it("AC-4: rejects a non-empty new path while allowing an unassigned color target and reverse layer direction", () => {
    const unassigned = { ...storedToken("target", { type: "color", assignments: [] }), layer: "semantic" as const };
    const { app, storage } = fixture([{ ...storedColor("edited"), layer: "primitive" }, unassigned]);
    const before = storage.delegate.load("p");
    const value = { ...reference("target"), valuePath: [{ kind: "field", key: "alpha" }] };
    expect(app.reviseColorToken({ projectId: "p", tokenId: "edited", value: value as unknown as CreateColorTokenInput["value"] })).toEqual({ status: "failure", error: { code: "invalid-candidate", namespaceDiagnostics: [], referenceDiagnostics: [{ code: "unsupported-value-path", tokenId: "edited", targetTokenId: "target", condition: [] }] } });
    expect(storage.delegate.load("p")).toEqual(before);
    expect(storage.commits).toBe(0);
    ok(app.reviseColorToken({ projectId: "p", tokenId: "edited", value: reference("target") }));
    expect(ok(app.inspectToken("p", "edited")).resolution).toMatchObject({ status: "unresolved", reason: "missing-assignment", diagnostics: [{ tokenId: "target" }] });
    expect(ok(app.validateProject("p"))).toEqual({ namespaceDiagnostics: [], referenceDiagnostics: [] });
  });

  it.each([
    { tokens: [storedAlias("edited", "absent"), storedColor("target")], reason: "missing-reference" },
    { tokens: [storedAlias("edited", "target", [{ kind: "field", key: "alpha" }]), storedColor("target")], reason: "unsupported-value-path" },
    { tokens: [storedAlias("edited", "target"), storedAlias("target", "edited")], reason: "reference-cycle" },
  ])("AC-6: repairs $reason by one explicit replacement", ({ tokens, reason }) => {
    const { app, storage } = fixture(tokens);
    const broken = ok(app.inspectToken("p", "edited"));
    expect(broken.resolution).toMatchObject({ status: "unresolved", reason, trace: expect.any(Array) });
    const value = reason === "reference-cycle" ? literal : reference("target");
    const revised = ok(app.reviseColorToken({ projectId: "p", tokenId: "edited", value }));
    expect(revised).toEqual({ ...tokens[0], definition: { type: "color", assignments: [{ condition: [], value: value.kind === "literal" ? { ...value, valueType: "color" } : value }] } });
    expect(ok(app.validateProject("p"))).toEqual({ namespaceDiagnostics: [], referenceDiagnostics: [] });
    expect(ok(app.inspectToken("p", "target")).resolution.status).toBe("resolved");
    expect(storage.commits).toBe(1);
  });

  it("AC-5/6: remaining namespace and reference errors block a selected repair and expose candidate checks", () => {
    const group = createTokenGroup({ id: "broken", projectId: "p", localName: "", parentGroupId: "absent-group" });
    const { app, storage } = fixture([storedAlias("edited", "absent"), storedAlias("other", "still-absent")], [group]);
    const before = storage.delegate.load("p");
    const inspection = ok(app.inspectToken("p", "edited"));
    expect(app.reviseColorToken({ projectId: "p", tokenId: "edited", value: literal })).toEqual({ status: "failure", error: {
      code: "invalid-candidate",
      namespaceDiagnostics: [{ code: "missing-parent-group", entityKind: "group", entityId: "broken", parentGroupId: "absent-group" }],
      referenceDiagnostics: [{ code: "missing-reference", tokenId: "other", targetTokenId: "still-absent", condition: [] }],
    } });
    expect(storage.delegate.load("p")).toEqual(before);
    expect(ok(app.inspectToken("p", "edited"))).toEqual(inspection);
    expect(storage.commits).toBe(0);
  });
});

describe("revision eligibility and atomic storage boundary", () => {
  const assigned = storedColor("edited");
  const conditional = { axisId: "axis", optionId: "option" };
  it.each([
    { label: "name-only", token: storedToken("edited") },
    { label: "typed-unassigned", token: storedToken("edited", { type: "color", assignments: [] }) },
    { label: "non-color", token: storedToken("edited", { type: "number", assignments: [] }) },
    { label: "missing assignment slot", token: { ...assigned, definition: { type: "color" as const, assignments: new Array<TokenValueAssignment>(1) } } },
    { label: "component", token: { ...assigned, layer: "component" as const, componentDefinitionId: "component" as Token["componentDefinitionId"] } },
    { label: "conditional-only", token: { ...assigned, definition: { type: "color" as const, assignments: [{ ...assigned.definition!.assignments[0], condition: [conditional] as unknown as TokenValueAssignment["condition"] }] } } },
    { label: "multiple-assignments", token: { ...assigned, definition: { type: "color" as const, assignments: [...assigned.definition!.assignments, { ...assigned.definition!.assignments[0], condition: [conditional] as unknown as TokenValueAssignment["condition"] }] } } },
    { label: "expression", token: { ...assigned, definition: { type: "color" as const, assignments: [{ ...assigned.definition!.assignments[0], value: createExpression({ operation: "portable.math.add.v1", operands: [createNumberLiteral("1"), createNumberLiteral("2")] }) }] } } },
    // A recognizable loaded malformed composite on a color token is not an invitation to reinterpret it.
    { label: "composite", token: { ...assigned, definition: { type: "color" as const, assignments: [{ ...assigned.definition!.assignments[0], value: { kind: "composite", valueType: "shadow", layers: [] } as unknown as ImplementedAuthoredValue }] } } },
  ])("AC-7: refuses $label edited tokens without a write", ({ token }) => {
    const { app, storage } = fixture([token]);
    const before = storage.delegate.load("p");
    expect(app.reviseColorToken({ projectId: "p", tokenId: "edited", value: literal })).toMatchObject({ status: "failure", error: { code: "invalid-domain-input", message: "Color revision requires one unconditional color literal or reference on a non-component token" } });
    expect(storage.delegate.load("p")).toEqual(before);
    expect(storage.commits).toBe(0);
  });

  it("AC-7: reports unknown project and missing/foreign edited entities explicitly", () => {
    const { app, storage } = fixture([storedToken("foreign", { type: "color", assignments: [] }, "q")]);
    const before = storage.delegate.load("p");
    expect(app.reviseColorToken({ projectId: "missing", tokenId: "foreign", value: literal })).toEqual({ status: "failure", error: { code: "project-not-found", projectId: "missing" } });
    for (const tokenId of ["missing", "foreign"]) {
      expect(app.reviseColorToken({ projectId: "p", tokenId, value: literal })).toEqual({ status: "failure", error: { code: "entity-not-found", entityKind: "token", entityId: tokenId } });
    }
    expect(storage.delegate.load("p")).toEqual(before);
    expect(storage.commits).toBe(0);
  });

  it("AC-7: separates load/commit failures, commits only the final assigned state once, and propagates programmer faults", () => {
    const { app, storage } = fixture([storedColor("edited")]);
    const before = storage.delegate.load("p");
    storage.failLoad = true;
    expect(app.reviseColorToken({ projectId: "p", tokenId: "edited", value: literal })).toEqual({ status: "failure", error: { code: "storage-failure", operation: "load", message: "Load unavailable" } });
    expect(storage.commits).toBe(0);
    storage.failLoad = false;
    storage.failCommit = true;
    const command = () => app.reviseColorToken({ projectId: "p", tokenId: "edited", value: { ...literal, alpha: "0.5" } });
    expect(command()).toEqual({ status: "failure", error: { code: "storage-failure", operation: "commit", message: "Commit unavailable" } });
    expect(storage.delegate.load("p")).toEqual(before);
    expect(storage.commits).toBe(1);
    expect(storage.committed!.tokens[0].definition!.assignments).toEqual([{ condition: [], value: { ...literal, valueType: "color", alpha: "0.5" } }]);
    storage.failCommit = false;
    ok(command());
    expect(storage.commits).toBe(2);
    const after = storage.delegate.load("p");
    storage.commit = () => { throw new TypeError("Programmer fault"); };
    expect(command).toThrow("Programmer fault");
    storage.load = () => { throw new Error("Load programmer fault"); };
    expect(command).toThrow("Load programmer fault");
    expect(storage.delegate.load("p")).toEqual(after);
  });

  it("AC-8: isolates same-ID projects and copies command input, results, readback and resolution data", () => {
    const { app, storage } = setup();
    ok(app.createProject({ id: "q", name: "Other" }));
    ok(app.createColorToken(color("edited")));
    ok(app.createColorToken(color("alias", reference("edited"))));
    ok(app.createColorToken({ ...color("edited"), projectId: "q" }));
    const otherBefore = storage.load("q");
    const components = ["0.2", "none", "1.2"];
    const value = { ...literal, components };
    const result = ok(app.reviseColorToken({ projectId: "p", tokenId: "edited", value }));
    const before = storage.load("p");
    components[0] = "0.9";
    value.alpha = "0";
    (result as { description: string }).description = "Changed";
    (result.definition!.assignments[0].value as unknown as { components: string[] }).components[0] = "0.8";
    const read = ok(app.readProject("p"));
    (read.tokens[0].authored.definition!.assignments as unknown[]).length = 0;
    const inspection = ok(app.inspectToken("p", "alias"));
    if (inspection.resolution.status !== "resolved") throw new Error("Expected resolution");
    (inspection.resolution.value as unknown as { components: string[] }).components[0] = "0.7";
    (inspection.resolution.trace as unknown[]).length = 0;
    expect(storage.load("p")).toEqual(before);
    expect(storage.load("q")).toEqual(otherBefore);
    const ref = { kind: "token-reference" as const, targetTokenId: "edited", valuePath: [] as [] };
    ok(app.reviseColorToken({ projectId: "p", tokenId: "alias", value: ref }));
    const afterReference = storage.load("p");
    ref.targetTokenId = "absent";
    (ref.valuePath as unknown[]).push({ kind: "field", key: "alpha" });
    expect(storage.load("p")).toEqual(afterReference);
    expect(ok(app.inspectToken("p", "alias")).resolution).toMatchObject({ status: "resolved", value: { components: ["0.2", "none", "1.2"] } });
  });
});
