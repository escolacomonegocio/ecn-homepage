"use client";

import { useState, type ReactNode } from "react";

// Faixa contínua (CSS puro). O botão atende a WCAG 2.2.2 (movimento automático > 5s).
export function Marquee({ children, label }: { children: ReactNode; label: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="marquee" data-paused={paused}>
      <div className="marquee-track" aria-label={label} role="group">
        <div className="marquee-set">{children}</div>
        <div className="marquee-set" aria-hidden="true">
          {children}
        </div>
      </div>
      <button type="button" className="motion-toggle marquee-toggle" onClick={() => setPaused((v) => !v)} aria-pressed={paused}>
        {paused ? "Retomar" : "Pausar"}
      </button>
    </div>
  );
}
