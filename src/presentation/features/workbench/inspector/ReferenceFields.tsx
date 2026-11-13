import { Field } from "@presentation/components/ui/field";
import { Select } from "@presentation/components/ui/select";

export function ReferenceFields({
  reference,
  choices,
  missingTarget,
  disabled,
  onReferenceChange,
}: {
  reference: string | null;
  choices: readonly { id: string; label: string }[];
  missingTarget: boolean;
  disabled: boolean;
  onReferenceChange: (reference: string | null) => void;
}) {
  return (
    <>
      <Field>
        Target token
        <Select
          value={reference === null ? "" : JSON.stringify(reference)}
          disabled={disabled}
          aria-describedby="reference-note editor-error"
          onChange={(event) =>
            onReferenceChange(
              event.target.value === ""
                ? null
                : (JSON.parse(event.target.value) as string),
            )
          }
        >
          <option value="">Choose a color token…</option>
          {reference !== null && missingTarget && (
            <option value={JSON.stringify(reference)}>Missing target</option>
          )}
          {choices.map(({ id, label }) => (
            <option key={id} value={JSON.stringify(id)}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
      <p
        id="reference-note"
        className="helper text-muted-foreground font-normal"
      >
        Uses the selected token’s whole color value. References stay linked;
        cycles are rejected on Apply.
      </p>
    </>
  );
}
