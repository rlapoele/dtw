import { expect, it } from "vitest";
import { createColorLiteral } from "@domain/color-literal";
import { baseline, changeView, editComponent, editHex, hexField, refreshCleanSession } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/state/editor-session";

const source = () => baseline(createColorLiteral({colorSpace: "srgb", components: ["0.123456789", "0.4", "0.6"], alpha: "0.123456789"}));
it("displays quantized HEX without changing exact coordinates or dirty state", () => {
  const s = source();
  expect(hexField(s)).toBe("#1f6699");
  expect(s.literal.components[0]).toBe("0.123456789");
  expect(s.edited).toBe(false);
});
it.each(["#336699", "336699", "#369", "369", "  #336699  "])("authors %s as sRGB while preserving exact alpha", raw => {
  const s = editHex(source(), raw);
  expect(s.literal.components).toEqual(["0.2", "0.4", "0.6"]);
  expect(s.literal.alpha).toBe("0.123456789");
  expect(s.hexInvalid).toBe(false);
  expect(s.edited).toBe(true);
});
it.each(["", "#", "#12", "#12345g", "#12345678"])("retains invalid raw input %s and prevents view changes", raw => {
  const initial = source(), s = editHex(initial, raw);
  expect(hexField(s)).toBe(raw);
  expect(s.literal).toBe(initial.literal);
  expect(s.hexInvalid).toBe(true);
  expect(s.edited).toBe(true);
  expect(() => changeView(s, "oklch")).toThrow(/HEX/);
  expect(editHex(s, "#ffffff").hexInvalid).toBe(false);
});
it("clears stale HEX on component edits and resets raw drafts on refresh", () => {
  const s = editHex(source(), "#bad-input");
  const edited = editComponent(s, 0, "1");
  expect(edited.hexInvalid).toBe(false);
  expect(hexField(edited)).toBe("#ff6699");
  expect(refreshCleanSession(s).hexText).toBeNull();
});
it("promotes a viewed sRGB edit and discards superseded byte drafts", () => {
  const initial = baseline(createColorLiteral({colorSpace: "display-p3", components: ["0.2", "0.4", "0.6"], alpha: "0.5"}));
  const view = changeView(initial, "srgb");
  const s = editHex({...view, byteInvalid: true, byteText: ["-", "2", "3"]}, "#ABCDEF");
  expect(s.literal.colorSpace).toBe("srgb");
  expect(s.literal.alpha).toBe("0.5");
  expect(s.byteText).toBeNull();
  expect(s.byteInvalid).toBe(false);
  expect(hexField(changeView(s, "oklch"))).toBe("");
});
it.each(["none", "-0.000000001", "1.000000001", ""])("does not clamp or invent HEX for %s", component => {
  const s = source();
  s.literal.components[0] = component;
  expect(hexField(s)).toBe("");
  expect(s.literal.components[0]).toBe(component);
});
