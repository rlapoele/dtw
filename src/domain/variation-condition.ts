import type {
  VariationAxisId,
  VariationOptionId,
} from "./identifiers";

export type AxisOptionSelection = {
  readonly axisId: VariationAxisId;
  readonly optionId: VariationOptionId;
};

export type AxisOptionSelectionInput = {
  readonly axisId: string;
  readonly optionId: string;
};

declare const variationConditionBrand: unique symbol;

export type VariationCondition = readonly AxisOptionSelection[] & {
  readonly [variationConditionBrand]: "VariationCondition";
};

export function createVariationCondition(
  selections: readonly AxisOptionSelectionInput[],
): VariationCondition {
  const normalized = selections
    .map(createAxisOptionSelection)
    .sort(compareSelectionsByAxisId);

  for (let index = 1; index < normalized.length; index += 1) {
    if (normalized[index - 1].axisId === normalized[index].axisId) {
      throw new RangeError(
        "A variation condition cannot select an axis more than once",
      );
    }
  }

  return normalized as unknown as VariationCondition;
}

export function variationConditionSpecificity(
  condition: VariationCondition,
): number {
  return condition.length;
}

export function areVariationConditionsEqual(
  left: VariationCondition,
  right: VariationCondition,
): boolean {
  return (
    left.length === right.length &&
    left.every(
      (selection, index) =>
        selection.axisId === right[index].axisId &&
        selection.optionId === right[index].optionId,
    )
  );
}

function createAxisOptionSelection(
  input: AxisOptionSelectionInput,
): AxisOptionSelection {
  return {
    axisId: input.axisId as VariationAxisId,
    optionId: input.optionId as VariationOptionId,
  };
}

function compareSelectionsByAxisId(
  left: AxisOptionSelection,
  right: AxisOptionSelection,
): number {
  if (left.axisId === right.axisId) {
    return 0;
  }

  return left.axisId < right.axisId ? -1 : 1;
}
