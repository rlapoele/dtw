import { afterEach, expect, it, vi } from "vitest";

const outcomes = vi.hoisted(() => ({ publish: vi.fn(), clear: vi.fn(), recover: vi.fn((_message: string, finish?: () => void) => finish?.()) }));
vi.mock("@presentation/App/components/OutcomeFeedback/OutcomeFeedback", () => ({ useOutcomeFeedback: () => outcomes, OutcomeFeedback: ({children}: any) => children }));

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
        !previous || !deps ||
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
import { useProjects } from "@presentation/App/components/ProjectsWorkbench/hooks/useProjects";
import { useProjectReadback } from "@presentation/App/components/TokensWorkbench/hooks/useProjectReadback";
import { useProjectCommands } from "@presentation/App/components/TokensWorkbench/hooks/useProjectCommands";
import { useAuthoringForm } from "@presentation/App/components/TokensWorkbench/components/AuthoringDialog/hooks/useAuthoringForm";
import { useBackupRestore, restoreProtectionReducer } from "@presentation/App/components/ProjectsWorkbench/components/RestoreDialog/hooks/useBackupRestore";
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
  outcomes.publish.mockClear(); outcomes.clear.mockClear(); outcomes.recover.mockClear();
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
  expect(outcomes.publish).not.toHaveBeenCalled();
  expect(outcomes.recover).not.toHaveBeenCalled();
  expect(finish).not.toHaveBeenCalled();
  await owner.retryReading();
  owner = render(hook);
  await owner.retryReading();
  expect(finish).toHaveBeenCalledTimes(1);
  expect(outcomes.recover).toHaveBeenCalledTimes(1);
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
  expect(outcomes.recover).toHaveBeenCalledTimes(1);
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
    useAuthoringForm(
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

it("preserves editor drafts through intentional actions and baseline review, resetting only on Cancel", async () => {
  const { useTokenEditor } = await import(
    "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor"
  );
  const { editComponent } = await import(
    "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/state/editor-session"
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
  const originalSession = owner.session;
  owner.reportColorError("Conversion unavailable");
  owner = render(hook);
  expect(owner.error).toBe("Conversion unavailable");
  owner.changeMode("reference");
  owner = render(hook);
  expect(owner.session).toEqual({ ...originalSession, mode: "reference" });
  expect(owner.error).toBe("");
  expect(owner.dirty).toBe(false);
  owner.reportColorError("Choose a target");
  owner = render(hook);
  owner.changeReference("other-token");
  owner = render(hook);
  expect(owner.session.reference).toBe("other-token");
  expect(owner.session.literal).toEqual(originalSession.literal);
  expect(owner.dirty).toBe(true);
  expect(owner.error).toBe("");
  owner.changeMode("literal");
  owner = render(hook);
  owner.reportColorError("Incomplete component");
  owner = render(hook);
  owner.changeColorDraft(editComponent(owner.session, 0, "-"));
  owner = render(hook);
  expect(owner.error).toBe("");
  expect(owner.session.reference).toBe("other-token");
  const preservedDraft = owner.session;
  owner.selectTab("resolved");
  owner = render(hook);
  expect(owner.tab).toBe("resolved");
  expect(owner.session).toBe(preservedDraft);
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
  const frame = vi.fn();
  vi.stubGlobal("requestAnimationFrame", frame);
  const focus = vi.fn();
  owner.reviewHeading.current = { focus } as unknown as HTMLHeadingElement;
  const preservedRecovery = owner.recovery;
  owner.reviewRecovery();
  owner = render(hook);
  expect(owner.recovery).toEqual({ ...preservedRecovery, reviewed: true });
  expect(owner.session).toBe(preservedDraft);
  expect(focus).not.toHaveBeenCalled();
  expect(frame).toHaveBeenCalledOnce();
  frame.mock.calls[0][0]();
  expect(focus).toHaveBeenCalledOnce();
  owner.cancel();
  owner = render(hook);
  expect(owner.session.literal.components[0]).toBe("0.8");
  expect(owner.dirty).toBe(false);
  expect(owner.recovery).toBeUndefined();
});
it('rejects a known naming collision before issuing a command and preserves raw creation input',async()=>{
 const data:any={project:{id:'p',name:'P'},groups:[{authored:{id:'g',projectId:'p',localName:'Straße',parentGroupId:null},path:{status:'derived',path:['Straße']}}],tokens:[]};
 const accept=vi.fn(),setError=vi.fn();
 const hook=()=>useAuthoringForm(header,data,null,false,undefined,'',accept,{current:undefined},setError,vi.fn(),vi.fn());
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
  expect(owner.nameError).toBe("A project name is required.");
  expect(focus).toHaveBeenCalledOnce();
  expect(service.call).not.toHaveBeenCalled();
  owner.changeName("  Unfinished name  ");
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
  owner.changeName("  Exact name  "); owner.changeDefaultColorSpace("display-p3");
  owner = render(hook);
  await owner.create();
  owner = render(hook);
  expect(owner.retainedId).not.toBeNull();
  expect(outcomes.publish).not.toHaveBeenCalled();
  expect(owner.name).toBe("  Exact name  "); expect(owner.defaultColorSpace).toBe("display-p3");
  await owner.create();
  owner.retryCreated();
  await Promise.resolve();
  await Promise.resolve();
  owner = render(hook);
  expect(owner.project).toEqual(header);
  expect(outcomes.publish).toHaveBeenCalledExactlyOnceWith("Project “Project” retained in this browser.");
  expect(owner.name).toBe(""); expect(owner.defaultColorSpace).toBe("oklch");
  expect(vi.mocked(service.call).mock.calls.filter(([op]) => op === "createProject")).toHaveLength(1);
});

it("blocks unknown project creation until explicit departure fences and resets", async () => {
  const service = host(async (op) => op === "createProject"
    ? { status: "unknown", commandId: "original", reason: "Write unknown" }
    : op === "catalogue" ? [] : undefined);
  const reset = vi.fn();
  const hook = () => useProjects({ current: service }, () => service, reset, false);
  let owner = render(hook);
  owner.changeName("  Keep input  ");
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
  const { useTokensLayout } = await import("@presentation/App/components/TokensWorkbench/hooks/useTokensLayout");
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
  let owner = render(useTokensLayout);
  owner.browse.current = { querySelector: vi.fn(), contains: (node: any) => node === "browse", focus: vi.fn() } as any;
  owner.inspector.current = { querySelector: vi.fn(), contains: (node: any) => node === "editor", focus: vi.fn() } as any;
  effects();
  media.get("(width < 1120px)")!.matches = true;
  media.get("(width < 880px)")!.matches = true;
  listeners.get("(width < 880px)")!();
  owner = render(useTokensLayout);
  expect(owner.narrow).toBe(true); expect(owner.surface).toBe("inspect");
  owner.back(); owner = render(useTokensLayout);
  expect(owner.surface).toBe("browse");
  owner.showInspector(); owner = render(useTokensLayout);
  expect(owner.surface).toBe("inspect");
  modal = "other"; active = "browse";
  listeners.get("(width < 880px)")!(); owner = render(useTokensLayout);
  expect(owner.surface).toBe("inspect");
  modal = false; owner.setInspectorExpanded(false); owner = render(useTokensLayout);
  listeners.get("(width < 880px)")!(); owner = render(useTokensLayout);
  expect(owner.surface).toBe("browse"); expect(owner.inspectorExpanded).toBe(false);
  modal = "drawer"; active = { closest: () => ({}) };
  const triggerFocus = vi.fn(); owner.navigationTrigger.current = { focus: triggerFocus } as any;
  listeners.get("(width < 880px)")!();
  expect(triggerFocus).not.toHaveBeenCalled();
});

it("disposes App restore preview before the authorized completion opens through the guarded project owner", async () => {
  const persist = vi.fn(async () => true);
  const { App } = await import("@presentation/App/App");
  const { TokensWorkbench } = await import("@presentation/App/components/TokensWorkbench/TokensWorkbench");
  vi.stubGlobal("navigator", { storage: { persisted: async () => false, persist } });
  vi.stubGlobal("addEventListener", vi.fn());
  vi.stubGlobal("removeEventListener", vi.fn());
  const preview = { project: header.project };
  const service = host(async (operation) => {
    if (operation === "catalogue") return [{ rowKey: "p", status: "supported", id: "p", name: "Project", revision: "r1", tokens: 0, groups: 0 }];
    if (operation === "stageBackup") return preview;
    if (operation === "openProject") return header;
  });
  const app = () => { const wrapper = App({ createHost: () => service }); return wrapper.props.children.type(wrapper.props.children.props); };
  let page = render(app);
  effects();
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  page = render(app); effects();
  page.props.backup.onSelectFile();
  page = render(app);
  expect(page.props.backup.selectionOpen).toBe(true);
  await page.props.backup.onFileChange({ currentTarget: { files: [{ size: 0, arrayBuffer: async () => new ArrayBuffer(0) }], value: "selected" } });
  page = render(app); effects();
  expect(page.props.backup.hasPreview).toBe(true);
  expect(page.props.backup.selectionOpen).toBe(false);
  page.props.onOpen("p");
  expect(vi.mocked(service.call).mock.calls.some(([operation]) => operation === "openProject")).toBe(false);
  expect(persist).not.toHaveBeenCalled();
  page.props.restoreDialog.props.onOpen("p");
  page = render(app); effects();
  await Promise.resolve(); await Promise.resolve();
  page = render(app);
  expect(page.type).toBe(TokensWorkbench);
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
  let owner = render(hook); owner.changeName("P"); owner.changeDefaultColorSpace("hsl"); owner = render(hook); await owner.create();
  expect(render(hook).defaultColorSpace).toBe("hsl");
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
  const app = () => { const wrapper = App({ createHost: () => service }); return wrapper.props.children.type(wrapper.props.children.props); };
  let page = render(app); effects(); for (let i=0;i<12;i++) await Promise.resolve();
  page = render(app); expect(page.props.storage.status).toBe("unprotected"); expect(persist).not.toHaveBeenCalled();
  page.props.onView({ ...page.props.view, query: "  My search  " });
  page.props.creation.onOpen();
  page.props.creation.onNameChange("P"); page = render(app); page.props.creation.onCreate();
  for (let i=0;i<12;i++) await Promise.resolve();
  page = render(app); effects(); expect(persist).toHaveBeenCalledOnce();
  page.props.onProjects(); for (let i=0;i<12;i++) await Promise.resolve();
  page = render(app); effects(); expect(page.props.storage.status).toBe("protected");
  expect(page.props.view.query).toBe("  My search  ");
  expect(page.props.creation.open).toBe(false);
  expect(persisted).toHaveBeenCalledOnce();
  // A fresh App session makes the restore callback's wiring independently observable.
  runtime.cells = []; runtime.effects = []; persisted.mockClear(); persist.mockClear();
  page = render(app); effects(); for (let i=0;i<12;i++) await Promise.resolve();
  page = render(app);
  await page.props.backup.onFileChange({ currentTarget: { files: [{ size: 0, arrayBuffer: async () => new ArrayBuffer(0) }], value: "file" } });
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

it("runs Projects resize policy only at 880, never on mount or a compact-only transition", async () => {
  const { useProjectsLayout } = await import("@presentation/App/components/ProjectsWorkbench/hooks/useProjectsLayout");
  const listeners = new Map<string, () => void>();
  const media = new Map<string, { matches: boolean; addEventListener: any; removeEventListener: any }>();
  vi.stubGlobal("window", { innerWidth: 1440 });
  vi.stubGlobal("matchMedia", (query: string) => {
    const value = { matches: false, addEventListener: (_: string, listener: () => void) => listeners.set(query, listener), removeEventListener: vi.fn() };
    media.set(query, value); return value;
  });
  vi.stubGlobal("document", { activeElement: null, querySelector: () => null });
  const onView = vi.fn();
  const hook = () => useProjectsLayout({ scroll: 12, surface: "inspect" }, onView);
  const owner = render(hook);
  const browse = { scrollTop: 0, contains: () => false };
  owner.browse.current = browse as any;
  effects();
  expect(browse.scrollTop).toBe(12);
  expect(onView).not.toHaveBeenCalled();
  media.get("(width < 1120px)")!.matches = true;
  listeners.get("(width < 1120px)")!();
  expect(onView).not.toHaveBeenCalled();
  media.get("(width < 880px)")!.matches = true;
  listeners.get("(width < 880px)")!();
  expect(onView).toHaveBeenCalledExactlyOnceWith({ scroll: 12, surface: "browse" });
  expect(render(hook).narrow).toBe(true);
});

it("discards only a safe creation draft and preserves exact text during unknown recovery", async () => {
  const service = host(async op => op === "createProject" ? { status: "unknown", commandId: "c", reason: "Check required" } : []);
  const hook = () => useProjects({ current: service }, () => service, vi.fn(), false);
  let owner = render(hook);
  owner.changeName("  Exact  "); owner.changeDescription(" A\nB "); owner = render(hook);
  await owner.create(); owner = render(hook);
  owner.discardDraft(); owner = render(hook);
  expect(owner.name).toBe("  Exact  "); expect(owner.description).toBe(" A\nB ");
  expect(owner.unknown?.commandId).toBe("c");
  runtime.cells = []; runtime.effects = [];
  owner = render(hook); owner.changeName("  Exact  "); owner.changeDescription(" A\nB "); owner = render(hook);
  owner.discardDraft(); owner = render(hook);
  expect(owner.name).toBe(""); expect(owner.description).toBe(""); expect(owner.nameError).toBe("");
});

it("creation dialog requests dirty confirmation and blocks dismissal during recovery", async () => {
  const { CreateProjectDialog } = await import("@presentation/App/components/ProjectsWorkbench/components/CreateProjectDialog/CreateProjectDialog");
  const { Dialog } = await import("@base-ui/react/dialog");
  const close = vi.fn(), discard = vi.fn();
  const props = {
    open: true, onClose: close, onDiscard: discard, returnFocus: () => null, blocked: false,
    form: { defaultColorSpace: "oklch" as const, onDefaultColorSpaceChange: vi.fn(), name: "  Draft  ", description: "Text", nameRef: { current: null }, onNameChange: vi.fn(), onDescriptionChange: vi.fn(), onSubmit: vi.fn(), disabled: false, pending: false, error: "" },
    recovery: null, departureDialog: null,
  };
  let dialog = render(() => CreateProjectDialog(props));
  dialog.props.onOpenChange(false); dialog = render(() => CreateProjectDialog(props));
  const confirmation = dialog.props.children.props.children.find((child: any) => child?.type === Dialog.Root);
  expect(confirmation.props.open).toBe(true); expect(close).not.toHaveBeenCalled(); expect(discard).not.toHaveBeenCalled();
  confirmation.props.onOpenChange(false);
  dialog = render(() => CreateProjectDialog({ ...props, blocked: true }));
  dialog.props.onOpenChange(false); dialog = render(() => CreateProjectDialog({ ...props, blocked: true }));
  expect(dialog.props.children.props.children.find((child: any) => child?.type === Dialog.Root).props.open).toBe(false);
  dialog = render(() => CreateProjectDialog({ ...props, form: { ...props.form, name: "", description: "" } }));
  dialog.props.onOpenChange(false); expect(close).toHaveBeenCalledOnce();
  close.mockClear();
  const colorOnly = {...props, form: {...props.form, name: "", description: "", defaultColorSpace: "display-p3" as const}};
  dialog = render(() => CreateProjectDialog(colorOnly)); dialog.props.onOpenChange(false);
  dialog = render(() => CreateProjectDialog(colorOnly));
  expect(dialog.props.children.props.children.find((child: any) => child?.type === Dialog.Root).props.open).toBe(true);
  expect(close).not.toHaveBeenCalled();
});

it("transfers focus authority from backup selection to preview and preserves its explicit return target", async () => {
  const { RestoreSelectionDialog } = await import("@presentation/App/components/ProjectsWorkbench/components/RestoreSelectionDialog");
  const { RestoreDialog } = await import("@presentation/App/components/ProjectsWorkbench/components/RestoreDialog/RestoreDialog");
  const returnFocus = vi.fn(() => null);
  const selection = (handingOff: boolean) => RestoreSelectionDialog({ open: false, handingOff, pending: false, onClose: vi.fn(), onFileChange: vi.fn(), feedback: null, returnFocus });
  expect(selection(true).props.children.props.finalFocus).toBe(false);
  expect(selection(false).props.children.props.finalFocus).toBe(returnFocus);
  const dialog = render(() => RestoreDialog({ host: host(async () => undefined), initial: { stageId: "s", project: { id: "p", name: "P" }, diagnostics: { total: 0, items: [], complete: true } } as any, onCancel: vi.fn(), onOpen: vi.fn(), returnFocus }));
  expect(dialog.props.children.props.initialFocus()).toBe(true);
  expect(dialog.props.children.props.finalFocus).toBe(returnFocus);
});

it.each([false, true])("returns restore-cancel focus after catalogue refresh without stealing user focus (%s)", async movedFocus => {
  const { App } = await import("@presentation/App/App");
  const refresh = deferred<any>();
  let reads = 0;
  const service = host(async op => {
    if (op === "catalogue") return ++reads === 1 ? [] : refresh.promise;
    if (op === "stageBackup") return { project: header.project };
  });
  const focus = vi.fn();
  const trigger = { isConnected: true, focus };
  const body = {};
  const document = { activeElement: trigger as object, body, querySelector: () => null };
  let runFrame: (() => void) | undefined;
  vi.stubGlobal("document", document);
  vi.stubGlobal("requestAnimationFrame", (callback: () => void) => { runFrame = callback; return 1; });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal("navigator", { storage: { persisted: async () => false, persist: async () => false } });
  vi.stubGlobal("addEventListener", vi.fn()); vi.stubGlobal("removeEventListener", vi.fn());
  const app = () => { const wrapper = App({ createHost: () => service }); return wrapper.props.children.type(wrapper.props.children.props); };
  let page = render(app); effects(); for (let i=0;i<8;i++) await Promise.resolve();
  page = render(app); effects(); page.props.backup.onSelectFile(); page = render(app);
  await page.props.backup.onFileChange({ currentTarget: { files: [{ size: 0, arrayBuffer: async () => new ArrayBuffer(0) }], value: "selected" } });
  page = render(app); effects(); page.props.restoreDialog.props.onCancel(); page = render(app); effects();
  document.activeElement = movedFocus ? {} : body;
  expect(page.props.entries).toBeUndefined(); expect(focus).not.toHaveBeenCalled(); expect(runFrame).toBeUndefined();
  refresh.resolve([]); for (let i=0;i<8;i++) await Promise.resolve();
  page = render(app); effects(); expect(page.props.entries).toEqual([]);
  runFrame!();
  expect(focus).toHaveBeenCalledTimes(movedFocus ? 0 : 1);
});

it("coordinates layer-only drafts, resolved-tab focus, exact values and metadata-only recovery", async () => {
  const { useTokenEditor } = await import("@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor");
  const { changeView } = await import("@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/state/editor-session");
  const { createColorLiteral } = await import("@domain/color-literal");
  const value = createColorLiteral({colorSpace: "srgb", components: ["0.123456789123456789", "0.2", "0.3"], alpha: "0.987654321987654321"});
  let inspection: any = {token: {id: "t", localName: "Token", layer: "primitive", definition: {type: "color"}, authoring: {regeneration: "protected"}}, authoredValue: value, editable: true, resolution: {status: "unresolved", reason: "test", trace: [], diagnostics: []}};
  let revision = "r1";
  const pending = deferred<any>();
  const onApply = vi.fn(() => pending.promise);
  const hook = () => useTokenEditor({inspection, revision, project: context as any, inspect: () => undefined, onApply, onDirty: vi.fn(), readUnavailable: false});
  let owner = render(hook); effects(); owner = render(hook);
  owner.changeLayer("semantic"); owner = render(hook); expect(owner.dirty).toBe(true);
  owner.changeLayer("primitive"); owner = render(hook); expect(owner.dirty).toBe(false);
  owner.changeColorDraft(changeView(owner.session, "oklch")); owner = render(hook);
  owner.changeLayer(null); owner = render(hook);
  owner.selectTab("resolved"); owner = render(hook);
  const focus = vi.fn(), hiddenFocus = vi.fn();
  owner.descriptionRef.current = {focus} as any; owner.modeRef.current = {focus: hiddenFocus} as any;
  const applying = owner.apply(); owner = render(hook);
  expect(owner.accepting).toBe(true);
  await owner.apply(); expect(onApply).toHaveBeenCalledTimes(1);
  expect(onApply).toHaveBeenCalledWith({kind: "literal", colorSpace: "srgb", components: value.components, alpha: value.alpha}, null, undefined);
  pending.resolve({status: "ok", value: {definition: {type: "color", assignments: [{condition: [], value}]}}});
  await applying; owner = render(hook); effects(); owner = render(hook);
  expect(owner.dirty).toBe(false); expect(owner.session.layer).toBe(null);
  expect(focus).toHaveBeenCalled(); expect(hiddenFocus).not.toHaveBeenCalled();
  owner.changeLayer("semantic"); owner = render(hook); effects();
  revision = "r2"; inspection = {...inspection, token: {...inspection.token, layer: "semantic"}};
  owner = render(hook); effects(); owner = render(hook);
  expect(owner.recovery?.reviewed).toBe(false); expect(owner.session.layer).toBe("semantic");
  expect(owner.recovery?.previous.layer).toBe(null);
  await owner.apply(); expect(onApply).toHaveBeenCalledTimes(1);
  focus.mockClear();
  owner.cancel(); expect(focus).not.toHaveBeenCalled(); owner = render(hook); effects(); owner = render(hook);
  expect(focus).toHaveBeenCalled();
  expect(owner.session.layer).toBe("semantic"); expect(owner.dirty).toBe(false); expect(owner.recovery).toBeUndefined();
});

it("retains the layer draft on a failed combined reference edit", async () => {
  const { useTokenEditor } = await import("@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor");
  const onApply = vi.fn(async () => ({status: "failure", error: {code: "storage-failure", operation: "commit", message: "Unknown outcome"}} as const));
  const inspection: any = {token: {id: "t", localName: "Token", definition: {type: "color"}, authoring: {regeneration: "allowed"}}, authoredValue: {kind: "token-reference", targetTokenId: "target", valuePath: []}, editable: true, resolution: {status: "unresolved", reason: "test", trace: [], diagnostics: []}};
  const hook = () => useTokenEditor({inspection, project: context as any, inspect: () => undefined, onApply, onDirty: vi.fn(), readUnavailable: false});
  let owner = render(hook); effects(); owner = render(hook);
  owner.changeLayer("semantic"); owner = render(hook);
  owner.changeColorDraft({...owner.session, byteInvalid: true}); owner = render(hook);
  await owner.apply(); owner = render(hook);
  expect(onApply).toHaveBeenCalledWith(inspection.authoredValue, "semantic", undefined);
  expect(owner.session.layer).toBe("semantic"); expect(owner.dirty).toBe(true); expect(owner.error).toContain("Unknown outcome");
});

it("retains incomplete HEX across tabs, guards Apply, and clears it on Cancel", async () => {
  const { useTokenEditor } = await import("@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor");
  const { editHex } = await import("@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/state/editor-session");
  const value = {kind: "literal", valueType: "color", colorSpace: "srgb", components: ["0.2", "0.4", "0.6"], alpha: "0.123456789"};
  const onApply = vi.fn(async () => ({status: "failure", error: {code: "storage-failure", operation: "commit", message: "Retain draft"}} as const));
  const inspection: any = {token: {id: "t", localName: "Token", definition: {type: "color"}, authoring: {regeneration: "allowed"}}, authoredValue: value, editable: true, resolution: {status: "unresolved", reason: "test", trace: [], diagnostics: []}};
  const hook = () => useTokenEditor({inspection, project: context as any, inspect: () => undefined, onApply, onDirty: vi.fn(), readUnavailable: false});
  let owner = render(hook); effects(); owner = render(hook);
  owner.changeColorDraft(editHex(owner.session, "#12")); owner = render(hook);
  owner.selectTab("resolved"); owner = render(hook);
  expect(owner.session.hexText).toBe("#12"); expect(owner.dirty).toBe(true);
  await owner.apply(); owner = render(hook);
  expect(onApply).not.toHaveBeenCalled(); expect(owner.error).toContain("HEX");
  owner.cancel(); owner = render(hook); effects(); owner = render(hook);
  expect(owner.session.hexText).toBeNull(); expect(owner.dirty).toBe(false);
  owner.changeColorDraft(editHex(owner.session, "#ff0000")); owner = render(hook);
  await owner.apply(); owner = render(hook);
  expect(onApply).toHaveBeenCalledWith({kind: "literal", colorSpace: "srgb", components: ["1", "0", "0"], alpha: value.alpha}, null, undefined);
  expect(owner.session.hexText).toBe("#ff0000"); expect(owner.dirty).toBe(true);
});

 it("protects a color-only project draft on browser leave and resets explicit discard", () => {
  const listeners = new Map<string, any>();
  vi.stubGlobal("addEventListener", (name: string, listener: any) => listeners.set(name, listener));
  vi.stubGlobal("removeEventListener", (name: string) => listeners.delete(name));
  const service = host(async () => []);
  const hook = () => useProjects({current: service}, () => service, vi.fn(), false);
  let owner = render(hook); effects();
  expect(owner.defaultColorSpace).toBe("oklch");
  owner.changeDefaultColorSpace("oklab"); owner = render(hook); effects();
  const event = {preventDefault: vi.fn(), returnValue: undefined}; listeners.get("beforeunload")(event);
  expect(event.preventDefault).toHaveBeenCalledOnce();
  owner.discardDraft(); owner = render(hook); effects();
  expect(owner.defaultColorSpace).toBe("oklch");
  event.preventDefault.mockClear(); listeners.get("beforeunload")(event); expect(event.preventDefault).not.toHaveBeenCalled();
 });
 it.each([undefined, "srgb", "display-p3", "hsl", "oklab", "oklch"] as const)("creates opaque black in effective project space %s", async space => {
  const project = {...header.project, ...(space ? {preferences: {defaultColorSpace: space}} : {})};
  const accept = vi.fn(async () => ({status: "rejected" as const, reason: "Keep draft"}));
  const hook = () => useAuthoringForm({...header, project}, {...context, project}, null, false, undefined, "", accept, {current: undefined}, vi.fn(), vi.fn(), vi.fn());
  let owner = render(hook); owner.begin("token"); owner = render(hook); owner.change("name", "black"); owner = render(hook); await owner.create();
  expect(accept).toHaveBeenCalledWith(expect.objectContaining({operation: "createColorToken", input: expect.objectContaining({value: {kind: "literal", colorSpace: space ?? "srgb", components: ["0", "0", "0"], alpha: "1"}})}));
  expect(render(hook).name).toBe("black");
 });

 it("preserves the selected preference while project creation is pending", async () => {
  const waiting = deferred<any>();
  const service = host(async op => op === "createProject" ? waiting.promise : []);
  const hook = () => useProjects({current: service}, () => service, vi.fn(), false);
  let owner = render(hook); owner.changeName("Pending"); owner.changeDefaultColorSpace("oklab"); owner = render(hook);
  const create = owner.create(); owner = render(hook); owner.discardDraft();
  expect(render(hook).defaultColorSpace).toBe("oklab");
  expect(service.call).toHaveBeenCalledWith("createProject", expect.objectContaining({preferences: {defaultColorSpace: "oklab"}}));
  waiting.resolve({status: "rejected", reason: "Unavailable"}); await create;
  owner = render(hook); expect(owner.defaultColorSpace).toBe("oklab"); expect(owner.name).toBe("Pending");
 });

it("keeps description and section choices across tabs, reviews description conflicts, and reopens on Cancel", async () => {
  const { useTokenEditor } = await import("@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor");
  const value = {kind: "literal", valueType: "color", colorSpace: "srgb", components: ["0", "0", "0"], alpha: "1"};
  let inspection: any = {token: {id: "t", localName: "Token", description: "previous", definition: {type: "color"}, authoring: {regeneration: "allowed"}}, authoredValue: value, editable: true, resolution: {status: "unresolved", reason: "test", trace: [], diagnostics: []}};
  let revision = "r1";
  const onApply = vi.fn(async () => ({status: "failure", error: {code: "storage-failure", operation: "commit", message: "Retain draft"}} as const));
  const hook = () => useTokenEditor({inspection, revision, project: context as any, inspect: () => undefined, onApply, onDirty: vi.fn(), readUnavailable: false});
  let owner = render(hook); effects(); owner = render(hook);
  expect(owner.sections).toEqual({edit:true, applied:false, metadata:false, source:false, resolved:false, trace:false, diagnostics:false, raw:false});
  owner.changeDescription("  draft\ntext  "); owner = render(hook);
  owner.toggleSection("edit"); owner.toggleSection("metadata"); owner.selectTab("resolved"); owner = render(hook);
  expect(owner.session.description).toBe("  draft\ntext  "); expect(owner.dirty).toBe(true); expect(owner.sections.edit).toBe(false);
  await owner.apply(); owner = render(hook);
  expect(onApply).toHaveBeenLastCalledWith(expect.objectContaining({kind: "literal"}), null, "  draft\ntext  ");
  expect(owner.session.description).toBe("  draft\ntext  ");
  revision = "r2"; inspection = {...inspection, token: {...inspection.token, description: "current"}};
  owner = render(hook); effects(); owner = render(hook);
  expect(owner.recovery?.previous.description).toBe("previous"); expect(owner.recovery?.reviewed).toBe(false);
  await owner.apply(); expect(onApply).toHaveBeenCalledTimes(1);
  vi.stubGlobal("requestAnimationFrame", (callback: () => void) => callback());
  owner.reviewRecovery(); owner = render(hook); await owner.apply(); expect(onApply).toHaveBeenCalledTimes(2);
  owner.cancel(); owner = render(hook); effects(); owner = render(hook);
  expect(owner.session.description).toBe("current"); expect(owner.sections.edit).toBe(true); expect(owner.sections.metadata).toBe(true); expect(owner.dirty).toBe(false);
  owner.changeDescription(""); owner = render(hook); await owner.apply();
  expect(onApply).toHaveBeenLastCalledWith(expect.anything(), null, null);
});

it.each([undefined, ""])("omits untouched description %s during an unrelated edit", async description => {
  const { useTokenEditor } = await import("@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor");
  const value = {kind:"token-reference", targetTokenId:"target", valuePath:[]};
  const inspection: any = {token:{id:"t", description, definition:{type:"color"}, authoring:{regeneration:"allowed"}}, authoredValue:value, editable:true, resolution:{status:"unresolved", reason:"test", trace:[], diagnostics:[]}};
  const onApply = vi.fn(async () => ({status:"failure", error:{code:"storage-failure", operation:"commit", message:"failed"}} as const));
  const hook = () => useTokenEditor({inspection, project:context as any, inspect:()=>undefined, onApply, onDirty:vi.fn(), readUnavailable:false});
  let owner = render(hook); effects(); owner = render(hook); owner.changeLayer("semantic"); owner = render(hook); await owner.apply();
  expect(onApply).toHaveBeenCalledWith(value,"semantic",undefined);
  owner = render(hook); owner.changeDescription("temporary"); owner = render(hook); owner.changeDescription(""); owner = render(hook); await owner.apply();
  expect(onApply).toHaveBeenLastCalledWith(value,"semantic",description === "" ? null : undefined);
});

it("loads source only on disclosure, rejects stale completions, and retries a failed current request", async () => {
  const { ExactSource } = await import("@presentation/App/components/TokensWorkbench/components/ExactSource");
  const first = deferred<string>(), second = deferred<string>();
  const request = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise).mockRejectedValueOnce(Error("failure")).mockResolvedValue("retried");
  let expanded = false, revision = "r1";
  const component = () => ExactSource({revision, request, expanded, onToggle: () => {}});
  const content = (element: any): any[] => element.props.children;
  let view = render(component); effects(); expect(request).not.toHaveBeenCalled();
  expanded = true; view = render(component); effects(); expect(request).toHaveBeenCalledTimes(1);
  expanded = false; render(component); effects(); first.resolve("stale"); await first.promise;
  view = render(component); expect(JSON.stringify(content(view))).not.toContain("stale");
  expanded = true; render(component); effects(); second.resolve("fresh"); await second.promise;
  view = render(component); expect(JSON.stringify(content(view))).toContain("fresh");
  revision = "r2"; render(component); effects(); await Promise.resolve();
  view = render(component); expect(JSON.stringify(content(view))).not.toContain("fresh");
  const error = content(view).find((child: any) => child?.props?.role === "status" && child?.type === "div");
  expect(error).toBeDefined(); error.props.children[1].props.onClick(); await Promise.resolve();
  view = render(component); expect(JSON.stringify(content(view))).toContain("retried");
});

it("guards member-ramp entry from a dirty token, restores Cancel's trigger and opens the saved destination without writes", async () => {
  const { TokensWorkbench } = await import("@presentation/App/components/TokensWorkbench/TokensWorkbench");
  const { DepartureGuard } = await import("@presentation/App/components/TokensWorkbench/components/DepartureGuard");
  const { RampWorkbench } = await import("@presentation/App/components/TokensWorkbench/components/RampWorkbench/RampWorkbench");
  class Element { isConnected = true; focus = vi.fn(); }
  const trigger = new Element();
  vi.stubGlobal("HTMLElement", Element);
  vi.stubGlobal("document", { activeElement: trigger, querySelector: () => null, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  vi.stubGlobal("window", { innerWidth: 600 });
  vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("addEventListener", vi.fn()); vi.stubGlobal("removeEventListener", vi.fn());
  vi.stubGlobal("requestAnimationFrame", (callback: () => void) => callback());
  const rampContext = { ...context, groups: [{ authored: { id: "ramp", localName: "renamed", parentGroupId: null, projectId: "p", colorRamp: { members: [{tokenId: "member"}] } }, path: {status: "derived", path: ["renamed"]} }] };
  const service = host(async op => op === "context" ? rampContext : op === "inspection" ? {token: {id: "ordinary", definition: {type: "color"}}, editable: true} : []);
  const hook = () => TokensWorkbench({host: service, initial: header, onProjects: vi.fn(), onProject: vi.fn()});
  const guard = (page: any) => page.props.overlays.props.children.find((node: any) => node?.type === DepartureGuard);
  let page = render(hook); effects(); await Promise.resolve();
  page = render(hook); effects();
  page.props.workspace.props.choose("token", "ordinary"); await Promise.resolve();
  page = render(hook);
  page.props.inspector.props.children.props.onDirty(true);
  page = render(hook);
  const editorKey = page.props.inspector.props.children.key;
  vi.mocked(service.call).mockClear();
  page.props.workspace.props.onOpenRamp("ramp");
  page = render(hook);
  expect(guard(page).props.open).toBe(true);
  expect(page.props.workspace.props.selection).toEqual({kind: "token", id: "ordinary"});
  guard(page).props.onStay(); page = render(hook);
  expect(guard(page).props.finalFocus()).toBe(trigger);
  expect(page.props.inspector.props.children.key).toBe(editorKey);
  page.props.workspace.props.onOpenRamp("ramp"); page = render(hook);
  expect(guard(page).props.open).toBe(true);
  guard(page).props.onDiscard(); page = render(hook);
  expect(page.props.workspace.type).toBe(RampWorkbench);
  expect(page.props.workspace.props.groupId).toBe("ramp");
  expect(page.props.workspace.props.hidden).toBe(false);
  expect(page.props.inspectorCollapsed).toBe(false);
  expect(service.call).not.toHaveBeenCalled();
});
