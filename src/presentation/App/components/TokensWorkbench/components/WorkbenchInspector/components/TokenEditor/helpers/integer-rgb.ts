import { normalizedToByte, byteToNormalized } from "@domain/color-calculation";
import { decimalFromCanonical, multiplyDecimals } from "@domain/decimal";

/** UI-only whole-number entry. General calculation APIs remain decimal-capable. */
export function integerByteToNormalized(text: string): string {
  if (text !== "none") {
    decimalFromCanonical(text);
    if (text.includes(".")) throw new RangeError("Enter a whole number or none.");
  }
  return byteToNormalized(text);
}
export function integerByteIssue(text: string): string | undefined {
  try { integerByteToNormalized(text); }
  catch (error) {
    return error instanceof RangeError && error.message.includes("budget")
      ? error.message : "Enter a canonical whole number or none.";
  }
}
/** Preserve existing calculation guards, then decide the integer from exact text. */
export function integerByteDisplay(text: string): { text: string; approximate: boolean } {
  normalizedToByte(text); // Resource/representation guard only; never used for rounding.
  if (text === "none") return { text, approximate: false };
  const exact = multiplyDecimals(decimalFromCanonical(text), decimalFromCanonical("255"));
  const negative = exact.startsWith("-");
  const [integer, fraction = ""] = (negative ? exact.slice(1) : exact).split(".");
  let rounded = BigInt(integer);
  if (fraction) {
    const half = "5".padEnd(fraction.length, "0");
    if (fraction > half || (fraction === half && rounded % 2n === 1n)) rounded++;
  }
  return { text: `${negative && rounded !== 0n ? "-" : ""}${rounded}`, approximate: fraction !== "" };
}
