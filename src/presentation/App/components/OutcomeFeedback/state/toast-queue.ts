export type OutcomeKind = "success" | "information";
export type ToastEvent = {
  id: number; message: string; kind: OutcomeKind; trigger: HTMLElement | null;
  remaining: number; manual: boolean; announced: boolean; exiting: number | null;
};
/** Session-only delivery state. No project data, receipts or command authority. */
export class ToastQueue {
  events: ToastEvent[] = [];
  private sequence = 0;
  add(message: string, kind: OutcomeKind, trigger: HTMLElement | null = null) {
    const event: ToastEvent = { id: ++this.sequence, message, kind, trigger, remaining: 5000, manual: false, announced: false, exiting: null };
    this.events.push(event);
    return event;
  }
  clear() { this.events = []; }
  dismiss(id: number) {
    const event = this.events.find(item => item.id === id);
    if (event && event.exiting === null) event.exiting = 150;
  }
  advance(elapsed: number, admitted: readonly number[], paused: ReadonlySet<number>, blocked: boolean) {
    for (const event of this.events) {
      if (event.exiting !== null) event.exiting -= elapsed;
      else if (!blocked && admitted.includes(event.id) && !paused.has(event.id) && !event.manual) {
        event.remaining = Math.max(0, event.remaining - elapsed);
        if (!event.remaining) this.dismiss(event.id);
      }
    }
    this.events = this.events.filter(event => event.exiting === null || event.exiting > 0);
  }
  announce(admitted: readonly number[], blocked: boolean) {
    if (blocked) return [];
    const pending = this.events.filter(event => admitted.includes(event.id) && !event.announced && event.exiting === null);
    pending.forEach(event => { event.announced = true; });
    return pending;
  }
}
/** Measured FIFO admission. A preview may reduce admission, but never displace the sole message. */
export function admitToasts(events: readonly ToastEvent[], heights: ReadonlyMap<number, number>, budget: number, gap = 8, previewHeight = 24) {
  const visible: number[] = [];
  let used = 0;
  for (const event of events) {
    const height = heights.get(event.id);
    if (height === undefined) break;
    if (!visible.length && height > budget) {
      event.manual = true;
      return { visible: [event.id], preview: undefined, oversized: event.id };
    }
    const next = used + (visible.length ? gap : 0) + height;
    if (visible.length === 3 || next > budget) break;
    visible.push(event.id); used = next;
  }
  if (visible.length && visible.length < events.length) {
    while (visible.length > 1 && used + gap + previewHeight > budget) {
      const removed = visible.pop()!;
      used -= (heights.get(removed) ?? 0) + gap;
    }
    if (used + gap + previewHeight <= budget) return { visible, preview: events[visible.length]?.id, oversized: undefined };
  }
  return { visible, preview: undefined, oversized: undefined };
}
