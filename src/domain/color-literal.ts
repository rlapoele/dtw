import { compareDecimals, decimalFromCanonical } from "./decimal";
import type { Decimal } from "./decimal";

export const COLOR_SPACES = [
  "srgb",
  "display-p3",
  "hsl",
  "oklab",
  "oklch",
] as const;

export type ColorSpace = (typeof COLOR_SPACES)[number];
export type ColorComponent = Decimal | "none";

export type ColorLiteralValue = {
  kind: "literal";
  valueType: "color";
  colorSpace: ColorSpace;
  components: readonly [ColorComponent, ColorComponent, ColorComponent];
  alpha: Decimal;
};

export type ColorLiteralInput = {
  colorSpace: string;
  components: readonly string[];
  alpha: string;
};

const zero = decimalFromCanonical("0");
const one = decimalFromCanonical("1");
const hundred = decimalFromCanonical("100");
const colorSpaceSet: ReadonlySet<string> = new Set(COLOR_SPACES);

export function createColorLiteral(
  input: ColorLiteralInput,
): ColorLiteralValue {
  if (!isColorSpace(input.colorSpace)) {
    throw new RangeError("Unsupported color space");
  }

  if (input.components.length !== 3) {
    throw new RangeError("A color requires exactly three components");
  }

  const components = input.components.map(parseComponent) as [
    ColorComponent,
    ColorComponent,
    ColorComponent,
  ];
  const alpha = decimalFromCanonical(input.alpha);

  assertInRange(alpha, zero, one, "alpha");
  validateAndNormalizeComponents(input.colorSpace, components);

  return {
    kind: "literal",
    valueType: "color",
    colorSpace: input.colorSpace,
    components,
    alpha,
  };
}

function isColorSpace(value: string): value is ColorSpace {
  return colorSpaceSet.has(value);
}

function parseComponent(value: string): ColorComponent {
  return value === "none" ? value : decimalFromCanonical(value);
}

function validateAndNormalizeComponents(
  colorSpace: ColorSpace,
  components: [ColorComponent, ColorComponent, ColorComponent],
): void {
  switch (colorSpace) {
    case "srgb":
    case "display-p3":
      return;
    case "hsl":
      components[0] = normalizeHue(components[0]);
      assertOptionalInRange(components[1], zero, hundred, "saturation");
      assertOptionalInRange(components[2], zero, hundred, "lightness");
      return;
    case "oklab":
      assertOptionalInRange(components[0], zero, one, "lightness");
      return;
    case "oklch":
      assertOptionalInRange(components[0], zero, one, "lightness");
      assertOptionalMinimum(components[1], zero, "chroma");
      components[2] = normalizeHue(components[2]);
  }
}

function normalizeHue(component: ColorComponent): ColorComponent {
  if (component === "none") {
    return component;
  }

  const negative = component.startsWith("-");
  const unsigned = negative ? component.slice(1) : component;
  const [integer, fraction = ""] = unsigned.split(".");
  const scale = 10n ** BigInt(fraction.length);
  const magnitude = BigInt(`${integer}${fraction}`);
  const value = negative ? -magnitude : magnitude;
  const modulus = 360n * scale;
  const normalized = ((value % modulus) + modulus) % modulus;

  return decimalFromCanonical(formatScaledInteger(normalized, fraction.length));
}

function formatScaledInteger(value: bigint, fractionLength: number): string {
  if (fractionLength === 0) {
    return value.toString();
  }

  const digits = value.toString().padStart(fractionLength + 1, "0");
  const integer = digits.slice(0, -fractionLength);
  const fraction = digits.slice(-fractionLength).replace(/0+$/, "");

  return fraction.length === 0 ? integer : `${integer}.${fraction}`;
}

function assertOptionalInRange(
  value: ColorComponent,
  minimum: Decimal,
  maximum: Decimal,
  componentName: string,
): void {
  if (value !== "none") {
    assertInRange(value, minimum, maximum, componentName);
  }
}

function assertOptionalMinimum(
  value: ColorComponent,
  minimum: Decimal,
  componentName: string,
): void {
  if (value !== "none" && compareDecimals(value, minimum) < 0) {
    throw new RangeError(`${componentName} is below its minimum`);
  }
}

function assertInRange(
  value: Decimal,
  minimum: Decimal,
  maximum: Decimal,
  componentName: string,
): void {
  if (
    compareDecimals(value, minimum) < 0 ||
    compareDecimals(value, maximum) > 0
  ) {
    throw new RangeError(`${componentName} is outside its accepted range`);
  }
}
