import { describe, expect, it } from "vitest";
import { admitSnapshot, encodeBackup } from "@application/retention/codec";
import {
  projectContext,
  selectedInspection,
  displayRows,
} from "@application/retention/projections";
const snapshot = admitSnapshot({
  project: { id: "", name: "" },
  groups: [{ id: "", projectId: "", localName: "cycle", parentGroupId: "" }],
  tokens: [
    {
      id: "",
      projectId: "",
      localName: "amount",
      parentGroupId: "",
      description: "exact",
      authoring: { regeneration: "protected" },
      definition: {
        type: "number",
        assignments: [
          {
            condition: [],
            value: { kind: "literal", valueType: "number", value: "1.234" },
          },
        ],
      },
    },
  ],
});
describe("coherent display-only projections", () => {
  it("returns complete identity context without hidden canonical assignments", () => {
    const context = projectContext(snapshot);
    expect(context.tokens[0].authored.definition).toEqual({ type: "number" });
    expect(context.groups[0].path.status).toBe("invalid");
    expect(displayRows(snapshot, 0, 100)[0]).toMatchObject({
      id: "",
      type: "number",
      description: "exact",
      valueKind: "literal",
    });
  });
  it("keeps readonly type/value kind/metadata and actual resolution independent of edit eligibility", () => {
    const selected = selectedInspection(snapshot, "");
    expect(selected.token.definition?.type).toBe("number");
    expect(selected.authoredKind).toBe("literal");
    expect(selected.editable).toBe(false);
    expect(selected.token.description).toBe("exact");
    expect(selected.resolution.status).toBe("resolved");
    expect(selected.token).not.toHaveProperty("definition.assignments");
  });
});

// Supported authored data must stay reachable when derived paths exceed display work.
describe("bounded derived path projections", () => {
  for (const [length, count] of [[65536, 1], [60000, 70]]) {
    it(`keeps ${count} identities beneath a ${length}-unit group readable`, async () => {
      const { validateHostOutput } = await import("@presentation/host/validation");
      const supported = admitSnapshot({
        project: { id: "p", name: "P" },
        groups: [{ id: "g", projectId: "p", localName: "x".repeat(length), parentGroupId: null }],
        tokens: Array.from({ length: count }, (_, index) => ({ id: `t${index}`, projectId: "p", localName: "t", parentGroupId: "g", authoring: { regeneration: "allowed" } })),
      });
      const exact = encodeBackup(supported, "2026-11-11T00:00:00.000Z");
      const context = projectContext(supported);
      const rows = displayRows(supported, 0, 100);
      expect(() => validateHostOutput("context", { projectId: "p", revision: "r" }, context)).not.toThrow();
      expect(() => validateHostOutput("rows", { projectId: "p", revision: "r", offset: 0, count: 100 }, rows)).not.toThrow();
      expect(context.tokens).toHaveLength(count);
      expect(context.tokens.some(t => t.path.status === "unavailable")).toBe(true);
      expect(rows.some(t => t.label.includes("unavailable"))).toBe(true);
      for (const row of rows) expect(row.label.length).toBeLessThanOrEqual(65536);
      expect(encodeBackup(supported, "2026-11-11T00:00:00.000Z")).toBe(exact);
      const selected = selectedInspection(supported, "t0");
      expect(selected.token.id).toBe("t0");
      expect(() => validateHostOutput("inspection", { projectId: "p", revision: "r", tokenId: "t0" }, selected)).not.toThrow();
    });
  }
});

it("separates admitted authored maximum from bounded derived transport accounting", async () => {
  const { validateHostOutput } = await import("@presentation/host/validation");
  const input = {project: {id: "p", name: "P"}, groups: Array.from({length:64}, (_, i) => ({id:`g${i}`, projectId:"p", localName:"g", parentGroupId:null, description:""})), tokens: []};
  const units = (value: unknown): number => typeof value === "string" ? value.length : !value || typeof value !== "object" ? 0 : Array.isArray(value) ? value.reduce((n, item) => n + units(item), 0) : Object.entries(value).reduce((n, [key, item]) => n + key.length + units(item), 0);
  let remaining = 4194304 - units(input);
  for (const group of input.groups) { const count = Math.min(65536, remaining); group.description = "x".repeat(count); remaining -= count; }
  const supported = admitSnapshot(input);
  expect(() => validateHostOutput("context", {projectId:"p", revision:"r"}, projectContext(supported))).not.toThrow();
});
