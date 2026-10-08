import type { ProjectId, ThemePresetId } from "./identifiers";
import type { VariationAxis } from "./variation-axis";
import type { AxisOptionSelectionInput } from "./variation-condition";
import type { VariationSelection } from "./variation-selection";
import {
  assertVariationAxesBelongToProject,
  createVariationSelection,
  validateVariationSelection,
} from "./variation-selection";

export type ThemePresetName = string;

export type ThemePreset = {
  readonly id: ThemePresetId;
  readonly projectId: ProjectId;
  readonly name: ThemePresetName;
  readonly description?: string;
  readonly selections: VariationSelection;
};

export type ThemePresetInput = {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly description?: string;
  readonly selections: readonly AxisOptionSelectionInput[];
};

export function createThemePreset(
  input: ThemePresetInput,
  projectAxes: readonly VariationAxis[],
): ThemePreset {
  assertVariationAxesBelongToProject(projectAxes, input.projectId);
  const selections = createVariationSelection(input.selections);
  validateVariationSelection(selections, projectAxes);

  return {
    id: input.id as ThemePresetId,
    projectId: input.projectId as ProjectId,
    name: input.name,
    ...(input.description === undefined
      ? {}
      : { description: input.description }),
    selections,
  };
}

export function renameThemePreset(
  preset: ThemePreset,
  name: string,
): ThemePreset {
  return { ...preset, name };
}

export function replaceThemePresetSelections(
  preset: ThemePreset,
  selections: readonly AxisOptionSelectionInput[],
  projectAxes: readonly VariationAxis[],
): ThemePreset {
  assertVariationAxesBelongToProject(projectAxes, preset.projectId);
  const normalizedSelections = createVariationSelection(selections);
  validateVariationSelection(normalizedSelections, projectAxes);

  return { ...preset, selections: normalizedSelections };
}
