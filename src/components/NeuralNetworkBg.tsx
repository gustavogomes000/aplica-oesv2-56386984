import { useEffect, useRef, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
  layer: number;
}

const PINK = "340,70%,65%";
const ROSE = "350,60%,72%";
const MAGENTA = "330,55%,60%";

const COLORS = [PINK, ROSE, MAGENTA];
const NODE_COUNT_DESKTOP = 45;
const NODE_COUNT_MOBILE = 25;
const CONN_DIST = 220;

export default function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef(0);
  const timeRef = useRef(0);

  const initNodes = useCallback((w: number, h: number) => {
    const count = w < 640 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      nodes.push({
        x, y, originX: x, originY: y,
        vx: 0, vy: 0,
        radius: 1.2 + Math.random() * 2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.002 + Math.random() * 0.003,
        layer: Math.floor(Math.random() * 3),
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
      initNodes(window.innerWidth, window.innerHeight);
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

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const t = timeRef.current;
      timeRef.current += 0.002;

      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.pulse += n.pulseSpeed;
        const driftX = Math.sin(t * 0.3 + n.pulse * 2) * 15;
        const driftY = Math.cos(t * 0.25 + n.pulse * 1.5) * 15;
        const targetX = n.originX + driftX;
        const targetY = n.originY + driftY;
        n.vx += (targetX - n.x) * 0.0008;
        n.vy += (targetY - n.y) * 0.0008;

        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 1) {
          const force = (1 - dist / 150) * 0.4;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
        }

        n.vx *= 0.97;
        n.vy *= 0.97;
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -40) { n.x = w + 40; n.originX = w + 40; }
        if (n.x > w + 40) { n.x = -40; n.originX = -40; }
        if (n.y < -40) { n.y = h + 40; n.originY = h + 40; }
        if (n.y > h + 40) { n.y = -40; n.originY = -40; }
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const ddx = a.x - b.x, ddy = a.y - b.y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < CONN_DIST) {
            const strength = 1 - dist / CONN_DIST;
            const alpha = strength * strength * 0.12;
            const color = COLORS[a.layer % 3];
            const midX = (a.x + b.x) / 2 + Math.sin(t * 1.2 + i + j) * 5 * strength;
            const midY = (a.y + b.y) / 2 + Math.cos(t * 1 + i - j) * 5 * strength;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo(midX, midY, b.x, b.y);
            ctx.strokeStyle = `hsla(${color},${alpha})`;
            ctx.lineWidth = strength * 1.2;
            ctx.stroke();

            if (strength > 0.55) {
              const signalT = (t * 0.4 + i * 0.3) % 1;
              const inv = 1 - signalT;
              const sx = inv * inv * a.x + 2 * inv * signalT * midX + signalT * signalT * b.x;
              const sy = inv * inv * a.y + 2 * inv * signalT * midY + signalT * signalT * b.y;
              ctx.beginPath();
              ctx.arc(sx, sy, 1.5 + strength, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${COLORS[b.layer % 3]},${strength * 0.3})`;
              ctx.fill();
            }
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        const p = Math.sin(n.pulse) * 0.5 + 0.5;
        const r = n.radius * (0.8 + p * 0.4);
        const alpha = 0.25 + p * 0.3;
        const color = COLORS[n.layer % 3];

        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color},${alpha * 0.06})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color},${alpha * 0.5})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color},${alpha * 0.8})`;
        ctx.fill();
      }

      // Mouse glow
      if (mouse.x > 0 && mouse.y > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 130);
        grad.addColorStop(0, `hsla(${PINK},0.06)`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - 130, mouse.y - 130, 260, 260);
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
      style={{
        background: "radial-gradient(ellipse at 50% 30%, hsl(340,60%,95%) 0%, hsl(340,40%,93%) 40%, hsl(340,30%,90%) 100%)",
      }}
    />
  );
}
