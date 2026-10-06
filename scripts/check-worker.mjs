// Confere a divisão de rotas do Worker do Cloudflare (home na Vercel, resto no WordPress).
// Uso: node scripts/check-worker.mjs
import assert from "node:assert/strict";
import { vaiParaHome } from "../cloudflare/worker.mjs";

const u = (p) => new URL(p, "https://www.escolacomonegocio.com.br");
for (const p of ["/", "/?utm_source=ig", "/?_rsc=abc", "/_next/static/chunks/a.js", "/video/manifesto.mp4", "/icon.png", "/apple-icon.png", "/opengraph-image.jpg"])
  assert.equal(vaiParaHome(u(p)), true, p);
for (const p of ["/ine/", "/ges/", "/eds/", "/obrigado/", "/bio/", "/wp-admin/", "/wp-json/", "/wp-content/uploads/a.jpg", "/politica-de-privacidade/", "/?s=gestao", "/?p=12", "/?elementor-preview=1", "/.well-known/acme-challenge/x", "/favicon.ico"])
  assert.equal(vaiParaHome(u(p)), false, p);
console.log("worker OK");
