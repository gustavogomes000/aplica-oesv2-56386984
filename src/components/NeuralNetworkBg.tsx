import { motion } from "framer-motion";

/**
 * Premium animated background with floating gradient blobs
 * Inspired by Linear, Stripe, Vercel dashboard aesthetics
 */
export default function NeuralNetworkBg() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
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

      {/* Floating blob 1 - Large pink */}
      <motion.div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: "45vw",
          height: "45vw",
          maxWidth: "600px",
          maxHeight: "600px",
          background: "radial-gradient(circle, hsla(340,85%,65%,0.18) 0%, hsla(340,80%,70%,0.05) 70%, transparent 100%)",
          top: "-5%",
          left: "-10%",
        }}
        animate={{
          x: [0, 80, 30, 0],
          y: [0, 60, 100, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating blob 2 - Rose accent */}
      <motion.div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: "500px",
          maxHeight: "500px",
          background: "radial-gradient(circle, hsla(350,75%,60%,0.15) 0%, hsla(350,70%,65%,0.04) 70%, transparent 100%)",
          bottom: "-10%",
          right: "-5%",
        }}
        animate={{
          x: [0, -70, -20, 0],
          y: [0, -80, -40, 0],
          scale: [1, 1.1, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating blob 3 - Purple tint */}
      <motion.div
        className="absolute rounded-full blur-[90px]"
        style={{
          width: "30vw",
          height: "30vw",
          maxWidth: "400px",
          maxHeight: "400px",
          background: "radial-gradient(circle, hsla(310,60%,70%,0.12) 0%, hsla(310,55%,75%,0.03) 70%, transparent 100%)",
          top: "40%",
          right: "15%",
        }}
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 50, -30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating blob 4 - Warm pink */}
      <motion.div
        className="absolute rounded-full blur-[80px]"
        style={{
          width: "25vw",
          height: "25vw",
          maxWidth: "350px",
          maxHeight: "350px",
          background: "radial-gradient(circle, hsla(0,65%,72%,0.1) 0%, transparent 70%)",
          top: "60%",
          left: "10%",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 60, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Subtle grid pattern */}
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
