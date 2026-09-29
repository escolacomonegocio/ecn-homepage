// Visual proof harness: captures a page at several scroll positions.
// Usage: node scripts/shoot.mjs <url> <outDir> [width=1440] [height=900] [stepPx=900] [maxShots=40]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const [url, outDir, w = "1440", h = "900", step = "900", max = "40"] = process.argv.slice(2);
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--hide-scrollbars"] });
const page = await browser.newPage();
const mobile = Number(w) < 768;
await page.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
// REDUCED=1 simula "reduzir movimento" do sistema operacional
if (process.env.REDUCED) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1800));

const total = await page.evaluate(() => document.documentElement.scrollHeight);
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
let y = 0;
let prev = -1;
for (let i = 0; i < Number(max) && y <= total; i++) {
  await page.screenshot({ path: `${outDir}/${String(i).padStart(2, "0")}.png` });
  // wheel scrolling so smooth-scroll libraries (Lenis) and ScrollTrigger react like a real user
  const target = y + Number(step);
  while (y < target) {
    await page.mouse.wheel({ deltaY: 150 });
    y += 150;
    await new Promise((r) => setTimeout(r, 40));
  }
  await new Promise((r) => setTimeout(r, 900));
  const now = await page.evaluate(() => window.scrollY);
  if (i > 0 && now === prev) break;
  prev = y = now;
}
console.log(JSON.stringify({ total, shots: y, errors }));
await browser.close();
