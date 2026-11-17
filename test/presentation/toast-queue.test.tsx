import { expect, it } from "vitest";
import { admitToasts, ToastQueue } from "@presentation/App/components/OutcomeFeedback/state/toast-queue";

it("retains distinct identical outcomes, FIFO overflow and unspent queued duration", () => {
  const queue = new ToastQueue();
  for (let i = 0; i < 5; i++) queue.add("Group created and retained.", "success");
  const heights = new Map(queue.events.map(event => [event.id, 60]));
  const layout = admitToasts(queue.events, heights, 384);
  expect(layout.visible).toEqual([1, 2, 3]); expect(layout.preview).toBe(4);
  queue.advance(3000, layout.visible, new Set([2]), false);
  expect(queue.events.map(event => event.remaining)).toEqual([2000, 5000, 2000, 5000, 5000]);
  queue.advance(9000, layout.visible, new Set(), true);
  expect(queue.events[0].remaining).toBe(2000);
  queue.advance(2000, layout.visible, new Set([2]), false);
  queue.advance(150, layout.visible, new Set([1, 3]), true);
  expect(queue.events.map(event => event.id)).toEqual([2, 4, 5]);
});
it("announces only admitted visible/unobscured events, exactly once", () => {
  const queue = new ToastQueue(); queue.add("Done", "success"); queue.add("Done", "success");
  expect(queue.announce([1], true)).toEqual([]);
  expect(queue.announce([1], false).map(event => event.id)).toEqual([1]);
  expect(queue.announce([1], false)).toEqual([]);
  expect(queue.announce([2], false).map(event => event.id)).toEqual([2]);
  queue.clear(); expect(queue.announce([1, 2], false)).toEqual([]);
  expect(queue.add("Done", "success").id).toBe(3);
});
it("reserves a decorative preview without displacing the sole complete message", () => {
  const queue = new ToastQueue(); for (let i = 0; i < 5; i++) queue.add("Done", "information");
  const heights = new Map(queue.events.map(event => [event.id, 60]));
  expect(admitToasts(queue.events, heights, 180)).toEqual({visible: [1, 2], preview: 3, oversized: undefined});
  expect(admitToasts(queue.events, heights, 80)).toEqual({visible: [1], preview: undefined, oversized: undefined});
});
it("keeps oversized outcomes manual after growth and preserves remaining duration on resize", () => {
  const queue = new ToastQueue(); queue.add("Long", "information"); queue.add("Short", "success");
  const heights = new Map([[1, 300], [2, 60]]);
  expect(admitToasts(queue.events, heights, 150)).toEqual({visible: [1], preview: undefined, oversized: 1});
  const grown = admitToasts(queue.events, heights, 384);
  queue.advance(10000, grown.visible, new Set(), false);
  expect(queue.events[0].remaining).toBe(5000); expect(queue.events[0].manual).toBe(true);
  const second = new ToastQueue(); second.add("A", "success"); second.add("B", "success");
  second.advance(2000, [1, 2], new Set(), false);
  const smaller = admitToasts(second.events, new Map([[1, 60], [2, 60]]), 80);
  second.advance(1000, smaller.visible, new Set(), false);
  expect(second.events.map(event => event.remaining)).toEqual([2000, 3000]);
});
