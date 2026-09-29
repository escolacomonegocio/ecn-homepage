import { Fragment, type ReactNode } from "react";

// Quebra o texto em palavras (<span class="w">) para a leitura guiada do manifesto.
// O texto continua contínuo para leitores de tela.
export function Words({ text }: { text: string }) {
  return text.split(" ").map((w, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className="w">{w}</span>
    </Fragment>
  ));
}

export type RichText = Array<string | { strong: string }>;

export function Rich({ parts }: { parts: string | RichText }) {
  if (typeof parts === "string") return parts;
  return parts.map((p, i) => (typeof p === "string" ? <Fragment key={i}>{p}</Fragment> : <strong key={i}>{p.strong}</strong>));
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "ink";
  className?: string;
  interesse?: string;
  external?: boolean;
};

export function Button({ href, children, variant = "primary", className = "", interesse, external }: BtnProps) {
  return (
    <a
      href={href}
      className={`btn btn-${variant} ${className}`}
      data-interesse={interesse}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="btn-dot" aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`kicker ${className}`}>{children}</p>;
}
