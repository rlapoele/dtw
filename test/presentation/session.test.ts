import { describe, it, expect } from "vitest";
import type { DraftSession } from "@presentation/session";
import {
  baseline,
  changeView,
  editComponent,
  fields,
} from "@presentation/session";
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
    expect(s.literal.components[0]).toBe(original.components[0]);
    expect(s.literal.components[1]).toBe("0.5");
    expect(fields(s)[0]).toBe(initial[0]);
    expect(s.byteInvalid).toBe(false);
  });
});
