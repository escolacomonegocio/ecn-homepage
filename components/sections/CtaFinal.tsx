import { ctaFinal as c } from "@/lib/content";
import { Button } from "../ui";

export function CtaFinal() {
  return (
    <section className="cta-final" data-theme="dark" aria-labelledby="cta-final-title">
      <div className="cta-stage" data-cta-stage>
        <div className="cta-circle" data-cta-circle>
          <div className="page cta-content" data-cta-content>
            <h2 id="cta-final-title" className="t-display cta-title">
              {c.title}
            </h2>
            <div className="cta-copy">
              {c.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <Button href="#contato" variant="ink" interesse="nao-sei">
                {c.cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
