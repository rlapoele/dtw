import { decimalFromCanonical } from "@domain/decimal";

/** Decimal display rounding only: nearest, ties away from zero, no Number conversion. */
export function colorDecimalDisplay(value: string): string {
  if (value === "none") return value;
  // Incomplete or invalid draft text must remain visible verbatim.
  try {
    decimalFromCanonical(value);
  } catch {
    return value;
  }
  const negative = value.startsWith("-");
  const [integer, fraction = ""] = (negative ? value.slice(1) : value).split(".");
  if (fraction.length <= 4) return value;
  let units = BigInt(integer + fraction.slice(0, 4));
  if (fraction[4] >= "5") units += 1n;
  if (units === 0n) return "0";
  const digits = units.toString().padStart(5, "0");
  const tail = digits.slice(-4).replace(/0+$/, "");
  return (negative ? "-" : "") + digits.slice(0, -4) + (tail ? "." + tail : "");
}
