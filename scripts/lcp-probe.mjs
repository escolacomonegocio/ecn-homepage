// Mede as entradas reais de LCP (não simuladas) com CPU 4x e rede 4G lenta, perfil mobile.
// Uso: node scripts/lcp-probe.mjs <url>
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3211/";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const cdp = await page.createCDPSession();
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
await page.evaluateOnNewDocument(() => {
  window.__lcp = [];
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__lcp.push({ t: Math.round(e.startTime), size: e.size, el: e.element ? e.element.tagName + "." + e.element.className : e.url });
  }).observe({ type: "largest-contentful-paint", buffered: true });
  window.__fcp = 0;
  new PerformanceObserver((l) => l.getEntries().forEach((e) => e.name === "first-contentful-paint" && (window.__fcp = Math.round(e.startTime)))).observe({ type: "paint", buffered: true });
});
await page.goto(url, { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 4000));
console.log(JSON.stringify(await page.evaluate(() => ({ fcp: window.__fcp, lcp: window.__lcp, fonts: [...document.fonts].filter((f) => f.status === "loaded").length })), null, 1));
await browser.close();
