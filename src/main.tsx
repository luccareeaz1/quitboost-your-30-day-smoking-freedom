import { createRoot } from "react-dom/client";
import { initObservability } from "./lib/observability";
import App from "./App";
import "./index.css";
import "./i18n";

// Enterprise Observability
initObservability();

createRoot(document.getElementById("root")!).render(<App />);

// Progressive Web App Support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('SW registration failed: ', err);
    });
  });
}

