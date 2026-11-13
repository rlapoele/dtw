import { expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ReferenceFields } from "@presentation/features/workbench/inspector/ReferenceFields";

it("preserves an unavailable exact reference and disables selection during read-only or retaining states", () => {
  const reference = 'missing "target"';
  const html = renderToStaticMarkup(
    createElement(ReferenceFields, {
      reference,
      choices: [{ id: "other", label: "Other color" }],
      missingTarget: true,
      disabled: true,
      onReferenceChange() {},
    }),
  );
  expect(html).toMatch(/<select[^>]*disabled=""/);
  expect(html).toContain('selected="">Missing target</option>');
  expect(html).toContain("Other color");
  expect(html).toContain('aria-describedby="reference-note editor-error"');
});

it("emits only the exact reference identity or null without replacing draft state", () => {
  const onReferenceChange = vi.fn();
  const fields = ReferenceFields({
    reference: null,
    choices: [],
    missingTarget: false,
    disabled: false,
    onReferenceChange,
  });
  const select = fields.props.children[0].props.children[1];
  const id = 'quoted " color / target';
  select.props.onChange({ target: { value: JSON.stringify(id) } });
  select.props.onChange({ target: { value: "" } });
  expect(onReferenceChange.mock.calls).toEqual([[id], [null]]);
});
