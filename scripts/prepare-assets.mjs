// Gera os assets otimizados a partir da pasta do cliente (fotos, fontes, logos).
// Uso: node scripts/prepare-assets.mjs "<pasta HOMEPAGE>"
import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { compress } from "wawoff2";
import subsetFont from "subset-font";

const SRC = process.argv[2];
if (!SRC) throw new Error("Informe a pasta HOMEPAGE do cliente.");
const OUT = "assets";
mkdirSync(OUT, { recursive: true });
mkdirSync("app/fonts", { recursive: true });

const id = join(SRC, "Identidade Visual - LP");
const ev = join(SRC, "FOTOS EVENTO");

// Retratos: os PNGs são recortes (fundo transparente). Corta no contorno da pessoa
// (caixa do canal alfa) e mantém a transparência em WebP.
const retratos = [
  ["FOTOS/LEONARDO CHUCRUTE.png", "leonardo-chucrute.webp"],
  ["FOTOS/MAURICIO THOMAS.png", "mauricio-thomas.webp"],
  ["FOTOS/PAULO PEREIRA.png", "paulo-pereira.webp"],
];
for (const [src, out] of retratos) {
  const file = join(id, src);
  const { info: box } = await sharp(file).extractChannel(3).trim({ background: "#000000", threshold: 12 }).toBuffer({ resolveWithObject: true });
  const info = await sharp(file)
    .extract({ left: -box.trimOffsetLeft, top: -box.trimOffsetTop, width: box.width, height: box.height })
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(join(OUT, out));
  console.log(out, info.width, info.height, Math.round(info.size / 1024) + "KB");
}

// Fotos de evento: aplica a rotação EXIF (várias foram feitas na vertical) e reduz.
const eventos = [
  ["FOTOS/DSC04215.JPG", "evento-palco.jpg"],
  ["FOTOS/DSC04317.JPG", "evento-sala.jpg"],
  ["FOTOS/DSC04453.JPG", "evento-leonardo.jpg"],
  ["FOTOS/DSC04563.JPG", "evento-mauricio.jpg"],
  ["FOTOS/DSC04628.JPG", "evento-plateia.jpg"],
  ["FOTOS/DSC04287.JPG", "evento-banner.jpg"],
  ["ecnday1.jpeg", "evento-feira.jpg"],
];
for (const [src, out] of eventos) {
  const img = sharp(join(ev, src)).rotate();
  const meta = await img.metadata();
  const portrait = (meta.orientation ?? 1) >= 5 ? meta.width > meta.height : meta.height > meta.width;
  const info = await img
    .resize(portrait ? { height: 2000, withoutEnlargement: true } : { width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(join(OUT, out));
  console.log(out, info.width, info.height, Math.round(info.size / 1024) + "KB");
}

// Satoshi: OTF -> WOFF2 recortado para latim (ASCII + Latin-1, que cobre todos os acentos
// do português, + pontuação tipográfica). Menos bytes no caminho crítico do primeiro paint.
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => String.fromCodePoint(a + i)).join("");
const glyphs = range(0x20, 0x7e) + range(0xa0, 0xff) + "–—‘’‚“”„•…‹›€™";
for (const w of ["Regular", "Medium", "Bold", "Black"]) {
  const buf = readFileSync(join(id, "FONTES", `Satoshi-${w}.otf`));
  const full = await compress(buf);
  const out = await subsetFont(buf, glyphs, { targetFormat: "woff2" });
  writeFileSync(`app/fonts/Satoshi-${w}.woff2`, out);
  console.log(`Satoshi-${w}.woff2`, Math.round(full.length / 1024) + "KB ->", Math.round(out.length / 1024) + "KB");
}

// Ícones: símbolo "e•" em fundo grafite, mesma geometria do Logo.tsx.
const symbol = (size, pad) => {
  const box = { x: 70, y: 400, w: 745, h: 672 };
  const s = (size - pad * 2) / box.w;
  const ty = (size - box.h * s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#1b1f22"/>
  <defs><clipPath id="g"><path clip-rule="evenodd" d="M0 0H2000V1200H0Z M608 736a118 118 0 1 0 236 0a118 118 0 1 0-236 0Z"/></clipPath></defs>
  <g transform="translate(${pad} ${ty}) scale(${s}) translate(${-box.x} ${-box.y})">
    <g clip-path="url(#g)" fill="none" stroke="#f7faf8" stroke-width="76" stroke-linecap="round">
      <path d="M697 736A293 293 0 1 0 614.7 939.8"/>
      <rect x="120" y="711" width="630" height="51" fill="#f7faf8" stroke="none"/>
    </g>
    <circle cx="726" cy="736" r="82" fill="#00e0a0"/>
  </g></svg>`;
};
await sharp(Buffer.from(symbol(512, 110))).png().toFile("app/icon.png");
await sharp(Buffer.from(symbol(180, 38))).png().toFile("app/apple-icon.png");

// Imagem de compartilhamento 1200x630: foto do evento escurecida + logo.
const logo = await sharp(join(id, "LOGOS", "Logo colorida.png"))
  .trim()
  .resize({ width: 520 })
  .png()
  .toBuffer();
const foto = await sharp(join(OUT, "evento-palco.jpg"))
  .resize(1200, 630, { fit: "cover" })
  .modulate({ brightness: 0.42, saturation: 0.7 })
  .toBuffer();
await sharp(foto)
  .composite([
    { input: Buffer.from(`<svg width="1200" height="630"><defs><linearGradient id="a" x1="0" x2="1"><stop offset="0" stop-color="#1b1f22" stop-opacity=".92"/><stop offset=".7" stop-color="#1b1f22" stop-opacity=".2"/></linearGradient></defs><rect width="1200" height="630" fill="url(#a)"/></svg>`) },
    { input: logo, left: 88, top: 215 },
  ])
  .jpeg({ quality: 82 })
  .toFile("app/opengraph-image.jpg");
console.log("icons + og ok");
