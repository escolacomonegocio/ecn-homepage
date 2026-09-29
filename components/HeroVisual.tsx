"use client";

import { useEffect, useRef, useState } from "react";

// Visual do hero: o símbolo "e•" da marca desenhado em partículas.
// Na primeira vez que aparece, as partículas nascem do ponto verde e se organizam no "e"
// (o ponto como origem da estrutura). Depois: respiração leve, repulsão do cursor e
// dispersão conforme a página rola. Pausável (WCAG 2.2.2) e estático com reduced-motion.

type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number; s: number; a: number; seed: number; mint: boolean; d: number };

// Geometria do "e•" no mesmo sistema do Logo.tsx (viewBox do símbolo completo).
const BOX = { x: 70, y: 400, w: 745, h: 672 };
const DOT = { cx: 726, cy: 736, r: 82, gap: 118 };

function buildTargets(size: number, step: number) {
  const scale = size / BOX.w;
  const w = Math.ceil(BOX.w * scale);
  const h = Math.ceil(BOX.h * scale);
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const g = off.getContext("2d", { willReadFrequently: true })!;
  g.scale(scale, scale);
  g.translate(-BOX.x, -BOX.y);
  g.save();
  // recorte do anel de respiro em volta do ponto
  g.beginPath();
  g.rect(0, 0, 2000, 1200);
  g.arc(DOT.cx, DOT.cy, DOT.gap, 0, Math.PI * 2, true);
  g.clip("evenodd");
  g.strokeStyle = "#fff";
  g.fillStyle = "#fff";
  g.lineWidth = 76;
  g.lineCap = "round";
  g.beginPath();
  // do ponto mais à direita, subindo pelo topo, até o terminal inferior direito (44,4°)
  g.arc(404, 736, 293, 0, (44.4 * Math.PI) / 180, true);
  g.stroke();
  g.fillRect(120, 711, 630, 51);
  g.restore();
  g.fillStyle = "#f00";
  g.beginPath();
  g.arc(DOT.cx, DOT.cy, DOT.r, 0, Math.PI * 2);
  g.fill();

  const data = g.getImageData(0, 0, w, h).data;
  const pts: Array<{ x: number; y: number; mint: boolean }> = [];
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      const i = (Math.floor(y) * w + Math.floor(x)) * 4;
      if (data[i + 3] > 128) pts.push({ x, y, mint: data[i + 1] < 100 });
    }
  }
  return { pts, w, h, dot: { x: (DOT.cx - BOX.x) * scale, y: (DOT.cy - BOX.y) * scale, r: DOT.r * scale } };
}

export function HeroVisual({ labels }: { labels: string[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => {
    const el = wrap.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mintRGB = getComputedStyle(document.documentElement).getPropertyValue("--mint").trim().split(/\s+/).join(",");
    let parts: P[] = [];
    let dot = { x: 0, y: 0, r: 0 };
    let ox = 0;
    let oy = 0;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let visible = false;
    let born = -1; // timestamp do nascimento (primeira vez visível)
    const mouse = { x: -9999, y: -9999 };

    const layout = () => {
      const r = el.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, W < 600 ? 1.5 : 2);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      const size = Math.min(W * 0.92, H * 0.92 * (BOX.w / BOX.h));
      const step = size < 380 ? 6 : 7.5;
      const t = buildTargets(size, step);
      ox = (W - t.w) / 2;
      oy = (H - t.h) / 2;
      dot = { x: t.dot.x + ox, y: t.dot.y + oy, r: t.dot.r };
      const old = parts;
      parts = t.pts.map((p, i) => {
        const tx = p.x + ox;
        const ty = p.y + oy;
        const prev = old[i];
        return {
          x: prev ? prev.x : dot.x,
          y: prev ? prev.y : dot.y,
          tx,
          ty,
          vx: 0,
          vy: 0,
          s: p.mint ? 2.4 : 1.5 + Math.random() * 0.9,
          a: p.mint ? 1 : 0.45 + Math.random() * 0.5,
          seed: Math.random() * Math.PI * 2,
          mint: p.mint,
          d: Math.hypot(tx - dot.x, ty - dot.y),
        };
      });
      if (reduce || born > 0) parts.forEach((p) => ((p.x = p.tx), (p.y = p.ty)));
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const t = now / 1000;
      const rect = el.getBoundingClientRect();
      // 0 no topo; 1 quando o visual saiu pela parte de cima da tela
      const scroll = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
      const life = born < 0 ? 0 : Math.min((now - born) / 2200, 1);

      // brilho do ponto: pulsa devagar
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.6);
      const glow = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.r * (3.2 + pulse * 0.8));
      glow.addColorStop(0, `rgba(${mintRGB},${0.32 * (1 - scroll)})`);
      glow.addColorStop(1, `rgba(${mintRGB},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      for (const p of parts) {
        if (!reduce) {
          // nascimento escalonado pela distância ao ponto
          const delay = (p.d / 900) * 0.55;
          const k = Math.min(Math.max((life - delay) / 0.45, 0), 1);
          const e = 1 - Math.pow(1 - k, 4);
          const wob = 1.1;
          const tx = p.tx + Math.sin(t * 0.9 + p.seed) * wob - scroll * Math.cos(p.seed) * 140;
          const ty = p.ty + Math.cos(t * 0.8 + p.seed) * wob - scroll * (60 + Math.sin(p.seed) * 120);
          const gx = dot.x + (tx - dot.x) * e;
          const gy = dot.y + (ty - dot.y) * e;
          p.vx += (gx - p.x) * 0.075;
          p.vy += (gy - p.y) * 0.075;
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = dx * dx + dy * dy;
          if (dist < 8100) {
            const f = (1 - Math.sqrt(dist) / 90) * 2.4;
            const inv = 1 / (Math.sqrt(dist) || 1);
            p.vx += dx * inv * f;
            p.vy += dy * inv * f;
          }
          p.vx *= 0.8;
          p.vy *= 0.8;
          p.x += p.vx;
          p.y += p.vy;
        }
        const alpha = p.a * (1 - scroll * 0.85) * (reduce ? 1 : Math.min(life * 3, 1));
        ctx.fillStyle = p.mint ? `rgba(${mintRGB},${alpha})` : `rgba(247,250,248,${alpha})`;
        ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = visible && !pausedRef.current ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (reduce) return draw(performance.now());
      if (!raf && visible && !pausedRef.current) raf = requestAnimationFrame(loop);
    };

    layout();
    draw(performance.now());

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible && born < 0) born = performance.now();
      start();
    });
    // O nascimento das partículas espera o navegador ficar ocioso: não disputa CPU
    // com a hidratação e o primeiro paint.
    const idle = window.requestIdleCallback ?? ((cb: () => void, _o?: unknown) => window.setTimeout(cb, 400));
    const idleId = idle(() => io.observe(el), { timeout: 1500 });
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(el);
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => ((mouse.x = -9999), (mouse.y = -9999));
    const onVis = () => {
      visible = !document.hidden && el.getBoundingClientRect().bottom > 0;
      start();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    (el as HTMLDivElement & { __start?: () => void }).__start = start;

    return () => {
      cancelAnimationFrame(raf);
      (window.cancelIdleCallback ?? window.clearTimeout)(idleId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (!paused) (wrap.current as (HTMLDivElement & { __start?: () => void }) | null)?.__start?.();
  }, [paused]);

  return (
    <>
      <div ref={wrap} className="hero-visual" aria-hidden="true">
        <canvas ref={canvas} />
        {labels.map((l, i) => (
          <span key={l} className={`hero-label hero-label-${i}`}>
            {l}
          </span>
        ))}
      </div>
      <button type="button" className="motion-toggle hero-toggle" onClick={() => setPaused((v) => !v)} aria-pressed={paused}>
        {paused ? "Retomar animação" : "Pausar animação"}
      </button>
    </>
  );
}
