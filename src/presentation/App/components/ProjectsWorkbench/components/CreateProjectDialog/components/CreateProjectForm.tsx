import { COLOR_SPACES, type ColorSpace } from "@domain/color-literal";
import { spaceName } from "@presentation/App/helpers/color-space";
import { Select } from "@presentation/ui/select";
import type { Ref } from "react";
import { Button } from "@presentation/ui/button";
import { Field } from "@presentation/ui/field";
import { Input } from "@presentation/ui/input";

export function CreateProjectForm({
  name, description, onDescriptionChange, defaultColorSpace, onDefaultColorSpaceChange,
  disabled,
  pending,
  error,
  nameRef,
  onNameChange,
  onSubmit,
  onCancel,
  closeBlocked,
}: {
  name: string;
  description: string;
  defaultColorSpace: ColorSpace;
  onDefaultColorSpaceChange: (space: ColorSpace) => void;
  onDescriptionChange: (description: string) => void;
  disabled: boolean;
  pending: boolean;
  error: string;
  nameRef: Ref<HTMLInputElement>;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  closeBlocked: boolean;
}) {
  return (
    <form
      className="mt-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Field>
        Project name
        <Input
          ref={nameRef}
          value={name}
          disabled={disabled}
          onChange={(e) => onNameChange(e.target.value)}
          aria-describedby="project-name-error"
          aria-invalid={!!error}
        />
      </Field>
      <Field>
        Description (optional)
        <textarea
          rows={3}
          value={description}
          disabled={disabled}
          onChange={(e) => onDescriptionChange(e.target.value)}
          aria-describedby="project-name-error"
          className="w-full min-w-0 rounded-md border-2 border-input bg-background text-foreground px-2.5 py-2 text-xs/normal mobile:text-base/normal hover:border-control-hover resize-y"
        />
      </Field>
      <fieldset className="mt-5">
        <legend className="text-caption font-medium mb-3">Project preferences</legend>
        <Field>
          Default color space
          <Select disabled={disabled} value={defaultColorSpace} onChange={e => onDefaultColorSpaceChange(e.target.value as ColorSpace)} aria-describedby="project-color-space-help">
            {COLOR_SPACES.map(space => <option key={space} value={space}>{spaceName(space)}</option>)}
          </Select>
        </Field>
        <p id="project-color-space-help" className="text-caption text-muted-foreground">Starting color space for new color tokens. Existing tokens keep their own color space.</p>
      </fieldset>
      <p id="project-name-error" role="alert" className="text-destructive text-caption">{error}</p>
      <div className="dialog-actions flex justify-end gap-3 mt-6">
      <Button disabled={closeBlocked} onClick={onCancel}>Cancel</Button>
      <Button
        type="submit"
        variant="default"
        disabled={disabled}
      >
        {pending ? "Retaining project…" : "Create project"}
      </Button>
      </div>
    </form>
  );
}
