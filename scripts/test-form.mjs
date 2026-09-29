// Teste de ponta a ponta do formulário de contato (headless).
// Uso: node scripts/test-form.mjs http://localhost:3210/
import puppeteer from "puppeteer-core";
import assert from "node:assert/strict";

const url = process.argv[2] ?? "http://localhost:3210/";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.evaluateOnNewDocument(() => {
  window.__opened = [];
  window.open = (u) => (window.__opened.push(u), null);
});
await page.goto(url, { waitUntil: "networkidle0" });

// 1. Envio vazio: mostra erros e não abre nada.
await page.$eval(".form-submit", (b) => b.click());
const errors = await page.$$eval(".field-error", (els) => els.map((e) => e.textContent));
assert.ok(errors.length >= 6, `esperava erros de validação, veio ${errors.length}`);
assert.equal((await page.evaluate(() => window.__opened.length)), 0);

// 2. "Conhecer a Consultoria Diamante" pré-seleciona a opção no formulário.
await page.evaluate(() => document.querySelector('[data-interesse="diamante"]').click());
const checked = await page.$eval('input[name="interesse"]:checked', (i) => i.value);
assert.equal(checked, "diamante");

// 3. Dados inválidos: e-mail e WhatsApp.
await page.type("#f-nome", "Ana Ribeiro");
await page.type("#f-cargo", "Diretora");
await page.type("#f-escola", "Colégio Horizonte");
await page.type("#f-cidade", "Niterói/RJ");
await page.type("#f-whatsapp", "2199");
await page.type("#f-email", "ana@");
await page.$eval(".form-submit", (b) => b.click());
const err2 = await page.$$eval(".field-error", (els) => els.map((e) => e.textContent));
assert.equal(err2.length, 2, `esperava 2 erros (whatsapp, email): ${err2}`);

// 4. Corrige e envia: abre wa.me com a mensagem montada.
await page.$eval("#f-whatsapp", (i) => (i.value = ""));
await page.type("#f-whatsapp", "21987654321");
await page.$eval("#f-email", (i) => (i.value = ""));
await page.type("#f-email", "ana@colegiohorizonte.com.br");
const masked = await page.$eval("#f-whatsapp", (i) => i.value);
assert.equal(masked, "(21) 98765-4321");
await page.$eval(".form-submit", (b) => b.click());
const opened = await page.evaluate(() => window.__opened);
assert.equal(opened.length, 1);
const u = new URL(opened[0]);
assert.equal(u.hostname, "wa.me");
const text = u.searchParams.get("text");
for (const part of ["Ana Ribeiro", "Diretora", "Colégio Horizonte", "Niterói/RJ", "(21) 98765-4321", "ana@colegiohorizonte.com.br", "Consultoria Diamante"]) {
  assert.ok(text.includes(part), `mensagem sem "${part}"`);
}
assert.ok(!text.includes("Número de alunos"), "campo opcional vazio não deve aparecer");
assert.ok(await page.$(".form-done"), "estado de sucesso não apareceu");

console.log("form OK\n" + text);
await browser.close();
