import { TOKEN_TYPES } from "@domain/token";
import { TOKEN_RESOLUTION_FAILURE_REASONS } from "@domain/token-resolution";
import { decimalFromCanonical, compareDecimals } from "@domain/decimal";
type Obj = Record<string, unknown>;
function object(
  value: unknown,
  required: readonly string[],
  optional: readonly string[] = [],
): Obj {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Invalid derived object");
  const v = value as Obj;
  if (
    required.some((key) => !Object.hasOwn(v, key)) ||
    Object.keys(v).some(
      (key) => !required.includes(key) && !optional.includes(key),
    )
  )
    throw Error("Invalid derived fields");
  return v;
}
function string(value: unknown): string {
  if (typeof value !== "string") throw Error("Invalid derived string");
  return value;
}
function one(value: unknown, values: readonly string[]): string {
  const s = string(value);
  if (!values.includes(s)) throw Error("Invalid derived enum");
  return s;
}
function list(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw Error("Invalid derived array");
  return value;
}
function integer(value: unknown) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)
    throw Error("Invalid derived index");
}
function decimal(value: unknown, min?: string, max?: string) {
  const s = string(value);
  if (s.replace(/[-.]/g, "").length > 8192)
    throw Error("Derived Decimal budget exceeded");
  const d = decimalFromCanonical(s);
  if (
    (min !== undefined && compareDecimals(d, decimalFromCanonical(min)) < 0) ||
    (max !== undefined && compareDecimals(d, decimalFromCanonical(max)) > 0)
  )
    throw Error("Invalid derived Decimal range");
  return d;
}
function emptyCondition(value: unknown) {
  if (list(value).length !== 0)
    throw Error("Unsupported variation context in derived response");
}
const compositeFields = {
  transition: {
    duration: "duration",
    delay: "duration",
    timingFunction: "cubicBezier",
  },
  typography: {
    fontFamily: "fontFamily",
    fontSize: "dimension",
    fontWeight: "fontWeight",
    letterSpacing: "dimension",
    lineHeight: "number",
  },
  shadow: {
    color: "color",
    offsetX: "dimension",
    offsetY: "dimension",
    blur: "dimension",
    spread: "dimension",
    inset: "boolean",
  },
} as const;
function literal(value: unknown, expected?: string) {
  const v = object(
    value,
    ["kind", "valueType"],
    [
      "value",
      "unit",
      "ratio",
      "families",
      "controlPoints",
      "colorSpace",
      "components",
      "alpha",
    ],
  );
  if (v.kind !== "literal") throw Error("Derived literal required");
  const type = one(v.valueType, [
    "number",
    "dimension",
    "duration",
    "percentage",
    "fontWeight",
    "boolean",
    "fontFamily",
    "cubicBezier",
    "color",
  ]);
  if (expected && expected !== type) throw Error("Derived field type mismatch");
  if (["number", "dimension", "duration", "fontWeight"].includes(type)) {
    object(v, [
      "kind",
      "valueType",
      "value",
      ...(["dimension", "duration"].includes(type) ? ["unit"] : []),
    ]);
    decimal(
      v.value,
      type === "fontWeight" ? "1" : undefined,
      type === "fontWeight" ? "1000" : undefined,
    );
    if (type === "dimension") one(v.unit, ["px", "rem"]);
    if (type === "duration") one(v.unit, ["ms", "s"]);
  } else if (type === "percentage") {
    object(v, ["kind", "valueType", "ratio"]);
    decimal(v.ratio);
  } else if (type === "boolean") {
    object(v, ["kind", "valueType", "value"]);
    if (typeof v.value !== "boolean") throw Error("Derived boolean required");
  } else if (type === "fontFamily") {
    object(v, ["kind", "valueType", "families"]);
    const families = list(v.families);
    if (!families.length || families.length > 256)
      throw Error("Invalid derived font stack");
    for (const item of families) {
      const f = object(item, ["kind"], ["name", "family"]);
      if (f.kind === "named") {
        object(f, ["kind", "name"]);
        if (!string(f.name).trim()) throw Error("Invalid derived named font");
      } else {
        object(f, ["kind", "family"]);
        one(f.kind, ["generic"]);
        one(f.family, ["serif", "sans-serif", "monospace", "system-ui"]);
      }
    }
  } else if (type === "cubicBezier") {
    object(v, ["kind", "valueType", "controlPoints"]);
    const points = list(v.controlPoints);
    if (points.length !== 4) throw Error("Invalid derived Bezier");
    points.forEach((p, i) =>
      decimal(p, i % 2 === 0 ? "0" : undefined, i % 2 === 0 ? "1" : undefined),
    );
  } else {
    object(v, ["kind", "valueType", "colorSpace", "components", "alpha"]);
    const space = one(v.colorSpace, [
      "srgb",
      "display-p3",
      "hsl",
      "oklab",
      "oklch",
    ]);
    decimal(v.alpha, "0", "1");
    const components = list(v.components);
    if (components.length !== 3) throw Error("Invalid derived color arity");
    components.forEach((c, i) => {
      if (c === "none") return;
      decimal(c);
      if (space === "hsl") {
        if (i === 0) {
          decimal(c, "0");
          if (
            compareDecimals(
              decimalFromCanonical(string(c)),
              decimalFromCanonical("360"),
            ) >= 0
          )
            throw Error("Invalid derived hue");
        } else decimal(c, "0", "100");
      }
      if ((space === "oklab" || space === "oklch") && i === 0)
        decimal(c, "0", "1");
      if (space === "oklch" && i === 1) decimal(c, "0");
      if (space === "oklch" && i === 2) {
        decimal(c, "0");
        if (
          compareDecimals(
            decimalFromCanonical(string(c)),
            decimalFromCanonical("360"),
          ) >= 0
        )
          throw Error("Invalid derived hue");
      }
    });
  }
  return type;
}
function resolvedValue(value: unknown, expected: string) {
  const v = object(
    value,
    ["kind", "valueType"],
    [
      "value",
      "unit",
      "ratio",
      "families",
      "controlPoints",
      "colorSpace",
      "components",
      "alpha",
      "duration",
      "delay",
      "timingFunction",
      "fontFamily",
      "fontSize",
      "fontWeight",
      "letterSpacing",
      "lineHeight",
      "layers",
    ],
  );
  if (v.kind === "literal") {
    literal(v, expected);
    return;
  }
  if (
    v.kind !== "composite" ||
    v.valueType !== expected ||
    !Object.hasOwn(compositeFields, expected)
  )
    throw Error("Invalid derived composite");
  const type = expected as keyof typeof compositeFields;
  const fieldTypes = compositeFields[type];
  const check = (layer: Obj) => {
    for (const [key, fieldType] of Object.entries(fieldTypes)) {
      literal(layer[key], fieldType);
      if (["duration", "fontSize", "lineHeight", "blur"].includes(key))
        decimal((layer[key] as Obj).value, "0");
    }
  };
  if (type === "shadow") {
    object(v, ["kind", "valueType", "layers"]);
    const layers = list(v.layers);
    if (!layers.length || layers.length > 256)
      throw Error("Invalid derived shadow");
    for (const layer of layers) check(object(layer, Object.keys(fieldTypes)));
  } else check(object(v, ["kind", "valueType", ...Object.keys(fieldTypes)]));
}
export function validateResolution(
  value: unknown,
  tokenId: string,
  expectedType?: string,
): void {
  const v = object(
    value,
    ["status", "trace", "diagnostics"],
    ["tokenId", "selection", "matchedCondition", "value", "reason"],
  );
  if (v.status === "unavailable") {
    object(v, ["status", "reason", "trace", "diagnostics"]);
    string(v.reason);
    if (list(v.trace).length || list(v.diagnostics).length)
      throw Error("Unavailable response contains fabricated resolution");
    return;
  }
  if (v.status === "resolved") {
    object(v, [
      "status",
      "tokenId",
      "selection",
      "matchedCondition",
      "value",
      "trace",
      "diagnostics",
    ]);
    emptyCondition(v.matchedCondition);
    if (!expectedType) throw Error("Resolved token lacks declared type");
    resolvedValue(v.value, expectedType);
  } else {
    object(v, [
      "status",
      "tokenId",
      "selection",
      "reason",
      "trace",
      "diagnostics",
    ]);
    one(v.status, ["unresolved"]);
    one(v.reason, TOKEN_RESOLUTION_FAILURE_REASONS);
  }
  if (v.tokenId !== tokenId) throw Error("Resolution root identity mismatch");
  emptyCondition(v.selection);
  for (const item of list(v.trace)) {
    const step = object(
      item,
      ["tokenId", "matchedCondition", "specificity"],
      ["targetTokenId"],
    );
    string(step.tokenId);
    emptyCondition(step.matchedCondition);
    if (step.specificity !== 0)
      throw Error("Unexpected conditional specificity");
    if (Object.hasOwn(step, "targetTokenId")) string(step.targetTokenId);
  }
  for (const item of list(v.diagnostics)) {
    const d = object(
      item,
      ["code", "tokenId"],
      [
        "field",
        "fieldOwnerId",
        "layerIndex",
        "compositeCode",
        "expressionCode",
        "operandPath",
        "operation",
        "requiredContext",
        "cycle",
        "candidates",
        "expectedType",
        "actualType",
      ],
    );
    one(d.code, TOKEN_RESOLUTION_FAILURE_REASONS);
    string(d.tokenId);
    for (const key of ["fieldOwnerId", "operation"])
      if (Object.hasOwn(d, key)) string(d[key]);
    if (Object.hasOwn(d, "field"))
      one(d.field, [
        "duration",
        "delay",
        "timingFunction",
        "fontFamily",
        "fontSize",
        "fontWeight",
        "letterSpacing",
        "lineHeight",
        "color",
        "offsetX",
        "offsetY",
        "blur",
        "spread",
        "inset",
      ]);
    if (Object.hasOwn(d, "layerIndex")) integer(d.layerIndex);
    if (Object.hasOwn(d, "compositeCode"))
      one(d.compositeCode, [
        "negative-transition-duration",
        "invalid-transition-field",
        "negative-typography-font-size",
        "negative-typography-line-height",
        "invalid-typography-field",
        "invalid-shadow-layers",
        "invalid-shadow-field",
        "negative-shadow-blur",
      ]);
    if (Object.hasOwn(d, "expressionCode"))
      one(d.expressionCode, [
        "invalid-arity",
        "invalid-operands",
        "invalid-clamp-range",
        "invalid-context",
        "unknown-operation",
        "context-required",
      ]);
    if (Object.hasOwn(d, "operandPath")) list(d.operandPath).forEach(integer);
    if (Object.hasOwn(d, "requiredContext"))
      list(d.requiredContext).forEach((key) => one(key, ["font.rootSize"]));
    if (Object.hasOwn(d, "cycle")) list(d.cycle).forEach(string);
    if (Object.hasOwn(d, "candidates"))
      list(d.candidates).forEach(emptyCondition);
    for (const key of ["expectedType", "actualType"])
      if (Object.hasOwn(d, key)) one(d[key], TOKEN_TYPES);
  }
}
