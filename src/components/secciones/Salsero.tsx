"use client";

import { useState } from "react";
import { Tazon } from "@/components/ilustraciones/Tazon";
import { usePedido } from "@/components/pedido/PedidoProvider";
import { BordeTinta, Chiles, NotaMarcador } from "@/components/ui/Piezas";
import { Sobreimpreso } from "@/components/ui/Sobreimpreso";
import { SALSA_INICIAL, salsas, type ColorSalsa } from "@/data/salsas";
import { pesos } from "@/lib/dinero";
import { cantidadDe } from "@/lib/pedido";

/** Fondo y tinta de cada tazón. Texto tortilla sobre oscuros y humo sobre habanero (contraste AA). */
const TEMA: Record<ColorSalsa, { fondo: string; texto: string; segunda: string; borde: string }> = {
  verde: { fondo: "bg-verde", texto: "text-tortilla", segunda: "text-limon", borde: "text-verde" },
  roja: { fondo: "bg-roja", texto: "text-tortilla", segunda: "text-humo", borde: "text-roja" },
  habanero: { fondo: "bg-habanero", texto: "text-humo", segunda: "text-roja", borde: "text-habanero" },
  morita: { fondo: "bg-morita", texto: "text-tortilla", segunda: "text-habanero", borde: "text-morita" },
  cebolla: { fondo: "bg-cebolla", texto: "text-tortilla", segunda: "text-humo", borde: "text-cebolla" },
};

// Posición irregular de cada tazón en la mesa (desplazamiento vertical y giro).
const MESA = ["translate-y-3 -rotate-6", "-translate-y-2 rotate-3", "translate-y-5 -rotate-2", "-translate-y-3 rotate-6", "translate-y-1 -rotate-3"];

/** E — El salsero: mesa vista desde arriba. Elegir una salsa repinta toda la sección. */
export function Salsero() {
  const [elegida, setElegida] = useState(SALSA_INICIAL);
  const { estado, despachar, anunciar } = usePedido();
  const salsa = salsas.find((s) => s.id === elegida) ?? salsas[0];
  const tema = TEMA[salsa.color];
  const enComanda = cantidadDe(estado.lineas, salsa.id);

  return (
    <section
      id="salsero"
      aria-labelledby="titulo-salsero"
      className={`grano relative overflow-x-clip transition-colors duration-500 ease-out ${tema.fondo} ${tema.texto} ${salsa.color === "habanero" ? "" : "grano-claro"}`}
    >
      <BordeTinta semilla={33} className={`${tema.borde} transition-colors duration-500`} />
      <div className="relative mx-auto max-w-[96rem] px-4 pb-16 pt-14 sm:px-6 lg:pb-24 lg:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="titulo-salsero" className="font-cartel text-rotulo uppercase">
            El salsero
          </h2>
          <p className="max-w-sm text-sm font-bold">Cinco tazones en cada mesa. Toca uno y te contamos qué trae, cuánto pica y con qué va.</p>
        </div>

        {/* La mesa: radios nativos = teclado con flechas incluido */}
        <fieldset className="mt-10">
          <legend className="texto-pantalla">Elige una salsa</legend>
          <div className="grid grid-cols-5 items-center gap-2 sm:gap-6 lg:gap-10">
            {salsas.map((s, i) => {
              const activa = s.id === salsa.id;
              return (
                <label key={s.id} className={`group relative flex flex-col items-center gap-2 ${MESA[i]}`}>
                  <input
                    type="radio"
                    name="salsa"
                    value={s.id}
                    checked={activa}
                    onChange={() => setElegida(s.id)}
                    className="peer texto-pantalla"
                  />
                  <span
                    className={`block w-full max-w-[11rem] rounded-full transition-transform duration-200 ease-out peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-4 peer-focus-visible:outline-limon group-hover:-translate-y-1 group-hover:rotate-3 ${activa ? "scale-110" : "scale-95 opacity-90"}`}
                  >
                    <Tazon color={s.color} className="block w-full" />
                  </span>
                  <span
                    className={`px-1.5 text-center text-xs font-bold uppercase tracking-[0.08em] sm:text-sm ${activa ? "bg-humo text-tortilla" : ""}`}
                  >
                    {s.corto}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Ficha de etiqueta */}
        <div aria-live="polite" className="mt-14 grid gap-10 border-t-[3px] border-current pt-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-sm font-bold uppercase tracking-[0.14em]">Salsa de la casa · tazón {salsas.indexOf(salsa) + 1} de 5</p>
            <h3 className="mt-3 font-cartel text-lona uppercase">
              <Sobreimpreso capa={tema.segunda} modo="debajo" x={5} y={4}>
                {salsa.nombre}
              </Sobreimpreso>
            </h3>
            <p className="mt-6 max-w-lg font-cartel text-letrero uppercase">“{salsa.chiste}”</p>
          </div>

          <div className="grid content-start gap-6 lg:col-span-5">
          <dl className="grid gap-6">
            <div>
              <dt className="text-sm font-bold uppercase tracking-[0.14em]">Picómetro</dt>
              <dd className="mt-2 flex items-center gap-3">
                <Chiles nivel={salsa.picor} de={5} tamano={`h-11 w-11 ${salsa.color === "verde" ? "text-roja" : "text-verde"}`} />
                <span className="font-cartel text-letrero">{salsa.picor}/5</span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold uppercase tracking-[0.14em]">Lleva</dt>
              <dd className="mt-1 text-lg">{salsa.ingredientes.join(", ")}.</dd>
            </div>
            <div>
              <dt className="text-sm font-bold uppercase tracking-[0.14em]">Va con</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {salsa.vaCon.map((v) => (
                  <span key={v} className="border-[3px] border-current px-2 py-0.5 font-bold">
                    {v}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  despachar({ tipo: "agregar", id: salsa.id });
                  anunciar(`Salsa ${salsa.corto.toLowerCase()} extra a la comanda. Llevas ${enComanda + 1}.`);
                }}
                className="min-h-12 border-[3px] border-humo bg-humo px-5 font-cartel uppercase text-tortilla shadow-[4px_4px_0_var(--color-tortilla)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Pedirla extra · {pesos(salsa.precioExtra)}
              </button>
              {enComanda > 0 && <span className="font-bold">Llevas {enComanda} de 120 ml</span>}
            </div>
          </div>
        </div>
        <NotaMarcador className="mt-10 rotate-[-3deg] text-base sm:ml-[40%]">si dudas entre dos, pide las dos</NotaMarcador>
      </div>
    </section>
  );
}
