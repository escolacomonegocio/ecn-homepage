import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { hero } from "@/lib/content";
import { Button, Kicker } from "../ui";
import { HeroVisual } from "../HeroVisual";
import leonardo from "@/assets/leonardo-chucrute.webp";
import mauricio from "@/assets/mauricio-thomas.webp";
import paulo from "@/assets/paulo-pereira.webp";

// Título com revelação por máscara, palavra a palavra (CSS puro: roda antes do JS).
// O ponto final vira o ponto verde da marca.
function Title({ text }: { text: string }) {
  const body = text.endsWith(".") ? text.slice(0, -1) : text;
  const words = body.split(" ");
  return (
    <h1 className="hero-title" aria-label={text}>
      {words.map((w, i) => (
        // o espaço fica fora da máscara: dentro de inline-block ele seria descartado
        <Fragment key={i}>
          <span className="wm" aria-hidden="true">
            <span className="wi" style={{ "--i": i } as CSSProperties}>
              {w}
              {i === words.length - 1 && text.endsWith(".") && <span className="hero-period">.</span>}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </h1>
  );
}

export function Hero() {
  return (
    <section id="topo" data-theme="dark" data-hero className="hero">
      <HeroVisual labels={hero.labels} />
      <div className="page hero-inner" data-hero-content>
        <Kicker className="hero-in hero-kicker">{hero.eyebrow}</Kicker>
        <Title text={hero.title} />
        <div className="hero-row">
          <p className="t-lead hero-lead hero-in" style={{ animationDelay: "900ms" }}>
            {hero.lead}
          </p>
          <div className="hero-ctas hero-in" style={{ animationDelay: "1020ms" }}>
            <Button href="#solucoes" magnetic>
              {hero.ctaPrimary}
            </Button>
            <Button href="#contato" variant="glass" openForm>
              {hero.ctaSecondary}
            </Button>
          </div>
        </div>
      </div>
      <div className="page hero-foot hero-in" style={{ animationDelay: "1250ms" }}>
        <div className="hero-note">
          <div className="avatars" aria-hidden="true">
            {[leonardo, mauricio, paulo].map((src, i) => (
              <span key={i} className="avatar">
                <Image src={src} alt="" width={96} height={120} sizes="96px" />
              </span>
            ))}
          </div>
          <p>{hero.note}</p>
        </div>
        <a href="#experiencia" className="scroll-cue" aria-label="Rolar para a próxima seção">
          <span className="scroll-cue-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
