"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialogo } from "@/components/ui/Dialogo";
import { site } from "@/config/site";
import { pesos } from "@/lib/dinero";
import { estadoTurno, formatoHora, horasDeRecogida, partesEnZona } from "@/lib/horario";
import { catalogo } from "@/lib/pedido";
import { useAhora } from "@/lib/useAhora";
import { mensajePedido } from "@/lib/whatsapp";
import { useEnvioWhatsApp } from "./EnvioWhatsApp";
import { usePedido } from "./PedidoProvider";

const esquema = z.object({
  nombre: z.string().trim().min(2, "Pon tu nombre para gritarlo cuando esté listo.").max(40, "Con 40 letras alcanza."),
  hora: z.string(),
  notas: z.string().max(200, "Máximo 200 caracteres. Lo demás, en la barra.").optional(),
});
type Formulario = z.infer<typeof esquema>;

const SUGERIDOS = ["orden-pastor", "gringa-pastor", "taco-suadero", "agua-horchata"];

export function Comanda() {
  const { estado, despachar, totales, comandaAbierta, abrirComanda, cerrarComanda, anunciar } = usePedido();
  const { enviar, vistaPrevia } = useEnvioWhatsApp();
  const tituloId = useId();
  const ahora = useAhora(60_000);

  const { register, handleSubmit, formState } = useForm<Formulario>({
    resolver: zodResolver(esquema),
    defaultValues: { nombre: "", hora: "", notas: "" },
  });

  const { horas, abierto } = useMemo(() => {
    if (!ahora) return { horas: [] as string[], abierto: true };
    const { dia, minutos } = partesEnZona(ahora, site.zonaHoraria);
    return { horas: horasDeRecogida(dia, minutos, site.horario), abierto: estadoTurno(dia, minutos, site.horario).abierto };
  }, [ahora]);

  const hayAlgo = totales.piezas > 0;

  const alEnviar = (datos: Formulario) => {
    enviar(mensajePedido(site.nombre, { ...datos, tipo: estado.tipo }, totales.detalle, totales.total));
  };

  const resumen = `${totales.piezas} ${totales.piezas === 1 ? "pieza" : "piezas"} · ${pesos(totales.total)}`;

  return (
    <>
      {/* ---------- Barra fija en móvil: Llamar / Pedir ---------- */}
      <nav aria-label="Acciones rápidas" className="fixed inset-x-0 bottom-0 z-40 flex h-[4.5rem] border-t-[3px] border-humo bg-humo pb-[env(safe-area-inset-bottom)] lg:hidden">
        <a
          href={site.telefono.href}
          className="flex w-[38%] flex-col items-center justify-center bg-tortilla font-bold text-humo"
        >
          <span className="font-cartel text-lg uppercase leading-none">Llamar</span>
          <span className="text-xs">{site.telefono.mostrar}</span>
        </a>
        {hayAlgo ? (
          <button type="button" onClick={abrirComanda} className="flex flex-1 items-center justify-between gap-2 bg-limon px-4 text-left text-humo">
            <span>
              <span className="block font-cartel text-lg uppercase leading-none">Tu comanda</span>
              <span className="text-sm font-bold">{resumen}</span>
            </span>
            <span aria-hidden="true" className="font-cartel text-2xl">→</span>
          </button>
        ) : (
          <Link href="/#pizarron" className="flex flex-1 items-center justify-between gap-2 bg-limon px-4 text-humo">
            <span>
              <span className="block font-cartel text-lg uppercase leading-none">Pedir</span>
              <span className="text-sm font-bold">para llevar o comer aquí</span>
            </span>
            <span aria-hidden="true" className="font-cartel text-2xl">↓</span>
          </Link>
        )}
      </nav>

      {/* ---------- Comanda flotante en escritorio: sube cuando hay algo ---------- */}
      <div
        className={`fixed bottom-6 right-6 z-40 hidden transition-[translate,visibility] duration-300 ease-out lg:block ${hayAlgo ? "visible translate-y-0" : "pointer-events-none invisible translate-y-[calc(100%+2rem)]"}`}
        aria-hidden={!hayAlgo}
      >
        <button
          type="button"
          onClick={abrirComanda}
          tabIndex={hayAlgo ? 0 : -1}
          className="ticket flex min-w-[19rem] items-center gap-5 bg-limon px-6 py-6 text-left text-humo"
        >
          <span className="flex-1">
            <span className="block font-cartel text-2xl uppercase leading-none">Tu comanda</span>
            <span className="mt-1 block font-bold">{resumen}</span>
          </span>
          <span className="border-[3px] border-humo bg-humo px-3 py-2 font-bold text-limon">Ver y enviar</span>
        </button>
      </div>

      {/* ---------- Resumen y envío ---------- */}
      <Dialogo
        abierto={comandaAbierta}
        alCerrar={cerrarComanda}
        tituloId={tituloId}
        className="inset-x-0 bottom-0 top-auto h-[92dvh] w-full lg:inset-y-0 lg:left-auto lg:right-0 lg:h-dvh lg:w-[30rem]"
      >
        <div className="flex h-full flex-col border-[3px] border-b-0 border-humo bg-tortilla text-humo lg:border-y-0 lg:border-r-0">
          <header className="flex items-center justify-between gap-3 bg-humo px-5 py-4 text-tortilla">
            <h2 id={tituloId} className="font-cartel text-[clamp(2rem,6vw,2.75rem)] uppercase leading-none">
              Comanda
            </h2>
            <button type="button" onClick={cerrarComanda} className="min-h-11 border-[3px] border-tortilla px-4 font-bold">
              Cerrar
            </button>
          </header>

          <form onSubmit={handleSubmit(alEnviar)} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-5">
              {!hayAlgo ? (
                <div>
                  <p className="font-cartel text-letrero uppercase">Todavía no pides nada.</p>
                  <p className="mt-2 text-sm">Lo que más sale a esta hora, para no pensarle:</p>
                  <ul className="mt-4 divide-y-2 divide-dashed divide-humo/40 border-y-[3px] border-humo">
                    {SUGERIDOS.map((id) => {
                      const a = catalogo.get(id)!;
                      return (
                        <li key={id} className="flex items-center gap-3 py-2">
                          <span className="flex-1 font-bold">{a.nombre}</span>
                          <span>{pesos(a.precio)}</span>
                          <button
                            type="button"
                            onClick={() => {
                              despachar({ tipo: "agregar", id });
                              anunciar(`${a.nombre} agregado a la comanda`);
                            }}
                            className="grid size-11 place-items-center border-[3px] border-humo bg-limon font-cartel text-xl"
                            aria-label={`Agregar ${a.nombre}`}
                          >
                            +
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <Link href="/#pizarron" onClick={cerrarComanda} className="mt-4 inline-block min-h-11 py-2 font-bold underline decoration-[3px] underline-offset-4">
                    Ver todo el pizarrón
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="border-t-[3px] border-humo" aria-label="Platillos en la comanda">
                    {totales.detalle.map((d) => (
                      <li key={d.clave} className="flex items-center gap-3 border-b-2 border-dashed border-humo/40 py-2.5">
                        <span className="min-w-0 flex-1">
                          <span className="block font-bold leading-tight">{d.nombre}</span>
                          <span className="text-xs">{pesos(d.unitario)} c/u</span>
                        </span>
                        <span className="flex items-center">
                          <button
                            type="button"
                            onClick={() => despachar({ tipo: "quitar", clave: d.clave })}
                            className="grid size-11 place-items-center border-[3px] border-humo font-cartel text-xl"
                            aria-label={`Quitar uno: ${d.nombre}`}
                          >
                            −
                          </button>
                          <span className="w-9 text-center font-cartel text-lg" aria-label={`${d.cantidad} en la comanda`}>
                            {d.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() => despachar({ tipo: "agregar", id: d.id, conQueso: d.conQueso })}
                            className="grid size-11 place-items-center border-[3px] border-humo bg-limon font-cartel text-xl"
                            aria-label={`Agregar otro: ${d.nombre}`}
                          >
                            +
                          </button>
                        </span>
                        <span className="w-16 text-right font-bold">{pesos(d.subtotal)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        despachar({ tipo: "vaciar" });
                        anunciar("Comanda vacía");
                      }}
                      className="min-h-11 text-sm font-bold underline underline-offset-4"
                    >
                      Vaciar comanda
                    </button>
                    <p className="text-right">
                      <span className="mr-2 text-sm">Total</span>
                      <span className="font-cartel text-rotulo leading-none">{pesos(totales.total)}</span>
                    </p>
                  </div>

                  <fieldset className="mt-6">
                    <legend className="font-cartel text-lg uppercase">¿Cómo lo quieres?</legend>
                    <div className="mt-2 grid grid-cols-2 border-[3px] border-humo">
                      {(
                        [
                          ["llevar", "Para llevar"],
                          ["aqui", "Comer aquí"],
                        ] as const
                      ).map(([valor, texto]) => (
                        <label
                          key={valor}
                          className="flex min-h-12 items-center justify-center gap-2 font-bold has-checked:bg-humo has-checked:text-limon has-focus-visible:outline-3 has-focus-visible:outline-limon [&:first-child]:border-r-[3px] [&:first-child]:border-humo"
                        >
                          <input
                            type="radio"
                            name="tipo"
                            value={valor}
                            checked={estado.tipo === valor}
                            onChange={() => despachar({ tipo: "tipo", valor })}
                            className="texto-pantalla"
                          />
                          {texto}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mt-5 grid gap-4">
                    <Campo etiqueta="Nombre" error={formState.errors.nombre?.message} htmlFor="comanda-nombre">
                      <input
                        id="comanda-nombre"
                        autoComplete="given-name"
                        {...register("nombre")}
                        aria-invalid={Boolean(formState.errors.nombre)}
                        aria-describedby={formState.errors.nombre ? "comanda-nombre-error" : undefined}
                        className="min-h-12 w-full border-[3px] border-humo bg-papel px-3"
                      />
                    </Campo>
                    <Campo etiqueta={estado.tipo === "llevar" ? "¿A qué hora pasas?" : "¿A qué hora llegas?"} htmlFor="comanda-hora">
                      <select id="comanda-hora" {...register("hora")} className="min-h-12 w-full border-[3px] border-humo bg-papel px-3">
                        <option value="">{abierto ? "Lo antes posible (≈ 15 min)" : "En cuanto abran"}</option>
                        {horas.map((h) => (
                          <option key={h} value={h}>
                            {formatoHora(h)}
                          </option>
                        ))}
                      </select>
                    </Campo>
                    <Campo etiqueta="Notas (sin cebolla, salsa aparte…)" error={formState.errors.notas?.message} htmlFor="comanda-notas">
                      <textarea
                        id="comanda-notas"
                        rows={2}
                        {...register("notas")}
                        aria-invalid={Boolean(formState.errors.notas)}
                        aria-describedby={formState.errors.notas ? "comanda-notas-error" : undefined}
                        className="w-full border-[3px] border-humo bg-papel px-3 py-2"
                      />
                    </Campo>
                  </div>
                </>
              )}
            </div>

            {hayAlgo && (
              <div className="border-t-[3px] border-humo bg-tortilla px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                <button
                  type="submit"
                  className="flex min-h-14 w-full items-center justify-between gap-3 border-[3px] border-humo bg-verde px-4 text-left font-cartel text-lg uppercase leading-tight text-tortilla shadow-tinta active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  <span>Enviar pedido por WhatsApp</span>
                  <span>{pesos(totales.total)}</span>
                </button>
                <p className="mt-2 text-xs">Precios ilustrativos. Pagas al recoger, en efectivo, tarjeta o transferencia.</p>
              </div>
            )}
          </form>
        </div>
      </Dialogo>
      {vistaPrevia}
    </>
  );
}

function Campo({ etiqueta, error, htmlFor, children }: { etiqueta: string; error?: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-bold">
        {etiqueta}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1 text-sm font-bold text-roja">
          {error}
        </p>
      )}
    </div>
  );
}
