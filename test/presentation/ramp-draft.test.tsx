import { it, expect, vi, afterEach } from "vitest";
const runtime = vi.hoisted(() => ({
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
import { RampWorkbench } from "@presentation/App/components/TokensWorkbench/components/ColorRamp/RampWorkbench";
import { RampSeedFields } from "@presentation/App/components/TokensWorkbench/components/ColorRamp/RampSeedFields";
import { RampColorFields } from "@presentation/App/components/TokensWorkbench/components/ColorRamp/RampColorFields";
import { Input } from "@presentation/ui/input";
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
    onSave: async () => true,
    applyAction: { current: null },
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
  tree.find((n) => n.type === RampColorFields).props.onValidity(false);
  tree = render();
  effects();
  expect(dirty).toHaveBeenLastCalledWith(true);
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
    .find((n) => n.type === Input && n.props.value === "")
    .props.onChange({ target: { value: "Temporary description" } });
  tree = render();
  effects();
  expect(dirty).toHaveBeenLastCalledWith(true);
  tree.find((n) => n.props?.children === "Revert").props.onClick();
  render();
  effects();
  expect(dirty).toHaveBeenLastCalledWith(false);
});
