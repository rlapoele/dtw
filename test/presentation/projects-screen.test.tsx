import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ProjectsWorkbench } from "@presentation/App/components/ProjectsWorkbench/ProjectsWorkbench";

function screen(overrides: Partial<ComponentProps<typeof ProjectsWorkbench>> = {}) {
  const noop = () => undefined;
  return renderToStaticMarkup(createElement(ProjectsWorkbench, {
    storageStatus: "checking", onRetryStorage: noop,
    view: { scroll: 0, surface: "browse" }, onView: noop, onDownload: noop, backupFeedback: "", hasPreview: false,
    entries: [], error: "", notice: "", name: "  Unfinished name  ",
    pending: false, activeMutation: false, retained: false, unknown: false,
    nameRef: { current: null }, onOpen: noop, onRetryCatalogue: noop,
    onBackupChange: noop, onNameChange: noop, onCreate: noop,
    onCheck: noop, onRetryReading: noop, onReviewLeaving: noop,
    departureDialog: createElement("aside", null, "Departure dialog"),
    restoreDialog: createElement("aside", null, "Restore dialog"),
    ...overrides,
  }));
}

it("keeps loading, unavailable/retry and empty catalogue feedback distinct", () => {
  expect(screen({ entries: undefined })).toContain("Loading projects…");
  const unavailable = screen({ entries: undefined, error: "Read failed" });
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
  expect(html).toContain("3 tokens · 2 groups");
  expect(html).toContain('Identity: &quot;  legacy id  &quot;');
  expect(html).toContain("Project unavailable: Unsupported version");
  expect(html).toContain('Identity: &quot;unavailable-id&quot;');
});

it("preserves form validation associations and dialog order with recovery protections", () => {
  const html = screen({ unknown: true, error: "Write unknown" });
  expect(html).toContain('value="  Unfinished name  "');
  expect(html).toContain('aria-describedby="project-error"');
  expect(html).toContain('aria-invalid="true"');
  expect(html).toMatch(/<input[^>]+type="file"[^>]+disabled=""/);
  expect(html).toMatch(/<input[^>]+aria-describedby="project-error"[^>]+disabled=""|<input[^>]+disabled=""[^>]+aria-describedby="project-error"/);
  expect(html).toContain("Retained result unknown.");
  expect(html).toContain("Review before leaving");
  expect(html.indexOf("</main>")).toBeLessThan(html.indexOf("Departure dialog"));
  expect(html.indexOf("Departure dialog")).toBeLessThan(html.indexOf("Restore dialog"));
  expect(screen({ retained: true })).toContain("Retry reading project");
  expect(screen({ pending: true, activeMutation: true })).toContain("Retention or preparation pending. Inputs are preserved.");
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
    const html = screen({ entries: undefined, error: 'Reading project "p" failed', retained: true, view: { selection, scroll: 100, surface: "inspect" } });
    expect(html).toMatch(/<main[^>]*hidden=""/);
    const feedback = html.slice(html.indexOf('aria-label="Project feedback"'));
    expect(feedback).toContain('id="project-error"');
    expect(feedback).toContain('Reading project &quot;p&quot; failed');
    expect(feedback).toContain("Retry reading projects");
    expect(feedback).toContain("Retry reading project");
    expect(html.indexOf('aria-label="Project feedback"')).toBeGreaterThan(html.indexOf('aria-label="Project inspector"'));
    expect(html.match(/id="project-error"/g)).toHaveLength(1);
    expect(html.slice(0, html.indexOf("</main>"))).not.toContain('role="alert"');
  } finally {
    if (previousWindow === undefined) Reflect.deleteProperty(globalThis, "window");
    else Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
  }
});

it("renders actual persistence status with conditional retry and existing action gates", () => {
  for (const status of ["checking", "requesting", "protected", "unsupported"] as const)
    expect(screen({ storageStatus: status })).not.toContain("Retry storage protection");
  expect(screen({ storageStatus: "protected" })).toContain("Storage protection is enabled");
  for (const status of ["unprotected", "check-error", "request-error"] as const) {
    const html = screen({ storageStatus: status });
    expect(html).toContain("Retry storage protection");
    expect(html).not.toContain("Request persistent storage");
    for (const gate of ["pending", "retained", "unknown", "hasPreview"] as const)
      expect(screen({ storageStatus: status, [gate]: true })).toMatch(/<button[^>]*disabled=""[^>]*>Retry storage protection/);
  }
  expect(screen({ storageStatus: "request-error" })).toContain("request failed");
  expect(screen({ storageStatus: "check-error" })).toContain("status could not be checked");
});
