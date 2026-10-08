import type {
  AxisOptionSelection,
  VariationCondition,
} from "./variation-condition";
import { variationConditionSpecificity } from "./variation-condition";
import type { CompleteVariationSelection } from "./variation-selection";

export type AssignmentMatch<TAssignment> =
  | {
      readonly status: "matched";
      readonly assignment: TAssignment;
      readonly specificity: number;
    }
  | { readonly status: "missing" }
  | {
      readonly status: "ambiguous";
      readonly candidates: readonly TAssignment[];
      readonly specificity: number;
    };

export function selectMostSpecificAssignment<
  TAssignment extends { readonly condition: VariationCondition },
>(
  assignments: readonly TAssignment[],
  selection: CompleteVariationSelection,
): AssignmentMatch<TAssignment> {
  const activeOptionsByAxis = new Map(
    selection.map(({ axisId, optionId }) => [axisId, optionId]),
  );
  let greatestSpecificity = -1;
  let candidates: TAssignment[] = [];

  for (const assignment of assignments) {
    if (!conditionMatches(assignment.condition, activeOptionsByAxis)) {
      continue;
    }

    const specificity = variationConditionSpecificity(assignment.condition);

    if (specificity > greatestSpecificity) {
      greatestSpecificity = specificity;
      candidates = [assignment];
    } else if (specificity === greatestSpecificity) {
      candidates.push(assignment);
    }
  }

  if (candidates.length === 0) {
    return { status: "missing" };
  }

  if (candidates.length === 1) {
    return {
      status: "matched",
      assignment: candidates[0],
      specificity: greatestSpecificity,
    };
  }

  return {
    status: "ambiguous",
    candidates,
    specificity: greatestSpecificity,
  };
}

function conditionMatches(
  condition: VariationCondition,
  activeOptionsByAxis: ReadonlyMap<string, string>,
): boolean {
  return condition.every(selectionMatches(activeOptionsByAxis));
}

function selectionMatches(
  activeOptionsByAxis: ReadonlyMap<string, string>,
): (selection: AxisOptionSelection) => boolean {
  return ({ axisId, optionId }) =>
    activeOptionsByAxis.get(axisId) === optionId;
}
