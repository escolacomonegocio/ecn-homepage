// Confere que o ecossistema não pula de solução sozinho: entra no bloco fixado,
// rola um pouco (como um usuário) e verifica qual painel está ativo depois de parar.
// Uso: node scripts/check-eco-scroll.mjs <url>
import puppeteer from "puppeteer-core";
import assert from "node:assert/strict";

const url = process.argv[2] ?? "http://localhost:3211/";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 2000));
const active = () => page.evaluate(() => document.querySelector("[data-eco]").dataset.active);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// chega no topo do bloco rolando com a roda do mouse
const top = await page.evaluate(() => document.querySelector("[data-eco]").getBoundingClientRect().top + scrollY);
await page.evaluate((y) => window.scrollTo(0, y - 600), top);
await wait(600);
await page.mouse.move(700, 450);
for (let i = 0; i < 6; i++) {
  await page.mouse.wheel({ deltaY: 120 });
  await wait(60);
}
await wait(1500);
const a1 = await active();
console.log("depois de entrar no bloco:", a1);
assert.equal(a1, "diamante", "entrou no bloco e não está na Diamante");

// um toque pequeno de rolagem não pode trocar de solução
await page.mouse.wheel({ deltaY: 100 });
await wait(1500);
const a2 = await active();
console.log("depois de um toque de rolagem:", a2);
assert.equal(a2, "diamante", "um toque pequeno pulou de solução");

// rolar uma tela inteira leva à próxima
for (let i = 0; i < 8; i++) {
  await page.mouse.wheel({ deltaY: 120 });
  await wait(60);
}
await wait(1500);
console.log("depois de ~1 tela:", await active());
console.log("eco OK");
await browser.close();
