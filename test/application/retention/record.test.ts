import { describe, expect, it } from "vitest";
import {
  decodeRetainedRecord,
  internalId,
} from "@application/retention/record";
const valid = {
  recordVersion: 1,
  authoredVersion: 1,
  revision: "r",
  lastAcceptedCommand: {
    commandId: "c",
    operation: "createProject",
    result: { entityKind: "project", id: "" },
  },
  snapshot: { project: { id: "", name: "" }, groups: [], tokens: [] },
};
describe("retained record descriptor and metadata boundary", () => {
  it("keeps opaque authored IDs but rejects blank internal IDs without normalization", () => {
    expect(decodeRetainedRecord(valid, "").snapshot.project.id).toBe("");
    expect(internalId("  ")).toBe(false);
    expect(internalId(" x ")).toBe(true);
    expect(() =>
      decodeRetainedRecord({ ...valid, revision: " " }, ""),
    ).toThrow();
    expect(() =>
      decodeRetainedRecord(
        {
          ...valid,
          lastAcceptedCommand: {
            ...valid.lastAcceptedCommand,
            commandId: "\t",
          },
        },
        "",
      ),
    ).toThrow();
  });
  it("rejects accessors before field reads and nonplain nested records", () => {
    let called = false;
    const input = {
      ...valid,
      get revision() {
        called = true;
        return "r";
      },
    };
    expect(() => decodeRetainedRecord(input, "")).toThrow();
    expect(called).toBe(false);
    expect(() =>
      decodeRetainedRecord(
        {
          ...valid,
          lastAcceptedCommand: Object.assign(
            Object.create({}),
            valid.lastAcceptedCommand,
          ),
        },
        "",
      ),
    ).toThrow();
  });
  it("requires receipt target to belong to the stored project and kind", () => {
    expect(() =>
      decodeRetainedRecord(
        {
          ...valid,
          lastAcceptedCommand: {
            ...valid.lastAcceptedCommand,
            result: { entityKind: "project", id: "other" },
          },
        },
        "",
      ),
    ).toThrow();
  });
});

it("accounts maximum snapshot strings independently of retained metadata", () => {
  const snapshot = {
    project: { id: "p", name: "P" },
    groups: Array.from({ length: 64 }, (_, i) => ({
      id: `g${i}`,
      projectId: "p",
      localName: "g",
      parentGroupId: null,
      description: "",
    })),
    tokens: [],
  };
  function strings(v: unknown): number {
    if (typeof v === "string") return v.length;
    if (!v || typeof v !== "object") return 0;
    if (Array.isArray(v)) return v.reduce((n, item) => n + strings(item), 0);
    return Object.entries(v).reduce(
      (n, [key, item]) => n + key.length + strings(item),
      0,
    );
  }
  let remaining = 4194304 - strings(snapshot);
  for (const group of snapshot.groups) {
    const n = Math.min(65536, remaining);
    group.description = "x".repeat(n);
    remaining -= n;
  }
  expect(remaining).toBe(0);
  expect(strings(snapshot)).toBe(4194304);
  expect(
    decodeRetainedRecord(
      {
        ...valid,
        snapshot,
        lastAcceptedCommand: {
          ...valid.lastAcceptedCommand,
          result: { entityKind: "project", id: "p" },
        },
      },
      "p",
    ).snapshot,
  ).toEqual(snapshot);
});
