import { comecar as c } from "@/lib/content";
import { Button, Kicker } from "../ui";

export function Comecar() {
  return (
    <section id="comecar" data-theme="light" className="section comecar">
      <div className="page comecar-grid">
        <div className="comecar-head">
          <Kicker>{c.kicker}</Kicker>
          <h2 className="t-h2" data-reveal>
            {c.title}
          </h2>
          <p className="t-body-lg" data-reveal>
            {c.lead}
          </p>
        </div>

        <div>
          <ul className="paths" data-stagger>
            {c.paths.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`} className="path">
                  <span className="path-fill" aria-hidden="true" />
                  <span className="path-q">{p.q}</span>
                  <span className="path-a">
                    {p.pre}
                    <strong>{p.target}</strong>.
                  </span>
                  <span className="path-go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <div className="unsure" data-theme="dark" data-reveal>
            <div>
              <h3 className="unsure-q">{c.unsure.q}</h3>
              <p className="unsure-t">{c.unsure.text}</p>
            </div>
            <Button href="#contato" interesse="nao-sei">
              {c.unsure.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
