import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ProjectsScreen } from "@presentation/projects/ProjectsScreen";

function screen(overrides: Partial<ComponentProps<typeof ProjectsScreen>> = {}) {
  const noop = () => undefined;
  return renderToStaticMarkup(createElement(ProjectsScreen, {
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
