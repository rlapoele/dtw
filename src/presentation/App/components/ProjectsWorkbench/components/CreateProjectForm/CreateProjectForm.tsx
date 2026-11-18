import type { Ref } from "react";
import { Button } from "@presentation/ui/button";
import { Field } from "@presentation/ui/field";
import { Input } from "@presentation/ui/input";

export function CreateProjectForm({
  name, description, onDescriptionChange,
  disabled,
  pending,
  error,
  nameRef,
  onNameChange,
  onSubmit,
}: {
  name: string;
  description: string;
  onDescriptionChange: (description: string) => void;
  disabled: boolean;
  pending: boolean;
  error: string;
  nameRef: Ref<HTMLInputElement>;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className="mt-8 border-t-hairline border-border pt-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="mb-4">New project</h2>
      <Field>
        Project name
        <Input
          ref={nameRef}
          value={name}
          disabled={disabled}
          onChange={(e) => onNameChange(e.target.value)}
          aria-describedby="project-error"
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
          aria-describedby="project-error"
          className="w-full min-w-0 rounded-md border-hairline border-input bg-background text-foreground px-2.5 py-2 text-xs/normal small:text-base/normal hover:border-control-hover resize-y"
        />
      </Field>
      <Button
        type="submit"
        variant="default"
        disabled={disabled}
      >
        {pending ? "Retaining project…" : "Create project"}
      </Button>
    </form>
  );
}
