import { describe, it, expect } from "vitest";
import type { DraftSession } from "@presentation/App/components/TokensWorkbench/components/WorkbenchInspector/components/TokenEditor/state/editor-session";
import {
  baseline,
  refreshCleanSession,
  changeView,
  editComponent,
  fields,
  displayed,
  literalIssue,
} from "@presentation/App/components/TokensWorkbench/components/WorkbenchInspector/components/TokenEditor/state/editor-session";
import { createColorLiteral, COLOR_SPACES } from "@domain/color-literal";
import { convertColor } from "@domain/color-calculation";

describe("powerless hue in editor views", () => {
  it.each([
    ["black", "0", "1"],
    ["white", "1", "1"],
    ["gray", "0.5", "1"],
    ["transparent black", "0", "0"],
  ])("shows numeric components for %s through every space without authoring a change", (_name, channel, alpha) => {
    const value = createColorLiteral({colorSpace: "srgb", components: [channel, channel, channel], alpha});
    let session = baseline(value);
    const authored = session.literal;
    for (const space of [...COLOR_SPACES, "srgb"] as const) {
      session = changeView(session, space);
      expect(fields(session)).not.toContain("none");
      expect(fields(session).every(x => Number.isFinite(Number(x)))).toBe(true);
      expect(literalIssue(displayed(session))).toBeUndefined();
      expect(displayed(session).alpha).toBe(alpha);
      if (space === "hsl") expect(fields(session).slice(0, 2)).toEqual(["0", "0"]);
      if (space === "oklch") expect(fields(session).slice(1)).toEqual(["0", "0"]);
      if (channel === "0") expect(fields(session)).toEqual(["0", "0", "0"]);
      expect(session.literal).toBe(authored);
      expect(session.edited).toBe(false);
    }
    expect(fields(session)).toEqual([channel, channel, channel]);
  });

  it("uses the numeric view only on a deliberate component edit", () => {
    const value = createColorLiteral({colorSpace: "srgb", components: ["0", "0", "0"], alpha: "0.123456789123456789"});
    const view = changeView(baseline(value), "hsl");
    const edited = editComponent(view, 2, "50");
    expect(edited.literal.components).toEqual(["0", "0", "50"]);
    expect(edited.literal.colorSpace).toBe("hsl");
    expect(edited.literal.alpha).toBe(value.alpha);
    expect(edited.edited).toBe(true);
    expect(literalIssue(edited.literal)).toBeUndefined();
    expect(view.literal.components).toEqual(["0", "0", "0"]);
    const converted = convertColor(value, "hsl");
    expect(converted.ok && converted.value.components[0]).toBe("none");
  });

  it.each(["hsl", "oklch"] as const)("preserves genuinely authored missing hue in %s", space => {
    const components = space === "hsl" ? ["none", "0", "0"] : ["0", "0", "none"];
    const value = createColorLiteral({colorSpace: space, components, alpha: "1"});
    const session = baseline(value);
    expect(fields(session)).toEqual(components);
    const other = changeView(session, space === "hsl" ? "oklch" : "hsl");
    expect(fields(other)).toContain("none");
    expect(other.literal).toBe(session.literal);
    expect(other.edited).toBe(false);
  });

  it("preserves missing RGB components and explicitly authored numeric hue", () => {
    const missing = baseline(createColorLiteral({colorSpace: "srgb", components: ["none", "0", "0"], alpha: "1"}));
    expect(fields(missing)).toEqual(["none", "0", "0"]);
    expect(() => changeView(missing, "hsl")).toThrow();
    expect(missing.literal.components).toEqual(["none", "0", "0"]);
    const authoredHue = baseline(createColorLiteral({colorSpace: "hsl", components: ["137", "0", "0"], alpha: "1"}));
    expect(fields(authoredHue)).toEqual(["137", "0", "0"]);
    expect(changeView(changeView(authoredHue, "oklch"), "hsl").literal).toBe(authoredHue.literal);
  });
});
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
