"use client";

import { useEffect, useRef } from "react";

// Consultoria Diamante: diamante em lapidação brilhante renderizado em 3D (canvas 2D,
// sem bibliotecas), girando devagar, com facetas que captam luz e brilhos pontuais.
// Em volta, a órbita do programa: 12 marcas (12 meses) e 7 pontos percorrendo o anel
// (7 tutores). Só anima quando visível; com prefers-reduced-motion fica um quadro parado.

type V = [number, number, number];

function buildDiamond() {
  const pts: V[] = [];
  const add = (p: V) => pts.push(p) - 1;
  const ring = (n: number, r: number, y: number, off: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((i + off) / n) * Math.PI * 2;
      return add([Math.cos(a) * r, y, Math.sin(a) * r]);
    });
  const table = ring(8, 0.56, 0.42, 0);
  const crown = ring(8, 0.84, 0.2, 0.5);
  const girdle = ring(16, 1, 0, 0);
  const pav = ring(8, 0.56, -0.48, 0.5);
  const culet = add([0, -1.02, 0]);
  const tableTop = add([0, 0.42, 0]);
  const f: number[][] = [];
  const m = (i: number, n: number) => ((i % n) + n) % n;
  for (let i = 0; i < 8; i++) {
    f.push([tableTop, table[i], table[m(i + 1, 8)]]);
    f.push([table[i], crown[i], table[m(i + 1, 8)]]);
    f.push([crown[i], crown[m(i + 1, 8)], table[m(i + 1, 8)]]);
    f.push([crown[i], girdle[2 * i], girdle[2 * i + 1]]);
    f.push([crown[i], girdle[2 * i + 1], girdle[m(2 * i + 2, 16)]]);
    f.push([crown[i], girdle[m(2 * i + 2, 16)], crown[m(i + 1, 8)]]);
    f.push([girdle[2 * i], pav[i], girdle[2 * i + 1]]);
    f.push([girdle[2 * i + 1], pav[i], girdle[m(2 * i + 2, 16)]]);
    f.push([pav[i], pav[m(i + 1, 8)], girdle[m(2 * i + 2, 16)]]);
    f.push([pav[i], culet, pav[m(i + 1, 8)]]);
  }
  return { pts, faces: f };
}

const DIAMOND = buildDiamond();

export function DiamondVisual() {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mint = getComputedStyle(document.documentElement).getPropertyValue("--mint").trim().split(/\s+/).join(",");
    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let visible = false;
    const start = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };

    const light = (() => {
      const l: V = [-0.45, 0.8, 0.6];
      const n = Math.hypot(...l);
      return l.map((v) => v / n) as V;
    })();

    const draw = (now: number) => {
      const t = reduce ? 0.6 : (now - start) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H * 0.5;
      const S = Math.min(W * 0.38, H * 0.4);

      // brilho de fundo
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 2.4);
      g.addColorStop(0, `rgba(${mint},0.22)`);
      g.addColorStop(0.45, `rgba(${mint},0.06)`);
      g.addColorStop(1, `rgba(${mint},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // órbita (12 meses, 7 tutores): elipse inclinada, metade de trás desenhada antes
      const orx = Math.min(S * 1.6, W * 0.43);
      const ory = orx * 0.24;
      const oy = cy + S * 0.12;
      const orbit = (back: boolean) => {
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(247,250,248,${back ? 0.08 : 0.2})`;
        ctx.beginPath();
        ctx.ellipse(cx, oy, orx, ory, 0, back ? Math.PI : 0, back ? Math.PI * 2 : Math.PI);
        ctx.stroke();
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * Math.PI * 2 + t * 0.05;
          const sy = Math.sin(a);
          if (back !== sy < 0) continue;
          const x = cx + Math.cos(a) * orx;
          const y = oy + sy * ory;
          ctx.strokeStyle = `rgba(247,250,248,${back ? 0.14 : 0.4})`;
          ctx.beginPath();
          ctx.moveTo(x, y - 4);
          ctx.lineTo(x, y + 4);
          ctx.stroke();
        }
        for (let k = 0; k < 7; k++) {
          const a = (k / 7) * Math.PI * 2 + t * 0.22;
          const sy = Math.sin(a);
          if (back !== sy < 0) continue;
          const x = cx + Math.cos(a) * orx;
          const y = oy + sy * ory;
          const r = back ? 2.4 : 3.6;
          ctx.fillStyle = `rgba(${mint},${back ? 0.45 : 1})`;
          ctx.shadowColor = `rgba(${mint},0.9)`;
          ctx.shadowBlur = back ? 0 : 12;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      };
      orbit(true);

      // diamante
      const ry = t * 0.35;
      const rx = 0.42 + Math.sin(t * 0.5) * 0.04;
      const cyR = Math.cos(ry);
      const syR = Math.sin(ry);
      const cxR = Math.cos(rx);
      const sxR = Math.sin(rx);
      const bob = Math.sin(t * 0.8) * S * 0.03;
      const P = DIAMOND.pts.map(([x, y, z]) => {
        const x1 = x * cyR + z * syR;
        const z1 = -x * syR + z * cyR;
        const y2 = y * cxR - z1 * sxR;
        const z2 = y * sxR + z1 * cxR;
        return [x1, y2, z2] as V;
      });
      const faces = DIAMOND.faces
        .map((f, fi) => {
          const [a, b, c] = f.map((i) => P[i]);
          const u: V = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
          const v: V = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
          let n: V = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
          const len = Math.hypot(...n) || 1;
          n = n.map((q) => q / len) as V;
          // normal apontando para fora do centro
          const mid: V = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3];
          if (n[0] * mid[0] + n[1] * mid[1] + n[2] * mid[2] < 0) n = n.map((q) => -q) as V;
          return { f, n, z: mid[2], mid, fi };
        })
        .sort((p, q) => p.z - q.z);

      const px = (p: V): [number, number] => [cx + p[0] * S, cy + bob - p[1] * S];

      for (const { f, n, mid, fi } of faces) {
        const front = n[2] > 0;
        const diff = Math.max(0, n[0] * light[0] + n[1] * light[1] + n[2] * light[2]);
        // reflexo especular (meio-vetor entre luz e observador)
        const h: V = [light[0], light[1], light[2] + 1];
        const hl = Math.hypot(...h);
        const spec = Math.pow(Math.max(0, (n[0] * h[0] + n[1] * h[1] + n[2] * h[2]) / hl), 24);
        const [a, b, c] = f.map((i) => px(P[i]));
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(c[0], c[1]);
        ctx.closePath();
        if (front) {
          // mistura gelo + verde da marca, como luz refratada
          const alt = fi % 2 === 0 ? 1 : 0.55;
          const k = 0.03 + Math.pow(diff, 3) * 0.6 * alt + spec * 0.85;
          const tint = 0.5 + 0.5 * Math.sin(mid[0] * 3 + mid[1] * 2 + t * 0.6);
          const r = Math.round(200 + 47 * (1 - tint * 0.5));
          const gC = Math.round(236 + 14 * tint);
          const bC = Math.round(228 + 20 * (1 - tint));
          ctx.fillStyle = `rgba(${r},${gC},${bC},${Math.min(k, 0.92)})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(247,250,248,${0.32 + spec * 0.55})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        } else {
          // faces de trás aparecem pela "transparência" da pedra
          ctx.fillStyle = `rgba(${mint},${0.05 + diff * 0.12})`;
          ctx.fill();
          ctx.strokeStyle = "rgba(247,250,248,0.1)";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
        // brilho: estrela de 4 pontas quando a faceta reflete a luz direto
        if (front && spec > 0.72) {
          const [sx, sy] = px(mid);
          const pulse = 0.6 + 0.4 * Math.sin(t * 3 + fi);
          const L = S * (0.12 + spec * 0.3) * pulse;
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, L);
          grad.addColorStop(0, "rgba(255,255,255,0.95)");
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx - L, sy);
          ctx.lineTo(sx + L, sy);
          ctx.moveTo(sx, sy - L);
          ctx.lineTo(sx, sy + L);
          ctx.stroke();
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(sx, sy, L * 0.09, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      orbit(false);
    };

    const loop = (now: number) => {
      draw(now);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    resize();
    draw(performance.now());
    const io = new IntersectionObserver(([e]) => {
      // no modo fixado, painéis inativos ficam invisíveis (visibility: hidden)
      visible = e.isIntersecting && !reduce && getComputedStyle(canvas).visibility !== "hidden";
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const panel = canvas.closest("[data-eco-panel]");
    const mo = panel
      ? new MutationObserver(() => {
          visible = !reduce && getComputedStyle(canvas).visibility !== "hidden" && canvas.getBoundingClientRect().bottom > 0;
          if (visible && !raf) raf = requestAnimationFrame(loop);
        })
      : null;
    if (panel) mo!.observe(panel, { attributes: true, attributeFilter: ["class"] });
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo?.disconnect();
    };
  }, []);

  return (
    <div className="eco-visual eco-diamante" aria-hidden="true">
      <canvas ref={cv} className="diamond-canvas" />
      <div className="diamond-stats">
        <div>
          <strong>12</strong>
          <span>meses de acompanhamento</span>
        </div>
        <div>
          <strong>7</strong>
          <span>tutores especializados</span>
        </div>
      </div>
    </div>
  );
}
