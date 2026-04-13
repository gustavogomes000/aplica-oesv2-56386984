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
      const updateSW = registerSW({
        immediate: true,
        onNeedRefresh() {
          updateSW(true);
        },
        onRegisteredSW(_swUrl, r) {
          if (r) {
            r.update();
            setInterval(() => r.update(), 5 * 60 * 1000);
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
