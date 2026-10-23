"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Icono } from "@/components/ilustraciones/Sprite";
import { useEnvioWhatsApp } from "@/components/pedido/EnvioWhatsApp";
import { BordeTinta, NotaMarcador } from "@/components/ui/Piezas";
import { Sobreimpreso } from "@/components/ui/Sobreimpreso";
import { site } from "@/config/site";
import { pesos } from "@/lib/dinero";
import { APETITOS, calcularTaquiza, GUISADOS_TAQUIZA, SUPUESTOS, type Apetito, type GuisadoId } from "@/lib/taquiza";
import { mensajeTaquiza } from "@/lib/whatsapp";

const IDS_GUISADOS = GUISADOS_TAQUIZA.map((g) => g.id) as [GuisadoId, ...GuisadoId[]];

const esquema = z.object({
  personas: z.number({ error: "Pon cuántas personas." }).int().min(SUPUESTOS.minimoPersonas, `Mínimo ${SUPUESTOS.minimoPersonas} personas.`).max(SUPUESTOS.maximoPersonas, `Para más de ${SUPUESTOS.maximoPersonas}, llámanos.`),
  apetito: z.enum(["ligero", "normal", "taquiza", "cunado"]),
  guisados: z.array(z.enum(IDS_GUISADOS)).min(1, "Elige al menos un guisado."),
  extras: z.object({ aguas: z.boolean(), cebollitas: z.boolean(), mesas: z.boolean(), taquero: z.boolean() }),
  nombre: z.string().trim().min(2, "¿A nombre de quién cotizamos?").max(40),
  fecha: z.string().optional(),
});
type Formulario = z.infer<typeof esquema>;

const EXTRAS: { id: keyof Formulario["extras"]; texto: string; nota: string }[] = [
  { id: "taquero", texto: "Taquero con trompo en sitio", nota: `${pesos(SUPUESTOS.precios.taqueroPorTurno)} por taquero, turno de 4 h` },
  { id: "aguas", texto: "Aguas frescas", nota: `${pesos(SUPUESTOS.precios.aguasPorPersona)} por persona` },
  { id: "cebollitas", texto: "Cebollitas y toreados", nota: `${pesos(SUPUESTOS.precios.cebollitasPorPersona)} por persona` },
  { id: "mesas", texto: "Mesas y sillas", nota: `${pesos(SUPUESTOS.precios.mesaConSillas)} por mesa de 10` },
];

const kg = (n: number) => `${n.toLocaleString("es-MX", { maximumFractionDigits: 1 })} kg`;
const horas = (n: number) => (n === 1 ? "1 hora" : `${n.toLocaleString("es-MX", { maximumFractionDigits: 1 })} horas`);

/** F — Libreta de comanda + ticket: calculadora de taquiza en vivo. */
export function Taquiza() {
  const { enviar, vistaPrevia } = useEnvioWhatsApp("Vista previa de la cotización");
  const { register, control, handleSubmit, setValue, formState } = useForm<Formulario>({
    resolver: zodResolver(esquema),
    defaultValues: {
      personas: 50,
      apetito: "normal",
      guisados: ["pastor", "suadero"],
      extras: { taquero: true, aguas: true, cebollitas: false, mesas: false },
      nombre: "",
      fecha: "",
    },
  });

  const valores = useWatch({ control });
  const personas = Number.isFinite(valores.personas) ? Number(valores.personas) : SUPUESTOS.minimoPersonas;
  const r = calcularTaquiza({
    personas,
    apetito: (valores.apetito ?? "normal") as Apetito,
    guisados: (valores.guisados ?? []) as GuisadoId[],
    extras: { aguas: false, cebollitas: false, mesas: false, taquero: false, ...valores.extras },
  });

  const ajustarPersonas = (delta: number) => {
    const actual = Number.isFinite(valores.personas) ? Number(valores.personas) : 0;
    const nuevo = Math.min(SUPUESTOS.maximoPersonas, Math.max(SUPUESTOS.minimoPersonas, actual + delta));
    setValue("personas", nuevo, { shouldValidate: true });
  };

  const alCotizar = (d: Formulario) => {
    enviar(mensajeTaquiza(site.nombre, { nombre: d.nombre, fecha: d.fecha || undefined, apetito: APETITOS[d.apetito].etiqueta }, r));
  };

  const e = formState.errors;

  return (
    <section id="taquiza" aria-labelledby="titulo-taquiza" className="grano relative bg-habanero text-humo">
      <BordeTinta semilla={45} className="text-habanero" />
      <div className="relative mx-auto max-w-[96rem] px-4 pb-20 pt-14 sm:px-6 lg:pt-20">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="titulo-taquiza" className="font-cartel text-lona uppercase lg:col-span-7">
            <Sobreimpreso capa="text-roja" x={4} y={3}>
              La taquiza
            </Sobreimpreso>
          </h2>
          <p className="self-end text-lg lg:col-span-5">
            ¿Bautizo, posada, cierre de obra? Dinos cuántos son y qué tanta hambre traen. Te sacamos tacos, kilos, tortillas y precio al momento.
          </p>
        </div>

        <form onSubmit={handleSubmit(alCotizar)} noValidate className="mt-12 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ---------- Libreta ---------- */}
          <div className="renglones border-[3px] border-humo bg-papel px-4 py-6 shadow-tinta-lg sm:px-7 lg:col-span-7">
            <fieldset>
              <legend className="font-cartel text-letrero uppercase">1. ¿Cuántos son?</legend>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => ajustarPersonas(-5)} className="grid size-12 place-items-center border-[3px] border-humo bg-tortilla font-cartel text-xl" >
                  <span className="texto-pantalla">Restar </span>
                  −5
                </button>
                <label className="flex items-baseline gap-2">
                  <span className="texto-pantalla">Número de personas</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={SUPUESTOS.minimoPersonas}
                    max={SUPUESTOS.maximoPersonas}
                    {...register("personas", { valueAsNumber: true })}
                    aria-invalid={Boolean(e.personas)}
                    aria-describedby={e.personas ? "error-personas" : undefined}
                    className="h-14 w-28 border-[3px] border-humo bg-papel text-center font-cartel text-3xl"
                  />
                  <span className="font-bold">personas</span>
                </label>
                <button type="button" onClick={() => ajustarPersonas(5)} className="grid size-12 place-items-center border-[3px] border-humo bg-limon font-cartel text-xl" >
                  <span className="texto-pantalla">Sumar </span>
                  +5
                </button>
              </div>
              {e.personas && (
                <p id="error-personas" className="mt-2 font-bold text-roja">
                  {e.personas.message}
                </p>
              )}
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-cartel text-letrero uppercase">2. ¿Qué tanta hambre?</legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(APETITOS) as Apetito[]).map((a) => (
                  <label
                    key={a}
                    className="relative flex min-h-20 flex-col justify-between border-[3px] border-humo bg-tortilla p-2.5 has-checked:bg-humo has-checked:text-limon has-focus-visible:outline-[3px] has-focus-visible:outline-offset-2 has-focus-visible:outline-humo"
                  >
                    <input type="radio" value={a} {...register("apetito")} className="texto-pantalla" />
                    <span className="font-cartel uppercase leading-tight">{APETITOS[a].etiqueta}</span>
                    <span className="text-xs">
                      {APETITOS[a].tacos} tacos c/u · {APETITOS[a].nota}
                    </span>
                  </label>
                ))}
              </div>
              <NotaMarcador className="mt-3 -rotate-2 text-roja sm:ml-[50%]">de cuñado = 11 tacos por cabeza</NotaMarcador>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-cartel text-letrero uppercase">3. Guisados</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {GUISADOS_TAQUIZA.map((g) => (
                  <label
                    key={g.id}
                    className="flex min-h-11 items-center gap-2 border-[3px] border-humo bg-tortilla px-3 font-bold has-checked:bg-roja has-checked:text-tortilla has-focus-visible:outline-[3px] has-focus-visible:outline-offset-2 has-focus-visible:outline-humo"
                  >
                    <input type="checkbox" value={g.id} {...register("guisados")} className="size-4 accent-humo" />
                    {g.nombre}
                    <span className="text-xs font-normal">{pesos(g.precio)}</span>
                  </label>
                ))}
              </div>
              {e.guisados && <p className="mt-2 font-bold text-roja">{e.guisados.message}</p>}
            </fieldset>

            <fieldset className="mt-8">
              <legend className="font-cartel text-letrero uppercase">4. Extras</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {EXTRAS.map((x) => (
                  <label key={x.id} className="flex min-h-11 items-start gap-3 py-1">
                    <input type="checkbox" {...register(`extras.${x.id}`)} className="mt-1 size-5 shrink-0 accent-humo" />
                    <span>
                      <span className="block font-bold leading-tight">{x.texto}</span>
                      <span className="text-xs">{x.nota}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-8 grid gap-4 sm:grid-cols-2">
              <legend className="font-cartel text-letrero uppercase">5. ¿Para quién y cuándo?</legend>
              <div className="mt-3">
                <label htmlFor="taquiza-nombre" className="mb-1 block text-sm font-bold">
                  Nombre
                </label>
                <input
                  id="taquiza-nombre"
                  autoComplete="name"
                  {...register("nombre")}
                  aria-invalid={Boolean(e.nombre)}
                  aria-describedby={e.nombre ? "error-taquiza-nombre" : undefined}
                  className="min-h-12 w-full border-[3px] border-humo bg-papel px-3"
                />
                {e.nombre && (
                  <p id="error-taquiza-nombre" className="mt-1 text-sm font-bold text-roja">
                    {e.nombre.message}
                  </p>
                )}
              </div>
              <div className="sm:mt-3">
                <label htmlFor="taquiza-fecha" className="mb-1 block text-sm font-bold">
                  Fecha del evento (opcional)
                </label>
                <input id="taquiza-fecha" type="date" {...register("fecha")} className="min-h-12 w-full border-[3px] border-humo bg-papel px-3" />
              </div>
            </fieldset>
          </div>

          {/* ---------- Ticket ---------- */}
          <div className="lg:sticky lg:top-6 lg:col-span-5">
            <div className="ticket rotate-[1.5deg] bg-papel px-5 py-8 sm:px-7" aria-live="polite">
              <p className="text-center text-xs font-bold uppercase tracking-[0.2em]">Estimado de taquiza · {site.nombre}</p>
              <p className="mt-4 text-center">
                <span className="block font-cartel text-[clamp(4rem,12vw,7rem)] leading-[0.85]">{r.tacos.toLocaleString("es-MX")}</span>
                <span className="font-cartel text-letrero uppercase">tacos para {r.personas} personas</span>
              </p>

              <ul className="mt-6 border-y-2 border-dashed border-humo py-3 text-sm">
                {r.porGuisado.map((g) => (
                  <li key={g.id} className="flex justify-between gap-3 py-0.5">
                    <span>
                      {g.nombre} · {g.tacos} tacos
                    </span>
                    <span className="font-bold">{kg(g.kg)}</span>
                  </li>
                ))}
              </ul>

              <dl className="mt-3 grid gap-y-2 text-sm">
                {[
                  { icono: "i-trompo-mini", clase: "h-6 w-5 text-humo", dt: "Carne en total", dd: kg(r.kgCarne) },
                  { icono: "i-tortilla", clase: "size-6", dt: `Tortilla (${r.tortillas.toLocaleString("es-MX")} pzas, doble)`, dd: kg(r.kgTortilla) },
                  { icono: "i-cebolla", clase: "size-6", dt: "Cebolla picada", dd: kg(r.kgCebolla) },
                  { icono: "i-cilantro", clase: "size-6", dt: "Cilantro", dd: `${r.manojosCilantro} manojos` },
                  { icono: "i-limon", clase: "size-6", dt: `Limones (${r.limones})`, dd: kg(r.kgLimon) },
                  { icono: "i-gota", clase: "size-6 text-roja", dt: "Salsas (tres tazones)", dd: `${r.litrosSalsa.toLocaleString("es-MX")} L` },
                  { icono: "i-reloj", clase: "size-6", dt: `Servicio (${r.taqueros} ${r.taqueros === 1 ? "taquero" : "taqueros"})`, dd: horas(r.horasServicio) },
                ].map((f) => (
                  <div key={f.icono} className="flex items-center gap-3">
                    <dt className="flex flex-1 items-center gap-3">
                      <Icono id={f.icono} className={`shrink-0 ${f.clase}`} />
                      {f.dt}
                    </dt>
                    <dd className="text-right font-bold">{f.dd}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-5 border-t-2 border-dashed border-humo pt-3 text-sm">
                {r.desglose.map((d) => (
                  <li key={d.concepto} className="flex justify-between gap-3 py-0.5">
                    <span>{d.concepto}</span>
                    <span>{pesos(d.importe)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-end justify-between border-t-[3px] border-humo pt-3">
                <span className="font-cartel uppercase">Total estimado</span>
                <span className="font-cartel text-rotulo leading-none">{pesos(r.total)}</span>
              </div>
              <p className="mt-2 flex justify-between text-sm">
                <span>Anticipo para apartar (50 %)</span>
                <span className="font-bold">{pesos(r.anticipo)}</span>
              </p>
              <p className="mt-4 text-xs">
                Es una estimación con precios ilustrativos; el precio final se confirma por mensaje. Traslado incluido dentro de la zona metropolitana.
              </p>
            </div>
            <button
              type="submit"
              className="mt-8 flex min-h-14 w-full items-center justify-center border-[3px] border-humo bg-humo px-5 font-cartel text-lg uppercase text-limon shadow-[6px_6px_0_var(--color-roja)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Cotizar mi taquiza
            </button>
          </div>
        </form>
      </div>
      {vistaPrevia}
    </section>
  );
}
