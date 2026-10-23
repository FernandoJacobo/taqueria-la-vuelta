"use client";

import { Icono } from "@/components/ilustraciones/Sprite";
import { site } from "@/config/site";
import { estadoTurno, formatoDuracion, formatoHora, NOMBRES_DIA, partesEnZona, turnoVigente } from "@/lib/horario";
import { useAhora } from "@/lib/useAhora";

/** A — Tira de boleto: horario de hoy a la izquierda, estado en vivo a la derecha. */
export function BarraTurno() {
  const ahora = useAhora(30_000);

  let horarioTexto = "Turno de noche · todos los días";
  let estadoTexto = "El trompo prende a las 4 p. m.";
  let abierto: boolean | null = null;

  if (ahora) {
    const { dia, minutos } = partesEnZona(ahora, site.zonaHoraria);
    const estado = estadoTurno(dia, minutos, site.horario);
    const turno = estado.abierto ? turnoVigente(dia, minutos, site.horario) : site.horario[estado.proximo.dia];
    abierto = estado.abierto;
    if (turno) {
      const cuando = estado.abierto || estado.proximo.dia === dia ? "hoy" : NOMBRES_DIA[estado.proximo.dia].toLowerCase();
      horarioTexto = `${estado.abierto ? "Abierto" : "Abrimos"} ${cuando} ${formatoHora(turno.abre)} – ${formatoHora(turno.cierra)}`;
    }
    estadoTexto = estado.abierto
      ? estado.cierraEn <= 60
        ? `Últimos ${formatoDuracion(estado.cierraEn)} · se apaga la plancha`
        : "Abierto · trompo girando"
      : `Abrimos en ${formatoDuracion(estado.abreEn)}`;
  }

  return (
    <div className="grano grano-claro relative z-20 bg-humo text-tortilla">
      <div className="mx-auto flex max-w-[96rem] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 text-sm sm:px-6">
        <p className="flex items-center gap-2 font-bold">
          <Icono id="i-trompo-mini" className="h-6 w-4 text-tortilla" />
          <span>{horarioTexto}</span>
          <span className="hidden text-tortilla/80 md:inline">· {site.direccion.calle}, {site.direccion.colonia}</span>
        </p>
        <p role="status" aria-live="polite" className="flex items-center gap-3">
          <span
            className={`etiqueta-muesca py-0.5 text-xs font-bold uppercase tracking-[0.06em] text-humo ${abierto === false ? "bg-habanero" : "bg-limon"}`}
          >
            {estadoTexto}
          </span>
          <a href={site.telefono.href} className="hidden font-bold underline decoration-2 underline-offset-4 sm:inline">
            {site.telefono.mostrar}
          </a>
        </p>
      </div>
    </div>
  );
}
