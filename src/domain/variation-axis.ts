import type {
  ProjectId,
  VariationAxisId,
  VariationOptionId,
} from "./identifiers";

export type VariationAxisName = string;
export type VariationOptionName = string;

export type VariationOption = {
  readonly id: VariationOptionId;
  readonly name: VariationOptionName;
  readonly description?: string;
};

export type VariationAxis = {
  readonly id: VariationAxisId;
  readonly projectId: ProjectId;
  readonly name: VariationAxisName;
  readonly description?: string;
  readonly options: readonly VariationOption[];
  readonly defaultOptionId: VariationOptionId;
};

export type VariationOptionInput = {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
};

export type VariationAxisInput = {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly description?: string;
  readonly options: readonly VariationOptionInput[];
  readonly defaultOptionId: string;
};

export function createVariationAxis(input: VariationAxisInput): VariationAxis {
  if (input.options.length === 0) {
    throw new RangeError("A variation axis requires at least one option");
  }

  assertUniqueOptionIds(input.options);

  if (!input.options.some((option) => option.id === input.defaultOptionId)) {
    throw new RangeError("The default option must belong to the variation axis");
  }

  return {
    id: input.id as VariationAxisId,
    projectId: input.projectId as ProjectId,
    name: input.name,
    ...(input.description === undefined
      ? {}
      : { description: input.description }),
    options: input.options.map(createVariationOption),
    defaultOptionId: input.defaultOptionId as VariationOptionId,
  };
}

export function renameVariationAxis(
  axis: VariationAxis,
  name: string,
): VariationAxis {
  return { ...axis, name };
}

export function renameVariationOption(
  axis: VariationAxis,
  optionId: string,
  name: string,
): VariationAxis {
  assertOwnsOption(axis, optionId);

  return {
    ...axis,
    options: axis.options.map((option) =>
      option.id === optionId ? { ...option, name } : option,
    ),
  };
}

export function addVariationOption(
  axis: VariationAxis,
  option: VariationOptionInput,
): VariationAxis {
  if (ownsOption(axis, option.id)) {
    throw new RangeError("The variation option identity is already owned");
  }

  return {
    ...axis,
    options: [...axis.options, createVariationOption(option)],
  };
}

export function changeDefaultVariationOption(
  axis: VariationAxis,
  optionId: string,
): VariationAxis {
  assertOwnsOption(axis, optionId);

  return {
    ...axis,
    defaultOptionId: optionId as VariationOptionId,
  };
}

function createVariationOption(input: VariationOptionInput): VariationOption {
  return {
    id: input.id as VariationOptionId,
    name: input.name,
    ...(input.description === undefined
      ? {}
      : { description: input.description }),
  };
}

function assertUniqueOptionIds(options: readonly VariationOptionInput[]): void {
  const optionIds = new Set<string>();

  for (const option of options) {
    if (optionIds.has(option.id)) {
      throw new RangeError("Variation option identities must be unique");
    }

    optionIds.add(option.id);
  }
}

function assertOwnsOption(axis: VariationAxis, optionId: string): void {
  if (!ownsOption(axis, optionId)) {
    throw new RangeError("The variation option does not belong to the axis");
  }
}

function ownsOption(axis: VariationAxis, optionId: string): boolean {
  return axis.options.some((option) => option.id === optionId);
}
