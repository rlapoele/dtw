import type { Ref } from "react";
import { Button } from "@presentation/ui/button";
import { Field } from "@presentation/ui/field";
import { Input } from "@presentation/ui/input";

export function CreateProjectForm({
  name,
  disabled,
  pending,
  error,
  nameRef,
  onNameChange,
  onSubmit,
}: {
  name: string;
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
