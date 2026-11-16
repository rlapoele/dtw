import type { HistoryDirection } from "@application/retention/history";
type ShortcutEvent = Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "shiftKey" | "altKey" | "repeat" | "isComposing" | "defaultPrevented">;
export function historyShortcut(event: ShortcutEvent): HistoryDirection | undefined {
  if (event.defaultPrevented || event.repeat || event.isComposing || event.altKey || !(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;
  return event.shiftKey ? "redo" : "undo";
}
export function ownsHistoryShortcut(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement && !!target.closest(".app-shell") && !target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="dialog"],[role="alertdialog"]') && !document.querySelector('[role="dialog"],[role="alertdialog"]');
}
