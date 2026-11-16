import { describe, expect, it } from "vitest";
import {
  validateHostInput,
  validateHostOutput,
} from "@hosts/browser/validation";
describe("worker boundary closed operation contract", () => {
  it("rejects unknown members and wrong per-operation inputs", () => {
    expect(() => validateHostInput("consume", "")).toThrow();
    expect(() => validateHostInput("openProject", { id: "p" })).toThrow();
    expect(() =>
      validateHostInput("createProject", { id: "", name: "x", extra: true }),
    ).toThrow();
    expect(() =>
      validateHostInput("command", {
        command: {
          operation: "renameGroup",
          projectId: "",
          groupId: "",
          localName: "",
        },
        revision: "r",
      }),
    ).not.toThrow();
    expect(() =>
      validateHostInput("command", {
        command: { operation: "unknown" },
        revision: "r",
      }),
    ).toThrow();
  });
  it("correlates output identity and receipt with original input", () => {
    const input = { id: "", name: "x" };
    const output = {
      status: "retained",
      revision: "r2",
      receipt: {
        commandId: "c",
        operation: "createProject",
        result: { entityKind: "project", id: "" },
      },
      readback: "available",
    };
    expect(() =>
      validateHostOutput("createProject", input, output),
    ).not.toThrow();
    expect(() =>
      validateHostOutput("createProject", input, {
        ...output,
        receipt: { ...output.receipt, operation: "createGroup" },
      }),
    ).toThrow();
    expect(() =>
      validateHostOutput("createProject", input, {
        ...output,
        receipt: {
          ...output.receipt,
          result: { entityKind: "project", id: "different" },
        },
      }),
    ).toThrow();
    expect(() =>
      validateHostOutput("createProject", input, { ...output, unknown: true }),
    ).toThrow();
  });
});

describe("selected-derived and exact-source response validation", () => {
  const request = { projectId: "p", revision: "r", tokenId: "t" };
  const output = {
    token: {
      id: "t",
      projectId: "p",
      localName: "name",
      parentGroupId: null,
      authoring: { regeneration: "allowed" },
      definition: { type: "number" },
    },
    authoredKind: "literal",
    editable: false,
    path: { status: "derived", path: ["name"] },
    resolution: {
      status: "resolved",
      tokenId: "t",
      selection: [],
      matchedCondition: [],
      value: { kind: "literal", valueType: "number", value: "1.234" },
      trace: [{ tokenId: "t", matchedCondition: [], specificity: 0 }],
      diagnostics: [],
    },
  };
  it("accepts actual readonly resolved data and rejects nested malformed variants", () => {
    expect(() =>
      validateHostOutput("inspection", request, output),
    ).not.toThrow();
    for (const resolution of [
      { ...output.resolution, value: undefined },
      { ...output.resolution, trace: [42] },
      { ...output.resolution, diagnostics: [false] },
      {
        ...output.resolution,
        value: { kind: "literal", valueType: "number", value: "1e0" },
      },
    ])
      expect(() =>
        validateHostOutput("inspection", request, { ...output, resolution }),
      ).toThrow();
    expect(() =>
      validateHostOutput("inspection", request, {
        ...output,
        authoredKind: "invented",
      }),
    ).toThrow();
    expect(() =>
      validateHostOutput("inspection", request, { ...output, editable: true }),
    ).toThrow();
  });
  it("validates exceptional source metadata and bounded code-unit frames separately from authored strings", () => {
    const source = { sourceId: "source1", units: 65537, revision: "r" };
    expect(() =>
      validateHostOutput(
        "source",
        { projectId: "p", revision: "r", entityKind: "token", entityId: "t" },
        source,
      ),
    ).not.toThrow();
    expect(() =>
      validateHostOutput(
        "sourceFrame",
        { sourceId: "source1", offset: 65536, count: 8192 },
        { ...source, offset: 65536, text: "x", complete: true },
      ),
    ).not.toThrow();
    expect(() =>
      validateHostOutput(
        "sourceFrame",
        { sourceId: "source1", offset: 65536, count: 8192 },
        { ...source, offset: 65535, text: "x", complete: true },
      ),
    ).toThrow();
  });
});

it("validates closed project-target history calls and rejects renderer snapshots/removed-target receipts", () => {
  const input = {direction: "undo", projectId: "p", revision: "r", stepId: "step"};
  expect(() => validateHostInput("traverse", input)).not.toThrow();
  expect(() => validateHostInput("traverse", {...input, snapshot: {}})).toThrow();
  const output = {status: "retained", revision: "r2", receipt: {commandId: "c", operation: "undo", result: {entityKind: "project", id: "p"}}, readback: "available"};
  expect(() => validateHostOutput("traverse", input, output)).not.toThrow();
  expect(() => validateHostOutput("traverse", input, {...output, receipt: {...output.receipt, result: {entityKind: "token", id: "removed"}}})).toThrow();
  expect(() => validateHostOutput("traverse", input, {status:"unchanged", revision:"r", reason:"no-op"})).toThrow();
});

it("validates true history counts across the typed worker boundary", () => {
  const input = {projectId: "p", revision: "r"};
  expect(() => validateHostOutput("historyState", input, {undoCount: 2, redoCount: 1})).not.toThrow();
  for (const undoCount of [-1, 0.5, 51, "2", undefined]) {
    expect(() => validateHostOutput("historyState", input, {undoCount, redoCount: 0})).toThrow();
  }
});
