import { useEffect, useRef, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulsePhase: number;
  pulseSpeed: number;
}

const COLORS = [
  "340,82%,55%",   // pink/primary
  "270,76%,55%",   // violet
  "200,80%,50%",   // cyan
  "150,70%,50%",   // emerald
];

const CONNECTION_DISTANCE = 180;
const NODE_COUNT_DESKTOP = 55;
const NODE_COUNT_MOBILE = 30;

export default function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);

  const initNodes = useCallback((w: number, h: number) => {
    const count = w < 640 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1.5 + Math.random() * 2,
        color: COLORS[i % COLORS.length],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.015,
      });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodesRef.current.length === 0) {
        initNodes(window.innerWidth, window.innerHeight);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0]?.clientX ?? -1000 : e.clientX;
      const y = "touches" in e ? e.touches[0]?.clientY ?? -1000 : e.clientY;
      mouseRef.current = { x, y };
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("touchmove", handleMouse, { passive: true });

    let time = 0;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      time++;

      ctx.clearRect(0, 0, w, h);

      // Update positions
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges softly
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
        node.x = Math.max(0, Math.min(w, node.x));
        node.y = Math.max(0, Math.min(h, node.y));

        // Mouse attraction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250 && dist > 10) {
          node.vx += (dx / dist) * 0.02;
          node.vy += (dy / dist) * 0.02;
        }

        // Speed limit
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 0.8) {
          node.vx *= 0.8 / speed;
          node.vy *= 0.8 / speed;
        }

        node.pulsePhase += node.pulseSpeed;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;

            // "Signal" traveling along connection
            const signal = (Math.sin(time * 0.03 + i * 0.5) + 1) / 2;
            const sx = a.x + (b.x - a.x) * signal;
            const sy = a.y + (b.y - a.y) * signal;

            // Draw line
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${a.color}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Draw signal dot
            if (dist < CONNECTION_DISTANCE * 0.7) {
              const signalAlpha = alpha * 2.5;
              ctx.beginPath();
              ctx.arc(sx, sy, 1, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${b.color}, ${signalAlpha})`;
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const r = node.radius * (0.8 + pulse * 0.5);
        const alpha = 0.3 + pulse * 0.4;

        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node.color}, ${alpha * 0.1})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node.color}, ${alpha})`;
        ctx.fill();
      }

      // Mouse glow
      if (mouse.x > 0 && mouse.y > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        grad.addColorStop(0, "hsla(340,82%,55%,0.06)");
        grad.addColorStop(0.5, "hsla(270,76%,55%,0.02)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - 120, mouse.y - 120, 240, 240);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleMouse);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "hsl(240, 20%, 3%)" }}
    />
  );
}
