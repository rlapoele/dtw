import { expect, it } from "vitest";
import { historyShortcut } from "@presentation/Workbench/helpers/history-shortcuts";
const event = {key: "z", ctrlKey: true, metaKey: false, shiftKey: false, altKey: false, repeat: false, isComposing: false, defaultPrevented: false};
it("routes only plain Z and Shift Z without repeats/composition/handled events", () => {
  expect(historyShortcut(event)).toBe("undo"); expect(historyShortcut({...event, shiftKey: true})).toBe("redo");
  for (const patch of [{repeat:true}, {isComposing:true}, {defaultPrevented:true}, {altKey:true}, {key:"y"}, {ctrlKey:false}]) expect(historyShortcut({...event,...patch})).toBeUndefined();
});
