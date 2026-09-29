"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "#solucoes", label: "Soluções" },
  { href: "#metodo", label: "Como trabalhamos" },
  { href: "#quem-somos", label: "Quem somos" },
  { href: "#contato", label: "Contato" },
];

// Pílula flutuante. O tema (claro/escuro) acompanha a seção que está sob ela:
// cada seção declara data-theme e um observador olha só a faixa do topo da tela.
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const header = ref.current!;
    const active = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) active.add(e.target as HTMLElement);
          else active.delete(e.target as HTMLElement);
        }
        // Blocos aninhados (container escuro dentro de seção clara): vence o mais interno,
        // que é o último em ordem de documento.
        const last = [...active].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1)).pop();
        if (last) header.dataset.theme = last.dataset.theme ?? "dark";
      },
      { rootMargin: "-36px 0px -92% 0px" },
    );
    document.querySelectorAll("[data-theme]").forEach((s) => s !== header && io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header ref={ref} className="site-header" data-theme="dark" data-open={open}>
      <nav className="nav-pill" aria-label="Principal">
        <a href="#topo" className="nav-logo" onClick={() => setOpen(false)}>
          <Logo id="nav" className="h-[22px] w-auto" />
        </a>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a href="#contato" className="nav-cta">
          Fale com um especialista
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
          <span className="nav-toggle-bars" aria-hidden="true" />
        </button>
      </nav>
      <div id="menu-mobile" className="nav-sheet" hidden={!open}>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contato" className="btn btn-primary" onClick={() => setOpen(false)}>
          <span className="btn-dot" aria-hidden="true" />
          <span>Fale com um especialista</span>
        </a>
      </div>
    </header>
  );
}
