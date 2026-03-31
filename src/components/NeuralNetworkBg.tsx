import { useEffect, useRef, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  type: "hub" | "relay" | "data";
  pulse: number;
  pulseSpeed: number;
  active: boolean;
  activeCooldown: number;
  ring: number;
}

interface DataPacket {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  color: string;
}

interface ScanBeam {
  angle: number;
  speed: number;
  length: number;
  opacity: number;
}

const PINK = { h: 340, s: 82, l: 55 };
const CYAN = { h: 190, s: 85, l: 50 };
const PURPLE = { h: 270, s: 70, l: 55 };
const BLUE = { h: 220, s: 75, l: 50 };

function hsl(c: { h: number; s: number; l: number }, a = 1) {
  return `hsla(${c.h},${c.s}%,${c.l}%,${a})`;
}

const NODE_COUNT_DESKTOP = 60;
const NODE_COUNT_MOBILE = 35;
const MAX_CONN = 200;
const CONN_DIST = 220;

export default function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const packetsRef = useRef<DataPacket[]>([]);
  const beamsRef = useRef<ScanBeam[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef(0);
  const timeRef = useRef(0);

  const initNodes = useCallback((w: number, h: number) => {
    const count = w < 640 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    const nodes: Node[] = [];

    // Create structured grid with noise
    const cols = Math.ceil(Math.sqrt(count * (w / h)));
    const rows = Math.ceil(count / cols);
    const cellW = w / cols;
    const cellH = h / rows;

    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const baseX = col * cellW + cellW / 2;
      const baseY = row * cellH + cellH / 2;
      // Add controlled randomness
      const jitterX = (Math.random() - 0.5) * cellW * 0.7;
      const jitterY = (Math.random() - 0.5) * cellH * 0.7;
      const x = baseX + jitterX;
      const y = baseY + jitterY;

      const type = Math.random() < 0.12 ? "hub" : Math.random() < 0.4 ? "relay" : "data";

      nodes.push({
        x, y,
        targetX: x,
        targetY: y,
        radius: type === "hub" ? 3 : type === "relay" ? 2 : 1.2,
        type,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        active: false,
        activeCooldown: Math.random() * 200,
        ring: 0,
      });
    }
    nodesRef.current = nodes;

    // Init scan beams
    beamsRef.current = [
      { angle: 0, speed: 0.003, length: Math.max(w, h) * 0.8, opacity: 0.04 },
      { angle: Math.PI * 0.7, speed: -0.002, length: Math.max(w, h) * 0.6, opacity: 0.03 },
    ];
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
      const packets = packetsRef.current;
      const beams = beamsRef.current;
      const mouse = mouseRef.current;
      const t = timeRef.current;
      timeRef.current += 0.016;

      ctx.clearRect(0, 0, w, h);

      // ── Subtle hex grid ──
      ctx.strokeStyle = hsl(CYAN, 0.025);
      ctx.lineWidth = 0.5;
      const gridSize = 50;
      for (let gx = 0; gx < w + gridSize; gx += gridSize) {
        for (let gy = 0; gy < h + gridSize; gy += gridSize) {
          const offsetX = (Math.floor(gy / gridSize) % 2) * (gridSize / 2);
          const px = gx + offsetX + Math.sin(t * 0.15 + gx * 0.01) * 2;
          const py = gy + Math.cos(t * 0.12 + gy * 0.01) * 2;
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const angle = (Math.PI / 3) * a - Math.PI / 6;
            const hx = px + Math.cos(angle) * 14;
            const hy = py + Math.sin(angle) * 14;
            a === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // ── Scan beams ──
      for (const beam of beams) {
        beam.angle += beam.speed;
        const cx = w / 2;
        const cy = h / 2;
        const ex = cx + Math.cos(beam.angle) * beam.length;
        const ey = cy + Math.sin(beam.angle) * beam.length;
        const grad = ctx.createLinearGradient(cx, cy, ex, ey);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.3, hsl(PINK, beam.opacity));
        grad.addColorStop(0.7, hsl(CYAN, beam.opacity * 0.5));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── Update nodes ──
      for (const n of nodes) {
        n.pulse += n.pulseSpeed;
        n.activeCooldown -= 1;

        // Gentle drift
        n.targetX += Math.sin(t * 0.2 + n.pulse) * 0.08;
        n.targetY += Math.cos(t * 0.18 + n.pulse * 1.3) * 0.08;

        // Wrap
        if (n.targetX < -20) n.targetX = w + 20;
        if (n.targetX > w + 20) n.targetX = -20;
        if (n.targetY < -20) n.targetY = h + 20;
        if (n.targetY > h + 20) n.targetY = -20;

        // Smooth follow
        n.x += (n.targetX - n.x) * 0.03;
        n.y += (n.targetY - n.y) * 0.03;

        // Mouse interaction
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 5) {
          const push = (1 - dist / 200) * 2;
          n.x -= (dx / dist) * push;
          n.y -= (dy / dist) * push;
          if (n.activeCooldown <= 0) {
            n.active = true;
            n.activeCooldown = 120;
            n.ring = 0;
          }
        }

        // Random activation
        if (Math.random() < 0.0008 && n.activeCooldown <= 0) {
          n.active = true;
          n.activeCooldown = 200;
          n.ring = 0;
        }
      }

      // ── Build connections & spawn packets ──
      const connections: [number, number, number][] = [];
      for (let i = 0; i < nodes.length && connections.length < MAX_CONN; i++) {
        for (let j = i + 1; j < nodes.length && connections.length < MAX_CONN; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONN_DIST) {
            connections.push([i, j, dist]);

            // Spawn data packets on active nodes
            if ((nodes[i].active || nodes[j].active) && Math.random() < 0.03 && packets.length < 40) {
              const colors = [PINK, CYAN, PURPLE, BLUE];
              packets.push({
                fromIdx: i,
                toIdx: j,
                progress: nodes[i].active ? 0 : 1,
                speed: (0.008 + Math.random() * 0.015) * (nodes[i].active ? 1 : -1),
                color: hsl(colors[Math.floor(Math.random() * colors.length)], 0.9),
              });
            }
          }
        }
      }

      // ── Draw connections ──
      for (const [i, j, dist] of connections) {
        const a = nodes[i];
        const b = nodes[j];
        const alpha = (1 - dist / CONN_DIST);
        const isHub = a.type === "hub" || b.type === "hub";

        // Dashed lines for data nodes, solid for hubs
        ctx.beginPath();
        if (!isHub) {
          ctx.setLineDash([4, 6]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = hsl(isHub ? PINK : CYAN, alpha * alpha * 0.12);
        ctx.lineWidth = isHub ? alpha * 1.5 : alpha * 0.8;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ── Draw & update data packets ──
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;
        if (pkt.progress < 0 || pkt.progress > 1) {
          packets.splice(p, 1);
          continue;
        }
        const a = nodes[pkt.fromIdx];
        const b = nodes[pkt.toIdx];
        const px = a.x + (b.x - a.x) * pkt.progress;
        const py = a.y + (b.y - a.y) * pkt.progress;

        // Glow trail
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color.replace("0.9", "0.08");
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.fill();
      }

      // ── Draw nodes ──
      for (const n of nodes) {
        const pulseVal = Math.sin(n.pulse) * 0.5 + 0.5;
        const baseAlpha = n.type === "hub" ? 0.7 : n.type === "relay" ? 0.45 : 0.3;
        const alpha = baseAlpha + pulseVal * 0.3;
        const color = n.type === "hub" ? PINK : n.type === "relay" ? CYAN : BLUE;

        // Active ring expansion
        if (n.active) {
          n.ring += 1.2;
          const ringAlpha = Math.max(0, 0.3 - n.ring / 100);
          if (ringAlpha <= 0) {
            n.active = false;
          } else {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.ring, 0, Math.PI * 2);
            ctx.strokeStyle = hsl(color, ringAlpha);
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }

        // Outer glow for hubs
        if (n.type === "hub") {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 6, 0, Math.PI * 2);
          ctx.fillStyle = hsl(PINK, 0.04 + pulseVal * 0.03);
          ctx.fill();

          // HUD crosshair
          const cLen = 6 + pulseVal * 3;
          ctx.strokeStyle = hsl(PINK, 0.2);
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(n.x - cLen, n.y); ctx.lineTo(n.x - 3, n.y);
          ctx.moveTo(n.x + 3, n.y); ctx.lineTo(n.x + cLen, n.y);
          ctx.moveTo(n.x, n.y - cLen); ctx.lineTo(n.x, n.y - 3);
          ctx.moveTo(n.x, n.y + 3); ctx.lineTo(n.x, n.y + cLen);
          ctx.stroke();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * (0.8 + pulseVal * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = hsl(color, alpha);
        ctx.fill();

        // Relay: small rotating square
        if (n.type === "relay") {
          ctx.save();
          ctx.translate(n.x, n.y);
          ctx.rotate(t * 0.5 + n.pulse);
          const sz = 4 + pulseVal * 2;
          ctx.strokeStyle = hsl(CYAN, 0.2);
          ctx.lineWidth = 0.5;
          ctx.strokeRect(-sz / 2, -sz / 2, sz, sz);
          ctx.restore();
        }
      }

      // ── Mouse HUD reticle ──
      if (mouse.x > 0 && mouse.y > 0) {
        const mx = mouse.x, my = mouse.y;
        ctx.strokeStyle = hsl(PINK, 0.15);
        ctx.lineWidth = 0.8;

        // Rotating outer circle
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(t * 0.4);
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 0.4);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 30, Math.PI, Math.PI * 1.4);
        ctx.stroke();
        ctx.restore();

        // Inner reticle
        ctx.beginPath();
        ctx.arc(mx, my, 8, 0, Math.PI * 2);
        ctx.strokeStyle = hsl(CYAN, 0.12);
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Ambient glow
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 150);
        grad.addColorStop(0, hsl(PINK, 0.06));
        grad.addColorStop(0.5, hsl(PURPLE, 0.02));
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(mx - 150, my - 150, 300, 300);
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
      style={{ background: "linear-gradient(180deg, hsl(240,15%,4%) 0%, hsl(235,20%,6%) 50%, hsl(240,15%,4%) 100%)" }}
    />
  );
}
