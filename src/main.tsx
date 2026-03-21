import { createRoot } from "react-dom/client";
import { initObservability } from "./lib/observability";
import App from "./App";
import "./index.css";

// Enterprise Observability
initObservability();

createRoot(document.getElementById("root")!).render(<App />);

