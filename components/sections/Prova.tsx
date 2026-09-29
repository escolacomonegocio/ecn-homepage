import Image from "next/image";
import { prova as c } from "@/lib/content";
import { Marquee } from "../Marquee";
import banner from "@/assets/evento-banner.jpg";
import plateia from "@/assets/evento-plateia.jpg";
import leonardo from "@/assets/evento-leonardo.jpg";
import feira from "@/assets/evento-feira.jpg";
import sala from "@/assets/evento-sala.jpg";
import palco from "@/assets/evento-palco.jpg";

// Somente fotos reais de eventos da ECN. Depoimentos e logos entram quando houver
// material aprovado (ver lib/content.ts > prova).
const fotos = [
  { src: feira, alt: "Plateia de educadores em palestra" },
  { src: plateia, alt: "Participantes de um encontro da ECN" },
  { src: leonardo, alt: "Leonardo Chucrute em encontro da ECN" },
  { src: banner, alt: "Encontro da ECN com gestores escolares" },
  { src: palco, alt: "Paulo Pereira em encontro da ECN" },
  { src: sala, alt: "Mauricio Thomas conduzindo encontro com gestores" },
];

export function Prova() {
  return (
    <section id="prova" data-theme="light" className="section prova">
      <div className="page prova-head">
        <h2 className="t-h2" data-split>
          {c.title}
        </h2>
      </div>

      <Marquee label="Fotos de encontros da ECN">
        {fotos.map((f) => (
          <figure key={f.alt} className="shot" style={{ aspectRatio: `${f.src.width} / ${f.src.height}` }}>
            <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 40vw, 80vw" className="object-cover" />
          </figure>
        ))}
      </Marquee>

      {c.testimonials.length > 0 && (
        <div className="page quotes" data-stagger>
          {c.testimonials.map((t) => (
            <figure key={t.name} className="quote">
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <strong>{t.name}</strong> · {t.role} · {t.school} · {t.city}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {c.logos.length > 0 && (
        <ul className="page logos" aria-label="Instituições que trabalham com a ECN">
          {c.logos.map((l) => (
            <li key={l.name}>
              <Image src={l.src} alt={l.name} width={160} height={64} className="logo-img" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
