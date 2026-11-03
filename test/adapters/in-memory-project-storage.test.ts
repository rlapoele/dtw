import { describe, expect, it } from "vitest";
import { InMemoryProjectStorage } from "../../src/adapters/in-memory-project-storage";
import { createProject } from "../../src/domain/project";
import { createToken } from "../../src/domain/token";
import { createColorLiteral } from "../../src/domain/color-literal";

describe("in-memory storage isolation", () => {
  it("isolates preloaded data, committed candidates, and loaded snapshots", () => {
    const project = createProject({ id: "p", name: "Original" });
    const value = createColorLiteral({ colorSpace: "srgb", components: ["0", "0.1", "1"], alpha: "1" });
    const token = createToken({ id: "t", projectId: "p", localName: "color", parentGroupId: null, regeneration: "allowed", definition: { type: "color", assignments: [{ condition: [], value }] } }, []);
    const initial = { project, groups: [], tokens: [token] };
    const storage = new InMemoryProjectStorage([initial]);
    const original = storage.load("p");
    (project as { name: string }).name = "Mutated";
    value.components = ["none", "none", "none"];
    initial.tokens.length = 0;
    expect(storage.load("p")).toEqual(original);
    const candidate = { project: createProject({ id: "p", name: "Replacement" }), groups: [], tokens: [] };
    expect(storage.commit(candidate)).toEqual({ status: "ok", value: undefined });
    (candidate.project as { name: string }).name = "Mutated after commit";
    const loaded = storage.load("p");
    if (loaded.status !== "ok" || loaded.value === undefined) throw new Error("Expected snapshot");
    (loaded.value.project as { name: string }).name = "Mutated after load";
    expect(storage.load("p")).toMatchObject({ status: "ok", value: { project: { name: "Replacement" } } });
    expect(storage.load("unknown")).toEqual({ status: "ok", value: undefined });
  });

  it("rejects duplicate preloaded projects instead of choosing an arbitrary snapshot", () => {
    const snapshot = { project: createProject({ id: "p", name: "Product" }), groups: [], tokens: [] };
    expect(() => new InMemoryProjectStorage([snapshot, snapshot])).toThrow(RangeError);
  });
});
