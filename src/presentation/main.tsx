import { createRoot } from "react-dom/client";
import { RetainedApp } from "@presentation/app/RetainedApp";
import "@presentation/styles/global.css";
createRoot(document.getElementById("root")!).render(<RetainedApp />);
