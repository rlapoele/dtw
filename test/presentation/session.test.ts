import { describe, it, expect } from "vitest";
import type { DraftSession } from "@presentation/features/workbench/inspector/session";
import {
  baseline,
  refreshCleanSession,
  changeView,
  editComponent,
  fields,
} from "@presentation/features/workbench/inspector/session";
import { createColorLiteral } from "@domain/color-literal";
const original = createColorLiteral({
  colorSpace: "srgb",
  components: ["0.123456789123456789123456789", "0.4", "0.6"],
  alpha: "0.123456789123456789",
});
describe("presentation draft session", () => {
  it("restores exact authoritative text after any passive views", () => {
    let s = baseline(original);
    for (const v of ["oklab", "hsl", "oklch", "display-p3", "srgb"] as const)
      s = changeView(s, v);
    expect(s.literal).toEqual({
      colorSpace: original.colorSpace,
      components: original.components,
      alpha: original.alpha,
    });
    expect(s.edited).toBe(false);
  });
  it("keeps represented coordinates while incomplete alpha remains correctable", () => {
    const s = changeView(baseline(original), "oklab");
    const before = fields(s);
    expect(fields({ ...s, literal: { ...s.literal, alpha: "-" } })).toEqual(
      before,
    );
  });
  it("promotes a representation on a deliberate component edit only", () => {
    const s = editComponent(changeView(baseline(original), "oklab"), 1, "0.1");
    expect(s.literal.colorSpace).toBe("oklab");
    expect(s.literal.alpha).toBe(original.alpha);
    expect(s.literal.components[1]).toBe("0.1");
  });
  it("keeps exact untouched byte channels and invalid raw text until corrected", () => {
    let s: DraftSession = { ...baseline(original), scale: "bytes" };
    const initial = fields(s);
    s = editComponent(s, 1, "-");
    expect(s.byteInvalid).toBe(true);
    expect(() => changeView(s, "hsl")).toThrow();
    s = editComponent(s, 1, "127.5");
    expect(s.byteInvalid).toBe(true);
    s = editComponent(s, 1, "130");
    expect(s.literal.components[0]).toBe(original.components[0]);
    expect(s.literal.components[1]).toBe("0.509803921568627451");
    expect(fields(s)[0]).toBe(initial[0]);
    expect(s.byteInvalid).toBe(false);
  });
});


describe("integer RGB draft isolation", () => {
  const exact = createColorLiteral({ colorSpace: "srgb", components: ["0.2314", "0.41234567890123456789", "0.67890123456789"], alpha: "0.1234567890123456789" });
  it("displays rounded channels without editing; only explicit Green changes", () => {
    const start: DraftSession = { ...baseline(exact), scale: "bytes" };
    expect(fields(start)).toEqual(["59", "105", "173"]);
    expect(start.edited).toBe(false);
    const edited = editComponent(start, 1, "130");
    expect(edited.literal.components).toEqual([exact.components[0], "0.509803921568627451", exact.components[2]]);
    expect(edited.literal.alpha).toBe(exact.alpha);
    const returned = changeView(changeView(edited, "oklab"), "srgb");
    expect(fields(returned)).toEqual(["59", "130", "173"]);
    expect(returned.literal).toEqual(edited.literal);
    expect(editComponent(start, 0, "59").literal.components).toEqual(["0.231372549019607843", exact.components[1], exact.components[2]]);
  });
  it("retains invalid raw text across other edits, mode changes and correction", () => {
    let s: DraftSession = { ...baseline(exact), scale: "bytes" };
    s = editComponent(s, 0, "59.5");
    s = editComponent({ ...s, mode: "reference" }, 1, "130");
    expect(s.byteInvalid).toBe(true);
    expect(fields(s)).toEqual(["59.5", "130", "173"]);
    expect(() => changeView(s, "hsl")).toThrow();
    s = editComponent({ ...s, mode: "literal" }, 0, "59");
    expect(s.byteInvalid).toBe(false);
    expect(s.literal.components[2]).toBe(exact.components[2]);
  });
  it("retains RGB for alpha-only edits and accepts extended integers and none", () => {
    const s: DraftSession = { ...baseline(exact), scale: "bytes" };
    const alpha = { ...s, literal: { ...s.literal, alpha: "0.37" }, edited: true };
    expect(alpha.literal.components).toEqual(exact.components);
    expect(editComponent(s, 0, "-255").literal.components[0]).toBe("-1");
    expect(editComponent(s, 0, "510").literal.components[0]).toBe("2");
    expect(editComponent(s, 0, "none").literal.components[0]).toBe("none");
    for (const raw of ["-", "1.", "01", "+1", "-0", "1.5", "1e2", " 1"])
      expect(editComponent(s, 0, raw).byteInvalid).toBe(true);
  });
});

describe("clean applied baseline refresh", () => {
  it("replaces both authored sessions while retaining passive view/scale preferences", () => {
    const old = { ...changeView(baseline(original), "hsl"), scale: "bytes" as const };
    const replacement = createColorLiteral({colorSpace: "srgb", components: ["0.8", "0.6", "0.4"], alpha: "0.7"});
    const fresh = refreshCleanSession(old, replacement);
    expect(fresh.viewSpace).toBe("hsl");
    expect(fresh.scale).toBe("bytes");
    expect(fresh.reference).toBeNull();
    expect(fresh.edited).toBe(false);
    const edited = editComponent(changeView(fresh, "srgb"), 0, "128");
    expect(edited.literal.components.slice(1)).toEqual(["0.6", "0.4"]);
    expect(edited.literal.alpha).toBe("0.7");
    const reference = refreshCleanSession(fresh, {kind:"token-reference", targetTokenId: "next" as never, valuePath: []});
    expect(reference.mode).toBe("reference");
    expect(reference.reference).toBe("next");
    expect(reference.literal.components).toEqual(["", "", ""]);
    expect(refreshCleanSession(reference, replacement).reference).toBeNull();
  });
});
