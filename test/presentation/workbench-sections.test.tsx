import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { WorkspaceToolbar } from "@presentation/App/components/TokensWorkbench/components/TokenWorkspace/components/WorkspaceToolbar/WorkspaceToolbar";
import { WorkbenchStatus } from "@presentation/App/components/TokensWorkbench/components/WorkbenchStatus/WorkbenchStatus";

function toolbar(view: ComponentProps<typeof WorkspaceToolbar>["view"], blocked = false) {
  return renderToStaticMarkup(createElement(WorkspaceToolbar, {
    view, blocked, query: "Preserved query", groupLabels: new Map([["g", "Brand"]]),
    onQuery() {}, onCreateToken() {}, onRenameGroup() {},
  }));
}

it("keeps scope headings, search and rename visibility distinct without a toolbar wrapper", () => {
  const root = toolbar({ kind: "all-tokens" });
  expect(root).toMatch(/^<div class="panel-header/);
  expect(root).toContain("All tokens");
  expect(root).toContain('value="Preserved query"');
  expect(root).not.toContain("Rename group");
  const group = toolbar({ kind: "group", id: "g" }, true);
  expect(group).toContain("Brand");
  expect(group).toContain("Rename group");
  expect((group.match(/ disabled=""/g) ?? [])).toHaveLength(2);
  expect(toolbar({ kind: "group", id: "missing" })).toContain("Missing group");
  const all = toolbar({ kind: "all-content" });
  expect(all).toContain("All content");
  expect(all).toContain("New token");
  expect(all).not.toContain('type="search"');
  expect(all).not.toContain("Rename group");
});

it("keeps compact retention status precedence, draft state and independent-backup disclosure", () => {
  const status = (overrides: Partial<ComponentProps<typeof WorkbenchStatus>> = {}) =>
    renderToStaticMarkup(createElement(WorkbenchStatus, {
      tokens: 7, busy: false, unknown: false, readFailure: "", writable: true,
      dirty: false, ...overrides,
    }));
  expect(status()).toContain("7 tokens");
  expect(status()).toContain("Retained locally");
  expect(status({ writable: false })).toContain("Inspection only");
  expect(status({ readFailure: "Failed", writable: false })).toContain("Stale / unavailable");
  expect(status({ unknown: true, readFailure: "Failed" })).toContain("Outcome unknown");
  const busy = status({ busy: true, unknown: true, readFailure: "Failed" });
  expect(busy).toContain("Retention pending");
  expect(status({ dirty: true })).toContain("Unapplied changes");
  expect(busy).toContain("About retention");
  expect(busy).not.toContain("Request persistent storage");
  expect(status()).not.toContain('disabled=""');
});
