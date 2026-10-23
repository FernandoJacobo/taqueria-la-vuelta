import { describe, expect, it } from "vitest";
import { calcularTaquiza, limitarPersonas, redondearArriba, SUPUESTOS, type EntradaTaquiza } from "./taquiza";

const sinExtras = { aguas: false, cebollitas: false, mesas: false, taquero: false };
const base: EntradaTaquiza = { personas: 50, apetito: "normal", guisados: ["pastor", "suadero"], extras: sinExtras };

describe("redondeos y límites", () => {
  it("redondea hacia arriba al medio kilo", () => {
    expect(redondearArriba(5.36, 0.5)).toBe(5.5);
    expect(redondearArriba(5.5, 0.5)).toBe(5.5);
    expect(redondearArriba(0.1, 0.5)).toBe(0.5);
  });
  it("limita las personas al rango permitido", () => {
    expect(limitarPersonas(3)).toBe(SUPUESTOS.minimoPersonas);
    expect(limitarPersonas(10_000)).toBe(SUPUESTOS.maximoPersonas);
    expect(limitarPersonas(Number.NaN)).toBe(SUPUESTOS.minimoPersonas);
    expect(limitarPersonas(42.6)).toBe(43);
  });
});

describe("calcularTaquiza", () => {
  it("50 personas de apetito normal con dos guisados", () => {
    const r = calcularTaquiza(base);
    expect(r.tacos).toBe(300);
    expect(r.porGuisado).toEqual([
      { id: "pastor", nombre: "Pastor", tacos: 150, kg: 5.5, importe: 150 * 19 },
      { id: "suadero", nombre: "Suadero", tacos: 150, kg: 5.5, importe: 150 * 21 },
    ]);
    expect(r.kgCarne).toBe(11);
    expect(r.tortillas).toBe(660); // 300 tacos × 2 tortillas × 1.1 de merma
    expect(r.kgTortilla).toBe(22); // 660 / 30
    expect(r.kgCebolla).toBe(3);
    expect(r.manojosCilantro).toBe(8);
    expect(r.limones).toBe(100);
    expect(r.kgLimon).toBe(3.5);
    expect(r.litrosSalsa).toBe(4.5);
    expect(r.taqueros).toBe(1);
    expect(r.horasServicio).toBe(2); // 300 / 220 = 1.36 h → 1.5 h, pero el mínimo es 2 h
    expect(r.total).toBe(6000);
    expect(r.anticipo).toBe(3000);
    expect(r.resto).toBe(3000);
  });

  it("el apetito escala los tacos: ligero < normal < taquiza < cuñado", () => {
    const tacos = (["ligero", "normal", "taquiza", "cunado"] as const).map((apetito) => calcularTaquiza({ ...base, apetito }).tacos);
    expect(tacos).toEqual([200, 300, 400, 550]);
  });

  it("reparte el sobrante entre los primeros guisados y no pierde tacos", () => {
    const tres = ["pastor", "suadero", "longaniza"] as EntradaTaquiza["guisados"];
    expect(calcularTaquiza({ ...base, personas: 17, guisados: tres }).porGuisado.map((g) => g.tacos)).toEqual([34, 34, 34]);
    expect(calcularTaquiza({ ...base, personas: 20, apetito: "ligero", guisados: tres }).porGuisado.map((g) => g.tacos)).toEqual([
      27, 27, 26,
    ]);
    const r = calcularTaquiza({ ...base, personas: 16, guisados: tres });
    expect(r.porGuisado.reduce((s, g) => s + g.tacos, 0)).toBe(r.tacos);
  });

  it("sin guisados elegidos cotiza pastor", () => {
    expect(calcularTaquiza({ ...base, guisados: [] }).porGuisado.map((g) => g.id)).toEqual(["pastor"]);
  });

  it("agrega los extras al desglose y al total", () => {
    const r = calcularTaquiza({ ...base, extras: { aguas: true, cebollitas: true, mesas: true, taquero: true } });
    expect(r.desglose.map((d) => d.concepto)).toEqual([
      "300 tacos",
      "Aguas frescas (50 personas)",
      "Cebollitas y chiles toreados",
      "5 mesas con sillas",
      "1 taquero con trompo en sitio",
    ]);
    expect(r.total).toBe(6000 + 50 * 30 + 50 * 12 + 5 * 140 + 950);
    expect(r.anticipo + r.resto).toBe(r.total);
  });

  it("más gente = más taqueros, y el servicio no baja del mínimo", () => {
    const r = calcularTaquiza({ ...base, personas: 200, apetito: "cunado", extras: { ...sinExtras, taquero: true } });
    expect(r.tacos).toBe(2200);
    expect(r.taqueros).toBe(4);
    expect(r.horasServicio).toBe(2.5); // 2200 / (4 × 220) = 2.5 h
    expect(r.desglose.at(-1)).toEqual({ concepto: "4 taqueros con trompo en sitio", importe: 4 * 950 });
    expect(calcularTaquiza({ ...base, personas: 15 }).horasServicio).toBe(SUPUESTOS.horasMinimas);
  });

  it("se cotiza en decenas cerradas y el anticipo es la mitad", () => {
    const r = calcularTaquiza({ ...base, personas: 23, apetito: "ligero", guisados: ["tripa"] }); // 92 × $24 = $2,208
    expect(r.total).toBe(2210);
    expect(r.anticipo).toBe(1110);
    expect(r.resto).toBe(1100);
  });
});
