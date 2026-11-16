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
import { useStoragePersistence } from "@presentation/App/hooks/useStoragePersistence";
import { checkPersistentStorage, requestPersistentStorage } from "@adapters/browser/storage-preference";
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
afterEach(() => {
  runtime.cells = [];
  runtime.cursor = 0;
  runtime.effects = [];
  vi.unstubAllGlobals();
});


async function flush() { for (let i = 0; i < 12; i++) await Promise.resolve(); }
function api(persisted = vi.fn(async () => false), persist = vi.fn(async () => true)) {
  vi.stubGlobal("navigator", { storage: { persisted, persist } });
  return { persisted, persist };
}
it("checks without requesting, preserves protected status and deduplicates effect replay", async () => {
  const calls = api(vi.fn(async () => true));
  const hook = () => useStoragePersistence();
  let owner = render(hook); const replay = [...runtime.effects]; effects();
  for (const setup of replay) setup(); await flush();
  owner = render(hook); owner.onRetained(); owner.onRetained(); await flush();
  expect(render(hook).status).toBe("protected");
  expect(calls.persisted).toHaveBeenCalledOnce(); expect(calls.persist).not.toHaveBeenCalled();
});
it("waits for pending startup check and requests once across repeated acknowledgements and rerenders", async () => {
  const waiting = deferred<boolean>(); const grant = deferred<boolean>();
  const calls = api(vi.fn(() => waiting.promise), vi.fn(() => grant.promise));
  const hook = () => useStoragePersistence();
  let owner = render(hook); effects(); owner.onRetained(); render(hook).onRetained();
  expect(calls.persist).not.toHaveBeenCalled(); waiting.resolve(false); await flush();
  expect(render(hook).status).toBe("requesting"); owner.onRetained(); owner.retry();
  expect(calls.persist).toHaveBeenCalledOnce(); grant.resolve(false); await flush();
  owner = render(hook); expect(owner.status).toBe("unprotected"); owner.onRetained(); await flush();
  expect(calls.persist).toHaveBeenCalledOnce();
});
it("manual retry rechecks status and consumes automatic opportunity even when refused", async () => {
  const calls = api(undefined, vi.fn(async () => false)); const hook = () => useStoragePersistence();
  render(hook); effects(); await flush(); render(hook).retry(); await flush();
  render(hook).onRetained(); await flush(); expect(calls.persist).toHaveBeenCalledOnce();
  calls.persisted.mockResolvedValue(true); render(hook).retry(); await flush();
  expect(render(hook).status).toBe("protected"); expect(calls.persist).toHaveBeenCalledOnce();
});
it("contains API failure and recovers through retry while unsupported APIs stay unavailable", async () => {
  vi.stubGlobal("navigator", {}); expect(await checkPersistentStorage()).toBe("unsupported");
  expect(await requestPersistentStorage()).toBe("unsupported");
  const calls = api(vi.fn(async () => { throw Error("blocked"); }));
  const hook = () => useStoragePersistence(); render(hook); effects(); await flush();
  expect(render(hook).status).toBe("check-error");
  calls.persisted.mockResolvedValue(false); calls.persist.mockRejectedValueOnce(Error("blocked"));
  render(hook).retry(); await flush(); expect(render(hook).status).toBe("request-error");
  render(hook).retry(); await flush(); expect(render(hook).status).toBe("protected");
});

it("reports partial APIs unavailable without inventing protection", async () => {
  vi.stubGlobal("navigator", { storage: { persisted: async () => false } });
  expect(await checkPersistentStorage()).toBe("unsupported");
  vi.stubGlobal("navigator", { storage: { persisted: async () => true } });
  expect(await checkPersistentStorage()).toBe("protected");
});
