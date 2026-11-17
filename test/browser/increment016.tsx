// Disposable delivery fixture: no browser storage, worker or application commands.
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/ui/dialog-content";
import { OutcomeFeedback, useOutcomeFeedback } from "@presentation/App/components/OutcomeFeedback/OutcomeFeedback";
import "@presentation/styles/global.css";
function Fixture() {
  const outcomes = useOutcomeFeedback(); const [open, setOpen] = useState(false);
  return <main tabIndex={-1} className="p-4 flex flex-wrap gap-3">
    <button onClick={() => outcomes.publish("Group created and retained.")}>Success</button>
    <button onClick={() => outcomes.publish("Both drafts discarded. Applied value unchanged.", "information")}>Information</button>
    <button onClick={() => { for (let i = 0; i < 5; i++) outcomes.publish(`Outcome ${i + 1} retained.`); }}>Five</button>
    <button onClick={() => outcomes.publish("A long explanation preserved for reading. ".repeat(60), "information")}>Long</button>
    <button onClick={() => outcomes.clear()}>Navigate</button>
    <button onClick={() => setOpen(true)}>Modal</button>
    <Dialog.Root open={open} onOpenChange={setOpen}><DialogContent><Dialog.Title>Required review</Dialog.Title><Dialog.Description>Toasts must wait.</Dialog.Description><button onClick={() => outcomes.publish("Completed during review.")}>Outcome in modal</button><button onClick={() => setOpen(false)}>Close modal</button></DialogContent></Dialog.Root>
  </main>;
}
createRoot(document.getElementById("root")!).render(<OutcomeFeedback><Fixture /></OutcomeFeedback>);
