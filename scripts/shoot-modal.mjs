// Captura o modal do formulário em cada etapa.
// Uso: node scripts/shoot-modal.mjs <url> <pasta> [largura] [altura]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const [url, out, w = "1440", h = "900"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
const mobile = Number(w) < 768;
await page.setViewport({ width: Number(w), height: Number(h), isMobile: mobile, hasTouch: mobile });
await page.evaluateOnNewDocument(() => (window.open = () => null));
await page.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 3000));
const shot = async (name) => {
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${out}/${name}.png` });
};
await page.$eval("[data-open-form]", (el) => el.click());
await shot("1-opcoes");
await page.$eval(".opt-card", (el) => el.click());
await shot("2-voce");
await page.type("#m-nome", "Ana Ribeiro");
await page.type("#m-cargo", "Diretora");
await page.$eval(".mstep.is-current .btn-primary", (b) => b.click());
await page.$eval(".mstep.is-current .btn-primary", (b) => b.click());
await shot("3-escola-erro");
await browser.close();
