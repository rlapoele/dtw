import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ProjectsWorkbench } from "@presentation/App/components/ProjectsWorkbench/ProjectsWorkbench";

type Props = ComponentProps<typeof ProjectsWorkbench>;
type Groups = "creation" | "recovery" | "storage" | "backup" | "feedback";
type ScreenOverrides = Partial<Omit<Props, Groups>> & {
  [Key in Groups]?: Partial<Props[Key]>;
};

function screen(overrides: ScreenOverrides = {}) {
  const noop = () => undefined;
  return renderToStaticMarkup(createElement(ProjectsWorkbench, {
    entries: [],
    view: { scroll: 0, surface: "browse" }, onView: noop,
    onOpen: noop, onRetryCatalogue: noop,
    departureDialog: createElement("aside", null, "Departure dialog"),
    restoreDialog: createElement("aside", null, "Restore dialog"),
    ...overrides,
    creation: {
      open: false, onOpen: noop, onClose: noop, onDiscard: noop, nameError: "",
      name: "  Unfinished name  ", description: "", nameRef: { current: null },
      onNameChange: noop, onDescriptionChange: noop, onCreate: noop,
      ...overrides.creation,
    },
    recovery: {
      pending: false, activeMutation: false, retained: false, unknown: false,
      onCheck: noop, onRetryReading: noop, onReviewLeaving: noop,
      ...overrides.recovery,
    },
    storage: { status: "checking", onRetry: noop, ...overrides.storage },
    backup: { selectionOpen: false, onSelectFile: noop, onCloseSelection: noop, onDownload: noop, feedback: "", hasPreview: false, onFileChange: noop, ...overrides.backup },
    feedback: { error: "", notice: "", ...overrides.feedback },
  }));
}

it("keeps loading, unavailable/retry and empty catalogue feedback distinct", () => {
  expect(screen({ entries: undefined })).toContain("Loading projects…");
  const unavailable = screen({ entries: undefined, feedback: { error: "Read failed" } });
  expect(unavailable).toContain("Projects unavailable. Existing browser data is unchanged.");
  expect(unavailable).toContain("Retry reading projects");
  expect(unavailable).toContain('role="alert"');
  expect(unavailable).toContain("Read failed");
  expect(screen()).toContain("No projects retained in this browser.");
});

it("shows legacy names, exact identities, counts and unavailable rows together", () => {
  const html = screen({ entries: [
    { rowKey: "a", status: "supported", id: "  legacy id  ", name: "", revision: "r", tokens: 3, groups: 2 },
    { rowKey: "b", status: "supported", id: "b", name: "  Legacy name  ", revision: "r", tokens: 0, groups: 0 },
    { rowKey: "c", status: "unavailable", id: "unavailable-id", reason: "Unsupported version" },
  ] });
  expect(html).toContain("(unnamed project)");
  expect(html).toContain("  Legacy name  ");
  expect(html).toContain("tokens: 3</span>");
  expect(html).toContain("groups: 2</span>");
  expect(html).toContain('Identity: &quot;  legacy id  &quot;');
  expect(html).toContain("Project unavailable: Unsupported version");
  expect(html).toContain('Identity: &quot;unavailable-id&quot;');
});

it("keeps creation out of browse content and preserves recovery protections", () => {
  const html = screen({ recovery: { unknown: true }, feedback: { error: "Write unknown" } });
  expect(html).not.toContain('value="  Unfinished name  "');
  expect(html).not.toContain('type="file"');
  expect(html).toContain("Retained result unknown.");
  expect(html).toContain("Review before leaving");
  expect(html.indexOf("</main>")).toBeLessThan(html.indexOf("Departure dialog"));
  expect(screen({ recovery: { retained: true } })).toContain("Retry reading project");
  expect(screen({ recovery: { pending: true, activeMutation: true } })).toContain("Retention or preparation pending. Inputs are preserved.");
});

it("keeps supported inspection separate from the selectable catalogue and explains missing rows", () => {
  const entry = { rowKey: "p", status: "supported", id: "exact-id", name: "Atlas", revision: "r1", tokens: 3, groups: 1 } as const;
  const html = screen({ entries: [entry], view: { selection: entry, scroll: 200, surface: "browse" } });
  expect(html).toContain("Open project"); expect(html).toContain("Download backup");
  expect(html).not.toContain("Catalogue revision");
  expect(html).toContain('aria-pressed="true"');
  expect(screen({ entries: [], view: { selection: entry, scroll: 200, surface: "inspect" } })).toContain("selected entry is no longer in the catalogue");
  const unavailable = screen({ entries: [{ rowKey: "bad", status: "unavailable", id: "opaque", reason: "Unsupported version" }], view: { selection: { rowKey: "bad", status: "unavailable", id: "opaque", reason: "Unsupported version" }, scroll: 0, surface: "inspect" } });
  expect(unavailable).not.toContain(">Open project<"); expect(unavailable).not.toContain(">Download backup<");
});

it("keeps last-known inspection truthful while catalogue facts are being refreshed", () => {
  const selection = { rowKey: "p", status: "supported", id: "p", name: "P", revision: "r", tokens: 2, groups: 0 } as const;
  const html = screen({ entries: undefined, view: { selection, scroll: 0, surface: "inspect" } });
  expect(html).toContain("Last-known facts are shown");
  expect(html).not.toContain("selected entry is no longer");
});

it("keeps narrow inspection errors, catalogue retry and recovery outside both hidden panes", () => {
  const previousWindow = globalThis.window;
  Object.defineProperty(globalThis, "window", { configurable: true, value: { innerWidth: 720 } });
  try {
    const selection = { rowKey: "p", status: "supported", id: "p", name: "P", revision: "r", tokens: 0, groups: 0 } as const;
    const html = screen({ entries: undefined, feedback: { error: 'Reading project "p" failed' }, recovery: { retained: true }, view: { selection, scroll: 100, surface: "inspect" } });
    expect(html).toMatch(/<main[^>]*hidden=""/);
    const feedback = html.slice(html.indexOf('aria-label="Project feedback"'));
    expect(feedback).toContain('role="alert"');
    expect(feedback).toContain('Reading project &quot;p&quot; failed');
    expect(feedback).toContain("Retry reading projects");
    expect(feedback).toContain("Retry reading project");
    expect(html.indexOf('aria-label="Project feedback"')).toBeGreaterThan(html.indexOf('aria-label="Project inspector"'));
    expect(html.match(/role="alert"/g)).toHaveLength(1);
    expect(html.slice(0, html.indexOf("</main>"))).not.toContain('role="alert"');
  } finally {
    if (previousWindow === undefined) Reflect.deleteProperty(globalThis, "window");
    else Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
  }
});

it("renders actual persistence status with conditional retry and existing action gates", () => {
  for (const status of ["checking", "requesting", "protected", "unsupported"] as const)
    expect(screen({ storage: { status } })).not.toContain("Retry storage protection");
  expect(screen({ storage: { status: "protected" } })).toContain("Storage protection is enabled");
  for (const status of ["unprotected", "check-error", "request-error"] as const) {
    const html = screen({ storage: { status } });
    expect(html).toContain("Retry storage protection");
    expect(html).not.toContain("Request persistent storage");
    for (const gate of ["pending", "retained", "unknown", "hasPreview"] as const)
      expect(screen({ storage: { status }, ...(gate === "hasPreview" ? { backup: { hasPreview: true } } : { recovery: { [gate]: true } }) })).toMatch(/<button[^>]*disabled=""[^>]*>Retry storage protection/);
  }
  expect(screen({ storage: { status: "request-error" } })).toContain("request failed");
  expect(screen({ storage: { status: "check-error" } })).toContain("status could not be checked");
});

it("renders optional description entry and read-only known or unknown project dates", () => {
  const entry = {rowKey: "p", id: "p", name: "Project", status: "supported" as const, revision: "r", tokens: 0, groups: 0, description: "First line\nSecond line", creationDate: "2026-11-18T10:00:00.000Z", lastUpdatedDate: "2026-11-18T11:00:00.000Z"};
  const html = screen({entries: [entry], view: {scroll: 0, surface: "browse", selection: entry}, creation: { description: "Unfinished\nDescription" }});
  expect(html).not.toContain("Description (optional)");
  expect(html).not.toContain("Unfinished\nDescription");
  expect(html).toContain("First line\nSecond line");
  expect(html).toContain('dateTime="2026-11-18T10:00:00.000Z"');
  expect(html).toContain('dateTime="2026-11-18T11:00:00.000Z"');
  const {creationDate: _creation, lastUpdatedDate: _updated, ...legacy} = entry;
  const unknown = screen({entries: [legacy], view: {scroll: 0, surface: "browse", selection: legacy}});
  expect(unknown.match(/>Unknown</g)).toHaveLength(4);
});

it("distinguishes filtered selection from missing entries and genuine emptiness", () => {
  const entry = { rowKey: "stable", status: "supported", id: "p", name: "Atlas", description: "Storefront", revision: "r", tokens: 1, groups: 0 } as const;
  const view = { query: "absent", selection: entry, scroll: 100, surface: "browse" as const };
  const filtered = screen({ entries: [entry], view });
  expect(filtered).toContain("No matching projects");
  expect(filtered).toContain("Show selected project");
  expect(filtered).toContain("Open project");
  const missing = screen({ entries: [], view });
  expect(missing).toContain("No projects yet");
  expect(missing).not.toContain("Show selected project");
  expect(screen({ entries: [entry], view: { ...view, query: "  STOREFRONT  " } })).toContain('aria-pressed="true"');
  expect(screen({ entries: [entry], view: { ...view, query: "   " } })).not.toContain("of 1");
});
