import { afterEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { WorkbenchLayout } from "@presentation/App/components/WorkbenchLayout/WorkbenchLayout";

it("composes slots in order without wrapping the semantic panes", () => {
  const html = renderToStaticMarkup(<WorkbenchLayout
    header={<header>header</header>} beforeBody={<p>before</p>}
    navigation={<nav>navigation</nav>} workspace={<main>workspace</main>}
    inspector={<aside>inspector</aside>} afterBody={<footer>after</footer>}
    overlays={<dialog>overlay</dialog>}
    compact={false} narrow={false} surface="browse"
    navigationCollapsed={false} inspectorCollapsed={false}
  />);
  expect(html).toMatch(/header<\/header><p>before<\/p><div[^>]+><nav>navigation<\/nav><main>workspace<\/main><aside>inspector<\/aside><\/div><footer>after<\/footer><dialog>overlay<\/dialog>/);
});

const runtime = vi.hoisted(() => ({ cells: [] as any[], cursor: 0, effects: [] as (() => void | (() => void))[] }));
vi.mock("react", async original => {
  const react = await original<typeof import("react")>();
  return { ...react,
    useState: (initial: any) => {
      const index = runtime.cursor++;
      runtime.cells[index] ??= { value: typeof initial === "function" ? initial() : initial };
      const cell = runtime.cells[index];
      return [cell.value, (value: any) => { cell.value = value; }];
    },
    useRef: (initial: any) => { const index = runtime.cursor++; return runtime.cells[index] ??= { current: initial }; },
    useEffect: (effect: any) => { const index = runtime.cursor++; if (!runtime.cells[index]) { runtime.cells[index] = true; runtime.effects.push(effect); } },
  };
});
import { useWorkbenchViewport } from "@presentation/App/components/WorkbenchLayout/hooks/useWorkbenchViewport";
function render(onChange: Parameters<typeof useWorkbenchViewport>[0]) {
  runtime.cursor = 0;
  return useWorkbenchViewport(onChange);
}
afterEach(() => { runtime.cells = []; runtime.cursor = 0; runtime.effects = []; vi.unstubAllGlobals(); });
it("observes both exact thresholds, calls current policy only on transitions and cleans up", () => {
  const media = new Map<string, { matches: boolean; listeners: Set<() => void>; addEventListener: any; removeEventListener: any }>();
  vi.stubGlobal("window", { innerWidth: 1000 });
  vi.stubGlobal("matchMedia", (query: string) => {
    const listeners = new Set<() => void>();
    const item = { matches: query.includes("1120"), listeners, addEventListener: (_: string, cb: () => void) => listeners.add(cb), removeEventListener: (_: string, cb: () => void) => listeners.delete(cb) };
    media.set(query, item); return item;
  });
  const initial = vi.fn(), current = vi.fn();
  expect(render(initial)).toEqual({ compact: true, narrow: false });
  const cleanup = runtime.effects[0]() as () => void;
  expect(initial).not.toHaveBeenCalled();
  render(current);
  expect([...media.keys()]).toEqual(["(width < 1120px)", "(width < 880px)"]);
  const narrow = media.get("(width < 880px)")!; narrow.matches = true;
  narrow.listeners.forEach(cb => cb());
  expect(current).toHaveBeenLastCalledWith({ compact: true, narrow: true }, "narrow");
  expect(render(current)).toEqual({ compact: true, narrow: true });
  const compact = media.get("(width < 1120px)")!; compact.matches = false;
  compact.listeners.forEach(cb => cb());
  expect(current).toHaveBeenLastCalledWith({ compact: false, narrow: true }, "compact");
  cleanup(); expect([...media.values()].every(item => item.listeners.size === 0)).toBe(true);
});
