import { describe, expect, it } from "vitest";
import {
  decodeBackup,
  admitSnapshot,
  encodeBackup,
} from "@application/retention/codec";
const snapshot = {
  project: { id: "", name: "  Exact  " },
  groups: [],
  tokens: [],
};
const wrapper = (s: unknown) =>
  JSON.stringify({
    format: "dtw.project-backup",
    formatVersion: 1,
    authoredVersion: 1,
    createdAt: "2026-11-10T12:00:00.000Z",
    snapshot: s,
  });
describe("portable retained envelope", () => {
  it("preserves opaque identity, exact text and absence", () => {
    expect(
      decodeBackup(
        encodeBackup(admitSnapshot(snapshot), "2026-11-10T12:00:00.000Z"),
      ).snapshot,
    ).toEqual(snapshot);
  });
  it("rejects nested decoded duplicate keys in otherwise valid wrappers", () => {
    const valid = wrapper(snapshot);
    expect(decodeBackup(valid).snapshot).toEqual(snapshot);
    expect(() =>
      decodeBackup(valid.replace('"id":""', '"id":"","\\u0069d":"other"')),
    ).toThrow(/duplicate-json-key/);
  });
  it.each(["1e0", "1.0", "-0", "9007199254740993"])(
    "rejects noncanonical numeric spelling in a valid version field %s",
    (numeric) => {
      expect(() =>
        decodeBackup(
          wrapper(snapshot).replace(
            '"formatVersion":1',
            '"formatVersion":' + numeric,
          ),
        ),
      ).toThrow(/canonical-integer/);
    },
  );
  it("emits wrapper and authored record fields in schema order", () => {
    expect(encodeBackup(snapshot, "2026-11-10T12:00:00.000Z")).toBe(
      '{"format":"dtw.project-backup","formatVersion":1,"authoredVersion":1,"createdAt":"2026-11-10T12:00:00.000Z","snapshot":{"project":{"id":"","name":"  Exact  "},"groups":[],"tokens":[]}}\n',
    );
  });
  it("rejects unknown shape, cross-project membership and same-kind duplicate IDs whole", () => {
    expect(() => admitSnapshot({ ...snapshot, unknown: true })).toThrow();
    const group = { id: "", projectId: "", localName: "", parentGroupId: null };
    expect(() =>
      admitSnapshot({ ...snapshot, groups: [group, group] }),
    ).toThrow();
    expect(() =>
      admitSnapshot({
        ...snapshot,
        groups: [{ ...group, projectId: "foreign" }],
      }),
    ).toThrow();
  });
  it("keeps broken same-project links and cross-kind identity reuse", () => {
    const s = {
      ...snapshot,
      groups: [
        { id: "", projectId: "", localName: "", parentGroupId: "missing" },
      ],
      tokens: [
        {
          id: "",
          projectId: "",
          localName: "",
          parentGroupId: "",
          authoring: { regeneration: "protected" },
        },
      ],
    };
    expect(decodeBackup(wrapper(s)).snapshot).toEqual(s);
  });
  it.each([1023, 1024, 1025])(
    "applies decoded token-description limit %i",
    (n) => {
      const s = {
        ...snapshot,
        tokens: [
          {
            id: "t",
            projectId: "",
            localName: "",
            parentGroupId: null,
            description: "x".repeat(n),
            authoring: { regeneration: "allowed" },
          },
        ],
      };
      if (n <= 1024) expect(decodeBackup(wrapper(s)).snapshot).toEqual(s);
      else expect(() => decodeBackup(wrapper(s))).toThrow(/token-description/);
    },
  );
  it("rejects nonplain/accessor/cyclic/sparse data without invoking getters", () => {
    let called = false;
    expect(() =>
      admitSnapshot({
        get project() {
          called = true;
          return snapshot.project;
        },
        groups: [],
        tokens: [],
      }),
    ).toThrow();
    expect(called).toBe(false);
    expect(() => admitSnapshot({ ...snapshot, groups: Array(1) })).toThrow();
  });
});
