import { useEffect } from "react";
import { motion } from "framer-motion";
import NeuralNetworkBg from "@/components/NeuralNetworkBg";
import {
  Handshake,
  ReceiptText,
  ClipboardCheck,
  UserRoundPlus,
  Laptop,
  BarChart3,
  Globe,
  ArrowUpRight,
  Building2,
} from "lucide-react";

const PHOTO_URL =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699400706d955b03c8c19827/16e72069d_WhatsAppImage2026-02-17at023641.jpeg";

const apps = [
  {
    id: "rede",
    title: "Rede",
    desc: "Cadastro de lideranças da campanha",
    badge: "Articulação",
    Icon: Handshake,
    gradient: "from-pink-500 to-rose-600",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
    url: "https://rede.deputadasarelli.com.br/",
  },
  {
    id: "contas-pagar",
    title: "Contas a Pagar",
    desc: "Lançamento de contas do escritório",
    badge: "Finanças",
    Icon: ReceiptText,
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    url: "https://contas.deputadasarelli.com.br",
  },
  {
    id: "visitas",
    title: "Visitas",
    desc: "Registros de visitas ao escritório",
    badge: "Escritório",
    Icon: ClipboardCheck,
    gradient: "from-rose-400 to-pink-600",
    iconBg: "bg-gradient-to-br from-rose-400 to-pink-600",
    url: "https://visitas.deputadasarelli.com.br/",
  },
  {
    id: "pagamentos",
    title: "Pagamentos",
    desc: "Gestão de pagamentos e cadastros",
    badge: "Financeiro",
    Icon: UserRoundPlus,
    gradient: "from-pink-400 to-fuchsia-600",
    iconBg: "bg-gradient-to-br from-pink-400 to-fuchsia-600",
    url: "https://pagamentos.deputadasarelli.com.br/",
  },
  {
    id: "computadores",
    title: "Computadores",
    desc: "Gestão e acesso remoto de TI",
    badge: "TI",
    Icon: Laptop,
    gradient: "from-indigo-400 to-blue-600",
    iconBg: "bg-gradient-to-br from-indigo-400 to-blue-600",
    url: "https://computadores.deputadasarelli.com.br/",
  },
  {
    id: "dados",
    title: "Dados do Site",
    desc: "Análises e inteligência digital",
    badge: "Analytics",
    Icon: BarChart3,
    gradient: "from-teal-400 to-cyan-600",
    iconBg: "bg-gradient-to-br from-teal-400 to-cyan-600",
    url: "https://paineldedados.deputadasarelli.com.br/",
  },
  {
    id: "sindspag",
    title: "SINDSPAG",
    desc: "Gestão sindical e associados",
    badge: "Sindicato",
    Icon: Building2,
    gradient: "from-amber-400 to-orange-600",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-600",
    url: "https://sindspag.deputadasarelli.com.br/",
  },
  {
    id: "site",
    title: "Site Oficial",
    desc: "Portal institucional da campanha",
    badge: "Presença",
    Icon: Globe,
    gradient: "from-pink-400 to-rose-500",
    iconBg: "bg-gradient-to-br from-pink-400 to-rose-500",
    url: "https://www.deputadasarelli.com.br",
  },
] as const;

type App = (typeof apps)[number];

function AppCard({ app, index }: { app: App; index: number }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(app.url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group relative block cursor-pointer"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.04 * index + 0.2,
        type: "spring",
        stiffness: 200,
        damping: 22,
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-pink-200/40 group-hover:border-pink-300/60">
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-pink-50/50 via-transparent to-rose-50/30" />

        <div className="relative p-4 sm:p-5">
          {/* Icon + Badge row */}
          <div className="flex items-start justify-between mb-3">
            <motion.div
              className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${app.iconBg} shadow-md`}
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <app.Icon size={20} strokeWidth={1.8} className="text-white" />
            </motion.div>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] text-pink-500/70 bg-pink-50 border border-pink-200/50 px-2 py-0.5 rounded-full">
              {app.badge}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-foreground mb-1 flex items-center gap-1.5">
            {app.title}
            <ArrowUpRight
              size={14}
              className="text-pink-300 group-hover:text-pink-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
            />
          </h3>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {app.desc}
          </p>
        </div>

        {/* Bottom accent */}
        <div
          className={`h-[3px] w-full bg-gradient-to-r ${app.gradient} transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100`}
        />
      </div>
    </motion.a>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Home() {
  useEffect(() => {}, []);

  const dateStr = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden select-none">
      <NeuralNetworkBg />

      <div className="relative z-10 flex flex-col min-h-[100dvh]">
        {/* ── HERO ── */}
        <motion.header
          className="w-full"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-8 pb-4 sm:pt-12 sm:pb-6">
            <div className="flex flex-col items-center text-center">
              {/* Photo */}
              <motion.div
                className="relative mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 0deg, hsl(340,82%,55%), hsl(350,70%,70%), hsl(330,60%,65%), hsl(340,82%,55%))",
                      padding: "3px",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-background" />
                  </motion.div>
                  <div className="absolute inset-[5px] rounded-full overflow-hidden shadow-lg">
                    <img
                      src={PHOTO_URL}
                      alt="Dra. Fernanda Sarelli"
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-pink-400 mb-1">
                  Doutora Fernanda
                </p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                  SARELLI
                </h1>
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] text-pink-400/60 mt-0.5">
                  Chama a Doutora
                </p>
              </motion.div>

              {/* Divider */}
              <motion.div
                className="w-48 sm:w-64 mt-4 mb-3"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-pink-500/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Central de Operações
              </motion.p>

              <motion.p
                className="text-[10px] sm:text-xs text-muted-foreground/50 capitalize mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {getGreeting()} — {dateStr}
              </motion.p>
            </div>
          </div>
        </motion.header>

        {/* ── APPS GRID ── */}
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:sm:col-span-1">
            {apps.map((app, i) => (
              <AppCard key={app.id} app={app} index={i} />
            ))}
          </div>
        </main>

        {/* ── FOOTER ── */}
        <motion.footer
          className="max-w-2xl w-full mx-auto px-5 sm:px-6 pb-6 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="h-px mb-4 bg-gradient-to-r from-transparent via-pink-200/50 to-transparent" />
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-[10px] sm:text-[11px] text-muted-foreground/40 font-medium">
              Pré-candidata a Deputada Estadual — GO 2026
            </p>
            <a
              href="https://www.deputadasarelli.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-[11px] text-pink-400 hover:text-pink-500 transition-colors font-medium"
            >
              drafernandasarelli.com.br
            </a>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
