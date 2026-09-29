// Captura a animação de entrada do hero em instantes fixos.
// Uso: node scripts/shoot-intro.mjs <url> <pasta> [largura] [altura]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const [url, out, w = "1440", h = "900"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
const mobile = Number(w) < 768;
await page.setViewport({ width: Number(w), height: Number(h), isMobile: mobile, hasTouch: mobile });
await page.goto(url, { waitUntil: "domcontentloaded" });
const t0 = Date.now();
for (const ms of [150, 500, 900, 1400, 2000, 2800, 4200]) {
  const wait = ms - (Date.now() - t0);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  await page.screenshot({ path: `${out}/t${String(ms).padStart(4, "0")}.png` });
}
await browser.close();
