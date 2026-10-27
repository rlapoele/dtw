import { describe, expect, it } from "vitest";
import { createTransition } from "../../src/domain/transition";
import type { TransitionInput } from "../../src/domain/transition";
import { createDurationLiteral as duration } from "../../src/domain/duration-literal";
import { createCubicBezierLiteral } from "../../src/domain/cubic-bezier-literal";
import { createNumberLiteral } from "../../src/domain/numeric-literals";
import { createExpression } from "../../src/domain/expression";
import { createToken, addTokenAssignment } from "../../src/domain/token";
import type { ImplementedAuthoredValue, Token } from "../../src/domain/token";
import { createTokenReference } from "../../src/domain/token-reference";
import { validateProjectTokenReferences } from "../../src/domain/token-reference-validation";
import { resolveToken } from "../../src/domain/token-resolution";
import { createVariationAxis } from "../../src/domain/variation-axis";
import { completeVariationSelection, createVariationSelection } from "../../src/domain/variation-selection";

const timing = createCubicBezierLiteral(["0.25", "-0.5", "0.75", "1.5"]);
const ref = (targetTokenId: string) => createTokenReference({ targetTokenId, valuePath: [] });
const fields = () => ({ duration: duration("200", "ms"), delay: duration("-0.1", "s"), timingFunction: timing });
const axis = createVariationAxis({ id: "motion", projectId: "p", name: "Motion", options: [{ id: "normal", name: "Normal" }, { id: "alternate", name: "Alternate" }], defaultOptionId: "normal" });
const empty = createVariationSelection([]);
const normal = completeVariationSelection([axis], empty, empty);
const alternateCondition = [{ axisId: "motion", optionId: "alternate" }];
const alternate = completeVariationSelection([axis], empty, createVariationSelection(alternateCondition));
function token(id: string, type: string, value: ImplementedAuthoredValue, projectId = "p") {
  return createToken({ id, projectId, localName: id, parentGroupId: null, regeneration: "allowed", definition: { type, assignments: [{ condition: [], value }] } }, projectId === "p" ? [axis] : []);
}

describe("createTransition", () => {
  it("requires three explicit fields and preserves units, signed delay, and curve", () => {
    expect(createTransition(fields())).toEqual({ kind: "composite", valueType: "transition", ...fields() });
    expect(createTransition({ ...fields(), duration: duration("0", "s") }).duration).toEqual(duration("0", "s"));
  });
  it.each(["duration", "delay", "timingFunction"])("rejects a missing %s without inventing defaults", field => {
    const input: Record<string, unknown> = { ...fields() };
    delete input[field];
    expect(() => createTransition(input as unknown as TransitionInput)).toThrow(RangeError);
  });
  it.each(["duration", "delay", "timingFunction"])("rejects a wrong literal or expression in %s", field => {
    for (const value of [createNumberLiteral("1"), createExpression({ operation: "portable.math.add.v1", operands: [createNumberLiteral("1"), createNumberLiteral("2")] })]) {
      expect(() => createTransition({ ...fields(), [field]: value } as unknown as TransitionInput)).toThrow(RangeError);
    }
  });
  it("rejects a negative inline duration but allows a signed standalone duration", () => {
    expect(() => createTransition({ ...fields(), duration: duration("-0.001", "ms") })).toThrow(RangeError);
    expect(duration("-0.001", "ms").value).toBe("-0.001");
  });
  it("retains copied field references for project-scoped validation", () => {
    const reference = ref("time");
    const input = { duration: reference, delay: reference, timingFunction: ref("curve") };
    const value = createTransition(input);
    expect(value).toEqual({ kind: "composite", valueType: "transition", ...input });
    expect(value.duration).not.toBe(reference);
  });
});

describe("transition token assignments and resolution", () => {
  it("adds to a typed-unassigned token and resolves inline fields", () => {
    const source = createToken({ id: "a", projectId: "p", localName: "a", parentGroupId: null, regeneration: "allowed", definition: { type: "transition", assignments: [] } }, [axis]);
    const changed = addTokenAssignment(source, { condition: [], value: createTransition(fields()) }, [axis]);
    expect(resolveToken("p", [changed], "a", normal)).toMatchObject({ status: "resolved", value: { kind: "composite", valueType: "transition", ...fields() } });
    expect(source.definition?.assignments).toEqual([]);
  });
  it("rejects mismatched token assignments", () => {
    expect(() => token("a", "number", createTransition(fields()))).toThrow(RangeError);
    expect(() => token("a", "transition", duration("1", "s"))).toThrow(RangeError);
  });
  it("resolves whole-transition alias chains and typed field references without mutation", () => {
    const value = createTransition({ duration: ref("time"), delay: ref("delay"), timingFunction: ref("curve") });
    const tokens = [token("a", "transition", ref("b")), token("b", "transition", value), token("time", "duration", duration("200", "ms")), token("delay", "duration", duration("-0.1", "s")), token("curve", "cubicBezier", timing)];
    const before = JSON.stringify(tokens);
    expect(validateProjectTokenReferences("p", tokens, normal)).toEqual([]);
    expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "resolved", value: { kind: "composite", valueType: "transition", ...fields() } });
    expect(JSON.stringify(tokens)).toBe(before);
  });
  it("independently selects each field target under the same completed selection", () => {
    const time = addTokenAssignment(token("time", "duration", duration("200", "ms")), { condition: alternateCondition, value: duration("0.5", "s") }, [axis]);
    const curve = addTokenAssignment(token("curve", "cubicBezier", timing), { condition: alternateCondition, value: createCubicBezierLiteral(["0", "0", "1", "1"]) }, [axis]);
    const source = token("a", "transition", createTransition({ ...fields(), duration: ref("time"), timingFunction: ref("curve") }));
    expect(resolveToken("p", [source, time, curve], "a", alternate)).toMatchObject({ status: "resolved", value: { duration: duration("0.5", "s"), delay: fields().delay, timingFunction: createCubicBezierLiteral(["0", "0", "1", "1"]) } });
  });
  it("rejects a negative referenced duration only in the duration field", () => {
    const negative = token("negative", "duration", duration("-1", "s"));
    const bad = token("bad", "transition", createTransition({ ...fields(), duration: ref("negative") }));
    const good = token("good", "transition", createTransition({ ...fields(), delay: ref("negative") }));
    expect(resolveToken("p", [negative], "negative", normal).status).toBe("resolved");
    expect(resolveToken("p", [bad, negative], "bad", normal)).toMatchObject({ status: "unresolved", reason: "invalid-composite", diagnostics: [{ compositeCode: "negative-transition-duration", field: "duration" }] });
    expect(resolveToken("p", [good, negative], "good", normal)).toMatchObject({ status: "resolved", value: { delay: duration("-1", "s") } });
  });
  it.each(["duration", "delay", "timingFunction"])("reports missing or wrong-type targets in %s", field => {
    const source = token("a", "transition", createTransition({ ...fields(), [field]: ref("target") }));
    expect(validateProjectTokenReferences("p", [source], normal)).toContainEqual(expect.objectContaining({ code: "missing-reference", field }));
    expect(resolveToken("p", [source], "a", normal)).toMatchObject({ status: "unresolved", reason: "missing-reference", diagnostics: [{ field }] });
    const target = token("target", "number", createNumberLiteral("1"));
    expect(validateProjectTokenReferences("p", [source, target], normal)).toContainEqual(expect.objectContaining({ code: "type-mismatch", field }));
    expect(resolveToken("p", [source, target], "a", normal)).toMatchObject({ status: "unresolved", reason: "type-mismatch", diagnostics: [{ field }] });
  });
  it("rejects foreign field targets", () => {
    const source = token("a", "transition", createTransition({ ...fields(), duration: ref("foreign") }));
    const foreign = token("foreign", "duration", duration("1", "s"), "other");
    expect(validateProjectTokenReferences("p", [source, foreign], normal)).toContainEqual(expect.objectContaining({ code: "cross-project-reference", field: "duration" }));
    expect(resolveToken("p", [source, foreign], "a", normal)).toMatchObject({ status: "unresolved", reason: "cross-project-reference" });
  });
  it("detects cycles through field dependencies, including repairable invalid data", () => {
    const source = token("a", "transition", createTransition({ ...fields(), duration: ref("time") }));
    // A downstream duration self-reference closes the selected dependency cycle.
    const time = token("time", "duration", ref("time"));
    expect(validateProjectTokenReferences("p", [source, time], normal)).toContainEqual(expect.objectContaining({ code: "reference-cycle" }));
    expect(resolveToken("p", [source, time], "a", normal)).toMatchObject({ status: "unresolved", reason: "reference-cycle", diagnostics: [{ cycle: ["time", "time"] }] });
  });
  it("does not confuse repeated field dependencies with cycles", () => {
    const source = token("a", "transition", createTransition({ ...fields(), duration: ref("time"), delay: ref("time") }));
    const tokens = [source, token("time", "duration", duration("0", "ms"))];
    expect(validateProjectTokenReferences("p", tokens, normal)).toEqual([]);
    expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "resolved", value: { duration: duration("0", "ms"), delay: duration("0", "ms") } });
  });
  it("selects one whole assignment without merging fields or falling back after failure", () => {
    const source = addTokenAssignment(token("a", "transition", createTransition(fields())), { condition: alternateCondition, value: createTransition({ ...fields(), duration: ref("missing") }) }, [axis]);
    expect(resolveToken("p", [source], "a", normal).status).toBe("resolved");
    expect(resolveToken("p", [source], "a", alternate)).toMatchObject({ status: "unresolved", reason: "missing-reference" });
    expect(validateProjectTokenReferences("p", [source], normal)).toContainEqual(expect.objectContaining({ code: "missing-reference", field: "duration" }));
  });
  it("propagates missing assignments in field targets", () => {
    const source = token("a", "transition", createTransition({ ...fields(), duration: ref("time") }));
    const unassigned = createToken({ id: "time", projectId: "p", localName: "time", parentGroupId: null, regeneration: "allowed", definition: { type: "duration", assignments: [] } }, [axis]);
    expect(resolveToken("p", [source, unassigned], "a", normal)).toMatchObject({ status: "unresolved", reason: "missing-assignment", diagnostics: [{ field: "duration" }] });
  });
  it("rejects part-value paths and transition references in numeric expression slots", () => {
    const target = token("b", "transition", createTransition(fields()));
    const part = token("part", "duration", createTokenReference({ targetTokenId: "b", valuePath: [{ kind: "field", key: "duration" }] }));
    expect(resolveToken("p", [part, target], "part", normal)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path" });
    const expr = token("expr", "number", createExpression({ operation: "portable.math.add.v1", operands: [ref("b"), createNumberLiteral("1")] }));
    expect(resolveToken("p", [expr, target], "expr", normal)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
  });
  it("propagates ambiguity in a field target without choosing an equal-value candidate", () => {
    const contrast = createVariationAxis({ id: "contrast", projectId: "p", name: "Contrast", options: [{ id: "high", name: "High" }], defaultOptionId: "high" });
    const axes = [axis, contrast];
    const source = token("a", "transition", createTransition({ ...fields(), duration: ref("time") }));
    const time = createToken({ id: "time", projectId: "p", localName: "time", parentGroupId: null, regeneration: "allowed", definition: { type: "duration", assignments: [
      { condition: alternateCondition, value: duration("1", "s") },
      { condition: [{ axisId: "contrast", optionId: "high" }], value: duration("1", "s") },
    ] } }, axes);
    const active = completeVariationSelection(axes, empty, createVariationSelection(alternateCondition));
    expect(resolveToken("p", [source, time], "a", active)).toMatchObject({ status: "unresolved", reason: "ambiguous-assignment", diagnostics: [{ field: "duration", fieldOwnerId: "a" }] });
  });
  it("checks duration sign under the active selection without using a fallback", () => {
    const time = addTokenAssignment(token("time", "duration", duration("1", "s")), { condition: alternateCondition, value: duration("-1", "s") }, [axis]);
    const source = token("a", "transition", createTransition({ ...fields(), duration: ref("time") }));
    expect(resolveToken("p", [source, time], "a", normal).status).toBe("resolved");
    expect(resolveToken("p", [source, time], "a", alternate)).toMatchObject({ status: "unresolved", reason: "invalid-composite", diagnostics: [{ compositeCode: "negative-transition-duration" }] });
  });
  it("rejects mismatched whole-transition aliases in both directions", () => {
    const transition = token("transition", "transition", createTransition(fields()));
    const time = token("time", "duration", duration("1", "s"));
    for (const source of [token("a", "transition", ref("time")), token("a", "duration", ref("transition"))]) {
      expect(validateProjectTokenReferences("p", [source, transition, time], normal)).toContainEqual(expect.objectContaining({ code: "type-mismatch" }));
      expect(resolveToken("p", [source, transition, time], "a", normal)).toMatchObject({ status: "unresolved", reason: "type-mismatch" });
    }
  });
  it("diagnoses malformed loaded fields and negative inline durations without throwing", () => {
    const source = token("a", "transition", createTransition(fields()));
    for (const fieldValue of [undefined, null, createNumberLiteral("1"), duration("-1", "s")]) {
      // Simulate repairable authored data bypassing the normal constructor.
      const broken = { ...source, definition: { type: "transition", assignments: [{ condition: source.definition!.assignments[0].condition, value: { kind: "composite", valueType: "transition", ...fields(), duration: fieldValue } }] } } as unknown as Token;
      expect(resolveToken("p", [broken], "a", normal)).toMatchObject({ status: "unresolved", reason: "invalid-composite", diagnostics: [{ field: "duration" }] });
    }
  });
  it("rejects part-value paths inside a transition field with field diagnostics", () => {
    const source = token("a", "transition", createTransition({ ...fields(), duration: createTokenReference({ targetTokenId: "time", valuePath: [{ kind: "field", key: "value" }] }) }));
    const tokens = [source, token("time", "duration", duration("1", "s"))];
    expect(validateProjectTokenReferences("p", tokens, normal)).toContainEqual(expect.objectContaining({ code: "unsupported-value-path", field: "duration" }));
    expect(resolveToken("p", tokens, "a", normal)).toMatchObject({ status: "unresolved", reason: "unsupported-value-path", diagnostics: [{ field: "duration", fieldOwnerId: "a" }] });
  });
  it("keeps composite values outside expression operations even in malformed loaded ASTs", () => {
    const source = token("a", "number", createNumberLiteral("1"));
    const broken = { ...source, definition: { type: "number", assignments: [{ condition: source.definition!.assignments[0].condition, value: { kind: "expression", operation: "portable.math.add.v1", operands: [createTransition(fields()), createNumberLiteral("1")] } }] } } as unknown as Token;
    expect(resolveToken("p", [broken], "a", normal)).toMatchObject({ status: "unresolved", reason: "invalid-expression" });
  });

});
