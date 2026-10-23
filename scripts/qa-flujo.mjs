// Prueba de punta a punta (Playwright, sin test runner): pedido, persistencia, salsero, taquiza,
// teclado y movimiento reducido. Uso: node scripts/qa-flujo.mjs [url]
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:4173/";
const b = await chromium.launch();
let fallos = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "OK " : "!! "} ${msg}`);
  if (!cond) fallos++;
};

// ---------- Pedido en móvil ----------
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "networkidle" });

await p.getByRole("button", { name: "Agregar Taco de pastor", exact: true }).click();
await p.getByRole("button", { name: /Agregar Taco de pastor \(llevas 1\)/ }).click();
await p.getByRole("button", { name: /Agregar Taco de pastor con queso/ }).click();
await p.getByRole("button", { name: "Agregar Agua de horchata", exact: true }).click();
const barra = p.getByRole("navigation", { name: "Acciones rápidas" });
ok((await barra.textContent()).includes("4 piezas · $115"), "la barra inferior muestra 4 piezas · $115 (24+24+32+35)");

await barra.getByRole("button", { name: /Tu comanda/ }).click();
const comanda = p.getByRole("dialog", { name: "Comanda" });
ok(await comanda.isVisible(), "la comanda se abre como diálogo");
await comanda.getByRole("button", { name: "Quitar uno: Agua de horchata" }).click();
ok((await comanda.textContent()).includes("$80"), "quitar la horchata baja el total a $80");

await comanda.getByRole("button", { name: /Enviar pedido por WhatsApp/ }).click();
ok(await comanda.getByText("Pon tu nombre").isVisible(), "sin nombre aparece el error de validación");
await comanda.getByLabel("Nombre").fill("Ana");
await comanda.getByLabel(/Notas/).fill("sin cebolla");
await comanda.getByText("Comer aquí").click();
await comanda.getByRole("button", { name: /Enviar pedido por WhatsApp/ }).click();
const vista = p.getByRole("dialog", { name: "Vista previa del pedido" });
ok(await vista.isVisible(), "modo demo: aparece la vista previa en lugar de abrir wa.me");
const texto = await vista.locator("pre").textContent();
ok(
  texto.includes("2 x Taco de pastor — $48") && texto.includes("1 x Taco de pastor con queso — $32") && texto.includes("Total: $80 MXN"),
  "el mensaje trae renglones y total",
);
ok(texto.includes("Tipo: Para comer aquí") && texto.includes("Nombre: Ana") && texto.includes("Notas: sin cebolla"), "el mensaje trae tipo, nombre y notas");
ok(!p.url().includes("wa.me"), "no se navegó a wa.me");
await vista.getByRole("button", { name: "Cerrar" }).click();
await p.keyboard.press("Escape");

await p.reload({ waitUntil: "networkidle" });
await p.waitForTimeout(300);
ok((await barra.textContent()).includes("3 piezas · $80"), "la comanda persiste al recargar (localStorage)");

// ---------- Salsero ----------
const salsero = p.locator("#salsero");
const antes = await salsero.evaluate((e) => getComputedStyle(e).backgroundColor);
await salsero.getByText("Habanero", { exact: true }).click();
await p.waitForTimeout(700);
const despues = await salsero.evaluate((e) => getComputedStyle(e).backgroundColor);
ok(antes !== despues && despues === "rgb(242, 140, 27)", `elegir habanero repinta la sección (${antes} → ${despues})`);
ok(await salsero.getByRole("heading", { name: "Habanero tatemado" }).isVisible(), "la ficha muestra la salsa elegida");
await salsero.getByRole("button", { name: /Pedirla extra/ }).click();
ok((await barra.textContent()).includes("4 piezas · $92"), "pedirla extra la agrega a la comanda ($12)");

// Teclado: flechas dentro del grupo de radios
await salsero.locator('input[value="salsa-habanero"]').focus();
await p.keyboard.press("ArrowRight");
await p.waitForTimeout(600);
ok(await salsero.getByRole("heading", { name: "Morita con cacahuate" }).isVisible(), "flecha derecha cambia a la siguiente salsa");

// ---------- Taquiza ----------
const taquiza = p.locator("#taquiza");
await taquiza.getByText("De cuñado", { exact: true }).click();
ok((await taquiza.textContent()).includes("550"), "de cuñado con 50 personas = 550 tacos");
await taquiza.getByRole("button", { name: /Sumar/ }).click();
ok((await taquiza.textContent()).includes("605"), "+5 personas recalcula (55 × 11 = 605)");
await taquiza.getByLabel("Nombre").fill("Lupita");
await taquiza.getByRole("button", { name: "Cotizar mi taquiza" }).click();
const vistaT = p.getByRole("dialog", { name: "Vista previa de la cotización" });
ok(await vistaT.isVisible(), "cotizar abre la vista previa en modo demo");
ok((await vistaT.locator("pre").textContent()).includes("Tacos estimados: 605"), "la cotización trae los tacos calculados");
await vistaT.getByRole("button", { name: "Cerrar" }).click();

// ---------- Errores de consola ----------
await ctx.close();

// ---------- Movimiento reducido ----------
const rm = await b.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
await rm.goto(url, { waitUntil: "networkidle" });
const anim = await rm.evaluate(() =>
  [...document.querySelectorAll(".animate-giro, .animate-marquee")].map((e) => getComputedStyle(e).animationName),
);
ok(anim.length > 0 && anim.every((n) => n === "none"), `con prefers-reduced-motion no hay trompo ni marquee animados (${anim.length} elementos)`);

// ---------- Teclado desde arriba ----------
await rm.keyboard.press("Tab");
const primero = await rm.evaluate(() => document.activeElement?.textContent?.trim());
ok(primero === "Saltar al contenido", "el primer Tab llega al skip link");
await rm.close();

await b.close();
console.log(fallos ? `\n${fallos} fallo(s)` : "\nTodo bien.");
process.exitCode = fallos ? 1 : 0;
