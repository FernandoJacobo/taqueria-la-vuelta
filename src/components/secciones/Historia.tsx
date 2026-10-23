import { Icono } from "@/components/ilustraciones/Sprite";
import { BordeTinta, NotaMarcador } from "@/components/ui/Piezas";
import { Sobreimpreso } from "@/components/ui/Sobreimpreso";
import { site } from "@/config/site";
import { nuncaCambia, vueltas } from "@/data/contenido";

// Cada vuelta baja y se recorre a la derecha: una escalera.
const ESCALON = ["", "ml-[8%] xl:ml-[14%]", "ml-[16%] xl:ml-[28%]"];

/** G — Escalera de numerales: tres generaciones ("vueltas") y lo que nunca cambia. */
export function Historia() {
  return (
    <section id="historia" aria-labelledby="titulo-historia" className="grano grano-claro relative bg-morita text-tortilla">
      <BordeTinta semilla={57} className="text-morita" />
      <div className="relative mx-auto max-w-[96rem] px-4 pb-20 pt-14 sm:px-6 lg:pt-20">
        <h2 id="titulo-historia" className="max-w-4xl font-cartel text-rotulo uppercase">
          Desde {site.desde}, el trompo no se ha apagado
        </h2>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-limon">Historia ficticia, para el demo</p>

        <ol className="mt-12 space-y-12 xl:space-y-4">
          {vueltas.map((v, i) => (
            <li key={v.anio} className={`flex flex-col gap-3 xl:flex-row xl:items-end xl:gap-8 ${ESCALON[i]}`}>
              <Sobreimpreso
                as="p"
                capa="text-roja"
                modo="debajo"
                x={6}
                y={5}
                className="shrink-0 font-cartel text-[clamp(5rem,17vw,11rem)] leading-[0.8] text-habanero"
              >
                {v.anio}
              </Sobreimpreso>
              <div className="max-w-[17rem] border-l-[3px] border-tortilla pb-2 pl-4">
                <h3 className="font-cartel text-letrero uppercase">{v.titulo}</h3>
                <p className="mt-1">{v.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="font-cartel text-letrero uppercase">Lo que nunca cambiamos</h3>
            <Icono id="i-comal" className="mt-6 h-16 w-48" />
            <NotaMarcador className="mt-4 -rotate-3 text-limon">esto no se negocia</NotaMarcador>
          </div>
          <ol className="border-t-[3px] border-tortilla lg:col-span-8">
            {nuncaCambia.map((n, i) => (
              <li key={n.que} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-b-[3px] border-tortilla py-5 sm:grid-cols-[5rem_12rem_1fr]">
                <span aria-hidden="true" className="row-span-2 font-cartel text-5xl leading-none text-limon sm:row-span-1 sm:text-6xl">
                  {i + 1}
                </span>
                <h4 className="font-cartel uppercase sm:pt-2">{n.que}</h4>
                <p className="sm:pt-2">{n.como}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
