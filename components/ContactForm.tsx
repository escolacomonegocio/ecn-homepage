"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { contato as c } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

// O envio abre o WhatsApp do time com os dados já escritos: o lead chega direto em
// quem vai atender, sem depender de backend. Quando houver CRM, o POST entra em submit().
type Field = { name: string; label: string; type?: string; autoComplete?: string; inputMode?: "tel" | "email" | "numeric"; required: boolean; wide?: boolean };

const fields: Field[] = [
  { name: "nome", label: "Nome", autoComplete: "name", required: true },
  { name: "cargo", label: "Cargo", autoComplete: "organization-title", required: true },
  { name: "escola", label: "Nome da escola", autoComplete: "organization", required: true, wide: true },
  { name: "cidade", label: "Cidade/UF", autoComplete: "address-level2", required: true },
  { name: "alunos", label: "Número de alunos", inputMode: "numeric", required: false },
  { name: "whatsapp", label: "WhatsApp", type: "tel", autoComplete: "tel", inputMode: "tel", required: true },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email", inputMode: "email", required: true },
];

function validate(name: string, v: string, required: boolean) {
  const value = v.trim();
  if (!value) return required ? "Preencha este campo." : "";
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Confira o e-mail. Exemplo: nome@escola.com.br";
  if (name === "whatsapp" && value.replace(/\D/g, "").length < 10) return "Informe o número com DDD. Exemplo: (21) 98765-4321";
  return "";
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [interesse, setInteresse] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentUrl, setSentUrl] = useState("");

  // Botões "Conhecer ..." da página levam até aqui com a opção já marcada.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest<HTMLElement>("[data-interesse]");
      if (el?.dataset.interesse) setInteresse(el.dataset.interesse);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    for (const f of fields) {
      const msg = validate(f.name, String(data.get(f.name) ?? ""), f.required);
      if (msg) next[f.name] = msg;
    }
    if (!interesse) next.interesse = "Escolha uma opção.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (String(data.get("site") ?? "")) return setSentUrl(whatsappLink()); // honeypot

    const label = c.interests.find((i) => i.id === interesse)?.label ?? interesse;
    const v = (k: string) => String(data.get(k) ?? "").trim();
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
  }

  if (sentUrl) {
    return (
      <div className="form-panel form-done" role="status">
        <span className="done-dot" aria-hidden="true" />
        <h3>Mensagem pronta no WhatsApp.</h3>
        <p>Abrimos uma conversa com o nosso time com os dados que você preencheu. Envie a mensagem para falar com um especialista.</p>
        <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <span className="btn-dot" aria-hidden="true" />
          <span>Abrir o WhatsApp de novo</span>
        </a>
      </div>
    );
  }

  return (
    <form ref={form} className="form-panel" onSubmit={submit} noValidate data-reveal>
      <div className="form-grid">
        {fields.map((f) => {
          const err = errors[f.name];
          return (
            <div key={f.name} className={`field ${f.wide ? "field-wide" : ""}`}>
              <label htmlFor={`f-${f.name}`}>
                {f.label}
                {!f.required && <span className="opt"> (opcional)</span>}
              </label>
              <input
                id={`f-${f.name}`}
                name={f.name}
                type={f.type ?? "text"}
                autoComplete={f.autoComplete}
                inputMode={f.inputMode}
                aria-invalid={!!err}
                aria-describedby={err ? `e-${f.name}` : undefined}
                onChange={f.name === "whatsapp" ? (e) => (e.currentTarget.value = maskPhone(e.currentTarget.value)) : undefined}
                onBlur={(e) => {
                  if (!errors[f.name]) return;
                  const msg = validate(f.name, e.currentTarget.value, f.required);
                  setErrors((prev) => ({ ...prev, [f.name]: msg }));
                }}
              />
              {err && (
                <p id={`e-${f.name}`} className="field-error">
                  {err}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <fieldset className="chips" aria-describedby={errors.interesse ? "e-interesse" : undefined}>
        <legend>{c.interestLabel}</legend>
        <div className="chips-row">
          {c.interests.map((i) => (
            <label key={i.id} className="chip">
              <input
                type="radio"
                name="interesse"
                value={i.id}
                checked={interesse === i.id}
                onChange={() => {
                  setInteresse(i.id);
                  setErrors((prev) => ({ ...prev, interesse: "" }));
                }}
              />
              <span>{i.label}</span>
            </label>
          ))}
        </div>
        {errors.interesse && (
          <p id="e-interesse" className="field-error">
            {errors.interesse}
          </p>
        )}
      </fieldset>

      <div className="hp" aria-hidden="true">
        <label htmlFor="f-site">Site</label>
        <input id="f-site" name="site" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn-primary form-submit">
        <span className="btn-dot" aria-hidden="true" />
        <span>{c.submit}</span>
      </button>
      <p className="form-note">Ao enviar, você abre uma conversa no WhatsApp com o time da ECN usando os dados acima.</p>
    </form>
  );
}
