import { afterEach, expect, it, vi } from "vitest";
import { readExactSource } from "@presentation/host/source";
import type { WorkbenchHost } from "@presentation/host/protocol";
afterEach(() => vi.unstubAllGlobals());
it("assembles exact code units across an 8192-unit surrogate boundary without a partial-success source", async () => {
  vi.stubGlobal("requestAnimationFrame", (callback: () => void) => {
    callback();
    return 1;
  });
  const text =
    '{"name":"' +
    "x".repeat(8191 - 9) +
    "😀" +
    "y".repeat(8192) +
    "\\ud800" +
    String.fromCharCode(0xd800) +
    '"}';
  let offset = 0;
  const host = {
    dispose() {},
    fence() {},
    async call(operation: string, input: Record<string, unknown>) {
      if (operation === "source")
        return { sourceId: "source", units: text.length, revision: "r" };
      expect(operation).toBe("sourceFrame");
      expect(input.offset).toBe(offset);
      const value = text.slice(offset, offset + 8192);
      const result = {
        sourceId: "source",
        offset,
        units: text.length,
        revision: "r",
        text: value,
        complete: offset + value.length === text.length,
      };
      offset += value.length;
      return result;
    },
  } as unknown as WorkbenchHost;
  const assembled = await readExactSource(host, "p", "r", "token", "t");
  expect(assembled).toBe(text);
  expect(assembled.charCodeAt(8191)).toBe(0xd83d);
  expect(assembled.charCodeAt(8192)).toBe(0xde00);
});
