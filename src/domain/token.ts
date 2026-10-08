import type { ColorLiteralValue } from "./color-literal";
import type {
  ComponentDefinitionId,
  ProjectId,
  TokenGroupId,
  TokenId,
} from "./identifiers";
import type {
  DimensionLiteralValue,
  NumberLiteralValue,
} from "./numeric-literals";
import type { VariationAxis } from "./variation-axis";
import type {
  AxisOptionSelectionInput,
  VariationCondition,
} from "./variation-condition";
import {
  areVariationConditionsEqual,
  createVariationCondition,
} from "./variation-condition";
import {
  assertVariationAxesBelongToProject,
  validateVariationSelection,
} from "./variation-selection";

export const TOKEN_TYPES = [
  "color",
  "number",
  "dimension",
  "percentage",
  "angle",
  "duration",
  "string",
  "boolean",
  "fontFamily",
  "fontWeight",
  "cubicBezier",
  "typography",
  "shadow",
  "gradient",
  "border",
  "transition",
] as const;

export const TOKEN_LAYERS = ["primitive", "semantic", "component"] as const;

export const REGENERATION_POLICIES = ["allowed", "protected"] as const;

export const TOKEN_DEFINITION_STATES = [
  "name-only",
  "typed-unassigned",
  "authored",
] as const;

export type TokenType = (typeof TOKEN_TYPES)[number];
export type TokenLayer = (typeof TOKEN_LAYERS)[number];
export type RegenerationPolicy = (typeof REGENERATION_POLICIES)[number];
export type TokenDefinitionState = (typeof TOKEN_DEFINITION_STATES)[number];
export type TokenName = string;
export type SemanticRoleKey = string;

export type ImplementedLiteralValue =
  | ColorLiteralValue
  | DimensionLiteralValue
  | NumberLiteralValue;

export type TokenValueAssignment = {
  readonly condition: VariationCondition;
  readonly value: ImplementedLiteralValue;
};

export type TokenDefinition = {
  readonly type: TokenType;
  readonly assignments: readonly TokenValueAssignment[];
};

export type Token = {
  readonly id: TokenId;
  readonly projectId: ProjectId;
  readonly localName: TokenName;
  readonly parentGroupId: TokenGroupId | null;
  readonly description?: string;
  readonly layer?: TokenLayer;
  readonly semanticRole?: SemanticRoleKey;
  readonly componentDefinitionId?: ComponentDefinitionId;
  readonly definition?: TokenDefinition;
  readonly authoring: {
    readonly regeneration: RegenerationPolicy;
  };
};

export type TokenValueAssignmentInput = {
  readonly condition: readonly AxisOptionSelectionInput[];
  readonly value: ImplementedLiteralValue;
};

export type TokenDefinitionInput = {
  readonly type: string;
  readonly assignments: readonly TokenValueAssignmentInput[];
};

export type TokenInput = {
  readonly id: string;
  readonly projectId: string;
  readonly localName: string;
  readonly parentGroupId: string | null;
  readonly description?: string;
  readonly layer?: string;
  readonly semanticRole?: string;
  readonly componentDefinitionId?: string;
  readonly definition?: TokenDefinitionInput;
  readonly regeneration: string;
};

const tokenTypeSet: ReadonlySet<string> = new Set(TOKEN_TYPES);
const tokenLayerSet: ReadonlySet<string> = new Set(TOKEN_LAYERS);
const regenerationPolicySet: ReadonlySet<string> = new Set(
  REGENERATION_POLICIES,
);

export function createToken(
  input: TokenInput,
  projectAxes: readonly VariationAxis[],
): Token {
  assertVariationAxesBelongToProject(projectAxes, input.projectId);

  if (input.layer !== undefined && !isTokenLayer(input.layer)) {
    throw new RangeError("Unsupported token layer");
  }

  if (!isRegenerationPolicy(input.regeneration)) {
    throw new RangeError("Unsupported regeneration policy");
  }

  assertComponentAssociation(input.layer, input.componentDefinitionId);

  const definition =
    input.definition === undefined
      ? undefined
      : createTokenDefinition(input.definition, projectAxes);

  return {
    id: input.id as TokenId,
    projectId: input.projectId as ProjectId,
    localName: input.localName,
    parentGroupId:
      input.parentGroupId === null
        ? null
        : (input.parentGroupId as TokenGroupId),
    ...(input.description === undefined
      ? {}
      : { description: input.description }),
    ...(input.layer === undefined ? {} : { layer: input.layer }),
    ...(input.semanticRole === undefined
      ? {}
      : { semanticRole: input.semanticRole }),
    ...(input.componentDefinitionId === undefined
      ? {}
      : {
          componentDefinitionId:
            input.componentDefinitionId as ComponentDefinitionId,
        }),
    ...(definition === undefined ? {} : { definition }),
    authoring: { regeneration: input.regeneration },
  };
}

export function renameToken(token: Token, localName: string): Token {
  return { ...token, localName };
}

export function defineToken(token: Token, type: string): Token {
  if (!isTokenType(type)) {
    throw new RangeError("Unsupported token type");
  }

  if (token.definition !== undefined) {
    throw new RangeError("The token already has a definition");
  }

  return {
    ...token,
    definition: { type, assignments: [] },
  };
}

export function addTokenAssignment(
  token: Token,
  input: TokenValueAssignmentInput,
  projectAxes: readonly VariationAxis[],
): Token {
  if (token.definition === undefined) {
    throw new RangeError("A name-only token cannot own assignments");
  }

  assertVariationAxesBelongToProject(projectAxes, token.projectId);
  const assignment = createTokenAssignment(
    input,
    token.definition.type,
    projectAxes,
  );
  assertConditionIsUnique(token.definition.assignments, assignment.condition);

  return {
    ...token,
    definition: {
      ...token.definition,
      assignments: [...token.definition.assignments, assignment],
    },
  };
}

export function removeTokenAssignment(
  token: Token,
  condition: readonly AxisOptionSelectionInput[],
): Token {
  if (token.definition === undefined) {
    throw new RangeError("A name-only token cannot own assignments");
  }

  const normalizedCondition = createVariationCondition(condition);
  const remainingAssignments = token.definition.assignments.filter(
    (assignment) =>
      !areVariationConditionsEqual(
        assignment.condition,
        normalizedCondition,
      ),
  );

  if (remainingAssignments.length === token.definition.assignments.length) {
    throw new RangeError("The token does not own that assignment condition");
  }

  return {
    ...token,
    definition: {
      ...token.definition,
      assignments: remainingAssignments,
    },
  };
}

export function changeTokenType(token: Token, type: string): Token {
  if (!isTokenType(type)) {
    throw new RangeError("Unsupported token type");
  }

  if (token.definition === undefined) {
    throw new RangeError("A name-only token has no type to change");
  }

  if (token.definition.assignments.length > 0) {
    throw new RangeError(
      "A token type cannot change while assignments would be reinterpreted",
    );
  }

  return {
    ...token,
    definition: { type, assignments: [] },
  };
}

export function removeTokenDefinition(token: Token): Token {
  const { definition: _definition, ...nameOnlyToken } = token;

  return nameOnlyToken;
}

export function deriveTokenDefinitionState(
  token: Token,
): TokenDefinitionState {
  if (token.definition === undefined) {
    return "name-only";
  }

  return token.definition.assignments.length === 0
    ? "typed-unassigned"
    : "authored";
}

function createTokenDefinition(
  input: TokenDefinitionInput,
  projectAxes: readonly VariationAxis[],
): TokenDefinition {
  if (!isTokenType(input.type)) {
    throw new RangeError("Unsupported token type");
  }

  const tokenType = input.type;
  const assignments = input.assignments.map((assignment) =>
    createTokenAssignment(assignment, tokenType, projectAxes),
  );

  for (let index = 0; index < assignments.length; index += 1) {
    assertConditionIsUnique(
      assignments.slice(0, index),
      assignments[index].condition,
    );
  }

  return { type: tokenType, assignments };
}

function createTokenAssignment(
  input: TokenValueAssignmentInput,
  tokenType: TokenType,
  projectAxes: readonly VariationAxis[],
): TokenValueAssignment {
  if (input.value.valueType !== tokenType) {
    throw new RangeError(
      "The authored value is incompatible with the token type",
    );
  }

  const condition = createVariationCondition(input.condition);
  validateVariationSelection(condition, projectAxes);

  return { condition, value: input.value };
}

function assertConditionIsUnique(
  assignments: readonly TokenValueAssignment[],
  condition: VariationCondition,
): void {
  if (
    assignments.some((assignment) =>
      areVariationConditionsEqual(assignment.condition, condition),
    )
  ) {
    throw new RangeError(
      "A token cannot own duplicate normalized assignment conditions",
    );
  }
}

function assertComponentAssociation(
  layer: string | undefined,
  componentDefinitionId: string | undefined,
): void {
  const hasComponentDefinition = componentDefinitionId !== undefined;

  if (
    (layer === "component" && !hasComponentDefinition) ||
    (layer !== "component" && hasComponentDefinition)
  ) {
    throw new RangeError(
      "A component token requires both its layer and component definition",
    );
  }
}

function isTokenType(value: string): value is TokenType {
  return tokenTypeSet.has(value);
}

function isTokenLayer(value: string): value is TokenLayer {
  return tokenLayerSet.has(value);
}

function isRegenerationPolicy(value: string): value is RegenerationPolicy {
  return regenerationPolicySet.has(value);
}
