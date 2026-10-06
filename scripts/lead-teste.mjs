// Envia UM lead real marcado [TESTE] pelo modal da página publicada e mostra a resposta da rota.
// Grava no CRM de produção: só rodar com autorização e apagar o lead depois.
// Uso: node scripts/lead-teste.mjs <url>
import puppeteer from "puppeteer-core";

const url = new URL(process.argv[2] ?? "https://ecn-homepage.vercel.app/");
url.searchParams.set("utm_source", "teste-integracao");
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => (window.open = () => null));
const resposta = new Promise((ok) => page.on("response", (r) => r.url().endsWith("/api/lead") && r.text().then((t) => ok(`${r.status()} ${t}`))));
await page.goto(url.toString(), { waitUntil: "networkidle0" });
const type = async (sel, text) => (await page.$eval(sel, (i) => i.focus()), page.keyboard.type(text));
const next = () => page.$eval(".mstep.is-current .btn-primary", (b) => b.click());
await page.$eval('[data-interesse="diamante"]', (el) => el.click());
await type("#m-nome", "[TESTE] Lead do site");
await type("#m-cargo", "Teste de integração");
await next();
await type("#m-escola", "[TESTE] Escola fictícia");
await type("#m-cidade", "Niterói/RJ");
await type("#m-alunos", "300");
await next();
await type("#m-whatsapp", "21999990000");
await type("#m-email", "teste.integracao@escolacomonegocio.com.br");
await next();
console.log("resposta /api/lead:", await Promise.race([resposta, new Promise((r) => setTimeout(() => r("sem resposta em 15s"), 15000))]));
await browser.close();
