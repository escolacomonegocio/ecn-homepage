import Image from "next/image";
import type { CSSProperties } from "react";
import { manifesto as c } from "@/lib/content";
import { Kicker, Rich } from "../ui";
import { Logo } from "../Logo";
import { ManifestoVideo } from "../ManifestoVideo";
import leonardo from "@/assets/leonardo-chucrute.webp";
import mauricio from "@/assets/mauricio-thomas.webp";
import paulo from "@/assets/paulo-pereira.webp";

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

// Visuais de cada capítulo: traduzem o que o parágrafo diz, sem texto novo.
function Origem() {
  const people = [
    { src: leonardo, name: "Leonardo Chucrute" },
    { src: mauricio, name: "Mauricio Thomas" },
    { src: paulo, name: "Paulo Pereira" },
  ];
  return (
    <div className="chv chv-origem" aria-hidden="true">
      {people.map((p, i) => (
        <figure key={p.name} className="chv-person" style={idx(i)}>
          <div className="chv-person-img cutout-bg">
            <Image src={p.src} alt="" fill sizes="(min-width: 1024px) 16vw, 30vw" className="cutout" />
          </div>
          <figcaption>{p.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function Fundacao() {
  return (
    <div className="chv chv-fundacao" aria-hidden="true">
      <svg className="chv-lines" viewBox="0 0 400 400" preserveAspectRatio="none">
        <path d="M200 70 V200" pathLength={1} />
        <path d="M200 200 C200 280 100 260 100 330" pathLength={1} />
        <path d="M200 200 C200 280 300 260 300 330" pathLength={1} />
      </svg>
      <span className="chv-node chv-node-top">Grupo Transforma Educação</span>
      <span className="chv-hub">
        <Logo id="chv" className="chv-logo" />
      </span>
      <span className="chv-node chv-node-l">Gestores</span>
      <span className="chv-node chv-node-r">Instituições de ensino</span>
      <span className="chv-pulse" />
    </div>
  );
}

function Desafios({ items }: { items: string[] }) {
  return (
    <ul className="chv chv-desafios" aria-hidden="true">
      {items.map((t, i) => (
        <li key={t} style={idx(i)}>
          <span className="chv-dot" />
          {t}
        </li>
      ))}
    </ul>
  );
}

function Virada() {
  return (
    <div className="chv chv-virada" aria-hidden="true">
      <span className="chv-teoria">
        Teoria
        <span className="chv-strike" />
      </span>
      <span className="chv-pratica">Prática</span>
    </div>
  );
}

export function Manifesto() {
  return (
    <section id="manifesto" data-theme="dark" className="slab manifesto" data-slab>
      <div className="manifesto-stage" data-manifesto-stage>
        <div className="manifesto-media" data-manifesto-media>
          <ManifestoVideo />
          <div className="manifesto-shade" data-manifesto-shade />
        </div>
        <div className="manifesto-title-wrap">
          <Kicker className="manifesto-kicker">{c.kicker}</Kicker>
          <h2 className="t-display manifesto-title" data-manifesto-title>
            {c.title}
          </h2>
        </div>
      </div>

      {/* Capítulos: no desktop deslizam na horizontal com a rolagem; no celular empilham. */}
      <div className="chapters-wrap" data-chapters-wrap>
        <ol className="chapters" data-chapters>
          {c.chapters.map((ch, i) => (
            <li key={ch.id} className={`chapter chapter-${ch.id}`} data-chapter>
              <div className="chapter-visual">
                {ch.id === "origem" && <Origem />}
                {ch.id === "fundacao" && <Fundacao />}
                {ch.id === "desafios" && <Desafios items={ch.items ?? []} />}
                {ch.id === "virada" && <Virada />}
              </div>
              <div className="chapter-copy">
                <p className="chapter-label">
                  <span className="chapter-n">{String(i + 1).padStart(2, "0")}</span>
                  {ch.label}
                </p>
                <p className="chapter-text">
                  <Rich parts={ch.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="chapters-progress" aria-hidden="true">
          <span data-chapters-bar />
        </div>
      </div>

      <div className="page manifesto-end">
        <h3 className="manifesto-closing" data-split>
          {c.closing}
        </h3>
      </div>
    </section>
  );
}
