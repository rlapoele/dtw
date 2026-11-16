import { BrowserRetention } from "@adapters/browser/indexeddb-retention";
import { installWorkbenchWorker } from "./worker-runtime";
installWorkbenchWorker(new BrowserRetention());
