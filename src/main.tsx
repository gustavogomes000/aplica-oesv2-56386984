import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ── PWA: guard service worker in iframe/preview ──
const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();
const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

if (isPreviewHost || isInIframe) {
  navigator.serviceWorker?.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  });
}

// ── Render ──
createRoot(document.getElementById("root")!).render(<App />);

// ── Register SW only in production, outside iframes ──
if (!isPreviewHost && !isInIframe && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    import("virtual:pwa-register").then(({ registerSW }) => {
      registerSW({
        immediate: true,
        onRegisteredSW(swUrl, r) {
          // Check for updates every 30 min
          if (r) {
            setInterval(() => r.update(), 30 * 60 * 1000);
          }
        },
        onOfflineReady() {
          console.log("[PWA] App ready for offline use");
        },
      });
    }).catch(() => {
      // SW registration not available
    });
  });
}
