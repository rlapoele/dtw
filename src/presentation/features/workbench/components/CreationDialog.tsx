import type { Ref } from "react";
import type { ProjectContext } from "@application/retention/projections";
import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/components/ui/dialog-content";
import { Button } from "@presentation/components/ui/button";
import { Field } from "@presentation/components/ui/field";
import { Input } from "@presentation/components/ui/input";
import { Select } from "@presentation/components/ui/select";
import { identityLabels } from "@presentation/features/workbench/readback";

/** Creation and rename rendering; App owns drafts, operations, readback and focus policy. */
export function CreationDialog({
  dialog,
  project,
  name,
  description,
  onDescriptionChange,
  parent,
  layer,
  readFailure,
  error,
  formError,
  finalFocus,
  onClose,
  onCreate,
  onRetry,
  onNameChange,
  onParentChange,
  onLayerChange,
  pending = false,
  recovery,
  guard,
  submissionBlocked,
}: {
  dialog: "token" | "group" | "rename" | null;
  project: ProjectContext | undefined;
  name: string;
  description: string;
  onDescriptionChange: (value: string) => void;
  parent: string | null;
  layer: string;
  readFailure: string;
  error: string;
  formError: Ref<HTMLParagraphElement>;
  finalFocus: () => HTMLElement | null;
  onClose: () => void;
  onCreate: () => void;
  onRetry: () => void;
  onNameChange: (value: string) => void;
  onParentChange: (value: string | null) => void;
  onLayerChange: (value: string) => void;
  pending?: boolean;
  recovery?: import("react").ReactNode;
  guard?: import("react").ReactNode;
  submissionBlocked?: string;
}) {
  const labels = identityLabels(project?.groups ?? [], [
    "Project root",
    "All tokens",
  ]);
  return (
    <Dialog.Root
      open={dialog !== null}
      onOpenChange={(o) => {
        if (!o && !pending) onClose();
      }}
    >
      <DialogContent className="dialog-popup" finalFocus={finalFocus}>
        <Dialog.Title className="dialog-title mb-2.5">
          {dialog === "token"
            ? "Create a color token"
            : dialog === "rename"
              ? "Rename group"
              : "Create a group"}
        </Dialog.Title>
        <Dialog.Description className="text-xs/normal text-muted-foreground mb-6">
          {dialog === "token"
            ? "Start with an explicit Color literal."
            : "Groups organize paths; names do not define types."}
        </Dialog.Description>
        {recovery}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCreate();
          }}
        >
          <fieldset>
            <Field>
              Name
              <Input
                readOnly={pending}
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                aria-describedby="creation-error"
              />
            </Field>
            {dialog === "token" && (
              <Field>
                Description (optional)
                <textarea
                  readOnly={pending}
                  aria-describedby="creation-error"
                  aria-invalid={!!error && error.includes("token-description")}
                  rows={2}
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  className="w-full min-w-0 rounded-md border border-border bg-background text-foreground px-2.5 py-2 text-xs/normal hover:border-control-hover resize-y"
                />
              </Field>
            )}
            {dialog !== "rename" && (
              <Field>
                {dialog === "token" ? "Group" : "Parent group"}
                <Select
                  disabled={pending}
                  value={parent === null ? "" : JSON.stringify(parent)}
                  onChange={(e) =>
                    onParentChange(
                      e.target.value === ""
                        ? null
                        : (JSON.parse(e.target.value) as string),
                    )
                  }
                >
                  <option value="">Project root</option>
                  {parent !== null &&
                    !project?.groups.some((g) => g.authored.id === parent) && (
                      <option value={JSON.stringify(parent)}>
                        Unavailable original parent · {JSON.stringify(parent)}
                      </option>
                    )}
                  {project?.groups.map((g) => (
                    <option
                      key={g.authored.id}
                      value={JSON.stringify(g.authored.id)}
                    >
                      {labels.get(g.authored.id)}
                    </option>
                  ))}
                </Select>
              </Field>
            )}
            {dialog === "token" && (
              <>
                <Field>
                  Layer
                  <Select
                    disabled={pending}
                    value={layer}
                    onChange={(e) => onLayerChange(e.target.value)}
                  >
                    <option value="">Unspecified</option>
                    <option value="primitive">Primitive</option>
                    <option value="semantic">Semantic</option>
                  </Select>
                </Field>
                <section className="creation-disclosure bg-muted border border-border text-xs/normal my-4 p-3 rounded-md">
                  <h3>Initial value</h3>
                  <p className="mt-2">
                    sRGB · Red 0 · Green 0 · Blue 0 · Alpha 1 (opaque black)
                  </p>
                  <p className="mt-2">
                    Create starts with this color. You can revise it or
                    explicitly replace it with a reference in the editor.
                  </p>
                </section>
              </>
            )}
          </fieldset>
          {readFailure && (
            <div
              className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4"
              id="dialog-read-error"
              tabIndex={-1}
              role="status"
            >
              <p>
                Project unavailable. Inputs retained; Retry reading the project
                to resume.
              </p>
              <Button onClick={onRetry}>Retry reading project</Button>
            </div>
          )}
          {error ? (
            <p
              ref={formError}
              tabIndex={-1}
              id="creation-error"
              className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4"
              role="alert"
            >
              {error}
            </p>
          ) : (
            <span id="creation-error" />
          )}
          {submissionBlocked && (
            <p role="status" className="text-caption mt-3">
              {submissionBlocked}
            </p>
          )}
          <div className="dialog-actions justify-end flex gap-2.5 mt-6">
            <Dialog.Close render={<Button disabled={pending} />}>
              Cancel
            </Dialog.Close>
            <Button
              type="submit"
              variant="default"
              disabled={!!readFailure || pending || !!submissionBlocked}
            >
              {dialog === "rename" ? "Rename group" : "Create"}
            </Button>
          </div>
        </form>
        {guard}
      </DialogContent>
    </Dialog.Root>
  );
}
