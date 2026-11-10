// Explicit test-only entry, excluded from the production build. Never a project loader.
import { createRoot } from "react-dom/client";
import { App } from "@presentation/app/App";
import "@presentation/styles/global.css";
import { InMemoryProjectStorage } from "@adapters/in-memory-project-storage";
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
  components: ["0.2", "0.4", "0.6"],
  alpha: "1",
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
const initial: ProjectSnapshot = {
  project: createProject({ id: "fixture-project", name: "Acceptance fixture" }),
  groups: [],
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
