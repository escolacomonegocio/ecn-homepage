import { rodape as c } from "@/lib/content";
import { site } from "@/lib/site";
import { Logo } from "../Logo";

export function Footer() {
  return (
    <footer className="footer" data-theme="dark">
      <div className="page footer-grid">
        <div className="footer-brand">
          <Logo id="footer" className="h-9 w-auto" />
          <p className="footer-name">{c.name}</p>
          <p className="footer-tagline">{c.tagline}</p>
          <p className="footer-about">{c.about}</p>
        </div>
        {c.columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="footer-col">
            <p className="footer-col-title">{col.title}</p>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="page footer-base">
        <p>{c.group}</p>
        <p>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            @escolacomonegocio
          </a>
          <span aria-hidden="true"> · </span>© {new Date().getFullYear()} ECN
        </p>
      </div>
    </footer>
  );
}
