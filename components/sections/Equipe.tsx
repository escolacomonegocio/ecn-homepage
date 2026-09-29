import Image from "next/image";
import { equipe as c } from "@/lib/content";
import { Button, Kicker, Rich } from "../ui";
import leonardo from "@/assets/leonardo-chucrute.webp";
import mauricio from "@/assets/mauricio-thomas.webp";
import paulo from "@/assets/paulo-pereira.webp";

const photos = [leonardo, mauricio, paulo];

export function Equipe() {
  return (
    <section id="quem-somos" data-theme="dark" className="slab equipe" data-slab>
      <div className="page">
        <div className="equipe-head">
          <Kicker>{c.kicker}</Kicker>
          <h2 className="t-h2" data-split>
            {c.title}
          </h2>
          <div className="equipe-intro" data-stagger>
            <p className="t-body-lg">
              <Rich parts={c.intro} />
            </p>
            <p className="t-body-lg">{c.vision}</p>
          </div>
        </div>

        <div className="people">
          {c.people.map((p, i) => (
            <article key={p.name} className={`person person-${i}`}>
              <div className="portrait cutout-bg" data-portrait>
                <Image
                  src={photos[i]}
                  alt={p.name}
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 40vw, 92vw" : "(min-width: 1024px) 26vw, 92vw"}
                  className="cutout"
                />
              </div>
              <h3 className="person-name">{p.name}</h3>
              <p className="person-role">{p.role}</p>
              <p className="person-bio">{p.bio}</p>
            </article>
          ))}

          <article className="person person-team" data-reveal>
            <span className="team-dots" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} />
              ))}
            </span>
            <div className="team-body">
              <h3 className="person-name">{c.team.name}</h3>
              <p className="person-bio">
                <Rich parts={c.team.text} />
              </p>
            </div>
            <Button href="#experiencia" variant="ghost">
              {c.cta}
            </Button>
          </article>
        </div>
      </div>
    </section>
  );
}
