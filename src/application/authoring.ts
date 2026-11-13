import { prepareNamespaceName } from "@domain/namespace-naming";
import { introducedNamespaceCollisions } from "@domain/namespace-collisions";
import { canReviseColorToken } from "@application/color-revision-policy";
import { createProject } from "@domain/project";
import type { Project, ProjectInput } from "@domain/project";
import { createColorLiteral } from "@domain/color-literal";
import type { ColorLiteralInput } from "@domain/color-literal";
import { addTokenAssignment, createToken, removeTokenAssignment } from "@domain/token";
import type { Token } from "@domain/token";
import { createTokenGroup, renameTokenGroup } from "@domain/token-group";
import type { TokenGroup, TokenGroupInput } from "@domain/token-group";
import { createTokenReference } from "@domain/token-reference";
import { deriveTokenGroupPath, deriveTokenPath, validateProjectNamespace } from "@domain/namespace";
import type { NamespaceDiagnostic, NamespacePathResult } from "@domain/namespace";
import { validateProjectTokenReferences } from "@domain/token-reference-validation";
import type { TokenReferenceDiagnostic } from "@domain/token-reference-validation";
import { resolveToken } from "@domain/token-resolution";
import type { TokenResolutionResult } from "@domain/token-resolution";
import { completeVariationSelection, createVariationSelection } from "@domain/variation-selection";
import type { ProjectSnapshot, ProjectStorage } from "@application/project-storage";

export type ApplicationFailure = {
  readonly status: "failure";
  readonly error:
    | { readonly code: "project-not-found"; readonly projectId: string }
    | { readonly code: "duplicate-identity"; readonly entityKind: "project" | "group" | "token"; readonly entityId: string }
    | { readonly code: "entity-not-found"; readonly entityKind: "group" | "token"; readonly entityId: string }
    | { readonly code: "invalid-domain-input"; readonly message: string }
    | { readonly code: "invalid-candidate"; readonly namespaceDiagnostics: readonly NamespaceDiagnostic[]; readonly referenceDiagnostics: readonly TokenReferenceDiagnostic[] }
    | { readonly code: "storage-failure"; readonly operation: "load" | "commit"; readonly message: string };
};

export type ApplicationResult<T> = { readonly status: "ok"; readonly value: T } | ApplicationFailure;

export type CreateColorTokenInput = {
  readonly projectId: string;
  readonly id: string;
  readonly localName: string;
  readonly parentGroupId: string | null;
  readonly type: "color";
  readonly description?: string;
  readonly layer?: "primitive" | "semantic";
  readonly semanticRole?: string;
  readonly regeneration: "allowed" | "protected";
  readonly value:
    | (ColorLiteralInput & { readonly kind: "literal" })
    | { readonly kind: "token-reference"; readonly targetTokenId: string; readonly valuePath: readonly [] };
};

export type ReviseColorTokenInput = {
  readonly projectId: string;
  readonly tokenId: string;
  readonly value: CreateColorTokenInput["value"];
};

export type ProjectReadback = {
  readonly project: ProjectSnapshot["project"];
  readonly groups: readonly { readonly authored: TokenGroup; readonly path: NamespacePathResult }[];
  readonly tokens: readonly { readonly authored: Token; readonly path: NamespacePathResult }[];
};

export type ProjectValidation = {
  readonly namespaceDiagnostics: readonly NamespaceDiagnostic[];
  readonly referenceDiagnostics: readonly TokenReferenceDiagnostic[];
};

export type TokenInspection = {
  readonly authored: Token;
  readonly path: NamespacePathResult;
  readonly resolution: TokenResolutionResult;
};

// The only authored selection in this increment is unconditional. Complete it
// through the domain rather than asserting the CompleteVariationSelection brand.
function emptySelection() {
  return completeVariationSelection([], createVariationSelection([]), createVariationSelection([]));
}

export function createAuthoringOperations(storage: ProjectStorage) {
  function load(projectId: string): ApplicationResult<ProjectSnapshot> {
    const result = storage.load(projectId);
    if (result.status === "failure") return { status: "failure", error: { code: "storage-failure", operation: "load", message: result.message } };
    if (result.value === undefined) return { status: "failure", error: { code: "project-not-found", projectId } };
    const duplicate = duplicateIdentity(result.value.groups, "group") ?? duplicateIdentity(result.value.tokens, "token");
    if (duplicate !== undefined) return duplicate;
    return { status: "ok", value: result.value };
  }

  function commit<T>(candidate: ProjectSnapshot, value: T): ApplicationResult<T> {
    const result = storage.commit(candidate);
    return result.status === "failure"
      ? { status: "failure", error: { code: "storage-failure", operation: "commit", message: result.message } }
      : { status: "ok", value };
  }

  function accept<T>(candidate: ProjectSnapshot, value: T, previous?: ProjectSnapshot): ApplicationResult<T> {
    if (previous) {
      const collisions = introducedNamespaceCollisions(namespaceOf(previous), namespaceOf(candidate));
      if (collisions.length) return { status: "failure", error: { code: "invalid-domain-input", message: "Namespace path collision: " + JSON.stringify(collisions) } };
    }
    const checks = validate(candidate);
    if (checks.namespaceDiagnostics.length > 0 || checks.referenceDiagnostics.length > 0) {
      return { status: "failure", error: { code: "invalid-candidate", ...checks } };
    }
    return commit(candidate, value);
  }

  return {
    createProject(input: ProjectInput): ApplicationResult<Project> {
      const existing = storage.load(input.id);
      if (existing.status === "failure") return { status: "failure", error: { code: "storage-failure", operation: "load", message: existing.message } };
      if (existing.value !== undefined) return { status: "failure", error: { code: "duplicate-identity", entityKind: "project", entityId: input.id } };
      const project = createProject(input);
      return commit({ project, groups: [], tokens: [] }, project);
    },

    readProject(projectId: string): ApplicationResult<ProjectReadback> {
      const result = load(projectId);
      if (result.status === "failure") return result;
      const snapshot = result.value;
      const namespace = namespaceOf(snapshot);
      return { status: "ok", value: {
        project: snapshot.project,
        groups: snapshot.groups.filter(group => group.projectId === projectId).map(authored => ({ authored, path: deriveTokenGroupPath(namespace, authored.id) })),
        tokens: snapshot.tokens.filter(token => token.projectId === projectId).map(authored => ({ authored, path: deriveTokenPath(namespace, authored.id) })),
      } };
    },

    createGroup(input: TokenGroupInput): ApplicationResult<TokenGroup> {
      const result = load(input.projectId);
      if (result.status === "failure") return result;
      if (result.value.groups.some(group => group.id === input.id)) return duplicateFailure("group", input.id);
      let group: TokenGroup;
      try { group = createTokenGroup({ ...input, localName: prepareNamespaceName(input.localName) }); }
      catch (error) { if (!(error instanceof RangeError)) throw error; return {status:"failure", error:{code:"invalid-domain-input", message:error.message}}; }
      return accept({ ...result.value, groups: [...result.value.groups, group] }, group, result.value);
    },

    renameGroup(projectId: string, groupId: string, localName: string): ApplicationResult<TokenGroup> {
      const result = load(projectId);
      if (result.status === "failure") return result;
      const group = result.value.groups.find(group => group.id === groupId && group.projectId === projectId);
      if (group === undefined) return missingEntity("group", groupId);
      let renamed: TokenGroup;
      try { renamed = renameTokenGroup(group, prepareNamespaceName(localName)); }
      catch (error) { if (!(error instanceof RangeError)) throw error; return {status:"failure", error:{code:"invalid-domain-input", message:error.message}}; }
      return accept({ ...result.value, groups: result.value.groups.map(current => current.id === groupId ? renamed : current) }, renamed, result.value);
    },

    createColorToken(input: CreateColorTokenInput): ApplicationResult<Token> {
      const result = load(input.projectId);
      if (result.status === "failure") return result;
      if (result.value.tokens.some(token => token.id === input.id)) return duplicateFailure("token", input.id);
      // Catch only documented constructor input failures. Storage, validation,
      // and unexpected programmer errors are outside this catch boundary.
      let token: Token;
      try {
        if (input.type !== "color") throw new RangeError("This workflow authors color tokens only");
        if (input.layer !== undefined && input.layer !== "primitive" && input.layer !== "semantic") throw new RangeError("This workflow authors primitive or semantic tokens only");
        const value = input.value.kind === "literal" ? createColorLiteral(input.value) : createTokenReference(input.value);
        token = createToken({
          id: input.id, projectId: input.projectId, localName: prepareNamespaceName(input.localName), parentGroupId: input.parentGroupId,
          description: input.description, layer: input.layer, semanticRole: input.semanticRole, regeneration: input.regeneration,
          definition: { type: input.type, assignments: [{ condition: [], value }] },
        }, []);
      } catch (error) {
        if (!(error instanceof RangeError)) throw error;
        return { status: "failure", error: { code: "invalid-domain-input", message: error.message } };
      }
      return accept({ ...result.value, tokens: [...result.value.tokens, token] }, token, result.value);
    },

    reviseColorToken(input: ReviseColorTokenInput): ApplicationResult<Token> {
      const result = load(input.projectId);
      if (result.status === "failure") return result;
      const token = result.value.tokens.find(token => token.id === input.tokenId && token.projectId === input.projectId);
      if (token === undefined) return missingEntity("token", input.tokenId);
      let revised: Token;
      try {
        if (!canReviseColorToken(token)) {
          throw new RangeError("Color revision requires one unconditional color literal or reference on a non-component token");
        }
        if (input.value.kind !== "literal" && input.value.kind !== "token-reference") {
          throw new RangeError("Color revision requires an explicit color literal or reference");
        }
        const value = input.value.kind === "literal" ? createColorLiteral(input.value) : createTokenReference(input.value);
        // Both pure steps operate on detached data; only the final checked
        // candidate is committed, never the intermediate unassigned token.
        revised = addTokenAssignment(removeTokenAssignment(token, []), { condition: [], value }, []);
      } catch (error) {
        if (!(error instanceof RangeError)) throw error;
        return { status: "failure", error: { code: "invalid-domain-input", message: error.message } };
      }
      return accept({ ...result.value, tokens: result.value.tokens.map(current => current.id === input.tokenId ? revised : current) }, revised);
    },

    inspectToken(projectId: string, tokenId: string): ApplicationResult<TokenInspection> {
      const result = load(projectId);
      if (result.status === "failure") return result;
      const snapshot = result.value;
      const authored = snapshot.tokens.find(token => token.id === tokenId && token.projectId === projectId);
      if (authored === undefined) return missingEntity("token", tokenId);
      return { status: "ok", value: {
        authored, path: deriveTokenPath(namespaceOf(snapshot), tokenId),
        resolution: resolveToken(projectId, snapshot.tokens, tokenId, emptySelection()),
      } };
    },

    validateProject(projectId: string): ApplicationResult<ProjectValidation> {
      const result = load(projectId);
      return result.status === "failure" ? result : { status: "ok", value: validate(result.value) };
    },
  };
}

function namespaceOf(snapshot: ProjectSnapshot) {
  return { projectId: snapshot.project.id, groups: snapshot.groups, tokens: snapshot.tokens };
}

function validate(snapshot: ProjectSnapshot): ProjectValidation {
  return {
    namespaceDiagnostics: validateProjectNamespace(namespaceOf(snapshot)),
    referenceDiagnostics: validateProjectTokenReferences(snapshot.project.id, snapshot.tokens, emptySelection()),
  };
}

function duplicateFailure(entityKind: "group" | "token", entityId: string): ApplicationFailure {
  return { status: "failure", error: { code: "duplicate-identity", entityKind, entityId } };
}

function duplicateIdentity(entities: readonly { readonly id: string }[], entityKind: "group" | "token"): ApplicationFailure | undefined {
  const ids = new Set<string>();
  for (const entity of entities) {
    if (ids.has(entity.id)) return duplicateFailure(entityKind, entity.id);
    ids.add(entity.id);
  }
  return undefined;
}

function missingEntity(entityKind: "group" | "token", entityId: string): ApplicationFailure {
  return { status: "failure", error: { code: "entity-not-found", entityKind, entityId } };
}
