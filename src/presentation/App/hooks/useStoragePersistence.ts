import { useEffect, useRef, useState } from "react";
import { checkPersistentStorage, requestPersistentStorage, type StoragePersistenceResult } from "@adapters/browser/storage-preference";

export type StoragePersistenceStatus = StoragePersistenceResult | "checking" | "requesting";

/** Advisory browser preference only; never participates in command acceptance. */
export function useStoragePersistence() {
  const [status, setStatus] = useState<StoragePersistenceStatus>("checking");
  const actual = useRef<StoragePersistenceStatus>("checking");
  const startup = useRef<Promise<void> | undefined>(undefined);
  const flight = useRef<Promise<void> | undefined>(undefined);
  const attempted = useRef(false);
  function publish(next: StoragePersistenceStatus) {
    actual.current = next;
    setStatus(next);
  }
  function initialize() {
    startup.current ??= checkPersistentStorage().then(publish);
    return startup.current;
  }
  useEffect(() => { void initialize(); }, []);

  async function automatic() {
    await initialize();
    if (attempted.current || actual.current === "protected" || actual.current === "unsupported") return;
    attempted.current = true;
    publish("requesting");
    flight.current = requestPersistentStorage().then(publish);
    await flight.current;
    flight.current = undefined;
  }
  function onRetained() {
    // Native failures are represented as results by the adapter. Keep this
    // notification synchronous and independent of consume/readback/open.
    void automatic();
  }
  function retry() {
    if (flight.current || actual.current === "checking" || actual.current === "requesting" || actual.current === "protected" || actual.current === "unsupported") return;
    attempted.current = true;
    publish("checking");
    flight.current = (async () => {
      const checked = await checkPersistentStorage();
      publish(checked);
      if (checked === "protected" || checked === "unsupported" || checked === "check-error") return;
      publish("requesting");
      publish(await requestPersistentStorage());
    })().finally(() => { flight.current = undefined; });
  }
  return { status, onRetained, retry };
}
