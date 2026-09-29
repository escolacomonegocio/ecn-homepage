import Image from "next/image";
import { manifesto as c } from "@/lib/content";
import { Kicker, Words } from "../ui";
import palco from "@/assets/evento-palco.jpg";

export function Manifesto() {
  return (
    <section id="manifesto" data-theme="dark" className="slab manifesto" data-slab>
      <div className="manifesto-stage" data-manifesto-stage>
        <div className="manifesto-media" data-manifesto-media>
          <Image src={palco} alt="Paulo Pereira em encontro da ECN com gestores escolares" fill sizes="100vw" placeholder="blur" className="object-cover" />
          <div className="manifesto-shade" data-manifesto-shade />
        </div>
        <div className="manifesto-title-wrap">
          <Kicker className="manifesto-kicker">{c.kicker}</Kicker>
          <h2 className="t-display manifesto-title" data-manifesto-title>
            {c.title}
          </h2>
        </div>
      </div>

      <div className="page manifesto-body">
        {c.paragraphs.map((p) => (
          <p key={p} className="manifesto-p" data-words>
            <Words text={p} />
          </p>
        ))}
        <div className="manifesto-turn">
          <p className="manifesto-turn-a" data-words>
            <Words text={c.turn} />
          </p>
          <p className="manifesto-turn-b" data-reveal>
            {c.turnBody}
          </p>
        </div>
        <h3 className="manifesto-closing" data-split>
          {c.closing}
        </h3>
      </div>
    </section>
  );
}
