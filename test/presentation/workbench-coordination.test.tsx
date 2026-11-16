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
import { useProjects } from "@presentation/App/components/Projects/hooks/useProjects";
import { useProjectReadback } from "@presentation/App/components/Workbench/hooks/useProjectReadback";
import { useProjectCommands } from "@presentation/App/components/Workbench/hooks/useProjectCommands";
import { useCreationForm } from "@presentation/App/components/Workbench/components/CreationDialog/hooks/useCreationForm";
import { useBackupRestore, restoreProtectionReducer } from "@presentation/App/components/Projects/components/RestoreDialog/hooks/useBackupRestore";
import type {
  ProjectHeader,
  WorkbenchHost,
  PublicAcceptance,
} from "@hosts/browser/protocol";
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
    "@presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/hooks/useTokenEditor"
  );
  const { editComponent } = await import(
    "@presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/state/editor-session"
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
it('rejects a known naming collision before issuing a command and preserves raw creation input',async()=>{
 const data:any={project:{id:'p',name:'P'},groups:[{authored:{id:'g',projectId:'p',localName:'Straße',parentGroupId:null},path:{status:'derived',path:['Straße']}}],tokens:[]};
 const accept=vi.fn(),setError=vi.fn();
 const hook=()=>useCreationForm(header,data,null,false,undefined,'',accept,{current:undefined},setError,vi.fn(),vi.fn());
 let owner=render(hook);owner.begin('token');owner=render(hook);owner.change('name',' S T R A S S E ');owner=render(hook);
 await owner.create();owner=render(hook);
 expect(owner.name).toBe(' S T R A S S E ');expect(owner.dialog).toBe('token');expect(accept).not.toHaveBeenCalled();expect(setError).toHaveBeenLastCalledWith(expect.stringContaining('already in use'));
});


it("keeps project entry input after validation and open failure", async () => {
  const service = host(async (op) => {
    if (op === "openProject") throw Error("Reading unavailable");
    return [];
  });
  const hook = () => useProjects({ current: service }, () => service, vi.fn(), false);
  let owner = render(hook);
  const focus = vi.fn();
  owner.nameRef.current = { focus } as unknown as HTMLInputElement;
  await owner.create();
  owner = render(hook);
  expect(owner.error).toBe("A project name is required.");
  expect(focus).toHaveBeenCalledOnce();
  expect(service.call).not.toHaveBeenCalled();
  owner.setName("  Unfinished name  ");
  owner = render(hook);
  await owner.open("existing");
  owner = render(hook);
  expect(owner.name).toBe("  Unfinished name  ");
  expect(owner.error).toBe("Reading unavailable");
  expect(owner.project).toBeUndefined();
});

it("retries retained project reading without replaying creation", async () => {
  let reads = 0;
  const service = host(async (op, input) => {
    if (op === "createProject") return {
      status: "retained", receipt: { commandId: "create", result: { id: input.id } },
    };
    if (op === "openProject") {
      if (++reads === 1) throw Error("Reading unavailable");
      return header;
    }
  });
  const hook = () => useProjects({ current: service }, () => service, vi.fn(), false);
  let owner = render(hook);
  owner.setName("  Exact name  ");
  owner = render(hook);
  await owner.create();
  owner = render(hook);
  expect(owner.retainedId).not.toBeNull();
  expect(owner.name).toBe("  Exact name  ");
  await owner.create();
  owner.retryCreated();
  await Promise.resolve();
  await Promise.resolve();
  owner = render(hook);
  expect(owner.project).toEqual(header);
  expect(owner.name).toBe("");
  expect(vi.mocked(service.call).mock.calls.filter(([op]) => op === "createProject")).toHaveLength(1);
});

it("blocks unknown project creation until explicit departure fences and resets", async () => {
  const service = host(async (op) => op === "createProject"
    ? { status: "unknown", commandId: "original", reason: "Write unknown" }
    : op === "catalogue" ? [] : undefined);
  const reset = vi.fn();
  const hook = () => useProjects({ current: service }, () => service, reset, false);
  let owner = render(hook);
  owner.setName("  Keep input  ");
  owner = render(hook);
  await owner.create();
  owner = render(hook);
  await owner.create();
  expect(owner.name).toBe("  Keep input  ");
  expect(owner.unknown?.commandId).toBe("original");
  expect(vi.mocked(service.call).mock.calls.filter(([op]) => op === "createProject")).toHaveLength(1);
  owner.leaveUnknown();
  owner = render(hook);
  expect(service.fence).toHaveBeenCalledOnce();
  expect(reset).toHaveBeenCalledOnce();
  expect(owner.name).toBe("");
  expect(owner.unknown).toBeUndefined();
});

it("downloads a captured catalogue revision without opening and refreshes stale facts without retry", async () => {
  const failure = deferred<any>();
  const service = host(async (op) => {
    if (op === "backup") return failure.promise;
    if (op === "catalogue") return [{ rowKey: "p", status: "supported", id: "p", name: "P", revision: "r2", tokens: 1, groups: 0 }];
  });
  const hook = () => useProjects({ current: service }, () => service, vi.fn(), false);
  let owner = render(hook);
  const entry = { rowKey: "p", status: "supported", id: "p", name: "P", revision: "r1", tokens: 1, groups: 0 } as const;
  const download = owner.download(entry);
  await owner.download(entry);
  owner = render(hook);
  expect(owner.pending).toBe(true);
  expect(service.call).toHaveBeenCalledExactlyOnceWith("backup", { projectId: "p", revision: "r1" });
  failure.resolve(Promise.reject(Error("Revision changed")));
  await download;
  owner = render(hook);
  expect(owner.entries?.[0]).toMatchObject({ revision: "r2" });
  expect(owner.backupFeedback).toContain('"p"');
  expect(owner.backupFeedback).toContain("Revision changed");
  expect(owner.backupFeedback).toContain("fresh explicit Download");
  expect(vi.mocked(service.call).mock.calls.filter(([op]) => op === "backup")).toHaveLength(1);
  expect(vi.mocked(service.call).mock.calls.some(([op]) => op === "openProject")).toBe(false);
});
it("restore preview blocks open, create, stage and selected backup", async () => {
  const service = host(async () => undefined);
  const hook = () => useProjects({ current: service }, () => service, vi.fn(), true);
  const owner = render(hook);
  await owner.open("p"); await owner.create(); await owner.stageBackup({} as File);
  await owner.download({ rowKey: "p", status: "supported", id: "p", name: "P", revision: "r", tokens: 0, groups: 0 });
  expect(service.call).not.toHaveBeenCalled();
});

it("keeps one responsive surface state, follows pane focus, and yields to modal focus", async () => {
  const { useWorkbenchLayout } = await import("@presentation/App/components/Workbench/hooks/useWorkbenchLayout");
  const listeners = new Map<string, () => void>();
  const media = new Map<string, { matches: boolean; addEventListener: any; removeEventListener: any }>();
  vi.stubGlobal("window", { innerWidth: 1440 });
  vi.stubGlobal("matchMedia", (query: string) => {
    const value = { matches: false, addEventListener: (_: string, listener: () => void) => listeners.set(query, listener), removeEventListener: vi.fn() };
    media.set(query, value); return value;
  });
  let active: any = "editor", modal: false | "other" | "drawer" = false;
  vi.stubGlobal("document", { get activeElement() { return active; }, querySelector: () => modal ? { classList: { contains: () => modal === "drawer" } } : null });
  vi.stubGlobal("requestAnimationFrame", (callback: () => void) => callback());
  let owner = render(useWorkbenchLayout);
  owner.browse.current = { querySelector: vi.fn(), contains: (node: any) => node === "browse", focus: vi.fn() } as any;
  owner.inspector.current = { querySelector: vi.fn(), contains: (node: any) => node === "editor", focus: vi.fn() } as any;
  effects();
  media.get("(max-width:1119px)")!.matches = true;
  media.get("(max-width:879px)")!.matches = true;
  listeners.get("(max-width:879px)")!();
  owner = render(useWorkbenchLayout);
  expect(owner.narrow).toBe(true); expect(owner.surface).toBe("inspect");
  owner.back(); owner = render(useWorkbenchLayout);
  expect(owner.surface).toBe("browse");
  owner.showInspector(); owner = render(useWorkbenchLayout);
  expect(owner.surface).toBe("inspect");
  modal = "other"; active = "browse";
  listeners.get("(max-width:879px)")!(); owner = render(useWorkbenchLayout);
  expect(owner.surface).toBe("inspect");
  modal = false; owner.setInspectorExpanded(false); owner = render(useWorkbenchLayout);
  listeners.get("(max-width:879px)")!(); owner = render(useWorkbenchLayout);
  expect(owner.surface).toBe("browse"); expect(owner.inspectorExpanded).toBe(false);
  modal = "drawer"; active = { closest: () => ({}) };
  const triggerFocus = vi.fn(); owner.navigationTrigger.current = { focus: triggerFocus } as any;
  listeners.get("(max-width:879px)")!();
  expect(triggerFocus).not.toHaveBeenCalled();
});

it("disposes App restore preview before the authorized completion opens through the guarded project owner", async () => {
  const persist = vi.fn(async () => true);
  const { App } = await import("@presentation/App/App");
  const { Workbench } = await import("@presentation/App/components/Workbench/Workbench");
  vi.stubGlobal("navigator", { storage: { persisted: async () => false, persist } });
  vi.stubGlobal("addEventListener", vi.fn());
  vi.stubGlobal("removeEventListener", vi.fn());
  const preview = { project: header.project };
  const service = host(async (operation) => {
    if (operation === "catalogue") return [{ rowKey: "p", status: "supported", id: "p", name: "Project", revision: "r1", tokens: 0, groups: 0 }];
    if (operation === "stageBackup") return preview;
    if (operation === "openProject") return header;
  });
  const app = () => App({ createHost: () => service });
  let page = render(app);
  effects();
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  page = render(app); effects();
  await page.props.onBackupChange({ target: { files: [{ size: 0, arrayBuffer: async () => new ArrayBuffer(0) }], value: "selected" } });
  page = render(app); effects();
  expect(page.props.hasPreview).toBe(true);
  page.props.onOpen("p");
  expect(vi.mocked(service.call).mock.calls.some(([operation]) => operation === "openProject")).toBe(false);
  expect(persist).not.toHaveBeenCalled();
  page.props.restoreDialog.props.onOpen("p");
  page = render(app); effects();
  await Promise.resolve(); await Promise.resolve();
  page = render(app);
  expect(page.type).toBe(Workbench);
  expect(page.props.initial).toBe(header);
  expect(persist).not.toHaveBeenCalled();
  expect(vi.mocked(service.call).mock.calls.filter(([operation]) => operation === "openProject")).toHaveLength(1);
});

it.each(["retained", "unknown", "rejected"])("notifies creation retention only at confirmed %s acknowledgement, before failed readback", async status => {
  const onRetained = vi.fn(() => { throw Error("advisory failure"); });
  const accepted = { status: "retained", receipt: { commandId: "create", result: { id: "p" } } };
  const service = host(async op => {
    if (op === "createProject") return status === "retained" ? accepted : { status, reason: "Wait", commandId: "create" };
    if (op === "check") return accepted;
    if (op === "openProject") throw Error("Read failed");
  });
  const hook = () => useProjects({ current: service }, () => service, vi.fn(), false, onRetained);
  let owner = render(hook); owner.setName("P"); owner = render(hook); await owner.create();
  expect(onRetained).toHaveBeenCalledTimes(status === "retained" ? 1 : 0);
  if (status === "unknown") { owner = render(hook); await owner.check(); expect(onRetained).toHaveBeenCalledOnce(); }
  if (status !== "rejected") {
    owner = render(hook); expect(owner.unknown).toBeUndefined(); expect(owner.retainedId).not.toBeNull();
    await owner.check(); expect(onRetained).toHaveBeenCalledOnce();
  }
});

it("notifies restore retention once before consume even with unavailable readback and callback failure", async () => {
  const onRetained = vi.fn(() => { throw Error("Advisory failure"); }), onOpen = vi.fn();
  const service = host(async op => { if (op === "consume") throw Error("Consume unavailable"); });
  const hook = () => useBackupRestore({ host: service, initial: { stageId: "stage", project: { id: "p" } } as any, onOpen, onCancel: vi.fn(), onRetained });
  let owner = render(hook);
  await owner.finish({ status: "unknown", reason: "Wait", commandId: "c" }); expect(onRetained).not.toHaveBeenCalled();
  const accepted = { status: "retained", readback: "unavailable", receipt: { commandId: "c", result: { id: "p" } } } as any;
  await expect(owner.finish(accepted)).rejects.toThrow("Consume unavailable");
  expect(onRetained).toHaveBeenCalledOnce(); expect(onOpen).not.toHaveBeenCalled();
  owner = render(hook); expect(owner.retained).toBe(true); expect(owner.unknown).toBe(false);
  await expect(owner.finish(accepted)).rejects.toThrow(); expect(onRetained).toHaveBeenCalledOnce();
});
it("does not notify retention for opening existing projects or previewing a restore", async () => {
  const onRetained = vi.fn(); const service = host(async () => header);
  let hook = () => useProjects({ current: service }, () => service, vi.fn(), false, onRetained);
  await render(hook).open("p"); expect(onRetained).not.toHaveBeenCalled();
  vi.mocked(service.call).mockClear();
  runtime.cells = []; runtime.effects = [];
  render(() => useBackupRestore({ host: service, initial: { stageId: "s", project: { id: "p" } } as any, onOpen: vi.fn(), onCancel: vi.fn(), onRetained }));
  effects(); expect(onRetained).not.toHaveBeenCalled(); expect(service.call).not.toHaveBeenCalled();
});

it("App retains storage status through create-and-open/Projects and separates restore acknowledgement from Open local", async () => {
  const { App } = await import("@presentation/App/App");
  const persist = vi.fn(async () => true), persisted = vi.fn(async () => false);
  vi.stubGlobal("navigator", { storage: { persist, persisted } });
  vi.stubGlobal("addEventListener", vi.fn()); vi.stubGlobal("removeEventListener", vi.fn());
  const service = host(async (op, input) => {
    if (op === "catalogue") return [];
    if (op === "createProject") return { status: "retained", receipt: { commandId: "c", result: { id: input.id } } };
    if (op === "openProject") return header;
    if (op === "stageBackup") return { project: header.project };
  });
  const app = () => App({ createHost: () => service });
  let page = render(app); effects(); for (let i=0;i<12;i++) await Promise.resolve();
  page = render(app); expect(page.props.storageStatus).toBe("unprotected"); expect(persist).not.toHaveBeenCalled();
  page.props.onNameChange("P"); page = render(app); page.props.onCreate();
  for (let i=0;i<12;i++) await Promise.resolve();
  page = render(app); effects(); expect(persist).toHaveBeenCalledOnce();
  page.props.onProjects(); for (let i=0;i<12;i++) await Promise.resolve();
  page = render(app); effects(); expect(page.props.storageStatus).toBe("protected");
  expect(persisted).toHaveBeenCalledOnce();
  // A fresh App session makes the restore callback's wiring independently observable.
  runtime.cells = []; runtime.effects = []; persisted.mockClear(); persist.mockClear();
  page = render(app); effects(); for (let i=0;i<12;i++) await Promise.resolve();
  page = render(app);
  await page.props.onBackupChange({ target: { files: [{ size: 0, arrayBuffer: async () => new ArrayBuffer(0) }], value: "file" } });
  page = render(app); effects(); expect(persist).not.toHaveBeenCalled();
  page.props.restoreDialog.props.onRetained();
  for (let i=0;i<12;i++) await Promise.resolve(); expect(persist).toHaveBeenCalledOnce();
});

it.each(["available", "unavailable", "unknown", "rejected"])("restore %s notifies only confirmed retained acknowledgement", async outcome => {
  const onRetained = vi.fn(async () => { throw Error("Advisory rejected"); }), onOpen = vi.fn();
  const accepted = { status: "retained", readback: outcome === "unavailable" ? "unavailable" : "available", receipt: { commandId: "c", result: { id: "p" } } };
  const service = host(async op => {
    if (op === "restore") return outcome === "unknown" || outcome === "rejected" ? { status: outcome, reason: "Wait", commandId: "c" } : accepted;
    if (op === "check") return accepted;
    if (op === "refreshStage") return { stageId: "s", project: { id: "p" } };
  });
  const hook = () => useBackupRestore({ host: service, initial: { stageId: "s", project: { id: "p" } } as any, onOpen, onCancel: vi.fn(), onRetained });
  let owner = render(hook); await owner.restore(); owner = render(hook);
  expect(onRetained).toHaveBeenCalledTimes(outcome === "unknown" || outcome === "rejected" ? 0 : 1);
  if (outcome === "unknown") { expect(owner.unknown).toBe(true); await owner.checkUnknown(); expect(onRetained).toHaveBeenCalledOnce(); }
  owner = render(hook);
  expect(owner.retained).toBe(outcome !== "rejected");
  expect(onOpen).toHaveBeenCalledTimes(outcome === "available" || outcome === "unknown" ? 1 : 0);
});

it("shares the synchronous mutation gate across Apply and Undo and keeps traversal once-only through recovery", async () => {
  const issued = deferred<PublicAcceptance>();
  const service = host(async op => op === "traverse" ? issued.promise : op === "check" ? retained : undefined);
  const finish = vi.fn();
  const hook = () => useProjectCommands(service, {current:header}, {current:false}, false, async () => true, vi.fn(), vi.fn(), vi.fn());
  let owner = render(hook); owner.completion.current = finish;
  const undo = owner.traverse("undo", "step");
  expect((await owner.accept({operation:"renameGroup",projectId:"p",groupId:"g",localName:"x"})).status).toBe("rejected");
  expect((await owner.traverse("undo", "step")).status).toBe("rejected");
  issued.resolve({status:"unknown",commandId:"original",reason:"lost"}); await undo;
  owner = render(hook); await Promise.all([owner.check(), owner.check()]);
  expect(finish).toHaveBeenCalledTimes(1);
  expect(vi.mocked(service.call).mock.calls.filter(([op]) => op === "traverse")).toHaveLength(1);
  expect(vi.mocked(service.call).mock.calls.filter(([op]) => op === "check")).toHaveLength(1);
});
