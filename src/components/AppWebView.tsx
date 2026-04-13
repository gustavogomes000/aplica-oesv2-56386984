import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  url: string;
  title: string;
  accentColor: string;
  gradient: string;
  Icon: LucideIcon;
  onClose: () => void;
}

/* ─── Lightweight Loading Indicator ─── */
function LoadingIndicator({ accentColor, title, gradient, Icon }: {
  accentColor: string; title: string; gradient: string; Icon: LucideIcon;
}) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background">
      <div
        className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} shadow-xl mb-4 webview-icon-pop`}
        style={{ boxShadow: `0 8px 30px ${accentColor}40` }}
      >
        <Icon size={28} strokeWidth={1.5} className="text-white" />
      </div>
      <p className="text-sm font-bold text-foreground mb-1">{title}</p>
      <p className="text-[11px] text-muted-foreground">Carregando...</p>
      <div className="flex gap-1.5 mt-5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full webview-dot"
            style={{
              background: accentColor,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AppWebView({ url, title, accentColor, gradient, Icon, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Swipe-back gesture (from left edge)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // Swipe right from left edge (< 30px) with > 80px horizontal movement
    if (touchStartX.current < 30 && dx > 80 && dy < 100) {
      onClose();
    }
  }, [onClose]);

  // Hardware back button support
  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      e.preventDefault();
      onClose();
    };
    window.history.pushState({ webview: true }, "");
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-background flex flex-col"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 260 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-border/40 shrink-0"
        style={{
          background: "hsl(340 40% 97% / 0.95)",
          paddingTop: "max(0.5rem, env(safe-area-inset-top))",
        }}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-sm font-semibold text-primary px-2.5 py-1.5 rounded-xl hover:bg-secondary active:scale-95 transition-all"
        >
          <ArrowLeft size={16} />
          <span className="text-xs">Voltar</span>
        </button>

        <div className="flex-1 text-center flex items-center justify-center gap-2 min-w-0">
          <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
            <Icon size={11} className="text-white" />
          </div>
          <p className="text-xs font-bold text-foreground truncate">{title}</p>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => { setLoading(true); setIframeKey((k) => k + 1); }}
            className="p-2 rounded-xl hover:bg-secondary active:scale-95 transition-all text-muted-foreground"
          >
            <RefreshCw size={14} />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl hover:bg-secondary active:scale-95 transition-all text-muted-foreground"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Loading progress bar — CSS only */}
      {loading && (
        <div
          className="h-[2px] shrink-0 webview-progress"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
      )}

      {/* Content area */}
      <div className="relative flex-1">
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loader"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingIndicator
                title={title}
                accentColor={accentColor}
                gradient={gradient}
                Icon={Icon}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <iframe
          key={iframeKey}
          src={url}
          title={title}
          className="w-full h-full border-none bg-background"
          onLoad={() => setLoading(false)}
          loading="eager"
          allow="geolocation; camera; microphone; clipboard-write; clipboard-read"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
        />
      </div>

      {/* Swipe hint indicator — left edge */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 rounded-r-full bg-primary/10" />
    </motion.div>
  );
}
