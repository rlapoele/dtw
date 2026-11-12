import { afterEach, expect, it, vi } from "vitest";

// A small deterministic hook runner: exercises the real owners with controlled host
// promises. Browser smoke separately checks React mounts, focus and layout.
const runtime = vi.hoisted(() => ({
  cells: [] as any[],
  cursor: 0,
  effects: [] as (() => void)[],
}));
vi.mock("react", async (original) => {
  const react = await original<typeof import("react")>();
  const state = (initial: any) => {
    const index = runtime.cursor++;
    if (!runtime.cells[index])
      runtime.cells[index] = {
        value: typeof initial === "function" ? initial() : initial,
      };
    const cell = runtime.cells[index];
    cell.set ??= (value: any) => {
      cell.value = typeof value === "function" ? value(cell.value) : value;
    };
    return [cell.value, cell.set];
  };
  return {
    ...react,
    useState: state,
    useRef: (value: any) => state(() => ({ current: value }))[0],
    useReducer: (reduce: any, initial: any) => {
      const [value, set] = state(initial);
      return [
        value,
        (action: any) => set((previous: any) => reduce(previous, action)),
      ];
    },
    useMemo: (calculate: any) => calculate(),
    useEffect: (effect: any, deps: any[]) => {
      const index = runtime.cursor++;
      const previous = runtime.cells[index];
      if (
        !previous ||
        deps.some((dep, i) => !Object.is(dep, previous.deps[i]))
      ) {
        runtime.effects.push(() => {
          previous?.cleanup?.();
          runtime.cells[index] = { deps, cleanup: effect() };
        });
      }
    },
  };
});
import { useProjectReadback } from "@presentation/features/workbench/hooks/useProjectReadback";
import { useProjectCommands } from "@presentation/features/workbench/hooks/useProjectCommands";
import { useCreationForm } from "@presentation/features/workbench/hooks/useCreationForm";
import { restoreProtectionReducer } from "@presentation/features/workbench/hooks/useBackupRestore";
import type {
  ProjectHeader,
  WorkbenchHost,
  PublicAcceptance,
} from "@presentation/host/protocol";
import type { SelectedToken } from "@application/retention/projections";
function render<T>(hook: () => T) {
  runtime.cursor = 0;
  return hook();
}
function effects() {
  for (const effect of runtime.effects.splice(0)) effect();
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
const header: ProjectHeader = {
  project: { id: "p" as ProjectHeader["project"]["id"], name: "Project" },
  revision: "r1",
  incarnation: "db",
  tokens: 0,
  groups: 0,
  writable: true,
};
const context = { project: header.project, tokens: [], groups: [] };
function host(
  call: (operation: string, input: any) => Promise<any>,
): WorkbenchHost {
  return {
    call: vi.fn(call),
    fence: vi.fn(),
    dispose: vi.fn(),
  } as WorkbenchHost;
}
afterEach(() => {
  runtime.cells = [];
  runtime.cursor = 0;
  runtime.effects = [];
  vi.unstubAllGlobals();
});

it("publishes only the newest coherent revision when an older context read finishes later", async () => {
  const old = deferred<any>();
  const service = host(async (op, input) =>
    op === "context" ? (input.revision === "r1" ? old.promise : context) : [],
  );
  const hook = () => useProjectReadback(service, header, null);
  let owner = render(hook);
  const older = owner.refresh(header);
  const newer = owner.refresh({ ...header, revision: "r2" });
  expect(await newer).toBe(true);
  old.resolve({ ...context, project: { ...header.project, name: "stale" } });
  await older;
  owner = render(hook);
  expect(owner.header.revision).toBe("r2");
  expect(owner.context?.project.name).toBe("Project");
  expect(owner.complete).toBe(true);
});
it("rejects a stale selected inspection and revision-scoped lazy diagnostics", async () => {
  const inspection = deferred<any>(),
    diagnostics = deferred<any>();
  const service = host(async (op) =>
    op === "inspection"
      ? inspection.promise
      : op === "diagnostics"
        ? diagnostics.promise
        : context,
  );
  let selection: any = { kind: "token", id: "old" };
  const hook = () => useProjectReadback(service, header, selection);
  let owner = render(hook);
  const pending = owner.inspect("old");
  const loading = owner.loadDiagnostics(vi.fn());
  selection = { kind: "group", id: "group" };
  owner = render(hook);
  owner.select(selection);
  owner.invalidate();
  inspection.resolve({ token: { id: "old" } });
  diagnostics.resolve({ items: ["stale"], total: 1, complete: true });
  await Promise.all([pending, loading]);
  owner = render(hook);
  expect(owner.inspection).toBeUndefined();
  expect(owner.diagnostics).toBeUndefined();
});
it("teardown fences an outstanding project refresh", async () => {
  const waiting = deferred<any>();
  const service = host(async () => waiting.promise);
  const hook = () => useProjectReadback(service, header, null);
  let owner = render(hook);
  const read = owner.refresh(header);
  owner.invalidate();
  waiting.resolve(context);
  await read;
  owner = render(hook);
  expect(owner.context).toBeUndefined();
});
const retained = {
  status: "retained",
  revision: "r2",
  readback: "available",
  receipt: { commandId: "command", result: { entityKind: "token", id: "t" } },
} as PublicAcceptance;
it("blocks duplicate issue, keeps unavailable readback distinct, and consumes completion once without replay", async () => {
  const issue = deferred<PublicAcceptance>();
  const service = host(async (op) =>
    op === "command" ? issue.promise : undefined,
  );
  const refresh = vi.fn().mockResolvedValueOnce(false).mockResolvedValue(true),
    finish = vi.fn();
  const hook = () =>
    useProjectCommands(
      service,
      { current: header },
      { current: false },
      false,
      refresh,
      vi.fn(),
      vi.fn(),
      vi.fn(),
    );
  let owner = render(hook);
  owner.completion.current = finish;
  const issued = owner.accept({
    operation: "renameGroup",
    projectId: "p",
    groupId: "g",
    localName: "name",
  });
  expect(
    (
      await owner.accept({
        operation: "renameGroup",
        projectId: "p",
        groupId: "g",
        localName: "duplicate",
      })
    ).status,
  ).toBe("rejected");
  issue.resolve(retained);
  expect(await issued).toMatchObject({
    status: "retained",
    readback: "unavailable",
  });
  owner = render(hook);
  expect(owner.retainedPending?.status).toBe("retained");
  expect(finish).not.toHaveBeenCalled();
  await owner.retryReading();
  owner = render(hook);
  await owner.retryReading();
  expect(finish).toHaveBeenCalledTimes(1);
  expect(
    vi
      .mocked(service.call)
      .mock.calls.filter(([op]: any[]) => op === "command"),
  ).toHaveLength(1);
});
it("checks the original unknown outcome and completes once after coherent readback", async () => {
  const service = host(async (op) =>
    op === "command"
      ? { status: "unknown", commandId: "original", reason: "lost" }
      : op === "check"
        ? retained
        : undefined,
  );
  const finish = vi.fn();
  const hook = () =>
    useProjectCommands(
      service,
      { current: header },
      { current: false },
      false,
      async () => true,
      vi.fn(),
      vi.fn(),
      vi.fn(),
    );
  let owner = render(hook);
  owner.completion.current = finish;
  await owner.accept({
    operation: "renameGroup",
    projectId: "p",
    groupId: "g",
    localName: "x",
  });
  owner = render(hook);
  expect(owner.unknown?.commandId).toBe("original");
  await owner.check();
  owner = render(hook);
  await owner.check();
  expect(finish).toHaveBeenCalledTimes(1);
  expect(
    vi
      .mocked(service.call)
      .mock.calls.filter(([op]: any[]) => op === "command"),
  ).toHaveLength(1);
});
it("preserves exact creation input and blocks a missing original parent after baseline review", async () => {
  let current = header;
  let data: any = {
    ...context,
    groups: [{ authored: { id: "g", localName: "Group" }, path: [] }],
  };
  const accept = vi.fn();
  const hook = () =>
    useCreationForm(
      current,
      data,
      "g",
      false,
      undefined,
      "",
      accept,
      { current: undefined },
      vi.fn(),
      vi.fn(),
      vi.fn(),
    );
  let owner = render(hook);
  owner.begin("token");
  owner = render(hook);
  owner.change("name", "  exact name  ");
  owner.change("description", "raw\ntext");

  current = { ...header, revision: "r2" };
  data = { ...context };
  owner = render(hook);
  owner.review();
  owner = render(hook);
  await owner.create();
  expect(owner.name).toBe("  exact name  ");
  expect(owner.description).toBe("raw\ntext");
  expect(owner.parent).toBe("g");
  expect(accept).not.toHaveBeenCalled();
});
it("invalidates replacement acknowledgement whenever protected revision changes", () => {
  let state = restoreProtectionReducer(
    { protection: "r1", acknowledgement: true },
    { type: "protect", revision: "r2" },
  );
  expect(state).toEqual({ protection: "r2", acknowledgement: false });
  state = restoreProtectionReducer(state, { type: "protect", revision: null });
  expect(
    restoreProtectionReducer(state, { type: "acknowledge", value: true }),
  ).toEqual({ protection: null, acknowledgement: false });
});

it("preserves dirty raw editor channels across baseline refresh and resets only on Cancel", async () => {
  const { useTokenEditor } = await import(
    "@presentation/features/workbench/hooks/useTokenEditor"
  );
  const { editComponent } = await import(
    "@presentation/features/workbench/state/session"
  );
  const { createColorLiteral } = await import("@domain/color-literal");
  let revision = "r1";
  const literal = createColorLiteral({
    colorSpace: "srgb",
    components: ["0.1", "0.2", "0.3"],
    alpha: "1",
  });
  let inspection: any = {
    token: {
      id: "t",
      localName: "Token",
      authoring: { regeneration: "allowed" },
      definition: { type: "color" },
    },
    editable: true,
    authoredValue: literal,
    resolution: {
      status: "unresolved",
      reason: "test",
      trace: [],
      diagnostics: [],
    },
  };
  const hook = () =>
    useTokenEditor({
      inspection,
      project: context as any,
      inspect: () => undefined,
      onApply: vi.fn(),
      onDirty: vi.fn(),
      readUnavailable: false,
      revision,
    });
  let owner = render(hook);
  effects();
  owner = render(hook);
  owner.setSession(editComponent(owner.session, 0, "-"));
  owner = render(hook);
  effects();
  revision = "r2";
  inspection = {
    ...inspection,
    authoredValue: createColorLiteral({
      colorSpace: "srgb",
      components: ["0.8", "0.2", "0.3"],
      alpha: "1",
    }),
  };
  owner = render(hook);
  effects();
  owner = render(hook);
  expect(owner.session.literal.components[0]).toBe("-");
  expect(owner.dirty).toBe(true);
  expect(owner.recovery?.reviewed).toBe(false);
  owner.cancel();
  owner = render(hook);
  expect(owner.session.literal.components[0]).toBe("0.8");
  expect(owner.dirty).toBe(false);
  expect(owner.recovery).toBeUndefined();
});
