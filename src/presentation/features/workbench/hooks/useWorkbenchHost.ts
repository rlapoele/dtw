import { useEffect, useRef } from "react";
import type { WorkbenchHost } from "@presentation/host/protocol";
/** Own the host lifetime; reset is explicit after leaving an unknown result. */
export function useWorkbenchHost(createHost: () => WorkbenchHost) {
  const host = useRef<WorkbenchHost | undefined>(undefined);
  function ensure() {
    return (host.current ??= createHost());
  }
  function reset() {
    host.current?.dispose();
    host.current = undefined;
  }
  useEffect(() => {
    ensure();
    return reset;
  }, []);
  return { host, ensure, reset };
}
