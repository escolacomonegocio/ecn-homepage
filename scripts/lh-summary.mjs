// Resume relatórios JSON do Lighthouse: notas, Web Vitals e auditorias abaixo de 0.9.
// Uso: node scripts/lh-summary.mjs relatorio1.json [relatorio2.json ...]
import { readFileSync } from "node:fs";

for (const file of process.argv.slice(2)) {
  const r = JSON.parse(readFileSync(file, "utf8"));
  const a = r.audits;
  const scores = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
  const vit = ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"]
    .map((k) => `${k.split("-").map((w) => w[0]).join("").toUpperCase()} ${a[k].displayValue}`)
    .join(" · ");
  const weak = Object.values(a)
    .filter((x) => x.score !== null && x.score < 0.9 && !["informative", "notApplicable", "manual"].includes(x.scoreDisplayMode))
    .map((x) => `${x.id}${x.displayValue ? ` (${x.displayValue})` : ""}`);
  const lcp = a["largest-contentful-paint-element"]?.details?.items?.[1]?.items?.map((p) => `${p.phase} ${Math.round(p.timing)}ms`).join(", ");
  console.log(`${file}\n  ${JSON.stringify(scores)}\n  ${vit}\n  LCP fases: ${lcp ?? "-"}\n  abaixo de 0.9: ${weak.join(" | ") || "nenhuma"}`);
}
