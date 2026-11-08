import { describe, it, expect } from "vitest";
import {
  createColorLiteral,
  COLOR_SPACES,
} from "@domain/color-literal";
import {
  convertColor,
  byteToNormalized,
  normalizedToByte,
  roundSignificant,
} from "@domain/color-calculation";
const color = (components = ["0.2", "0.4", "0.6"], colorSpace = "srgb") =>
  createColorLiteral({ colorSpace, components, alpha: "0.123456789123456789" });
describe("bounded color calculations", () => {
  it("divides bytes exactly or rounds once, including tiny/fractional/extended bytes", () => {
    expect(byteToNormalized("255")).toBe("1");
    expect(byteToNormalized("127.5")).toBe("0.5");
    expect(byteToNormalized("1")).toBe("0.00392156862745098039");
    expect(byteToNormalized("0.000000000001")).toBe(
      "0.00000000000000392156862745098039",
    );
    expect(byteToNormalized("-510")).toBe("-2");
    expect(byteToNormalized("none")).toBe("none");
  });
  it("rounds decimal text ties to even without exponent or negative zero", () => {
    expect(roundSignificant("1.245", 3)).toBe("1.24");
    expect(roundSignificant("1.255", 3)).toBe("1.26");
    expect(roundSignificant("0.000000001255", 3)).toBe("0.00000000126");
    expect(normalizedToByte("0.5").text).toBe("127.5");
  });
  it("keeps exact identity and alpha", () => {
    const c = color(["0.123456789123456789123456789", "none", "-2"]);
    expect(convertColor(c, "srgb")).toEqual({ ok: true, value: c });
  });
  it("supports every directed pair for an ordinary color", () => {
    for (const source of COLOR_SPACES) {
      const s = convertColor(color(), source);
      expect(s.ok, source).toBe(true);
      if (!s.ok) continue;
      for (const target of COLOR_SPACES) {
        const r = convertColor(s.value, target);
        expect(r.ok, source + " → " + target).toBe(true);
        if (r.ok) expect(r.value.alpha).toBe(s.value.alpha);
      }
    }
  });
  it("matches independent CSS reference red OKLab and HSL", () => {
    const c = color(["1", "0", "0"]);
    const r = convertColor(c, "oklab");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(
        Math.abs(Number(r.value.components[0]) - 0.6279553639214312),
      ).toBeLessThan(1e-8);
      expect(
        Math.abs(Number(r.value.components[1]) - 0.2248630684262741),
      ).toBeLessThan(1e-8);
      expect(
        Math.abs(Number(r.value.components[2]) - 0.1258462773305849),
      ).toBeLessThan(1e-8);
    }
    const h = convertColor(c, "hsl");
    expect(h.ok && h.value.components).toEqual(["0", "100", "50"]);
  });
  it("handles missing hue only at exact neutral and never manufactures hue", () => {
    for (const s of ["hsl", "oklch"]) {
      const c = color(
        s === "hsl" ? ["none", "0", "50"] : ["0.5", "0", "none"],
        s,
      );
      const r = convertColor(c, s === "hsl" ? "oklch" : "hsl");
      expect(r.ok && r.value.components[s === "hsl" ? 2 : 0]).toBe("none");
    }
    expect(convertColor(color(["none", "1", "50"], "hsl"), "srgb").ok).toBe(
      false,
    );
  });
  it("guards only input magnitudes, rejects input underflow and preserves sources", () => {
    const c = color(["1000000", "1000000", "1000000"]);
    expect(convertColor(c, "display-p3").ok).toBe(true);
    expect(
      convertColor(color(["1000000.1", "0", "0"]), "display-p3"),
    ).toMatchObject({ ok: false, reason: "calculation-limit" });
    expect(
      convertColor(color(["0." + "0".repeat(400) + "1", "0", "0"]), "hsl"),
    ).toMatchObject({ ok: false, reason: "numerical-failure" });
    expect(() => byteToNormalized("0." + "0".repeat(4095) + "1")).toThrow();
  });
  it("enforces text budgets without adding a minimum magnitude", () => {
    const atBudget = "0." + "0".repeat(4093) + "1";
    expect(byteToNormalized(atBudget)).not.toBe("0");
    expect(normalizedToByte(atBudget).text.length).toBeLessThanOrEqual(4200);
    expect(() => normalizedToByte("0." + "0".repeat(4094) + "1")).toThrow();
    expect(() => roundSignificant("1e4201")).toThrow();
    expect(
      convertColor(color(["0." + "0".repeat(299) + "1", "0", "0"]), "oklab").ok,
    ).toBe(true);
    expect(byteToNormalized("0.255")).toBe("0.001");
    expect(byteToNormalized("0.1")).toBe("0.000392156862745098039");
  });
  it("safely withholds the accepted exceptional tiny-red HSL result", () => {
    expect(
      convertColor(color(["0.000000000000001", "0", "0"]), "hsl"),
    ).toMatchObject({ ok: false, reason: "numerical-failure" });
  });
});
