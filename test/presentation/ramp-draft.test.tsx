import { it, expect, vi, afterEach } from "vitest";
const runtime = vi.hoisted(() => ({
  conversionUnavailable: false,
  cells: [] as any[],
  cursor: 0,
  effects: [] as (() => void)[],
}));
vi.mock("react", async (original) => {
  const react = await original<typeof import("react")>();
  const state = (initial: any) => {
    const index = runtime.cursor++;
    const cell = (runtime.cells[index] ??= {
      value: typeof initial === "function" ? initial() : initial,
    });
    return [
      cell.value,
      (next: any) => {
        cell.value = typeof next === "function" ? next(cell.value) : next;
      },
    ];
  };
  return {
    ...react,
    useState: state,
    useId: () => state("ramp-seed-error")[0],
    useRef: (value: any) => state(() => ({ current: value }))[0],
    useEffect: (effect: any, deps?: any[]) => {
      const i = runtime.cursor++,
        old = runtime.cells[i];
      if (!old || !deps || deps.some((x, j) => !Object.is(x, old.deps[j])))
        runtime.effects.push(() => {
          old?.cleanup?.();
          runtime.cells[i] = { deps, cleanup: effect() };
        });
    },
  };
});
vi.mock("react-dom", async (original) => ({
  ...(await original<typeof import("react-dom")>()),
  createPortal: (children: any) => children,
}));
vi.mock("@domain/color-calculation", async (original) => {
  const actual = await original<typeof import("@domain/color-calculation")>();
  return {
    ...actual,
    convertColor: (...args: Parameters<typeof actual.convertColor>) => runtime.conversionUnavailable
      ? { ok: false, reason: "calculation-guard" }
      : actual.convertColor(...args),
  };
});
import { colorDecimalDisplay } from "@presentation/App/components/TokensWorkbench/helpers/color-decimal-display";
import { AuthoringDialog } from "@presentation/App/components/TokensWorkbench/components/AuthoringDialog/AuthoringDialog";
import { RampCreation } from "@presentation/App/components/TokensWorkbench/components/AuthoringDialog/components/RampCreation";
import { RampPreview } from "@presentation/App/components/TokensWorkbench/components/RampPreview";
import { Input } from "@presentation/ui/input";
import { Button } from "@presentation/ui/button";
import { RampWorkbench } from "@presentation/App/components/TokensWorkbench/components/RampWorkbench/RampWorkbench";
import { RampSeedFields } from "@presentation/App/components/TokensWorkbench/components/RampSeedFields";
import { ColorLiteralFields } from "@presentation/App/components/TokensWorkbench/components/ColorLiteralFields";
import { Select } from "@presentation/ui/select";
import { createRampCandidate } from "@application/color-ramp-authoring";
import { createProject } from "@domain/project";
import { createColorLiteral } from "@domain/color-literal";
import { autoRampPosition, rampLabels } from "@domain/color-ramp";
function nodes(root: any): any[] {
  if (!root || typeof root !== "object") return [];
  if (Array.isArray(root)) return root.flatMap(nodes);
  return [root, ...nodes(root.props?.children)];
}
function effects() {
  for (const run of runtime.effects.splice(0)) run();
}
afterEach(() => {
  runtime.conversionUnavailable = false;
  runtime.cells = [];
  runtime.cursor = 0;
  runtime.effects = [];
});
it("guards invalid-first step/seed edits, remounts discarded seed state and fully reverts an absent saved description", async () => {
  const seed = createColorLiteral({
    colorSpace: "srgb",
    components: ["0.2", "0.4", "0.8"],
    alpha: "1",
  });
  const snapshot = createRampCandidate(
    { project: createProject({ id: "p", name: "P" }), groups: [], tokens: [] },
    {
      projectId: "p",
      group: {
        id: "g",
        projectId: "p",
        localName: "brand",
        parentGroupId: null,
      },
      settings: {
        seed,
        targetGamut: "srgb",
        recipe: { id: "single-seed-oklch", version: 1, intensity: "retained" },
        seedPosition: { mode: "auto", label: autoRampPosition(seed, 6) },
      },
      members: rampLabels(6).map((label) => ({ label, id: "t" + label })),
    },
  );
  const dirty = vi.fn(),
    host = { call: async () => snapshot } as any;
  const props = {
    host,
    header: {
      project: snapshot.project,
      revision: "r1",
      incarnation: "db",
      writable: true,
      tokens: 6,
      groups: 1,
    },
    groupId: "g",
    inspector: {} as HTMLElement,
    panel: { current: null },
    hidden: false,
    disabled: false,
    onDirty: dirty,
    onSave: vi.fn(async () => true),
    applyAction: { current: null as (() => Promise<boolean>) | null },
    onRename: () => {},
    onInspect: () => {},
  };
  const render = () => {
    runtime.cursor = 0;
    return nodes(RampWorkbench(props));
  };
  render();
  effects();
  await Promise.resolve();
  let tree = render();
  effects();
  expect(dirty).toHaveBeenLastCalledWith(false);
  expect(tree.find(n => n.props?.children === "Apply ramp changes").props.disabled).toBe(true);
  expect(tree.find(n => n.props?.children === "Discard draft").props.disabled).toBe(true);
  expect(await props.applyAction.current?.()).toBe(true);
  expect(props.onSave).not.toHaveBeenCalled();
  const keys = tree.filter(n => n.type === ColorLiteralFields).map(n => n.key);
  tree.find(n => n.props?.children === "50" && n.props.onClick).props.onClick();
  tree = render(); effects();
  expect(tree.filter(n => n.type === ColorLiteralFields).map(n => n.key)).toEqual(keys);
  const viewSelects = tree.filter(n => n.type === Select);
  viewSelects.find(n => n.props.value === "checkerboard").props.onChange({ target: { value: "dark" } });
  viewSelects.find(n => n.props.value === "oklch" && n.props.onChange).props.onChange({ target: { value: "srgb" } });
  tree = render(); effects();
  expect(dirty).toHaveBeenLastCalledWith(false);
  expect(tree.find(n => n.props?.children === "Discard draft").props.disabled).toBe(true);
  const sliders = tree.filter(n => n.type === "input" && n.props.type === "range");
  expect(sliders).toHaveLength(18);
  expect(tree.filter(n => n.type === "th" && n.props.scope === "row")).toHaveLength(3);
  expect(sliders.every(n => /^\d+ .+/.test(n.props["aria-label"]))).toBe(true);
  const readouts = tree.filter(n => n.type === "span" && n.props.className === "max-w-24 truncate");
  expect(readouts).toHaveLength(18);
  expect(readouts.every(n => n.props.children === colorDecimalDisplay(n.props.title))).toBe(true);
  runtime.conversionUnavailable = true;
  const unavailable = render();
  expect(unavailable.filter(n => n.type === "input" && n.props.type === "range")).toHaveLength(0);
  expect(unavailable.filter(n => n.type === "td" && n.props.children === "Unavailable")).toHaveLength(18);
  effects();
  expect(dirty).toHaveBeenLastCalledWith(false);
  runtime.conversionUnavailable = false;
  tree = render();

  tree.find((n) => n.type === ColorLiteralFields).props.onValidity(false);
  tree = render();
  effects();
  expect(dirty).toHaveBeenLastCalledWith(true);
  expect(tree.find(n => n.props?.children === "Apply ramp changes").props.disabled).toBe(true);
  expect(tree.find(n => n.props?.children === "Discard draft").props.disabled).toBe(false);
  expect(await props.applyAction.current?.()).toBe(false);
  expect(props.onSave).not.toHaveBeenCalled();
  const seedKey = tree.find((n) => n.type === RampSeedFields).key;
  tree.find((n) => n.props?.children === "Discard draft").props.onClick();
  tree = render();
  effects();
  expect(dirty).toHaveBeenLastCalledWith(false);
  expect(tree.find((n) => n.type === RampSeedFields).key).not.toBe(seedKey);
  tree.find((n) => n.type === RampSeedFields).props.onValidity(false);
  tree = render();
  effects();
  expect(dirty).toHaveBeenLastCalledWith(true);
  tree.find((n) => n.props?.children === "Discard draft").props.onClick();
  tree = render();
  effects();
  tree
    .find((n) => n.type === "textarea" && n.props.value === "")
    .props.onChange({ target: { value: "Temporary description" } });
  tree = render();
  effects();
  expect(dirty).toHaveBeenLastCalledWith(true);
  tree.find((n) => n.props?.children === "Revert").props.onClick();
  render();
  effects();
  expect(dirty).toHaveBeenLastCalledWith(false);
});


it("keeps two-stage creation draft, guards combined inputs, and creates only deliberately from review", () => {
  const create = vi.fn();
  const props = {
    defaultSpace: "srgb" as const, path: "brand", identity: "Group identity",
    identityReady: false, feedback: "Shared recovery", disabled: false, pending: false,
    onCancel: vi.fn(), onCreate: create,
  };
  function render() { runtime.cursor = 0; return RampCreation(props); }
  function text(root: any): string {
    if (typeof root === "string" || typeof root === "number") return String(root);
    if (Array.isArray(root)) return root.map(text).join("");
    return root?.props ? text(root.props.children) : "";
  }
  function button(root: any, label: string) { return nodes(root).find(n => n.type === Button && text(n) === label); }
  function countField(root: any) { return nodes(root).find(n => n.type === Input && n.props.type === "number"); }
  let root = render();
  expect(nodes(root).find(n => n.type === RampSeedFields).props.disabled).toBe(true);
  expect(button(root, "Review ramp").props.disabled).toBe(true);
  props.identityReady = true;
  root = render();
  countField(root).props.onChange({target:{value:"6"}});
  root = render();
  nodes(root).find(n => n.type === Input && n.props.type !== "number").props.onChange({target:{value:"Seed description"}});
  root = render();
  root.props.onSubmit({preventDefault:vi.fn()});
  expect(create).not.toHaveBeenCalled();
  root = render();
  expect(button(root,"Create color ramp")).toBeDefined();
  root.props.onSubmit({preventDefault:vi.fn()});
  expect(create).not.toHaveBeenCalled();
  button(root,"Back").props.onClick();
  root = render();
  expect(countField(root).props.value).toBe("6");
  expect(nodes(root).find(n => n.type === Input && n.props.type !== "number").props.value).toBe("Seed description");
  props.identityReady = false;
  root = render();
  expect(countField(root).props.value).toBe("6");
  expect(nodes(root).find(n => n.type === RampSeedFields).props.disabled).toBe(true);
  props.identityReady = true;
  root = render();
  countField(root).props.onChange({target:{value:""}});
  root = render();
  expect(button(root,"Use Auto position").props.disabled).toBe(true);
  expect(button(root,"Review ramp").props.disabled).toBe(true);
  expect(nodes(root).filter(n => n.type === RampPreview)).toHaveLength(0);
  expect(() => button(root,"Use Auto position").props.onClick()).not.toThrow();
  countField(root).props.onChange({target:{value:"6"}});
  root = render();
  nodes(root).find(n => n.type === RampSeedFields).props.onValidity(false);
  root = render();
  expect(button(root,"Review ramp").props.disabled).toBe(true);
  expect(nodes(root).filter(n => n.type === RampPreview)).toHaveLength(0);
  nodes(root).find(n => n.type === RampSeedFields).props.onValidity(true);
  root = render();
  root.props.onSubmit({preventDefault:vi.fn()});
  props.disabled = true;
  root = render();
  expect(button(root,"Create color ramp").props.disabled).toBe(true);
  button(root,"Create color ramp").props.onClick();
  expect(create).not.toHaveBeenCalled();
  expect(text(root)).toContain("Shared recovery");
  props.disabled = false;
  root = render();
  button(root,"Create color ramp").props.onClick();
  expect(create).toHaveBeenCalledOnce();
  expect(create.mock.calls[0][0]).toMatchObject({count:6,seedDescription:"Seed description"});
});


it("routes checked group creation directly to Configure and gates missing parents and collisions", () => {
  const submit = vi.fn(), create = vi.fn();
  const props = {
    open: true,
    form: {kind: "group" as const, name: "", parent: null as string | null, onNameChange: vi.fn(), onParentChange: vi.fn()},
    project: {project:createProject({id:"p",name:"Project"}),groups:[],tokens:[]} as any,
    readFailure:"",error:"",formError:{current:null},finalFocus:()=>null,
    onClose:vi.fn(),onSubmit:submit,onCreateRamp:create,onRetry:vi.fn(),
  };
  function render() { runtime.cursor=0; return AuthoringDialog(props); }
  let root=render();
  expect(nodes(root).some(n=>n.type===RampCreation)).toBe(false);
  nodes(root).find(n=>n.type==="form").props.onSubmit({preventDefault:vi.fn()});
  expect(submit).toHaveBeenCalledOnce();
  nodes(root).find(n=>n.type==="input" && n.props.type==="checkbox").props.onChange({target:{checked:true}});
  root=render();
  let ramp=nodes(root).find(n=>n.type===RampCreation);
  expect(ramp.props.identityReady).toBe(false);
  expect(nodes(root).some(n=>n.type==="form")).toBe(false);
  props.form.name="brand";
  root=render();
  expect(nodes(root).find(n=>n.type===RampCreation).props.identityReady).toBe(true);
  props.form.parent="missing";
  root=render();
  expect(nodes(root).find(n=>n.type===RampCreation).props.identityReady).toBe(false);
  props.form.parent=null;
  props.project.groups=[{authored:{id:"g",projectId:"p",parentGroupId:null,localName:"brand"},path:["brand"]}];
  root=render();
  ramp=nodes(root).find(n=>n.type===RampCreation);
  expect(ramp.props.identityReady).toBe(false);
  nodes(ramp.props.identity).find(n=>n.type==="input" && n.props.type==="checkbox").props.onChange({target:{checked:false}});
  root=render();
  expect(nodes(root).some(n=>n.type===RampCreation)).toBe(false);
  expect(props.form.name).toBe("brand");
  expect(create).not.toHaveBeenCalled();
  expect(submit).toHaveBeenCalledOnce();
});


it("recalculates Auto after Advanced Cancel or valid seed recovery following count edits, preserving manual requests", () => {
  const props = {
    defaultSpace: "srgb" as const, path: "brand", identity: null,
    identityReady: true, feedback: null, disabled: false, pending: false,
    onCancel: vi.fn(), onCreate: vi.fn(),
  };
  function render() { runtime.cursor = 0; return nodes(RampCreation(props)); }
  const seedFields = (tree: any[]) => tree.find(n => n.type === RampSeedFields);
  const countField = (tree: any[]) => tree.find(n => n.type === Input && n.props.type === "number");
  const position = (tree: any[]) => tree.find(n => n.type === Select && n.props["aria-describedby"]);
  let tree = render();
  countField(tree).props.onChange({target:{value:"20"}});
  tree = render();
  expect(position(tree).props.value).toBe("579");
  seedFields(tree).props.onValidity(false); // Advanced opens.
  tree = render();
  countField(tree).props.onChange({target:{value:"6"}});
  tree = render();
  seedFields(tree).props.onValidity(true); // Advanced Cancel restores accepted seed.
  tree = render();
  expect(position(tree).props.value).toBe("600");
  expect(tree.find(n => n.props?.children === "Review ramp").props.disabled).toBe(false);
  seedFields(tree).props.onValidity(false);
  tree = render();
  countField(tree).props.onChange({target:{value:"11"}});
  tree = render();
  const white = createColorLiteral({colorSpace:"srgb",components:["1","1","1"],alpha:"1"});
  // Use color / corrected HEX emits the new seed and validity in one event.
  seedFields(tree).props.onChange(white, "srgb");
  seedFields(tree).props.onValidity(true);
  tree = render();
  expect(position(tree).props.value).toBe("50");
  position(tree).props.onChange({target:{value:"500"}});
  tree = render();
  seedFields(tree).props.onValidity(false);
  tree = render();
  countField(tree).props.onChange({target:{value:"6"}});
  tree = render();
  seedFields(tree).props.onValidity(true);
  tree = render();
  expect(position(tree).props.value).toBe("500");
  expect(tree.find(n => n.props?.children === "Review ramp").props.disabled).toBe(true);
});
