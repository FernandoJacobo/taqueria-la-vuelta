import type { Turno } from "@/config/site";

/** Minutos desde la medianoche para "HH:MM". */
export function aMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** "18:00" → "6:00 p. m."; "00:30" → "12:30 a. m." (estilo es-MX). */
export function formatoHora(hhmm: string): string {
  const total = aMinutos(hhmm) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const sufijo = h < 12 ? "a. m." : "p. m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

/** 134 → "2 h 14 min"; 45 → "45 min"; 120 → "2 h". */
export function formatoDuracion(minutos: number): string {
  const total = Math.max(0, Math.round(minutos));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

const DIAS_SEMANA: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Día de la semana (0 = domingo) y minutos del día de `fecha` en la zona horaria dada. */
export function partesEnZona(fecha: Date, zonaHoraria: string): { dia: number; minutos: number } {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: zonaHoraria,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(fecha);
  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "0";
  return { dia: DIAS_SEMANA[valor("weekday")] ?? 0, minutos: (Number(valor("hour")) % 24) * 60 + Number(valor("minute")) };
}

export type EstadoTurno =
  | { abierto: true; cierraEn: number; turno: { abre: string; cierra: string } }
  | { abierto: false; abreEn: number; proximo: { dia: number; abre: string } };

const DIA = 24 * 60;

function cruzaMedianoche(t: { abre: string; cierra: string }) {
  return aMinutos(t.cierra) <= aMinutos(t.abre);
}

/**
 * Estado del turno para un día (0–6) y minuto del día. Soporta turnos que cruzan la medianoche:
 * a las 01:30 del sábado sigue abierto el turno del viernes.
 */
export function estadoTurno(dia: number, minutos: number, horario: readonly Turno[]): EstadoTurno {
  const ayer = horario[(dia + 6) % 7];
  if (ayer && cruzaMedianoche(ayer) && minutos < aMinutos(ayer.cierra)) {
    return { abierto: true, cierraEn: aMinutos(ayer.cierra) - minutos, turno: ayer };
  }

  const hoy = horario[dia];
  if (hoy) {
    const abre = aMinutos(hoy.abre);
    const cierra = aMinutos(hoy.cierra);
    if (minutos >= abre && (cruzaMedianoche(hoy) || minutos < cierra)) {
      const cierraEn = cruzaMedianoche(hoy) ? DIA - minutos + cierra : cierra - minutos;
      return { abierto: true, cierraEn, turno: hoy };
    }
    if (minutos < abre) {
      return { abierto: false, abreEn: abre - minutos, proximo: { dia, abre: hoy.abre } };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    const t = horario[d];
    if (t) {
      return { abierto: false, abreEn: DIA - minutos + (i - 1) * DIA + aMinutos(t.abre), proximo: { dia: d, abre: t.abre } };
    }
  }
  return { abierto: false, abreEn: Infinity, proximo: { dia, abre: "00:00" } };
}

/** El turno que "corresponde" a este momento: si es de madrugada y sigue el de ayer, ese; si no, el de hoy. */
export function turnoVigente(dia: number, minutos: number, horario: readonly Turno[]): Turno {
  const ayer = horario[(dia + 6) % 7];
  if (ayer && cruzaMedianoche(ayer) && minutos < aMinutos(ayer.cierra)) return ayer;
  return horario[dia];
}

/**
 * Horas de recogida cada 15 min, desde `minutos + margen` hasta 15 min antes del cierre del turno abierto
 * (o del siguiente turno si ahora está cerrado). Devuelve "HH:MM".
 */
export function horasDeRecogida(dia: number, minutos: number, horario: readonly Turno[], margen = 20): string[] {
  const estado = estadoTurno(dia, minutos, horario);
  let inicio: number;
  let fin: number;
  if (estado.abierto) {
    inicio = minutos + margen;
    fin = minutos + estado.cierraEn - 15;
  } else {
    if (!Number.isFinite(estado.abreEn)) return [];
    const t = horario[estado.proximo.dia]!;
    const duracion = (aMinutos(t.cierra) - aMinutos(t.abre) + DIA) % DIA || DIA;
    inicio = minutos + estado.abreEn + margen;
    fin = minutos + estado.abreEn + duracion - 15;
  }
  const primero = Math.ceil(inicio / 15) * 15;
  const horas: string[] = [];
  for (let m = primero; m <= fin; m += 15) {
    const delDia = ((m % DIA) + DIA) % DIA;
    horas.push(`${String(Math.floor(delDia / 60)).padStart(2, "0")}:${String(delDia % 60).padStart(2, "0")}`);
  }
  return horas;
}

export const NOMBRES_DIA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
