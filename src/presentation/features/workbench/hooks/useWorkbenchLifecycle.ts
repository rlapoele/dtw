import { useEffect, useRef } from 'react';
import type { WorkbenchHost, ProjectHeader } from '@presentation/host/protocol';
/** Lifecycle recovery only. Authoring acceptance/readback keep their existing owners. */
export function useWorkbenchLifecycle({ host, projectId, busy, unknown, dirty, formDirty, setBlocked, refresh, setReadFailure }: {
  host: WorkbenchHost; projectId: string; busy: boolean; unknown: boolean; dirty: boolean; formDirty: boolean;
  setBlocked(value: boolean): void; refresh(header?: ProjectHeader): Promise<unknown>; setReadFailure(message: string): void;
}) {
  const lifecycle = useRef({busy, unknown});
  lifecycle.current = {busy, unknown};
  useEffect(() => {
    const pause = () => { setBlocked(true); void host.call('suspend',null).catch(() => {}); };
    const resume = () => {
      setBlocked(true);
      if (lifecycle.current.busy || lifecycle.current.unknown) return;
      void host.call('resume', projectId).then(next => refresh(next)).then(() => setBlocked(false))
        .catch(e => setReadFailure(e instanceof Error ? e.message : 'Lifecycle recovery unavailable'));
    };
    addEventListener('pagehide',pause); addEventListener('freeze',pause);
    addEventListener('pageshow',resume); addEventListener('focus',resume);
    return () => { removeEventListener('pagehide',pause); removeEventListener('freeze',pause); removeEventListener('pageshow',resume); removeEventListener('focus',resume); };
  }, [host, projectId]);
  useEffect(() => {
    const protect = (event: BeforeUnloadEvent) => {
      if (dirty || formDirty || busy || unknown) { event.preventDefault(); event.returnValue = ''; }
    };
    addEventListener('beforeunload', protect);
    return () => removeEventListener('beforeunload',protect);
  }, [dirty, formDirty, busy, unknown]);
}
