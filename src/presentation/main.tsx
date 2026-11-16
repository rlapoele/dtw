import { createRoot } from "react-dom/client";
import { App } from "@presentation/App/App";
import "@presentation/styles/global.css";
createRoot(document.getElementById("root")!).render(<App />);
