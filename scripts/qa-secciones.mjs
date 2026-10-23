// Captura cada sección por separado (más fácil de revisar que una página completa).
// Uso: node scripts/qa-secciones.mjs [url] [carpeta] [ancho]
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3000/";
const carpeta = process.argv[3] ?? "qa/secciones";
const ancho = Number(process.argv[4] ?? 1440);
await mkdir(carpeta, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: ancho, height: 900 }, reducedMotion: process.env.REDUCED === "1" ? "reduce" : "no-preference" });
await p.goto(url, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const bloques = await p.$$("body > header, main > section, main > section#voces > figure, body > footer");
let i = 0;
for (const el of bloques) {
  const id = (await el.getAttribute("id")) ?? (await el.evaluate((e) => e.tagName.toLowerCase()));
  const nombre = `${carpeta}/${String(i++).padStart(2, "0")}-${id}-${ancho}.png`;
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(150);
  await el.screenshot({ path: nombre });
  console.log(nombre);
}
await b.close();
