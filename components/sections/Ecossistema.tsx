import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ecossistema as c, type Solucao } from "@/lib/content";
import { Button, Kicker, Rich } from "../ui";
import { DiamondVisual } from "../DiamondVisual";
import leonardo from "@/assets/leonardo-chucrute.webp";
import plateia from "@/assets/evento-plateia.jpg";
import mauricioPalco from "@/assets/evento-mauricio.jpg";
import sx from "@/assets/parceiro-sx.png";
import techlithy from "@/assets/parceiro-techlithy.png";

// Empresas parceiras (logos enviados pelo cliente, convertidos para versão monocromática).
const parceiros = [
  { name: "SX Contabilidade e BPO Financeiro", logo: sx, cat: "Contabilidade e BPO financeiro" },
  { name: "Techlithy", logo: techlithy, cat: "CRM" },
];

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

const estrutura = [
  "Instagram",
  "Landing page",
  "Google Meu Negócio",
  "Análise de concorrentes",
  "CRM",
  "Atendimento",
  "Processo comercial",
];

function ImplementacaoVisual() {
  return (
    <div className="eco-visual eco-estrutura" aria-hidden="true">
      <ol>
        {estrutura.map((e, i) => (
          <li key={e} style={idx(i)}>
            <span className="estrutura-dot" />
            {e}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Photo({ src, alt, pos = "center" }: { src: typeof plateia; alt: string; pos?: string }) {
  return (
    <div className="eco-visual eco-photo">
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 34vw, 92vw" placeholder="blur" style={{ objectPosition: pos }} className="object-cover" />
    </div>
  );
}

// Retrato recortado sobre o fundo da marca (mesmo tratamento da seção Quem está por trás).
function Cutout({ src, alt }: { src: typeof leonardo; alt: string }) {
  return (
    <div className="eco-visual eco-photo cutout-bg">
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 34vw, 92vw" className="cutout" />
    </div>
  );
}

const visuals: Record<Solucao["id"], ReactNode> = {
  diamante: <DiamondVisual />,
  mentoria: <Cutout src={leonardo} alt="Leonardo Chucrute, fundador da ECN" />,
  implementacao: <ImplementacaoVisual />,
  cursos: <Photo src={plateia} alt="Participantes de um encontro da ECN" pos="50% 40%" />,
  palestras: <Photo src={mauricioPalco} alt="Mauricio Thomas em palestra da ECN" pos="50% 30%" />,
};

export function Ecossistema() {
  return (
    <section id="solucoes" data-theme="light" className="section ecossistema">
      <header className="page eco-head">
        <Kicker>{c.kicker}</Kicker>
        <h2 className="t-h2" data-split>
          {c.title}
        </h2>
        <p className="t-body-lg eco-lead" data-reveal>
          {c.lead}
        </p>
      </header>

      <div className="slab eco-slab" data-eco data-slab data-theme="dark">
        <div className="page eco-inner">
        <div className="eco-tabs" aria-label="Soluções">
          {c.items.map((s) => (
            <button key={s.id} type="button" className="eco-tab" data-eco-tab aria-controls={s.id}>
              <span>{s.name}</span>
              <span className="eco-bar" aria-hidden="true">
                <span data-eco-bar />
              </span>
            </button>
          ))}
        </div>

        <div className="eco-panels">
          {c.items.map((s) => (
            <article key={s.id} id={s.id} className={`eco-panel eco-panel--${s.id}`} data-eco-panel>
              <div className="eco-text">
                <p className="eco-name">{s.name}</p>
                <h3 className="eco-title">{s.title}</h3>
                <div className="eco-body">
                  {s.body.map((b, i) => (
                    <p key={i}>
                      <Rich parts={b} />
                    </p>
                  ))}
                </div>
                {s.forWhom && (
                  <p className="eco-for">
                    <strong>Para quem é:</strong> {s.forWhom}
                  </p>
                )}
                <Button href="#contato" interesse={s.id} className={`eco-cta ${s.id === "diamante" ? "btn-shine" : ""}`}>
                  {s.cta}
                </Button>
              </div>
              {visuals[s.id]}
            </article>
          ))}
        </div>
        </div>
      </div>

      <div className="page partners">
        <p className="partners-label" data-reveal>
          Empresas que integram o ecossistema ECN
        </p>
        <ul className="partners-grid" data-stagger>
          {parceiros.map((p) => (
            <li key={p.name} className="partner">
              <Image src={p.logo} alt={p.name} sizes="(min-width: 1024px) 280px, 60vw" className="partner-logo" />
              <span className="partner-cat">{p.cat}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
