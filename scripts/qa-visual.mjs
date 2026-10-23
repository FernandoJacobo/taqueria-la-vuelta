// QA visual con Playwright: capturas de página completa por ancho + detección de scroll horizontal.
// Uso (PowerShell o bash):
//   node scripts/qa-visual.mjs [url] [carpeta] [anchos separados por coma] [ruta]
//   node scripts/qa-visual.mjs http://localhost:3000 qa/ronda-1 390,768,1440
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3000";
const carpeta = process.argv[3] ?? "qa/capturas";
const anchos = (process.argv[4] ?? "360,390,768,1024,1280,1440,1536").split(",").map(Number);
const ruta = process.argv[5] ?? "/";
const reducido = process.env.REDUCED === "1";

await mkdir(carpeta, { recursive: true });
const navegador = await chromium.launch();
let problemas = 0;

for (const ancho of anchos) {
  const pagina = await navegador.newPage({
    viewport: { width: ancho, height: ancho < 800 ? 844 : 900 },
    deviceScaleFactor: 1,
    reducedMotion: reducido ? "reduce" : "no-preference",
  });
  const errores = [];
  pagina.on("pageerror", (e) => errores.push(e.message));
  pagina.on("console", (m) => m.type() === "error" && errores.push(m.text()));
  await pagina.goto(url + ruta, { waitUntil: "networkidle" });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(400);

  const desborde = await pagina.evaluate(() => {
    const doc = document.documentElement;
    const anchoVista = doc.clientWidth;
    const culpables = [];
    if (doc.scrollWidth > anchoVista + 1) {
      const recortado = (el) => {
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const o = getComputedStyle(a).overflowX;
          if (o !== "visible") return true;
        }
        return false;
      };
      for (const el of document.querySelectorAll("body *")) {
        if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") continue;
        const r = el.getBoundingClientRect();
        if (r.right > anchoVista + 1 && getComputedStyle(el).position !== "fixed" && !recortado(el)) {
          const clase = typeof el.className === "string" ? el.className : el.getAttribute("class") ?? "";
          culpables.push(`${el.tagName.toLowerCase()}.${clase.slice(0, 70)} → ${Math.round(r.right)}`);
        }
      }
    }
    return { scroll: doc.scrollWidth, vista: anchoVista, culpables: culpables.slice(0, 8) };
  });

  const nombre = `${carpeta}/${ruta === "/" ? "inicio" : ruta.replace(/\//g, "_")}-${ancho}.png`;
  await pagina.screenshot({ path: nombre, fullPage: true });
  const ok = desborde.scroll <= desborde.vista + 1 && errores.length === 0;
  if (!ok) problemas++;
  console.log(`${ok ? "OK " : "!! "} ${ancho}px  scrollWidth=${desborde.scroll}/${desborde.vista}  → ${nombre}`);
  for (const c of desborde.culpables) console.log(`     desborda: ${c}`);
  for (const e of errores) console.log(`     error: ${e}`);
  await pagina.close();
}

await navegador.close();
process.exitCode = problemas ? 1 : 0;
