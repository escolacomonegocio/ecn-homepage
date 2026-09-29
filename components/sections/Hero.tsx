import Image from "next/image";
import { hero } from "@/lib/content";
import { Button, Kicker } from "../ui";
import { HeroVisual } from "../HeroVisual";
import leonardo from "@/assets/leonardo-chucrute.webp";
import mauricio from "@/assets/mauricio-thomas.webp";
import paulo from "@/assets/paulo-pereira.webp";

export function Hero() {
  return (
    <section id="topo" data-theme="dark" data-hero className="hero">
      <HeroVisual labels={hero.labels} />
      <div className="page hero-inner" data-hero-content>
        <Kicker className="hero-in" >{hero.eyebrow}</Kicker>
        <h1 className="t-display hero-title">{hero.title}</h1>
        <p className="t-lead hero-lead hero-in" style={{ animationDelay: "420ms" }}>
          {hero.lead}
        </p>
        <div className="hero-ctas hero-in" style={{ animationDelay: "520ms" }}>
          <Button href="#solucoes">{hero.ctaPrimary}</Button>
          <Button href="#contato" variant="ghost">
            {hero.ctaSecondary}
          </Button>
        </div>
        <div className="hero-note hero-in" style={{ animationDelay: "640ms" }}>
          <div className="avatars" aria-hidden="true">
            {[leonardo, mauricio, paulo].map((src, i) => (
              <span key={i} className="avatar">
                <Image src={src} alt="" width={96} height={120} sizes="96px" />
              </span>
            ))}
          </div>
          <p>{hero.note}</p>
        </div>
      </div>
    </section>
  );
}
