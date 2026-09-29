"use client";

import { useEffect, useRef, useState } from "react";

// Vídeo de fundo do manifesto (8 s em loop, sem áudio, cor ajustada para o verde da marca).
// Só carrega/toca quando o manifesto entra na tela; pausável (WCAG 2.2.2);
// com prefers-reduced-motion fica só a imagem parada (pôster).
export function ManifestoVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => {
    const v = video.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduce(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !pausedRef.current) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current!;
    if (paused) v.play().catch(() => {});
    else v.pause();
    setPaused(!paused);
  };

  return (
    <>
      <video
        ref={video}
        className="manifesto-video"
        src="/video/manifesto.mp4"
        poster="/video/manifesto-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />
      {!reduce && (
        <button type="button" className="motion-toggle manifesto-toggle" onClick={toggle} aria-pressed={paused}>
          {paused ? "Retomar vídeo" : "Pausar vídeo"}
        </button>
      )}
    </>
  );
}
