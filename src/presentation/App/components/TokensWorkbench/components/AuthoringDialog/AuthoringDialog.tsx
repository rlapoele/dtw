import {useState,useEffect,useRef} from "react";
import {effectiveDefaultColorSpace} from "@domain/project";
import {RampCreation,type RampCreationValue} from "@presentation/App/components/TokensWorkbench/components/AuthoringDialog/components/RampCreation";
import type { ColorSpace } from "@domain/color-literal";
import { COLOR_COMPONENTS, COMPONENT_NAMES } from "@domain/color-components";
import { spaceName } from "@presentation/App/helpers/color-space";
import { namingPreview } from "@presentation/App/components/TokensWorkbench/components/AuthoringDialog/helpers/naming-preview";
import type { Ref } from "react";
import type { ProjectContext } from "@application/retention/projections";
import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/ui/dialog-content";
import { Button } from "@presentation/ui/button";
import { Field } from "@presentation/ui/field";
import { Input } from "@presentation/ui/input";
import { Select } from "@presentation/ui/select";
import { identityLabels } from "@presentation/App/components/TokensWorkbench/helpers/identity-labels";

type NamedForm = {
  name: string;
  onNameChange: (value: string) => void;
};

type CreationParent = {
  parent: string | null;
  onParentChange: (value: string | null) => void;
};

export type AuthoringForm = NamedForm & (
  | (CreationParent & {
      kind: "token";
      defaultColorSpace: ColorSpace;
      description: string;
      onDescriptionChange: (value: string) => void;
      layer: string;
      onLayerChange: (value: string) => void;
    })
  | (CreationParent & { kind: "group" })
  | {
      kind: "rename";
      // Missing original identities remain explicit recovery inputs.
      target: string | null | undefined;
    }
);

/** Creation and rename rendering; TokensWorkbench owns draft, command and focus coordination. */
export function AuthoringDialog({
  open,
  form,
  project,
  readFailure,
  error,
  formError,
  finalFocus,
  onClose,
  onSubmit,
  onCreateRamp,
  onRetry,
  pending = false,
  recovery,
  guard,
  submissionBlocked,
}: {
  open: boolean;
  form: AuthoringForm;
  project: ProjectContext | undefined;
  readFailure: string;
  error: string;
  formError: Ref<HTMLParagraphElement>;
  finalFocus: () => HTMLElement | null;
  onClose: () => void;
  onSubmit: () => void;
  onCreateRamp: (value:RampCreationValue)=>void;
  onRetry: () => void;
  pending?: boolean;
  recovery?: import("react").ReactNode;
  guard?: import("react").ReactNode;
  submissionBlocked?: string;
}) {
  const nameField = useRef<HTMLInputElement>(null), returningToName = useRef(false);
  useEffect(() => { if (!rampOpen && returningToName.current) { nameField.current?.focus(); returningToName.current=false; } });
  const [generate,setGenerate]=useState(false),[rampOpen,setRampOpen]=useState(false);
  useEffect(()=>{if(!open){setGenerate(false);setRampOpen(false);}},[open]);
  const preview = namingPreview(
    project,
    open ? form.kind : null,
    form.name,
    form.kind === "rename" ? null : form.parent,
    form.kind === "rename" ? form.target : undefined,
  );
  const labels = identityLabels(project?.groups ?? [], [
    "Project root",
    "All tokens",
  ]);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o && !pending) onClose();
      }}
    >
      <DialogContent
        className="dialog-popup flex flex-col"
        finalFocus={finalFocus}
      >
        <Dialog.Title className="dialog-title mb-2.5">
          {form.kind === "token"
            ? "Create a color token"
            : form.kind === "rename"
              ? "Rename group"
              : "Create a group"}
        </Dialog.Title>
        <Dialog.Description className="text-xs/normal text-muted-foreground mb-6">
          {form.kind === "token"
            ? `Create a color token with an opaque black ${spaceName(form.defaultColorSpace)} value.`
            : "Groups organize paths; names do not define types."}
        </Dialog.Description>
        {recovery}
        {form.kind==="group"&&generate&&<div hidden={!rampOpen}><RampCreation active={rampOpen} defaultSpace={project?effectiveDefaultColorSpace(project.project):"srgb"} path={preview.path?.join(" / ")??form.name} disabled={pending||!!submissionBlocked||!!readFailure} onBack={()=>{returningToName.current=true;setRampOpen(false);}} onCancel={onClose} onCreate={onCreateRamp}/></div>}
        <form hidden={rampOpen}
          className="min-h-0 overflow-auto p-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            if(form.kind==="group"&&generate&&!preview.error&&!preview.collisions.length)setRampOpen(true);else onSubmit();
          }}
        >
          <fieldset>
            {form.kind==="group"&&<label className="flex gap-2 mb-4"><input type="checkbox" checked={generate} onChange={e=>setGenerate(e.target.checked)}/>Generate a color ramp</label>}
            <Field>
              Name
              <Input
                ref={nameField}
                readOnly={pending}
                value={form.name}
                onChange={(e) => form.onNameChange(e.target.value)}
                aria-describedby="name-preview creation-error"
                aria-invalid={!!error || undefined}
              />
            </Field>
            {form.kind === "token" && (
              <Field>
                Description (optional)
                <textarea
                  readOnly={pending}
                  aria-describedby="creation-error"
                  aria-invalid={!!error && error.includes("token-description")}
                  rows={2}
                  value={form.description}
                  onChange={(e) => form.onDescriptionChange(e.target.value)}
                  className="w-full min-w-0 rounded-md border-2 border-input bg-background text-foreground px-2.5 py-2 text-xs/normal mobile:text-base/normal hover:border-control-hover resize-y"
                />
              </Field>
            )}
            {form.kind !== "rename" && (
              <Field>
                {form.kind === "token" ? "Group" : "Parent group"}
                <Select
                  disabled={pending}
                  value={form.parent === null ? "" : JSON.stringify(form.parent)}
                  onChange={(e) =>
                    form.onParentChange(
                      e.target.value === ""
                        ? null
                        : (JSON.parse(e.target.value) as string),
                    )
                  }
                >
                  <option value="">Project root</option>
                  {form.parent !== null &&
                    !project?.groups.some((g) => g.authored.id === form.parent) && (
                      <option value={JSON.stringify(form.parent)}>
                        Unavailable original parent · {JSON.stringify(form.parent)}
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
            <section
              id="name-preview"
              className="border-hairline border-border bg-muted rounded-md p-3 text-caption mb-4 wrap-anywhere"
              aria-live="polite"
            >
              <h3>Name to save</h3>
              <p className="font-medium whitespace-pre-wrap">
                {preview.name ?? "No usable name"}
              </p>
              <p className="mt-2">
                {preview.path
                  ? `Path: ${preview.path.join(" / ")}`
                  : !preview.name
                    ? "No valid path yet."
                    : "Path unavailable · original parent is preserved."}
              </p>
              {preview.error && <p>{preview.error}</p>}
              {preview.collisions.length > 0 && (
                <>
                  <h3 className="mt-3">Path already in use</h3>
                  <p>
                    Choose a different name or parent. Rename also checks
                    descendant paths.
                  </p>
                  <ul className="mt-2 space-y-2">
                    {preview.collisions.flatMap((collision, index) =>
                      collision.members
                        .filter((member) => member.id !== preview.previewId)
                        .map((member) => (
                          <li
                            key={JSON.stringify([
                              index,
                              member.kind,
                              member.id,
                            ])}
                          >
                            <strong>
                              {member.kind === "group"
                                ? "Group"
                                : `${project?.tokens.find((t) => t.authored.id === member.id)?.authored.definition?.type ?? "Unassigned"} token`}{" "}
                              · {member.path.join(" / ")}
                            </strong>
                            <span className="block">
                              Identity: {JSON.stringify(member.id)}
                            </span>
                            <span className="block">
                              Parent:{" "}
                              {(() => {
                                const entry =
                                  member.kind === "group"
                                    ? project?.groups.find(
                                        (g) => g.authored.id === member.id,
                                      )
                                    : project?.tokens.find(
                                        (t) => t.authored.id === member.id,
                                      );
                                return entry?.authored.parentGroupId === null
                                  ? "Project root"
                                  : JSON.stringify(
                                      entry?.authored.parentGroupId,
                                    );
                              })()}
                            </span>
                          </li>
                        )),
                    )}
                  </ul>
                </>
              )}
            </section>
            {form.kind === "token" && (
              <>
                <Field>
                  Layer
                  <Select
                    disabled={pending}
                    value={form.layer}
                    onChange={(e) => form.onLayerChange(e.target.value)}
                  >
                    <option value="">Unspecified</option>
                    <option value="primitive">Primitive</option>
                    <option value="semantic">Semantic</option>
                  </Select>
                </Field>
                <section className="creation-disclosure bg-muted border-hairline border-border text-xs/normal my-4 p-3 rounded-md">
                  <h3>Initial value</h3>
                  <p className="mt-2">
                    {spaceName(form.defaultColorSpace)} · {COLOR_COMPONENTS[form.defaultColorSpace].map(identity => `${COMPONENT_NAMES[identity]} 0`).join(" · ")} · Alpha 1 (opaque black)
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
              className="notification notification-warning text-caption mt-4"
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
              className="notification notification-error text-caption mt-4"
              role="alert"
            >
              {error}
            </p>
          ) : (
            <span id="creation-error" />
          )}
          {submissionBlocked && (
            <p role="status" className="notification notification-warning text-caption mt-3">
              {submissionBlocked}
            </p>
          )}
          <div className="dialog-actions sticky bottom-0 bg-background justify-end flex gap-2.5 mt-4 py-3">
            <Dialog.Close render={<Button disabled={pending} />}>
              Cancel
            </Dialog.Close>
            <Button
              type="submit"
              variant="default"
              disabled={!!readFailure || pending || !!submissionBlocked}
            >
              {form.kind === "rename" ? "Rename group" : generate&&form.kind==="group"?"Continue":"Create"}
            </Button>
          </div>
        </form>
        {guard}
      </DialogContent>
    </Dialog.Root>
  );
}
