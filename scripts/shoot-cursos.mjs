// Captura a aba Cursos do ecossistema (desktop fixado e mobile) e confere os links.
// Uso: node scripts/shoot-cursos.mjs <url> <pasta>
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const [url = "http://localhost:3211/", out = "C:/temp/cursos"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
for (const [w, h] of [[1440, 900], [1366, 768], [390, 844]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto(url, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1800));
  if (w >= 1024) {
    const top = await page.evaluate(() => document.querySelector("[data-eco]").getBoundingClientRect().top + scrollY);
    await page.evaluate((y) => window.scrollTo(0, y - 300), top);
    await new Promise((r) => setTimeout(r, 800));
    await page.mouse.move(w / 2, h / 2);
    for (let i = 0; i < 4; i++) { await page.mouse.wheel({ deltaY: 100 }); await new Promise((r) => setTimeout(r, 40)); }
    await new Promise((r) => setTimeout(r, 1200));
    await page.click('[aria-controls="cursos"]');
    await new Promise((r) => setTimeout(r, 2200));
  } else {
    await page.evaluate(() => document.querySelector("#cursos .eco-links").scrollIntoView({ block: "center" }));
    await new Promise((r) => setTimeout(r, 1500));
  }
  const links = await page.$$eval("#cursos .eco-links a", (as) => as.map((a) => `${a.textContent.trim()} ${a.href}`));
  console.log(w, links);
  await page.screenshot({ path: `${out}/${w}.png` });
  await page.close();
}
await browser.close();
