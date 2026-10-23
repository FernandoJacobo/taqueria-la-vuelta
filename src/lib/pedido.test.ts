import { describe, expect, it } from "vitest";
import {
  cantidadDe,
  claveLinea,
  PEDIDO_VACIO,
  reducirPedido,
  sanearPedido,
  totalesPedido,
  type AccionPedido,
  type EstadoPedido,
} from "./pedido";

const aplicar = (acciones: AccionPedido[], inicio: EstadoPedido = PEDIDO_VACIO) =>
  acciones.reduce((e, a) => reducirPedido(e, a), inicio);

describe("reducirPedido", () => {
  it("agrega y acumula cantidades", () => {
    const e = aplicar([
      { tipo: "agregar", id: "taco-pastor" },
      { tipo: "agregar", id: "taco-pastor" },
      { tipo: "agregar", id: "gringa-pastor" },
    ]);
    expect(e.lineas).toEqual([
      { clave: "taco-pastor", id: "taco-pastor", conQueso: false, cantidad: 2 },
      { clave: "gringa-pastor", id: "gringa-pastor", conQueso: false, cantidad: 1 },
    ]);
  });
  it("separa la variante con queso e ignora el queso donde no aplica", () => {
    const e = aplicar([
      { tipo: "agregar", id: "taco-pastor", conQueso: true },
      { tipo: "agregar", id: "taco-pastor" },
      { tipo: "agregar", id: "agua-jamaica", conQueso: true },
    ]);
    expect(e.lineas.map((l) => l.clave)).toEqual(["taco-pastor|queso", "taco-pastor", "agua-jamaica"]);
    expect(cantidadDe(e.lineas, "taco-pastor")).toBe(2);
  });
  it("ignora artículos que no existen", () => {
    expect(aplicar([{ tipo: "agregar", id: "taco-de-unicornio" }])).toBe(PEDIDO_VACIO);
  });
  it("quita de uno en uno y elimina la línea al llegar a cero", () => {
    const e = aplicar([
      { tipo: "agregar", id: "taco-suadero" },
      { tipo: "agregar", id: "taco-suadero" },
      { tipo: "quitar", clave: "taco-suadero" },
    ]);
    expect(e.lineas[0].cantidad).toBe(1);
    expect(reducirPedido(e, { tipo: "quitar", clave: "taco-suadero" }).lineas).toEqual([]);
  });
  it("elimina, vacía y cambia el tipo", () => {
    let e = aplicar([
      { tipo: "agregar", id: "taco-suadero" },
      { tipo: "agregar", id: "cebollitas" },
    ]);
    e = reducirPedido(e, { tipo: "eliminar", clave: "cebollitas" });
    expect(e.lineas).toHaveLength(1);
    e = reducirPedido(e, { tipo: "tipo", valor: "aqui" });
    expect(e.tipo).toBe("aqui");
    expect(reducirPedido(e, { tipo: "vaciar" })).toEqual({ lineas: [], tipo: "aqui" });
  });
  it("agrega salsas extra del salsero", () => {
    const e = aplicar([{ tipo: "agregar", id: "salsa-habanero" }]);
    expect(totalesPedido(e.lineas).detalle[0]).toMatchObject({ nombre: "Salsa habanero tatemado extra (120 ml)", subtotal: 12 });
  });
});

describe("totalesPedido", () => {
  it("suma piezas y total con el queso incluido", () => {
    const e = aplicar([
      { tipo: "agregar", id: "taco-pastor" }, // 24
      { tipo: "agregar", id: "taco-pastor" }, // 24
      { tipo: "agregar", id: "taco-pastor", conQueso: true }, // 32
      { tipo: "agregar", id: "orden-pastor" }, // 115
      { tipo: "agregar", id: "agua-horchata" }, // 35
    ]);
    const t = totalesPedido(e.lineas);
    expect(t.piezas).toBe(5);
    expect(t.total).toBe(24 * 2 + 32 + 115 + 35);
    expect(t.detalle.find((d) => d.clave === claveLinea("taco-pastor", true))).toMatchObject({
      nombre: "Taco de pastor con queso",
      unitario: 32,
    });
  });
  it("una comanda vacía suma cero", () => {
    expect(totalesPedido([])).toEqual({ detalle: [], piezas: 0, total: 0 });
  });
});

describe("sanearPedido (lo que viene de localStorage)", () => {
  it("descarta basura y respeta lo válido", () => {
    const crudo = {
      tipo: "aqui",
      lineas: [
        { id: "taco-pastor", conQueso: true, cantidad: 3 },
        { id: "no-existe", cantidad: 2 },
        { id: "taco-tripa", conQueso: true, cantidad: 1 }, // la tripa no admite queso
        { id: "taco-suadero", cantidad: -1 },
        { id: "taco-bistec", cantidad: 1.5 },
        { id: "agua-dia", cantidad: 999 },
        "texto",
      ],
    };
    expect(sanearPedido(crudo)).toEqual({
      tipo: "aqui",
      lineas: [
        { clave: "taco-pastor|queso", id: "taco-pastor", conQueso: true, cantidad: 3 },
        { clave: "taco-tripa", id: "taco-tripa", conQueso: false, cantidad: 1 },
        { clave: "agua-dia", id: "agua-dia", conQueso: false, cantidad: 50 },
      ],
    });
  });
  it("devuelve un pedido vacío con entradas inválidas", () => {
    expect(sanearPedido(null)).toEqual(PEDIDO_VACIO);
    expect(sanearPedido("hola")).toEqual(PEDIDO_VACIO);
    expect(sanearPedido({ lineas: "x" })).toEqual(PEDIDO_VACIO);
  });
});
