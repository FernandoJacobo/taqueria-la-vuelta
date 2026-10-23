import { describe, expect, it } from "vitest";
import { WHATSAPP_PLACEHOLDER } from "@/config/site";
import { PEDIDO_VACIO, reducirPedido, totalesPedido } from "./pedido";
import { calcularTaquiza } from "./taquiza";
import { esModoDemo, mensajePedido, mensajeTaquiza, soloDigitos, urlWhatsApp } from "./whatsapp";

describe("modo demo de WhatsApp", () => {
  it("el placeholder y los números vacíos o en ceros activan el modo demo", () => {
    expect(esModoDemo(WHATSAPP_PLACEHOLDER)).toBe(true);
    expect(esModoDemo("")).toBe(true);
    expect(esModoDemo(undefined)).toBe(true);
    expect(esModoDemo("+52 00 0000 0000")).toBe(true);
    expect(esModoDemo("12345")).toBe(true);
  });
  it("un número con forma válida abre wa.me", () => {
    expect(esModoDemo("5213312345678")).toBe(false);
    expect(esModoDemo("+52 33 1234 5678")).toBe(false);
  });
  it("arma la URL de wa.me con el texto codificado", () => {
    expect(soloDigitos("+52 (33) 1234-5678")).toBe("523312345678");
    expect(urlWhatsApp("+52 33 1234 5678", "Hola, 2 x pastor & 1 agua")).toBe(
      "https://wa.me/523312345678?text=Hola%2C%202%20x%20pastor%20%26%201%20agua",
    );
  });
});

describe("mensajePedido", () => {
  it("formatea renglones, total, tipo, hora, nombre y notas", () => {
    let e = PEDIDO_VACIO;
    e = reducirPedido(e, { tipo: "agregar", id: "taco-pastor" });
    e = reducirPedido(e, { tipo: "agregar", id: "taco-pastor" });
    e = reducirPedido(e, { tipo: "agregar", id: "gringa-pastor" });
    const { detalle, total } = totalesPedido(e.lineas);
    const m = mensajePedido("La Vuelta", { nombre: "  Ana ", tipo: "llevar", hora: "21:30", notas: "sin cebolla" }, detalle, total);
    expect(m).toBe(
      [
        "Hola, La Vuelta. Va mi pedido:",
        "",
        "2 x Taco de pastor — $48",
        "1 x Gringa de pastor — $62",
        "",
        "Total: $110 MXN",
        "Tipo: Para llevar",
        "Paso por él: 9:30 p. m.",
        "Nombre: Ana",
        "Notas: sin cebolla",
      ].join("\n"),
    );
  });
  it("sin hora dice lo antes posible y omite notas vacías", () => {
    const m = mensajePedido("La Vuelta", { nombre: "Beto", tipo: "aqui", hora: "", notas: "   " }, [], 0);
    expect(m).toContain("Llego: lo antes posible");
    expect(m).toContain("Tipo: Para comer aquí");
    expect(m).not.toContain("Notas");
  });
});

describe("mensajeTaquiza", () => {
  it("incluye personas, tacos, desglose, total y anticipo", () => {
    const r = calcularTaquiza({
      personas: 30,
      apetito: "normal",
      guisados: ["pastor"],
      extras: { aguas: false, cebollitas: false, mesas: false, taquero: false },
    });
    const m = mensajeTaquiza("La Vuelta", { nombre: "Lupita", fecha: "2026-11-14", apetito: "Normal" }, r);
    expect(m).toContain("Personas: 30 (apetito: Normal)");
    expect(m).toContain("Tacos estimados: 180");
    expect(m).toContain("- Pastor: 180 tacos (6.5 kg)");
    expect(m).toContain("Total estimado: $3,420 MXN");
    expect(m).toContain("Anticipo (50 %): $1,710");
    expect(m).toContain("Fecha del evento: 2026-11-14");
  });
});
