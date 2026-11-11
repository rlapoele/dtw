import { acceptanceProject } from "@tests/fixtures/acceptance-project";
import { encodeBackup } from "@application/retention/codec";
// Controlled-state fixture of the actual retained application and native worker.
import { createRoot } from "react-dom/client";
import { RetainedApp } from "@presentation/app/RetainedApp";
import { WorkerWorkbenchHost } from "@presentation/host/worker-client";
import "@presentation/styles/global.css";
const workers: Worker[] = [];
const controls = document.createElement("aside");
controls.setAttribute("aria-label", "Test-only worker controls");
controls.className = "border-b border-border p-2 text-caption";
const label = document.createElement("label");
label.textContent = "Test-only native worker outcome ";
const select = document.createElement("select");
select.id = "fixture-outcome";
for (const mode of [
  "normal",
  "reject",
  "accepted-unknown",
  "readback-once",
  "readback-held",
  "hold-before",
  "hold-after",
]) {
  const option = document.createElement("option");
  option.value = mode;
  option.textContent = mode;
  select.append(option);
}
label.append(select);
controls.append(label);
document.body.prepend(controls);
const downloadFixture = document.createElement("button");
downloadFixture.type = "button";
downloadFixture.textContent = "Download baseline acceptance backup";
downloadFixture.onclick = () => {
  const text = encodeBackup(acceptanceProject(), new Date().toISOString());
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "dtw-baseline-acceptance.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
controls.append(downloadFixture);
const receipts: unknown[] = [];
const evidence = new BroadcastChannel("dtw007-fixture-evidence");
evidence.onmessage = (event) => {
  receipts.push(event.data);
  controls.setAttribute("data-checkpoint", event.data.phase);
};
Object.assign(window, { dtw007Evidence: receipts });
select.onchange = () =>
  workers.at(-1)?.postMessage({ fixtureControl: select.value });
window.addEventListener("keydown", (event) => {
  if (event.altKey && event.shiftKey && event.code === "KeyR") {
    workers.at(-1)?.postMessage({ fixtureControl: "readable" });
    event.preventDefault();
  }
});
createRoot(document.getElementById("root")!).render(
  <RetainedApp
    createHost={() =>
      new WorkerWorkbenchHost(() => {
        const worker = new Worker(
          new URL("./increment007-fault.worker.ts", import.meta.url),
          { type: "module" },
        );
        workers.push(worker);
        select.value = "normal";
        controls.setAttribute("data-worker-generation", String(workers.length));
        const terminate = worker.terminate.bind(worker);
        worker.terminate = () => {
          receipts.push({
            phase: "host-native-terminate",
            generation: workers.length,
            at: Date.now(),
          });
          terminate();
        };
        return worker;
      })
    }
  />,
);
