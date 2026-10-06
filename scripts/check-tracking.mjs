// Confere o rastreamento da home: Pixel da Meta e UTMify carregam sem bloqueio de CSP.
// Uso: node scripts/check-tracking.mjs <url>
import puppeteer from "puppeteer-core";
import assert from "node:assert/strict";

const url = process.argv[2] ?? "http://localhost:3211/";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
const csp = [];
const hits = new Set();
// em localhost o UTMify manda eventos para localhost:3001 (modo de teste deles); em produção vai para tracking.utmify.com.br
page.on("console", (m) => /Content Security Policy|Refused to/i.test(m.text()) && !m.text().includes("localhost:3001") && csp.push(m.text()));
page.on("requestfinished", (r) => {
  const h = new URL(r.url()).host;
  if (/facebook|utmify|ipify|ipapi|jsdelivr/.test(h)) hits.add(`${h}${new URL(r.url()).pathname.slice(0, 40)}`);
});
await page.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 4000));
const info = await page.evaluate(() => ({
  fbq: typeof window.fbq,
  pixelId: window.pixelId,
  robots: document.querySelector('meta[name="robots"]')?.content,
  fbVerify: [...document.querySelectorAll('meta[name="facebook-domain-verification"]')].map((m) => m.content),
}));
console.log(info);
console.log([...hits]);
if (csp.length) console.log("CSP:", csp);
assert.equal(info.fbq, "function");
assert.equal(info.pixelId, "679d045ebf70adf4b38d9753");
assert.equal(info.fbVerify.length, 2);
assert.ok([...hits].some((h) => h.startsWith("connect.facebook.net")), "fbevents não carregou");
assert.ok([...hits].some((h) => h.startsWith("cdn.utmify.com.br")), "pixel UTMify não carregou");
assert.equal(csp.length, 0, "CSP bloqueou algo");
console.log("tracking OK");
await browser.close();
