import { describe, expect, it } from "vitest";
import { createAuthoringOperations } from "../../src/application/authoring";
import type { ApplicationResult } from "../../src/application/authoring";
import type { ProjectSnapshot } from "../../src/application/project-storage";
import { InMemoryProjectStorage } from "../../src/adapters/in-memory-project-storage";
import { createProject } from "../../src/domain/project";
import { createToken } from "../../src/domain/token";
import type { Token, TokenDefinitionInput } from "../../src/domain/token";
import { createTokenGroup } from "../../src/domain/token-group";
import { createTokenReference } from "../../src/domain/token-reference";
import type { TokenValuePath } from "../../src/domain/token-reference";

function ok<T>(result: ApplicationResult<T>): T {
  expect(result.status).toBe("ok");
  if (result.status !== "ok") throw new Error(JSON.stringify(result));
  return result.value;
}

// These are intentionally preloaded storage fixtures, never normal authoring.
const token = (id: string, definition?: TokenDefinitionInput, projectId = "p") => createToken({
  id, projectId, localName: id, parentGroupId: null, regeneration: "allowed", definition,
}, []);
const unassigned = (id: string) => token(id, { type: "color", assignments: [] });
const alias = (id: string, targetTokenId: string, valuePath: TokenValuePath = []) => token(id, {
  type: "color", assignments: [{ condition: [], value: createTokenReference({ targetTokenId, valuePath }) }],
});

function fixture(tokens: readonly Token[], groups: ProjectSnapshot["groups"] = []) {
  const snapshot = { project: createProject({ id: "p", name: "Repairable" }), groups, tokens };
  const storage = new InMemoryProjectStorage([snapshot]);
  return { storage, app: createAuthoringOperations(storage), snapshot };
}

describe("repairable stored data through application inspection", () => {
  it.each([
    { tokens: [alias("a", "absent")], reason: "missing-reference", failedToken: "absent", trace: [{ tokenId: "a", matchedCondition: [], specificity: 0, targetTokenId: "absent" }], referenceCodes: ["missing-reference"] },
    { tokens: [alias("a", "b"), unassigned("b")], reason: "missing-assignment", failedToken: "b", trace: [{ tokenId: "a", matchedCondition: [], specificity: 0, targetTokenId: "b" }], referenceCodes: [] },
    { tokens: [alias("a", "b", [{ kind: "field", key: "components" }]), unassigned("b")], reason: "unsupported-value-path", failedToken: "a", trace: [{ tokenId: "a", matchedCondition: [], specificity: 0, targetTokenId: "b" }], referenceCodes: ["unsupported-value-path"] },
    { tokens: [alias("a", "b"), alias("b", "a")], reason: "reference-cycle", failedToken: "a", trace: [
      { tokenId: "a", matchedCondition: [], specificity: 0, targetTokenId: "b" },
      { tokenId: "b", matchedCondition: [], specificity: 0, targetTokenId: "a" },
    ], referenceCodes: ["reference-cycle"] },
  ])("preserves $reason diagnostics, traces, and authored references", ({ tokens, reason, failedToken, trace, referenceCodes }) => {
    const { app, storage } = fixture(tokens);
    const before = storage.load("p");
    const inspected = ok(app.inspectToken("p", "a"));
    expect(inspected.authored).toEqual(tokens[0]);
    expect(inspected.resolution).toMatchObject({ status: "unresolved", reason, selection: [], trace, diagnostics: [{ code: reason, tokenId: failedToken }] });
    if (reason === "reference-cycle") expect(inspected.resolution.diagnostics).toEqual([{ code: "reference-cycle", tokenId: "a", cycle: ["a", "b", "a"] }]);
    const validation = ok(app.validateProject("p"));
    expect(validation.namespaceDiagnostics).toEqual([]);
    expect(validation.referenceDiagnostics.map(diagnostic => diagnostic.code)).toEqual(referenceCodes);
    if (reason === "missing-reference") expect(validation.referenceDiagnostics).toEqual([{ code: "missing-reference", tokenId: "a", targetTokenId: "absent", condition: [] }]);
    if (reason === "unsupported-value-path") expect(validation.referenceDiagnostics).toEqual([{ code: "unsupported-value-path", tokenId: "a", targetTokenId: "b", condition: [] }]);
    if (reason === "reference-cycle") expect(validation.referenceDiagnostics).toEqual([{ code: "reference-cycle", cycle: ["a", "b", "a"] }]);
    expect(storage.load("p")).toEqual(before);
    expect(ok(app.readProject("p")).tokens.map(entry => entry.authored)).toEqual(tokens);
  });

  it("accepts a normal alias to a typed-but-unassigned color target without inventing its value or layer rules", () => {
    const { app } = fixture([unassigned("target")]);
    const authored = ok(app.createColorToken({
      projectId: "p", id: "semantic", localName: "content", parentGroupId: null, type: "color",
      layer: "semantic", regeneration: "protected", value: { kind: "token-reference", targetTokenId: "target", valuePath: [] },
    }));
    expect(authored).not.toHaveProperty("semanticRole");
    expect(ok(app.inspectToken("p", "semantic")).resolution).toMatchObject({ status: "unresolved", reason: "missing-assignment", diagnostics: [{ tokenId: "target" }] });
    expect(ok(app.validateProject("p"))).toEqual({ namespaceDiagnostics: [], referenceDiagnostics: [] });
    // Layer is explicit metadata, not an alias-direction restriction.
    ok(app.createColorToken({
      projectId: "p", id: "primitive-alias", localName: "base", parentGroupId: null, type: "color",
      layer: "primitive", regeneration: "allowed", value: { kind: "token-reference", targetTokenId: "semantic", valuePath: [] },
    }));
  });

  it.each([
    { target: token("target"), code: "target-type-missing" },
    { target: token("target", { type: "number", assignments: [] }), code: "type-mismatch" },
  ])("rejects normal authoring against $code while preserving diagnostic details", ({ target, code }) => {
    const { app, storage } = fixture([target]);
    const before = storage.load("p");
    expect(app.createColorToken({
      projectId: "p", id: "alias", localName: "content", parentGroupId: null, type: "color",
      regeneration: "allowed", value: { kind: "token-reference", targetTokenId: "target", valuePath: [] },
    })).toEqual({ status: "failure", error: { code: "invalid-candidate", namespaceDiagnostics: [], referenceDiagnostics: [{ code, tokenId: "alias", targetTokenId: "target", condition: [] }] } });
    expect(storage.load("p")).toEqual(before);
  });

  it("keeps namespace and reference findings separate, without a full-validity flag", () => {
    const group = createTokenGroup({ projectId: "p", id: "broken-group", localName: "", parentGroupId: "absent-group" });
    const { app, storage } = fixture([alias("a", "absent-token"), unassigned("unassigned"), token("name-only")], [group]);
    const before = storage.load("p");
    expect(ok(app.validateProject("p"))).toEqual({
      namespaceDiagnostics: [{ code: "missing-parent-group", entityKind: "group", entityId: "broken-group", parentGroupId: "absent-group" }],
      referenceDiagnostics: [{ code: "missing-reference", tokenId: "a", targetTokenId: "absent-token", condition: [] }],
    });
    expect(ok(app.readProject("p")).groups[0].path).toEqual({ status: "invalid", diagnostics: [{ code: "missing-parent-group", entityKind: "group", entityId: "broken-group", parentGroupId: "absent-group" }] });
    // Normal writes check the candidate, including existing broken relationships.
    expect(app.renameGroup("p", "broken-group", "new")).toMatchObject({ status: "failure", error: { code: "invalid-candidate" } });
    expect(storage.load("p")).toEqual(before);
  });

  it("preserves foreign relationship diagnostics while refusing access to foreign authored entities", () => {
    const foreign = token("foreign", { type: "color", assignments: [] }, "other");
    const foreignGroup = createTokenGroup({ projectId: "other", id: "foreign-group", localName: "private", parentGroupId: null });
    const group = createTokenGroup({ projectId: "p", id: "g", localName: "", parentGroupId: "foreign-group" });
    const { app, storage } = fixture([alias("a", "foreign"), foreign], [group, foreignGroup]);
    const before = storage.load("p");
    expect(ok(app.validateProject("p"))).toEqual({
      namespaceDiagnostics: [
        { code: "foreign-parent-group", entityKind: "group", entityId: "g", parentGroupId: "foreign-group" },
        { code: "project-mismatch", entityKind: "group", entityId: "foreign-group" },
        { code: "project-mismatch", entityKind: "token", entityId: "foreign" },
      ],
      referenceDiagnostics: [
        { code: "cross-project-reference", tokenId: "a", targetTokenId: "foreign", condition: [] },
        { code: "token-project-mismatch", tokenId: "foreign" },
      ],
    });
    expect(ok(app.inspectToken("p", "a")).resolution).toMatchObject({ status: "unresolved", reason: "cross-project-reference" });
    expect(app.inspectToken("p", "foreign")).toMatchObject({ status: "failure", error: { code: "entity-not-found" } });
    expect(app.renameGroup("p", "foreign-group", "new")).toMatchObject({ status: "failure", error: { code: "entity-not-found" } });
    expect(ok(app.readProject("p")).tokens.map(entry => entry.authored.id)).toEqual(["a"]);
    expect(ok(app.readProject("p")).groups.map(entry => entry.authored.id)).toEqual(["g"]);
    expect(storage.load("p")).toEqual(before);
  });

  it("returns explicit duplicate-identity failures for invalid preloaded collections instead of domain exceptions", () => {
    const { app } = fixture([unassigned("same"), unassigned("same")]);
    expect(app.validateProject("p")).toEqual({ status: "failure", error: { code: "duplicate-identity", entityKind: "token", entityId: "same" } });
    expect(app.inspectToken("p", "same")).toMatchObject({ status: "failure", error: { code: "duplicate-identity" } });
  });
});
