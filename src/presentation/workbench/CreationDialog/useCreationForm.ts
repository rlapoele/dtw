import { namingPreview } from "./naming-preview";
import { useEffect, useReducer } from "react";
import type { MutableRefObject } from "react";
import type { ProjectContext } from "@application/retention/projections";
import type { AuthoringCommand } from "@application/retention/ports";
import type {
  ProjectHeader,
  PublicAcceptance,
} from "@presentation/host/protocol";
export type CreationState = {
  dialog: "token" | "group" | "rename" | null;
  name: string;
  description: string;
  parent: string | null;
  layer: string;
  formDirty: boolean;
  formBaseline?: { revision: string; target: string | null; name: string };
  formReviewed: boolean;
};
export type CreationAction =
  | {
      type: "open";
      kind: NonNullable<CreationState["dialog"]>;
      revision: string;
      group: string | null;
      name: string;
    }
  | { type: "change"; patch: Partial<CreationState> };
export const emptyCreation: CreationState = {
  dialog: null,
  name: "",
  description: "",
  parent: null,
  layer: "",
  formDirty: false,
  formReviewed: false,
};
export function creationReducer(
  state: CreationState,
  action: CreationAction,
): CreationState {
  if (action.type === "open")
    return {
      ...emptyCreation,
      dialog: action.kind,
      name: action.name,
      parent: action.group,
      formBaseline: {
        revision: action.revision,
        target: action.group,
        name: action.name,
      },
    };
  return { ...state, ...action.patch };
}
export function useCreationForm(
  header: ProjectHeader,
  context: ProjectContext | undefined,
  group: string | null,
  busy: boolean,
  unknown: unknown,
  readFailure: string,
  accept: (command: AuthoringCommand) => Promise<PublicAcceptance>,
  completion: MutableRefObject<(() => void) | undefined>,
  setError: (message: string) => void,
  setNotice: (message: string) => void,
  onCreated: (kind: NonNullable<CreationState["dialog"]>, id: string) => void,
) {
  const [state, dispatch] = useReducer(creationReducer, emptyCreation);
  const {
    dialog,
    name,
    description,
    parent,
    layer,
    formDirty,
    formBaseline,
    formReviewed,
  } = state;
  const setDialog = (value: CreationState["dialog"]) =>
    dispatch({ type: "change", patch: { dialog: value } });
  const setName = (value: string) =>
    dispatch({ type: "change", patch: { name: value } });
  const setDescription = (value: string) =>
    dispatch({ type: "change", patch: { description: value } });
  const setParent = (value: string | null) =>
    dispatch({ type: "change", patch: { parent: value } });
  const setLayer = (value: string) =>
    dispatch({ type: "change", patch: { layer: value } });
  const setFormDirty = (value: boolean) =>
    dispatch({ type: "change", patch: { formDirty: value } });
  const setFormReviewed = (value: boolean) =>
    dispatch({ type: "change", patch: { formReviewed: value } });
  useEffect(() => setFormReviewed(false), [header.revision]);
  function begin(kind: NonNullable<CreationState["dialog"]>) {
    dispatch({
      type: "open",
      kind,
      revision: header.revision,
      group,
      name:
        kind === "rename"
          ? (context?.groups.find((g) => g.authored.id === group)?.authored
              .localName ?? "")
          : "",
    });
    setError("");
  }
  async function create() {
    if (
      !dialog ||
      busy ||
      unknown ||
      !header.writable ||
      readFailure ||
      (formBaseline?.revision !== header.revision && !formReviewed)
    )
      return;
    if (
      (dialog === "rename" &&
        !context?.groups.some((g) => g.authored.id === formBaseline?.target)) ||
      (dialog !== "rename" &&
        parent !== null &&
        !context?.groups.some((g) => g.authored.id === parent))
    ) {
      setError(
        "Original target or parent no longer exists. Input is preserved; mutation is blocked without retargeting or recreation.",
      );
      return;
    }
    const preview = namingPreview(
      context,
      dialog,
      name,
      parent,
      formBaseline?.target,
    );
    if (preview.error || preview.collisions.length > 0) {
      setError(
        preview.error ??
          "Name is already in use. Choose a different name or parent; conflicting paths and exact identities are listed above.",
      );
      return;
    }
    const id = crypto.randomUUID();
    const command: AuthoringCommand =
      dialog === "rename"
        ? {
            operation: "renameGroup",
            projectId: header.project.id,
            groupId: formBaseline!.target!,
            localName: name,
          }
        : dialog === "group"
          ? {
              operation: "createGroup",
              input: {
                id,
                projectId: header.project.id,
                localName: name,
                parentGroupId: parent,
              },
            }
          : {
              operation: "createColorToken",
              input: {
                id,
                projectId: header.project.id,
                localName: name,
                parentGroupId: parent,
                type: "color",
                regeneration: "allowed",
                ...(description === "" ? {} : { description }),
                ...(layer ? { layer: layer as "primitive" | "semantic" } : {}),
                value: {
                  kind: "literal",
                  colorSpace: "srgb",
                  components: ["0", "0", "0"],
                  alpha: "1",
                },
              },
            };
    const kind = dialog;
    completion.current = () => {
      setDialog(null);
      setFormDirty(false);
      setDescription("");
      setError("");
      setNotice(
        kind === "rename"
          ? "Group renamed. Identities and references retained."
          : `${kind === "token" ? "Color token" : "Group"} created and retained.`,
      );
      onCreated(kind, id);
    };
    const result = await accept(command);
    if (result.status === "retained" && result.readback === "available") {
      const finish = completion.current;
      completion.current = undefined;
      finish?.();
    }
  }

  function change(
    field: "name" | "description" | "parent" | "layer",
    value: string | null,
  ) {
    dispatch({ type: "change", patch: { [field]: value, formDirty: true } });
  }
  function close() {
    dispatch({ type: "change", patch: { dialog: null, formDirty: false } });
  }
  function discard() {
    setFormDirty(false);
  }
  function review() {
    setFormReviewed(true);
  }
  return { ...state, begin, create, change, close, discard, review };
}
