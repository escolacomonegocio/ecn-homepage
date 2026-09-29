import { metodo as c } from "@/lib/content";
import { Kicker } from "../ui";

export function Metodo() {
  return (
    <section id="metodo" data-theme="dark" className="slab metodo" data-slab>
      <div className="page metodo-head">
        <div>
          <Kicker>{c.kicker}</Kicker>
          <h2 className="t-h2" data-reveal>
            {c.title}
          </h2>
        </div>
        <p className="t-body-lg metodo-lead" data-reveal>
          {c.lead}
        </p>
      </div>

      <div className="metodo-stage" data-steps-stage>
        <div className="page metodo-inner">
          <div className="steps-wrap">
            <div className="steps-track" data-steps-track aria-hidden="true">
              <span className="steps-fill" data-steps-fill />
              <span className="steps-dot" data-steps-dot />
            </div>
            <ol className="steps">
              {c.steps.map((s) => (
                <li key={s.n} className="step is-on" data-step>
                  <span className="step-n">{s.n}</span>
                  <h3 className="step-name">{s.name}</h3>
                  <p className="step-text">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <h3 className="verbs">
            {c.steps.map((s, i) => (
              <span key={s.verb} className="verb is-on" data-verb>
                {s.verb}
                {i < c.steps.length - 1 ? " " : ""}
              </span>
            ))}
          </h3>
        </div>
      </div>
    </section>
  );
}
