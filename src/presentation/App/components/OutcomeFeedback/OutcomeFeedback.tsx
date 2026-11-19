import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@presentation/ui/icon";
import { admitToasts, ToastQueue, type OutcomeKind } from "@presentation/App/components/OutcomeFeedback/state/toast-queue";

type OutcomeDelivery = { publish(message: string, kind?: OutcomeKind): void; clear(): void; recover(message: string, finish?: (clarification?: string) => void): void };
const Context = createContext<OutcomeDelivery>({ publish() {}, clear() {}, recover(_message, finish) { finish?.(_message); } });
export const useOutcomeFeedback = () => useContext(Context);
function available(element: HTMLElement | null): element is HTMLElement {
  return !!element?.isConnected && !element.closest('[hidden], [inert], [aria-hidden="true"]') && !element.matches(':disabled, [aria-disabled="true"]') && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
}
export function OutcomeFeedback({ children }: { children: ReactNode }) {
  const [queue] = useState(() => new ToastQueue());
  const [, render] = useState(0);
  const [announcements, setAnnouncements] = useState<{id: number; message: string}[]>([]);
  const measure = useRef<HTMLDivElement>(null), stack = useRef<HTMLDivElement>(null);
  const heights = useRef(new Map<number, number>());
  const paused = useRef(new Set<number>());
  const focusedToast = useRef<number | null>(null);
  const environment = useRef({ blocked: false, budget: 384, rem: 16 });
  const tickTime = useRef(0);
  const [delivery] = useState<OutcomeDelivery>(() => ({
    publish(message, kind = "success") {
      queue.add(message, kind, document.activeElement instanceof HTMLElement ? document.activeElement : null);
      render(v => v + 1);
    },
    clear() { focusedToast.current = null; queue.clear(); heights.current.clear(); paused.current.clear(); setAnnouncements([]); render(v => v + 1); },
    recover(message, finish) {
      if (finish) finish(message);
      else delivery.publish(message, "information");
    },
  }));
  const layout = admitToasts(queue.events, heights.current, environment.current.budget, environment.current.rem / 2, environment.current.rem * 1.5);
  const current = useRef(layout); current.current = layout;
  function returnFocus(id: number) {
    const next = queue.events.find(event => event.id !== id && event.exiting === null && current.current.visible.includes(event.id));
    const button = next ? stack.current?.querySelector<HTMLElement>(`[data-toast-close="${next.id}"]`) ?? null : null;
    const original = queue.events.find(event => event.id === id)?.trigger ?? null;
    const fallback = document.querySelector<HTMLElement>('main, [data-workspace-landmark]');
    if (available(button)) button.focus();
    else if (available(original)) original.focus();
    else if (available(fallback)) { fallback.tabIndex = -1; fallback.focus(); }
  }
  function dismiss(id: number) {
    const element = stack.current?.querySelector(`[data-toast="${id}"]`);
    queue.dismiss(id);
    focusedToast.current = null;
    if (element?.contains(document.activeElement)) returnFocus(id);
    paused.current.delete(id);
    render(v => v + 1);
  }
  useLayoutEffect(() => {
    const focused = focusedToast.current;
    if (focused !== null && !layout.visible.includes(focused)) {
      focusedToast.current = null;
      paused.current.delete(focused);
      returnFocus(focused);
    }
    let changed = false;
    measure.current?.querySelectorAll<HTMLElement>('[data-measure]').forEach(element => {
      const id = Number(element.dataset.measure), height = element.getBoundingClientRect().height;
      if (heights.current.get(id) !== height) { heights.current.set(id, height); changed = true; }
    });
    if (changed) render(v => v + 1);
  });
  useEffect(() => {
    function inspect() {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const modal = [...document.querySelectorAll<HTMLElement>('[aria-modal="true"]')].some(available);
      const blocked = document.hidden || modal;
      const budget = Math.max(36, Math.min(24 * rem, ((window.visualViewport?.height ?? innerHeight) - 3 * rem) / 2));
      if (blocked !== environment.current.blocked || budget !== environment.current.budget || rem !== environment.current.rem) {
        tickTime.current = performance.now();
        environment.current = { blocked, budget, rem }; render(v => v + 1);
      }
    }
    inspect();
    const observer = new MutationObserver(inspect);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-modal', 'hidden', 'inert', 'data-ending-style'] });
    const resize = new ResizeObserver(() => { heights.current.clear(); inspect(); render(v => v + 1); });
    if (measure.current) resize.observe(measure.current);
    document.addEventListener('visibilitychange', inspect);
    window.addEventListener('resize', inspect);
    window.visualViewport?.addEventListener('resize', inspect);
    function key(event: KeyboardEvent) {
      if (event.key !== 'F8' || environment.current.blocked) return;
      const target = queue.events.find(item => item.exiting === null && current.current.visible.includes(item.id));
      const button = target ? stack.current?.querySelector<HTMLElement>(`[data-toast-close="${target.id}"]`) ?? null : null;
      if (available(button)) { event.preventDefault(); button.focus(); }
    }
    document.addEventListener('keydown', key);
    tickTime.current = performance.now();
    const timer = setInterval(() => {
      const now = performance.now(), elapsed = now - tickTime.current; tickTime.current = now;
      // A queued/resized focused body must never disappear with focus inside it.
      const focused = document.activeElement?.closest<HTMLElement>('[data-toast]');
      if (focused && !current.current.visible.includes(Number(focused.dataset.toast))) returnFocus(Number(focused.dataset.toast));
      const eligible = queue.announce(current.current.visible, environment.current.blocked);
      if (eligible.length) setAnnouncements(previous => [...previous, ...eligible.map(({ id, message }) => ({ id, message }))]);
      if (queue.events.length) {
        const before = queue.events.length;
        queue.advance(elapsed, current.current.visible, paused.current, environment.current.blocked);
        if (queue.events.length !== before) {
          const active = new Set(queue.events.map(event => event.id));
          setAnnouncements(previous => previous.filter(event => active.has(event.id)));
          for (const id of heights.current.keys()) if (!active.has(id)) heights.current.delete(id);
          for (const id of paused.current) if (!active.has(id)) paused.current.delete(id);
        }
        render(v => v + 1);
      }
    }, 50);
    return () => { clearInterval(timer); observer.disconnect(); resize.disconnect(); document.removeEventListener('keydown', key); document.removeEventListener('visibilitychange', inspect); window.removeEventListener('resize', inspect); window.visualViewport?.removeEventListener('resize', inspect); };
  }, [queue]);
  return <Context.Provider value={delivery}>
    {children}
    <div className="sr-only" role="status" aria-live="polite" aria-relevant="additions" aria-atomic="false">{announcements.map(item => <div key={item.id}>{item.message}</div>)}</div>
    <div ref={measure} className="toast-measure" aria-hidden="true" inert>{queue.events.map(event => <div key={event.id} data-measure={event.id} className="toast-card"><Icon name="info" /><div className="min-w-0 wrap-anywhere">{event.message}</div><span className="size-9" /></div>)}</div>
    <div ref={stack} className="toast-stack" hidden={environment.current.blocked} aria-label="Notifications">
      {queue.events.filter(event => layout.visible.includes(event.id)).map(event => <div key={event.id} data-toast={event.id} data-exiting={event.exiting !== null || undefined} className={`toast-card notification notification-${event.kind}`} onMouseEnter={() => paused.current.add(event.id)} onMouseLeave={e => { if (!e.currentTarget.contains(document.activeElement)) paused.current.delete(event.id); }} onFocus={() => { focusedToast.current = event.id; paused.current.add(event.id); }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) { focusedToast.current = null; if (!e.currentTarget.matches(':hover')) paused.current.delete(event.id); } }}>
        <Icon name="info" className="mt-0.5" />
        <div className="toast-body min-w-0 wrap-anywhere" tabIndex={layout.oversized === event.id ? 0 : undefined} aria-label={layout.oversized === event.id ? "Notification message" : undefined} style={layout.oversized === event.id ? { maxHeight: Math.max(8, environment.current.budget - environment.current.rem * 1.75 - 2), overflowY: 'auto' } : undefined}>{event.message}</div>
        <button type="button" data-toast-close={event.id} disabled={event.exiting !== null} className="size-9 shrink-0 rounded flex items-center justify-center" aria-label={`Dismiss ${event.kind} notification`} onClick={() => dismiss(event.id)}><Icon name="close" /></button>
      </div>)}
      {layout.preview !== undefined && (() => { const event = queue.events.find(item => item.id === layout.preview)!; return <div aria-hidden="true" inert className={`toast-preview notification notification-${event.kind}`}><Icon name="info" /><span>{event.message}</span></div>; })()}
    </div>
  </Context.Provider>;
}
