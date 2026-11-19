import { BrowserRetention } from "@adapters/browser/indexeddb-retention";
import { installWorkbenchWorker } from "@hosts/browser/worker-runtime";
installWorkbenchWorker(new BrowserRetention());
