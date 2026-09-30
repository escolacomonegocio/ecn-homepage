import { Fragment, type ReactNode } from "react";

export type RichText = Array<string | { strong: string }>;

export function Rich({ parts }: { parts: string | RichText }) {
  if (typeof parts === "string") return parts;
  return parts.map((p, i) => (typeof p === "string" ? <Fragment key={i}>{p}</Fragment> : <strong key={i}>{p.strong}</strong>));
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "ink" | "glass";
  className?: string;
  /** Abre o formulário (modal) já com esta opção marcada. */
  interesse?: string;
  /** Abre o formulário (modal) sem opção marcada. */
  openForm?: boolean;
  /** Botão "puxa" levemente em direção ao cursor (desktop). */
  magnetic?: boolean;
  external?: boolean;
};

// Sem JS o link leva à seção de contato; com JS, os marcados com data-open-form /
// data-interesse abrem o formulário em modal.
export function Button({ href, children, variant = "primary", className = "", interesse, openForm, magnetic, external }: BtnProps) {
  return (
    <a
      href={href}
      className={`btn btn-${variant} ${className}`}
      data-interesse={interesse}
      data-open-form={openForm || interesse ? "" : undefined}
      data-magnetic={magnetic ? "" : undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="btn-dot" aria-hidden="true" />
      <span className="btn-label">{children}</span>
    </a>
  );
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`kicker ${className}`}>{children}</p>;
}
