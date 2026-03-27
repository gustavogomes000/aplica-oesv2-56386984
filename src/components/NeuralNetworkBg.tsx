import { useEffect, useRef, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  layer: number; // 0=input, 1=hidden1, 2=hidden2, 3=output
  pulsePhase: number;
  pulseSpeed: number;
}

const COLORS = [
  "340,82%,55%",   // pink
  "270,76%,55%",   // violet
  "200,80%,50%",   // cyan
  "150,70%,50%",   // emerald
];

const CONNECTION_DISTANCE = 280;
const NODE_COUNT_DESKTOP = 80;
const NODE_COUNT_MOBILE = 45;

export default function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);

  const initNodes = useCallback((w: number, h: number) => {
    const count = w < 640 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    const nodes: Node[] = [];
    const layers = 4;
    for (let i = 0; i < count; i++) {
      const layer = Math.floor((i / count) * layers);
      // Distribute nodes in loose vertical bands (like neural net layers)
      const bandWidth = w / layers;
      const baseX = layer * bandWidth + bandWidth * 0.15;
      const rangeX = bandWidth * 0.7;
      nodes.push({
        x: baseX + Math.random() * rangeX,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: layer === 0 || layer === 3 ? 2.5 + Math.random() * 1.5 : 1.5 + Math.random() * 2.5,
        color: COLORS[layer % COLORS.length],
        layer,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
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

        // Soft bounds - keep within layer band
        const layers = 4;
        const bandWidth = w / layers;
        const minX = node.layer * bandWidth;
        const maxX = (node.layer + 1) * bandWidth;
        if (node.x < minX + 10) node.vx += 0.02;
        if (node.x > maxX - 10) node.vx -= 0.02;
        if (node.y < 10) node.vy += 0.02;
        if (node.y > h - 10) node.vy -= 0.02;

        // Mouse repulsion for organic feel
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 5) {
          node.vx += (dx / dist) * 0.015;
          node.vy += (dy / dist) * 0.015;
        }

        // Damping
        node.vx *= 0.98;
        node.vy *= 0.98;

        node.pulsePhase += node.pulseSpeed;
      }

      // === Draw connections (the "web/teia") ===
      // Connect nodes between adjacent layers (like a real neural network)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          // Connect: same layer (close) OR adjacent layers (farther)
          const layerDiff = Math.abs(a.layer - b.layer);
          if (layerDiff > 1) continue; // skip non-adjacent layers

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = layerDiff === 0 ? CONNECTION_DISTANCE * 0.5 : CONNECTION_DISTANCE;

          if (dist < maxDist) {
            const rawAlpha = 1 - dist / maxDist;
            // Inter-layer connections are more visible
            const alpha = layerDiff === 1
              ? rawAlpha * 0.25
              : rawAlpha * 0.08;

            // Draw connection line
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${a.color}, ${alpha})`;
            ctx.lineWidth = layerDiff === 1 ? 0.8 : 0.4;
            ctx.stroke();

            // Traveling signal on inter-layer connections
            if (layerDiff === 1 && dist < maxDist * 0.8) {
              const speed = 0.02 + (i % 5) * 0.005;
              const signal = (Math.sin(time * speed + i * 0.7) + 1) / 2;
              const sx = a.x + (b.x - a.x) * signal;
              const sy = a.y + (b.y - a.y) * signal;

              const signalAlpha = alpha * 3;
              ctx.beginPath();
              ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${b.color}, ${Math.min(signalAlpha, 0.6)})`;
              ctx.fill();
            }
          }
        }
      }

      // === Draw nodes ===
      for (const node of nodes) {
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const r = node.radius * (0.7 + pulse * 0.6);
        const alpha = 0.35 + pulse * 0.45;

        // Outer glow ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node.color}, ${alpha * 0.06})`;
        ctx.fill();

        // Mid glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node.color}, ${alpha * 0.12})`;
        ctx.fill();

        // Core neuron
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node.color}, ${alpha})`;
        ctx.fill();

        // Bright center dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node.color}, ${Math.min(alpha + 0.3, 0.9)})`;
        ctx.fill();
      }

      // Mouse glow
      if (mouse.x > 0 && mouse.y > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
        grad.addColorStop(0, "hsla(340,82%,55%,0.07)");
        grad.addColorStop(0.4, "hsla(270,76%,55%,0.03)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - 150, mouse.y - 150, 300, 300);
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
