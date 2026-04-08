import { motion } from "framer-motion";
import logoSarelli from "@/assets/Logo_Sarelli_opt.png";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(340 50% 97%) 0%, hsl(335 45% 95%) 25%, hsl(345 40% 96%) 50%, hsl(340 35% 94%) 100%)",
        }}
        animate={{
          background: [
            "linear-gradient(135deg, hsl(340 50% 97%) 0%, hsl(335 45% 95%) 25%, hsl(345 40% 96%) 50%, hsl(340 35% 94%) 100%)",
            "linear-gradient(225deg, hsl(345 45% 96%) 0%, hsl(340 50% 97%) 25%, hsl(330 40% 95%) 50%, hsl(350 35% 96%) 100%)",
            "linear-gradient(315deg, hsl(340 50% 97%) 0%, hsl(335 45% 95%) 25%, hsl(345 40% 96%) 50%, hsl(340 35% 94%) 100%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full blur-[100px]"
        style={{ background: "hsla(340,80%,65%,0.2)", top: "10%", left: "10%" }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full blur-[80px]"
        style={{ background: "hsla(350,70%,60%,0.15)", bottom: "10%", right: "10%" }}
        animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo with reveal animation */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          src={logoSarelli}
          alt="Sarelli"
          className="w-44 sm:w-56 h-auto object-contain"
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        <motion.div
          className="flex items-center gap-3 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/40" />
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-primary/60">
            Central de Operações
          </p>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/40" />
        </motion.div>
      </motion.div>

      {/* Elegant loading indicator */}
      <motion.div
        className="relative z-10 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="w-8 h-[2px] rounded-full bg-primary/40 overflow-hidden"
        >
          <motion.div
            className="h-full w-1/2 rounded-full bg-primary"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
