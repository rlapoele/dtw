import { DialogContent } from "@presentation/components/ui/dialog-content";
// Rendered API acceptance fixture; never imported by the production entry.
import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@presentation/components/ui/button";
import "@presentation/styles/global.css";
function Fixture() {
  const ref = useRef<HTMLButtonElement>(null);
  const [clicks, setClicks] = useState(0);
  const [emptyPopupClass, setEmptyPopupClass] = useState(false);
  return (
    <main>
      <output aria-label="Clicks">{clicks}</output>
      <Button
        ref={ref}
        data-testid="callback"
        title="Forwarded title"
        className={(state) =>
          state.disabled ? "caller-disabled" : "caller-enabled"
        }
        onClick={() => {
          if (ref.current?.tagName !== "BUTTON") throw Error("ref lost");
          setClicks((c) => c + 1);
        }}
      >
        Callback
      </Button>
      <Button
        disabled
        className={(state) =>
          state.disabled ? "caller-disabled" : "caller-enabled"
        }
        onClick={() => setClicks(99)}
      >
        Disabled
      </Button>
      <Button size="sm" variant="ghost" className="caller-string">
        Compact
      </Button>
      <Button variant="default">Primary</Button>
      <Dialog.Root>
        <Dialog.Trigger render={<Button />}>Open</Dialog.Trigger>
        <DialogContent className="popup-string-caller">
          <Dialog.Title>Composition</Dialog.Title>
          <Dialog.Description>Rendered button fixture.</Dialog.Description>
          <Dialog.Close render={<Button />}>Close</Dialog.Close>
        </DialogContent>
      </Dialog.Root>
      <Button className={() => undefined}>Undefined callback</Button>
      <Dialog.Root>
        <Dialog.Trigger render={<Button />}>Open popup callback</Dialog.Trigger>
        <DialogContent
          data-testid="callback-popup"
          title="Forwarded popup title"
          render={<section data-render-composed="true" />}
          ref={(node) => {
            if (node) node.dataset.refForwarded = "true";
          }}
          className={(state) => {
            document.documentElement.dataset.popupCallbackState =
              JSON.stringify({
                ...state,
                transitionStatus: state.transitionStatus ?? null,
              });
            return emptyPopupClass
              ? undefined
              : state.open
                ? "popup-open-caller"
                : "popup-closed-caller";
          }}
        >
          <Dialog.Title>Popup callback composition</Dialog.Title>
          <Dialog.Description>
            Owned popup callback, props, ref and render fixture.
          </Dialog.Description>
          <Button onClick={() => setEmptyPopupClass(true)}>
            Clear popup classes
          </Button>
          <Dialog.Close render={<Button />}>Close popup callback</Dialog.Close>
        </DialogContent>
      </Dialog.Root>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<Fixture />);
