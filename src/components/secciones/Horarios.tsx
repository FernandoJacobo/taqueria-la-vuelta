import { MapaBarrio } from "@/components/ilustraciones/MapaBarrio";
import { BordeTinta, NotaMarcador } from "@/components/ui/Piezas";
import { site } from "@/config/site";
import { reglasCasa } from "@/data/contenido";
import { formatoHora, NOMBRES_DIA } from "@/lib/horario";

// Semana empezando en lunes, como se lee en un letrero.
const ORDEN_SEMANA = [1, 2, 3, 4, 5, 6, 0];

/** I — Mapa protagonista con el letrero de horarios pegado encima. */
export function Horarios() {
  return (
    <section id="horarios" aria-labelledby="titulo-horarios" className="grano relative bg-tortilla text-humo">
      <BordeTinta semilla={88} className="text-tortilla" />
      <div className="relative mx-auto max-w-[96rem] px-4 pb-20 pt-14 sm:px-6 lg:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="titulo-horarios" className="font-cartel text-rotulo uppercase">
            Horarios y <span className="text-roja">cómo llegar</span>
          </h2>
          <address className="not-italic">
            <span className="block font-bold">
              {site.direccion.calle}, {site.direccion.colonia}
            </span>
            <span className="block text-sm">
              {site.direccion.ciudad}, {site.direccion.estado} · {site.direccion.referencia}
            </span>
          </address>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          {/* Mapa + letrero */}
          <div className="relative lg:col-span-8">
            <div className="border-[4px] border-humo shadow-tinta-lg">
              <MapaBarrio className="block h-auto w-full" />
            </div>
            <div className="relative -mt-6 ml-auto w-[min(100%,22rem)] -rotate-2 border-[4px] border-humo bg-humo p-5 text-tortilla shadow-[6px_6px_0_var(--color-roja)] sm:-mt-24 sm:mr-4 lg:absolute lg:-bottom-10 lg:-right-10 lg:mt-0">
              <h3 className="font-cartel text-letrero uppercase text-limon">Turnos</h3>
              <table className="mt-3 w-full text-sm">
                <caption className="texto-pantalla">Horario por día</caption>
                <tbody>
                  {ORDEN_SEMANA.map((d) => {
                    const t = site.horario[d];
                    return (
                      <tr key={d} className="border-b border-dashed border-tortilla/30 last:border-0">
                        <th scope="row" className="py-1.5 text-left font-bold">
                          {NOMBRES_DIA[d]}
                        </th>
                        <td className="py-1.5 text-right">{t ? `${formatoHora(t.abre)} – ${formatoHora(t.cierra)}` : "Descansamos"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-tortilla/85">El trompo prende a las {formatoHora(site.trompoPrende)}.</p>
            </div>
          </div>

          {/* Datos prácticos */}
          <div className="grid content-start gap-7 lg:col-span-4 lg:pl-6">
            <div>
              <h3 className="font-cartel uppercase">Espera promedio</h3>
              <p className="mt-1">
                <span className="font-cartel text-letrero">{site.espera.normal}</span>
                <span className="block text-sm">Hasta {site.espera.pico}.</span>
              </p>
              <NotaMarcador className="mt-2 -rotate-2 text-roja">a las 11 se llena</NotaMarcador>
            </div>
            <div>
              <h3 className="font-cartel uppercase">Estacionamiento</h3>
              <p className="mt-1 text-sm">{site.estacionamiento}</p>
            </div>
            <div>
              <h3 className="font-cartel uppercase">Formas de pago</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm font-bold">
                {site.pagos.map((p) => (
                  <li key={p} className="border-2 border-humo px-2 py-0.5">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-cartel uppercase">Reglas de la casa</h3>
              <ol className="mt-2 space-y-2 text-sm">
                {reglasCasa.map((r, i) => (
                  <li key={r} className="flex gap-3">
                    <span aria-hidden="true" className="font-cartel text-roja">
                      {i + 1}.
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
