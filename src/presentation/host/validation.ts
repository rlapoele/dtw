import { validateResolution } from "./derived-validation";
import { TOKEN_TYPES } from "@domain/token";
import { admitSnapshot, plainTree, retentionLimits } from "@application/retention/codec";
import { internalId } from "@application/retention/record";
import type { HostOperation } from "./protocol";
type Data = Record<string, unknown>;
export function shape(
  value: unknown,
  required: string[],
  optional: string[] = [],
): Data {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Invalid application message shape");
  const v = value as Data;
  if (
    required.some((k) => !Object.hasOwn(v, k)) ||
    Object.keys(v).some((k) => !required.includes(k) && !optional.includes(k))
  )
    throw Error("Unsupported application message fields");
  return v;
}
function text(value: unknown) {
  if (typeof value !== "string") throw Error("Application string required");
  return value;
}
function internal(value: unknown) {
  if (!internalId(value)) throw Error("Invalid internal application identity");
}
function enumeration(value: unknown, choices: readonly unknown[]) {
  if (!choices.includes(value)) throw Error("Unsupported application value");
}
function command(value: unknown) {
  const v = shape(
    value,
    ["operation"],
    ["input", "projectId", "groupId", "localName"],
  );
  if (v.operation === "renameGroup") {
    shape(v, ["operation", "projectId", "groupId", "localName"]);
    for (const k of ["projectId", "groupId", "localName"]) text(v[k]);
    return;
  }
  enumeration(v.operation, [
    "createGroup",
    "createColorToken",
    "reviseColorToken",
  ]);
  shape(v, ["operation", "input"]);
  if (v.operation === "reviseColorToken") {
    const x = shape(v.input, ["projectId", "tokenId", "value"]);
    text(x.projectId);
    text(x.tokenId);
    colorValue(x.value);
    return;
  }
  const x = shape(
    v.input,
    [
      "projectId",
      "id",
      "localName",
      "parentGroupId",
      ...(v.operation === "createColorToken"
        ? ["type", "regeneration", "value"]
        : []),
    ],
    v.operation === "createColorToken"
      ? ["description", "layer", "semanticRole"]
      : ["description"],
  );
  for (const k of [
    "projectId",
    "id",
    "localName",
    "description",
    "semanticRole",
  ])
    if (Object.hasOwn(x, k)) text(x[k]);
  if (x.parentGroupId !== null) text(x.parentGroupId);
  if (v.operation === "createColorToken") {
    enumeration(x.type, ["color"]);
    enumeration(x.regeneration, ["allowed", "protected"]);
    if (Object.hasOwn(x, "layer"))
      enumeration(x.layer, ["primitive", "semantic"]);
    colorValue(x.value);
  }
}
function colorValue(value: unknown) {
  const v = shape(
    value,
    ["kind"],
    ["targetTokenId", "valuePath", "colorSpace", "components", "alpha"],
  );
  if (v.kind === "token-reference") {
    shape(v, ["kind", "targetTokenId", "valuePath"]);
    text(v.targetTokenId);
    if (!Array.isArray(v.valuePath) || v.valuePath.length !== 0)
      throw Error("Whole-color reference required");
  } else {
    shape(v, ["kind", "colorSpace", "components", "alpha"]);
    enumeration(v.kind, ["literal"]);
    enumeration(v.colorSpace, ["srgb", "display-p3", "hsl", "oklab", "oklch"]);
    text(v.alpha);
    if (!Array.isArray(v.components) || v.components.length !== 3)
      throw Error("Three color components required");
    v.components.forEach(text);
  }
}
export function validateHostInput(
  operation: HostOperation,
  input: unknown,
): void {
  if (operation === "stageBackup") {
    const v = shape(input, ["bytes"]);
    if (!(v.bytes instanceof ArrayBuffer) || v.bytes.byteLength > 16777216)
      throw Error("Invalid backup byte input");
    return;
  }
  plainTree(input);
  switch (operation) {
    case "recoverInterrupted":
      validateWriteIdentity(input);
      return;
    case "refreshStage":
      internal(input);
      return;
    case "backup":
    case "diagnostics": {
      const v = shape(input, ["projectId", "revision"]);
      text(v.projectId);
      internal(v.revision);
      return;
    }
    case "restore": {
      const v = shape(input, [
        "stageId",
        "projectId",
        "expectedRevision",
        "protectedRevision",
        "acknowledgement",
      ]);
      internal(v.stageId);
      text(v.projectId);
      if (v.expectedRevision !== null) internal(v.expectedRevision);
      if (v.protectedRevision !== null) internal(v.protectedRevision);
      if (typeof v.acknowledgement !== "boolean")
        throw Error("Replacement acknowledgement required");
      return;
    }
    case "sourceFrame": {
      const v = shape(input, ["sourceId", "offset", "count"]);
      internal(v.sourceId);
      for (const key of ["offset", "count"])
        if (
          typeof v[key] !== "number" ||
          !Number.isSafeInteger(v[key]) ||
          (v[key] as number) < 0
        )
          throw Error("Invalid source frame range");
      if ((v.count as number) < 1 || (v.count as number) > 8192)
        throw Error("Source frame count out of range");
      return;
    }
    case "context":
    case "rows":
    case "inspection":
    case "source": {
      const v = shape(input, [
        "projectId",
        "revision",
        ...(operation === "rows"
          ? ["offset", "count"]
          : operation === "inspection"
            ? ["tokenId"]
            : operation === "source"
              ? ["entityKind", "entityId"]
              : []),
      ]);
      text(v.projectId);
      internal(v.revision);
      if (operation === "rows") {
        for (const key of ["offset", "count"])
          if (
            typeof v[key] !== "number" ||
            !Number.isSafeInteger(v[key]) ||
            (v[key] as number) < 0
          )
            throw Error("Invalid row batch");
        if ((v.count as number) > 100) throw Error("Row batch exceeds 100");
      }
      if (operation === "inspection") text(v.tokenId);
      if (operation === "source") {
        text(v.entityId);
        enumeration(v.entityKind, ["project", "group", "token"]);
        if (v.entityKind === "project" && v.entityId !== v.projectId)
          throw Error("Project source identity mismatch");
      }
      return;
    }
    case "suspend":
    case "ready":
    case "catalogue":
    case "check":
      if (input !== null) throw Error("No operation payload expected");
      return;
    case "consume":
      internal(input);
      return;
    case "resume":
    case "openProject":
    case "leaveProject":
      text(input);
      return;
    case "createProject": {
      const v = shape(input, ["id", "name"]);
      text(v.id);
      text(v.name);
      return;
    }
    case "command": {
      const v = shape(input, ["command", "revision"]);
      internal(v.revision);
      command(v.command);
      return;
    }
  }
}
function acceptance(
  value: unknown,
  operation?: string,
  resultKind?: string,
  resultId?: string,
) {
  const v = shape(
    value,
    ["status"],
    ["revision", "receipt", "readback", "readError", "reason", "commandId"],
  );
  if (v.status === "retained") {
    shape(v, ["status", "revision", "receipt", "readback"], ["readError"]);
    internal(v.revision);
    enumeration(v.readback, ["available", "unavailable"]);
    if (Object.hasOwn(v, "readError")) text(v.readError);
    const c = shape(v.receipt, ["commandId", "operation", "result"]);
    internal(c.commandId);
    enumeration(c.operation, [
      "createProject",
      "restoreProject",
      "createGroup",
      "renameGroup",
      "createColorToken",
      "reviseColorToken",
    ]);
    const r = shape(c.result, ["entityKind", "id"]);
    enumeration(r.entityKind, ["project", "group", "token"]);
    text(r.id);
    if (
      (operation !== undefined && c.operation !== operation) ||
      (resultKind !== undefined && r.entityKind !== resultKind) ||
      (resultId !== undefined && r.id !== resultId)
    )
      throw Error("Application result does not match original command");
  } else if (v.status === "rejected") {
    shape(v, ["status", "reason"]);
    text(v.reason);
  } else if (v.status === "unknown") {
    shape(v, ["status", "reason", "commandId"]);
    text(v.reason);
    internal(v.commandId);
  } else throw Error("Invalid application acceptance status");
}
export function validateHostOutput(
  operation: HostOperation,
  input: unknown,
  output: unknown,
): void {
  if (operation === "backup") {
    const v = shape(output, ["bytes", "revision", "createdAt"]);
    const request = shape(input, ["projectId", "revision"]);
    if (
      !(v.bytes instanceof ArrayBuffer) ||
      v.bytes.byteLength > 16777216 ||
      v.revision !== request.revision
    )
      throw Error("Backup response mismatch");
    text(v.createdAt);
    return;
  }
  // Display DTOs include bounded derived paths and protocol metadata in addition
  // to admitted authored strings. They have their own finite transport budget;
  // snapshot/command admission always retains the canonical limits.
  plainTree(output, { ...retentionLimits, strings: 8388608, values: 400000 });
  switch (operation) {
    case "recoverInterrupted": {
      const attempt =
        input as import("@application/retention/ports").WriteIdentity;
      acceptance(
        output,
        attempt.operation,
        attempt.result.entityKind,
        attempt.result.id,
      );
      const result = output as {
        status: string;
        receipt?: { commandId: string };
        commandId?: string;
      };
      if (
        (result.status === "retained" &&
          result.receipt?.commandId !== attempt.commandId) ||
        (result.status === "unknown" && result.commandId !== attempt.commandId)
      )
        throw Error("Interrupted result identity mismatch");
      return;
    }
    case "diagnostics":
      diagnosticOutput(output);
      return;
    case "stageBackup":
    case "refreshStage": {
      const v = shape(output, [
        "stageId",
        "project",
        "createdAt",
        "tokens",
        "groups",
        "diagnostics",
        "local",
      ]);
      internal(v.stageId);
      const p = shape(v.project, ["id", "name"], ["description"]);
      text(p.id);
      text(p.name);
      if (Object.hasOwn(p, "description")) text(p.description);
      text(v.createdAt);
      counts(v);
      diagnosticOutput(v.diagnostics);
      if (v.local !== null) {
        const local = shape(v.local, ["revision", "name"]);
        internal(local.revision);
        text(local.name);
      }
      if (operation === "refreshStage" && v.stageId !== input)
        throw Error("Staged backup response mismatch");
      return;
    }
    case "restore":
      acceptance(
        output,
        "restoreProject",
        "project",
        text((input as { projectId: unknown }).projectId),
      );
      return;
    case "sourceFrame": {
      const v = shape(output, [
        "sourceId",
        "offset",
        "units",
        "revision",
        "text",
        "complete",
      ]);
      const request = shape(input, ["sourceId", "offset", "count"]);
      text(v.text);
      internal(v.revision);
      if (
        v.sourceId !== request.sourceId ||
        v.offset !== request.offset ||
        typeof v.units !== "number" ||
        !Number.isSafeInteger(v.units) ||
        v.units < 0 ||
        typeof v.complete !== "boolean" ||
        (v.text as string).length > (request.count as number) ||
        (v.offset as number) + (v.text as string).length > v.units ||
        v.complete !==
          ((v.offset as number) + (v.text as string).length === v.units)
      )
        throw Error("Source frame correlation mismatch");
      return;
    }
    case "source": {
      const v = shape(output, ["sourceId", "units", "revision"]);
      const request = shape(input, [
        "projectId",
        "revision",
        "entityKind",
        "entityId",
      ]);
      internal(v.sourceId);
      if (
        typeof v.units !== "number" ||
        !Number.isSafeInteger(v.units) ||
        v.units < 0 ||
        v.revision !== request.revision
      )
        throw Error("Source response correlation mismatch");
      return;
    }
    case "context": {
      const v = shape(output, ["project", "groups", "tokens"]);
      const request = shape(input, ["projectId", "revision"]);
      const p = shape(v.project, ["id", "name"], ["description"]);
      if (p.id !== request.projectId) throw Error("Context project mismatch");
      text(p.name);
      if (!Array.isArray(v.groups) || !Array.isArray(v.tokens))
        throw Error("Invalid context members");
      for (const item of v.groups) {
        const entry = shape(item, ["authored", "path"]);
        const g = shape(
          entry.authored,
          ["id", "projectId", "localName", "parentGroupId"],
          ["description"],
        );
        text(g.id);
        text(g.localName);
        if (g.projectId !== p.id)
          throw Error("Group context ownership mismatch");
        if (g.parentGroupId !== null) text(g.parentGroupId);
        path(entry.path);
      }
      for (const item of v.tokens) {
        const entry = shape(item, ["authored", "path"]);
        const token = shape(
          entry.authored,
          ["id", "localName", "parentGroupId"],
          ["definition"],
        );
        text(token.id);
        text(token.localName);
        if (token.parentGroupId !== null) text(token.parentGroupId);
        if (token.definition) text(shape(token.definition, ["type"]).type);
        path(entry.path);
      }
      return;
    }
    case "rows": {
      if (!Array.isArray(output)) throw Error("Invalid row batch");
      const request = shape(input, [
        "projectId",
        "revision",
        "offset",
        "count",
      ]);
      if (output.length > (request.count as number))
        throw Error("Excess row batch");
      for (const item of output) {
        const row = shape(
          item,
          ["id", "parentGroupId", "label", "layer", "type", "valueKind"],
          ["description", "color", "targetId", "preview"],
        );
        for (const key of [
          "id",
          "label",
          "layer",
          "type",
          "valueKind",
          "description",
          "targetId",
        ])
          if (Object.hasOwn(row, key)) text(row[key]);
        if (row.parentGroupId !== null) text(row.parentGroupId);
        for (const key of ["color", "preview"])
          if (row[key])
            admitSnapshot({
              project: { id: "", name: "" },
              groups: [],
              tokens: [
                {
                  id: "",
                  projectId: "",
                  localName: "",
                  parentGroupId: null,
                  authoring: { regeneration: "allowed" },
                  definition: {
                    type: "color",
                    assignments: [{ condition: [], value: row[key] }],
                  },
                },
              ],
            });
      }
      return;
    }
    case "inspection": {
      const v = shape(
        output,
        ["token", "authoredKind", "editable", "path", "resolution"],
        ["authoredValue"],
      );
      const request = shape(input, ["projectId", "revision", "tokenId"]);
      const token = shape(
        v.token,
        ["id", "projectId", "localName", "parentGroupId", "authoring"],
        [
          "description",
          "layer",
          "semanticRole",
          "componentDefinitionId",
          "definition",
        ],
      );
      if (token.id !== request.tokenId || token.projectId !== request.projectId)
        throw Error("Inspection identity mismatch");
      const definition = token.definition
        ? shape(token.definition, ["type"])
        : undefined;
      admitSnapshot({
        project: { id: token.projectId, name: "" },
        groups: [],
        tokens: [
          {
            ...token,
            ...(definition
              ? {
                  definition: {
                    type: definition.type,
                    assignments: v.authoredValue
                      ? [{ condition: [], value: v.authoredValue }]
                      : [],
                  },
                }
              : {}),
          },
        ],
      });
      enumeration(v.authoredKind, [
        "literal",
        "token-reference",
        "expression",
        "composite",
        "No assignment",
      ]);
      if (typeof v.editable !== "boolean")
        throw Error("Inspection eligibility missing");
      const domainEligible =
        definition?.type === "color" &&
        token.layer !== "component" &&
        (token.layer === undefined ||
          token.layer === "primitive" ||
          token.layer === "semantic") &&
        !!v.authoredValue;
      if (v.editable !== !!domainEligible)
        throw Error("Inspection eligibility correlation mismatch");
      if (v.authoredValue && (v.authoredValue as Data).kind !== v.authoredKind)
        throw Error("Authored value-kind mismatch");
      if (definition) enumeration(definition.type, TOKEN_TYPES);
      path(v.path);
      validateResolution(
        v.resolution,
        text(token.id),
        definition ? text(definition.type) : undefined,
      );
      return;
    }
    case "ready": {
      const v = shape(output, ["incarnation"]);
      internal(v.incarnation);
      return;
    }
    case "suspend":
    case "consume":
      if (output !== true) throw Error("Application acknowledgement missing");
      return;
    case "leaveProject":
      if (typeof output !== "boolean") throw Error("Departure proof missing");
      return;
    case "catalogue": {
      if (!Array.isArray(output)) throw Error("Invalid Projects response");
      for (const item of output) {
        const v = shape(
          item,
          ["rowKey", "id", "status"],
          ["name", "revision", "tokens", "groups", "reason"],
        );
        text(v.rowKey);
        text(v.id);
        if (v.status === "supported") {
          shape(v, [
            "rowKey",
            "id",
            "status",
            "name",
            "revision",
            "tokens",
            "groups",
          ]);
          text(v.name);
          internal(v.revision);
          counts(v);
        } else {
          shape(v, ["rowKey", "id", "status", "reason"]);
          enumeration(v.status, ["unavailable"]);
          text(v.reason);
        }
      }
      return;
    }
    case "resume":
    case "openProject": {
      const v = shape(output, [
        "project",
        "revision",
        "incarnation",
        "writable",
        "tokens",
        "groups",
      ]);
      const p = shape(v.project, ["id", "name"], ["description"]);
      text(p.id);
      text(p.name);
      if (Object.hasOwn(p, "description")) text(p.description);
      if (p.id !== input) throw Error("Project response identity mismatch");
      internal(v.revision);
      internal(v.incarnation);
      if (typeof v.writable !== "boolean")
        throw Error("Editing access missing");
      counts(v);
      return;
    }
    case "createProject": {
      const v = shape(input, ["id", "name"]);
      acceptance(output, "createProject", "project", text(v.id));
      return;
    }
    case "command": {
      const c = shape(
        shape(input, ["command", "revision"]).command,
        ["operation"],
        ["input", "projectId", "groupId", "localName"],
      );
      const details =
        c.operation === "renameGroup"
          ? c
          : shape(
              c.input,
              [],
              [
                "id",
                "tokenId",
                "projectId",
                "localName",
                "parentGroupId",
                "type",
                "regeneration",
                "value",
                "description",
                "layer",
                "semanticRole",
              ],
            );
      const kind =
        c.operation === "renameGroup" || c.operation === "createGroup"
          ? "group"
          : "token";
      acceptance(
        output,
        text(c.operation),
        kind,
        text(
          c.operation === "renameGroup"
            ? c.groupId
            : c.operation === "reviseColorToken"
              ? details.tokenId
              : details.id,
        ),
      );
      return;
    }
    case "check":
      acceptance(output);
      return;
  }
}
function counts(v: Data) {
  for (const k of ["tokens", "groups"])
    if (
      typeof v[k] !== "number" ||
      !Number.isSafeInteger(v[k]) ||
      (v[k] as number) < 0
    )
      throw Error("Invalid project counts");
}

function path(value: unknown) {
  const v = shape(value, ["status"], ["path", "diagnostics", "reason"]);
  if (v.status === "derived") {
    shape(v, ["status", "path"]);
    if (!Array.isArray(v.path)) throw Error("Invalid namespace path");
    v.path.forEach(text);
  } else if (v.status === "unavailable") {
    shape(v, ["status", "reason"]);
    text(v.reason);
  } else {
    shape(v, ["status", "diagnostics"]);
    if (v.status !== "invalid" || !Array.isArray(v.diagnostics))
      throw Error("Invalid namespace diagnostics");
  }
}

function diagnosticOutput(value: unknown) {
  const v = shape(value, ["items", "complete", "total"]);
  if (
    !Array.isArray(v.items) ||
    v.items.length > 1000 ||
    typeof v.complete !== "boolean" ||
    typeof v.total !== "number" ||
    !Number.isSafeInteger(v.total) ||
    v.total < v.items.length
  )
    throw Error("Invalid diagnostic report");
  v.items.forEach(text);
  if (v.complete && v.total !== v.items.length)
    throw Error("Incomplete diagnostic report claimed complete");
}

export function validateAttempt(
  value: unknown,
  operation: HostOperation,
  input: unknown,
): void {
  plainTree(value);
  const v = shape(value, [
    "commandId",
    "revision",
    "projectId",
    "expectedRevision",
    "incarnation",
    "operation",
    "result",
  ]);
  internal(v.commandId);
  internal(v.revision);
  internal(v.incarnation);
  text(v.projectId);
  if (v.expectedRevision !== null) internal(v.expectedRevision);
  const result = shape(v.result, ["entityKind", "id"]);
  text(result.id);
  enumeration(result.entityKind, ["project", "group", "token"]);
  if (operation === "createProject") {
    const x = shape(input, ["id", "name"]);
    if (
      v.operation !== "createProject" ||
      v.projectId !== x.id ||
      v.expectedRevision !== null ||
      result.entityKind !== "project" ||
      result.id !== x.id
    )
      throw Error("Creation attempt mismatch");
  } else if (operation === "restore") {
    const x = shape(input, [
      "stageId",
      "projectId",
      "expectedRevision",
      "protectedRevision",
      "acknowledgement",
    ]);
    if (
      v.operation !== "restoreProject" ||
      v.projectId !== x.projectId ||
      v.expectedRevision !== x.expectedRevision ||
      result.entityKind !== "project" ||
      result.id !== x.projectId
    )
      throw Error("Restore attempt mismatch");
  } else if (operation === "command") {
    const x = shape(input, ["command", "revision"]);
    const c = shape(
      x.command,
      ["operation"],
      ["input", "projectId", "groupId", "localName"],
    );
    const details =
      c.operation === "renameGroup"
        ? c
        : shape(
            c.input,
            [],
            [
              "projectId",
              "id",
              "tokenId",
              "localName",
              "parentGroupId",
              "description",
              "type",
              "regeneration",
              "layer",
              "semanticRole",
              "value",
            ],
          );
    const kind =
      c.operation === "renameGroup" || c.operation === "createGroup"
        ? "group"
        : "token";
    const id =
      c.operation === "renameGroup"
        ? c.groupId
        : c.operation === "reviseColorToken"
          ? details.tokenId
          : details.id;
    if (
      v.operation !== c.operation ||
      v.projectId !== details.projectId ||
      v.expectedRevision !== x.revision ||
      result.entityKind !== kind ||
      result.id !== id
    )
      throw Error("Authoring attempt mismatch");
  } else throw Error("Nonmutation has attempt identity");
}

function validateWriteIdentity(value: unknown) {
  plainTree(value);
  const v = shape(value, [
    "commandId",
    "revision",
    "projectId",
    "expectedRevision",
    "incarnation",
    "operation",
    "result",
  ]);
  internal(v.commandId);
  internal(v.revision);
  internal(v.incarnation);
  text(v.projectId);
  if (v.expectedRevision !== null) internal(v.expectedRevision);
  enumeration(v.operation, [
    "createProject",
    "restoreProject",
    "createGroup",
    "renameGroup",
    "createColorToken",
    "reviseColorToken",
  ]);
  const result = shape(v.result, ["entityKind", "id"]);
  text(result.id);
  enumeration(result.entityKind, ["project", "group", "token"]);
  const kind =
    v.operation === "createProject" || v.operation === "restoreProject"
      ? "project"
      : v.operation === "createGroup" || v.operation === "renameGroup"
        ? "group"
        : "token";
  if (
    result.entityKind !== kind ||
    (kind === "project" && result.id !== v.projectId)
  )
    throw Error("Interrupted result kind mismatch");
}
