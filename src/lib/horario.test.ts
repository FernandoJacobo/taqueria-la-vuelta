import { describe, expect, it } from "vitest";
import type { Turno } from "@/config/site";
import { estadoTurno, formatoDuracion, formatoHora, horasDeRecogida, partesEnZona, turnoVigente } from "./horario";

// Dom 17–02, Lun 18–01, Mar–Jue 18–03, Vie–Sáb 18–04
const horario: Turno[] = [
  { abre: "17:00", cierra: "02:00" },
  { abre: "18:00", cierra: "01:00" },
  { abre: "18:00", cierra: "03:00" },
  { abre: "18:00", cierra: "03:00" },
  { abre: "18:00", cierra: "03:00" },
  { abre: "18:00", cierra: "04:00" },
  { abre: "18:00", cierra: "04:00" },
];
const h = (hh: number, mm = 0) => hh * 60 + mm;

describe("formatos", () => {
  it("formatea horas en 12 h estilo es-MX", () => {
    expect(formatoHora("18:00")).toBe("6:00 p. m.");
    expect(formatoHora("03:00")).toBe("3:00 a. m.");
    expect(formatoHora("00:30")).toBe("12:30 a. m.");
    expect(formatoHora("12:05")).toBe("12:05 p. m.");
  });
  it("formatea duraciones", () => {
    expect(formatoDuracion(134)).toBe("2 h 14 min");
    expect(formatoDuracion(45)).toBe("45 min");
    expect(formatoDuracion(120)).toBe("2 h");
    expect(formatoDuracion(-3)).toBe("0 min");
  });
});

describe("estadoTurno", () => {
  it("está cerrado en la tarde antes de abrir y cuenta el tiempo", () => {
    const e = estadoTurno(3, h(15, 46), horario); // miércoles 3:46 p. m.
    expect(e).toMatchObject({ abierto: false, abreEn: 134, proximo: { dia: 3, abre: "18:00" } });
  });
  it("está abierto en la noche y cierra a la hora del turno", () => {
    expect(estadoTurno(3, h(22), horario)).toMatchObject({ abierto: true, cierraEn: h(5) });
  });
  it("sigue abierto de madrugada con el turno del día anterior", () => {
    // sábado 1:30 a. m. → turno del viernes (cierra 4:00)
    expect(estadoTurno(6, h(1, 30), horario)).toMatchObject({ abierto: true, cierraEn: 150, turno: { cierra: "04:00" } });
    expect(turnoVigente(6, h(1, 30), horario)).toEqual({ abre: "18:00", cierra: "04:00" });
  });
  it("cierra justo a la hora de cierre", () => {
    expect(estadoTurno(2, h(1), horario).abierto).toBe(false); // martes 1:00; el lunes cerró a la 1
    expect(estadoTurno(2, h(0, 59), horario).abierto).toBe(true);
  });
  it("abre justo a la hora de apertura", () => {
    expect(estadoTurno(0, h(17), horario).abierto).toBe(true);
    expect(estadoTurno(0, h(16, 59), horario)).toMatchObject({ abierto: false, abreEn: 1 });
  });
  it("salta días cerrados", () => {
    const conDescanso: Turno[] = [...horario];
    conDescanso[1] = null; // lunes cerrado
    // lunes 3:00 a. m. (el domingo cerró a las 2) → abre el martes a las 18:00
    expect(estadoTurno(1, h(3), conDescanso)).toMatchObject({ abierto: false, abreEn: h(21) + h(18), proximo: { dia: 2 } });
  });
  it("soporta turnos que no cruzan la medianoche", () => {
    const diurno: Turno[] = Array(7).fill({ abre: "09:00", cierra: "17:00" });
    expect(estadoTurno(1, h(16, 30), diurno)).toMatchObject({ abierto: true, cierraEn: 30 });
    expect(estadoTurno(1, h(17, 30), diurno)).toMatchObject({ abierto: false, abreEn: h(15, 30) });
  });
});

describe("partesEnZona", () => {
  it("convierte a la hora de Guadalajara (UTC-6, sin horario de verano)", () => {
    // 2026-10-23 04:15 UTC = jueves 22 de octubre, 22:15 en Guadalajara
    expect(partesEnZona(new Date("2026-10-23T04:15:00Z"), "America/Mexico_City")).toEqual({ dia: 4, minutos: h(22, 15) });
  });
});

describe("horasDeRecogida", () => {
  it("ofrece horas cada 15 min desde ahora + margen hasta 15 min antes del cierre", () => {
    expect(horasDeRecogida(1, h(23, 50), horario)).toEqual(["00:15", "00:30", "00:45"]); // lunes, cierra a la 1
  });
  it("si está cerrado, ofrece horas del siguiente turno", () => {
    const horas = horasDeRecogida(3, h(12), horario);
    expect(horas[0]).toBe("18:30");
    expect(horas.at(-1)).toBe("02:45");
  });
});
