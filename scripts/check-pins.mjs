// Confere em vários tamanhos de tela se o ecossistema fixa (is-pinned) e se algum
// painel estoura a área. Uso: node scripts/check-pins.mjs <url>
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3211/";
const sizes = [
  [1920, 1080],
  [1536, 864],
  [1440, 900],
  [1440, 800],
  [1366, 768],
  [1280, 720],
  [1024, 768],
];
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
for (const [w, h] of sizes) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto(url, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));
  const r = await page.evaluate(() => {
    const eco = document.querySelector("[data-eco]");
    const area = eco.querySelector(".eco-panels");
    const tallest = Math.max(...[...eco.querySelectorAll(".eco-text")].map((t) => t.scrollHeight));
    return { pinned: eco.classList.contains("is-pinned"), area: area.clientHeight, tallest, metodoPinned: !!document.querySelector(".metodo-stage.is-pinned") };
  });
  console.log(`${w}x${h}`, JSON.stringify(r));
  await page.close();
}
await browser.close();
