/**
 * Lightweight premium background — pure CSS animations, no JS overhead.
 * Uses GPU-accelerated transforms + will-change for smooth 60fps.
 */
export default function NeuralNetworkBg() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(340 50% 97%) 0%, hsl(330 40% 95%) 30%, hsl(350 45% 96%) 60%, hsl(340 35% 94%) 100%)",
        }}
      />

      {/* Mesh gradient overlay */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, hsla(340,80%,75%,0.15) 0%, transparent 60%), " +
            "radial-gradient(ellipse 70% 50% at 80% 80%, hsla(350,70%,70%,0.12) 0%, transparent 55%), " +
            "radial-gradient(ellipse 50% 40% at 50% 50%, hsla(325,60%,80%,0.08) 0%, transparent 50%)",
        }}
      />

      {/* CSS-only floating blobs — no framer-motion overhead */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Subtle noise */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(hsla(340,50%,50%,0.5) 1px, transparent 1px), linear-gradient(90deg, hsla(340,50%,50%,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
