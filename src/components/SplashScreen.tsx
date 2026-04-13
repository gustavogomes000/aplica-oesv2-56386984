import logoSarelli from "@/assets/Logo_Sarelli_opt.png";

/**
 * Lightweight splash — CSS animations only, no framer-motion.
 * Renders instantly, no JS animation overhead.
 */
export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(340 50% 97%) 0%, hsl(335 45% 95%) 25%, hsl(345 40% 96%) 50%, hsl(340 35% 94%) 100%)",
        }}
      />

      {/* Floating orbs — CSS only */}
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center splash-reveal">
        <img
          src={logoSarelli}
          alt="Sarelli"
          className="w-44 sm:w-56 h-auto object-contain"
          fetchPriority="high"
        />

        <div className="flex items-center gap-3 mt-4 splash-reveal-delay">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/40" />
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-primary/60">
            Central de Operações
          </p>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/40" />
        </div>
      </div>

      {/* Loading bar */}
      <div className="relative z-10 mt-10 w-8 h-[2px] rounded-full bg-primary/20 overflow-hidden splash-reveal-delay">
        <div className="splash-loading-bar" />
      </div>
    </div>
  );
}
