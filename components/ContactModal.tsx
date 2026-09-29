"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { contato as c } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

// Formulário em modal, uma etapa por vez. Abre por qualquer elemento com
// data-open-form (sem opção) ou data-interesse="<id>" (opção já marcada, pula a 1ª etapa).
// O envio abre o WhatsApp do time com os dados escritos: o lead chega direto em quem
// atende, sem backend. Quando houver CRM, o POST entra em send().

type Field = { name: string; label: string; type?: string; autoComplete?: string; inputMode?: "tel" | "email" | "numeric" | "text"; required: boolean; placeholder?: string };

const steps: Array<{ title: string; fields: Field[] }> = [
  { title: c.interestLabel, fields: [] },
  {
    title: "Sobre você",
    fields: [
      { name: "nome", label: "Nome", autoComplete: "name", required: true, placeholder: "Seu nome" },
      { name: "cargo", label: "Cargo", autoComplete: "organization-title", required: true, placeholder: "Ex.: Diretora, mantenedor" },
    ],
  },
  {
    title: "Sobre a sua escola",
    fields: [
      { name: "escola", label: "Nome da escola", autoComplete: "organization", required: true, placeholder: "Nome da instituição" },
      { name: "cidade", label: "Cidade/UF", autoComplete: "address-level2", required: true, placeholder: "Ex.: Niterói/RJ" },
      { name: "alunos", label: "Número de alunos", inputMode: "numeric", required: false, placeholder: "Aproximado" },
    ],
  },
  {
    title: "Como falamos com você?",
    fields: [
      { name: "whatsapp", label: "WhatsApp", type: "tel", autoComplete: "tel", inputMode: "tel", required: true, placeholder: "(21) 98765-4321" },
      { name: "email", label: "E-mail", type: "email", autoComplete: "email", inputMode: "email", required: true, placeholder: "nome@escola.com.br" },
    ],
  },
];
const LAST = steps.length - 1;

function validate(name: string, v: string, required: boolean) {
  const value = v.trim();
  if (!value) return required ? "Preencha este campo." : "";
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Confira o e-mail. Exemplo: nome@escola.com.br";
  if (name === "whatsapp" && value.replace(/\D/g, "").length < 10) return "Informe o número com DDD.";
  return "";
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function ContactModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [interesse, setInteresse] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentUrl, setSentUrl] = useState("");

  const open = useCallback((preset?: string) => {
    const d = dialog.current;
    if (!d || d.open) return;
    setErrors({});
    setSentUrl("");
    setDir(1);
    if (preset) {
      setInteresse(preset);
      setStep(1);
    } else setStep(0);
    window.dispatchEvent(new Event("ecn:lock"));
    d.showModal();
    // foco na primeira opção/campo da etapa, não no botão fechar
    window.setTimeout(() => {
      d.querySelector<HTMLElement>(".mstep.is-current input, .mstep.is-current .opt-card")?.focus({ preventScroll: true });
    }, 80);
  }, []);

  const close = useCallback(() => dialog.current?.close(), []);

  // Qualquer gatilho da página abre o modal (captura: vence o scroll de âncora).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest<HTMLElement>("[data-open-form],[data-interesse]");
      if (!el || el.closest("dialog")) return;
      e.preventDefault();
      e.stopPropagation();
      open(el.dataset.interesse);
    };
    document.addEventListener("click", onClick, true);
    const d = dialog.current!;
    const onClose = () => window.dispatchEvent(new Event("ecn:unlock"));
    d.addEventListener("close", onClose);
    return () => {
      document.removeEventListener("click", onClick, true);
      d.removeEventListener("close", onClose);
    };
  }, [open]);

  // Foco no primeiro campo da etapa (sem rolar a página).
  useEffect(() => {
    if (!dialog.current?.open) return;
    const t = window.setTimeout(() => {
      const target = panel.current?.querySelector<HTMLElement>(".mstep.is-current input, .mstep.is-current .opt-card[aria-pressed='true'], .mstep.is-current .opt-card");
      target?.focus({ preventScroll: true });
    }, 60);
    return () => window.clearTimeout(t);
  }, [step, sentUrl]);

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const checkStep = (i: number) => {
    const next: Record<string, string> = {};
    for (const f of steps[i].fields) {
      const msg = validate(f.name, values[f.name] ?? "", f.required);
      if (msg) next[f.name] = msg;
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) panel.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus({ preventScroll: true });
    return !first;
  };

  const send = () => {
    if (values.site) return setSentUrl(whatsappLink()); // honeypot
    const label = c.interests.find((i) => i.id === interesse)?.label ?? interesse;
    const v = (k: string) => (values[k] ?? "").trim();
    const msg = [
      "Olá! Vim pelo site da ECN e quero falar com um especialista.",
      "",
      `Nome: ${v("nome")}`,
      `Cargo: ${v("cargo")}`,
      `Escola: ${v("escola")}`,
      `Cidade/UF: ${v("cidade")}`,
      v("alunos") ? `Número de alunos: ${v("alunos")}` : null,
      `WhatsApp: ${v("whatsapp")}`,
      `E-mail: ${v("email")}`,
      `O que procuro: ${label}`,
    ]
      .filter((l) => l !== null)
      .join("\n");
    const url = whatsappLink(msg);
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  const next = () => {
    if (step === 0) return interesse ? go(1) : setErrors({ interesse: "Escolha uma opção." });
    if (!checkStep(step)) return;
    if (step === LAST) return send();
    go(step + 1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
      e.preventDefault();
      next();
    }
  };

  // Reflexo do vidro acompanha o cursor.
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const chosen = c.interests.find((i) => i.id === interesse);

  return (
    <dialog
      ref={dialog}
      className="mdialog"
      aria-labelledby="mtitle"
      data-lenis-prevent
      onClick={(e) => e.target === dialog.current && close()}
    >
      <div className="morbs" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div ref={panel} className="mpanel glass" onPointerMove={onPointerMove} onKeyDown={onKeyDown} data-dir={dir}>
        <div className="mhead">
          <div>
            <p className="mkicker">{c.title}</p>
            {!sentUrl && (
              <div className="mprogress" aria-label={`Etapa ${step + 1} de ${steps.length}`}>
                {steps.map((_, i) => (
                  <span key={i} data-on={i <= step} />
                ))}
              </div>
            )}
          </div>
          <button type="button" className="mclose" onClick={close} aria-label="Fechar">
            <span aria-hidden="true" />
          </button>
        </div>

        {sentUrl ? (
          <div className="mstep is-current mdone" role="status">
            <span className="done-dot" aria-hidden="true" />
            <h2 id="mtitle" className="mtitle">
              Mensagem pronta no WhatsApp.
            </h2>
            <p className="mtext">Abrimos uma conversa com o nosso time com os dados que você preencheu. Envie a mensagem para falar com um especialista.</p>
            <div className="mactions">
              <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <span className="btn-dot" aria-hidden="true" />
                <span className="btn-label">Abrir o WhatsApp de novo</span>
              </a>
              <button type="button" className="mlink" onClick={close}>
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <div className="msteps">
            {steps.map((s, i) => (
              <div key={i} className={`mstep ${i === step ? "is-current" : ""}`} hidden={i !== step}>
                <h2 id={i === step ? "mtitle" : undefined} className="mtitle">
                  {s.title}
                </h2>

                {i === 0 ? (
                  <>
                    <div className="opt-grid" role="group" aria-label={c.interestLabel}>
                      {c.interests.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          className="opt-card"
                          aria-pressed={interesse === o.id}
                          onClick={() => {
                            setInteresse(o.id);
                            setErrors({});
                            window.setTimeout(() => go(1), 180);
                          }}
                        >
                          <span className="opt-dot" aria-hidden="true" />
                          {o.label}
                        </button>
                      ))}
                    </div>
                    {errors.interesse && <p className="field-error">{errors.interesse}</p>}
                  </>
                ) : (
                  <>
                    {chosen && i === 1 && (
                      <p className="mchosen">
                        <span>{chosen.label}</span>
                        <button type="button" className="mlink" onClick={() => go(0)}>
                          trocar
                        </button>
                      </p>
                    )}
                    <div className="mfields">
                      {s.fields.map((f) => {
                        const err = errors[f.name];
                        return (
                          <div key={f.name} className="mfield">
                            <label htmlFor={`m-${f.name}`}>
                              {f.label}
                              {!f.required && <span className="opt"> (opcional)</span>}
                            </label>
                            <input
                              id={`m-${f.name}`}
                              name={f.name}
                              type={f.type ?? "text"}
                              autoComplete={f.autoComplete}
                              inputMode={f.inputMode}
                              placeholder={f.placeholder}
                              value={values[f.name] ?? ""}
                              aria-invalid={!!err}
                              aria-describedby={err ? `me-${f.name}` : undefined}
                              onChange={(e) => {
                                const val = f.name === "whatsapp" ? maskPhone(e.target.value) : e.target.value;
                                setValues((p) => ({ ...p, [f.name]: val }));
                                if (err) setErrors((p) => ({ ...p, [f.name]: validate(f.name, val, f.required) }));
                              }}
                            />
                            {err && (
                              <p id={`me-${f.name}`} className="field-error">
                                {err}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mactions">
                      <button type="button" className="btn btn-primary" onClick={next}>
                        <span className="btn-dot" aria-hidden="true" />
                        <span className="btn-label">{i === LAST ? c.submit : "Continuar"}</span>
                      </button>
                      <button type="button" className="mlink" onClick={() => go(i - 1)}>
                        Voltar
                      </button>
                    </div>
                    {i === LAST && <p className="form-note">Ao enviar, você abre uma conversa no WhatsApp com o time da ECN usando os dados acima.</p>}
                  </>
                )}
              </div>
            ))}
            <div className="hp" aria-hidden="true">
              <label htmlFor="m-site">Site</label>
              <input id="m-site" name="site" tabIndex={-1} autoComplete="off" onChange={(e) => setValues((p) => ({ ...p, site: e.target.value }))} />
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
