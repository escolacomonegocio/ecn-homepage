// Teste de ponta a ponta do formulário em modal (headless).
// Uso: node scripts/test-form.mjs http://localhost:3211/
import puppeteer from "puppeteer-core";
import assert from "node:assert/strict";

const url = process.argv[2] ?? "http://localhost:3211/";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 800 });
await page.evaluateOnNewDocument(() => {
  window.__opened = [];
  window.open = (u) => (window.__opened.push(u), null);
});
await page.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 800));

const isOpen = () => page.$eval("dialog.mdialog", (d) => d.open);
const click = (sel) => page.$eval(sel, (el) => el.click());
const type = async (sel, text) => {
  await page.$eval(sel, (i) => i.focus());
  await page.keyboard.type(text);
};
const step = () => page.$eval(".mstep.is-current .mtitle", (h) => h.textContent);

// 1. "Fale com um especialista" do hero abre o modal na 1ª etapa.
await click(".hero .btn-glass");
assert.equal(await isOpen(), true, "modal não abriu");
assert.equal(await step(), "O que você procura?");

// 2. Esc fecha.
await page.keyboard.press("Escape");
assert.equal(await isOpen(), false, "Esc não fechou");

// 3. "Conhecer a Consultoria Diamante" abre direto na 2ª etapa com a opção marcada.
await click('[data-interesse="diamante"]');
assert.equal(await isOpen(), true);
assert.equal(await step(), "Sobre você");
assert.match(await page.$eval(".mchosen span", (s) => s.textContent), /Consultoria Diamante/);

// 4. Continuar vazio mostra erros e não avança.
await click(".mstep.is-current .btn-primary");
assert.equal(await step(), "Sobre você");
assert.equal((await page.$$(".mstep.is-current .field-error")).length, 2);

// 5. Preenche as etapas (Enter avança).
await type("#m-nome", "Ana Ribeiro");
await type("#m-cargo", "Diretora");
await page.keyboard.press("Enter");
await new Promise((r) => setTimeout(r, 120));
assert.equal(await step(), "Sobre a sua escola");
await type("#m-escola", "Colégio Horizonte");
await type("#m-cidade", "Niterói/RJ");
await click(".mstep.is-current .btn-primary");
assert.equal(await step(), "Como falamos com você?");
await type("#m-whatsapp", "21987654321");
assert.equal(await page.$eval("#m-whatsapp", (i) => i.value), "(21) 98765-4321");
await type("#m-email", "ana@");
await click(".mstep.is-current .btn-primary");
assert.equal((await page.$$(".mstep.is-current .field-error")).length, 1, "e-mail inválido deveria dar erro");
await type("#m-email", "colegiohorizonte.com.br");

// 6. Voltar mantém os dados.
await click(".mstep.is-current .mlink");
assert.equal(await step(), "Sobre a sua escola");
assert.equal(await page.$eval("#m-escola", (i) => i.value), "Colégio Horizonte");
await click(".mstep.is-current .btn-primary");

// 7. Envia: abre o WhatsApp com a mensagem montada e mostra o estado de sucesso.
await click(".mstep.is-current .btn-primary");
const opened = await page.evaluate(() => window.__opened);
assert.equal(opened.length, 1, "WhatsApp não abriu");
const u = new URL(opened[0]);
assert.equal(u.hostname, "wa.me");
const text = u.searchParams.get("text");
for (const part of ["Ana Ribeiro", "Diretora", "Colégio Horizonte", "Niterói/RJ", "(21) 98765-4321", "ana@colegiohorizonte.com.br", "Consultoria Diamante"]) {
  assert.ok(text.includes(part), `mensagem sem "${part}"`);
}
assert.ok(!text.includes("Número de alunos"), "campo opcional vazio não deve aparecer");
assert.ok(await page.$(".mdone"), "estado de sucesso não apareceu");

// 8. Opção escolhida no cartão da seção Contato abre na 2ª etapa.
await click(".mclose");
await click('.start-opt[data-interesse="cursos"]');
assert.equal(await step(), "Sobre você");
assert.match(await page.$eval(".mchosen span", (s) => s.textContent), /Cursos/);

console.log("modal OK\n" + text);
await browser.close();
