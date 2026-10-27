import { describe, expect, it } from "vitest";

import { createTokenGroup, renameTokenGroup } from "../../src/domain/token-group";
import { createToken, renameToken } from "../../src/domain/token";
import { createNumberLiteral } from "../../src/domain/numeric-literals";
import {
  validateProjectNamespace, deriveTokenPath, deriveTokenGroupPath,
  moveTokenGroup, moveTokenInNamespace,
} from "../../src/domain/namespace";
import type { ProjectNamespaceSnapshot } from "../../src/domain/namespace";

const group = (id: string, localName: string, parentGroupId: string | null = null, projectId = "p") =>
  createTokenGroup({ id, projectId, localName, parentGroupId });
const token = (id: string, localName: string, parentGroupId: string | null = null, projectId = "p") =>
  createToken({ id, projectId, localName, parentGroupId, regeneration: "allowed",
    definition: { type: "number", assignments: [{ condition: [], value: createNumberLiteral("1") }] } }, []);
const snapshot = (): ProjectNamespaceSnapshot => ({
  projectId: "p",
  groups: [group("color", "color"), group("neutral", "neutral", "color"), group("semantic", "semantic")],
  tokens: [token("base", "900", "neutral"), token("root", "root")],
});

describe("TokenGroup", () => {
  it("creates an empty-capable project-owned group with an explicit parent", () => {
    expect(createTokenGroup({ id: "g", projectId: "p", localName: "color", parentGroupId: null, description: "Colors" })).toEqual({
      id: "g", projectId: "p", localName: "color", parentGroupId: null, description: "Colors",
    });
  });
  it("renames a group without changing its identity or containment", () => {
    const source = group("g", "before", "parent");
    expect(renameTokenGroup(source, "after")).toEqual({ ...source, localName: "after" });
    expect(source.localName).toBe("before");
  });
  it.each(["", "  Color / one.two  ", "é", "e\u0301"])("preserves opaque name %j", localName => {
    expect(group("g", localName).localName).toBe(localName);
  });
});

describe("validateProjectNamespace", () => {
  it("accepts empty projects, empty groups, and a valid namespace", () => {
    expect(validateProjectNamespace({ projectId: "p", groups: [], tokens: [] })).toEqual([]);
    expect(validateProjectNamespace({ projectId: "p", groups: [group("g", "empty")], tokens: [] })).toEqual([]);
    expect(validateProjectNamespace(snapshot())).toEqual([]);
  });
  it("reports missing parents for both groups and tokens", () => {
    expect(validateProjectNamespace({ projectId: "p", groups: [group("g", "g", "missing")], tokens: [token("t", "t", "missing")] })).toEqual([
      expect.objectContaining({ code: "missing-parent-group", entityKind: "group", entityId: "g", parentGroupId: "missing" }),
      expect.objectContaining({ code: "missing-parent-group", entityKind: "token", entityId: "t", parentGroupId: "missing" }),
    ]);
  });
  it("reports foreign entities and foreign parent groups", () => {
    const result = validateProjectNamespace({ projectId: "p", groups: [group("foreign", "foreign", null, "other"), group("g", "g", "foreign")], tokens: [token("t", "t", "foreign"), token("foreign-token", "t", null, "other")] });
    expect(result).toContainEqual(expect.objectContaining({ code: "project-mismatch", entityKind: "group", entityId: "foreign" }));
    expect(result).toContainEqual(expect.objectContaining({ code: "project-mismatch", entityKind: "token", entityId: "foreign-token" }));
    expect(result).toContainEqual(expect.objectContaining({ code: "foreign-parent-group", entityId: "g" }));
    expect(result).toContainEqual(expect.objectContaining({ code: "foreign-parent-group", entityId: "t" }));
  });
  it("detects self-parenting and indirect ancestry cycles once", () => {
    expect(validateProjectNamespace({ projectId: "p", groups: [group("a", "a", "a")], tokens: [] })).toEqual([{ code: "group-cycle", cycle: ["a", "a"] }]);
    expect(validateProjectNamespace({ projectId: "p", groups: [group("a", "a", "b"), group("b", "b", "a"), group("child", "child", "a")], tokens: [] })).toEqual([{ code: "group-cycle", cycle: ["a", "b", "a"] }]);
  });
  it("rejects duplicate group or token identities instead of choosing by order", () => {
    expect(() => validateProjectNamespace({ projectId: "p", groups: [group("g", "a"), group("g", "b")], tokens: [] })).toThrow(RangeError);
    expect(() => validateProjectNamespace({ projectId: "p", groups: [], tokens: [token("t", "a"), token("t", "b")] })).toThrow(RangeError);
  });
  it("defers sibling-name collisions and normalization", () => {
    expect(validateProjectNamespace({ projectId: "p", groups: [group("g", "same"), group("other", "same")], tokens: [token("t", "same")] })).toEqual([]);
  });
});

describe("derived namespace paths", () => {
  it("derives group and token paths as root-to-leaf name segments", () => {
    const ns = snapshot();
    expect(deriveTokenGroupPath(ns, "neutral")).toEqual({ status: "derived", path: ["color", "neutral"] });
    expect(deriveTokenPath(ns, "base")).toEqual({ status: "derived", path: ["color", "neutral", "900"] });
    expect(deriveTokenPath(ns, "root")).toEqual({ status: "derived", path: ["root"] });
  });
  it("preserves separators, whitespace, empty names, and Unicode in individual segments", () => {
    const ns = { projectId: "p", groups: [group("g", " color.one/two ")], tokens: [token("t", "", "g")] };
    expect(deriveTokenPath(ns, "t")).toEqual({ status: "derived", path: [" color.one/two ", ""] });
  });
  it("derives changed paths after ancestor and token renames without changing identities", () => {
    const ns = snapshot();
    const changed = { ...ns, groups: ns.groups.map(g => g.id === "color" ? renameTokenGroup(g, "palette") : g), tokens: ns.tokens.map(t => t.id === "base" ? renameToken(t, "950") : t) };
    expect(deriveTokenPath(changed, "base")).toEqual({ status: "derived", path: ["palette", "neutral", "950"] });
    expect(deriveTokenPath(ns, "base")).toEqual({ status: "derived", path: ["color", "neutral", "900"] });
  });
  it("reports missing entities, broken ancestry, and cycles without inventing partial paths", () => {
    const ns = snapshot();
    expect(deriveTokenPath(ns, "missing")).toMatchObject({ status: "invalid", diagnostics: [{ code: "missing-token" }] });
    expect(deriveTokenGroupPath(ns, "missing")).toMatchObject({ status: "invalid", diagnostics: [{ code: "missing-group" }] });
    expect(deriveTokenPath({ projectId: "p", groups: [], tokens: [token("t", "t", "missing")] }, "t")).toMatchObject({ status: "invalid", diagnostics: [{ code: "missing-parent-group" }] });
    expect(deriveTokenGroupPath({ projectId: "p", groups: [group("g", "g", "g")], tokens: [] }, "g")).toMatchObject({ status: "invalid", diagnostics: [{ code: "group-cycle" }] });
  });
  it("does not depend on group declaration order or cache a mutable path", () => {
    const ns = snapshot();
    const reversed = { ...ns, groups: [...ns.groups].reverse() };
    expect(deriveTokenPath(reversed, "base")).toEqual(deriveTokenPath(ns, "base"));
    const result = deriveTokenPath(ns, "base");
    if (result.status !== "derived") throw new Error("Expected path");
    // Simulate a JavaScript consumer mutating the returned array.
    (result.path as string[])[0] = "changed";
    expect(deriveTokenPath(ns, "base")).toEqual({ status: "derived", path: ["color", "neutral", "900"] });
  });
  it("only traverses requested ancestry while project validation checks all groups", () => {
    const ns = { ...snapshot(), groups: [...snapshot().groups, group("broken", "broken", "absent")] };
    expect(deriveTokenPath(ns, "base").status).toBe("derived");
    expect(validateProjectNamespace(ns)).toContainEqual(expect.objectContaining({ code: "missing-parent-group", entityId: "broken" }));
  });
  it("reports broken ancestry beyond the token's immediate parent", () => {
    const ns = { projectId: "p", groups: [group("g", "g", "absent")], tokens: [token("t", "t", "g")] };
    expect(deriveTokenPath(ns, "t")).toMatchObject({ status: "invalid", diagnostics: [{ code: "missing-parent-group", entityId: "g" }] });
  });
  it("handles deep ancestry without exhausting the call stack", () => {
    const groups = Array.from({ length: 12000 }, (_, index) => group(`g-${index}`, `name-${index}`, index === 0 ? null : `g-${index - 1}`));
    const ns = { projectId: "p", groups, tokens: [token("t", "leaf", "g-11999")] };
    expect(validateProjectNamespace(ns)).toEqual([]);
    const result = deriveTokenPath(ns, "t");
    if (result.status !== "derived") throw new Error("Expected a deep path");
    expect(result.path).toHaveLength(12001);
    expect(result.path[0]).toBe("name-0");
    expect(result.path[12000]).toBe("leaf");
  });
  it("rejects foreign roots and foreign ancestors", () => {
    const ns = { projectId: "p", groups: [group("g", "g", null, "other")], tokens: [token("t", "t", "g"), token("foreign", "foreign", null, "other")] };
    expect(deriveTokenGroupPath(ns, "g")).toMatchObject({ status: "invalid", diagnostics: [{ code: "project-mismatch" }] });
    expect(deriveTokenPath(ns, "t")).toMatchObject({ status: "invalid", diagnostics: [{ code: "foreign-parent-group" }] });
    expect(deriveTokenPath(ns, "foreign")).toMatchObject({ status: "invalid", diagnostics: [{ code: "project-mismatch" }] });
  });
});

describe("namespace moves", () => {
  it("moves a group and derives descendant paths without rewriting descendants", () => {
    const ns = snapshot();
    const before = JSON.stringify(ns);
    const result = moveTokenGroup(ns, "neutral", "semantic");
    expect(result.status).toBe("updated");
    if (result.status !== "updated") throw new Error("Expected a valid move");
    expect(deriveTokenPath(result.namespace, "base")).toEqual({ status: "derived", path: ["semantic", "neutral", "900"] });
    expect(result.namespace.tokens).toEqual(ns.tokens);
    expect(result.namespace.groups.map(g => g.id)).toEqual(ns.groups.map(g => g.id));
    expect(JSON.stringify(ns)).toBe(before);
  });
  it("moves groups and tokens to the project root", () => {
    const ns = snapshot();
    const movedGroup = moveTokenGroup(ns, "neutral", null);
    const movedToken = moveTokenInNamespace(ns, "base", null);
    if (movedGroup.status !== "updated" || movedToken.status !== "updated") throw new Error("Expected root moves");
    expect(deriveTokenGroupPath(movedGroup.namespace, "neutral")).toEqual({ status: "derived", path: ["neutral"] });
    expect(deriveTokenPath(movedToken.namespace, "base")).toEqual({ status: "derived", path: ["900"] });
    expect(movedToken.namespace.tokens[0]).toEqual({ ...ns.tokens[0], parentGroupId: null });
  });
  it("moves a token without changing its explicit type or assignments", () => {
    const ns = snapshot();
    const result = moveTokenInNamespace(ns, "base", "semantic");
    if (result.status !== "updated") throw new Error("Expected a valid move");
    expect(result.namespace.tokens[0]).toEqual({ ...ns.tokens[0], parentGroupId: "semantic" });
    expect(deriveTokenPath(result.namespace, "base")).toEqual({ status: "derived", path: ["semantic", "900"] });
  });
  it("rejects moving a group under itself or a descendant", () => {
    const ns = snapshot();
    expect(moveTokenGroup(ns, "color", "color")).toMatchObject({ status: "invalid", diagnostics: [{ code: "group-cycle" }] });
    expect(moveTokenGroup(ns, "color", "neutral")).toMatchObject({ status: "invalid", diagnostics: [{ code: "group-cycle" }] });
  });
  it("rejects missing entities, missing parents, and cross-project parents", () => {
    const ns = snapshot();
    expect(moveTokenGroup(ns, "missing", null)).toMatchObject({ status: "invalid", diagnostics: [{ code: "missing-group" }] });
    expect(moveTokenInNamespace(ns, "missing", null)).toMatchObject({ status: "invalid", diagnostics: [{ code: "missing-token" }] });
    expect(moveTokenGroup(ns, "neutral", "missing")).toMatchObject({ status: "invalid", diagnostics: [{ code: "missing-parent-group" }] });
    expect(moveTokenInNamespace(ns, "base", "missing")).toMatchObject({ status: "invalid", diagnostics: [{ code: "missing-parent-group" }] });
    const foreign = { ...ns, groups: [...ns.groups, group("foreign", "foreign", null, "other")] };
    expect(moveTokenGroup(foreign, "neutral", "foreign")).toMatchObject({ status: "invalid", diagnostics: expect.arrayContaining([expect.objectContaining({ code: "foreign-parent-group" })]) });
  });
  it("rejects moving foreign entities within the supplied project", () => {
    const ns = { projectId: "p", groups: [group("g", "g", null, "other")], tokens: [token("t", "t", null, "other")] };
    expect(moveTokenGroup(ns, "g", null)).toMatchObject({ status: "invalid", diagnostics: expect.arrayContaining([expect.objectContaining({ code: "project-mismatch", entityId: "g" })]) });
    expect(moveTokenInNamespace(ns, "t", null)).toMatchObject({ status: "invalid", diagnostics: expect.arrayContaining([expect.objectContaining({ code: "project-mismatch", entityId: "t" })]) });
  });
  it("supports same-parent moves without changing canonical data", () => {
    const ns = snapshot();
    expect(moveTokenGroup(ns, "neutral", "color")).toEqual({ status: "updated", namespace: ns });
    expect(moveTokenInNamespace(ns, "base", "neutral")).toEqual({ status: "updated", namespace: ns });
  });

});
