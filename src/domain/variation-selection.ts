import type { VariationAxis } from "./variation-axis";
import type {
  AxisOptionSelection,
  AxisOptionSelectionInput,
} from "./variation-condition";
import { createVariationCondition } from "./variation-condition";

declare const variationSelectionBrand: unique symbol;
declare const completeVariationSelectionBrand: unique symbol;

export type VariationSelection = readonly AxisOptionSelection[] & {
  readonly [variationSelectionBrand]: "VariationSelection";
};

export type CompleteVariationSelection = VariationSelection & {
  readonly [completeVariationSelectionBrand]: "CompleteVariationSelection";
};

export function createVariationSelection(
  selections: readonly AxisOptionSelectionInput[],
): VariationSelection {
  return [
    ...createVariationCondition(selections),
  ] as unknown as VariationSelection;
}

export function validateVariationSelection(
  selection: readonly AxisOptionSelection[],
  axes: readonly VariationAxis[],
): void {
  const axisById = indexAxesById(axes);

  for (const { axisId, optionId } of selection) {
    const axis = axisById.get(axisId);

    if (axis === undefined) {
      throw new RangeError("The variation selection references an unknown axis");
    }

    if (!axis.options.some((option) => option.id === optionId)) {
      throw new RangeError(
        "The selected variation option does not belong to its stated axis",
      );
    }
  }
}

export function completeVariationSelection(
  axes: readonly VariationAxis[],
  presetSelections: VariationSelection,
  explicitSelections: VariationSelection,
): CompleteVariationSelection {
  assertAxesShareOneProject(axes);
  const normalizedPresetSelections = createVariationSelection(presetSelections);
  const normalizedExplicitSelections =
    createVariationSelection(explicitSelections);

  validateVariationSelection(normalizedPresetSelections, axes);
  validateVariationSelection(normalizedExplicitSelections, axes);

  const completedByAxis = new Map<string, string>();

  for (const axis of axes) {
    completedByAxis.set(axis.id, axis.defaultOptionId);
  }

  for (const { axisId, optionId } of normalizedPresetSelections) {
    completedByAxis.set(axisId, optionId);
  }

  for (const { axisId, optionId } of normalizedExplicitSelections) {
    completedByAxis.set(axisId, optionId);
  }

  return createVariationSelection(
    [...completedByAxis].map(([axisId, optionId]) => ({ axisId, optionId })),
  ) as CompleteVariationSelection;
}

export function assertVariationAxesBelongToProject(
  axes: readonly VariationAxis[],
  projectId: string,
): void {
  indexAxesById(axes);

  if (axes.some((axis) => axis.projectId !== projectId)) {
    throw new RangeError("Variation axes must belong to the same project");
  }
}

function indexAxesById(
  axes: readonly VariationAxis[],
): ReadonlyMap<string, VariationAxis> {
  const axisById = new Map<string, VariationAxis>();
  const optionOwnerById = new Map<string, string>();

  for (const axis of axes) {
    if (axisById.has(axis.id)) {
      throw new RangeError("Variation axis identities must be unique");
    }

    axisById.set(axis.id, axis);

    for (const option of axis.options) {
      const existingOwnerId = optionOwnerById.get(option.id);

      if (existingOwnerId !== undefined && existingOwnerId !== axis.id) {
        throw new RangeError(
          "A variation option identity cannot belong to more than one axis",
        );
      }

      optionOwnerById.set(option.id, axis.id);
    }
  }

  return axisById;
}

function assertAxesShareOneProject(axes: readonly VariationAxis[]): void {
  if (axes.length > 0) {
    assertVariationAxesBelongToProject(axes, axes[0].projectId);
  } else {
    indexAxesById(axes);
  }
}
