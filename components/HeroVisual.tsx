"use client";

import { useEffect, useRef, useState } from "react";

// Visual do hero: o símbolo "e•" da marca desenhado em partículas, ocupando o fundo do hero.
// Entrada: o ponto verde nasce no centro da tela, viaja até o lugar dele no "e" e, no
// caminho, solta as partículas que montam a letra (o ponto como origem da estrutura).
// Depois: respiração leve, repulsão do cursor, leve paralaxe e dispersão ao rolar.
// Pausável (WCAG 2.2.2) e estático com prefers-reduced-motion.

type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number; s: number; a: number; seed: number; mint: boolean; d: number };

// Geometria do "e•" no mesmo sistema do Logo.tsx.
const BOX = { x: 70, y: 400, w: 745, h: 672 };
const DOT = { cx: 726, cy: 736, r: 82, gap: 118 };

const ease = {
  outExpo: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2),
};
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

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

// Onde o "e" fica dentro do hero: grande e à direita no desktop; no celular, no alto,
// maior que a tela e cortado, atrás do texto.
function placement(W: number, H: number) {
  if (W >= 1024) {
    const size = Math.min(W * 0.56, H * 0.86 * (BOX.w / BOX.h));
    return { size, ox: W - size - Math.max(24, W * 0.035), oy: (H - size * (BOX.h / BOX.w)) / 2 + H * 0.02 };
  }
  const size = Math.min(W * 1.05, 620);
  return { size, ox: W - size * 0.82, oy: H * 0.04 };
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
    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let born = -1;
    const mouse = { x: -9999, y: -9999, px: 0, py: 0, sx: 0, sy: 0 };

    const layout = () => {
      const r = el.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, W < 768 ? 1.25 : 2);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      const { size, ox, oy } = placement(W, H);
      // celular: grade mais aberta (menos partículas, menos CPU na entrada)
      const step = W < 768 ? Math.max(8, size / 62) : Math.max(6, size / 92);
      const t = buildTargets(size, step);
      dot = { x: t.dot.x + ox, y: t.dot.y + oy, r: t.dot.r };
      // a caixa dos rótulos acompanha a posição do "e"
      const lb = el.querySelector<HTMLElement>(".hero-labels");
      if (lb) Object.assign(lb.style, { left: `${ox}px`, top: `${oy}px`, width: `${t.w}px`, height: `${t.h}px` });
      const old = parts;
      parts = t.pts.map((p, i) => {
        const tx = p.x + ox;
        const ty = p.y + oy;
        const prev = old[i];
        return {
          x: prev ? prev.x : W / 2,
          y: prev ? prev.y : H / 2,
          tx,
          ty,
          vx: 0,
          vy: 0,
          s: p.mint ? 2.6 : 1.4 + Math.random() * 1.1,
          a: p.mint ? 1 : 0.4 + Math.random() * 0.55,
          seed: Math.random() * Math.PI * 2,
          mint: p.mint,
          d: Math.hypot(tx - dot.x, ty - dot.y),
        };
      });
      if (reduce || born > 0) parts.forEach((p) => ((p.x = p.tx), (p.y = p.ty)));
    };

    // Linha do tempo da entrada (ms desde o nascimento)
    const T = { grow: 520, travel: 1100, form: 2300 };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const t = now / 1000;
      const rect = el.getBoundingClientRect();
      const scroll = clamp01(-rect.top / Math.max(rect.height, 1));
      const age = reduce ? 1e9 : born < 0 ? -1 : now - born;

      // paralaxe suave do conjunto seguindo o cursor
      mouse.sx += (mouse.px - mouse.sx) * 0.05;
      mouse.sy += (mouse.py - mouse.sy) * 0.05;
      const shiftX = mouse.sx * 14;
      const shiftY = mouse.sy * 10 - scroll * 60;

      // posição do ponto: nasce no centro, cresce, viaja até o "e"
      const grow = age < 0 ? 0 : ease.outBack(clamp01(age / T.grow));
      const travel = age < 0 ? 0 : ease.inOutCubic(clamp01((age - T.grow * 0.6) / T.travel));
      const dx = W / 2 + (dot.x - W / 2) * travel + shiftX * travel;
      const dy = H / 2 + (dot.y - H / 2) * travel + shiftY * travel;

      if (age < 0) return;

      // brilho do ponto
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.6);
      const glowR = dot.r * (3.4 + pulse * 0.8 + (1 - travel) * 2.4);
      const glow = ctx.createRadialGradient(dx, dy, 0, dx, dy, glowR);
      glow.addColorStop(0, `rgba(${mintRGB},${(0.34 + (1 - travel) * 0.25) * (1 - scroll)})`);
      glow.addColorStop(1, `rgba(${mintRGB},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(dx - glowR, dy - glowR, glowR * 2, glowR * 2); // só a área do brilho

      // o ponto sólido enquanto viaja (depois as partículas verdes assumem)
      if (travel < 1) {
        ctx.fillStyle = `rgb(${mintRGB})`;
        ctx.beginPath();
        ctx.arc(dx, dy, dot.r * grow * (1 - 0.15 * travel), 0, Math.PI * 2);
        ctx.fill();
      }

      const formStart = T.grow * 0.6;
      for (const p of parts) {
        let alpha: number;
        if (reduce) {
          p.x = p.tx;
          p.y = p.ty;
          alpha = p.a;
        } else {
          // cada partícula se solta do ponto ao longo da viagem, as mais distantes por último
          const delay = formStart + (p.d / Math.max(W, H)) * 900 + (p.seed / 6.28) * 350;
          const k = clamp01((age - delay) / 1100);
          const e = ease.outExpo(k);
          const wob = 1.1;
          const tx = p.tx + shiftX + Math.sin(t * 0.9 + p.seed) * wob - scroll * Math.cos(p.seed) * 160;
          const ty = p.ty + shiftY + Math.cos(t * 0.8 + p.seed) * wob - scroll * (80 + Math.sin(p.seed) * 140);
          const gx = k <= 0 ? dx : dx + (tx - dx) * e;
          const gy = k <= 0 ? dy : dy + (ty - dy) * e;
          p.vx += (gx - p.x) * 0.09;
          p.vy += (gy - p.y) * 0.09;
          const mx = p.x - mouse.x;
          const my = p.y - mouse.y;
          const dist = mx * mx + my * my;
          if (dist < 10000) {
            const f = (1 - Math.sqrt(dist) / 100) * 2.6;
            const inv = 1 / (Math.sqrt(dist) || 1);
            p.vx += mx * inv * f;
            p.vy += my * inv * f;
          }
          p.vx *= 0.78;
          p.vy *= 0.78;
          p.x += p.vx;
          p.y += p.vy;
          alpha = k <= 0 ? 0 : p.a * Math.min(k * 4, 1);
        }
        alpha *= 1 - scroll * 0.9;
        if (alpha <= 0.01) continue;
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
    if (reduce) draw(performance.now());
    else {
      // nasce logo após o primeiro paint (o título já está entrando via CSS)
      born = performance.now() + 120;
      start();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      start();
    });
    io.observe(el);
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(el);
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.px = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.py = (e.clientY / window.innerHeight - 0.5) * 2;
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
        <div className="hero-labels">
          {labels.map((l, i) => (
            <span key={l} className={`hero-label hero-label-${i}`}>
              {l}
            </span>
          ))}
        </div>
      </div>
      <button type="button" className="motion-toggle hero-toggle" onClick={() => setPaused((v) => !v)} aria-pressed={paused}>
        {paused ? "Retomar animação" : "Pausar animação"}
      </button>
    </>
  );
}
