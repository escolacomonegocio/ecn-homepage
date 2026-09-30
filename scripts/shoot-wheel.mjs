// Rola com a roda do mouse (como usuário) a partir de um seletor e captura quadros.
// Uso: node scripts/shoot-wheel.mjs <url> <seletor> <pasta> [largura] [altura] [passos] [pxPorPasso]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const [url, sel, out, w = "1440", h = "900", steps = "8", px = "450"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: Number(w), height: Number(h) });
await page.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1800));
const top = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, sel);
// chega perto com rolagem nativa e completa com a roda
await page.evaluate((y) => window.scrollTo(0, y - 400), top);
await new Promise((r) => setTimeout(r, 800));
await page.mouse.move(Number(w) / 2, Number(h) / 2);
const wheel = async (d) => {
  for (let moved = 0; moved < d; moved += 100) {
    await page.mouse.wheel({ deltaY: 100 });
    await new Promise((r) => setTimeout(r, 30));
  }
  await new Promise((r) => setTimeout(r, 1400));
};
await wheel(400);
for (let i = 0; i < Number(steps); i++) {
  await page.screenshot({ path: `${out}/${String(i).padStart(2, "0")}.png` });
  await wheel(Number(px));
}
await browser.close();
