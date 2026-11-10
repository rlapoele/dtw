// Explicit test-only entry, excluded from the production build. Never a project loader.
import { createRoot } from "react-dom/client";
import { App } from "@presentation/app/App";
import "@presentation/styles/global.css";
import { InMemoryProjectStorage } from "@adapters/in-memory-project-storage";
import { createTokenGroup } from "@domain/token-group";
import { createProject } from "@domain/project";
import { createToken } from "@domain/token";
import { createColorLiteral } from "@domain/color-literal";
import { createTokenReference } from "@domain/token-reference";
import { createNumberLiteral } from "@domain/numeric-literals";
import type {
  ProjectSnapshot,
  ProjectStorage,
} from "@application/project-storage";
const literal = createColorLiteral({
  colorSpace: "srgb",
  components: ["0.2314", "0.41234567890123456789", "0.67890123456789"],
  alpha: "0.1234567890123456789",
});
const make = (
  id: string,
  value: Parameters<typeof createToken>[0]["definition"],
  extra: Partial<Parameters<typeof createToken>[0]> = {},
) =>
  createToken(
    {
      id,
      projectId: "fixture-project",
      localName: id,
      parentGroupId: null,
      regeneration: "allowed",
      definition: value,
      ...extra,
    },
    [],
  );
const definition = {
  type: "color",
  assignments: [{ condition: [], value: literal }],
};
const tokens = [
  make("protected-color", definition, {
    regeneration: "protected",
    description: "Retained authored description",
    semanticRole: "content.primary",
    layer: "primitive",
  }),
  make(
    "alias",
    {
      type: "color",
      assignments: [
        {
          condition: [],
          value: createTokenReference({
            targetTokenId: "protected-color",
            valuePath: [],
          }),
        },
      ],
    },
    { layer: "semantic" },
  ),
  make("number", {
    type: "number",
    assignments: [{ condition: [], value: createNumberLiteral("8") }],
  }),
];
const params = new URLSearchParams(location.search);
if (params.get("broken") === "true")
  for (const id of ["broken-a", "broken-b"])
    tokens.push(
      make(id, {
        type: "color",
        assignments: [
          {
            condition: [],
            value: createTokenReference({
              targetTokenId: "missing-" + id,
              valuePath: [],
            }),
          },
        ],
      }),
    );
for (const [space, components] of [
  ["srgb", ["-0.2", "0.4", "1.234567890123456789012345678901234567890123456789"]],
  ["display-p3", ["0.1", "0.3", "0.7"]],
  ["hsl", ["none", "none", "63"]],
  ["oklab", ["0.6", "-0.2", "0.3"]],
  ["oklch", ["0.7", "0.2", "39"]],
] as const) tokens.push(make(space, {
  type: "color", assignments: [{ condition: [], value: createColorLiteral({ colorSpace: space, components, alpha: "0.1234567890123456789" }) }],
}, { layer: "primitive", description: " First descriptive line\nSecond descriptive line\nThird full inspector line. " }));
const groups = ["common-long-prefix-group-a", "common-long-prefix-group-b"].map(id => createTokenGroup({ id, projectId: "fixture-project", localName: "same group", parentGroupId: null }));
groups.push(createTokenGroup({ id: "root-named-group", projectId: "fixture-project", localName: "Project root", parentGroupId: null }));
for (const [id, localName, parentGroupId] of [
  ["common-long-prefix-token-a", "duplicate", null], ["common-long-prefix-token-b", "duplicate", null],
  ["empty-token", "", null], ["fallback-token", "(unnamed)", null],
  ["space-token-a", "a  b", null], ["space-token-b", "a b", null],
  ["suffix-like-token", "duplicate · common-long-prefix-token-a", null],
  ["placeholder-token", "Choose a color token…", null], ["missing-label-token", "Missing target", null],
  ["nested-token", "nested", "common-long-prefix-group-a"],
] as const) tokens.push(make(id, definition, { localName, parentGroupId }));
for (const [id, components] of [
  ["half-ties", ["0.1", "0.3", "-0.3"]],
  ["half-sides", ["0.099999999999999999999999999", "0.300000000000000000000000001", "0.2"]],
  ["outside-endpoints", ["-0.000000000000000000001", "1.000000000000000000001", "none"]],
] as const) tokens.push(make(id, { type: "color", assignments: [{ condition: [], value: createColorLiteral({ colorSpace: "srgb", components, alpha: "0.37" }) }] }));
if (params.get("broken") === "true") {
  tokens.push(make("invalid-path-token", definition, { parentGroupId: "absent" }));
  tokens.push(make("invalid-fallback-token", definition, { localName: "(invalid namespace)" }));
}
const initial: ProjectSnapshot = {
  project: createProject({ id: "fixture-project", name: "Acceptance fixture" }),
  groups,
  tokens,
};
const inner = new InMemoryProjectStorage([initial]);
let failRead = false,
  failCommit = false;
const storage: ProjectStorage = {
  load: (id) =>
    failRead
      ? { status: "failure", message: "Controlled read failure" }
      : inner.load(id),
  commit: (snapshot) =>
    failCommit
      ? { status: "failure", message: "Controlled commit failure" }
      : inner.commit(snapshot),
};
// Visible test controls keep browser automation on supported UI actions.
const controls = document.createElement("div");
controls.setAttribute("aria-label", "Acceptance controls");
for (const [label, change] of [
  ["Fail reads", (checked: boolean) => { failRead = checked; window.dispatchEvent(new Event("dtw:read-project")); }],
  ["Fail commits", (checked: boolean) => { failCommit = checked; }],
] as const) {
  const field = document.createElement("label");
  const input = document.createElement("input"); input.type = "checkbox";
  input.onchange = () => change(input.checked);
  field.append(input, label); controls.append(field);
}
document.body.prepend(controls);
// Test-only native keyboard controls work while the modal makes outside UI inert.
// Alt+Shift+R toggles read failure; Alt+Shift+C toggles commit failure.
window.addEventListener("keydown", (event) => {
  if (!event.altKey || !event.shiftKey) return;
  if (event.code === "KeyR") {
    failRead = !failRead;
    window.dispatchEvent(new Event("dtw:read-project"));
  } else if (event.code === "KeyC") failCommit = !failCommit;
  else return;
  event.preventDefault();
  controls.setAttribute("data-fail-read", String(failRead));
  controls.setAttribute("data-fail-commit", String(failCommit));
});
createRoot(document.getElementById("root")!).render(
  <App storage={storage} initialProjectId="fixture-project" />,
);
