import { experiencia as c } from "@/lib/content";
import { Kicker } from "../ui";

type Stat = { value: number; prefix: string; suffix: string; unit: string; label: string };

function Figure({ s }: { s: Stat }) {
  return (
    <>
      <span className="stat-num">
        {s.prefix}
        <span data-count={s.value}>{s.value.toLocaleString("pt-BR")}</span>
        {s.suffix}
      </span>{" "}
      <span className="stat-unit">{s.unit}</span>
    </>
  );
}

export function Experiencia() {
  return (
    <section id="experiencia" data-theme="light" className="section experiencia">
      <div className="page exp-grid">
        <div className="exp-copy">
          <Kicker>{c.kicker}</Kicker>
          <h2 className="t-h2" data-reveal>
            {c.title}
          </h2>
          <div className="exp-paras" data-stagger>
            {c.paragraphs.map((p) => (
              <p key={p} className="t-body-lg">
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="ledger">
          <p className="ledger-label" data-reveal>
            {c.originLabel}
          </p>
          <dl className="ledger-rows" data-stagger>
            {c.origin.map((s) => (
              <div key={s.unit} className="ledger-row">
                <dt>
                  <Figure s={s} />
                </dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
          <dl className="ledger-ecn" data-theme="dark" data-reveal>
            <div className="ledger-row">
              <dt>
                <Figure s={c.ecn} />
              </dt>
              <dd>{c.ecn.label}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
