import type {
  CatalogueEntry,
  CommitOutcome,
  RetainedRead,
  RetentionPort,
  WriteAttempt,
} from "@application/retention/ports";
import {
  decodeRetainedRecord,
  internalId,
} from "@application/retention/record";
export const DATABASE = "dtw-projects-v1";
/** Native browser infrastructure. One complete project record is authoritative;
 * catalogue summaries are derived from those same records, never dual-written. */
export class BrowserRetention implements RetentionPort {
  private readonly held = new Map<string, () => void>();
  private invalidated = false;
  private open(): Promise<IDBDatabase> {
    if (this.invalidated)
      return Promise.reject(
        Error("Browser storage changed. Reload to inspect current state."),
      );
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE, 1);
      let blocked = false;
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore("projects");
        db.createObjectStore("metadata");
        request
          .transaction!.objectStore("metadata")
          .put(crypto.randomUUID(), "incarnation");
      };
      request.onerror = () =>
        reject(request.error ?? Error("Storage unavailable"));
      request.onblocked = () => {
        blocked = true;
        reject(
          Error(
            "Browser storage upgrade is blocked. Close other workbench tabs, then retry.",
          ),
        );
      };
      request.onsuccess = () => {
        const db = request.result;
        if (blocked) {
          db.close();
          return;
        }
        db.onversionchange = () => {
          this.invalidated = true;
          db.close();
          this.releaseAll();
        };
        resolve(db);
      };
    });
  }
  async identity(): Promise<string> {
    const db = await this.open();
    return new Promise<string>((resolve, reject) => {
      const tx = db.transaction("metadata");
      let value: unknown;
      tx.objectStore("metadata").get("incarnation").onsuccess = (e) => {
        value = (e.target as IDBRequest<unknown>).result;
      };
      tx.oncomplete = () => {
        if (internalId(value)) resolve(value);
        else reject(Error("Storage incarnation unavailable"));
      };
      tx.onabort = () => reject(tx.error);
    }).finally(() => db.close());
  }
  async capability(): Promise<void> {
    if (!isSecureContext || !indexedDB || !navigator.locks)
      throw Error(
        "Secure browser storage, Web Locks and an application worker are required.",
      );
    const db = await this.open();
    await new Promise<void>((resolve, reject) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction("metadata", "readwrite", { durability: "strict" });
        if (tx.durability !== "strict") {
          tx.abort();
          reject(Error("Strict browser retention is unavailable."));
          return;
        }
      } catch (e) {
        reject(e);
        return;
      }
      tx.objectStore("metadata").get("incarnation");
      tx.oncomplete = () => resolve();
      tx.onabort = () =>
        reject(tx.error ?? Error("Storage capability check aborted"));
    }).finally(() => db.close());
  }
  async read(id: string): Promise<RetainedRead> {
    const db = await this.open();
    return new Promise<RetainedRead>((resolve, reject) => {
      const tx = db.transaction(["projects", "metadata"]);
      let record: unknown, incarnation: unknown;
      tx.objectStore("projects").get(id).onsuccess = (e) => {
        record = (e.target as IDBRequest<unknown>).result;
      };
      tx.objectStore("metadata").get("incarnation").onsuccess = (e) => {
        incarnation = (e.target as IDBRequest<unknown>).result;
      };
      tx.oncomplete = () => {
        try {
          if (!internalId(incarnation))
            throw Error("Storage incarnation unavailable");
          resolve({
            record:
              record === undefined
                ? undefined
                : decodeRetainedRecord(record, id),
            incarnation,
          });
        } catch (e) {
          reject(e);
        }
      };
      tx.onabort = () => reject(tx.error ?? Error("Project read failed"));
    }).finally(() => db.close());
  }
  async catalogue(): Promise<readonly CatalogueEntry[]> {
    const db = await this.open();
    const rows: CatalogueEntry[] = [];
    let foreignKeyIndex = 0;
    return new Promise<readonly CatalogueEntry[]>((resolve, reject) => {
      const tx = db.transaction("projects");
      const request = tx.objectStore("projects").openCursor();
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return;
        const id = cursor.key;
        if (typeof id !== "string") {
          rows.push({
            rowKey: JSON.stringify(["foreign-storage-key", foreignKeyIndex++]),
            id: JSON.stringify(id),
            status: "unavailable",
            reason: "Unsupported project storage key",
          });
          cursor.continue();
          return;
        }
        try {
          const record = decodeRetainedRecord(cursor.value, id);
          rows.push({
            rowKey: JSON.stringify(["project", id]),
            id,
            status: "supported",
            name: record.snapshot.project.name,
            revision: record.revision,
            tokens: record.snapshot.tokens.length,
            groups: record.snapshot.groups.length,
          });
        } catch (e) {
          rows.push({
            rowKey: JSON.stringify(["project", id]),
            id,
            status: "unavailable",
            reason:
              e instanceof Error
                ? e.message.slice(0, 200)
                : "Project unavailable",
          });
        }
        cursor.continue();
      };
      tx.oncomplete = () => resolve(rows);
      tx.onabort = () => reject(tx.error ?? Error("Projects unavailable"));
    }).finally(() => db.close());
  }
  owns(id: string) {
    return !this.invalidated && this.held.has(id);
  }
  acquire(id: string): Promise<boolean> {
    if (this.owns(id)) return Promise.resolve(true);
    return new Promise((resolve, reject) => {
      navigator.locks
        .request(
          JSON.stringify(["dtw", "project", id]),
          { ifAvailable: true },
          (lock) => {
            if (!lock || this.invalidated) {
              resolve(false);
              return;
            }
            return new Promise<void>((release) => {
              this.held.set(id, release);
              resolve(true);
            });
          },
        )
        .catch(reject);
    });
  }
  async release(id: string) {
    this.held.get(id)?.();
    this.held.delete(id);
  }
  releaseAll() {
    for (const release of this.held.values()) release();
    this.held.clear();
  }
  async commit(attempt: WriteAttempt): Promise<CommitOutcome> {
    if (!this.owns(attempt.projectId))
      return { status: "rejected", reason: "Editing ownership unavailable" };
    let db: IDBDatabase;
    try {
      db = await this.open();
    } catch (e) {
      return { status: "rejected", reason: String(e) };
    }
    if (!this.owns(attempt.projectId)) {
      db.close();
      return { status: "rejected", reason: "Editing ownership unavailable" };
    }
    return new Promise<CommitOutcome>((resolve) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction(["projects", "metadata"], "readwrite", {
          durability: "strict",
        });
        if (tx.durability !== "strict") {
          tx.abort();
          resolve({
            status: "rejected",
            reason: "Strict retention unavailable",
          });
          return;
        }
      } catch (e) {
        resolve({ status: "rejected", reason: String(e) });
        return;
      }
      let ready = 0,
        current: unknown,
        count = 0,
        incarnation: unknown,
        reason = "Retention transaction aborted";
      const store = tx.objectStore("projects");
      const check = () => {
        if (++ready !== 3) return;
        try {
          if (incarnation !== attempt.incarnation)
            throw Error("Storage incarnation changed");
          // Snapshot decoding/preparation happened outside this short transaction.
          const record = current as { revision?: unknown } | undefined;
          if (record !== undefined && !internalId(record.revision))
            throw Error("Retained revision unavailable");
          if ((record?.revision ?? null) !== attempt.expectedRevision)
            throw Error("revision-conflict");
          if (!record && count >= 25)
            throw Error("Browser project capacity reached: 25 records");
          if (!this.owns(attempt.projectId))
            throw Error("Editing ownership unavailable");
          store.put(attempt.record, attempt.projectId);
        } catch (e) {
          reason = e instanceof Error ? e.message : "Acceptance rejected";
          tx.abort();
        }
      };
      store.get(attempt.projectId).onsuccess = (e) => {
        current = (e.target as IDBRequest<unknown>).result;
        check();
      };
      store.count().onsuccess = (e) => {
        count = (e.target as IDBRequest<number>).result;
        check();
      };
      tx.objectStore("metadata").get("incarnation").onsuccess = (e) => {
        incarnation = (e.target as IDBRequest<unknown>).result;
        check();
      };
      tx.oncomplete = () => resolve({ status: "retained" });
      tx.onabort = () => resolve({ status: "rejected", reason });
    }).finally(() => db.close());
  }
}
